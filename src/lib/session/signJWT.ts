import { decodeJwt, SignJWT } from "jose";
import { cookies } from "next/headers";

export const signToken = async (userSession: UserSession) => {
  const secretKey = new TextEncoder().encode(process.env.API_AUTH_TOKEN_SECRET);
  const payload = JSON.parse(JSON.stringify(userSession));
  const userJwtToken = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("720h")
    .sign(secretKey);

  return userJwtToken;
};

const tokenName = `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`;

/**
 * returs the user session from the JWT token
 * @returns  UserSession
 */
export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  if (!cookieStore) return null;
  const token = cookieStore.get(tokenName);

  if (!token) return null;

  const verifiedToken = await decodeJwt(token.value);
  if (!verifiedToken) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return verifiedToken as UserSession;
}
