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
import { PostFormSchema } from '@post-app/validation';
import type { TPostForm, TPost } from '@post-app/validation';
import { trpc } from '@/lib/trpc';

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
      username: postValues?.username || '',
      title: postValues?.title || '',
      content: postValues?.content || '',
    },
  });

  const utils = trpc.useUtils();

  const createMutation = trpc.posts.create.useMutation({
    onSuccess: () => utils.posts.getAll.invalidate(),
  });

  const updateMutation = trpc.posts.update.useMutation({
    onSuccess: () => utils.posts.getAll.invalidate(),
  });

  const { isPending, isError, error } = mode === 'create' ? createMutation : updateMutation;

  const onSubmit = async (postData: TPostForm) => {
    if (mode === 'create') await createMutation.mutateAsync(postData);
    if (mode === 'edit')
      await updateMutation.mutateAsync({
        id: postValues._id,
        post: postData,
      });
    closeDialog();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  className="h-24 resize-none"
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
      {isError && (
        <p className="text-red-600">
          {error.data?.code} {error.message}
        </p>
      )}
    </Form>
  );
}
