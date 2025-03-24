import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

import CreateResumeBtn from "@/components/resumes/CreateResumeBtn";
import ResumeItem from "@/components/resumes/ResumeItem";
import { canCreateResume } from "@/lib/permission";
import prisma from "@/lib/prisma";
import { getUserSubLevel } from "@/lib/subscription";
import { resumeIncludedData } from "@/lib/types";

export const metadata: Metadata = { title: "Your resumes" };

export default async function page() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const [resumes, totalCount, subLevel] = await Promise.all([
    prisma.resume.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: resumeIncludedData,
    }),
    prisma.resume.count({
      where: {
        userId,
      },
    }),
    getUserSubLevel(userId),
  ]);

  return (
    <main className="max-w-7xl mx-auto p-3 w-full px-3 py-6 space-y-6">
      <CreateResumeBtn canCreate={canCreateResume(subLevel, totalCount)} />
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Your Resumes</h1>
        <p>Total: {totalCount}</p>
      </div>
      <div className="flex flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-3">
        {resumes.map((resume) => (
          <ResumeItem resume={resume} key={resume.id} />
        ))}
      </div>
    </main>
  );
}
