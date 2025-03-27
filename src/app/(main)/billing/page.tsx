import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import Stripe from "stripe";
import SubscribeBtn from "@/components/billing/SubscribeBtn";
import { formatDate } from "date-fns";
import ManageSubscriptionBtn from "@/components/billing/ManageSubscriptionBtn";

export const metadata: Metadata = {
  title: "Billing",
};

export default async function page() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorize user");

  const subscription = await prisma.userSubscription.findUnique({
    where: { userId },
  });

  const priceInfo = subscription
    ? await stripe.prices.retrieve(subscription?.stripePriceId, {
        expand: ["product"],
      })
    : null;

  return (
    <main className="max-w-7xl mx-auto w-full space-y-6 px-3 py-6">
      <h1 className="text-3xl font-bold">Billing</h1>
      <p>
        Current plan:{" "}
        <span className="font-bold">
          {priceInfo
            ? (priceInfo?.product as Stripe.Product).name
            : "Free plan"}
        </span>
      </p>
      {subscription ? (
        <>
          {subscription.stripeCancelAtPeriodEnd && (
            <p className="text-destructive dark:text-red-500">
              Your subscription will be cancelled on{" "}
              {formatDate(subscription.stripeCurrentPeriodEnd, "MMMM dd,yyyy")}
            </p>
          )}

          <ManageSubscriptionBtn />
        </>
      ) : (
        <SubscribeBtn />
      )}
    </main>
  );
}
