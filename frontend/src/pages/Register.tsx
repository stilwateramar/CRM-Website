import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'owner' as 'owner' | 'teacher' | 'student',
    studioName: '',
  });
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await register(form);
      toast.success('Welcome to Yogify!');
      nav('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-white p-6">
      <div className="card w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Sparkles className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl">Yogify</span>
        </div>
        <h1 className="text-2xl font-bold mb-1">Create your studio</h1>
        <p className="text-sm text-gray-600 mb-6">Free forever for solo teachers. No credit card.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">I am a</label>
            <select
              className="input"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as any })}
            >
              <option value="owner">Studio owner</option>
              <option value="teacher">Independent yoga teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div>
            <label className="label">Full name</label>
            <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          {form.role === 'owner' && (
            <div>
              <label className="label">Studio name</label>
              <input
                className="input"
                value={form.studioName}
                onChange={(e) => setForm({ ...form, studioName: e.target.value })}
                placeholder="Lotus Yoga Studio"
              />
            </div>
          )}
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone (optional)</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button className="btn-primary w-full" disabled={busy}>
            {busy ? 'Creating…' : 'Create account'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account? <Link to="/login" className="text-brand-600 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
