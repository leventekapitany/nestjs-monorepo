import { AuthorModule } from '@/author/author.module';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MangaController } from './manga.controller';
import { MangaService } from './manga.service';
import { Manga, MangaSchema } from './schemas/manga.schema';
import { MangaSeeder } from './seeders/manga.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Manga.name, schema: MangaSchema }]),
    UsersModule,
    AuthorModule,
  ],
  controllers: [MangaController],
  providers: [MangaSeeder, MangaService],
})
export class MangaModule {}
