import { create } from "zustand";

interface UseSubscriptionSuccessModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useSubscriptionSuccessModal = create<UseSubscriptionSuccessModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export { useSubscriptionSuccessModal };
