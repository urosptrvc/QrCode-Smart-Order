import { signToken } from "@/src/lib/session/signJWT";
import { User } from "@prisma/client";
import { createUserSession } from "@/src/lib/session/createUserSession";
import { UserSession } from "@/src/types/UserSession";

export async function createSession(user: User) {
  const userSession: UserSession = createUserSession(user);
  const userJwtToken = await signToken(userSession);
  const authorizedUser = {
    user: userSession,
    token: userJwtToken,
  };
  return authorizedUser;
}
