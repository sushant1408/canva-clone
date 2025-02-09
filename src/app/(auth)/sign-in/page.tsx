import { auth } from "@/auth";
import { SignInCard } from "@/features/auth/components/sign-in-card";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return <SignInCard />;
}
