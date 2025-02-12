import { useSubscriptionModal } from "../store/use-subscription-modal";

const usePaywall = () => {
  const subscriptionModal = useSubscriptionModal();

  return {
    isLoading: false,
    shouldBlock: true,
    triggerPaywall: () => {
      subscriptionModal.onOpen();
    }
  };
};

export { usePaywall };
