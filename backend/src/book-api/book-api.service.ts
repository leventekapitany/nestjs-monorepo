import { physicalFormatStringToEnum } from '@/book-api/book-api.utils';
import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { GetAuthorDto } from '@shared/book-api/dto/getAuthorDto';
import { GetBookDto, getBookSchema } from '@shared/book-api/dto/getBookDto';
import {
  GetBookWithDetailsDto,
  getBookWithDetailsSchema,
} from '@shared/book-api/dto/getBookWithDetailsDto';
import { isAxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class BookApiService {
  constructor(private readonly httpService: HttpService) {}

  async findByISBN(isbn: string): Promise<GetBookWithDetailsDto> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<GetBookDto>(`https://openlibrary.org/isbn/${isbn}`)
        .pipe(
          catchError((error: unknown) => {
            if (isAxiosError(error)) {
              if (error.response?.status === 404) {
                throw new NotFoundException('Book not found');
              }

              throw new ServiceUnavailableException(
                'BOOK API Unavailable',
                error.message,
              );
            }

            throw new ServiceUnavailableException('Unexpected error');
          }),
        ),
    );
    try {
      const book = getBookSchema.parse(data);
      const authors = book.authors.map((author) => {
        return this.findAuthorByKey(author.key);
      });
      const detailedBook = getBookWithDetailsSchema.parse({
        ...book,
        covers: (book.covers || []).map(
          (cover) => `https://covers.openlibrary.org/b/id/${cover}-L.jpg`,
        ),
        authors: await Promise.all(
          authors.map((getAuthors) => getAuthors.then((author) => author)),
        ),
        physical_format: physicalFormatStringToEnum(book.physical_format),
      });
      return detailedBook;
    } catch (err) {
      throw new ServiceUnavailableException('Bad response');
    }
  }

  async findAuthorByKey(key: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<GetAuthorDto>(`https://openlibrary.org/${key}`).pipe(
        catchError((error: unknown) => {
          if (isAxiosError(error)) {
            if (error.response?.status === 404) {
              throw new NotFoundException('Author not found');
            }

            throw new ServiceUnavailableException(
              'BOOK API Unavailable',
              error.message,
            );
          }

          throw new ServiceUnavailableException('Unexpected error');
        }),
      ),
    );
    return data;
  }
}
