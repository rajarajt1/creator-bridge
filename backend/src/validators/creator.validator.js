import { z } from 'zod';

const NICHES = [
  'tech', 'fashion', 'food', 'travel', 'fitness',
  'gaming', 'beauty', 'education', 'lifestyle',
  'finance', 'entertainment', 'other',
];

const socialPlatformSchema = z
  .object({
    instagram: z
      .object({
        handle: z.string().optional(),
        followers: z.number().nonnegative().optional(),
        engagementRate: z.number().nonnegative().optional(),
        profileUrl: z.string().url('Invalid Instagram URL').optional(),
      })
      .optional(),
    youtube: z
      .object({
        channelName: z.string().optional(),
        subscribers: z.number().nonnegative().optional(),
        avgViews: z.number().nonnegative().optional(),
        channelUrl: z.string().url('Invalid YouTube URL').optional(),
      })
      .optional(),
    twitter: z
      .object({
        handle: z.string().optional(),
        followers: z.number().nonnegative().optional(),
        profileUrl: z.string().url('Invalid Twitter URL').optional(),
      })
      .optional(),
    tiktok: z
      .object({
        handle: z.string().optional(),
        followers: z.number().nonnegative().optional(),
        profileUrl: z.string().url('Invalid TikTok URL').optional(),
      })
      .optional(),
  })
  .optional();

export const creatorProfileSchema = z.object({
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  niche: z
    .array(z.enum(NICHES, { invalid_type_error: 'Invalid niche value' }))
    .min(1, 'Select at least one niche')
    .optional(),
  location: z.string().optional(),
  socialMedia: socialPlatformSchema,
  pricing: z
    .object({
      postRate: z.number().nonnegative().optional(),
      storyRate: z.number().nonnegative().optional(),
      videoRate: z.number().nonnegative().optional(),
    })
    .optional(),
  availability: z.boolean().optional(),
});
