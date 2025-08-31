import { UserProvider } from "@/src/context/UserContext";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UserProvider>{children}</UserProvider>;
}
