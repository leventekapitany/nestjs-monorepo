import { AuthService } from '@/auth/auth.service';
import { User, UserSchema } from '@/users/schemas/user.schema';
import { UsersModule } from '@/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let module: TestingModule;
  let uri: string;
  let connection: typeof mongoose;
  let mongod: MongoMemoryServer;

  let authGuard: AuthGuard;
  let reflector: Reflector;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
    connection = await mongoose.connect(uri);
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        UsersModule,
        JwtModule.register({}),
        ConfigModule.forRoot({}),
      ],
      providers: [AuthService],
    }).compile();

    const jwtService = module.get<JwtService>(JwtService);
    const configService = module.get<ConfigService>(ConfigService);
    reflector = new Reflector();
    authGuard = new AuthGuard(jwtService, configService, reflector);
  });

  afterEach(async () => {
    const collections = connection.connection.collections;
    await Promise.all(
      Object.values(collections).map(
        (collection) => collection.deleteMany({}), // an empty mongodb selector object ({}) must be passed as the filter argument
      ),
    );
    await module.close();
  });

  afterAll(async () => {
    await connection.disconnect();
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });
});
