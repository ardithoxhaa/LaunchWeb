import { Outlet } from 'react-router-dom';
import { Navbar } from '../nav/Navbar.jsx';

export function AppShell() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <Outlet />
      </main>
    </div>
  );
}
