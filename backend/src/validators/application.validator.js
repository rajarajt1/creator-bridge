import { z } from 'zod';

export const applySchema = z.object({
  campaignId: z
    .string({ required_error: 'Campaign ID is required' })
    .refine((val) => /^[a-f\d]{24}$/i.test(val), { message: 'Invalid campaign ID' }),
  coverLetter: z
    .string({ required_error: 'Cover letter is required' })
    .min(50, 'Cover letter must be at least 50 characters')
    .max(1000, 'Cover letter cannot exceed 1000 characters'),
  proposedRate: z
    .number()
    .positive('Proposed rate must be a positive number')
    .optional(),
});
