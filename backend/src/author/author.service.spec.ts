import { Author, AuthorSchema } from '@/author/schemas/author.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuthorService } from './author.service';

describe('AuthorService', () => {
  let module: TestingModule;
  let service: AuthorService;
  let mongod: MongoMemoryServer;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: Author.name, schema: AuthorSchema },
        ]),
      ],
      providers: [AuthorService],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
  });

  afterEach(async () => {
    module.close();
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create', async () => {
    const author = await service.findOrCreate({
      key: 'key',
      name: 'name',
    });
    expect(author).toBeDefined();
    expect(author.key).toEqual('key');
    expect(author.name).toEqual('name');
  });
});
