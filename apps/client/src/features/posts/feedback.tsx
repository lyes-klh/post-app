import { ChatBubbleIcon, HeartIcon, HeartFilledIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { useState } from 'react';
import CommentInput from './comment-input';
import Comments from './comments';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

type FeedbackProps = {
  postId: string;
  likesCount: number;
  commentsCount: number;
  liked: boolean;
  viewMode?: boolean;
};

export default function Feedback({
  postId,
  likesCount,
  liked,
  commentsCount,
  viewMode,
}: FeedbackProps) {
  const [isOpen, setIsOpen] = useState(!!viewMode);
  const { toast } = useToast();

  const utils = trpc.useUtils();

  const likeQuery = trpc.posts.feedback.likes.create.useMutation();
  const unlikeQuery = trpc.posts.feedback.likes.delete.useMutation();

  const { mutateAsync, isPending, isError, error } = liked ? unlikeQuery : likeQuery;

  const handleLike = async () => {
    await mutateAsync({ postId });
    utils.posts.getAll.invalidate();
    utils.posts.getById.invalidate({ id: postId });
    toast({
      variant: 'success',
      title: liked ? 'Like deleted' : 'Liked',
      description: liked ? 'Your like is deleted successfully' : 'You liked this post successfully',
    });
  };

  return (
    <>
      <div className="flex gap-4">
        <div className="text-muted-foreground flex items-center gap-1">
          <Button
            onClick={handleLike}
            variant="ghost"
            disabled={isPending}
            className="hover:text-primary p-1"
          >
            {liked ? (
              <HeartFilledIcon className="text-primary mb-[1px] h-5 w-5" />
            ) : (
              <HeartIcon className="mb-[1px] h-5 w-5" />
            )}
          </Button>
          <Link to={`/posts/${postId}`} className="hover:underline">
            {likesCount}
          </Link>
        </div>

        <div className="text-muted-foreground mb-[1px] flex items-center gap-1">
          <Button
            variant="ghost"
            className=" hover:text-primary  p-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            <ChatBubbleIcon className="mb-[1px] h-5 w-5" />
          </Button>
          <Link to={`/posts/${postId}`} className="hover:underline">
            {commentsCount}
          </Link>
        </div>
      </div>
      {isOpen && <CommentInput postId={postId} />}
      {viewMode && <Comments postId={postId} />}
      {isError && (
        <p className="text-destructive">
          Something went wrong when trying to add feedback : {error.message}
        </p>
      )}
    </>
  );
}
