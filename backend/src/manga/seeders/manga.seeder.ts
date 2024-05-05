import { AuthorService } from '@/author/author.service';
import { User } from '@/users/schemas/user.schema';
import { UsersService } from '@/users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAuthorDto } from '@shared/author/dto/createAuthor.dto';
import { CreateMangaDto } from '@shared/manga/dto/createManga.dto';
import { Language, PHYSICAL_FORMAT, Status } from '@shared/manga/manga.enum';
import { MergeTypes } from '@shared/utility';
import { Model } from 'mongoose';
import { Command, CommandRunner } from 'nest-commander';
import { Manga } from '../schemas/manga.schema';

@Command({ name: 'seed:manga', description: 'Add some mock manga' })
export class MangaSeeder extends CommandRunner {
  constructor(
    @InjectModel(Manga.name) private mangaModel: Model<Manga>,
    private usersService: UsersService,
    private authorService: AuthorService,
  ) {
    super();
  }

  async run(passedParam: string[]): Promise<void> {
    const userName = passedParam?.[0];

    const user = await this.usersService.findOne(userName);
    if (!user) throw new Error('User not found');
    const authors: Array<CreateAuthorDto> = [
      {
        name: 'Masashi Kishimoto',
        key: 'm_kishimoto',
        bio: 'Masashi Kishimoto is a Japanese manga author and manga artist. Kishimoto is best known for his work on the manga Naruto.',
      },
      {
        name: 'Tsugumi Ohba',
        key: 't_ohba',
        bio: 'Tsugumi Ohba is a Japanese manga author and artist.',
      },
      {
        name: 'Kentaro Miura',
        key: 'k_miura',
        bio: 'Kentaro Miura (三浦 建太郎, Miura Kentarō, July 11, 1966 – May 6, 2021) was a Japanese manga artist and author.',
      },
      {
        name: 'Hiromu Arakawa',
        key: 'h_arakawa',
        bio: 'Hiromu Arakawa is a Japanese manga artist. She is best known for the manga Fullmetal Alchemist, which became a hit both domestically and internationally, and was adapted into two anime television series.',
      },
    ];

    const authorsCreated = await Promise.all(
      authors.map(
        async (authorSource) =>
          await this.authorService.findOrCreate(authorSource),
      ),
    );

    const Kishimoto = authorsCreated.find((x) => x.key == 'm_kishimoto')!.id;
    const Ohba = authorsCreated.find((x) => x.key === 't_ohba')!.id;
    const Miura = authorsCreated.find((x) => x.key === 'k_miura')!.id;
    const Arakawa = authorsCreated.find((x) => x.key === 'h_arakawa')!.id;

    const mangas: Array<MergeTypes<CreateMangaDto, { owner: User }>> = [
      {
        title: 'Naruto',
        isbn_13: '9781421597082',
        volume: '1-3',
        languages: [Language.ENGLISH],
        status: Status.OWNED,
        owner: user,
        authors: [Kishimoto, Ohba],
        publishers: ['Viz Media'],
        covers: ['https://covers.openlibrary.org/b/id/813899-L.jpg'],
        number_of_pages: 192,
        publish_date: 'August 6, 2003',
        weight: '7 ounces',
        physical_format: PHYSICAL_FORMAT.PAPERBACK,
      },
      {
        title: 'Naruto',
        isbn_10: '4088728408',
        volume: '1',
        languages: [Language.JAPANESE],
        status: Status.OWNED,
        owner: user,
        authors: [Kishimoto],
        publishers: ['Viz Media'],
        covers: ['https://covers.openlibrary.org/b/id/1041545-L.jpg'],
        number_of_pages: 187,
        publish_date: 'March 1, 2000',
        weight: '1.4 ounces',
        physical_format: PHYSICAL_FORMAT.PAPERBACK,
      },
      {
        title: 'Death Note',
        isbn_13: '9789639794122',
        volume: '1',
        languages: [Language.HUNGARIAN],
        status: Status.OWNED,
        owner: user,
        authors: [Ohba],
        publishers: ['Mangafan'],
        covers: ['https://covers.openlibrary.org/b/id/8745664-L.jpg'],
        number_of_pages: 396,
        publish_date: '2011',
        physical_format: PHYSICAL_FORMAT.PAPERBACK,
      },
      {
        title: 'Boruto',
        isbn_13: '9781974729678',
        volume: '14',
        languages: [Language.ENGLISH],
        status: Status.ORDERED,
        owner: user,
        authors: [Kishimoto],
        publishers: ['Viz Media'],
        covers: ['https://covers.openlibrary.org/b/id/12385565-L.jpg'],
        number_of_pages: 176,
        publish_date: 'May 03, 2022',
        physical_format: PHYSICAL_FORMAT.PAPERBACK,
      },
      {
        title: 'Berserk Deluxe Volume 1',
        isbn_13: '9781506711980',
        volume: '1',
        languages: [Language.ENGLISH],
        status: Status.ENQUIRY,
        owner: user,
        authors: [Miura],
        publishers: ['Dark Horse Manga'],
        covers: ['https://covers.openlibrary.org/b/id/8746964-L.jpg'],
        number_of_pages: 696,
        publish_date: 'Mar 26, 2019',
        physical_format: PHYSICAL_FORMAT.HARDCOVER,
      },
      {
        title: 'Fullmetal Alchemist',
        isbn_13: '9781421599779',
        volume: '1',
        languages: [Language.ENGLISH],
        status: Status.BORROWED,
        owner: user,
        authors: [Arakawa],
        publishers: ['VIZ Media LLC'],
        covers: ['https://covers.openlibrary.org/b/id/8843224-L.jpg'],
        number_of_pages: 280,
        publish_date: 'May 08, 2018',
        physical_format: PHYSICAL_FORMAT.HARDCOVER,
      },
    ];

    await Promise.all(
      mangas.map((mangaSource) => {
        const manga = new this.mangaModel(mangaSource);
        return manga.save();
      }),
    );
  }
}
