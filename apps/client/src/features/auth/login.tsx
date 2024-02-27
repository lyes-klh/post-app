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
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { trpc } from '@/lib/trpc';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type TLogin = z.infer<typeof LoginSchema>;

export default function Login() {
  const navigate = useNavigate();

  const form = useForm<TLogin>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutateAsync, isError, error, isPending } = trpc.users.login.useMutation();

  const onSubmit = async (loginData: TLogin) => {
    await mutateAsync(loginData);
    navigate('/');
  };

  return (
    <div className="mx-auto mt-8 max-w-md px-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>

          <p className="text-center text-sm">
            Don't have an account?{' '}
            <Link to="/auth/register">
              <Button variant="link" className="p-0">
                Register Now
              </Button>
            </Link>
          </p>
        </form>
        {isError && (
          <p className="text-center text-red-600">
            {error.data?.code} {error.message}
          </p>
        )}
      </Form>
    </div>
  );
}
