import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, CreditCard, FileText, ChevronRight } from 'lucide-react';
import { api } from '../api/client';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({ totalRevenue: 0, monthRevenue: 0, successfulPayments: 0 });
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.get('/payments/stats').catch(() => ({ data: stats })),
      api.get('/classes').catch(() => ({ data: [] })),
      api.get('/students').catch(() => ({ data: [] })),
    ]).then(([s, c, st]) => {
      setStats(s.data);
      setClasses((c.data || []).filter((x: any) => new Date(x.startTime) >= new Date()).slice(0, 5));
      setStudents((st.data || []).slice(0, 5));
    });
  }, []);

  return (
    <div className="p-8">
      <PageHeader title={`Welcome back, ${user?.name?.split(' ')[0]}`} subtitle="Here's what's happening at your studio." />

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Stat label="This month revenue" value={`₹${stats.monthRevenue.toLocaleString()}`} icon={CreditCard} />
        <Stat label="Total revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={CreditCard} />
        <Stat label="Upcoming classes" value={String(classes.length)} icon={Calendar} />
        <Stat label="Students" value={String(students.length)} icon={Users} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Upcoming classes</h2>
            <Link to="/schedule" className="text-sm text-brand-600 flex items-center">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          {classes.length === 0 ? (
            <p className="text-sm text-gray-500">No upcoming classes. Schedule one to get started.</p>
          ) : (
            <ul className="space-y-3">
              {classes.map((c) => (
                <li key={c._id} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0">
                  <div>
                    <div className="font-medium">{c.title}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(c.startTime).toLocaleString()} · {c.type}
                    </div>
                  </div>
                  <span className="badge bg-brand-100 text-brand-700">{c.level}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent students</h2>
            <Link to="/students" className="text-sm text-brand-600 flex items-center">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          {students.length === 0 ? (
            <p className="text-sm text-gray-500">No students yet. Import your contacts to get started.</p>
          ) : (
            <ul className="space-y-3">
              {students.map((s) => (
                <li key={s._id} className="flex items-center gap-3 border-b last:border-0 pb-3 last:pb-0">
                  <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm">
                    {s.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.email}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <QuickAction to="/website" icon={FileText} title="Update your website" desc="Edit content & publish." />
        <QuickAction to="/blog" icon={FileText} title="Write a blog with AI" desc="Generate a draft in seconds." />
        <QuickAction to="/social" icon={FileText} title="Convert to a reel" desc="Turn class video into a reel." />
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: any) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
          <Icon size={18} />
        </div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function QuickAction({ to, icon: Icon, title, desc }: any) {
  return (
    <Link to={to} className="card hover:shadow-md transition flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
        <Icon size={18} />
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-500">{desc}</div>
      </div>
    </Link>
  );
}
