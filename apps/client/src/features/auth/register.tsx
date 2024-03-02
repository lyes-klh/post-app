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
import { useToast } from '@/components/ui/use-toast';

const RegisterSchema = z
  .object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: 'Passwords does not match',
    path: ['confirmPassword'],
  });

type TRegister = z.infer<typeof RegisterSchema>;

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<TRegister>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { mutateAsync, isError, isPending, error } = trpc.users.register.useMutation();

  const onSubmit = async (registerData: TRegister) => {
    await mutateAsync(registerData);
    toast({
      variant: 'success',
      title: 'Registered',
      description: 'Welcome to your newly created account !',
    });
    navigate('/');
  };

  return (
    <div className="mx-auto mt-8 max-w-md px-2">
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
                  <Input type="password" placeholder="Password..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm Password..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Register
          </Button>

          <p className="text-center text-sm">
            Already have an account?{' '}
            <Link to="/auth/login">
              <Button variant="link" className="p-0">
                Login Now
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
