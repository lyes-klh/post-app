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
import { PlusIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { Post } from "@/services/validation";

type PostDialogProps =
  | {
      mode: "create";
      postValues?: never;
    }
  | {
      mode: "edit";
      postValues: Post;
    };

export function PostDialog({ mode, postValues }: PostDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={mode === "create" ? "default" : "ghost"}
          size={mode === "create" ? "default" : "icon"}
        >
          {mode === "create" ? (
            <>
              <PlusIcon className="mr-2 h-5 w-5" />
              Create Post
            </>
          ) : (
            <Pencil2Icon className="h-5 w-5 mb-[1px]" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:text-slate-50 dark:bg-gray-950">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Post" : "Edit Post"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Write" : "Edit"} your post here.
          </DialogDescription>
        </DialogHeader>
        {mode === "create" ? (
          <PostForm mode="create" closeDialog={() => setIsOpen(false)} />
        ) : (
          <PostForm mode="edit" postValues={postValues} closeDialog={() => setIsOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
