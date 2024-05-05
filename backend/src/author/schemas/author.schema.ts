import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthorDocument = HydratedDocument<Author>;

@Schema({ strict: true })
export class Author {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  bio?: string;

  @Prop()
  personal_name?: string;

  @Prop()
  birth_date?: string;

  @Prop()
  death_date?: string;

  @Prop()
  photos?: string[];
}
export const AuthorSchema = SchemaFactory.createForClass(Author);
