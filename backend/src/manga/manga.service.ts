import { AuthorService } from '@/author/author.service';
import { Author } from '@/author/schemas/author.schema';
import { Manga, MangaDocument } from '@/manga/schemas/manga.schema';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMangaDto } from '@shared/manga/dto/createManga.dto';
import { UpdateMangaDto } from '@shared/manga/dto/updateManga.dto';
import { Model, Types } from 'mongoose';

@Injectable()
export class MangaService {
  constructor(
    @InjectModel(Manga.name) private mangaModel: Model<Manga>,
    private authorService: AuthorService,
  ) {}

  async create({
    createMangaDto,
    authUserId,
  }: {
    createMangaDto: CreateMangaDto;
    authUserId: string;
  }) {
    const authors = await Promise.all(
      createMangaDto.authors.map((author) =>
        this.authorService.findOrCreate(author),
      ),
    );

    const created = new this.mangaModel<Manga>({
      ...createMangaDto,
      authors: authors.map((x) => x._id),
      owner: new Types.ObjectId(authUserId),
    });

    await created.save();
    return created.populate<{ authors: Author[] }>({
      path: 'authors',
      justOne: false,
    });
  }

  findAllForUser({ authUserId }: { authUserId: string }) {
    return this.mangaModel
      .find({ owner: authUserId })
      .populate<{ authors: Author[] }>({
        path: 'authors',
        justOne: false,
      })
      .exec();
  }

  async findOne({ id, authUserId }: { id: string; authUserId: string }) {
    const manga = await this.findAndAuthorize(id, authUserId, true);
    return await manga.populate<{ authors: Author[] }>({
      path: 'authors',
      justOne: false,
    });
  }

  async update({
    id,
    updateMangaDto,
    authUserId,
  }: {
    id: string;
    updateMangaDto: UpdateMangaDto;
    authUserId: string;
  }) {
    const manga = await this.findAndAuthorize(id, authUserId);

    const authors = await Promise.all(
      updateMangaDto.authors.map((author) =>
        this.authorService.findOrCreate(author),
      ),
    );

    const updated = new this.mangaModel<Manga>({
      owner: manga.owner,
      ...updateMangaDto,
      authors: authors.map((x) => x._id),
    });
    // Hacky
    updated._id = manga._id;
    updated.isNew = false;

    return (await updated.save()).populate<{ authors: Author[] }>({
      path: 'authors',
      justOne: false,
    });
  }

  async remove({ id, authUserId }: { id: string; authUserId: string }) {
    const manga = await this.findAndAuthorize(id, authUserId);
    await manga.deleteOne();
  }

  private async findAndAuthorize(
    id: string,
    authUserId: string,
    forGet: boolean = false,
  ): Promise<MangaDocument> {
    const manga = await this.mangaModel.findById(id);
    if (!manga) throw new NotFoundException();

    if (
      authUserId &&
      ![
        manga.owner.toString(),
        forGet ? manga.borrowed_to?.toString() : undefined,
      ].includes(authUserId)
    )
      throw new ForbiddenException();

    return manga;
  }
}
