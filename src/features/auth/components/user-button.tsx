"use client";

import {
  CreditCardIcon,
  CrownIcon,
  LoaderIcon,
  LogOutIcon,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { useBilling } from "@/features/subscriptions/api/use-billing";

const UserButton = () => {
  const session = useSession();
  const paywall = usePaywall();
  const { mutate, isPending } = useBilling();

  const onClick = () => {
    if (paywall.shouldBlock) {
      paywall.triggerPaywall();
      return;
    }

    mutate();
  };

  if (session.status === "loading") {
    return <LoaderIcon className="animate-spin size-4 text-muted-foreground" />;
  }

  if (session.status === "unauthenticated" || !session.data) {
    return null;
  }

  const name = session.data.user?.name!;
  const imageUrl = session.data.user?.image;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="relative outline-none">
        {!paywall.shouldBlock && !paywall.isLoading && (
          <div className="absolute -top-1 -left-1 z-[10] flex items-center justify-center">
            <div className="rounded-full bg-white flex items-center justify-center p-1 drop-shadow-sm">
              <CrownIcon className="size-3 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
        )}
        <Avatar className="size-10 hover:opacity-75 transition">
          <AvatarImage src={imageUrl || ""} alt={name} />
          <AvatarFallback className="bg-blue-500 font-medium text-white">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuItem
          disabled={isPending}
          onClick={onClick}
          className="h-10"
        >
          <CreditCardIcon className="size-4 mr-2" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="h-10">
          <LogOutIcon className="size-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserButton };
