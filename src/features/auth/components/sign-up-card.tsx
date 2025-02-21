"use client";

import { LoaderIcon, TriangleAlertIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSignUp } from "../hooks/use-sign-up";

const SignUpCard = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending, error } = useSignUp();

  const onCredentialSignUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      { email, password, name },
      {
        onSuccess: () => {
          signIn("credentials", {
            email,
            password,
            callbackUrl: "/",
          });
          toast.success("User created");
        },
      }
    );
  };

  const onProviderSignUp = (provider: "github" | "google") => {
    signIn(provider);
  };

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlertIcon className="size-4" />
          <p>Something went wrong</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onCredentialSignUp} className="grid gap-2.5">
          <div className="grid gap-2">
            <Label>Full name</Label>
            <Input
              type="text"
              name="name"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>
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
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <LoaderIcon className="size-4 text-muted-foreground animate-spin" />
            ) : (
              "Sign in"
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
            onClick={() => onProviderSignUp("google")}
            className="w-full relative"
            disabled={isPending}
          >
            <FcGoogle className="mr-2 !size-5 top-2.5 left-2.5 absolute" />
            Signin with Google
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => onProviderSignUp("github")}
            className="w-full relative"
            disabled={isPending}
          >
            <FaGithub className="mr-2 !size-5 top-2.5 left-2.5 absolute" />
            Signin with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Already an user?{" "}
          <Link href="/sign-in">
            <span className="text-sky-700 hover:underline">Sign in</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export { SignUpCard };
