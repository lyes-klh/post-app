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
import { trpc } from '@/lib/trpc';
import { ReloadIcon, TrashIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

type DeletePostDialogProps = {
  id: string;
};

export function DeletePostDialog({ id }: DeletePostDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const utils = trpc.useUtils();

  const { mutateAsync, isPending, isError, error } = trpc.posts.delete.useMutation({
    onSuccess: () => utils.posts.invalidate(),
  });

  const handleClick = async () => {
    await mutateAsync({ id });
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-destructive dark:hover:text-destructive"
        >
          <TrashIcon className="h-5 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Post</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the post.
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