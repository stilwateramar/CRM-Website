import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Upload, Plus, MessageCircle, X } from 'lucide-react';
import { api } from '../api/client';
import { PageHeader } from '../components/PageHeader';

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [importOpen, setImportOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [csv, setCsv] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [messageTo, setMessageTo] = useState<any>(null);
  const [messageBody, setMessageBody] = useState('');

  async function load() {
    const { data } = await api.get('/students');
    setStudents(data);
  }
  useEffect(() => { load(); }, []);

  async function importStudents() {
    const lines = csv.split('\n').filter(Boolean);
    const contacts = lines.map((l) => {
      const [name, phone, email] = l.split(',').map((s) => s.trim());
      return { name, phone, email };
    });
    try {
      const { data } = await api.post('/students/import', { contacts, source: 'whatsapp' });
      toast.success(`${data.created.length} added · ${data.skipped.length} skipped`);
      setImportOpen(false);
      setCsv('');
      load();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Import failed');
    }
  }

  async function addStudent() {
    try {
      await api.post('/students', form);
      toast.success('Student added');
      setAddOpen(false);
      setForm({ name: '', email: '', phone: '' });
      load();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed');
    }
  }

  async function sendMessage() {
    try {
      await api.post(`/students/${messageTo._id}/message`, { message: messageBody });
      toast.success('Message sent');
      setMessageTo(null);
      setMessageBody('');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Send failed');
    }
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Students"
        subtitle="Manage your students, import from WhatsApp, send updates."
        actions={
          <>
            <button className="btn-secondary" onClick={() => setImportOpen(true)}>
              <Upload size={16} /> Import
            </button>
            <button className="btn-primary" onClick={() => setAddOpen(true)}>
              <Plus size={16} /> Add student
            </button>
          </>
        }
      />

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Source</th>
              <th className="p-4">Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">No students yet</td></tr>
            )}
            {students.map((s) => (
              <tr key={s._id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{s.name}</td>
                <td className="p-4">{s.email}</td>
                <td className="p-4">{s.phone || '—'}</td>
                <td className="p-4"><span className="badge bg-gray-100 text-gray-700">{s.source}</span></td>
                <td className="p-4 text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <button onClick={() => setMessageTo(s)} className="text-brand-600 text-xs hover:underline flex items-center gap-1">
                    <MessageCircle size={14} /> Message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {importOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-lg">Import students</h2>
              <button onClick={() => setImportOpen(false)}><X size={20} /></button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Paste contacts as CSV: <code className="bg-gray-100 px-1">name, phone, email</code> (one per line).
              Use the WhatsApp contacts export or any CSV.
            </p>
            <textarea
              className="input min-h-[200px] font-mono text-xs"
              placeholder="Aarav Sharma, +91 9876543210, aarav@example.com&#10;Priya Patel, +91 9876543211, priya@example.com"
              value={csv}
              onChange={(e) => setCsv(e.target.value)}
            />
            <button className="btn-primary w-full mt-3" onClick={importStudents}>Import</button>
          </div>
        </div>
      )}

      {addOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-lg">Add student</h2>
              <button onClick={() => setAddOpen(false)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <button className="btn-primary w-full" onClick={addStudent}>Add</button>
            </div>
          </div>
        </div>
      )}

      {messageTo && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-lg">Message {messageTo.name}</h2>
              <button onClick={() => setMessageTo(null)}><X size={20} /></button>
            </div>
            <textarea className="input min-h-[120px]" value={messageBody} onChange={(e) => setMessageBody(e.target.value)} />
            <button className="btn-primary w-full mt-3" onClick={sendMessage}>Send via WhatsApp</button>
          </div>
        </div>
      )}
    </div>
  );
}
