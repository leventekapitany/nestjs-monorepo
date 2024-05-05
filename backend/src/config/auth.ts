import { ConfigService } from '@nestjs/config';

export interface AuthConfig {
  jwtSecret?: string;
  appKey?: string;
}

export default (): AuthConfig => ({
  jwtSecret: process.env.JWT_SECRET,
  appKey: process.env.APP_KEY,
});

export const getAuthConfig = (configService: ConfigService) =>
  configService.get<AuthConfig>('auth');
