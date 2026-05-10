import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from 'recharts';
import api from '../../services/axiosInstance';

const PIE_COLORS = ['#E74C3C', '#1A2B4A', '#F39C12', '#27AE60', '#2980B9', '#8E44AD', '#E67E22', '#16A085'];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics').then(({ data }) => setAnalytics(data.analytics)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-40 animate-pulse" />)}</div>;
  }

  const kpiCards = [
    { label: 'Total Users', value: analytics?.totalUsers ?? 0, icon: '👥', color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Vendors', value: analytics?.totalVendors ?? 0, icon: '👷', color: 'bg-purple-50 text-purple-600' },
    { label: "Today's Bookings", value: analytics?.todayBookings ?? 0, icon: '📅', color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Revenue (Month)', value: `₹${(analytics?.revenueThisMonth ?? 0).toLocaleString('en-IN')}`, icon: '💰', color: 'bg-green-50 text-green-600' },
    { label: 'Pending Approvals', value: analytics?.pendingApprovals ?? 0, icon: '⏳', color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-heading font-bold text-[#1A2B4A]">Admin Dashboard</h2>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-2 ${color}`}>{icon}</div>
            <p className="text-xl font-bold text-[#1A2B4A]">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Line Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-[#1A2B4A] mb-4">Bookings (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analytics?.revenueByDay || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="_id" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#E74C3C" strokeWidth={2} dot={false} name="Bookings" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-[#1A2B4A] mb-4">Bookings by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={analytics?.bookingsByCategory || []}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
              >
                {(analytics?.bookingsByCategory || []).map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
