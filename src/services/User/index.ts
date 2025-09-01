import { prisma } from "@/src/lib/db";

export async function getUserByUsername(username: string) {
  const getUser = await prisma.user.findUnique({
    where: { username: username },
  });
  return getUser;
}

export async function createUser(
  username: string,
  hashedPassword: any,
  name: string,
) {
  const newUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      name,
    },
  });
  return newUser;
}
