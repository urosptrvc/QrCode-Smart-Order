export const createUserSession = (user: any): UserSession => {
  const currentUnix = Math.floor(Date.now() / 1000);
  const exp = currentUnix + 30 * 24 * 60 * 60;
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    exp: exp,
  };
};
