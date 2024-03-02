import { Outlet } from 'react-router-dom';
import NavBar from './navbar';
import { Toaster } from '@/components/ui/toaster';

export default function SharedLayout() {
  return (
    <div className="mx-auto min-h-dvh px-0 lg:container">
      <NavBar />
      <Outlet />
      <Toaster />
    </div>
  );
}
