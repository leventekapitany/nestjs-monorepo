import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { BookApiController } from './book-api.controller';
import { BookApiService } from './book-api.service';

/**
 * Module for getting metadata from books
 */
@Module({
  imports: [HttpModule],
  providers: [BookApiService],
  controllers: [BookApiController],
})
export class BookApiModule {}
