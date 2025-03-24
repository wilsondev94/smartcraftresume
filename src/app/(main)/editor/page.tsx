import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

import prisma from "@/lib/prisma";
import ResumeEditor from "@/components/editor/ResumeEditor";
import { resumeIncludedData } from "@/lib/types";

export const metadata: Metadata = { title: "Create your resumes" };

interface PageProps {
  searchParams: Promise<{ resumeId?: string }>;
}
export default async function page({ searchParams }: PageProps) {
  const { resumeId } = await searchParams;

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorize");

  const resumeToEdit = resumeId
    ? await prisma.resume.findUnique({
        where: { id: resumeId, userId },
        include: resumeIncludedData,
      })
    : null;

  return <ResumeEditor resumeToEdit={resumeToEdit} />;
}
