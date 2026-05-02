import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Globe, Eye, Save, Rocket } from 'lucide-react';
import { api } from '../api/client';
import { PageHeader } from '../components/PageHeader';

export default function WebsiteBuilder() {
  const [site, setSite] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [studioSlug, setStudioSlug] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/website/me'), api.get('/website/templates'), api.get('/studios/me')])
      .then(([s, t, st]) => {
        setSite(s.data);
        setTemplates(t.data);
        setStudioSlug(st.data?.slug || '');
      })
      .catch(() => toast.error('Failed to load website'));
  }, []);

  if (!site) return <div className="p-8 text-gray-500">Loading…</div>;

  function update(path: string[], value: any) {
    setSite((prev: any) => {
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
    setBusy(true);
    try {
      const { data } = await api.put('/website/me', site);
      setSite(data);
      toast.success('Saved');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    setBusy(true);
    try {
      await api.post('/website/publish');
      toast.success('Site is live!');
      setSite({ ...site, published: true });
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Publish failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Website Builder"
        subtitle="Pick a template and customize your studio site."
        actions={
          <>
            {studioSlug && (
              <a href={`/site/${studioSlug}`} target="_blank" rel="noreferrer" className="btn-ghost">
                <Eye size={16} /> Preview
              </a>
            )}
            <button className="btn-secondary" onClick={save} disabled={busy}>
              <Save size={16} /> Save
            </button>
            <button className="btn-primary" onClick={publish} disabled={busy}>
              <Rocket size={16} /> {site.published ? 'Republish' : 'Publish'}
            </button>
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="font-semibold mb-4">Template</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => update(['template'], t.id)}
                  className={`border-2 rounded-lg p-4 text-left transition ${
                    site.template === t.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-20 rounded mb-2" style={{ background: t.accent }} />
                  <div className="font-medium">{t.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold mb-4">Hero</h2>
            <div className="space-y-3">
              <div>
                <label className="label">Headline</label>
                <input
                  className="input"
                  value={site.content.hero.heading}
                  onChange={(e) => update(['content', 'hero', 'heading'], e.target.value)}
                />
              </div>
              <div>
                <label className="label">Subheading</label>
                <input
                  className="input"
                  value={site.content.hero.subheading}
                  onChange={(e) => update(['content', 'hero', 'subheading'], e.target.value)}
                />
              </div>
              <div>
                <label className="label">CTA button text</label>
                <input
                  className="input"
                  value={site.content.hero.ctaText}
                  onChange={(e) => update(['content', 'hero', 'ctaText'], e.target.value)}
                />
              </div>
              <div>
                <label className="label">Hero image URL</label>
                <input
                  className="input"
                  value={site.content.hero.image || ''}
                  onChange={(e) => update(['content', 'hero', 'image'], e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold mb-4">About</h2>
            <div className="space-y-3">
              <input
                className="input"
                value={site.content.about.heading}
                onChange={(e) => update(['content', 'about', 'heading'], e.target.value)}
              />
              <textarea
                className="input min-h-[120px]"
                value={site.content.about.body}
                onChange={(e) => update(['content', 'about', 'body'], e.target.value)}
              />
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold mb-4">Sections</h2>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={site.showCalendar}
                onChange={(e) => update(['showCalendar'], e.target.checked)}
              />
              Show class calendar on the site
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={site.showBlog}
                onChange={(e) => update(['showBlog'], e.target.checked)}
              />
              Show blog posts on the site
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Globe size={18} /> Theme
            </h2>
            <div className="space-y-3">
              <div>
                <label className="label">Primary color</label>
                <input
                  type="color"
                  className="w-full h-10 rounded border"
                  value={site.theme.primaryColor}
                  onChange={(e) => update(['theme', 'primaryColor'], e.target.value)}
                />
              </div>
              <div>
                <label className="label">Secondary color</label>
                <input
                  type="color"
                  className="w-full h-10 rounded border"
                  value={site.theme.secondaryColor}
                  onChange={(e) => update(['theme', 'secondaryColor'], e.target.value)}
                />
              </div>
              <div>
                <label className="label">Custom domain</label>
                <input
                  className="input"
                  placeholder="yogify.com/site/your-slug"
                  value={site.customDomain || ''}
                  onChange={(e) => update(['customDomain'], e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold mb-3">SEO</h2>
            <input
              className="input mb-2"
              placeholder="Page title"
              value={site.seo?.title || ''}
              onChange={(e) => update(['seo', 'title'], e.target.value)}
            />
            <textarea
              className="input"
              placeholder="Meta description"
              value={site.seo?.description || ''}
              onChange={(e) => update(['seo', 'description'], e.target.value)}
            />
          </div>

          <div className="card text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span className={`badge ${site.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {site.published ? 'Live' : 'Draft'}
              </span>
            </div>
            {studioSlug && (
              <div className="mt-3 text-gray-500 break-all">URL: /site/{studioSlug}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
