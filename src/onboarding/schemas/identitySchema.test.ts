import { describe, it, expect } from 'vitest';
import { identitySchema } from './identitySchema';

describe('identitySchema', () => {
  const valid = { avatarId: 'avatar1', screenName: 'cooluser42' };

  it('accepts a valid avatar and screen name', () => {
    expect(identitySchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a missing avatarId', () => {
    const result = identitySchema.safeParse({ ...valid, avatarId: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path[0] === 'avatarId')).toBe(true);
    }
  });

  it('rejects a screen name shorter than 3 characters', () => {
    const result = identitySchema.safeParse({ ...valid, screenName: 'ab' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(i => i.path[0] === 'screenName');
      expect(issue?.message).toMatch(/3 characters/i);
    }
  });

  it('rejects a screen name longer than 20 characters', () => {
    const result = identitySchema.safeParse({ ...valid, screenName: 'a'.repeat(21) });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(i => i.path[0] === 'screenName');
      expect(issue?.message).toMatch(/20 characters/i);
    }
  });

  it('rejects special characters in screen name', () => {
    for (const bad of ['user name', 'user@name', 'user-name', 'user.name']) {
      const result = identitySchema.safeParse({ ...valid, screenName: bad });
      expect(result.success).toBe(false);
    }
  });

  it('accepts screen names with mixed case and numbers', () => {
    expect(identitySchema.safeParse({ ...valid, screenName: 'CoolUser42' }).success).toBe(true);
  });

  it('accepts a screen name exactly 3 characters long', () => {
    expect(identitySchema.safeParse({ ...valid, screenName: 'abc' }).success).toBe(true);
  });

  it('accepts a screen name exactly 20 characters long', () => {
    expect(identitySchema.safeParse({ ...valid, screenName: 'a'.repeat(20) }).success).toBe(true);
  });
});
