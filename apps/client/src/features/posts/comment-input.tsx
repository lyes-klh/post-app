import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { PaperPlaneIcon } from '@radix-ui/react-icons';

type CommentProps = {
  postId: string;
};

export default function CommentInput({ postId }: CommentProps) {
  const [content, setContent] = useState('');

  const utils = trpc.useUtils();
  const [currentUser] = useState(() => utils.users.me.getData());

  const { mutateAsync, isPending } = trpc.posts.feedback.comments.create.useMutation();

  const handleComment = async () => {
    if (content.length > 0) {
      await mutateAsync({
        content,
        postId,
      });
      setContent('');
      utils.posts.getAll.invalidate();
      utils.posts.feedback.comments.getAll.invalidate({ postId });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src="" />
        <AvatarFallback>{currentUser?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <Input
        className="bg-secondary"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleComment();
        }}
      />
      <Button onClick={handleComment} disabled={isPending} variant="ghost" type="submit">
        <PaperPlaneIcon />
      </Button>
    </div>
  );
}
