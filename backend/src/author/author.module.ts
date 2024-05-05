import { Author, AuthorSchema } from '@/author/schemas/author.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorService } from './author.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
  ],
  providers: [AuthorService],
  exports: [AuthorService],
})
export class AuthorModule {}
