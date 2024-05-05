import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatedRequest } from '@shared/auth/auth.type';
import { CreateMangaDto } from '@shared/manga/dto/createManga.dto';
import { Status } from '@shared/manga/manga.enum';
import { MangaController } from './manga.controller';
import { MangaService } from './manga.service';

describe('MangaController', () => {
  let module: TestingModule;
  let controller: MangaController;
  let service: MangaService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [MangaController],
      providers: [
        {
          provide: MangaService,
          useValue: {
            create: jest.fn(),
            findAllForUser: jest.fn().mockResolvedValue([]),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MangaController>(MangaController);
    service = module.get<MangaService>(MangaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service with correct data', async () => {
      const createMangaDto: CreateMangaDto = {
        authors: [],
        title: 'name',
        isbn_10: '1234',
        isbn_13: '1234',
        number_of_pages: 1,
        languages: [],
        status: Status.OWNED,
        publish_date: '2022-01-01',
        publishers: [],
        volume: '1',
      };
      const req = { user: { userId: 'userId' } } as AuthenticatedRequest;

      await controller.create(createMangaDto, req).catch(() => {});
      expect(service.create).toHaveBeenCalledWith({
        createMangaDto,
        authUserId: req.user.userId,
      });
    });
  });

  describe('findAllForUser', () => {
    it('should call service with correct data', async () => {
      const req = { user: { userId: 'userId' } } as AuthenticatedRequest;

      await controller.findAllForUser(req);
      expect(service.findAllForUser).toHaveBeenCalledWith({
        authUserId: req.user.userId,
      });
    });
  });
});
