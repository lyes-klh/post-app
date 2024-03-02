import Post from './post';
import type { TPostList } from '@/lib/trpc';

type PostsProps = {
  posts: TPostList;
};

export function Posts({ posts }: PostsProps) {
  return (
    <>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
}
