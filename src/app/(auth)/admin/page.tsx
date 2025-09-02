"use client";

import React from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Eye, EyeOff, User, Lock, AtSign} from "lucide-react";

import {Button} from "@/src/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/src/components/ui/card";
import {Input} from "@/src/components/ui/input";
import {Label} from "@/src/components/ui/label";
import {cn} from "@/src/lib/utils";
import {RegisterFormValues, regSchema} from "@/src/lib/validation";
import {useRegister} from "@/src/hooks/useRegister";
import {useUserContext} from "@/src/context/UserContext";
import {Loading} from "@/src/components/ui/loading";
import {useRouter} from "next/navigation";

export default function RegisterPage() {

    const {user, loadingUser} = useUserContext()
    const router = useRouter();

    const [showPassword, setShowPassword] = React.useState(false);
    const {loading, error, registerUser} = useRegister();
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
        reset,
    } = useForm<RegisterFormValues>({resolver: zodResolver(regSchema), mode: "onChange"});
    if (loadingUser) return <Loading/>
    if (!user) router.push("/login");
    const passwordValue = watch("password") || "";

    function passwordStrength(pw: string) {
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[a-z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        return score; // 0-5
    }

    const onSubmit = async (data: any) => {
        try {
            await registerUser(data);
            reset({name: "", username: "", password: ""});
            router.push("/login");
        } catch (e: any) {
            throw new Error(e.message);
        }
    };

    const score = passwordStrength(passwordValue);
    const strengthLabels = ["Slaba", "Slaba", "Ok", "Dobra", "Jaka", "Odlična"];

    return (
        <div className="min-h-screen p-4">
            {/* Right side form */}
            <div className="flex items-center justify-center p-6">
                <Card className="w-full max-w-md shadow-xl rounded-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl">Register</CardTitle>
                        <CardDescription>Fill out all fields to create an account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"/>
                                    <Input id="name" placeholder="Ana Anić" className="pl-9" {...register("name")} />
                                </div>
                                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"/>
                                    <Input id="username" placeholder="user1223"
                                           className="pl-9" {...register("username")} />
                                </div>
                                {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"/>
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-9 pr-10"
                                        {...register("password")}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-slate-100"
                                        onClick={() => setShowPassword((s) => !s)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                                    </button>
                                </div>
                                {/* Strength meter */}
                                <div className="space-y-1">
                                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full transition-all",
                                                score <= 2 && "bg-red-400",
                                                score === 3 && "bg-yellow-400",
                                                score >= 4 && "bg-green-500"
                                            )}
                                            style={{width: `${(score / 5) * 100}%`}}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Strength: {strengthLabels[score]}</p>
                                </div>
                                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                            </div>

                            {error && (
                                <div className="text-sm p-3 rounded-xl bg-red-50 text-red-700">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full rounded-2xl" disabled={loading}>
                                {loading ? "Registering..." : "Register"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
