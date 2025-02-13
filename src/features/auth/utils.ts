import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function protectServer() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }
};

export { protectServer };
