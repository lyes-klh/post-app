import React, { useEffect } from 'react';
import { Posts, PostsSkeleton } from '@/features/posts';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { trpc } from '@/lib/trpc';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const { data, fetchNextPage, hasNextPage, isPending, isFetchingNextPage, isError, error } =
    trpc.posts.getAll.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => {
          if (lastPage.nextCursor) return lastPage.nextCursor;
          return undefined;
        },
        retry: false,
      },
    );

  const userQuery = trpc.users.me.useQuery(undefined, {
    retry: false,
  });

  useEffect(() => {
    if (!userQuery.isLoading && !userQuery.data) navigate('/auth/login');
  }, [userQuery.data, userQuery.isLoading, navigate]);

  if (userQuery.data)
    return (
      <main className="flex flex-col items-center px-3 py-2 lg:px-12">
        {isPending ? (
          <PostsSkeleton />
        ) : isError ? (
          <p className="text-red-600">{error.message}</p>
        ) : (
          <>
            {data.pages.map((page, i) => (
              <React.Fragment key={i}>
                <Posts posts={page.posts} />
              </React.Fragment>
            ))}

            <Button
              className="mt-4"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage || !hasNextPage}
            >
              {isFetchingNextPage && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
              Load More
            </Button>
          </>
        )}
      </main>
    );
}
