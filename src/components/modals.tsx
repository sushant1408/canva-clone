"use client";

import { useEffect, useState } from "react";

import { SubscriptionFailedModal } from "@/features/subscriptions/components/subscription-failed-modal";
import { SubscriptionModal } from "@/features/subscriptions/components/subscription-modal";
import { SubscriptionSuccessModal } from "@/features/subscriptions/components/subscription-success-modal";

const Modals = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SubscriptionFailedModal />
      <SubscriptionSuccessModal />
      <SubscriptionModal />
    </>
  );
};

export { Modals };
