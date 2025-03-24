"use client";

import { premiumFeatures, premiumPlusFeatures } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useState } from "react";
import { toast } from "sonner";
import { createCheckout } from "@/lib/actions";
import { env } from "@/env";

export default function PremiumModal() {
  const { open, setOpen } = usePremiumModal();

  const [isLoading, setIsLoading] = useState(false);

  async function handlePremium(priceId: string) {
    try {
      setIsLoading(true);

      const redirectUrl = await createCheckout(priceId);
      window.location.href = redirectUrl;
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!isLoading) setOpen(open);
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Resume Builder Premium</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p>Unlock more features with premium subscription</p>
          <div className="flex">
            <div className="flex w-1/2 flex-col space-y-5">
              <h3 className="text-center text-lg font-bold">Premium</h3>
              <ul className="space-y-2">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-blue-500" /> {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                onClick={() =>
                  handlePremium(env.NEXT_PUBLIC_PREMIUM_STRIPE_PRICE_ID!)
                }
                disabled={isLoading}
              >
                Get Premium
              </Button>
            </div>
            <div className="border-l mx-6" />
            <div className="flex w-1/2 flex-col space-y-5">
              {" "}
              <h3 className="text-center text-lg font-bold bg-gradient-to-r from-[#2C5AA0] to-[#6C8EBF] bg-clip-text text-transparent">
                Premium Plus
              </h3>
              <ul className="space-y-2">
                {premiumPlusFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-blue-500" /> {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant="premium"
                onClick={() =>
                  handlePremium(env.NEXT_PUBLIC_PREMIUM_PLUS_STRIPE_PRICE_ID!)
                }
                disabled={isLoading}
              >
                Get Premium Plus
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
