"use client";

import { useState } from "react";
import CustomBtn from "../reusables/CustomBtn";
import { toast } from "sonner";
import { createCustomerPortal } from "@/lib/actions";

export default function ManageSubscriptionBtn() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    try {
      setIsLoading(true);
      const redirectUrl = await createCustomerPortal();

      window.location.href = redirectUrl;
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CustomBtn onClick={handleClick} loading={isLoading}>
      Manage subscription
    </CustomBtn>
  );
}
