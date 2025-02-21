"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useSubscriptionFailedModal } from "../store/use-subscription-failed-modal";
import { useSubscriptionSuccessModal } from "../store/use-subscription-success-modal";

const SubscriptionAlert = () => {
  const params = useSearchParams();
  const { onOpen: onFailedOpen } = useSubscriptionFailedModal();
  const { onOpen: onSuccessOpen } = useSubscriptionSuccessModal();

  const canceled = params.get("canceled");
  const success = params.get("success");

  useEffect(() => {
    if (canceled) {
      onFailedOpen();
    }
  }, [canceled, onFailedOpen]);

  useEffect(() => {
    if (success) {
      onSuccessOpen();
    }
  }, [success, onSuccessOpen]);

  return null;
};

export { SubscriptionAlert };
