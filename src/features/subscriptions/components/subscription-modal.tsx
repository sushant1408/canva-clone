"use client";

import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSubscriptionModal } from "../store/use-subscription-modal";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2Icon, LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckout } from "../api/use-checkout";

const SubscriptionModal = () => {
  const { isOpen, onClose } = useSubscriptionModal();
  const { mutate, isPending } = useCheckout();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="flex items-center space-y-4">
          <Image src="/logo.svg" alt="logo" width={36} height={36} />
          <DialogTitle className="text-center">
            Upgrade to a paid plan
          </DialogTitle>
          <DialogDescription className="text-center">
            Upgrade to a paid plan to unlock more features
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <ul className="space-y-2">
          <li className="flex items-center">
            <CheckCircle2Icon className="!size-5 mr-2 fill-blue-500 text-white" />
            <p className="text-muted-foreground text-sm">Unlimited projects</p>
          </li>
          <li className="flex items-center">
            <CheckCircle2Icon className="!size-5 mr-2 fill-blue-500 text-white" />
            <p className="text-muted-foreground text-sm">Unlimited templates</p>
          </li>
          <li className="flex items-center">
            <CheckCircle2Icon className="!size-5 mr-2 fill-blue-500 text-white" />
            <p className="text-muted-foreground text-sm">
              AI Background removal
            </p>
          </li>
          <li className="flex items-center">
            <CheckCircle2Icon className="!size-5 mr-2 fill-blue-500 text-white" />
            <p className="text-muted-foreground text-sm">AI Image generation</p>
          </li>
          <li className="flex items-center">
            <CheckCircle2Icon className="!size-5 mr-2 fill-blue-500 text-white" />
            <p className="text-muted-foreground text-sm">2TB of storage</p>
          </li>
        </ul>
        <DialogFooter className="pt-2 mt-4 gap-y-2">
          <Button
            className="w-full"
            disabled={isPending}
            onClick={() => mutate()}
          >
            {isPending ? (
              <LoaderIcon className="animate-spin text-muted-foreground size-4" />
            ) : (
              "Upgrade"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { SubscriptionModal };
