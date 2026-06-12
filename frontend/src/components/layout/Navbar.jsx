import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  BriefcaseBusiness,
  Users,
  MessageSquare,
  Bell,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  Search,
  Plus,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import useChatStore from '../../store/chatStore.js';
import useNotificationStore from '../../store/notificationStore.js';
import Avatar from '../ui/Avatar.jsx';

// ─── Per-role nav links ───────────────────────────────────────────────────────

const creatorLinks = [
  { to: '/dashboard',    label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/campaigns',    label: 'Find Campaigns',  icon: Search },
];

const businessLinks = [
  { to: '/business-dashboard', label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/campaigns/create', label: 'Post Campaign',  icon: Plus },
  { to: '/creators',     label: 'Find Creators',  icon: Users },
];

// ─── Notification dot ─────────────────────────────────────────────────────────

const CountBadge = ({ count }) =>
  count > 0 ? (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
      {count > 99 ? '99+' : count}
    </span>
  ) : null;

// ─── Component ────────────────────────────────────────────────────────────────

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const unreadMessages      = useChatStore((s) => s.unreadCount);
  const unreadNotifications = useNotificationStore((s) => s.unreadCount);
  const navigate = useNavigate();

  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = user?.role === 'business' ? businessLinks : creatorLinks;

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-1.5 text-sm font-medium px-1 py-0.5 transition-colors ${
      isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* ── Logo ──────────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2">
            <BriefcaseBusiness className="h-7 w-7 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Creators<span className="text-indigo-600">Bridge</span>
            </span>
          </Link>

          {/* ── Desktop nav ───────────────────────────────────────────── */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} end={to === '/dashboard' || to === '/business-dashboard'} className={linkClass}>
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
          )}

          {/* ── Right side ────────────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Messages */}
                <NavLink
                  to="/messages"
                  className={({ isActive }) =>
                    `relative p-2 rounded-lg transition-colors ${
                      isActive ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:bg-gray-100'
                    }`
                  }
                  aria-label="Messages"
                >
                  <MessageSquare className="h-5 w-5" />
                  <CountBadge count={unreadMessages} />
                </NavLink>

                {/* Notifications */}
                <NavLink
                  to="/notifications"
                  className={({ isActive }) =>
                    `relative p-2 rounded-lg transition-colors ${
                      isActive ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:bg-gray-100'
                    }`
                  }
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <CountBadge count={unreadNotifications} />
                </NavLink>

                {/* Avatar dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((o) => !o)}
                    className="flex items-center gap-1.5 rounded-lg p-1 hover:bg-gray-100 transition-colors"
                    aria-haspopup="menu"
                    aria-expanded={dropdownOpen}
                  >
                    <Avatar src={user?.avatar} name={user?.name} size="sm" showBadge={user?.verificationBadge} />
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>

                      <button
                        onClick={() => { setDropdownOpen(false); navigate(user?.role === 'creator' ? '/my-profile' : '/business-dashboard'); }}  
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="h-4 w-4" /> Profile
                      </button>
                      <button
                        onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="h-4 w-4" /> Settings
                      </button>

                      <div className="border-t border-gray-100 mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            {isAuthenticated && (
              <button
                className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>

        {/* ── Mobile menu ──────────────────────────────────────────────── */}
        {isAuthenticated && mobileOpen && (
          <nav className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/dashboard'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
