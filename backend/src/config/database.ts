import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export default (): MongooseModuleOptions => ({
  //host: process.env.DATABASE_HOST,
  //port: parseInt(process.env.DATABASE_PORT!, 10) || 5432,
  uri: process.env.DATABASE_URL,
});

export const getDataBaseConfig = (configService: ConfigService) =>
  configService.get<MongooseModuleOptions>('database');
