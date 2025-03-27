"use client";

import usePremiumModal from "@/hooks/usePremiumModal";
import { Button } from "../ui/button";

export default function SubscribeBtn() {
  const premiumModal = usePremiumModal();

  return (
    <Button
      variant="premium"
      onClick={() => {
        premiumModal.setOpen(true);
      }}
    >
      Get premium subscription
    </Button>
  );
}
