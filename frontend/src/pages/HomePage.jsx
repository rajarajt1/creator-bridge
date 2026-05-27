import { Link } from 'react-router-dom';
import {
  Zap, Camera, Briefcase, ArrowRight,
  CheckCircle2, Users, Megaphone, Star,
  Instagram, Twitter, Youtube,
  Shield, TrendingUp, MessageSquare, Search,
} from 'lucide-react';

// ─── Static data ──────────────────────────────────────────────────────────────

const STATS = [
  { value: '10,000+', label: 'Verified Creators'  },
  { value: '2,500+',  label: 'Active Brands'      },
  { value: '15,000+', label: 'Campaigns Launched' },
  { value: '₹50Cr+',  label: 'Creator Earnings'   },
];

const CREATOR_STEPS = [
  { icon: Search,     title: 'Build your profile',    desc: 'Showcase your social stats, niche, portfolio and pricing.'      },
  { icon: Megaphone,  title: 'Discover campaigns',    desc: 'Browse hundreds of brand campaigns that match your niche.'      },
  { icon: TrendingUp, title: 'Get paid for your work', desc: 'Apply, collaborate and earn — all in one place.'               },
];

const BRAND_STEPS = [
  { icon: Briefcase,  title: 'Post your campaign',   desc: 'Define your goals, budget, and creator requirements in minutes.' },
  { icon: Users,      title: 'Review applications',  desc: 'Browse creator profiles and select the perfect fit.'            },
  { icon: Star,       title: 'Track performance',    desc: 'Monitor deliverables and measure campaign ROI.'                 },
];

const FEATURES = [
  { icon: Shield,        title: 'Verified Creators',   desc: 'Every creator goes through profile verification for brand safety.' },
  { icon: MessageSquare, title: 'Built-in Messaging',  desc: 'Communicate directly without leaving the platform.'               },
  { icon: TrendingUp,    title: 'Real-time Analytics', desc: 'Track views, applications, and campaign performance live.'         },
  { icon: CheckCircle2,  title: 'Transparent Pricing', desc: "Creators list their rates upfront — no awkward negotiations."      },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma', role: 'Fashion Creator · 210K followers',
    quote: 'Creators Bridge connected me with 5 brands in my first month. The application process is seamless and payouts are transparent.',
    avatar: 'PS', bg: 'bg-pink-500',
  },
  {
    name: 'Rahul Mehta', role: 'Marketing Head, ZStyle India',
    quote: 'We ran our best-performing campaign through Creators Bridge. The creator quality and platform UX are both top-notch.',
    avatar: 'RM', bg: 'bg-indigo-500',
  },
  {
    name: 'Ananya Nair', role: 'Tech Creator · 85K followers',
    quote: "Finally a platform that respects creator pricing. I set my rates and brands come to me — not the other way around.",
    avatar: 'AN', bg: 'bg-purple-500',
  },
];

// ─── Section helpers ──────────────────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-2">{children}</p>
);

const StepCard = ({ icon: Icon, title, desc, number }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm">
        {number}
      </div>
      <div className="mt-2 flex-1 w-px bg-indigo-100" />
    </div>
    <div className="pb-8">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-5 w-5 text-indigo-500" />
        <h4 className="font-semibold text-gray-900">{title}</h4>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const HomePage = () => (
  <div className="min-h-screen bg-white">
    {/* ── Navbar ──────────────────────────────────────────────────────── */}
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-indigo-600" />
          <span className="text-lg font-extrabold text-gray-900">Creators Bridge</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign In</Link>
          <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
            Get Started
          </Link>
        </div>
      </div>
    </nav>

    {/* ── Hero ────────────────────────────────────────────────────────── */}
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <Zap className="h-4 w-4 text-amber-400" />
          India's fastest-growing influencer platform
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-5 tracking-tight">
          Bridge Between <span className="text-amber-400">Creators</span> and <span className="text-amber-400">Brands</span>
        </h1>
        <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
          The all-in-one platform where content creators discover brand campaigns and businesses find their perfect creative voice.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/register" className="flex items-center gap-2 px-6 py-3.5 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg w-full sm:w-auto justify-center">
            <Camera className="h-5 w-5" /> Join as Creator
          </Link>
          <Link to="/register" className="flex items-center gap-2 px-6 py-3.5 bg-amber-400 text-gray-900 font-semibold rounded-xl hover:bg-amber-300 transition-colors shadow-lg w-full sm:w-auto justify-center">
            <Briefcase className="h-5 w-5" /> I'm a Brand
          </Link>
        </div>
        <p className="mt-6 text-indigo-200 text-sm">Free to sign up · No credit card required</p>
      </div>
    </section>

    {/* ── Stats ───────────────────────────────────────────────────────── */}
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-indigo-600">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── How it works ────────────────────────────────────────────────── */}
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Simple for creators. Powerful for brands.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-indigo-100 rounded-xl"><Camera className="h-5 w-5 text-indigo-600" /></div>
              <h3 className="text-lg font-bold text-gray-900">For Creators</h3>
            </div>
            {CREATOR_STEPS.map((s, i) => <StepCard key={s.title} {...s} number={i + 1} />)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-amber-100 rounded-xl"><Briefcase className="h-5 w-5 text-amber-600" /></div>
              <h3 className="text-lg font-bold text-gray-900">For Brands</h3>
            </div>
            {BRAND_STEPS.map((s, i) => <StepCard key={s.title} {...s} number={i + 1} />)}
          </div>
        </div>
      </div>
    </section>

    {/* ── Features ────────────────────────────────────────────────────── */}
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <SectionLabel>Platform Features</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Everything you need to collaborate</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Testimonials ────────────────────────────────────────────────── */}
    <section className="py-20 bg-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <SectionLabel>Testimonials</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Loved by creators &amp; brands</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, role, quote, avatar, bg }) => (
            <div key={name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex gap-0.5 mb-4">
                {[1,2,3,4,5].map((s) => <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">"{quote}"</p>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 ${bg} rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{name}</p>
                  <p className="text-xs text-gray-400">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA ─────────────────────────────────────────────────────────── */}
    <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to bridge the gap?</h2>
        <p className="text-indigo-200 text-lg mb-8">Join thousands of creators and brands already collaborating on Creators Bridge.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/register" className="px-7 py-3.5 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center">
            Create Free Account <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/login" className="px-7 py-3.5 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors w-full sm:w-auto">
            Sign In
          </Link>
        </div>
      </div>
    </section>

    {/* ── Footer ──────────────────────────────────────────────────────── */}
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-6 w-6 text-indigo-400" />
              <span className="text-lg font-extrabold text-white">Creators Bridge</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">Connecting India's best content creators with brands that share their vision.</p>
            <div className="flex gap-3 mt-4">
              {[Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-3">Platform</p>
            <ul className="space-y-2 text-sm">
              {[{ label: 'Find Creators', to: '/creators' }, { label: 'Browse Campaigns', to: '/campaigns' }].map(({ label, to }) => (
                <li key={label}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-3">Legal</p>
            <ul className="space-y-2 text-sm">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map((l) => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-xs text-center">
          © {new Date().getFullYear()} Creators Bridge. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
);

export default HomePage;
