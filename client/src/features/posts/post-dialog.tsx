import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PostForm from "@/features/posts/post-form";
import { useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";

type PostDialogProps = {
  mode: "create" | "edit";
};

export function PostDialog({ mode }: PostDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:text-slate-50 dark:bg-gray-950">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Post" : "Edit Post"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Write" : "Edit"} your post here.
          </DialogDescription>
        </DialogHeader>
        <PostForm closeDialog={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
