import { Pencil1Icon } from '@radix-ui/react-icons';
import { ModeToggle } from './mode-toggle';
import { PostDialog } from '../features/posts';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { trpc } from '@/lib/trpc';

export default function NavBar() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const { mutateAsync } = trpc.users.logout.useMutation({
    onSuccess: () => {
      utils.users.me.reset();
    },
  });
  const { data: user } = trpc.users.me.useQuery(undefined, { retry: false });

  const handleLogout = async () => {
    await mutateAsync();
    navigate('/auth/login');
  };
  return (
    <nav className="flex h-14 items-center justify-between border-b border-gray-800 p-4">
      <Link to="/">
        <div className="flex items-center justify-center gap-1">
          <Pencil1Icon className="text-primary mt-1 h-[1.6rem] w-[1.6rem]" />
          <span className="text-xl font-bold">PostApp</span>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        {!user && (
          <Link to="/auth/login">
            <Button variant="secondary">Login</Button>
          </Link>
        )}

        {user && (
          <>
            <PostDialog mode="create" />
            <Button onClick={handleLogout} variant="secondary">
              Logout
            </Button>
          </>
        )}

        <ModeToggle />
      </div>
    </nav>
  );
}
