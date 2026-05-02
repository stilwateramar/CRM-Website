import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Calendar, Video, MapPin, X } from 'lucide-react';
import { api } from '../api/client';
import { PageHeader } from '../components/PageHeader';

export default function Schedule() {
  const [classes, setClasses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({
    title: '',
    description: '',
    level: 'all',
    type: 'in-person',
    startTime: '',
    durationMinutes: 60,
    capacity: 20,
    price: 0,
    currency: 'INR',
    meetingProvider: 'zoom',
    createMeeting: false,
  });

  async function load() {
    const { data } = await api.get('/classes');
    setClasses(data);
  }
  useEffect(() => { load(); }, []);

  async function create() {
    try {
      await api.post('/classes', { ...form, startTime: new Date(form.startTime) });
      toast.success('Class scheduled');
      setShowForm(false);
      load();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed');
    }
  }

  async function cancel(id: string) {
    if (!confirm('Cancel this class? All bookings will be marked cancelled.')) return;
    await api.delete(`/classes/${id}`);
    load();
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Class Schedule"
        subtitle="Plan and manage your studio's classes."
        actions={
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} /> New class
          </button>
        }
      />

      <div className="card overflow-hidden p-0">
        {classes.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <Calendar className="mx-auto mb-3 text-gray-400" size={32} />
            No classes scheduled yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="p-4">Class</th>
                <th className="p-4">When</th>
                <th className="p-4">Type</th>
                <th className="p-4">Capacity</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c._id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">{c.title}</div>
                    <div className="text-xs text-gray-500">{c.level}</div>
                  </td>
                  <td className="p-4">{new Date(c.startTime).toLocaleString()}</td>
                  <td className="p-4">
                    <span className="badge bg-brand-50 text-brand-700 inline-flex gap-1 items-center">
                      {c.type === 'in-person' ? <MapPin size={12} /> : <Video size={12} />}
                      {c.type}
                    </span>
                  </td>
                  <td className="p-4">{c.capacity}</td>
                  <td className="p-4">{c.price > 0 ? `${c.currency} ${c.price}` : 'Free'}</td>
                  <td className="p-4">
                    <span className={`badge ${
                      c.status === 'scheduled' ? 'bg-green-100 text-green-700' :
                      c.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>{c.status}</span>
                  </td>
                  <td className="p-4">
                    {c.status === 'scheduled' && (
                      <button onClick={() => cancel(c._id)} className="text-red-600 hover:underline text-xs">
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">New class</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="label">Title</label>
                <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Level</label>
                  <select className="input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                    <option value="all">All levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="label">Type</label>
                  <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="in-person">In-person</option>
                    <option value="online">Online</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Start time</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Duration (min)</label>
                  <input type="number" className="input" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: +e.target.value })} />
                </div>
                <div>
                  <label className="label">Capacity</label>
                  <input type="number" className="input" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: +e.target.value })} />
                </div>
                <div>
                  <label className="label">Price</label>
                  <input type="number" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} />
                </div>
              </div>
              {form.type !== 'in-person' && (
                <div className="border rounded-lg p-3 bg-brand-50/50">
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={form.createMeeting}
                      onChange={(e) => setForm({ ...form, createMeeting: e.target.checked })}
                    />
                    Auto-create online meeting
                  </label>
                  {form.createMeeting && (
                    <select className="input" value={form.meetingProvider} onChange={(e) => setForm({ ...form, meetingProvider: e.target.value })}>
                      <option value="zoom">Zoom</option>
                      <option value="google">Google Meet</option>
                    </select>
                  )}
                </div>
              )}
              <button className="btn-primary w-full" onClick={create}>Schedule class</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
