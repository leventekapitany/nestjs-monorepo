import { ZodValidationPipe } from '@/zod-validation-pipe/zod-validation-pipe.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UsePipes,
} from '@nestjs/common';
import { AuthenticatedRequest } from '@shared/auth/auth.type';
import {
  CreateMangaDto,
  createMangaSchema,
} from '@shared/manga/dto/createManga.dto';
import { getMangaSchema } from '@shared/manga/dto/getManga.dto';
import {
  UpdateMangaDto,
  updateMangaSchema,
} from '@shared/manga/dto/updateManga.dto';
import { MangaApiInterface } from '@shared/manga/manga.api';
import { MangaService } from './manga.service';

@Controller('manga')
export class MangaController implements MangaApiInterface {
  constructor(private readonly mangaService: MangaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createMangaSchema))
  async create(
    @Body() createMangaDto: CreateMangaDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return getMangaSchema.parse(
      await this.mangaService.create({
        createMangaDto,
        authUserId: req.user.userId,
      }),
    );
  }

  @Get()
  async findAllForUser(@Request() req: AuthenticatedRequest) {
    // TODO: paginate
    // TODO: getListDto and select only neccessary fields
    // TODO: filter, sort
    const res = await this.mangaService.findAllForUser({
      authUserId: req.user.userId,
    });

    return res.map((manga) => getMangaSchema.parse(manga));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const manga = await this.mangaService.findOne({
      id,
      authUserId: req.user.userId,
    });
    getMangaSchema.parse(manga, {});
    return getMangaSchema.parse(manga);
  }

  @Patch(':id')
  async update(
    @Body(new ZodValidationPipe(updateMangaSchema))
    updateMangaDto: UpdateMangaDto,
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return getMangaSchema.parse(
      await this.mangaService.update({
        id,
        updateMangaDto,
        authUserId: req.user.userId,
      }),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.mangaService.remove({ id, authUserId: req.user.userId });
  }
}
