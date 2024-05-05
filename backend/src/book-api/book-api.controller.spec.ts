import { BookApiService } from '@/book-api/book-api.service';
import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { BookApiController } from './book-api.controller';

describe('BookApiController', () => {
  let controller: BookApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [BookApiService],
      controllers: [BookApiController],
    }).compile();

    controller = module.get<BookApiController>(BookApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
