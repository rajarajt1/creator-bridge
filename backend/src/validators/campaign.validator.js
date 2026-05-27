import { z } from 'zod';

const CATEGORIES = [
  'tech', 'fashion', 'food', 'travel', 'fitness',
  'gaming', 'beauty', 'education', 'lifestyle',
  'finance', 'entertainment', 'other',
];

const PLATFORMS = ['instagram', 'youtube', 'twitter', 'tiktok'];
const CONTENT_TYPES = ['post', 'story', 'reel', 'video', 'review'];

// Transform an ISO date string into a Date and reject past dates
const futureDateString = z
  .string({ required_error: 'Deadline is required' })
  .transform((val, ctx) => {
    const date = new Date(val);
    if (isNaN(date.getTime())) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid date format' });
      return z.NEVER;
    }
    if (date <= new Date()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Deadline must be in the future' });
      return z.NEVER;
    }
    return date;
  });

export const createCampaignSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  category: z.enum(CATEGORIES, {
    required_error: 'Category is required',
    invalid_type_error: 'Invalid category',
  }),
  requirements: z
    .object({
      minFollowers: z.number().nonnegative().optional(),
      platforms: z
        .array(z.enum(PLATFORMS, { invalid_type_error: 'Invalid platform' }))
        .optional(),
      contentType: z
        .array(z.enum(CONTENT_TYPES, { invalid_type_error: 'Invalid content type' }))
        .optional(),
      location: z.string().optional(),
    })
    .optional(),
  budget: z.object({
    type: z.enum(['fixed', 'negotiable', 'product-based'], {
      required_error: 'Budget type is required',
      invalid_type_error: "Budget type must be 'fixed', 'negotiable', or 'product-based'",
    }),
    amount: z.number().nonnegative().optional(),
    currency: z.string().default('INR'),
  }),
  deadline: futureDateString,
  tags: z
    .array(z.string().trim())
    .max(10, 'Cannot add more than 10 tags')
    .optional(),
});

export const updateCampaignSchema = createCampaignSchema
  .partial()
  .extend({
    status: z
      .enum(['draft', 'active', 'paused', 'completed', 'cancelled'], {
        invalid_type_error: 'Invalid status value',
      })
      .optional(),
  });
