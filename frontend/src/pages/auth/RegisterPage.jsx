import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Briefcase, Zap, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';

// ─── Password strength helper ─────────────────────────────────────────────────

const getStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8)              score++;
  if (/[A-Z]/.test(pwd))            score++;
  if (/[0-9]/.test(pwd))            score++;
  if (/[^A-Za-z0-9]/.test(pwd))    score++;
  return score; // 0-4
};

const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLOR = ['', 'bg-red-500', 'bg-amber-400', 'bg-yellow-400', 'bg-green-500'];

const PasswordStrength = ({ password }) => {
  if (!password) return null;
  const s = getStrength(password);
  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`h-1 flex-1 rounded-full transition-colors ${n <= s ? STRENGTH_COLOR[s] : 'bg-gray-200'}`}
          />
        ))}
      </div>
      {s > 0 && (
        <p className={`text-xs font-medium ${s >= 4 ? 'text-green-600' : s >= 3 ? 'text-yellow-600' : s >= 2 ? 'text-amber-600' : 'text-red-600'}`}>
          {STRENGTH_LABEL[s]}
        </p>
      )}
    </div>
  );
};

// ─── Role card ────────────────────────────────────────────────────────────────

const RoleCard = ({ icon: Icon, title, description, value, selected, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(value)}
    className={[
      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all text-center flex-1',
      selected
        ? 'border-indigo-600 bg-indigo-50'
        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50',
    ].join(' ')}
  >
    <div
      className={`h-12 w-12 rounded-xl flex items-center justify-center ${
        selected ? 'bg-indigo-600' : 'bg-gray-100'
      }`}
    >
      <Icon className={`h-6 w-6 ${selected ? 'text-white' : 'text-gray-500'}`} />
    </div>
    <div>
      <p className={`font-semibold text-sm ${selected ? 'text-indigo-700' : 'text-gray-800'}`}>{title}</p>
      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
    </div>
    {selected && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
  </button>
);

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm:  z.string(),
  terms:    z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
}).refine((d) => d.password === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
});

// ─── Component ────────────────────────────────────────────────────────────────

const RegisterPage = () => {
  const navigate     = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const [role, setRole] = useState('creator');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { terms: false },
  });

  const password = watch('password', '');

  const onSubmit = async (data) => {
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password, role });
      toast.success('Account created! Let\'s set up your profile.');
      navigate('/profile-setup', { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />

        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Zap className="h-10 w-10 text-amber-400" />
            <span className="text-3xl font-extrabold text-white tracking-tight">Creators Bridge</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-3">Join the community</h2>
          <p className="text-indigo-200 text-lg max-w-xs mb-10">
            Whether you're a creator or a brand, your next big collaboration starts here.
          </p>

          {[
            'Connect with 10,000+ verified creators',
            'Launch campaigns in minutes',
            'Track performance in real-time',
            'Secure & transparent payments',
          ].map((feat) => (
            <div key={feat} className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
              <p className="text-indigo-100 text-sm text-left">{feat}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel (form) ─────────────────────────────────────── */}
      <div className="flex-1 flex items-start justify-center p-6 sm:p-10 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-4">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <Zap className="h-7 w-7 text-indigo-600" />
            <span className="text-xl font-extrabold text-gray-900">Creators Bridge</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-1">Create account</h1>
          <p className="text-gray-500 mb-6">Start your influencer marketing journey</p>

          {/* Role selection */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">I am a…</p>
            <div className="flex gap-3">
              <RoleCard
                icon={Camera}
                title="Creator"
                description="Showcase talent & monetize content"
                value="creator"
                selected={role === 'creator'}
                onClick={setRole}
              />
              <RoleCard
                icon={Briefcase}
                title="Business"
                description="Find creators & run campaigns"
                value="business"
                selected={role === 'business'}
                onClick={setRole}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full name"
              placeholder="Alex Johnson"
              autoComplete="name"
              error={errors.name?.message}
              {...register('name')}
            />

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
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register('password')}
              />
              <PasswordStrength password={password} />
            </div>

            <Input
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.confirm?.message}
              {...register('confirm')}
            />

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                {...register('terms')}
              />
              <span className="text-xs text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-600 -mt-2">{errors.terms.message}</p>}

            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
              Create Account
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
