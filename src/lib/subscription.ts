import { cache } from "react";
import prisma from "./prisma";
import { env } from "@/env";

export type SubOptions = "free" | "premium" | "premium_plus";

//The cache() ensures that a single call to database if multiple times in different components on the same page call this function
export const getUserSubLevel = cache(
  async (userId: string): Promise<SubOptions> => {
    const subscription = await prisma.userSubscription.findUnique({
      where: { id: userId },
    });

    if (!subscription || subscription.stripeCurrentPeriodEnd < new Date()) {
      return "free";
    }

    if (
      subscription.stripePriceId === env.NEXT_PUBLIC_PREMIUM_STRIPE_PRICE_ID
    ) {
      return "premium";
    }

    if (
      subscription.stripePriceId ===
      env.NEXT_PUBLIC_PREMIUM_PLUS_STRIPE_PRICE_ID
    ) {
      return "premium_plus";
    }

    throw new Error("Invalid subscription.");
  }
);
