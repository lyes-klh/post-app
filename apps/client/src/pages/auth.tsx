import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Login from '../features/auth/login';
import Register from '@/features/auth/register';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';

const PathValueEnum = z.enum(['login', 'register']);
type TPathValue = z.infer<typeof PathValueEnum>;

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TPathValue>('login');
  const { data: user, isLoading } = trpc.users.me.useQuery(undefined, { retry: false });

  useEffect(() => {
    if (location.pathname === '/auth') navigate('/auth/login');

    const pathValue = PathValueEnum.safeParse(location.pathname.split('/').slice(-1)[0]);
    if (!pathValue.success) navigate('/auth/login');
    else setActiveTab(pathValue.data);
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (!isLoading && user) navigate('/');
  }, [isLoading, user, navigate]);

  if (!user && !isLoading)
    return (
      <div className="mx-auto mt-8 max-w-md px-2">
        <Tabs defaultValue={activeTab} value={activeTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" onClick={() => navigate('login')}>
              Login
            </TabsTrigger>
            <TabsTrigger value="register" onClick={() => navigate('register')}>
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Login />
          </TabsContent>
          <TabsContent value="register">
            <Register />
          </TabsContent>
        </Tabs>
      </div>
    );
}
