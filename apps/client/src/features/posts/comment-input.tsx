import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast';
import ToastDescription from '@/components/toast-description';

type CommentProps = {
  postId: string;
};

export default function CommentInput({ postId }: CommentProps) {
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const utils = trpc.useUtils();
  const [currentUser] = useState(() => utils.users.me.getData());

  const { mutateAsync, isPending } = trpc.posts.feedback.comments.create.useMutation({
    onSuccess: () => {
      utils.posts.getAll.invalidate();
      utils.posts.feedback.comments.getAll.invalidate({ postId });
      utils.posts.getById.invalidate({ id: postId });
      toast({
        variant: 'success',
        description: (
          <ToastDescription variant="success">Your comment was added successfully</ToastDescription>
        ),
      });
    },
  });

  const handleComment = async () => {
    if (content.length > 0) {
      await mutateAsync({
        content,
        postId,
      });
      setContent('');
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
