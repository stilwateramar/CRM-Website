import { Routes, Route, Navigate } from 'react-router-dom';
import { useStillwaterAuth } from './stillwater/StillwaterAuthContext';
import StillwaterHome from './stillwater/pages/StillwaterHome';
import StillwaterAdmin from './stillwater/admin/StillwaterAdmin';
import SeekerHome from './stillwater/pages/SeekerHome';
import StudentHome from './stillwater/pages/StudentHome';
import StillwaterTeamHome from './stillwater/pages/StillwaterTeamHome';

type Role = 'seeker' | 'student' | 'provider' | 'admin';

function RequireRole({ role, children }: { role: Role; children: JSX.Element }) {
  const { user, loading } = useStillwaterAuth();
  if (loading) return <div className="p-10 text-gray-500">Loading…</div>;
  if (!user || user.type !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StillwaterHome />} />
      <Route path="/admin" element={<RequireRole role="provider"><StillwaterAdmin /></RequireRole>} />
      <Route path="/seeker" element={<RequireRole role="seeker"><SeekerHome /></RequireRole>} />
      <Route path="/student" element={<RequireRole role="student"><StudentHome /></RequireRole>} />
      <Route path="/stillwater-team" element={<RequireRole role="admin"><StillwaterTeamHome /></RequireRole>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
