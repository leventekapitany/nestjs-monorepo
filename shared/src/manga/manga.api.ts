import { AuthenticatedRequest } from '@shared/auth/auth.type';
import { CreateMangaDto } from '@shared/manga/dto/createManga.dto';
import { GetMangaDto } from '@shared/manga/dto/getManga.dto';
import { UpdateMangaDto } from '@shared/manga/dto/updateManga.dto';
import request from '@shared/request';

export interface MangaApiInterface {
  create(
    createMangaDto: CreateMangaDto,
    req: AuthenticatedRequest,
  ): Promise<GetMangaDto>;
  findOne(id: string, req: AuthenticatedRequest): Promise<GetMangaDto>;
  findAllForUser(req: AuthenticatedRequest): Promise<GetMangaDto[]>;
  update(
    updateMangaDto: UpdateMangaDto,
    id: string,
    req: AuthenticatedRequest,
  ): Promise<GetMangaDto>;
  remove(id: string, req: AuthenticatedRequest): Promise<void>;
}

const prefix = '/manga';

export function create(
  createMangaDto: Parameters<MangaApiInterface['create']>[0],
) {
  return request<GetMangaDto>({
    url: prefix,
    method: 'POST',
    data: createMangaDto,
  });
}

export function update(
  updateMangaDto: Parameters<MangaApiInterface['update']>[0],
  id: string,
) {
  return request<GetMangaDto>({
    url: `${prefix}/${id}`,
    method: 'PATCH',
    data: updateMangaDto,
  });
}

export function remove(id: string) {
  return request<void>({
    url: `${prefix}/${id}`,
    method: 'DELETE',
  });
}

export function findOne(id: string) {
  return request<GetMangaDto>({
    url: `${prefix}/${id}`,
    method: 'GET',
  });
}

export function findAllForUser() {
  return request<GetMangaDto[]>({
    url: prefix,
    method: 'GET',
  });
}
