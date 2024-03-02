import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TComment, trpc } from '@/lib/trpc';
import { truncateString } from '@/lib/utils';
import { useState } from 'react';
import DeleteCommentDialog from './delete-comment-dialog';

type CommentProp = {
  comment: TComment;
};

const MAX_LENGTH = 300;

function Content({ content }: { content: string }) {
  return <p className="bg-muted break-words rounded-md p-2">{content}</p>;
}

export default function Comment({ comment: { content, user, id, postId } }: CommentProp) {
  const [preview] = useState(() => truncateString(content, MAX_LENGTH));
  const [isTruncated] = useState(content.length > MAX_LENGTH);
  const [isOpen, setIsOpen] = useState(false);

  const utils = trpc.useUtils();
  const [currentUser] = useState(() => utils.users.me.getData());

  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src="" />
        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex items-start">
        <div>
          <p className="mb-1 text-sm font-medium">{user.username}</p>

          {!isOpen && <Content content={preview} />}
          <>
            {isTruncated && (
              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="prose prose-sm max-w-none"
              >
                <CollapsibleContent>
                  <Content content={content} />
                </CollapsibleContent>
                <CollapsibleTrigger asChild>
                  <Button size="sm" variant="link" className="text-muted-foreground">
                    Show {isOpen ? 'less' : 'more'}
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            )}
          </>
        </div>
        {currentUser?.id === user.id && (
          <div className="mt-4 flex items-center justify-center">
            <DeleteCommentDialog commentId={id} postId={postId} />
          </div>
        )}
      </div>
    </div>
  );
}
