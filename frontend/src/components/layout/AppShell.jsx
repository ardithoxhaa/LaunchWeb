import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../nav/Navbar.jsx';

export function AppShell() {
  const { pathname } = useLocation();
  const isBuilder = pathname.startsWith('/builder/') || pathname.startsWith('/editor/');

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={isBuilder ? 'w-full px-4 py-6' : 'mx-auto max-w-6xl px-4 py-10'}>
        <Outlet />
      </main>
    </div>
  );
}
