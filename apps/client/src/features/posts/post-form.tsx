import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import type { TPost } from '@/lib/trpc';
import { PostFormSchema } from '@post-app/validation';
import type { TPostForm } from '@post-app/validation';
import { useToast } from '@/components/ui/use-toast';
import ToastDescription from '@/components/toast-description';

type PostFormProps =
  | {
      mode: 'create';
      postValues?: never;
      closeDialog: () => void;
    }
  | {
      mode: 'edit';
      postValues: TPost;
      closeDialog: () => void;
    };

export default function PostForm({ mode, closeDialog, postValues }: PostFormProps) {
  const form = useForm<TPostForm>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: {
      title: postValues?.title || '',
      content: postValues?.content || '',
    },
  });

  const { toast } = useToast();
  const utils = trpc.useUtils();

  const createMutation = trpc.posts.create.useMutation({
    onSuccess: () => {
      utils.posts.getAll.invalidate();
      toast({
        variant: 'success',
        description: (
          <ToastDescription variant="success">Your post was created successfully</ToastDescription>
        ),
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        description: (
          <ToastDescription variant="destructive">
            An error happened, please try again
          </ToastDescription>
        ),
      });
    },
  });

  const updateMutation = trpc.posts.update.useMutation({
    onSuccess: () => {
      utils.posts.getAll.invalidate();
      toast({
        variant: 'success',
        description: (
          <ToastDescription variant="success">Your post was updated successfully</ToastDescription>
        ),
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        description: (
          <ToastDescription variant="destructive">
            An error happened, please try again
          </ToastDescription>
        ),
      });
    },
  });

  const { isPending } = mode === 'create' ? createMutation : updateMutation;

  const onSubmit = async (postData: TPostForm) => {
    if (mode === 'create') await createMutation.mutateAsync(postData);
    if (mode === 'edit')
      await updateMutation.mutateAsync({
        postId: postValues.id,
        post: postData,
      });
    closeDialog();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write something..."
                  className="h-32 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
