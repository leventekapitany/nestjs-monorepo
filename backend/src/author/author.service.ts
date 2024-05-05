import { Author } from '@/author/schemas/author.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAuthorDto } from '@shared/author/dto/createAuthor.dto';
import { Model } from 'mongoose';

@Injectable()
export class AuthorService {
  constructor(@InjectModel(Author.name) private authorModel: Model<Author>) {}

  async findOrCreate(author: CreateAuthorDto) {
    const found = await this.authorModel.findOne({ key: author.key }).exec();
    if (found) return found;
    const newAuthor = new this.authorModel(author);
    return newAuthor.save();
  }

  findByKey(key: string) {
    return this.authorModel.findById({ key }).exec();
  }
}
