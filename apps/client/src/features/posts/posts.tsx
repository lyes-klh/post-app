import Post from './post';
import type { TPost } from '@post-app/validation';

type PostsProps = {
  posts: TPost[];
};

export function Posts({ posts }: PostsProps) {
  return (
    <>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </>
  );
}
