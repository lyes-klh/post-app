import { HeartIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

type FeedbackProps = {
  postId: string;
  likesCount: number;
  liked: boolean;
};

export default function Feedback({ postId, likesCount, liked }: FeedbackProps) {
  const utils = trpc.useUtils();

  const likeQuery = trpc.posts.like.useMutation();
  const unlikeQuery = trpc.posts.unlike.useMutation();

  const { mutateAsync, isPending, isError, error } = liked ? unlikeQuery : likeQuery;

  const handleLike = async () => {
    await mutateAsync({ postId });
    utils.posts.invalidate();
  };

  return (
    <>
      <div className="flex gap-4">
        <div className="text-muted-foreground flex  items-center">
          <Button
            onClick={handleLike}
            variant="ghost"
            disabled={isPending}
            className="hover:text-primary  p-1"
          >
            <HeartIcon className={cn('mb-[1px] h-5 w-5', liked && 'text-primary')} />
          </Button>
          <span>{likesCount}</span>
        </div>

        {/* <div className="text-muted-foreground flex  items-center">
          <Button variant="ghost" className=" hover:text-primary text-muted-foreground p-1">
            <ChatBubbleIcon className="mb-[1px] h-5 w-5" />
          </Button>
          <span>{commentsCount}</span>
        </div> */}
      </div>
      {isError && (
        <p className="text-destructive">
          Something went wrong when trying to add feedback : {error.message}
        </p>
      )}
    </>
  );
}
