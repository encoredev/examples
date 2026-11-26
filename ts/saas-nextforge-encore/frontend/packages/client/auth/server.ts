import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getClient } from '../get-client';

export async function auth() {
  const sessionCookie = cookies().get('better-auth.session_token'); // ensure to change this if you change default better auth cookies.
  if (!sessionCookie) {
    throw new Error('No session cookie found');
  }

  const client = await getClient(); // this already auto inject cookies

  const session = await client.auth.getSession();

  if (!session) {
    throw new Error('Invalid session');
  }

  return { ...session.data, orgId: 'todo get OrgId' };
}

export function redirectToSignIn() {
  redirect('/sign-in');
}
