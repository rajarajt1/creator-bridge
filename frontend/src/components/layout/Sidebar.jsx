import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Search,
  FileText,
  MessageSquare,
  Briefcase,
  Users,
} from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import useChatStore from '../../store/chatStore.js';

const CREATOR_LINKS = [
  { to: '/dashboard',    label: 'Dashboard',       icon: LayoutDashboard },
  { to: '/profile',      label: 'My Profile',      icon: User },
  { to: '/campaigns',    label: 'Find Campaigns',  icon: Search },
  { to: '/applications', label: 'My Applications', icon: FileText },
  { to: '/messages',     label: 'Messages',        icon: MessageSquare },
];

const BUSINESS_LINKS = [
  { to: '/dashboard',    label: 'Dashboard',       icon: LayoutDashboard },
  { to: '/my-campaigns', label: 'My Campaigns',    icon: Briefcase },
  { to: '/creators',     label: 'Find Creators',   icon: Users },
  { to: '/messages',     label: 'Messages',        icon: MessageSquare },
];

const Sidebar = () => {
  const user       = useAuthStore((s) => s.user);
  const unreadMsgs = useChatStore((s) => s.unreadCount);
  const links      = user?.role === 'business' ? BUSINESS_LINKS : CREATOR_LINKS;

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col py-6 min-h-full">
      <nav className="flex-1 space-y-0.5 px-3">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              [
                'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                  {label}
                </span>

                {/* Unread badge on Messages link */}
                {to === '/messages' && unreadMsgs > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                    {unreadMsgs > 99 ? '99+' : unreadMsgs}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
