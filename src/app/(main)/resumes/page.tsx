import { auth } from "@clerk/nextjs/server";
import { PlusSquare } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { resumeIncludedData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import ResumeItem from "@/components/resumes/ResumeItem";

export const metadata: Metadata = { title: "Your resumes" };

export default async function page() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-up");
  }

  const [resumes, totalCount] = await Promise.all([
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
  ]);

  return (
    <main className="max-w-7xl mx-auto p-3 w-full px-3 py-6 space-y-6">
      <Button asChild className="mx-auto flex w-fit gap-2">
        <Link href="/editor">
          <PlusSquare className="size-3" />
          New resume
        </Link>
      </Button>
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
