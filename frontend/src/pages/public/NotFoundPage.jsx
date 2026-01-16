import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-semibold mb-2 text-white">Page Not Found</h1>
        <p className="text-white/60 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/home"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 rounded-lg font-medium text-white transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
