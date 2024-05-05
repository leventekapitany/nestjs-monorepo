import { AuthorModule } from '@/author/author.module';
import { Manga, MangaSchema } from '@/manga/schemas/manga.schema';
import { UserDocument } from '@/users/schemas/user.schema';
import { UsersModule } from '@/users/users.module';
import { UsersService } from '@/users/users.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Language, Status } from '@shared/manga/manga.enum';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Types } from 'mongoose';
import { MangaService } from './manga.service';

const MatyiElete = {
  title: 'Matyi élete',
  isbn_13: '9781421597084',
  volume: '1-3',
  status: Status.OWNED,
  number_of_pages: 15,
  publishers: ['Kádas corporation'],
  publish_date: '2024.03.10',
  languages: [Language.ENGLISH],
  authors: [
    {
      key: 'cigany',
      name: 'cigany endre',
    },
  ],
};

const MatyiElete2 = {
  ...MatyiElete,
  title: 'Matyi élete 2',
  notes: 'Jegyzet',
  isbn_13: '9781421597085',
};

const MatyiElete3 = {
  ...MatyiElete,
  title: 'Matyi élete 3',
  isbn_13: '9781421597086',
};

describe('MangaService', () => {
  let module: TestingModule;
  let uri: string;
  let connection: typeof mongoose;
  let service: MangaService;
  let mongod: MongoMemoryServer;

  let myUser: UserDocument;
  let borrowedToUser: UserDocument;
  let hackerUser: UserDocument;

  let myManga: Awaited<ReturnType<typeof service.create>>;
  let myBorrowedManga: Awaited<ReturnType<typeof service.create>>;
  let notMyManga: Awaited<ReturnType<typeof service.create>>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
    connection = await mongoose.connect(uri);
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: Manga.name, schema: MangaSchema }]),
        AuthorModule,
        UsersModule,
      ],
      providers: [MangaService],
    }).compile();

    service = module.get<MangaService>(MangaService);
    const usersService = module.get<UsersService>(UsersService);
    myUser = await usersService.create({
      username: 'test',
      password: 'test',
    });
    borrowedToUser = await usersService.create({
      username: 'borrowedTo',
      password: 'test',
    });
    hackerUser = await usersService.create({
      username: 'hacker',
      password: 'test',
    });

    myManga = await service.create({
      createMangaDto: MatyiElete,
      authUserId: myUser._id.toString(),
    });

    myBorrowedManga = await service.create({
      createMangaDto: {
        ...MatyiElete2,
        borrowed_to: borrowedToUser._id,
        status: Status.BORROWED,
      },
      authUserId: myUser.id,
    });

    notMyManga = await service.create({
      createMangaDto: MatyiElete3,
      authUserId: borrowedToUser._id.toString(),
    });
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

  describe('create', () => {
    it('should create', async () => {
      const created = await service.create({
        createMangaDto: {
          title: 'Matyi élete',
          isbn_13: '9781421597084',
          volume: '1-3',
          status: Status.OWNED,
          number_of_pages: 15,
          publishers: ['Kádas corporation'],
          publish_date: '2024.03.10',
          languages: [Language.ENGLISH],
          authors: [
            {
              key: 'cigany',
              name: 'cigany endre',
            },
          ],
        },
        authUserId: myUser.id,
      });
      expect(created).toBeDefined();
      expect(created.title).toBe('Matyi élete');
      expect(created.id).toBeTruthy();
    });
  });

  describe('findOne', () => {
    it('should find one', async () => {
      const found = await service.findOne({
        id: myManga.id,
        authUserId: myUser.id,
      });
      expect(found).toBeDefined();
      expect(found.title).toBe(myManga.title);
      expect(found.id).toBe(myManga.id);
    });

    it('should find one (borrowed)', async () => {
      const found = await service.findOne({
        id: myBorrowedManga.id,
        authUserId: borrowedToUser.id,
      });
      expect(found).toBeDefined();
      expect(found.title).toBe(myBorrowedManga.title);
      expect(found.id).toBe(myBorrowedManga.id);
    });

    it('should throw forbidden exception for not my manga', async () => {
      await expect(
        service.findOne({ id: notMyManga.id, authUserId: myUser.id }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw not found exception for invalid id', async () => {
      await expect(
        service.findOne({
          id: new Types.ObjectId().toString(),
          authUserId: myUser.id,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update', async () => {
      const updated = await service.update({
        id: myManga.id,
        updateMangaDto: {
          ...MatyiElete2,
          id: myManga.id,
        },
        authUserId: myUser.id,
      });
      expect(updated).toBeDefined();
      expect(updated.title).toBe('Matyi élete 2');
      expect(updated.id).toBe(myManga.id);
      expect(updated.isbn_13).toBe(MatyiElete2.isbn_13);
      expect(updated.notes).toBe(MatyiElete2.notes);
    });

    it('should remove undefined properties', async () => {
      const updated = await service.update({
        id: myManga.id,
        updateMangaDto: {
          ...MatyiElete2,
          id: myManga.id,
          notes: undefined,
        },
        authUserId: myUser.id,
      });
      expect(updated.notes).toBeUndefined();
    });

    it('should change authors', async () => {
      const updated = await service.update({
        id: myManga.id,
        updateMangaDto: {
          ...MatyiElete2,
          id: myManga.id,
          authors: [
            {
              key: 'cigany_fia',
              name: 'cigany endre fija',
            },
          ],
        },
        authUserId: myUser.id,
      });
      expect(updated.authors.length).toBe(1);
      expect(updated.authors[0].key).toBe('cigany_fia');
      expect(updated.authors[0].name).toBe('cigany endre fija');
    });

    it('should add new authors', async () => {
      const updated = await service.update({
        id: myManga.id,
        updateMangaDto: {
          ...MatyiElete2,
          id: myManga.id,
          authors: [
            ...MatyiElete2.authors,
            {
              key: 'cigany_fia',
              name: 'cigany endre fija',
            },
          ],
        },
        authUserId: myUser.id,
      });
      expect(updated.authors.length).toBe(2);
      expect(updated.authors[0].key).toBe('cigany');
      expect(updated.authors[1].key).toBe('cigany_fia');
    });

    it('should throw forbidden exception for not my manga', async () => {
      await expect(
        service.update({
          id: notMyManga.id,
          updateMangaDto: { ...MatyiElete2, id: notMyManga.id },
          authUserId: myUser.id,
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw forbidden exception for borrowed manga', async () => {
      await expect(
        service.update({
          id: myBorrowedManga.id,
          updateMangaDto: { ...MatyiElete2, id: myBorrowedManga.id },
          authUserId: borrowedToUser.id,
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw not found exception for invalid id', async () => {
      await expect(
        service.update({
          id: new Types.ObjectId().toString(),
          updateMangaDto: {
            ...MatyiElete2,
            id: new Types.ObjectId().toString(),
          },
          authUserId: myUser.id,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
