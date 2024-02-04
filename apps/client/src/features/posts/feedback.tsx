import { HeartIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

type FeedbackProps = {
  id: string;
  likesCount: number;
  commentsCount: number;
};

export default function Feedback({ id, likesCount }: FeedbackProps) {
  const utils = trpc.useUtils();
  const { mutateAsync, isPending, isError, error } = trpc.posts.like.useMutation();

  const handleLike = async () => {
    await mutateAsync({ id });
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
            className="hover:text-primary p-1"
          >
            <HeartIcon className="mb-[1px] h-5 w-5" />
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
