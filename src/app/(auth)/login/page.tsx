"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "@/src/context/UserContext";
import { useApi } from "@/src/hooks/useApi";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Loader2, User, Lock, Coffee } from "lucide-react";
import { LoginFormValues, loginSchema } from "@/src/lib/validation";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiPost } = useApi();
  const { login } = useUserContext();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiPost("/api/auth/login", {
        username: values.username,
        password: values.password,
      });

      if (result?.error || !result?.token || !result?.user) {
        setError("Neispravno korisničko ime ili lozinka");
      } else {
        login(result.user, result.token);
        router.push("/admin/orders");
      }
    } catch (e) {
      setError("Došlo je do greške. Pokušajte ponovo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Coffee className="h-6 w-6" />
            Caffe Panel
          </CardTitle>
          <CardDescription>Prijavite se na svoj nalog</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-4"
            >
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Korisničko ime
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="peraperic"
                        {...field}
                        disabled={isLoading}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Lozinka
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="JakaSifra123"
                        {...field}
                        disabled={isLoading}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Prijavljivanje...
                  </>
                ) : (
                  "Prijavi se"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
