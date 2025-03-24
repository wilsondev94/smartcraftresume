"use client";

import Link from "next/link";
import { PlusSquare } from "lucide-react";

import usePremiumModal from "@/hooks/usePremiumModal";
import { Button } from "../ui/button";

interface CreateResumeBtnProps {
  canCreate: boolean;
}

export default function CreateResumeBtn({ canCreate }: CreateResumeBtnProps) {
  const { setOpen } = usePremiumModal();

  if (canCreate)
    return (
      <Button asChild className="mx-auto flex w-fit gap-2">
        <Link href="/editor">
          <PlusSquare className="size-3" />
          New resume
        </Link>
      </Button>
    );

  return (
    <Button onClick={() => setOpen(true)} className="mx-auto flex w-fit gap-2">
      <PlusSquare className="size-3" />
      New resume
    </Button>
  );
}
