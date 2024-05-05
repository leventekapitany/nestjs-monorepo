import { AuthenticatedRequest } from '@shared/auth/auth.type';
import { AccessTokenDto } from '@shared/auth/dto/accessTokenDto';
import { ProfileDto } from '@shared/auth/dto/profileDto';
import { SignInDto } from '@shared/auth/dto/signInDto';
import request from '@shared/request';
import { Request, Response } from 'express';

export interface AuthInterface {
  signIn(signInDto: SignInDto, res: Response): Promise<AccessTokenDto>;
  refresh(req: Request, res: Response): Promise<AccessTokenDto>;
  getProfile(req: AuthenticatedRequest): Promise<ProfileDto>;
}

export function signIn(signInDto: Parameters<AuthInterface['signIn']>[0]) {
  return request<AccessTokenDto>({
    url: '/auth/login',
    method: 'POST',
    data: signInDto,
  });
}

export function refresh() {
  return request<AccessTokenDto>({
    url: '/auth/refresh',
    method: 'POST',
    withoutResponseInterceptor: true,
  });
}

export function getProfile() {
  return request<ProfileDto>({
    url: '/auth/profile',
    method: 'GET',
  });
}
