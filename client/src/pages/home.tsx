import { CreatePostForm } from "@/features/posts/create-form";
import { Posts, PostsSkeleton } from "@/features/posts";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/services/api/posts-service";

export default function Home() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  return (
    <main className="px-3 lg:px-12 py-2 flex flex-col items-center">
      <CreatePostForm />

      {isPending ? (
        <PostsSkeleton />
      ) : isError ? (
        <p className="text-red-600">{error.message}</p>
      ) : (
        <Posts posts={data} />
      )}
    </main>
  );
}
