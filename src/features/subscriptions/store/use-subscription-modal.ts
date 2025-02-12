import { create } from "zustand";

interface UseSubscriptionModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useSubscriptionModal = create<UseSubscriptionModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export { useSubscriptionModal };
