import { describe, it, expect } from 'vitest';
import { profileSchema } from './profileSchema';

describe('profileSchema', () => {
  const valid = { firstName: 'Alex', lastName: 'Smith', email: 'alex@example.com' };

  it('accepts a fully valid input', () => {
    expect(profileSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects an empty first name', () => {
    const result = profileSchema.safeParse({ ...valid, firstName: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path[0] === 'firstName')).toBe(true);
    }
  });

  it('rejects an empty last name', () => {
    const result = profileSchema.safeParse({ ...valid, lastName: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path[0] === 'lastName')).toBe(true);
    }
  });

  it('rejects a missing email', () => {
    const result = profileSchema.safeParse({ ...valid, email: '' });
    expect(result.success).toBe(false);
  });

  it('rejects a malformed email', () => {
    const result = profileSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailIssue = result.error.issues.find(i => i.path[0] === 'email');
      expect(emailIssue?.message).toMatch(/valid email/i);
    }
  });

  it('accepts an email with a subdomain', () => {
    expect(profileSchema.safeParse({ ...valid, email: 'alex@mail.example.co.uk' }).success).toBe(true);
  });
});
