import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Sparkles, Plus, X, Edit, Trash2 } from 'lucide-react';
import { api } from '../api/client';
import { PageHeader } from '../components/PageHeader';

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState('warm and inspiring');
  const [aiBusy, setAiBusy] = useState(false);

  async function load() {
    const { data } = await api.get('/blog');
    setPosts(data);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    try {
      if (editing._id) {
        await api.put(`/blog/${editing._id}`, editing);
      } else {
        await api.post('/blog', editing);
      }
      toast.success('Saved');
      setEditing(null);
      load();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed');
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this post?')) return;
    await api.delete(`/blog/${id}`);
    load();
  }

  async function generateWithAI() {
    setAiBusy(true);
    try {
      const { data } = await api.post('/blog/ai/draft', { topic: aiTopic, tone: aiTone });
      setEditing({
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        tags: data.tags,
        status: 'draft',
        aiGenerated: true,
      });
      setAiOpen(false);
      toast.success('Draft ready — review and publish');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'AI draft failed');
    } finally {
      setAiBusy(false);
    }
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Blog"
        subtitle="Write about poses, philosophy, and studio news. Try the AI assistant."
        actions={
          <>
            <button className="btn-secondary" onClick={() => setAiOpen(true)}>
              <Sparkles size={16} /> AI Draft
            </button>
            <button className="btn-primary" onClick={() => setEditing({ title: '', content: '', status: 'draft', tags: [] })}>
              <Plus size={16} /> New post
            </button>
          </>
        }
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((p) => (
          <div key={p._id} className="card">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <span className={`badge mt-1 ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {p.status}
                </span>
                {p.aiGenerated && (
                  <span className="badge bg-brand-100 text-brand-700 ml-1"><Sparkles size={10} /> AI</span>
                )}
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(p)} className="text-gray-500 hover:text-gray-900"><Edit size={16} /></button>
                <button onClick={() => remove(p._id)} className="text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
            {p.excerpt && <p className="text-sm text-gray-600 mb-2 line-clamp-3">{p.excerpt}</p>}
            <div className="text-xs text-gray-400">{p.views || 0} views</div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-lg">{editing._id ? 'Edit post' : 'New post'}</h2>
              <button onClick={() => setEditing(null)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input className="input" placeholder="Title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              <input className="input" placeholder="Excerpt" value={editing.excerpt || ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
              <textarea className="input min-h-[300px] font-mono text-sm" placeholder="Markdown content" value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
              <input className="input" placeholder="Tags (comma separated)" value={(editing.tags || []).join(', ')} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) })} />
              <div className="flex justify-end gap-2">
                <button className="btn-ghost" onClick={() => setEditing({ ...editing, status: 'draft' })}>Save as draft</button>
                <button className="btn-primary" onClick={() => { setEditing({ ...editing, status: 'published' }); save(); }}>Publish</button>
                <button className="btn-secondary" onClick={save}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {aiOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-lg flex gap-2 items-center"><Sparkles size={18} className="text-brand-600" /> AI blog draft</h2>
              <button onClick={() => setAiOpen(false)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="label">Topic</label>
                <input className="input" placeholder="Benefits of morning yoga" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} />
              </div>
              <div>
                <label className="label">Tone</label>
                <input className="input" value={aiTone} onChange={(e) => setAiTone(e.target.value)} />
              </div>
              <button className="btn-primary w-full" disabled={aiBusy || !aiTopic} onClick={generateWithAI}>
                {aiBusy ? 'Generating…' : 'Generate draft'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
