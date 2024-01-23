import React from "react";
import { CreatePostForm } from "@/features/posts/create-form";
import { Posts, PostsSkeleton } from "@/features/posts";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "@/services/api/posts-service";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function Home() {
  // const { data, isPending, isError, error } = useQuery({
  //   queryKey: ["posts"],
  //   queryFn: getPosts,
  // });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length > 0) return lastPageParam + 1;
      return undefined;
    },
  });

  return (
    <main className="px-3 lg:px-12 py-2 flex flex-col items-center">
      <CreatePostForm />

      {isPending ? (
        <PostsSkeleton />
      ) : isError ? (
        <p className="text-red-600">{error.message}</p>
      ) : (
        <>
          {data.pages.map((page, i) => (
            <React.Fragment key={i}>
              <Posts posts={page} />
            </React.Fragment>
          ))}

          <Button
            className="mt-4"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage || !hasNextPage}
          >
            {isFetchingNextPage && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Load More
          </Button>
        </>
      )}
    </main>
  );
}
