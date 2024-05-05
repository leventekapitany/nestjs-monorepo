import { User, UserSchema } from '@/users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let module: TestingModule;
  let uri: string;
  let connection: typeof mongoose;
  let service: UsersService;
  let mongod: MongoMemoryServer;

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
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
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
    expect(service).toBeDefined();
  });
});
