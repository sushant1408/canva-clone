import { create } from "zustand";

interface UseSubscriptionFailedModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useSubscriptionFailedModal = create<UseSubscriptionFailedModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export { useSubscriptionFailedModal };
