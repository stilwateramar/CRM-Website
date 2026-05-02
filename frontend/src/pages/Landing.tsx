import { Link } from 'react-router-dom';
import {
  Sparkles, Globe, Calendar, Share2, Users, MessageSquare, Video,
  CreditCard, BookOpen, ChevronRight, CheckCircle,
} from 'lucide-react';

const FEATURES = [
  { icon: Globe, title: 'Beautiful Website', desc: 'Pick a template, customize, and publish your studio site in minutes.' },
  { icon: Calendar, title: 'Smart Scheduling', desc: 'Calendar with bookings, capacity limits, and 24h class reminders.' },
  { icon: Share2, title: 'Social Auto-Pilot', desc: 'Convert raw class videos into reels and post to Instagram & Meta.' },
  { icon: Users, title: 'Student CRM', desc: 'Import contacts from WhatsApp, manage feedback, and stay close.' },
  { icon: Video, title: 'Online Classes', desc: 'One-click Zoom or Google Meet for your remote yoga sessions.' },
  { icon: MessageSquare, title: 'Community + AI', desc: 'Sub-communities and an AI yoga assistant to answer questions 24/7.' },
  { icon: BookOpen, title: 'Learning Library', desc: 'Curate videos, tutorials, and guides for your students.' },
  { icon: CreditCard, title: 'Payments', desc: 'Razorpay & Stripe ready. Single classes, packages, subscriptions.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="px-6 py-4 flex items-center justify-between bg-white border-b">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Sparkles className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl">Yogify</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="btn-ghost">Log in</Link>
          <Link to="/register" className="btn-primary">Start free</Link>
        </div>
      </header>

      <section className="px-6 py-20 bg-gradient-to-b from-brand-50 to-white text-center">
        <div className="max-w-3xl mx-auto">
          <span className="badge bg-brand-100 text-brand-700 mb-4">Studio OS for yoga teachers</span>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Run your entire yoga business from one place
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Website, scheduling, students, social media, payments, and an AI assistant —
            built for independent yoga teachers and studios.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/register" className="btn-primary text-lg px-6 py-3">
              Get started free <ChevronRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-6 py-3">I have an account</Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="card hover:shadow-md transition">
                <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-16 bg-brand-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Pricing that grows with you</h2>
          <p className="text-gray-600 mb-10">Start free. Add the social media add-on when you're ready to scale.</p>
          <div className="grid md:grid-cols-3 gap-5">
            {['Free', 'Pro', 'Enterprise'].map((plan, i) => (
              <div key={plan} className={`card text-left ${i === 1 ? 'border-brand-500 ring-2 ring-brand-200' : ''}`}>
                <h3 className="font-semibold text-lg mb-1">{plan}</h3>
                <div className="text-3xl font-bold mb-4">
                  {i === 0 ? '₹0' : i === 1 ? '₹1,499' : 'Custom'}
                  <span className="text-sm font-normal text-gray-500">/mo</span>
                </div>
                <ul className="text-sm space-y-2">
                  <li className="flex gap-2"><CheckCircle size={16} className="text-green-600" />Website + scheduling</li>
                  <li className="flex gap-2"><CheckCircle size={16} className="text-green-600" />Up to {i === 0 ? '50' : i === 1 ? '500' : '∞'} students</li>
                  {i >= 1 && <li className="flex gap-2"><CheckCircle size={16} className="text-green-600" />Social media add-on available</li>}
                  {i >= 1 && <li className="flex gap-2"><CheckCircle size={16} className="text-green-600" />AI blog & chatbot</li>}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center text-gray-500 text-sm py-8">
        © {new Date().getFullYear()} Yogify · Built for yoga teachers everywhere.
      </footer>
    </div>
  );
}
