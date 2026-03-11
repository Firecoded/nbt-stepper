import { z } from 'zod';

export const INDUSTRIES = [
  'Technology',
  'Finance & Banking',
  'Healthcare',
  'Retail & E-commerce',
  'Media & Entertainment',
  'Education',
  'Real Estate',
  'Other',
] as const;

export const businessDetailsSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(100),
  industry: z.enum(INDUSTRIES, { error: 'Please select an industry' }),
});

export type BusinessDetailsFormValues = z.infer<typeof businessDetailsSchema>;
