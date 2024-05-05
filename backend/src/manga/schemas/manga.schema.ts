import { Author } from '@/author/schemas/author.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Language, PHYSICAL_FORMAT, Status } from '@shared/manga/manga.enum';
import mongoose, { HydratedDocument } from 'mongoose';

export type MangaDocument = HydratedDocument<Manga>;

@Schema({ strict: true })
export class Manga {
  @Prop({ required: true })
  title: string;

  @Prop()
  isbn_10?: string;

  @Prop()
  isbn_13?: string;

  @Prop()
  publishers?: string[];

  @Prop({
    type: mongoose.Types.DocumentArray<Author>,
    ref: 'Author',
    required: true,
  })
  authors: mongoose.Types.ObjectId[];

  @Prop()
  covers?: string[];

  @Prop()
  publish_date?: string;

  @Prop()
  weight?: string;

  @Prop()
  number_of_pages?: number;

  @Prop()
  physical_format?: PHYSICAL_FORMAT;

  @Prop()
  notes?: string;

  @Prop() // Userinput or from api, maybe number
  volume?: string;

  @Prop({ required: true, default: [Language.ENGLISH] })
  languages: Language[];

  @Prop({ required: true, default: Status.OWNED })
  status: Status;

  @Prop()
  comment?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  borrowed_to?: mongoose.Types.ObjectId;
}
export const MangaSchema = SchemaFactory.createForClass(Manga);
