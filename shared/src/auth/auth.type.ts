import { AccessTokenPayloadDto } from '@shared/auth/dto/accesTokenPayloadDto';
import { Request } from 'express';

export type AuthenticatedRequest = Request & {
  user: AccessTokenPayloadDto;
};
