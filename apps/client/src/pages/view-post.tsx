import { useNavigate, useParams } from 'react-router-dom';
import Post from '@/features/posts/post';
import { trpc } from '@/lib/trpc';
import PostSkeleton from '@/features/posts/post-skeleton';

export default function ViewPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    navigate('/');
    return null;
  }

  const { data: post, isPending, isError, error } = trpc.posts.getById.useQuery({ id: id });

  return (
    <main className="flex flex-col items-center px-3 py-2 lg:px-12">
      {isPending ? (
        <PostSkeleton />
      ) : isError ? (
        <p className="text-destructive">{error.message}</p>
      ) : (
        <Post post={post} viewMode={true} />
      )}
    </main>
  );
}
