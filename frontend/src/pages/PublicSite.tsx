import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { api } from '../api/client';

export default function PublicSite() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/website/public/${slug}`)
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.message || 'Site not found'));
  }, [slug]);

  if (error) return <div className="p-10 text-center text-gray-500">{error}</div>;
  if (!data) return <div className="p-10 text-center text-gray-500">Loading…</div>;

  const { studio, site, upcoming, posts } = data;
  const primary = site.theme.primaryColor;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: site.theme.fontFamily || 'Inter' }}>
      <header className="px-6 py-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          {studio.logo && <img src={studio.logo} alt={studio.name} className="h-8" />}
          <span className="font-semibold text-lg">{studio.name}</span>
        </div>
        <div className="flex gap-3 text-sm">
          {studio.socialLinks?.instagram && <a href={studio.socialLinks.instagram}><Instagram size={18} /></a>}
          {studio.socialLinks?.facebook && <a href={studio.socialLinks.facebook}><Facebook size={18} /></a>}
          {studio.socialLinks?.youtube && <a href={studio.socialLinks.youtube}><Youtube size={18} /></a>}
          {studio.socialLinks?.twitter && <a href={studio.socialLinks.twitter}><Twitter size={18} /></a>}
        </div>
      </header>

      <section
        className="px-6 py-24 text-center text-white"
        style={{
          background: site.content.hero.image
            ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${site.content.hero.image}) center/cover`
            : `linear-gradient(135deg, ${primary}, ${site.theme.secondaryColor})`,
        }}
      >
        <h1 className="text-5xl font-bold mb-4">{site.content.hero.heading}</h1>
        <p className="text-lg mb-6 max-w-2xl mx-auto">{site.content.hero.subheading}</p>
        <a href="#schedule" className="inline-block px-6 py-3 rounded-lg font-medium" style={{ background: 'white', color: primary }}>
          {site.content.hero.ctaText}
        </a>
      </section>

      <section className="px-6 py-16 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-3">{site.content.about.heading}</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{site.content.about.body}</p>
      </section>

      {site.showCalendar && upcoming?.length > 0 && (
        <section id="schedule" className="px-6 py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold mb-6 flex items-center gap-2">
              <Calendar size={28} style={{ color: primary }} /> Upcoming Classes
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {upcoming.map((c: any) => (
                <div key={c._id} className="bg-white rounded-lg p-5 border">
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-sm text-gray-600">{new Date(c.startTime).toLocaleString()}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {c.level} · {c.type} · {c.durationMinutes} min
                  </div>
                  <div className="mt-2 font-medium" style={{ color: primary }}>
                    {c.price > 0 ? `${c.currency} ${c.price}` : 'Free'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {site.showBlog && posts?.length > 0 && (
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold mb-6">Latest from the blog</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {posts.map((p: any) => (
                <article key={p._id} className="rounded-lg border overflow-hidden">
                  {p.coverImage && <img src={p.coverImage} className="w-full h-32 object-cover" />}
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{p.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{p.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="px-6 py-10 border-t text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {studio.name} · Built with Yogify
      </footer>
    </div>
  );
}
