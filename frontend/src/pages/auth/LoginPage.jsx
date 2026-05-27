import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

const LoginPage = () => {
  const navigate        = useNavigate();
  const { login, isLoading, isAuthenticated, user } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'creator' ? '/dashboard' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data) => {
    try {
      await login(data);
      // navigation handled by useEffect above
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ───────────────────────────────────────────────── */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />

        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Zap className="h-10 w-10 text-amber-400" />
            <span className="text-3xl font-extrabold text-white tracking-tight">Creators Bridge</span>
          </div>

          {/* SVG illustration placeholder */}
          <div className="mx-auto mb-8 h-56 w-56 rounded-full bg-white/10 flex items-center justify-center">
            <LogIn className="h-24 w-24 text-white/60" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-3">Welcome back!</h2>
          <p className="text-indigo-200 text-lg max-w-xs">
            Connect with top brands and creators on India's fastest-growing influencer platform.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            {[
              { value: '10K+', label: 'Creators' },
              { value: '2K+',  label: 'Brands'    },
              { value: '15K+', label: 'Campaigns' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-indigo-200 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ───────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Zap className="h-7 w-7 text-indigo-600" />
            <span className="text-xl font-extrabold text-gray-900">Creators Bridge</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-1">Sign in</h1>
          <p className="text-gray-500 mb-8">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />
              <div className="mt-1 text-right">
                <Link to="/forgot-password" className="text-xs text-indigo-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            New here?{' '}
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
