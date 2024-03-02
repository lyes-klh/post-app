import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { trpc } from '@/lib/trpc';
import { ReloadIcon, TrashIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

type DeleteCommentDialogProps = {
  commentId: string;
  postId: string;
};

export default function DeleteCommentDialog({ commentId, postId }: DeleteCommentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const { mutateAsync, isPending, isError, error } =
    trpc.posts.feedback.comments.delete.useMutation({
      onSuccess: () => {
        utils.posts.feedback.comments.getAll.invalidate({ postId: postId });
        utils.posts.getById.invalidate({ id: postId });
      },
    });

  const handleClick = async () => {
    await mutateAsync({ commentId });
    setIsOpen(false);
    toast({
      variant: 'success',
      title: 'Comment deleted',
      description: `Your comment on this post was deleted successfully`,
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="link"
          size="icon"
          className="hover:text-destructive dark:hover:text-destructive text-muted-foreground"
        >
          <TrashIcon className="h-5 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Comment</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the comment.
            {isError && (
              <p className="text-destructive">
                {error.data?.code} {error.message}
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            className="bg-destructive text-destructive-foreground hover:bg-red-400"
            onClick={handleClick}
            disabled={isPending}
          >
            {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
