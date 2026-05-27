import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, ArrowLeft, Check, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore.js';
import useCreatorStore from '../../store/creatorStore.js';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { NICHE_OPTIONS, PLATFORM_OPTIONS } from '../../utils/constants.js';

// ─── Progress bar ─────────────────────────────────────────────────────────────

const ProgressBar = ({ step, total }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-700">Step {step} of {total}</span>
      <span className="text-sm text-gray-400">{Math.round((step / total) * 100)}% complete</span>
    </div>
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
        style={{ width: `${(step / total) * 100}%` }}
      />
    </div>
    <div className="flex justify-between mt-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
            i + 1 < step
              ? 'bg-indigo-600 text-white'
              : i + 1 === step
              ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-600'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          {i + 1 < step ? <Check className="h-3 w-3" /> : i + 1}
        </div>
      ))}
    </div>
  </div>
);

// ─── Creator steps ────────────────────────────────────────────────────────────

const creatorStep1Schema = z.object({
  bio:      z.string().min(20, 'Bio must be at least 20 characters').max(500),
  location: z.string().min(2, 'Location is required'),
});

const CreatorStep1 = ({ onNext, onSkip }) => {
  const [selectedNiches, setSelectedNiches] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(creatorStep1Schema),
  });

  const toggleNiche = (v) =>
    setSelectedNiches((prev) =>
      prev.includes(v) ? prev.filter((n) => n !== v) : [...prev, v]
    );

  const submit = (data) => onNext({ ...data, niche: selectedNiches });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea
          rows={3}
          placeholder="Tell brands what makes you unique…"
          className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${
            errors.bio ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
          }`}
          {...register('bio')}
        />
        {errors.bio && <p className="mt-1 text-xs text-red-600">{errors.bio.message}</p>}
      </div>

      <Input label="Location" placeholder="e.g. Mumbai, India" error={errors.location?.message} {...register('location')} />

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Your niches <span className="text-gray-400 font-normal">(select all that apply)</span></p>
        <div className="flex flex-wrap gap-2">
          {NICHE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => toggleNiche(value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                selectedNiches.includes(value)
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" className="flex-1">
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="md" onClick={onSkip}>Skip</Button>
      </div>
    </form>
  );
};

const PLATFORMS = PLATFORM_OPTIONS.map((p) => p.value);

const CreatorStep2 = ({ onNext, onBack, onSkip }) => {
  const [handles, setHandles] = useState(() =>
    Object.fromEntries(PLATFORMS.map((p) => [p, { handle: '', followers: '' }]))
  );

  const updateHandle = (platform, field, value) =>
    setHandles((prev) => ({ ...prev, [platform]: { ...prev[platform], [field]: value } }));

  const submit = () => {
    const socialMedia = {};
    PLATFORMS.forEach((p) => {
      if (handles[p].handle) {
        socialMedia[p] = {
          handle:    handles[p].handle,
          followers: Number(handles[p].followers) || 0,
        };
      }
    });
    onNext({ socialMedia });
  };

  return (
    <div className="space-y-4">
      {PLATFORM_OPTIONS.map(({ value, label }) => (
        <div key={value} className="border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-700 mb-3 capitalize">{label}</p>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="@username"
              value={handles[value].handle}
              onChange={(e) => updateHandle(value, 'handle', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Followers"
              value={handles[value].followers}
              onChange={(e) => updateHandle(value, 'followers', e.target.value)}
            />
          </div>
        </div>
      ))}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button type="button" variant="primary" className="flex-1" onClick={submit}>
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" onClick={onSkip}>Skip</Button>
      </div>
    </div>
  );
};

const CreatorStep3 = ({ onNext, onBack, onSkip, isLoading }) => {
  const { register, handleSubmit } = useForm();

  const submit = (data) => onNext(data);

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <p className="text-sm text-gray-500">Set optional rates for brands to see your pricing upfront.</p>

      {[
        { key: 'postRate',  label: 'Post / Feed Rate (₹)' },
        { key: 'storyRate', label: 'Story Rate (₹)' },
        { key: 'videoRate', label: 'Video / Reel Rate (₹)' },
      ].map(({ key, label }) => (
        <Input
          key={key}
          label={label}
          type="number"
          placeholder="e.g. 5000"
          min="0"
          {...register(key)}
        />
      ))}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button type="submit" variant="primary" className="flex-1" isLoading={isLoading}>
          Finish Setup
        </Button>
        <Button type="button" variant="ghost" onClick={onSkip}>Skip</Button>
      </div>
    </form>
  );
};

// ─── Business steps ───────────────────────────────────────────────────────────

const bizStep1Schema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  industry:     z.string().min(1, 'Industry is required'),
  description:  z.string().min(20, 'Description must be at least 20 characters'),
});

const INDUSTRY_OPTIONS = [
  { value: 'fashion',      label: 'Fashion & Apparel'     },
  { value: 'food',         label: 'Food & Beverage'       },
  { value: 'tech',         label: 'Technology'            },
  { value: 'beauty',       label: 'Beauty & Cosmetics'    },
  { value: 'fitness',      label: 'Health & Fitness'      },
  { value: 'gaming',       label: 'Gaming'                },
  { value: 'travel',       label: 'Travel & Hospitality'  },
  { value: 'education',    label: 'Education'             },
  { value: 'finance',      label: 'Finance'               },
  { value: 'entertainment',label: 'Entertainment'         },
  { value: 'other',        label: 'Other'                 },
];

const BizStep1 = ({ onNext, onSkip }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(bizStep1Schema),
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <Input label="Business / Brand Name" placeholder="e.g. Zara India" error={errors.businessName?.message} {...register('businessName')} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
        <select
          className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${
            errors.industry ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
          }`}
          {...register('industry')}
        >
          <option value="">Select industry</option>
          {INDUSTRY_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        {errors.industry && <p className="mt-1 text-xs text-red-600">{errors.industry.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          rows={3}
          placeholder="Tell creators about your brand…"
          className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${
            errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
          }`}
          {...register('description')}
        />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" className="flex-1">
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" onClick={onSkip}>Skip</Button>
      </div>
    </form>
  );
};

const BizStep2 = ({ onNext, onBack, onSkip }) => {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <Input label="Website (optional)" type="url" placeholder="https://yourbrand.com" {...register('website')} />
      <Input label="Location" placeholder="City, State" {...register('location')} />

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Typical campaign budget (₹)</p>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Minimum" type="number" placeholder="10000" {...register('budgetMin')} />
          <Input label="Maximum" type="number" placeholder="500000" {...register('budgetMax')} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button type="submit" variant="primary" className="flex-1">
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" onClick={onSkip}>Skip</Button>
      </div>
    </form>
  );
};

const BizStep3 = ({ onNext, onBack, onSkip, isLoading }) => {
  const [logoUrl, setLogoUrl] = useState('');

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Upload your brand logo so creators can identify you instantly.</p>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
        {logoUrl ? (
          <img src={logoUrl} alt="logo preview" className="mx-auto h-24 w-24 rounded-xl object-cover" />
        ) : (
          <div className="text-gray-400">
            <p className="text-sm">Logo upload coming soon (file hosting required)</p>
            <Input
              className="mt-3"
              placeholder="Or paste a logo URL"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button type="button" variant="primary" className="flex-1" isLoading={isLoading} onClick={() => onNext({ logo: logoUrl })}>
          Finish Setup
        </Button>
        <Button type="button" variant="ghost" onClick={onSkip}>Skip</Button>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const user     = useAuthStore((s) => s.user);
  const { updateProfile, isLoading } = useCreatorStore();

  const [step, setStep]     = useState(1);
  const [data, setData]     = useState({});

  const isCreator  = user?.role === 'creator';
  const totalSteps = 3;

  const STEP_TITLES = isCreator
    ? ['Basic Info', 'Social Media', 'Pricing']
    : ['Brand Details', 'Contact & Budget', 'Logo'];

  const mergeAndNext = (stepData) => {
    const merged = { ...data, ...stepData };
    setData(merged);
    if (step < totalSteps) {
      setStep((s) => s + 1);
    } else {
      finalize(merged);
    }
  };

  const finalize = async (finalData) => {
    try {
      await updateProfile(finalData);
      toast.success('Profile set up! Welcome aboard 🎉');
    } catch {
      // non-blocking — proceed anyway
    } finally {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleSkip = () => {
    if (step < totalSteps) setStep((s) => s + 1);
    else navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Zap className="h-7 w-7 text-indigo-600" />
          <span className="text-lg font-extrabold text-gray-900">Creators Bridge</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Set up your profile</h1>
        <p className="text-sm text-gray-500 mb-6">
          {STEP_TITLES[step - 1]} — {isCreator ? 'Creator' : 'Business'} profile
        </p>

        <ProgressBar step={step} total={totalSteps} />

        {isCreator ? (
          <>
            {step === 1 && <CreatorStep1 onNext={mergeAndNext} onSkip={handleSkip} />}
            {step === 2 && <CreatorStep2 onNext={mergeAndNext} onBack={() => setStep(1)} onSkip={handleSkip} />}
            {step === 3 && <CreatorStep3 onNext={mergeAndNext} onBack={() => setStep(2)} onSkip={handleSkip} isLoading={isLoading} />}
          </>
        ) : (
          <>
            {step === 1 && <BizStep1 onNext={mergeAndNext} onSkip={handleSkip} />}
            {step === 2 && <BizStep2 onNext={mergeAndNext} onBack={() => setStep(1)} onSkip={handleSkip} />}
            {step === 3 && <BizStep3 onNext={mergeAndNext} onBack={() => setStep(2)} onSkip={handleSkip} isLoading={isLoading} />}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileSetupPage;
