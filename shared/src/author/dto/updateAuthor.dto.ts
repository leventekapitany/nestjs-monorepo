import { z } from 'zod';
import { createAuthorSchema } from './createAuthor.dto';

export const updateAuthorSchema = createAuthorSchema.extend({
  id: z.string(),
});

export type UpdateAuthorDto = z.infer<typeof updateAuthorSchema>;
