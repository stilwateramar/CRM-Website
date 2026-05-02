import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Instagram, Facebook, Sparkles, Film, Send, X } from 'lucide-react';
import { api } from '../api/client';
import { PageHeader } from '../components/PageHeader';

export default function SocialMedia() {
  const [studio, setStudio] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [reelOpen, setReelOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [reel, setReel] = useState({ sourceVideoUrl: '', trimStart: 0, trimEnd: 0, captionsEnabled: true, musicTrack: '' });
  const [post, setPost] = useState({ caption: '', mediaUrl: '', mediaType: 'reel', platforms: ['instagram'] });

  async function load() {
    const [s, p] = await Promise.all([api.get('/studios/me'), api.get('/social/posts').catch(() => ({ data: [] }))]);
    setStudio(s.data);
    setPosts(p.data);
  }
  useEffect(() => { load(); }, []);

  async function connect(provider: 'meta') {
    const { data } = await api.get('/social/meta/connect');
    window.location.href = `${data.url}&state=${studio?._id || ''}`;
  }

  async function generateCaption() {
    if (!post.caption) {
      toast.error('Enter a topic in the caption first');
      return;
    }
    const { data } = await api.post('/social/captions/ai', { topic: post.caption });
    setPost({ ...post, caption: data.caption });
  }

  async function processReel() {
    try {
      await api.post('/social/reels/process', reel);
      toast.success('Reel queued for processing');
      setReelOpen(false);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed');
    }
  }

  async function createAndPublish() {
    try {
      const { data } = await api.post('/social/posts', post);
      await api.post(`/social/posts/${data._id}/publish`);
      toast.success('Posted!');
      setPostOpen(false);
      load();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed');
    }
  }

  const igConnected = studio?.integrations?.instagram?.connected;
  const fbConnected = studio?.integrations?.facebook?.connected;

  return (
    <div className="p-8">
      <PageHeader
        title="Social Media Manager"
        subtitle="Convert raw class videos into reels and post to Instagram & Facebook."
        actions={
          <>
            <button className="btn-secondary" onClick={() => setReelOpen(true)}>
              <Film size={16} /> Convert to Reel
            </button>
            <button className="btn-primary" onClick={() => setPostOpen(true)}>
              <Send size={16} /> New post
            </button>
          </>
        }
      />

      {!studio?.subscription?.socialAddon && (
        <div className="card mb-6 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <Sparkles className="text-amber-600 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-amber-900">Social media add-on required</h3>
              <p className="text-sm text-amber-800 mt-1">
                Enable the social add-on in Settings → Subscription to publish reels and posts.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
              <Instagram size={20} />
            </div>
            <div>
              <div className="font-semibold">Instagram</div>
              <div className="text-xs text-gray-500">{igConnected ? 'Connected' : 'Not connected'}</div>
            </div>
          </div>
          <button className={igConnected ? 'btn-ghost' : 'btn-primary'} onClick={() => connect('meta')}>
            {igConnected ? 'Reconnect' : 'Connect Instagram'}
          </button>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Facebook size={20} />
            </div>
            <div>
              <div className="font-semibold">Facebook</div>
              <div className="text-xs text-gray-500">{fbConnected ? 'Connected' : 'Not connected'}</div>
            </div>
          </div>
          <button className={fbConnected ? 'btn-ghost' : 'btn-primary'} onClick={() => connect('meta')}>
            {fbConnected ? 'Reconnect' : 'Connect Facebook'}
          </button>
        </div>
      </div>

      <h2 className="font-semibold mb-3">Recent posts</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {posts.length === 0 && (
          <div className="card col-span-3 text-center text-gray-500">No posts yet.</div>
        )}
        {posts.map((p) => (
          <div key={p._id} className="card">
            <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400 text-xs">
              {p.mediaType.toUpperCase()}
            </div>
            <p className="text-sm line-clamp-3 mb-2">{p.caption}</p>
            <div className="flex justify-between text-xs">
              <span className={`badge ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{p.status}</span>
              <span className="text-gray-500">{(p.platforms || []).join(', ')}</span>
            </div>
          </div>
        ))}
      </div>

      {reelOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-lg">Convert video to reel</h2>
              <button onClick={() => setReelOpen(false)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="label">Source video URL</label>
                <input className="input" value={reel.sourceVideoUrl} onChange={(e) => setReel({ ...reel, sourceVideoUrl: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Trim start (sec)</label>
                  <input type="number" className="input" value={reel.trimStart} onChange={(e) => setReel({ ...reel, trimStart: +e.target.value })} />
                </div>
                <div>
                  <label className="label">Trim end (sec)</label>
                  <input type="number" className="input" value={reel.trimEnd} onChange={(e) => setReel({ ...reel, trimEnd: +e.target.value })} />
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={reel.captionsEnabled} onChange={(e) => setReel({ ...reel, captionsEnabled: e.target.checked })} />
                Auto-generate captions
              </label>
              <div>
                <label className="label">Music track (optional)</label>
                <input className="input" value={reel.musicTrack} onChange={(e) => setReel({ ...reel, musicTrack: e.target.value })} />
              </div>
              <button className="btn-primary w-full" onClick={processReel}>Process reel</button>
            </div>
          </div>
        </div>
      )}

      {postOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-lg">New post</h2>
              <button onClick={() => setPostOpen(false)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="label">Caption (or topic for AI)</label>
                <textarea className="input min-h-[100px]" value={post.caption} onChange={(e) => setPost({ ...post, caption: e.target.value })} />
                <button className="text-xs text-brand-600 mt-1" onClick={generateCaption}>
                  <Sparkles size={12} className="inline" /> Generate with AI
                </button>
              </div>
              <div>
                <label className="label">Media URL</label>
                <input className="input" value={post.mediaUrl} onChange={(e) => setPost({ ...post, mediaUrl: e.target.value })} />
              </div>
              <div>
                <label className="label">Platforms</label>
                <div className="flex gap-3">
                  {['instagram', 'facebook'].map((p) => (
                    <label key={p} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={post.platforms.includes(p)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...post.platforms, p]
                            : post.platforms.filter((x) => x !== p);
                          setPost({ ...post, platforms: next });
                        }}
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
              <button className="btn-primary w-full" onClick={createAndPublish}>Publish now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
