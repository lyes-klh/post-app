import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { PostDialog, DeletePostDialog } from './';
import Feedback from './feedback';
import { TPost, trpc } from '@/lib/trpc';
import { Link } from 'react-router-dom';
import { truncateString } from '@/lib/utils';

type PostProps = {
  post: TPost;
  viewMode?: boolean;
};

const MAX_LENGTH = 400;

function Content({ content }: { content: string }) {
  return <p className="break-words">{content}</p>;
}

export default function Post({ post, viewMode }: PostProps) {
  const {
    id,
    title,
    content,
    user: { username },
    createdAt,
  } = post;

  const [preview] = useState(() => truncateString(content, MAX_LENGTH));
  const [isTruncated] = useState(content.length > MAX_LENGTH);
  const [isOpen, setIsOpen] = useState(false);

  const utils = trpc.useUtils();

  const [currentUser] = useState(() => utils.users.me.getData());

  return (
    <div className="mt-4 flex w-full flex-col gap-4 rounded-lg p-4 shadow-md lg:w-2/3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{username}</p>
            <Link to={`/posts/${id}`}>
              <p className="text-muted-foreground text-xs font-light">
                {new Date(createdAt).toLocaleString()}
              </p>
            </Link>
          </div>
        </div>
        {currentUser?.id === post.userId && (
          <div className="flex items-center justify-center">
            <PostDialog mode="edit" postValues={post} />
            <DeletePostDialog postId={post.id} />
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold">{title}</h2>

      {!isOpen && <Content content={preview} />}
      <>
        {isTruncated && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="prose prose-sm max-w-none">
            <CollapsibleContent>
              <Content content={content} />
            </CollapsibleContent>
            <CollapsibleTrigger asChild>
              <Button size="sm" variant="link" className="text-primary">
                Show {isOpen ? 'less' : 'more'}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        )}
      </>

      <Feedback
        likesCount={post.likesCount}
        commentsCount={post.commentsCount}
        liked={post.likes.length > 0}
        postId={post.id}
        viewMode={viewMode}
      />
    </div>
  );
}
