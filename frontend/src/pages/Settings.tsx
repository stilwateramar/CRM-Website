import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Save, Sparkles } from 'lucide-react';
import { api } from '../api/client';
import { PageHeader } from '../components/PageHeader';

export default function Settings() {
  const [studio, setStudio] = useState<any>(null);

  useEffect(() => {
    api.get('/studios/me').then((r) => setStudio(r.data));
  }, []);

  if (!studio) return <div className="p-8 text-gray-500">Loading…</div>;

  function update(path: string[], value: any) {
    setStudio((prev: any) => {
      const next = structuredClone(prev);
      let obj = next;
      for (let i = 0; i < path.length - 1; i++) {
        obj[path[i]] = obj[path[i]] || {};
        obj = obj[path[i]];
      }
      obj[path[path.length - 1]] = value;
      return next;
    });
  }

  async function save() {
    try {
      await api.put('/studios/me', studio);
      toast.success('Saved');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed');
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <PageHeader
        title="Studio Settings"
        actions={<button className="btn-primary" onClick={save}><Save size={16} /> Save</button>}
      />

      <div className="card mb-6">
        <h2 className="font-semibold mb-4">Studio info</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="label">Studio name</label>
            <input className="input" value={studio.name} onChange={(e) => update(['name'], e.target.value)} />
          </div>
          <div>
            <label className="label">URL slug</label>
            <input className="input" value={studio.slug} onChange={(e) => update(['slug'], e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={studio.email || ''} onChange={(e) => update(['email'], e.target.value)} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={studio.phone || ''} onChange={(e) => update(['phone'], e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Address</label>
            <input className="input" value={studio.address || ''} onChange={(e) => update(['address'], e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Description</label>
            <textarea className="input" value={studio.description || ''} onChange={(e) => update(['description'], e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="font-semibold mb-4">Social links</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input className="input" placeholder="Instagram URL" value={studio.socialLinks?.instagram || ''} onChange={(e) => update(['socialLinks', 'instagram'], e.target.value)} />
          <input className="input" placeholder="Facebook URL" value={studio.socialLinks?.facebook || ''} onChange={(e) => update(['socialLinks', 'facebook'], e.target.value)} />
          <input className="input" placeholder="YouTube URL" value={studio.socialLinks?.youtube || ''} onChange={(e) => update(['socialLinks', 'youtube'], e.target.value)} />
          <input className="input" placeholder="Twitter / X URL" value={studio.socialLinks?.twitter || ''} onChange={(e) => update(['socialLinks', 'twitter'], e.target.value)} />
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="font-semibold mb-4">Subscription</h2>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-medium capitalize">{studio.subscription?.plan || 'free'} plan</div>
            <div className="text-sm text-gray-500">Renews {studio.subscription?.renewsAt ? new Date(studio.subscription.renewsAt).toLocaleDateString() : '—'}</div>
          </div>
          <select className="input w-32" value={studio.subscription?.plan || 'free'} onChange={(e) => update(['subscription', 'plan'], e.target.value)}>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
        <label className="flex items-center gap-2 mt-3 p-3 bg-brand-50 rounded">
          <input
            type="checkbox"
            checked={!!studio.subscription?.socialAddon}
            onChange={(e) => update(['subscription', 'socialAddon'], e.target.checked)}
          />
          <Sparkles size={16} className="text-brand-600" />
          <span className="text-sm">
            Enable Social Media add-on (reels conversion + auto-publish)
          </span>
        </label>
      </div>
    </div>
  );
}
