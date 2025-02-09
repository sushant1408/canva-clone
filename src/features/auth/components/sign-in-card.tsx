"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { LoaderIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const SignInCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const params = useSearchParams();
  const error = params.get("error");

  const onCredentialSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsPending(true);
    signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    }).finally(() => {
      setIsPending(false);
    });
  };

  const onProviderSignIn = (provider: "github" | "google") => {
    setIsPending(true);
    signIn(provider).finally(() => {
      setIsPending(false);
    });
  };

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlertIcon className="size-4" />
          <p>Invalid email or password</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onCredentialSignIn} className="grid gap-2.5">
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="john.doe@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="grid gap-2">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="******"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              maxLength={30}
              disabled={isPending}
            />
          </div>
          <Button type="submit" size="lg" className="w-full">
            {isPending ? (
              <LoaderIcon className="size-4 text-muted-foreground animate-spin" />
            ) : (
              "Login"
            )}
          </Button>
        </form>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-[10] text-muted-foreground bg-background px-2">
            Or continue with
          </span>
        </div>
        <div className="flex flex-col gap-y-2.5">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onProviderSignIn("google")}
            className="w-full relative"
            disabled={isPending}
          >
            <FcGoogle className="mr-2 !size-5 top-2.5 left-2.5 absolute" />
            Login with Google
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => onProviderSignIn("github")}
            className="w-full relative"
            disabled={isPending}
          >
            <FaGithub className="mr-2 !size-5 top-2.5 left-2.5 absolute" />
            Login with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Don't have an account?{" "}
          <Link href="/sign-up">
            <span className="text-sky-700 hover:underline">Sign up</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export { SignInCard };
