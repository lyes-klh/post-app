import Post from './post';
import type { PostType } from '@post-app/validation';

type PostsProps = {
  posts: PostType[];
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
