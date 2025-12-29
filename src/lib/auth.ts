import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "demeter_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function validateCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const validUsername = process.env.DEMETER_USERNAME;
  const validPassword = process.env.DEMETER_PASSWORD;

  if (!validUsername || !validPassword) {
    console.error("DEMETER_USERNAME or DEMETER_PASSWORD not set in environment");
    return false;
  }

  return username === validUsername && password === validPassword;
}

export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = crypto.randomUUID();

  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value ?? null;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}
