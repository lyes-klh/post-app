import { trpc } from '@/lib/trpc';
import { CommentsSkeleton } from './comments-skeleton';
import Comment from './comment';
import React from 'react';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';

type CommentsProps = {
  postId: string;
};

export default function Comments({ postId }: CommentsProps) {
  const {
    data: comments,
    isPending,
    isError,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = trpc.posts.feedback.comments.getAll.useInfiniteQuery(
    { postId },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.nextCursor) return lastPage.nextCursor;
        return undefined;
      },
      retry: false,
    },
  );

  return (
    <>
      {isPending ? (
        <CommentsSkeleton />
      ) : isError ? (
        <p className="text-red-600">{error.message}</p>
      ) : (
        <>
          {comments.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </React.Fragment>
          ))}

          {hasNextPage && (
            <Button
              variant="link"
              className="text-muted-foreground mt-4"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
              View more comments
            </Button>
          )}
        </>
      )}
    </>
  );
}
