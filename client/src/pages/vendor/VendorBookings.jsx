import { useState, useEffect } from 'react';
import api from '../../services/axiosInstance';

const TABS = ['New Requests', 'Accepted', 'In Progress', 'Completed'];
const TAB_STATUSES = ['pending', 'confirmed', 'in_progress', 'completed'];

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
};

const maskName = (name = '') => {
  const parts = name.split(' ');
  return parts.map((p, i) => (i === 0 ? p : p.charAt(0) + '.')).join(' ');
};

export default function VendorJobsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otpModal, setOtpModal] = useState(null);
  const [otp, setOtp] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/vendors/portal/bookings', {
        params: { status: TAB_STATUSES[activeTab] },
      });
      setBookings(data.bookings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [activeTab]);

  const handleAction = async (bookingId, action, body = {}) => {
    setActionLoading(bookingId + action);
    try {
      await api.patch(`/vendors/portal/bookings/${bookingId}/${action}`, body);
      await fetchBookings();
      if (action === 'complete') setOtpModal(null);
    } catch (e) {
      alert(e.response?.data?.error?.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-heading font-bold text-[#1A2B4A] mb-6">Job Management</h2>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
        {TABS.map((tab, i) => (
          <button key={i} onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0
              ${activeTab === i ? 'bg-white text-[#1A2B4A] shadow-sm' : 'text-gray-500 hover:text-[#1A2B4A]'}`}>
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />)}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium">No {TABS[activeTab].toLowerCase()} jobs</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-[#1A2B4A]">{b.service?.name}</h3>
                      <p className="text-xs text-gray-400">#{b.bookingId}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[b.status]}`}>
                      {b.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span>👤 {maskName(b.customer?.name)}</span>
                    <span>💰 ₹{b.pricing?.total}</span>
                    <span>📅 {new Date(b.scheduledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <span>⏰ {b.timeSlot}</span>
                    <span className="col-span-2">📍 {b.address?.city} — {b.address?.line1?.substring(0, 30)}…</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 items-start justify-end">
                  {b.status === 'pending' && (
                    <>
                      <button onClick={() => handleAction(b._id, 'accept')}
                        disabled={actionLoading === b._id + 'accept'}
                        className="px-4 py-2 bg-green-500 text-white text-xs font-semibold rounded-xl hover:bg-green-600 disabled:opacity-60 transition-all">
                        {actionLoading === b._id + 'accept' ? '…' : '✓ Accept'}
                      </button>
                      <button onClick={() => handleAction(b._id, 'reject', { reason: 'Vendor unavailable' })}
                        className="px-4 py-2 border border-red-300 text-red-500 text-xs font-semibold rounded-xl hover:bg-red-50 transition-all">
                        ✕ Reject
                      </button>
                    </>
                  )}
                  {b.status === 'confirmed' && (
                    <button onClick={() => handleAction(b._id, 'start')}
                      className="px-4 py-2 bg-blue-500 text-white text-xs font-semibold rounded-xl hover:bg-blue-600 transition-all">
                      ▶ Start Job
                    </button>
                  )}
                  {b.status === 'in_progress' && (
                    <button onClick={() => setOtpModal(b)}
                      className="px-4 py-2 bg-[#F39C12] text-white text-xs font-semibold rounded-xl hover:bg-amber-600 transition-all">
                      ✅ Mark Complete
                    </button>
                  )}
                  {b.status === 'completed' && (
                    <div className="text-xs text-gray-400">
                      <p>Completed ✓</p>
                      <p>₹{b.pricing?.total} earned</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OTP Modal */}
      {otpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-heading font-bold text-[#1A2B4A] mb-1">Enter Customer OTP</h3>
            <p className="text-sm text-gray-500 mb-4">Ask the customer to show their 4-digit delivery OTP.</p>
            <input
              id="delivery-otp-input"
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full text-center text-3xl font-bold tracking-widest border-2 border-gray-200 focus:border-[#F39C12] rounded-xl py-4 outline-none mb-4"
              placeholder="_ _ _ _"
            />
            <div className="flex gap-3">
              <button onClick={() => { setOtpModal(null); setOtp(''); }}
                className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm">
                Cancel
              </button>
              <button onClick={() => handleAction(otpModal._id, 'complete', { otp })}
                disabled={otp.length !== 4 || !!actionLoading}
                className="flex-1 py-2.5 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 disabled:opacity-50 text-sm">
                Verify & Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
