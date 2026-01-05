import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';

export function Navbar() {
  const { accessToken, user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const websiteIdMatch = location.pathname.match(/^\/(editor|builder|draft-preview)\/(\d+)/);
  const websiteId = websiteIdMatch ? Number(websiteIdMatch[2]) : null;

  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <header className="relative z-50 border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          LaunchWeb
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link className="text-white/80 hover:text-white" to="/">
            Home
          </Link>
          <Link className="text-white/80 hover:text-white" to="/templates">
            Templates
          </Link>
          <Link className="text-white/80 hover:text-white" to="/about">
            About
          </Link>

          {!accessToken ? (
            <>
              <Link className="rounded-md bg-white/10 px-3 py-1.5 hover:bg-white/15" to="/login">
                Login
              </Link>
              <Link className="rounded-md bg-indigo-500 px-3 py-1.5 hover:bg-indigo-400" to="/register">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link className="rounded-md bg-white/10 px-3 py-1.5 hover:bg-white/15" to="/dashboard">
                Dashboard
              </Link>
              {Number.isFinite(websiteId) ? (
                <Link className="rounded-md bg-white/10 px-3 py-1.5 hover:bg-white/15" to={`/builder/${websiteId}`}>
                  Builder
                </Link>
              ) : null}
              {user?.role === 'ADMIN' ? (
                <Link className="rounded-md bg-white/10 px-3 py-1.5 hover:bg-white/15" to="/admin">
                  Admin
                </Link>
              ) : null}
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  className="rounded-md bg-white/10 px-3 py-1.5 hover:bg-white/15"
                >
                  {user?.name ?? 'Profile'}
                </button>
                {open ? (
                  <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-black/80 backdrop-blur">
                    <Link
                      className="block px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                      to="/profile"
                      onClick={() => setOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      className="block px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                      to="/settings"
                      onClick={() => setOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        setOpen(false);
                        await logout();
                      }}
                      className="block w-full px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
