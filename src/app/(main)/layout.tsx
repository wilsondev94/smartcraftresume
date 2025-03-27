import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Navbar from "@/components/navbar/Navbar";
import PremiumModal from "@/components/premium/PremiumModal";
import { getUserSubLevel } from "@/lib/subscription";
import SubLevelProvider from "@/components/subscription/SubLevelProvider";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const userSubLevel = await getUserSubLevel(userId);

  return (
    <SubLevelProvider userSubLevel={userSubLevel}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        {children}
        <PremiumModal />
      </div>
    </SubLevelProvider>
  );
}
