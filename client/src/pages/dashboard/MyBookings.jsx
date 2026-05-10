import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings, cancelBooking, selectBookings } from '../../store/slices/bookingSlice';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const TABS = [
  { id: 'upcoming', label: 'Upcoming', statuses: ['pending', 'confirmed', 'in_progress'] },
  { id: 'completed', label: 'Completed', statuses: ['completed'] },
  { id: 'cancelled', label: 'Cancelled', statuses: ['cancelled'] },
];

export default function MyBookingsPage() {
  const dispatch = useDispatch();
  const bookings = useSelector(selectBookings);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [ratingModal, setRatingModal] = useState(null);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const tabBookings = bookings.filter((b) =>
    TABS.find((t) => t.id === activeTab)?.statuses.includes(b.status)
  );

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    const result = await dispatch(cancelBooking(bookingId));
    if (!result.error) toast.success('Booking cancelled');
    else toast.error('Could not cancel booking');
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-heading font-bold text-[#1A2B4A] mb-6">My Bookings</h2>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === id ? 'bg-white text-[#1A2B4A] shadow-sm' : 'text-gray-500 hover:text-[#1A2B4A]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tabBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium">No {activeTab} bookings</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tabBookings.map((booking) => (
            <div key={booking._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row gap-4">
              {/* Icon */}
              <div className="w-12 h-12 bg-[#1A2B4A]/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                🛠️
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-[#1A2B4A]">{booking.service?.name || 'Home Service'}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      by {booking.vendor?.user?.name || 'Professional'} • {booking.bookingId}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[booking.status]}`}>
                    {STATUS_LABELS[booking.status]}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                  <span>📅 {new Date(booking.scheduledAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                  <span>⏰ {booking.timeSlot}</span>
                  <span>📍 {booking.address?.city}</span>
                  <span className="font-semibold text-[#E74C3C]">₹{booking.pricing?.total}</span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="px-4 py-1.5 border border-red-300 text-red-500 hover:bg-red-50 text-xs font-medium rounded-lg transition-all"
                    >
                      Cancel Booking
                    </button>
                  )}
                  {booking.status === 'completed' && (
                    <>
                      <div className="px-3 py-1.5 bg-gray-100 text-gray-500 text-xs rounded-lg">
                        OTP Used ✅
                      </div>
                      {!booking.rating?.score && (
                        <button
                          onClick={() => setRatingModal(booking)}
                          className="px-4 py-1.5 bg-[#F39C12] text-white text-xs font-semibold rounded-lg hover:bg-amber-600 transition-all"
                        >
                          ⭐ Rate Service
                        </button>
                      )}
                      {booking.rating?.score && (
                        <span className="px-3 py-1.5 bg-green-50 text-green-600 text-xs rounded-lg font-medium">
                          You rated {booking.rating.score}★
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      {ratingModal && (
        <RatingModal booking={ratingModal} onClose={() => setRatingModal(null)} onSuccess={() => {
          setRatingModal(null);
          dispatch(fetchMyBookings());
          toast.success('Thanks for your feedback!');
        }} />
      )}
    </div>
  );
}

function RatingModal({ booking, onClose, onSuccess }) {
  const [score, setScore] = useState(5);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const api = require('../../services/axiosInstance').default;

  const submit = async () => {
    setLoading(true);
    try {
      await api.post(`/bookings/${booking._id}/review`, { score, review });
      onSuccess();
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h3 className="text-lg font-heading font-bold text-[#1A2B4A] mb-1">Rate Your Experience</h3>
        <p className="text-sm text-gray-500 mb-4">{booking.service?.name}</p>

        {/* Stars */}
        <div className="flex gap-2 justify-center mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => setScore(s)}
              className={`text-3xl transition-transform hover:scale-110 ${s <= score ? 'text-[#F39C12]' : 'text-gray-200'}`}>
              ★
            </button>
          ))}
        </div>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={3}
          placeholder="Tell us about your experience (optional)"
          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#E74C3C] rounded-xl text-sm outline-none resize-none mb-4"
        />

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={submit} disabled={loading}
            className="flex-1 py-2.5 bg-[#E74C3C] text-white font-semibold rounded-xl text-sm hover:bg-red-600 disabled:opacity-60">
            {loading ? 'Submitting…' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
}
