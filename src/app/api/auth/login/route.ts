import { NextRequest, NextResponse } from "next/server";

import { compare } from "bcrypt";
import { getUserByUsername } from "@/src/services/User";
import { createSession } from "@/src/services/Jwt";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { username, password } = data;
  if (!username || !password) {
    return NextResponse.json("Missing Username/Password. Request not valid.", {
      status: 400,
    });
  }
  try {
    const getUser = await getUserByUsername(username);
    if (!getUser) {
      return NextResponse.json(
        "User Not Found. Please check your username and password.",
        { status: 400 },
      );
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const isMatch = await compare(password, getUser.password);
    if (!isMatch) {
      return NextResponse.json("Please check your username and password.", {
        status: 400,
      });
    }
    const authorizedUser = await createSession(getUser);
    return NextResponse.json(authorizedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
