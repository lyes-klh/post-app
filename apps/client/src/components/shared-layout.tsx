import { Outlet } from 'react-router-dom';
import NavBar from './navbar';

export default function SharedLayout() {
  return (
    <div className="mx-auto min-h-dvh px-0 lg:container">
      <NavBar />
      <Outlet />
    </div>
  );
}
