import { useState, useTransition } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreVertical, Printer, Trash2 } from "lucide-react";
import { deleteResume } from "@/lib/actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import CustomBtn from "../reusables/CustomBtn";

interface ItemMenuProps {
  resumeId: string;
  onPrint: () => void;
}

export default function ItemMenu({ resumeId, onPrint }: ItemMenuProps) {
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
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={onPrint}
          >
            <Printer className="size-4" />
            Print
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
