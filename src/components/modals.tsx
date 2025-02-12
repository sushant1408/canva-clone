"use client";

import { SubscriptionModal } from "@/features/subscriptions/components/subscription-modal";
import { useEffect, useState } from "react";

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
      <SubscriptionModal />
    </>
  );
};

export { Modals };
