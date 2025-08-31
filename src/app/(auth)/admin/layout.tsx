import { getSession } from "@/src/lib/signJWT";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userSession = await getSession();
  if (!userSession) redirect("/login");
  return <div>{children}</div>;
}
