import { z } from 'zod';
import { ZodValidationPipe } from './zod-validation-pipe.pipe';

describe('ZodValidationPipePipe', () => {
  it('should be defined', () => {
    const testSchema = z.object({});

    expect(new ZodValidationPipe(testSchema)).toBeDefined();
  });
});
