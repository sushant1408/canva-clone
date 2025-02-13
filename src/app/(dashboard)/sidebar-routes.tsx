"use client";

import {
  CreditCardIcon,
  CrownIcon,
  HomeIcon,
  LoaderIcon,
  MessageCircleQuestionIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarItem } from "./sidebar-item";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { useCheckout } from "@/features/subscriptions/api/use-checkout";
import { useBilling } from "@/features/subscriptions/api/use-billing";

const SidebarRoutes = () => {
  const pathname = usePathname();
  const paywall = usePaywall();
  const { mutate: checkoutMutate, isPending: isCheckoutPending } = useCheckout();
  const { mutate: billingMutate, isPending: isBillingPending } = useBilling();

  const onClick = () => {
    if (paywall.shouldBlock) {
      paywall.triggerPaywall();
      return;
    }

    billingMutate();
  };

  return (
    <div className="flex flex-col gap-y-4 flex-1">
      {paywall.shouldBlock && !paywall.isLoading && (
        <>
          <div className="px-3">
            <Button
              onClick={() => checkoutMutate()}
              disabled={isCheckoutPending}
              className="w-full rounded-xl border-none hover:bg-white hover:opacity-75 transition"
              size="lg"
              variant="outline"
            >
              {isCheckoutPending ? (
                <LoaderIcon className="mr-2 size-4 text-muted-foreground animate-spin" />
              ) : (
                <CrownIcon className="mr-2 size-4 fill-yellow-500 text-yellow-500" />
              )}
              Upgrade to Canva Clone Pro
            </Button>
          </div>
          <div className="px-3">
            <Separator />
          </div>
        </>
      )}
      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem
          href="/"
          icon={HomeIcon}
          label="Home"
          isActive={pathname === "/"}
        />
      </ul>
      <div className="px-3">
        <Separator />
      </div>
      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem
          href={pathname}
          icon={CreditCardIcon}
          label="Billing"
          onClick={onClick}
        />
        <SidebarItem
          href="mailto:gandhi.sushant1408@gmail.com"
          icon={MessageCircleQuestionIcon}
          label="Get help"
        />
      </ul>
    </div>
  );
};

export { SidebarRoutes };
