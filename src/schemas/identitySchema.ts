import { z } from 'zod';

export const identitySchema = z.object({
  avatarId: z.string().min(1, 'Please select an avatar'),
  screenName: z
    .string()
    .min(3, 'Screen name must be at least 3 characters')
    .max(20, 'Screen name must be 20 characters or less')
    .regex(/^[a-zA-Z0-9]+$/, 'Only letters and numbers allowed'),
});

export type IdentityFormValues = z.infer<typeof identitySchema>;
