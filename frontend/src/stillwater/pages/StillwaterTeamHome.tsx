import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { swApi } from '../api/client';
import { useStillwaterAuth } from '../StillwaterAuthContext';
import '../stillwater-home.css';

interface DemoRequest {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  practice: string;
  message?: string;
  status: string;
  createdAt: string;
}

interface ChangeRequest {
  _id: string;
  title: string;
  category: string;
  priority: string;
  status: 'pending' | 'in_progress' | 'completed';
  date: string;
  details?: string;
}

export default function StillwaterTeamHome() {
  const { user, signOut } = useStillwaterAuth();
  const navigate = useNavigate();
  const [demos, setDemos] = useState<DemoRequest[]>([]);
  const [requests, setRequests] = useState<ChangeRequest[]>([]);

  useEffect(() => {
    swApi.get<DemoRequest[]>('/demo-requests').then((r) => setDemos(r.data)).catch(() => {});
    swApi.get<ChangeRequest[]>('/change-requests/admin/all').then((r) => setRequests(r.data)).catch(() => {});
  }, []);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const displayName = (user && 'name' in user && user.name) || 'team member';

  return (
    <div className="stillwater-home">
      <nav className="topbar">
        <a href="/" className="brand">
          <span className="brand-mark"></span>
          Stillwater
        </a>
        <div className="nav-cta">
          <button className="btn btn-ghost" onClick={handleSignOut}>Sign out</button>
        </div>
      </nav>

      <header className="hero" style={{ minHeight: 'auto', paddingBottom: '60px', gridTemplateColumns: '1fr' }}>
        <div className="hero-content" style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
          <div className="eyebrow">Stillwater team</div>
          <h1 className="hero-title">
            Welcome, <em>{displayName}</em>.
          </h1>
          <p className="hero-sub">
            Demo enquiries from practitioners and change requests from active providers.
          </p>
        </div>
      </header>

      <section className="providers" style={{ paddingTop: '40px' }}>
        <div className="section-header" style={{ marginBottom: '40px' }}>
          <div>
            <div className="eyebrow">Demo requests</div>
            <h2 className="section-title">{demos.length} <em>enquiries</em></h2>
          </div>
        </div>
        <div className="tools-grid">
          {demos.length === 0 && (
            <p className="section-header-text">No demo requests yet.</p>
          )}
          {demos.map((d) => (
            <div className="tool-card" key={d._id}>
              <h3>{d.firstName} {d.lastName}</h3>
              <p>
                {d.practice}<br />
                {d.email} · {d.phone}<br />
                {d.message && <em>"{d.message}"</em>}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="providers" style={{ paddingTop: '0' }}>
        <div className="section-header" style={{ marginBottom: '40px' }}>
          <div>
            <div className="eyebrow">Change requests</div>
            <h2 className="section-title">{requests.length} <em>requests</em></h2>
          </div>
        </div>
        <div className="tools-grid">
          {requests.length === 0 && (
            <p className="section-header-text">No change requests yet.</p>
          )}
          {requests.map((r) => (
            <div className="tool-card" key={r._id}>
              <h3>{r.title}</h3>
              <p>
                {r.category} · {r.priority}<br />
                Submitted {r.date}<br />
                Status: {r.status}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
