import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Camera, Briefcase, ArrowRight,
  CheckCircle2, Users, Megaphone, Star,
  Instagram, Twitter, Youtube,
  Shield, TrendingUp, MessageSquare, Search, Sparkles,
} from 'lucide-react';

// ─── Static data ──────────────────────────────────────────────────────────────

const STATS = [
  { value: '10,000+', label: 'Verified Creators', icon: Sparkles, color: 'text-indigo-400' },
  { value: '2,500+',  label: 'Active Brands', icon: Users, color: 'text-amber-400' },
  { value: '15,000+', label: 'Campaigns Launched', icon: Megaphone, color: 'text-pink-400' },
  { value: '₹50Cr+',  label: 'Creator Earnings', icon: TrendingUp, color: 'text-emerald-400' },
];

const CREATOR_STEPS = [
  { icon: Search,     title: 'Build your profile',    desc: 'Showcase your social stats, niche, portfolio and pricing in a high-conversion media kit.' },
  { icon: Megaphone,  title: 'Discover campaigns',    desc: 'Browse hundreds of verified brand campaigns matching your audience metrics and niche.' },
  { icon: TrendingUp, title: 'Get paid for your work', desc: 'Securely apply, collaborate in real-time, and get paid with instant disbursements.' },
];

const BRAND_STEPS = [
  { icon: Briefcase,  title: 'Post your campaign',   desc: 'Define deliverables, budgets, target audience, and creator requirements in minutes.' },
  { icon: Users,      title: 'Review applications',  desc: 'Screen creators by engagement, verify analytics, and hire the perfect match.' },
  { icon: Star,       title: 'Track performance',    desc: 'Monitor content submissions, track active reach, and measure exact campaign ROI.' },
];

const FEATURES = [
  { icon: Shield,        title: 'Verified Profiles',   desc: 'Rest easy knowing every single creator profile undergoes multi-factor analytics verification.' },
  { icon: MessageSquare, title: 'Instant Chat Rooms',  desc: 'Collaborate in real-time with integrated typing states, read receipts, and live file uploads.' },
  { icon: TrendingUp,    title: 'Live Campaign Stats', desc: 'Watch your engagement, views, and reach climb with our real-time analytics dashboard.' },
  { icon: CheckCircle2,  title: 'Transparent Pricing', desc: "Say goodbye to awkward back-and-forth negotiations. Creators set rates upfront." },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma', role: 'Fashion & Lifestyle · 210K followers',
    quote: 'Creators Bridge transformed my workflow. I secured partnerships with 5 major brands in my first month, and payouts were incredibly prompt.',
    avatar: 'PS', bg: 'from-pink-500 to-rose-500', rating: 5
  },
  {
    name: 'Rahul Mehta', role: 'Marketing Lead, ZStyle India',
    quote: 'Finding creators who match our precise target audience used to take weeks. With Creators Bridge, we launched our holiday campaign in 48 hours.',
    avatar: 'RM', bg: 'from-indigo-500 to-violet-500', rating: 5
  },
  {
    name: 'Ananya Nair', role: 'Tech & Gadgets · 85K followers',
    quote: "I love the transparency of setting my own rates and having brands apply directly to collaborate with me. The platform experience is second to none.",
    avatar: 'AN', bg: 'from-purple-500 to-fuchsia-500', rating: 5
  },
];

// ─── Section helpers ──────────────────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 rounded-full border border-indigo-500/20 mb-3">
    <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
    {children}
  </span>
);

const StepCard = ({ icon: Icon, title, desc, number }) => (
  <div className="flex gap-4 group">
    <div className="flex flex-col items-center">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-indigo-400 font-extrabold text-sm group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white transition-all duration-300 shadow-md">
        {number}
      </div>
      <div className="mt-2 flex-1 w-px bg-slate-800 group-hover:bg-indigo-500/30 transition-all duration-300" />
    </div>
    <div className="pb-8">
      <div className="flex items-center gap-2.5 mb-1.5">
        <Icon className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
        <h4 className="font-semibold text-slate-200 group-hover:text-white transition-colors duration-300">{title}</h4>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">{desc}</p>
    </div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('creator');

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-hidden">
      
      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-indigo-950/20 rounded-full blur-[160px] pointer-events-none" />

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#070b19]/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Creators <span className="text-indigo-400">Bridge</span>
            </span>
          </div>
          
          <div className="hidden sm:flex items-center gap-6">
            <Link to="/creators" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Find Creators</Link>
            <Link to="/campaigns" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Campaigns</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="relative group overflow-hidden px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-20 md:py-32">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-8">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            Connecting Brands & Creators across India
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.15] mb-6 tracking-tight text-white">
            Unite Your Brand with <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              Creative Visionaries
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            The premium creator ecosystem. We eliminate intermediate friction, offering direct communication, real-time metrics, and verified partnerships.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link to="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-white/5">
              <Camera className="h-5 w-5 text-indigo-600" /> 
              Join as Creator
            </Link>
            <Link to="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 bg-slate-900 border border-slate-700/80 text-white font-bold rounded-xl hover:bg-slate-800 hover:border-slate-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              <Briefcase className="h-5 w-5 text-purple-400" /> 
              Hire Creators
            </Link>
          </div>
          
          <p className="mt-6 text-slate-500 text-xs tracking-wide">Free registration · Direct payments · Real-time analytics</p>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────── */}
      <section className="relative py-12 bg-slate-950/60 border-y border-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label, icon: Icon, color }) => (
              <div key={label} className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-900/30 border border-slate-800/20 backdrop-blur-sm">
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800/80 mb-3 shadow-inner">
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
                <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <SectionLabel>Process Flow</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Simplified Workflows. Maximum Value.
            </h2>
            <p className="text-slate-400 mt-3 text-sm max-w-xl mx-auto">
              Choose your profile type to see how easily you can scale campaigns or land lucrative brand collaborations.
            </p>

            {/* Segment Tab Selector */}
            <div className="inline-flex p-1.5 bg-slate-900/80 border border-slate-800 rounded-2xl mt-8 font-sans">
              <button
                onClick={() => setActiveTab('creator')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'creator' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <Camera className="h-4 w-4" /> For Creators
              </button>
              <button
                onClick={() => setActiveTab('brand')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'brand' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <Briefcase className="h-4 w-4" /> For Brands
              </button>
            </div>
          </div>

          <div className="max-w-2xl mx-auto bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-2xl relative">
            <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 rounded-full text-xs font-semibold text-indigo-300 backdrop-blur">
              {activeTab === 'creator' ? '3 Easy Steps to Earn' : 'Launch in Under 10 Minutes'}
            </div>
            
            <div className="space-y-6">
              {activeTab === 'creator' ? (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20"><Camera className="h-6 w-6 text-indigo-400" /></div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Creator Journey</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Grow your audience, display statistics, get paid</p>
                    </div>
                  </div>
                  {CREATOR_STEPS.map((s, i) => <StepCard key={s.title} {...s} number={i + 1} />)}
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20"><Briefcase className="h-6 w-6 text-indigo-400" /></div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Brand Platform</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Define milestones, browse creators, track conversions</p>
                    </div>
                  </div>
                  {BRAND_STEPS.map((s, i) => <StepCard key={s.title} {...s} number={i + 1} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-950/40 border-y border-slate-900 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <SectionLabel>Platform Capabilities</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Designed for high-impact results
            </h2>
            <p className="text-slate-400 mt-3 text-sm max-w-xl mx-auto">
              Our enterprise features guarantee that campaigns run securely, transparently, and at lightning speed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group relative bg-[#0d1224]/50 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 hover:bg-[#11172f]/60 hover:shadow-xl transition-all duration-300">
                <div className="h-12 w-12 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white transition-all duration-300">
                  <Icon className="h-5 w-5 text-indigo-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h4 className="font-semibold text-slate-100 mb-2 text-base group-hover:text-white transition-colors">{title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <SectionLabel>Client Success</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Trusted by creators and brands
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, quote, avatar, bg, rating }) => (
              <div key={name} className="relative bg-[#0d1224]/30 border border-slate-800/50 backdrop-blur-sm rounded-2xl p-7 flex flex-col justify-between hover:border-slate-800 transition-colors">
                <div>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed italic mb-6">"{quote}"</p>
                </div>
                <div className="flex items-center gap-3.5 pt-4 border-t border-slate-900">
                  <div className={`h-10 w-10 rounded-full bg-gradient-to-tr ${bg} flex items-center justify-center text-white text-sm font-bold shadow-md shrink-0`}>
                    {avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{name}</p>
                    <p className="text-xs text-slate-400 font-medium">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden bg-slate-950 border-t border-slate-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight text-white">
            Ready to scale your reach?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Create your profile in under 2 minutes. Start collaborating directly with verified agencies and top talent today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link to="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              Create Free Account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-slate-800 bg-slate-950 text-slate-300 font-semibold rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-700 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-500 py-16 border-t border-slate-900 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-7 w-7 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-md font-bold text-white tracking-tight">
                  Creators <span className="text-indigo-400">Bridge</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm text-slate-400">
                India's premier influencer marketing middleware. Providing analytics transparency, custom campaign post builders, and built-in secure chats.
              </p>
              <div className="flex gap-3 mt-6">
                {[Twitter, Instagram, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:text-white transition-all duration-300">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Platform</p>
              <ul className="space-y-3 text-sm">
                <li><Link to="/creators" className="hover:text-white transition-colors">Find Creators</Link></li>
                <li><Link to="/campaigns" className="hover:text-white transition-colors">Browse Campaigns</Link></li>
              </ul>
            </div>
            
            <div>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Company &amp; Legal</p>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-900 pt-8 text-xs text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Creators Bridge. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
                All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
