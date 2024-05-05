import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { BookApiService } from './book-api.service';

describe('BookApiService', () => {
  let service: BookApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [BookApiService],
    }).compile();

    service = module.get<BookApiService>(BookApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
