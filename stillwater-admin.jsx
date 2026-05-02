import React, { useState, useRef } from "react";
import {
  LayoutDashboard, ImageIcon, Calendar, FileText, Settings, MessageSquare, LogOut,
  Upload, Trash2, Plus, Eye, EyeOff, Check, ExternalLink, Save, X, Edit3,
  Clock, MapPin, Mail, AlertCircle, ChevronRight, Search,
} from "lucide-react";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "assets", label: "Website assets", icon: ImageIcon },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "settings", label: "Site settings", icon: Settings },
  { id: "requests", label: "Change requests", icon: MessageSquare },
];

const SEED_IMAGES = [
  { id: "i1", name: "studio-morning.jpg", url: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop", uploadedAt: "Apr 22, 2026", size: "1.2 MB", usedIn: "Hero" },
  { id: "i2", name: "yin-class.jpg", url: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop", uploadedAt: "Apr 18, 2026", size: "890 KB", usedIn: "Offering 2" },
  { id: "i3", name: "asha-teaching.jpg", url: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=400&h=300&fit=crop", uploadedAt: "Apr 12, 2026", size: "1.5 MB", usedIn: "About" },
  { id: "i4", name: "studio-space.jpg", url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop", uploadedAt: "Apr 02, 2026", size: "2.1 MB", usedIn: "Gallery" },
];

const SEED_SCHEDULE = [
  { id: "s1", day: "Monday", time: "07:00", duration: 60, name: "Morning flow", level: "All levels", teacher: "Asha", spots: 14 },
  { id: "s2", day: "Monday", time: "18:30", duration: 75, name: "Yin & restore", level: "All levels", teacher: "Asha", spots: 12 },
  { id: "s3", day: "Tuesday", time: "07:00", duration: 60, name: "Morning flow", level: "All levels", teacher: "Asha", spots: 14 },
  { id: "s4", day: "Wednesday", time: "18:00", duration: 60, name: "Hatha basics", level: "Beginner", teacher: "Priya", spots: 10 },
  { id: "s5", day: "Thursday", time: "07:00", duration: 60, name: "Morning flow", level: "All levels", teacher: "Asha", spots: 14 },
  { id: "s6", day: "Saturday", time: "09:00", duration: 90, name: "Slow vinyasa", level: "Intermediate", teacher: "Asha", spots: 14 },
  { id: "s7", day: "Sunday", time: "18:00", duration: 75, name: "Yin & restore", level: "All levels", teacher: "Asha", spots: 12 },
];

const SEED_BLOG = [
  { id: "b1", title: "What we mean by 'breath-led practice'", excerpt: "A short note on why we cue the breath before we cue the body, and how this changes everything about a class.", status: "published", date: "Apr 28, 2026", author: "Asha Menon" },
  { id: "b2", title: "Returning to the mat after a break", excerpt: "It's been six months. Or two years. Here's how to come back without the guilt.", status: "published", date: "Apr 14, 2026", author: "Asha Menon" },
  { id: "b3", title: "On props (and why we use so many of them)", excerpt: "Bolsters, blocks, blankets — they're not for beginners. They're for everyone.", status: "draft", date: "Apr 30, 2026", author: "Asha Menon" },
];

const SEED_REQUESTS = [
  { id: "r1", title: "Update teacher photo on About page", status: "completed", date: "Apr 15, 2026", category: "Content" },
  { id: "r2", title: "Add a new section about teacher trainings", status: "in_progress", date: "Apr 26, 2026", category: "Layout" },
  { id: "r3", title: "Change accent color to deeper green", status: "pending", date: "Apr 30, 2026", category: "Design" },
];

export default function StillwaterAdmin() {
  const [active, setActive] = useState("dashboard");
  const [images, setImages] = useState(SEED_IMAGES);
  const [schedule, setSchedule] = useState(SEED_SCHEDULE);
  const [blog, setBlog] = useState(SEED_BLOG);
  const [requests, setRequests] = useState(SEED_REQUESTS);
  const [showBlog, setShowBlog] = useState(true);
  const [showSchedule, setShowSchedule] = useState(true);
  const [siteSettings, setSiteSettings] = useState({
    email: "hello@stillwateryoga.in",
    phone: "+91 98456 12345",
    address: "12 Linden Lane, Bengaluru 560001",
    instagram: "@stillwater.yoga",
  });
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2400);
  };

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="flex">
        <Sidebar active={active} setActive={setActive} />

        <div className="flex-1 min-h-screen ml-60">
          <TopBar onPreview={() => showToast("Opening preview…")} />

          <main className="px-8 py-7 max-w-[1100px]">
            {active === "dashboard" && (
              <Dashboard
                images={images} schedule={schedule} blog={blog} requests={requests}
                showBlog={showBlog} setShowBlog={setShowBlog}
                showSchedule={showSchedule} setShowSchedule={setShowSchedule}
                onJump={setActive}
              />
            )}
            {active === "assets" && <Assets images={images} setImages={setImages} onSave={() => showToast("Image saved")} />}
            {active === "schedule" && (
              <ScheduleManager schedule={schedule} setSchedule={setSchedule}
                showSchedule={showSchedule} setShowSchedule={setShowSchedule}
                onSave={() => showToast("Schedule saved")} />
            )}
            {active === "blog" && (
              <BlogManager blog={blog} setBlog={setBlog}
                showBlog={showBlog} setShowBlog={setShowBlog}
                onSave={() => showToast("Post saved")} />
            )}
            {active === "settings" && <SiteSettings settings={siteSettings} setSettings={setSiteSettings} onSave={() => showToast("Settings saved")} />}
            {active === "requests" && <ChangeRequests requests={requests} setRequests={setRequests} onSubmit={() => showToast("Request submitted to the team")} />}
          </main>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-stone-900 text-white px-4 py-2.5 rounded-md shadow-lg flex items-center gap-2 text-sm z-50 animate-[slideIn_0.2s_ease-out]">
          <Check size={14} /> {toast}
        </div>
      )}
    </div>
  );
}

/* ---------- Sidebar ---------- */
function Sidebar({ active, setActive }) {
  return (
    <aside className="w-60 bg-white border-r border-stone-200 fixed left-0 top-0 h-screen flex flex-col">
      <div className="p-5 border-b border-stone-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-md bg-stone-900 text-white flex items-center justify-center text-xs font-bold" style={{ fontFamily: "Georgia, serif" }}>S</div>
          <div>
            <div className="text-sm font-medium" style={{ fontFamily: "Georgia, serif" }}>Stillwater Yoga</div>
            <div className="text-[11px] text-stone-500">Admin portal</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors mb-0.5 ${
                isActive ? "bg-stone-100 text-stone-900 font-medium" : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              }`}
            >
              <Icon size={15} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-stone-200">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-stone-50 cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-[11px] font-medium text-stone-700">AM</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">Asha Menon</div>
            <div className="text-[11px] text-stone-500 truncate">Owner</div>
          </div>
          <LogOut size={14} className="text-stone-400" />
        </div>
      </div>
    </aside>
  );
}

function TopBar({ onPreview }) {
  return (
    <div className="border-b border-stone-200 bg-white px-8 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2 text-sm text-stone-500">
        <span>stillwateryoga.in</span>
        <span className="text-stone-300">·</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700">Live</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onPreview} className="text-xs flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 hover:bg-stone-50 rounded-md">
          <Eye size={12} /> Preview site
        </button>
        <button className="text-xs flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 hover:bg-stone-50 rounded-md">
          <ExternalLink size={12} /> Visit live site
        </button>
      </div>
    </div>
  );
}

/* ---------- Reusable bits ---------- */
function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-7">
      <div>
        <h1 className="text-2xl font-medium text-stone-900 mb-1" style={{ letterSpacing: "-0.01em" }}>{title}</h1>
        {subtitle && <p className="text-sm text-stone-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Card({ children, className = "" }) {
  return <div className={`bg-white border border-stone-200 rounded-lg ${className}`}>{children}</div>;
}

function VisibilityToggle({ checked, onChange, label, description }) {
  return (
    <Card className="p-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
               className="mt-0.5 w-4 h-4 rounded accent-stone-900 cursor-pointer" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-stone-900">{label}</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 ${
              checked ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone-600"
            }`}>
              {checked ? <><Eye size={10} /> Visible on site</> : <><EyeOff size={10} /> Hidden</>}
            </span>
          </div>
          {description && <div className="text-xs text-stone-500 mt-1">{description}</div>}
        </div>
      </label>
    </Card>
  );
}

/* ---------- Dashboard ---------- */
function Dashboard({ images, schedule, blog, requests, showBlog, setShowBlog, showSchedule, setShowSchedule, onJump }) {
  const publishedPosts = blog.filter((b) => b.status === "published").length;
  const openRequests = requests.filter((r) => r.status !== "completed").length;

  return (
    <div>
      <PageHeader title="Welcome back, Asha" subtitle="Here's what's happening with your site." />

      <div className="grid grid-cols-4 gap-3 mb-8">
        <Stat label="Photos" value={images.length} hint="in library" />
        <Stat label="Classes this week" value={schedule.length} hint="across 7 days" />
        <Stat label="Published posts" value={publishedPosts} hint={`${blog.length - publishedPosts} drafts`} />
        <Stat label="Open requests" value={openRequests} hint={`${requests.length - openRequests} completed`} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <VisibilityToggle checked={showSchedule} onChange={setShowSchedule}
          label="Show class schedule on site"
          description="When unchecked, the schedule section is hidden from your public site." />
        <VisibilityToggle checked={showBlog} onChange={setShowBlog}
          label="Show blog on site"
          description="When unchecked, your blog section and posts are hidden from visitors." />
      </div>

      <div className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Quick actions</div>
      <div className="grid grid-cols-3 gap-3">
        <QuickAction title="Upload photos" desc="Add images to your asset library" onClick={() => onJump("assets")} />
        <QuickAction title="Add this week's classes" desc="Update your weekly schedule" onClick={() => onJump("schedule")} />
        <QuickAction title="Write a blog post" desc="Share thoughts with your students" onClick={() => onJump("blog")} />
      </div>
    </div>
  );
}

function Stat({ label, value, hint }) {
  return (
    <div className="bg-stone-100/70 rounded-md p-4">
      <div className="text-xs text-stone-500 mb-1">{label}</div>
      <div className="text-2xl font-medium text-stone-900">{value}</div>
      <div className="text-[11px] text-stone-500 mt-0.5">{hint}</div>
    </div>
  );
}

function QuickAction({ title, desc, onClick }) {
  return (
    <button onClick={onClick}
            className="text-left bg-white border border-stone-200 rounded-lg p-4 hover:border-stone-400 hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between mb-1">
        <div className="text-sm font-medium text-stone-900">{title}</div>
        <ChevronRight size={14} className="text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
      </div>
      <div className="text-xs text-stone-500">{desc}</div>
    </button>
  );
}

/* ---------- Website assets ---------- */
function Assets({ images, setImages, onSave }) {
  const inputRef = useRef(null);

  const handleUpload = (files) => {
    const newImages = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({
        id: `i${Date.now()}_${Math.random()}`,
        name: f.name,
        url: URL.createObjectURL(f),
        uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
        usedIn: "—",
      }));
    setImages([...newImages, ...images]);
    if (newImages.length) onSave();
  };

  const removeImage = (id) => setImages(images.filter((img) => img.id !== id));

  return (
    <div>
      <PageHeader
        title="Website assets"
        subtitle="Upload photos to use across your site. Up to 50 images, 5 MB each."
        action={
          <button onClick={() => inputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 text-white rounded-md text-sm hover:bg-stone-700">
            <Upload size={13} /> Upload images
          </button>
        }
      />

      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
             onChange={(e) => e.target.files.length && handleUpload(e.target.files)} />

      <Card>
        <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between">
          <div className="text-sm">
            <span className="font-medium">{images.length}</span>
            <span className="text-stone-500"> images · {(images.reduce((sum, i) => sum + parseFloat(i.size), 0)).toFixed(1)} MB used of 250 MB</span>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input placeholder="Search images" className="pl-7 pr-3 py-1.5 text-xs border border-stone-200 rounded-md w-48 focus:outline-none focus:border-stone-500" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 p-4">
          {images.map((img) => (
            <div key={img.id} className="group relative">
              <div className="aspect-[4/3] rounded-md overflow-hidden border border-stone-200 bg-stone-100">
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-md transition-colors flex items-end p-3 opacity-0 group-hover:opacity-100">
                <div className="flex gap-2 w-full">
                  <button className="flex-1 px-2 py-1.5 bg-white rounded text-xs text-stone-900 flex items-center justify-center gap-1 hover:bg-stone-100">
                    <Edit3 size={11} /> Replace
                  </button>
                  <button onClick={() => removeImage(img.id)} className="px-2 py-1.5 bg-white rounded text-xs text-stone-900 hover:bg-stone-100">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xs font-medium text-stone-900 truncate">{img.name}</div>
                <div className="text-[11px] text-stone-500 flex items-center justify-between mt-0.5">
                  <span>{img.size} · {img.uploadedAt}</span>
                  {img.usedIn !== "—" && <span className="text-[10px] px-1.5 py-0.5 bg-stone-100 rounded">{img.usedIn}</span>}
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => inputRef.current?.click()}
                  className="aspect-[4/3] border-2 border-dashed border-stone-300 hover:border-stone-500 rounded-md flex flex-col items-center justify-center text-stone-400 hover:text-stone-700 transition-colors">
            <Upload size={20} className="mb-2" />
            <span className="text-xs">Drop or click to upload</span>
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ---------- Schedule manager ---------- */
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function ScheduleManager({ schedule, setSchedule, showSchedule, setShowSchedule, onSave }) {
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);

  const remove = (id) => setSchedule(schedule.filter((c) => c.id !== id));
  const save = (cls) => {
    if (cls.id) {
      setSchedule(schedule.map((c) => (c.id === cls.id ? cls : c)));
    } else {
      setSchedule([...schedule, { ...cls, id: `s${Date.now()}` }]);
    }
    setEditing(null);
    setAdding(false);
    onSave();
  };

  return (
    <div>
      <PageHeader
        title="Class schedule"
        subtitle="Keep your weekly schedule up to date. Changes go live immediately."
        action={
          <button onClick={() => setAdding(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 text-white rounded-md text-sm hover:bg-stone-700">
            <Plus size={13} /> Add class
          </button>
        }
      />

      <div className="mb-5">
        <VisibilityToggle checked={showSchedule} onChange={setShowSchedule}
          label="Show schedule on website"
          description="When unchecked, the schedule section is hidden entirely from your public site." />
      </div>

      <Card>
        <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between">
          <div className="text-sm font-medium">This week · {schedule.length} classes</div>
          <div className="text-xs text-stone-500">Auto-syncs to website</div>
        </div>

        {DAYS.map((day) => {
          const dayClasses = schedule.filter((c) => c.day === day).sort((a, b) => a.time.localeCompare(b.time));
          return (
            <div key={day} className="border-b border-stone-200 last:border-b-0">
              <div className="px-4 py-2.5 bg-stone-50/50 text-xs font-semibold uppercase tracking-widest text-stone-500">
                {day} <span className="ml-2 text-stone-400 normal-case tracking-normal font-normal">{dayClasses.length === 0 ? "No classes" : `${dayClasses.length} class${dayClasses.length > 1 ? "es" : ""}`}</span>
              </div>
              {dayClasses.map((cls) => (
                <div key={cls.id} className="px-4 py-3 flex items-center gap-4 hover:bg-stone-50/50 group border-t border-stone-100 first:border-t-0">
                  <div className="text-sm font-medium text-stone-900 w-16 flex items-center gap-1">
                    <Clock size={11} className="text-stone-400" /> {cls.time}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{cls.name}</div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      {cls.duration} min · {cls.level} · {cls.teacher} · {cls.spots} spots
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                    <button onClick={() => setEditing(cls)} className="p-1.5 hover:bg-stone-200 rounded text-stone-600">
                      <Edit3 size={12} />
                    </button>
                    <button onClick={() => remove(cls.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </Card>

      {(editing || adding) && (
        <ClassEditor
          cls={editing || { day: "Monday", time: "07:00", duration: 60, name: "", level: "All levels", teacher: "Asha", spots: 14 }}
          onClose={() => { setEditing(null); setAdding(false); }}
          onSave={save}
        />
      )}
    </div>
  );
}

function ClassEditor({ cls, onClose, onSave }) {
  const [form, setForm] = useState(cls);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="font-medium">{cls.id ? "Edit class" : "Add class"}</div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-3">
          <FormField label="Class name">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                   className="w-full px-3 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-stone-500" />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Day">
              <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-stone-500">
                {DAYS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </FormField>
            <FormField label="Time">
              <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                     className="w-full px-3 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-stone-500" />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Duration (min)">
              <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 60 })}
                     className="w-full px-3 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-stone-500" />
            </FormField>
            <FormField label="Spots">
              <input type="number" value={form.spots} onChange={(e) => setForm({ ...form, spots: parseInt(e.target.value) || 0 })}
                     className="w-full px-3 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-stone-500" />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Level">
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-stone-500">
                <option>All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </FormField>
            <FormField label="Teacher">
              <input value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                     className="w-full px-3 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-stone-500" />
            </FormField>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-stone-200 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-100 rounded-md">Cancel</button>
          <button onClick={() => onSave(form)} disabled={!form.name}
                  className="px-3 py-1.5 text-sm bg-stone-900 text-white rounded-md hover:bg-stone-700 disabled:opacity-50">Save class</button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

/* ---------- Blog manager ---------- */
function BlogManager({ blog, setBlog, showBlog, setShowBlog, onSave }) {
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const remove = (id) => setBlog(blog.filter((p) => p.id !== id));
  const togglePublish = (id) => setBlog(blog.map((p) => p.id === id ? { ...p, status: p.status === "published" ? "draft" : "published" } : p));
  const save = (post) => {
    if (post.id) {
      setBlog(blog.map((p) => (p.id === post.id ? post : p)));
    } else {
      setBlog([{ ...post, id: `b${Date.now()}`, date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }), author: "Asha Menon" }, ...blog]);
    }
    setEditing(null);
    setCreating(false);
    onSave();
  };

  return (
    <div>
      <PageHeader
        title="Blog"
        subtitle="Share thoughts and updates with your students."
        action={
          <button onClick={() => setCreating(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 text-white rounded-md text-sm hover:bg-stone-700">
            <Plus size={13} /> New post
          </button>
        }
      />

      <div className="mb-5">
        <VisibilityToggle checked={showBlog} onChange={setShowBlog}
          label="Show blog on website"
          description="When unchecked, the blog section and all posts are hidden from your public site." />
      </div>

      <div className="space-y-2">
        {blog.map((post) => (
          <Card key={post.id} className="p-4 hover:border-stone-400 transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-medium text-stone-900">{post.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    post.status === "published" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                  }`}>
                    {post.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-sm text-stone-600 line-clamp-2 mb-2">{post.excerpt}</p>
                <div className="text-xs text-stone-500">{post.date} · {post.author}</div>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => setEditing(post)} className="p-1.5 hover:bg-stone-100 rounded text-stone-600" title="Edit">
                  <Edit3 size={13} />
                </button>
                <button onClick={() => togglePublish(post.id)} className="p-1.5 hover:bg-stone-100 rounded text-stone-600" title={post.status === "published" ? "Unpublish" : "Publish"}>
                  {post.status === "published" ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <button onClick={() => remove(post.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Delete">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {(editing || creating) && (
        <BlogEditor
          post={editing || { title: "", excerpt: "", body: "", status: "draft" }}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={save}
        />
      )}
    </div>
  );
}

function BlogEditor({ post, onClose, onSave }) {
  const [form, setForm] = useState({ ...post, body: post.body || post.excerpt });
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="font-medium">{post.id ? "Edit post" : "New post"}</div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-3 overflow-y-auto">
          <FormField label="Title">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                   placeholder="A title that draws people in"
                   className="w-full px-3 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-stone-500" />
          </FormField>
          <FormField label="Excerpt">
            <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                      rows={2} placeholder="One or two lines that show up in the post list."
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-stone-500 resize-none" />
          </FormField>
          <FormField label="Body">
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
                      rows={8} placeholder="Write your post here. Markdown supported."
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-stone-500 resize-none font-mono" />
          </FormField>
        </div>
        <div className="px-5 py-3 border-t border-stone-200 flex justify-between items-center">
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" checked={form.status === "published"}
                   onChange={(e) => setForm({ ...form, status: e.target.checked ? "published" : "draft" })}
                   className="w-4 h-4 accent-stone-900" />
            Publish immediately
          </label>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-100 rounded-md">Cancel</button>
            <button onClick={() => onSave(form)} disabled={!form.title}
                    className="px-3 py-1.5 text-sm bg-stone-900 text-white rounded-md hover:bg-stone-700 disabled:opacity-50 flex items-center gap-1">
              <Save size={12} /> Save post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Site settings ---------- */
function SiteSettings({ settings, setSettings, onSave }) {
  const [form, setForm] = useState(settings);
  const dirty = JSON.stringify(form) !== JSON.stringify(settings);

  return (
    <div>
      <PageHeader title="Site settings" subtitle="Update the contact details that appear on your website." />

      <Card className="p-5 mb-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">Contact details</div>
        <div className="space-y-4">
          <FormField label="Email address">
            <div className="relative">
              <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                     className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-stone-500" />
            </div>
            <div className="text-[11px] text-stone-400 mt-1">Shown in the footer and contact section.</div>
          </FormField>

          <FormField label="Phone (optional)">
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                   className="w-full px-3 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-stone-500" />
          </FormField>

          <FormField label="Studio address">
            <div className="relative">
              <MapPin size={13} className="absolute left-3 top-3 text-stone-400" />
              <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                        rows={2}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-stone-500 resize-none" />
            </div>
          </FormField>

          <FormField label="Instagram handle">
            <input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                   placeholder="@yourhandle"
                   className="w-full px-3 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-stone-500" />
          </FormField>
        </div>
      </Card>

      <Card className="p-4 mb-5 bg-amber-50/50 border-amber-200">
        <div className="flex items-start gap-3">
          <AlertCircle size={15} className="text-amber-700 mt-0.5 shrink-0" />
          <div className="flex-1 text-sm text-amber-900">
            <div className="font-medium mb-0.5">Want bigger changes?</div>
            <div className="text-xs text-amber-800">For layout, design, or content changes beyond contact details, submit a change request and our team will help.</div>
          </div>
        </div>
      </Card>

      {dirty && (
        <div className="flex justify-end gap-2">
          <button onClick={() => setForm(settings)} className="px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 rounded-md">Discard</button>
          <button onClick={() => { setSettings(form); onSave(); }}
                  className="px-4 py-2 text-sm bg-stone-900 text-white rounded-md hover:bg-stone-700 flex items-center gap-1.5">
            <Save size={13} /> Save changes
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Change requests ---------- */
function ChangeRequests({ requests, setRequests, onSubmit }) {
  const [showForm, setShowForm] = useState(false);

  const submit = (req) => {
    setRequests([{
      ...req,
      id: `r${Date.now()}`,
      status: "pending",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    }, ...requests]);
    setShowForm(false);
    onSubmit();
  };

  return (
    <div>
      <PageHeader
        title="Change requests"
        subtitle="For changes beyond what you can edit yourself, submit a request to the Stillwater team."
        action={
          <button onClick={() => setShowForm(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 text-white rounded-md text-sm hover:bg-stone-700">
            <Plus size={13} /> New request
          </button>
        }
      />

      {requests.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-stone-500 text-sm mb-3">No requests yet</div>
          <button onClick={() => setShowForm(true)} className="text-sm text-stone-900 underline">Submit your first request</button>
        </Card>
      ) : (
        <div className="space-y-2">
          {requests.map((req) => (
            <Card key={req.id} className="p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-stone-900">{req.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">{req.category}</span>
                </div>
                <div className="text-xs text-stone-500">Submitted {req.date}</div>
              </div>
              <StatusBadge status={req.status} />
            </Card>
          ))}
        </div>
      )}

      {showForm && <RequestForm onClose={() => setShowForm(false)} onSubmit={submit} />}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: { bg: "bg-stone-100", text: "text-stone-700", label: "Pending" },
    in_progress: { bg: "bg-blue-50", text: "text-blue-700", label: "In progress" },
    completed: { bg: "bg-green-50", text: "text-green-700", label: "Completed" },
  };
  const s = styles[status];
  return <span className={`text-[11px] px-2 py-1 rounded-full font-medium ${s.bg} ${s.text}`}>{s.label}</span>;
}

function RequestForm({ onClose, onSubmit }) {
  const [form, setForm] = useState({ title: "", category: "Content", priority: "Normal", details: "" });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <div>
            <div className="font-medium">New change request</div>
            <div className="text-xs text-stone-500 mt-0.5">Sent to the Stillwater admin team</div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-3">
          <FormField label="What needs to change?">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                   placeholder="Short summary, e.g. 'Update homepage banner'"
                   className="w-full px-3 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-stone-500" />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-stone-500">
                <option>Content</option><option>Design</option><option>Layout</option><option>Bug / issue</option><option>Other</option>
              </select>
            </FormField>
            <FormField label="Priority">
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-stone-500">
                <option>Low</option><option>Normal</option><option>High</option>
              </select>
            </FormField>
          </div>

          <FormField label="Details">
            <textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })}
                      rows={5} placeholder="Describe what you want changed and why. Add links or examples if helpful."
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:border-stone-500 resize-none" />
          </FormField>

          <div className="text-[11px] text-stone-500 leading-relaxed bg-stone-50 px-3 py-2 rounded-md">
            Typical turnaround: 2–3 business days for content, 5–7 for design or layout. You'll receive email updates as the request progresses.
          </div>
        </div>
        <div className="px-5 py-3 border-t border-stone-200 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-100 rounded-md">Cancel</button>
          <button onClick={() => onSubmit(form)} disabled={!form.title || !form.details}
                  className="px-3 py-1.5 text-sm bg-stone-900 text-white rounded-md hover:bg-stone-700 disabled:opacity-50">Submit request</button>
        </div>
      </div>
    </div>
  );
}
