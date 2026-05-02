import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Globe, Calendar, FileText, Share2, Users,
  MessageSquare, BookOpen, CreditCard, Video, Settings, LogOut, Sparkles,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/website', label: 'Website Builder', icon: Globe },
  { to: '/schedule', label: 'Schedule', icon: Calendar },
  { to: '/blog', label: 'Blog', icon: FileText },
  { to: '/social', label: 'Social Media', icon: Share2 },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/forum', label: 'Forum', icon: MessageSquare },
  { to: '/learning', label: 'Learning Library', icon: BookOpen },
  { to: '/meetings', label: 'Online Sessions', icon: Video },
  { to: '/payments', label: 'Payments', icon: CreditCard },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <div className="font-bold text-gray-900">Yogify</div>
              <div className="text-xs text-gray-500">Studio OS</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV.map((n) => {
            const Active = loc.pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  Active
                    ? 'bg-brand-50 text-brand-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.name}</div>
              <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              nav('/login');
            }}
            className="w-full btn-ghost text-sm"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
    </div>
  );
}
