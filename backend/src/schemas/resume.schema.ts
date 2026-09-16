import { z } from 'zod';

export const uploadSchema = z.object({
  body: z.object({
    companyName: z.string().optional(),
    jobTitle: z.string().optional(),
    jobDescription: z.string().optional(),
  }),
});
