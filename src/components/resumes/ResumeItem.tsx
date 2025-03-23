"use client";

import { MoreVertical, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";

import { ResumeServerData } from "@/lib/types";
import { formatDate } from "date-fns";
import ResumePreview from "../reusables/ResumePreview";
import { mapToResumeValues } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { deleteResume } from "@/lib/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import CustomBtn from "../reusables/CustomBtn";

interface ResumeItemProps {
  resume: ResumeServerData;
}

export default function ResumeItem({ resume }: ResumeItemProps) {
  const wasUpdated = resume.updatedAt !== resume.createdAt;
  return (
    <div className="relative group border rounded-lg border-transparent hover:border-border transition-colors bg-secondary p-3">
      <div className="space-y-3">
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="inline-block w-full text-center"
        >
          <p className="font-semibold line-clamp-1">
            {resume.title || "No title"}
          </p>
          {resume.description && (
            <p className="line-clamp-2 text-sm">{resume.description}</p>
          )}

          <p className="text-xs text-muted-foreground">
            {wasUpdated ? "Updated" : "Created"} on{" "}
            {formatDate(resume.updatedAt, "MM d, yyyy h:mm a")}
          </p>
        </Link>

        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="relative inline-block w-full"
        >
          <ResumePreview
            resumeData={mapToResumeValues(resume)}
            className="shadow-sm group-hover:shadow-lg transition-shadow overflow-hidden"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </Link>
      </div>
      <ItemMenu resumeId={resume.id} />
    </div>
  );
}

interface ItemMenuProps {
  resumeId: string;
}

function ItemMenu({ resumeId }: ItemMenuProps) {
  const [showDeletConfirmation, setShowDeletConfirmation] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 opacity-0 transition-opacity group group-hover:opacity-100"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => setShowDeletConfirmation(true)}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmation
        resumeId={resumeId}
        open={showDeletConfirmation}
        openChange={setShowDeletConfirmation}
      />
    </>
  );
}

interface DeleteConfirmationProps {
  resumeId: string;
  open: boolean;
  openChange: (open: boolean) => void;
}

function DeleteConfirmation({
  resumeId,
  open,
  openChange,
}: DeleteConfirmationProps) {
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteResume(resumeId);
      } catch (error) {
        console.log(error);
        toast("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>You want to delete resume?</DialogTitle>
          <DialogDescription>
            This will permanently delete your resume as the action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <CustomBtn
            variant="destructive"
            loading={isPending}
            onClick={handleDelete}
          >
            Delete
          </CustomBtn>
          <Button variant="secondary" onClick={() => openChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
