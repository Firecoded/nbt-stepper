import { describe, it, expect } from 'vitest';
import { preferencesSchema, ROLES, INTERESTS } from './preferencesSchema';

describe('preferencesSchema', () => {
  const valid = { role: 'Developer', interests: ['AI & ML'] };

  it('accepts a valid role and at least one interest', () => {
    expect(preferencesSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts multiple interests', () => {
    expect(preferencesSchema.safeParse({ ...valid, interests: ['AI & ML', 'Security', 'Growth'] }).success).toBe(true);
  });

  it('rejects a missing role', () => {
    const result = preferencesSchema.safeParse({ ...valid, role: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path[0] === 'role')).toBe(true);
    }
  });

  it('rejects an empty interests array', () => {
    const result = preferencesSchema.safeParse({ ...valid, interests: [] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path[0] === 'interests')).toBe(true);
    }
  });

  it('accepts every defined role', () => {
    for (const role of ROLES) {
      expect(preferencesSchema.safeParse({ ...valid, role }).success).toBe(true);
    }
  });

  it('accepts every defined interest', () => {
    expect(preferencesSchema.safeParse({ ...valid, interests: [...INTERESTS] }).success).toBe(true);
  });
});
