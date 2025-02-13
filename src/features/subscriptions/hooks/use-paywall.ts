import { useGetSubscription } from "../api/use-get-subscription";
import { useSubscriptionModal } from "../store/use-subscription-modal";

const usePaywall = () => {
  const subscriptionModal = useSubscriptionModal();
  const { data: subscription, isLoading: isSubscriptionLoading } =
    useGetSubscription();

  const shouldBlock = isSubscriptionLoading || !subscription?.active;

  return {
    isLoading: isSubscriptionLoading,
    shouldBlock,
    triggerPaywall: () => {
      subscriptionModal.onOpen();
    },
  };
};

export { usePaywall };
