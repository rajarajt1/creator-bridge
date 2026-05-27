import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button.jsx';

const NotFoundPage = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
    <div className="mb-8">
      <p className="text-9xl font-black text-indigo-100 select-none leading-none">404</p>
      <div className="-mt-6 relative z-10">
        <p className="text-2xl font-bold text-gray-900">Page not found</p>
        <p className="text-gray-500 mt-2 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
    </div>

    <Link to="/">
      <Button variant="primary" size="lg">
        <Home className="h-4 w-4" /> Go Home
      </Button>
    </Link>
  </div>
);

export default NotFoundPage;
