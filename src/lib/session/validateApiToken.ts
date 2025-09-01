import { cookies } from "next/headers";
import { decodeJwt } from "jose";

/**
 * We are checking the token in the header
 * The verification is done on the API. Here we are just making sure the token is
 * valid and not expired
 * @returns current UserSession from the decoded token
 */
export const ValidateApiToken = async () => {
  // const headersList = await headers()
  // const authToken = headersList.get(tokenName)
  const clientTokenName = `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`; // Client token - User Session Token Name

  const cookieStore = await cookies();
  const authToken = cookieStore.get(clientTokenName)?.value;

  if (!authToken) {
    throw new Error("API Validation > Missing Token");
  }
  const decodedToken = await decodeJwt(authToken);

  if (!decodedToken) {
    throw new Error("API Validation > Token Invalid");
  }

  const now = Math.round(new Date().getTime() / 1000);

  if (!decodedToken.exp)
    throw new Error("API Validation > Token Expiration Missing");

  if (decodedToken.exp <= now)
    throw new Error("API Validation > Token Expired");

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return decodedToken as UserSession;
};
