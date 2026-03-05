import { z } from 'zod';

export const ROLES = ['Developer', 'Designer', 'Founder', 'Marketer'] as const;

export const INTERESTS = [
  'Automation',
  'Analytics',
  'Collaboration',
  'Growth',
  'Integrations',
  'AI & ML',
  'Security',
  'Scaling',
] as const;

export const preferencesSchema = z.object({
  role: z.string().min(1, 'Please select a role'),
  interests: z
    .array(z.string())
    .min(1, 'Please select at least one interest'),
});

export type PreferencesFormValues = z.infer<typeof preferencesSchema>;
