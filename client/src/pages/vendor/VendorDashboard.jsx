import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../../services/axiosInstance';

// Mock weekly earnings data (replace with real API)
const WEEKLY_DATA = [
  { day: 'Mon', earnings: 1200 },
  { day: 'Tue', earnings: 800 },
  { day: 'Wed', earnings: 2100 },
  { day: 'Thu', earnings: 1500 },
  { day: 'Fri', earnings: 2800 },
  { day: 'Sat', earnings: 3200 },
  { day: 'Sun', earnings: 900 },
];

export default function VendorDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newRequests, setNewRequests] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, bookRes] = await Promise.all([
          api.get('/vendors/portal/dashboard'),
          api.get('/vendors/portal/bookings', { params: { status: 'pending' } }),
        ]);
        setStats(dashRes.data.stats);
        setNewRequests(bookRes.data.bookings || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />)}
      </div>
    );
  }

  const STAT_CARDS = [
    { label: "Today's Jobs", value: stats?.todayJobs ?? 0, icon: '📅', color: 'bg-blue-50 text-blue-600' },
    { label: 'Pending Requests', value: stats?.pendingRequests ?? 0, icon: '🔔', color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Earnings This Month', value: `₹${(stats?.completedThisMonth ?? 0) * 350}`, icon: '💰', color: 'bg-green-50 text-green-600' },
    { label: 'Rating', value: `${stats?.rating?.toFixed(1) || '—'} ★`, icon: '⭐', color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${color}`}>
              {icon}
            </div>
            <p className="text-2xl font-bold text-[#1A2B4A]">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Earnings Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-[#1A2B4A] mb-4">Weekly Earnings (₹)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={WEEKLY_DATA} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => [`₹${v}`, 'Earnings']} />
            <Bar dataKey="earnings" fill="#F39C12" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* New Requests */}
      {newRequests.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-[#1A2B4A] mb-4">🔔 New Requests</h3>
          <div className="space-y-3">
            {newRequests.slice(0, 5).map((b) => (
              <div key={b._id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                <div>
                  <p className="text-sm font-semibold text-[#1A2B4A]">{b.service?.name}</p>
                  <p className="text-xs text-gray-500">📍 {b.address?.city} • ₹{b.pricing?.total}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => api.patch(`/vendors/portal/bookings/${b._id}/accept`)}
                    className="px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-all">
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
