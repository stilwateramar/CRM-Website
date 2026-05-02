import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Play, FileText, Trash2, X } from 'lucide-react';
import { api } from '../api/client';
import { PageHeader } from '../components/PageHeader';

export default function Learning() {
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({
    title: '',
    description: '',
    type: 'video',
    url: '',
    thumbnail: '',
    category: 'asana',
    level: 'beginner',
    durationMinutes: 0,
  });

  async function load() {
    const { data } = await api.get('/learning');
    setItems(data);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    await api.post('/learning', form);
    toast.success('Added');
    setOpen(false);
    setForm({ ...form, title: '', url: '', thumbnail: '', description: '' });
    load();
  }

  async function remove(id: string) {
    if (!confirm('Delete?')) return;
    await api.delete(`/learning/${id}`);
    load();
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Learning Library"
        subtitle="Curate yoga videos, tutorials, and articles for your students."
        actions={
          <button className="btn-primary" onClick={() => setOpen(true)}>
            <Plus size={16} /> Add resource
          </button>
        }
      />

      <div className="grid md:grid-cols-3 gap-4">
        {items.length === 0 && (
          <div className="card col-span-3 text-center text-gray-500">No materials yet.</div>
        )}
        {items.map((it) => (
          <div key={it._id} className="card">
            <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400 overflow-hidden">
              {it.thumbnail ? (
                <img src={it.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : it.type === 'video' ? <Play size={32} /> : <FileText size={32} />}
            </div>
            <h3 className="font-semibold mb-1">{it.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{it.description}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="badge bg-brand-50 text-brand-700">{it.level}</span>
              <span className="badge bg-gray-100 text-gray-700">{it.type}</span>
              {it.durationMinutes > 0 && <span className="text-gray-500">{it.durationMinutes} min</span>}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t">
              <a href={it.url} target="_blank" rel="noreferrer" className="text-brand-600 text-sm hover:underline">Open</a>
              <button onClick={() => remove(it._id)} className="text-gray-500 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-lg">Add learning material</h2>
              <button onClick={() => setOpen(false)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <textarea className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input className="input" placeholder="URL (YouTube, Vimeo, PDF, etc.)" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
              <input className="input" placeholder="Thumbnail URL" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
              <div className="grid grid-cols-3 gap-3">
                <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="video">Video</option>
                  <option value="article">Article</option>
                  <option value="pdf">PDF</option>
                  <option value="tutorial">Tutorial</option>
                </select>
                <select className="input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <input type="number" className="input" placeholder="Min" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: +e.target.value })} />
              </div>
              <button className="btn-primary w-full" onClick={add}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
