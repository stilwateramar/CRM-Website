import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Sparkles, MessageSquare, X, Send } from 'lucide-react';
import { api } from '../api/client';
import { PageHeader } from '../components/PageHeader';

export default function Forum() {
  const [communities, setCommunities] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [activeCommunity, setActiveCommunity] = useState<string>('');
  const [postOpen, setPostOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [postForm, setPostForm] = useState({ title: '', body: '', tags: [] as string[] });
  const [communityForm, setCommunityForm] = useState({ name: '', description: '' });
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');

  async function load() {
    const [c, p] = await Promise.all([
      api.get('/forum/communities'),
      api.get('/forum/posts', { params: activeCommunity ? { community: activeCommunity } : {} }),
    ]);
    setCommunities(c.data);
    setPosts(p.data);
  }
  useEffect(() => { load(); }, [activeCommunity]);

  async function createPost() {
    await api.post('/forum/posts', { ...postForm, community: activeCommunity || undefined });
    toast.success('Posted');
    setPostOpen(false);
    setPostForm({ title: '', body: '', tags: [] });
    load();
  }

  async function createCommunity() {
    await api.post('/forum/communities', communityForm);
    toast.success('Community created');
    setCommunityOpen(false);
    setCommunityForm({ name: '', description: '' });
    load();
  }

  async function aiAnswer(postId: string) {
    await api.post(`/forum/posts/${postId}/ai-answer`);
    toast.success('AI answered');
    load();
  }

  async function sendChat() {
    if (!chatInput.trim()) return;
    const q = chatInput;
    setChatLog([...chatLog, { role: 'user', text: q }]);
    setChatInput('');
    const { data } = await api.post('/forum/chatbot', { question: q });
    setChatLog((cur) => [...cur, { role: 'ai', text: data.answer }]);
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Forum & Community"
        subtitle="Sub-communities, Q&A, and an AI yoga assistant."
        actions={
          <>
            <button className="btn-ghost" onClick={() => setChatOpen(true)}>
              <Sparkles size={16} /> Ask the AI
            </button>
            <button className="btn-secondary" onClick={() => setCommunityOpen(true)}>
              <Plus size={16} /> New community
            </button>
            <button className="btn-primary" onClick={() => setPostOpen(true)}>
              <Plus size={16} /> New post
            </button>
          </>
        }
      />

      <div className="grid lg:grid-cols-4 gap-6">
        <aside className="card h-fit">
          <h3 className="font-semibold mb-3">Communities</h3>
          <button
            onClick={() => setActiveCommunity('')}
            className={`block w-full text-left px-3 py-2 rounded text-sm ${!activeCommunity ? 'bg-brand-50 text-brand-700' : 'hover:bg-gray-50'}`}
          >
            All posts
          </button>
          {communities.map((c) => (
            <button
              key={c._id}
              onClick={() => setActiveCommunity(c._id)}
              className={`block w-full text-left px-3 py-2 rounded text-sm ${activeCommunity === c._id ? 'bg-brand-50 text-brand-700' : 'hover:bg-gray-50'}`}
            >
              # {c.name}
              <span className="text-xs text-gray-400 ml-2">{c.memberCount}</span>
            </button>
          ))}
        </aside>

        <div className="lg:col-span-3 space-y-3">
          {posts.length === 0 && (
            <div className="card text-center text-gray-500">No posts yet. Start the conversation.</div>
          )}
          {posts.map((p) => (
            <div key={p._id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{p.title}</h3>
                  <p className="text-sm text-gray-700">{p.body}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span>{p.author?.name}</span>
                    <span>·</span>
                    <span>{new Date(p.createdAt).toLocaleString()}</span>
                    {p.community && <span className="badge bg-brand-50 text-brand-700">#{p.community.slug}</span>}
                    {p.isAIAnswered && <span className="badge bg-purple-100 text-purple-700"><Sparkles size={10} /> AI answered</span>}
                  </div>
                </div>
                {!p.isAIAnswered && (
                  <button className="btn-ghost text-xs" onClick={() => aiAnswer(p._id)}>
                    <Sparkles size={12} /> AI Answer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {postOpen && (
        <Modal title="New post" onClose={() => setPostOpen(false)}>
          <input className="input mb-3" placeholder="Title" value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} />
          <textarea className="input min-h-[150px] mb-3" placeholder="Body" value={postForm.body} onChange={(e) => setPostForm({ ...postForm, body: e.target.value })} />
          <button className="btn-primary w-full" onClick={createPost}>Post</button>
        </Modal>
      )}

      {communityOpen && (
        <Modal title="New community" onClose={() => setCommunityOpen(false)}>
          <input className="input mb-3" placeholder="Name (e.g. Beginners)" value={communityForm.name} onChange={(e) => setCommunityForm({ ...communityForm, name: e.target.value })} />
          <textarea className="input mb-3" placeholder="Description" value={communityForm.description} onChange={(e) => setCommunityForm({ ...communityForm, description: e.target.value })} />
          <button className="btn-primary w-full" onClick={createCommunity}>Create</button>
        </Modal>
      )}

      {chatOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 flex flex-col h-[600px]">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-lg flex gap-2 items-center">
                <Sparkles size={18} className="text-brand-600" /> Yoga AI Assistant
              </h2>
              <button onClick={() => setChatOpen(false)}><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 mb-3">
              {chatLog.length === 0 && (
                <div className="text-sm text-gray-500 text-center mt-10">
                  Ask anything about yoga — poses, breathwork, philosophy, schedule.
                </div>
              )}
              {chatLog.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.role === 'user' ? 'bg-brand-600 text-white' : 'bg-gray-100'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="input flex-1"
                placeholder="Ask a question…"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendChat()}
              />
              <button className="btn-primary" onClick={sendChat}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-lg">{title}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
