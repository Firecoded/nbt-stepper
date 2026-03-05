# Create Account — Transaction Flow

Triggered when the user clicks **Create Account** on the Identity step.

## Prerequisites

By this point the client holds a complete `OnboardingSubmission` object:

```ts
{
  profile:     { firstName, lastName, email },
  preferences: { role, interests[] },
  identity:    { avatarId, screenName },
  submittedAt: ISO8601 string
}
```

The screen name has already passed the availability check
(`GET /api/v1/screen-name/check`), but a uniqueness constraint on
`screen_names` is the authoritative guard — the check result can be stale
if another user claimed the name in the window between check and submit.

---

## API Call

```
POST /api/v1/onboarding/submit
Body: OnboardingSubmission
```

---

## Database Transaction

All writes happen inside a single transaction. If any step fails the entire
operation rolls back and the client receives an error — no partial records.

```sql
BEGIN;

  -- 1. Insert the canonical user row
  INSERT INTO users (first_name, last_name, email, screen_name, avatar_id)
  VALUES ($first_name, $last_name, $email, $screen_name, $avatar_id)
  RETURNING id INTO $user_id;

  -- 2. Insert preferences
  INSERT INTO user_preferences (user_id, role, interests)
  VALUES ($user_id, $role, $interests);

  -- 3. Claim the screen name (fails here if taken by a concurrent submit)
  INSERT INTO screen_names (screen_name, user_id)
  VALUES ($screen_name, $user_id);

  -- 4. Issue an auth session
  INSERT INTO sessions (user_id, token_hash, expires_at)
  VALUES ($user_id, hash($raw_token), now() + interval '30 days');

  -- 5. Mark the onboarding session complete
  UPDATE onboarding_sessions
  SET status = 'completed', updated_at = now()
  WHERE email = $email;

COMMIT;
```

---

## Response

On success the API returns:

```json
{
  "userId": "<uuid>",
  "token": "<raw session token>"
}
```

The frontend stores the token, the React Query cache entry for
`['onboarding', 'progress']` is cleared, and the user is navigated to `/finish`.

---

## Failure Cases

| Scenario | DB error | HTTP response |
|---|---|---|
| Email already registered | `users.email` unique violation | `409 Conflict` |
| Screen name taken between check and submit | `screen_names` unique violation | `409 Conflict` |
| Any other DB error | rollback | `500 Internal Server Error` |

The client surfaces 409 errors inline (e.g. "That email is already registered")
so the user can correct and resubmit without losing their other form data.
