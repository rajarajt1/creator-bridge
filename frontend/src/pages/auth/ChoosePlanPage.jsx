import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Sparkles, Building, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore.js';
import api from '../../utils/axios.js';
import Button from '../../components/ui/Button.jsx';

const CREATOR_PLANS = [
  {
    id: 'free',
    name: 'Free Starter',
    icon: Zap,
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: 'border-gray-200 bg-white text-gray-900',
    btnVariant: 'outline',
    features: [
      'Apply to 3 campaigns per month',
      'Basic profile visibility',
      'Standard messaging access',
      'Standard support responses',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Creator',
    icon: Sparkles,
    monthlyPrice: 499,
    yearlyPrice: 399,
    popular: true,
    color: 'border-indigo-600 ring-2 ring-indigo-600 bg-indigo-50/50 text-gray-900',
    btnVariant: 'primary',
    features: [
      'Apply to unlimited campaigns',
      'Featured profile placement',
      'Verified partner badge',
      'Advanced reach analytics',
      'Priority support access',
    ],
  },
  {
    id: 'elite',
    name: 'Elite Star',
    icon: Crown,
    monthlyPrice: 999,
    yearlyPrice: 799,
    color: 'border-purple-600 bg-purple-50/30 text-gray-900',
    btnVariant: 'outline',
    features: [
      'All Pro Creator features',
      'Direct brand pitching tools',
      'Revenue generation metrics',
      'Custom profile branding',
      '24/7 dedicated assistance',
    ],
  },
];

const BUSINESS_PLANS = [
  {
    id: 'free',
    name: 'Free Basic',
    icon: Building,
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: 'border-gray-200 bg-white text-gray-900',
    btnVariant: 'outline',
    features: [
      'Post 1 active campaign',
      'View first 5 applications',
      'Standard filters & matching',
      'Email support',
    ],
  },
  {
    id: 'growth',
    name: 'Brand Growth',
    icon: Sparkles,
    monthlyPrice: 1999,
    yearlyPrice: 1599,
    popular: true,
    color: 'border-indigo-600 ring-2 ring-indigo-600 bg-indigo-50/50 text-gray-900',
    btnVariant: 'primary',
    features: [
      'Post up to 5 active campaigns',
      'View all applications',
      'Advanced creator filters',
      'Custom contract templates',
      'Priority support responses',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Scale',
    icon: Crown,
    monthlyPrice: 4999,
    yearlyPrice: 3999,
    color: 'border-purple-600 bg-purple-50/30 text-gray-900',
    btnVariant: 'outline',
    features: [
      'Post unlimited campaigns',
      'Dedicated account manager',
      'Featured campaign placement',
      'Early access to top creators',
      'API access & custom analytics',
    ],
  },
];

const ChoosePlanPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const updateUserStore = useAuthStore((s) => s.updateUser);

  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCreator = user?.role === 'creator';
  const plans = isCreator ? CREATOR_PLANS : BUSINESS_PLANS;
  const dashboardPath = isCreator ? '/dashboard' : '/business-dashboard';

  const handleSubscribe = async (planId) => {
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/users/subscribe', { plan: planId });
      if (data.success) {
        updateUserStore(data.user);
        toast.success(`Welcome to the ${data.user.subscriptionPlan} plan! 🎉`);
        navigate(dashboardPath, { replace: true });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to update subscription');
    } finally {
      setIsSubmitting(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Zap className="h-3.5 w-3.5" /> Subscription Plan
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Choose your journey
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Unlock the ultimate collaboration opportunities on Creators Bridge. No hidden fees.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="flex items-center justify-center gap-3 pt-6">
            <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-400'}`}>Monthly</span>
            <button
              type="button"
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-indigo-600 transition-colors duration-200 ease-in-out focus:outline-none"
              aria-label="Toggle billing interval"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isYearly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-gray-900' : 'text-gray-400'} flex items-center gap-1.5`}>
              Yearly <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const savings = isYearly ? (plan.monthlyPrice - plan.yearlyPrice) * 12 : 0;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${plan.color}`}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className={`p-2 rounded-xl bg-gray-100 ${plan.popular ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-extrabold tracking-tight">₹{price}</span>
                      <span className="ml-1 text-sm text-gray-500">/month</span>
                    </div>
                    {isYearly && plan.monthlyPrice > 0 && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        Billed yearly (Save ₹{savings}/yr)
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <Check className="h-4.5 w-4.5 text-green-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant={plan.btnVariant}
                  onClick={() => setSelectedPlan(plan)}
                  className="w-full mt-auto"
                >
                  Choose {plan.name.split(' ')[0]}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => navigate(dashboardPath)}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
          >
            Skip for now & continue to dashboard →
          </button>
        </div>

        {/* Confirmation Modal */}
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4 border border-gray-200 transform scale-100 transition-all duration-300">
              <div className="text-center">
                <div className="inline-flex p-3 rounded-full bg-indigo-50 text-indigo-600 mb-3">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Confirm subscription?</h3>
                <p className="text-sm text-gray-500 mt-2">
                  You are subscribing to the <span className="font-semibold text-gray-800">{selectedPlan.name}</span>.
                </p>
                <p className="text-xs text-gray-400 mt-1 italic">
                  Note: Payment via Razorpay is simulated and will be skipped for this demo.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  className="flex-1"
                  isLoading={isSubmitting}
                  onClick={() => handleSubscribe(selectedPlan.id)}
                >
                  Confirm & Pay
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedPlan(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChoosePlanPage;
