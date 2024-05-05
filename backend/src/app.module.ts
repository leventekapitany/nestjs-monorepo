import configuration from '@/config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BookApiModule } from './book-api/book-api.module';
import { getDataBaseConfig } from './config/database';
import { MangaModule } from './manga/manga.module';
import { UsersModule } from './users/users.module';
import { AuthorModule } from './author/author.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): MongooseModuleOptions => {
        const databaseConfig = getDataBaseConfig(configService);
        if (!databaseConfig) throw new Error('Database config missing');

        return databaseConfig;
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    BookApiModule,
    MangaModule,
    AuthorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
