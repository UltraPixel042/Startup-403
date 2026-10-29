import { randomUUID } from 'node:crypto';

const SESSION_COOKIE = 'brewbook_session';

interface CookieReader {
  get(name: string): { value: string } | undefined;
}

interface CookieWriter {
  set(name: string, value: string, options: Record<string, boolean | number | string>): void;
}

export interface AnonymousSession {
  id: string;
  isNew: boolean;
}

export function resolveAnonymousSession(requestCookies: CookieReader): AnonymousSession {
  const existing = requestCookies.get(SESSION_COOKIE)?.value;
  if (existing) return { id: existing, isNew: false };

  return { id: randomUUID(), isNew: true };
}

export function attachAnonymousSessionCookie(responseCookies: CookieWriter, session: AnonymousSession) {
  if (!session.isNew) return;

  responseCookies.set(SESSION_COOKIE, session.id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 180,
  });
}
