import { AuthorDto } from '@shared/book-api/dto/authorDto';
import { GetAuthorDto } from '@shared/book-api/dto/getAuthorDto';
import { GetBookWithDetailsDto } from '@shared/book-api/dto/getBookWithDetailsDto';
import { IsbnDto } from '@shared/book-api/dto/isbnDto';
import request from '@shared/request';

export interface BookApiInterface {
  findByISBN(params: IsbnDto): Promise<GetBookWithDetailsDto>;
  findAuthorByKey(params: AuthorDto): Promise<GetAuthorDto>;
}

export function findByISBN(
  params: Parameters<BookApiInterface['findByISBN']>[0],
) {
  return request<GetBookWithDetailsDto>({
    url: `/book-api/${params.isbn}`,
    method: 'GET',
  });
}

export function findAuthorByKey(
  params: Parameters<BookApiInterface['findAuthorByKey']>[0],
) {
  return request<GetAuthorDto>({
    url: `/book-api/${params.key}`, // key is a "author/:key" string
    method: 'GET',
  });
}
