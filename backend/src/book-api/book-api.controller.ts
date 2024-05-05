import { ZodValidationPipe } from '@/zod-validation-pipe/zod-validation-pipe.pipe';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UsePipes,
} from '@nestjs/common';
import { BookApiInterface } from '@shared/book-api/book-api.api';
import { authorSchema } from '@shared/book-api/dto/authorDto';
import { isbnSchema } from '@shared/book-api/dto/isbnDto';
import { BookApiService } from './book-api.service';

@Controller('book-api')
export class BookApiController implements BookApiInterface {
  constructor(private readonly bookApiService: BookApiService) {}

  @HttpCode(HttpStatus.OK)
  @Get(':isbn')
  @UsePipes(new ZodValidationPipe(isbnSchema))
  findByISBN(@Param() params: Parameters<BookApiInterface['findByISBN']>[0]) {
    return this.bookApiService.findByISBN(params.isbn);
  }

  @HttpCode(HttpStatus.OK)
  @Get('author/:key')
  @UsePipes(new ZodValidationPipe(authorSchema))
  findAuthorByKey(
    @Param() params: Parameters<BookApiInterface['findAuthorByKey']>[0],
  ) {
    return this.bookApiService.findAuthorByKey(params.key);
  }
}
