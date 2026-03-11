import { describe, it, expect } from 'vitest';
import { businessDetailsSchema, INDUSTRIES } from './businessDetailsSchema';

describe('businessDetailsSchema', () => {
  const valid = { companyName: 'Acme Corp', industry: INDUSTRIES[0] };

  it('accepts a fully valid input', () => {
    expect(businessDetailsSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts every value in the INDUSTRIES list', () => {
    for (const industry of INDUSTRIES) {
      expect(businessDetailsSchema.safeParse({ ...valid, industry }).success).toBe(true);
    }
  });

  it('rejects an empty company name', () => {
    const result = businessDetailsSchema.safeParse({ ...valid, companyName: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === 'companyName')).toBe(true);
    }
  });

  it('rejects a company name over 100 characters', () => {
    const result = businessDetailsSchema.safeParse({ ...valid, companyName: 'A'.repeat(101) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === 'companyName')).toBe(true);
    }
  });

  it('rejects an industry value not in the allowed list', () => {
    const result = businessDetailsSchema.safeParse({ ...valid, industry: 'Underwater Basket Weaving' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === 'industry')).toBe(true);
    }
  });

  it('rejects a missing industry', () => {
    const result = businessDetailsSchema.safeParse({ companyName: 'Acme Corp' });
    expect(result.success).toBe(false);
  });
});
