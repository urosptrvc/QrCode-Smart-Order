import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { ValidateApiToken } from "@/src/lib/session/validateApiToken";
import { createUser, getUserByUsername } from "@/src/services/User";

export async function POST(req: Request) {
  try {
    const userSession = await ValidateApiToken();
    if (!userSession) {
      return NextResponse.json(
        { error: "Samo admin ima pristup" },
        { status: 403 },
      );
    }
    const body = await req.json();
    const { username, password, name } = body;
    console.log(username, password, name);
    if (!username || !password) {
      return NextResponse.json(
        { error: "Korisničko ime i lozinka su obavezni." },
        { status: 400 },
      );
    }

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { error: "Korisnik sa tim usernameom već postoji." },
        { status: 400 },
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await createUser(username, hashedPassword, name);
    return NextResponse.json(
      { message: "Korisnik uspešno kreiran", userId: newUser.id },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Došlo je do greške." },
        { status: 500 },
      );
    }
  }
}
