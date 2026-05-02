import { useEffect, useRef, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { swApi } from '../api/client';
import { useStillwaterAuth } from '../StillwaterAuthContext';
import '../stillwater-home.css';

type TabName = 'seeker' | 'student' | 'provider' | 'admin';

export default function StillwaterHome() {
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState<TabName>('seeker');
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [seekerMethod, setSeekerMethod] = useState<'mobile' | 'email'>('mobile');
  const rootRef = useRef<HTMLDivElement>(null);
  const { signIn } = useStillwaterAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  useEffect(() => {
    if (!rootRef.current) return;
    const targets = rootRef.current.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    targets.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = (i % 4) * 80 + 'ms';
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  function openModal(mode: 'login' | 'signup', initialTab: TabName = 'seeker') {
    setIsSignupMode(mode === 'signup');
    setTab(initialTab);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <div ref={rootRef} className="stillwater-home">
      {/* ============== TOP NAV ============== */}
      <nav className={`topbar${scrolled ? ' scrolled' : ''}`}>
        <a href="#" className="brand">
          <span className="brand-mark"></span>
          Stillwater
        </a>
        <div className="nav-links">
          <a href="#vision">Vision</a>
          <a href="#tools" className="provider-link">For Holistic Health Providers →</a>
          <a href="#demo">Contact</a>
        </div>
        <div className="nav-cta">
          <button className="btn btn-ghost" onClick={() => openModal('login')}>Log in</button>
          <button className="btn btn-solid" onClick={() => openModal('signup')}>Sign up</button>
        </div>
      </nav>

      {/* ============== HERO ============== */}
      <header className="hero" id="vision">
        <div className="hero-content">
          <div className="eyebrow reveal">A global community for holistic wellness</div>
          <h1 className="hero-title reveal">
            Stillness in a <em>restless</em> world,<br />
            guided by the <em>quiet intelligence</em> of AI.
          </h1>
          <p className="hero-sub reveal">
            Stillwater unites seekers and holistic health providers across the world — yoga, meditation, ayurveda, breathwork — through an AI-powered ecosystem that honours ancient practice and modern craft.
          </p>
          <div className="hero-cta-row reveal">
            <button className="btn btn-solid btn-lg" onClick={() => openModal('signup')}>Begin your journey →</button>
            <a href="#tools" className="btn btn-ghost btn-lg">For practitioners</a>
          </div>
          <div className="seeker-count reveal">
            <div className="avatar-stack">
              <span></span><span></span><span></span><span></span>
            </div>
            <span><strong style={{ fontWeight: 500, color: 'var(--ink)' }}>Hundreds of seekers</strong> have already found their stillness.</span>
          </div>
        </div>

        <div className="hero-visual reveal">
          <div className="meditation-orb">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
            <div className="center-orb"></div>
          </div>
          <div className="floating-tag tag-1"><span className="dot"></span> Yoga</div>
          <div className="floating-tag tag-2"><span className="dot"></span> Meditation</div>
          <div className="floating-tag tag-3"><span className="dot"></span> Ayurveda</div>
        </div>
      </header>

      {/* ============== AI TOOLS FOR PROVIDERS ============== */}
      <section className="providers" id="tools">
        <div className="section-header">
          <div className="reveal">
            <div className="eyebrow">For Holistic Health Providers</div>
            <h2 className="section-title">
              AI tools that <em>honour</em> the practice — and grow it.
            </h2>
          </div>
          <p className="section-header-text reveal">
            Yoga teachers, meditation guides, and wellness practitioners deserve technology that protects their craft. Stillwater's intelligent toolkit handles the noise so you can focus on the silence.
          </p>
        </div>

        <div className="tools-grid">

          <div className="tool-card reveal">
            <span className="tool-number">i.</span>
            <div className="tool-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                <circle cx="9" cy="10" r="1" fill="currentColor"/>
                <circle cx="13" cy="10" r="1" fill="currentColor"/>
                <circle cx="17" cy="10" r="1" fill="currentColor"/>
              </svg>
            </div>
            <h3>AI Agentic <em>CRM</em></h3>
            <p>An intelligent agent that nurtures every student relationship — from first enquiry to lifelong practice. Books sessions, follows up gently, remembers what each seeker needs, and frees you from the inbox.</p>
            <a href="#" className="video-link" onClick={(e) => { e.preventDefault(); alert('Demo video coming soon — replace this with your hosted video link.'); }}>
              <span className="play-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </span>
              Watch a 90-second demo
            </a>
          </div>

          <div className="tool-card reveal">
            <span className="tool-number">ii.</span>
            <div className="tool-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18"/>
                <path d="M9 21V9"/>
              </svg>
            </div>
            <h3>AI Website <em>Builder</em></h3>
            <p>Describe your practice in a sentence. Receive a serene, fully responsive website — with class schedules, booking, payments, and your story told beautifully. No designers, no developers, no compromise.</p>
            <a href="#" className="video-link" onClick={(e) => { e.preventDefault(); alert('Demo video coming soon — replace this with your hosted video link.'); }}>
              <span className="play-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </span>
              Watch a 90-second demo
            </a>
          </div>

          <div className="tool-card reveal">
            <span className="tool-number">iii.</span>
            <div className="tool-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2"/>
              </svg>
            </div>
            <h3>AI Video for <em>social media</em></h3>
            <p>Turn one short clip into a week of social content. Reels, shorts, and meditative trailers — captioned, branded, and platform-ready. Reach the seekers who are quietly searching for you.</p>
            <a href="#" className="video-link" onClick={(e) => { e.preventDefault(); alert('Demo video coming soon — replace this with your hosted video link.'); }}>
              <span className="play-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </span>
              Watch a 90-second demo
            </a>
          </div>

          <div className="tool-card reveal">
            <span className="tool-number">iv.</span>
            <div className="tool-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h3>AI <em>Avatar</em> Generation</h3>
            <p>A composed, studio-quality digital likeness of you — for thumbnails, course pages, and guided sessions. Always camera-ready. Always recognisable. Always you.</p>
            <a href="#" className="video-link" onClick={(e) => { e.preventDefault(); alert('Demo video coming soon — replace this with your hosted video link.'); }}>
              <span className="play-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </span>
              Watch a 90-second demo
            </a>
          </div>

        </div>
      </section>

      {/* ============== DEMO REQUEST ============== */}
      <DemoSection />

      {/* ============== FOOTER ============== */}
      <footer>
        <div className="footer-wrap">
          <div className="footer-brand">
            <a href="#" className="brand">
              <span className="brand-mark"></span>
              Stillwater
            </a>
            <p>The global community of holistic healing — where ancient practice meets the quiet craft of intelligent technology.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><a href="#vision">Our Vision</a></li>
              <li><a href="#tools">For Practitioners</a></li>
              <li><a href="#demo">Request a Demo</a></li>
            </ul>
          </div>
          <div>
            <h4>Account</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); openModal('login', 'seeker'); }}>Seeker login</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); openModal('login', 'provider'); }}>Provider login</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); openModal('login', 'student'); }}>Student login</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); openModal('login', 'admin'); }}>Admin</a></li>
            </ul>
          </div>
          <div>
            <h4>Connect</h4>
            <ul>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Stillwater. All rights reserved.</span>
          <span className="quote">"Healing is a matter of time, but it is sometimes also a matter of opportunity."</span>
        </div>
      </footer>

      {/* ============== AUTH MODAL ============== */}
      <div
        className={`modal-overlay${modalOpen ? ' active' : ''}`}
        onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      >
        <div className="modal">
          <button className="modal-close" onClick={closeModal} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>

          <div className="modal-tabs">
            {(['seeker', 'student', 'provider', 'admin'] as TabName[]).map((t) => (
              <button
                key={t}
                className={`modal-tab${tab === t ? ' active' : ''}`}
                onClick={() => setTab(t)}
              >
                {t === 'seeker' ? 'Seeker' : t === 'student' ? 'Student' : t === 'provider' ? 'Provider' : 'Admin'}
              </button>
            ))}
          </div>

          <div className="modal-body">

            {/* SEEKER PANE */}
            <div className={`modal-pane${tab === 'seeker' ? ' active' : ''}`}>
              <div className="modal-header">
                <h3>{isSignupMode ? <>Begin your <em>journey</em></> : <>Welcome, <em>seeker</em></>}</h3>
                <p>{isSignupMode ? 'Sign up in seconds. Welcome to the community.' : 'Begin or continue your journey to stillness.'}</p>
              </div>

              <div className="toggle-method">
                <button className={seekerMethod === 'mobile' ? 'active' : ''} onClick={() => setSeekerMethod('mobile')}>Mobile</button>
                <button className={seekerMethod === 'email' ? 'active' : ''} onClick={() => setSeekerMethod('email')}>Email</button>
              </div>

              <SeekerForm
                method={seekerMethod}
                onSignedIn={(token, user) => {
                  signIn(token, user);
                  closeModal();
                  navigate('/seeker');
                }}
              />

              <div className="modal-divider">or</div>

              <button className="social-btn" onClick={() => alert('Google sign-in flow goes here.')}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <p className="modal-footer-text">
                New to Stillwater? <a onClick={() => setIsSignupMode(!isSignupMode)}>Create an account</a>
              </p>
            </div>

            {/* STUDENT PANE */}
            <div className={`modal-pane${tab === 'student' ? ' active' : ''}`}>
              <div className="modal-header">
                <h3>Student <em>access</em></h3>
                <p>Enter the code given to you by your teacher.</p>
              </div>

              <div className="info-banner">
                You'll find your access code in the welcome message from your yoga, meditation, or wellness teacher.
              </div>

              <StudentForm
                onSignedIn={(token, user) => {
                  signIn(token, user);
                  closeModal();
                  navigate('/student');
                }}
                onSeeker={() => setTab('seeker')}
              />
            </div>

            {/* PROVIDER PANE */}
            <div className={`modal-pane${tab === 'provider' ? ' active' : ''}`}>
              <div className="modal-header">
                <h3>Provider <em>portal</em></h3>
                <p>For yoga, meditation & holistic health practitioners.</p>
              </div>

              <ProviderForm
                onSignedIn={(token, user) => {
                  signIn(token, user);
                  closeModal();
                  navigate('/admin');
                }}
                onClose={closeModal}
              />
            </div>

            {/* ADMIN PANE */}
            <div className={`modal-pane${tab === 'admin' ? ' active' : ''}`}>
              <div className="modal-header">
                <h3>Stillwater <em>admin</em></h3>
                <p>Restricted access for the Stillwater team.</p>
              </div>

              <div className="info-banner">
                This area is for authorised Stillwater team members only. All access is logged and audited.
              </div>

              <AdminForm
                onSignedIn={(token, user) => {
                  signIn(token, user);
                  closeModal();
                  navigate('/stillwater-team');
                }}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Demo form section ---------- */
function DemoSection() {
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setSubmitting(true);
    try {
      await swApi.post('/demo-requests', data);
      alert('Thank you. Our team will reach out within one working day.');
      form.reset();
    } catch {
      alert('Thank you. Our team will reach out within one working day.');
      form.reset();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="demo" id="demo">
      <div className="demo-wrap">
        <div className="reveal">
          <div className="eyebrow">Reach out to our team</div>
          <h2>Let us walk you through <em>Stillwater</em>.</h2>
          <p>Tell us a little about your practice. We'll arrange a personal demo with our team — a quiet conversation about how Stillwater can support your work and your seekers.</p>
          <div className="demo-features">
            <div className="demo-feature">A 30-minute, no-obligation walkthrough</div>
            <div className="demo-feature">Tailored to your specific practice and offerings</div>
            <div className="demo-feature">Direct conversation with our founding team</div>
            <div className="demo-feature">Onboarding support if you choose to join us</div>
          </div>
        </div>

        <form className="demo-form reveal" onSubmit={onSubmit}>
          <div className="form-row">
            <div className="field">
              <label>First name</label>
              <input type="text" name="firstName" required placeholder="Your first name" />
            </div>
            <div className="field">
              <label>Last name</label>
              <input type="text" name="lastName" required placeholder="Your last name" />
            </div>
          </div>
          <div className="field">
            <label>Email address</label>
            <input type="email" name="email" required placeholder="you@practice.com" />
          </div>
          <div className="field">
            <label>Phone (with country code)</label>
            <input type="tel" name="phone" required placeholder="+91 98765 43210" />
          </div>
          <div className="field">
            <label>Your practice</label>
            <select name="practice" required defaultValue="">
              <option value="">Select your offering</option>
              <option>Yoga teacher / studio</option>
              <option>Meditation guide</option>
              <option>Ayurveda practitioner</option>
              <option>Breathwork / sound healer</option>
              <option>Holistic nutritionist</option>
              <option>Wellness retreat</option>
              <option>Other holistic practitioner</option>
            </select>
          </div>
          <div className="field">
            <label>Tell us a little about what you offer</label>
            <textarea name="message" placeholder="Your background, your students, your hopes for working together..."></textarea>
          </div>
          <button type="submit" disabled={submitting}>Request a demo →</button>
        </form>
      </div>
    </section>
  );
}

/* ---------- Auth forms ---------- */

function SeekerForm({ method, onSignedIn }: { method: 'mobile' | 'email'; onSignedIn: (t: string, u: any) => void }) {
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);

  async function sendCode(e: FormEvent) {
    e.preventDefault();
    if (!identifier) return;
    setBusy(true);
    try {
      const { data } = await swApi.post('/auth/seeker/otp', { channel: method, identifier });
      if (data?.devCode) {
        alert(`Verification code sent. (Dev code: ${data.devCode})`);
      } else {
        alert('Verification code sent.');
      }
      setStep('verify');
    } catch {
      alert('Could not send verification code right now.');
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await swApi.post('/auth/seeker/verify', { channel: method, identifier, code });
      onSignedIn(data.token, data.user);
    } catch {
      alert('Invalid or expired code.');
    } finally {
      setBusy(false);
    }
  }

  if (step === 'verify') {
    return (
      <form onSubmit={verifyCode}>
        <div className="field">
          <label>Verification code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="6-digit code"
            maxLength={6}
            required
          />
        </div>
        <button type="submit" className="modal-submit" disabled={busy}>Verify and continue</button>
      </form>
    );
  }

  return (
    <form onSubmit={sendCode}>
      {method === 'mobile' ? (
        <div className="field">
          <label>Mobile number</label>
          <input type="tel" placeholder="+91 98765 43210" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
        </div>
      ) : (
        <div className="field">
          <label>Email address</label>
          <input type="email" placeholder="you@email.com" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
        </div>
      )}
      <button type="submit" className="modal-submit" disabled={busy}>Send verification code</button>
    </form>
  );
}

function StudentForm({ onSignedIn, onSeeker }: { onSignedIn: (t: string, u: any) => void; onSeeker: () => void }) {
  const [name, setName] = useState('');
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [busy, setBusy] = useState(false);

  function handleChange(idx: number, val: string) {
    const next = [...digits];
    next[idx] = val.slice(-1);
    setDigits(next);
    if (val && idx < 5) refs.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) refs.current[idx - 1]?.focus();
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const code = digits.join('');
      const { data } = await swApi.post('/auth/student/login', { name, code });
      onSignedIn(data.token, data.user);
    } catch {
      alert('No student found with that name and code.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <form onSubmit={submit}>
        <div className="field">
          <label>Your name</label>
          <input type="text" placeholder="Your full name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label>Provider access code</label>
          <div className="code-input-group">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (refs.current[i] = el)}
                className="code-digit"
                maxLength={1}
                required
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
              />
            ))}
          </div>
        </div>
        <button type="submit" className="modal-submit" disabled={busy}>Enter your practice →</button>
      </form>
      <p className="modal-footer-text">
        Don't have a code? <a onClick={onSeeker}>Continue as a seeker instead</a>
      </p>
    </>
  );
}

function ProviderForm({ onSignedIn, onClose }: { onSignedIn: (t: string, u: any) => void; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await swApi.post('/auth/provider/login', { email, password });
      onSignedIn(data.token, data.user);
    } catch {
      alert('Invalid credentials.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <form onSubmit={submit}>
        <div className="field">
          <label>Email address</label>
          <input type="email" placeholder="you@practice.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="modal-submit" disabled={busy}>Log in to your practice</button>
      </form>
      <p className="modal-footer-text">
        New practitioner? <a href="#demo" onClick={onClose}>Request a demo</a> or <a onClick={() => alert('Provider sign-up flow.')}>apply to join</a>
      </p>
    </>
  );
}

function AdminForm({ onSignedIn }: { onSignedIn: (t: string, u: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await swApi.post('/auth/admin/login', { email, password, twoFactor });
      onSignedIn(data.token, data.user);
    } catch {
      alert('Authentication failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="field">
        <label>Admin email</label>
        <input type="email" placeholder="admin@stillwater.you" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label>Password</label>
        <input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="field">
        <label>Two-factor code</label>
        <input type="text" placeholder="6-digit code" maxLength={6} required value={twoFactor} onChange={(e) => setTwoFactor(e.target.value)} />
      </div>
      <button type="submit" className="modal-submit" disabled={busy}>Authenticate</button>
    </form>
  );
}
