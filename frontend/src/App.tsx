import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WebsiteBuilder from './pages/WebsiteBuilder';
import Schedule from './pages/Schedule';
import Blog from './pages/Blog';
import SocialMedia from './pages/SocialMedia';
import Students from './pages/Students';
import Forum from './pages/Forum';
import Learning from './pages/Learning';
import Meetings from './pages/Meetings';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import PublicSite from './pages/PublicSite';

function Protected({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-gray-500">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/site/:slug" element={<PublicSite />} />

      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/website" element={<Protected><WebsiteBuilder /></Protected>} />
      <Route path="/schedule" element={<Protected><Schedule /></Protected>} />
      <Route path="/blog" element={<Protected><Blog /></Protected>} />
      <Route path="/social" element={<Protected><SocialMedia /></Protected>} />
      <Route path="/students" element={<Protected><Students /></Protected>} />
      <Route path="/forum" element={<Protected><Forum /></Protected>} />
      <Route path="/learning" element={<Protected><Learning /></Protected>} />
      <Route path="/meetings" element={<Protected><Meetings /></Protected>} />
      <Route path="/payments" element={<Protected><Payments /></Protected>} />
      <Route path="/settings" element={<Protected><Settings /></Protected>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
