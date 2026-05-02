import { useEffect, useState } from 'react';
import { CreditCard, IndianRupee, DollarSign } from 'lucide-react';
import { api } from '../api/client';
import { PageHeader } from '../components/PageHeader';

export default function Payments() {
  const [stats, setStats] = useState<any>({ totalRevenue: 0, monthRevenue: 0, successfulPayments: 0 });
  const [payments, setPayments] = useState<any[]>([]);
  const [studio, setStudio] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      api.get('/payments/stats').catch(() => ({ data: stats })),
      api.get('/payments').catch(() => ({ data: [] })),
      api.get('/studios/me'),
    ]).then(([s, p, st]) => {
      setStats(s.data);
      setPayments(p.data);
      setStudio(st.data);
    });
  }, []);

  return (
    <div className="p-8">
      <PageHeader title="Payments" subtitle="Razorpay (India) and Stripe (international) for class & subscription fees." />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="text-sm text-gray-500 mb-1">Total revenue</div>
          <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 mb-1">This month</div>
          <div className="text-2xl font-bold">₹{stats.monthRevenue.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 mb-1">Successful payments</div>
          <div className="text-2xl font-bold">{stats.successfulPayments}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <ProviderCard
          name="Razorpay"
          icon={IndianRupee}
          color="bg-blue-100 text-blue-600"
          connected={!!studio?.integrations?.razorpay?.connected}
          desc="For Indian customers. UPI, cards, netbanking, wallets."
        />
        <ProviderCard
          name="Stripe"
          icon={DollarSign}
          color="bg-purple-100 text-purple-600"
          connected={!!studio?.integrations?.stripe?.connected}
          desc="For international customers. Cards & wallets."
        />
      </div>

      <div className="card overflow-hidden p-0">
        <div className="p-4 border-b font-semibold">Recent transactions</div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">User</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Provider</th>
              <th className="p-4">Purpose</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">No payments yet</td></tr>
            )}
            {payments.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="p-4 text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="p-4">{p.user?.name}</td>
                <td className="p-4 font-medium">{p.currency} {p.amount}</td>
                <td className="p-4 capitalize">{p.provider}</td>
                <td className="p-4 capitalize">{p.purpose}</td>
                <td className="p-4">
                  <span className={`badge ${
                    p.status === 'success' ? 'bg-green-100 text-green-700' :
                    p.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProviderCard({ name, icon: Icon, color, connected, desc }: any) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-xs text-gray-500">{connected ? 'Connected' : 'Not connected'}</div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{desc}</p>
      <button className={connected ? 'btn-ghost' : 'btn-primary'}>
        <CreditCard size={16} /> {connected ? 'Manage' : `Connect ${name}`}
      </button>
    </div>
  );
}
