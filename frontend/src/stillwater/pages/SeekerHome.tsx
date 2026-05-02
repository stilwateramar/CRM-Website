import { useNavigate } from 'react-router-dom';
import { useStillwaterAuth } from '../StillwaterAuthContext';
import '../stillwater-home.css';

export default function SeekerHome() {
  const { user, signOut } = useStillwaterAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const displayName = (user && 'name' in user && user.name) || 'seeker';

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

      <header className="hero" style={{ minHeight: '80vh' }}>
        <div className="hero-content">
          <div className="eyebrow">Welcome back</div>
          <h1 className="hero-title">
            A quiet hello, <em>{displayName}</em>.
          </h1>
          <p className="hero-sub">
            Your seeker space is opening. Find practitioners, follow practices, and continue your journey to stillness.
          </p>
        </div>
        <div className="hero-visual">
          <div className="meditation-orb">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
            <div className="center-orb"></div>
          </div>
        </div>
      </header>
    </div>
  );
}
