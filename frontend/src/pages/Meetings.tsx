import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Video, CheckCircle } from 'lucide-react';
import { api } from '../api/client';
import { PageHeader } from '../components/PageHeader';

export default function Meetings() {
  const [status, setStatus] = useState({ zoom: false, google: false });
  const [studio, setStudio] = useState<any>(null);

  async function load() {
    const [s, st] = await Promise.all([api.get('/meetings/status'), api.get('/studios/me')]);
    setStatus(s.data);
    setStudio(st.data);
  }
  useEffect(() => { load(); }, []);

  async function connect(provider: 'zoom' | 'google') {
    const { data } = await api.get(`/meetings/${provider}/connect`);
    window.location.href = `${data.url}&state=${studio?._id || ''}`;
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Online Sessions"
        subtitle="Connect Zoom or Google Meet to host remote yoga classes."
      />

      <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
        <Card
          name="Zoom"
          desc="Auto-create meetings when you schedule online classes. Students get the join link automatically."
          connected={status.zoom}
          onConnect={() => connect('zoom')}
          color="bg-blue-100 text-blue-600"
        />
        <Card
          name="Google Meet"
          desc="Schedule meetings on your Google Calendar with a single click."
          connected={status.google}
          onConnect={() => connect('google')}
          color="bg-green-100 text-green-600"
        />
      </div>

      <div className="card mt-8 max-w-3xl">
        <h2 className="font-semibold mb-2">How it works</h2>
        <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-5">
          <li>Connect your Zoom or Google account using OAuth.</li>
          <li>When you create an online or hybrid class, tick "Auto-create meeting".</li>
          <li>The platform generates a unique meeting URL and shares it with enrolled students.</li>
          <li>Reminders 24h before include the join link automatically.</li>
        </ol>
      </div>
    </div>
  );
}

function Card({ name, desc, connected, onConnect, color }: any) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Video size={20} />
        </div>
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            {connected && <CheckCircle size={12} className="text-green-600" />}
            {connected ? 'Connected' : 'Not connected'}
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">{desc}</p>
      <button className={connected ? 'btn-ghost' : 'btn-primary'} onClick={onConnect}>
        {connected ? 'Reconnect' : `Connect ${name}`}
      </button>
    </div>
  );
}
