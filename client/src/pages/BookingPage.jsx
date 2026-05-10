import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import api from '../services/axiosInstance';
import { createBooking } from '../store/slices/bookingSlice';
import toast from 'react-hot-toast';

const TIME_SLOTS = [
  { id: 'morning', label: '🌅 Morning', time: '7:00 AM – 12:00 PM' },
  { id: 'afternoon', label: '☀️ Afternoon', time: '12:00 PM – 5:00 PM' },
  { id: 'evening', label: '🌆 Evening', time: '5:00 PM – 9:00 PM' },
];

const schema = z.object({
  scheduledAt: z.string().min(1, 'Select a date'),
  timeSlot: z.enum(['morning', 'afternoon', 'evening'], { required_error: 'Select a time slot' }),
  addressLine1: z.string().min(5, 'Enter your full address'),
  city: z.string().min(2, 'Enter your city'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  notes: z.string().optional(),
});

const TAX_RATE = 0.18;

export default function BookingFormPage() {
  const { serviceId } = useParams();
  const [searchParams] = useSearchParams();
  const vendorId = searchParams.get('vendorId');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState(null);

  // Mock service price for display
  const basePrice = 599;
  const tax = Math.round(basePrice * TAX_RATE);
  const total = basePrice + tax;

  const today = new Date().toISOString().split('T')[0];

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { timeSlot: '' },
  });

  const selectedSlot = watch('timeSlot');
  const selectedDate = watch('scheduledAt');

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const result = await dispatch(createBooking({
        serviceId,
        vendorId,
        scheduledAt: new Date(`${data.scheduledAt}T${data.timeSlot === 'morning' ? '09' : data.timeSlot === 'afternoon' ? '14' : '18'}:00:00`),
        timeSlot: data.timeSlot,
        address: { line1: data.addressLine1, city: data.city, pincode: data.pincode },
        notes: data.notes,
      }));

      if (result.payload?._id) {
        setSuccessModal(result.payload);
      } else {
        toast.error(result.payload || 'Booking failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-heading font-bold text-[#1A2B4A] mb-6">Confirm Your Booking</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Form ── */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex-1 space-y-5">
            {/* Date Picker */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-[#1A2B4A] mb-4">📅 Select Date</h2>
              <input
                id="booking-date"
                type="date"
                min={today}
                className={`w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all
                  ${errors.scheduledAt ? 'border-red-400' : 'border-gray-200 focus:border-[#E74C3C]'}`}
                {...register('scheduledAt')}
              />
              {errors.scheduledAt && <p className="text-xs text-red-500 mt-1">{errors.scheduledAt.message}</p>}
            </div>

            {/* Time Slot Selector */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-[#1A2B4A] mb-4">⏰ Select Time Slot</h2>
              <div className="grid grid-cols-3 gap-3">
                {TIME_SLOTS.map(({ id, label, time }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setValue('timeSlot', id, { shouldValidate: true })}
                    className={`p-3 rounded-xl border-2 text-center transition-all
                      ${selectedSlot === id
                        ? 'border-[#E74C3C] bg-red-50 text-[#E74C3C]'
                        : 'border-gray-200 hover:border-[#E74C3C] text-gray-600'}`}
                  >
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{time}</p>
                  </button>
                ))}
              </div>
              {errors.timeSlot && <p className="text-xs text-red-500 mt-2">{errors.timeSlot.message}</p>}
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-[#1A2B4A] mb-4">📍 Service Address</h2>
              <div className="space-y-3">
                <div>
                  <label htmlFor="address-line1" className="text-xs font-medium text-gray-500 mb-1 block">Address Line 1 *</label>
                  <input
                    id="address-line1"
                    type="text"
                    placeholder="House/Flat No., Street, Landmark"
                    className={`w-full px-4 py-2.5 rounded-xl border-2 text-sm outline-none transition-all
                      ${errors.addressLine1 ? 'border-red-400' : 'border-gray-200 focus:border-[#E74C3C]'}`}
                    {...register('addressLine1')}
                  />
                  {errors.addressLine1 && <p className="text-xs text-red-500 mt-1">{errors.addressLine1.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="address-city" className="text-xs font-medium text-gray-500 mb-1 block">City *</label>
                    <input
                      id="address-city"
                      type="text"
                      placeholder="Mumbai"
                      className={`w-full px-4 py-2.5 rounded-xl border-2 text-sm outline-none transition-all
                        ${errors.city ? 'border-red-400' : 'border-gray-200 focus:border-[#E74C3C]'}`}
                      {...register('city')}
                    />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="address-pincode" className="text-xs font-medium text-gray-500 mb-1 block">Pincode *</label>
                    <input
                      id="address-pincode"
                      type="text"
                      maxLength={6}
                      placeholder="400001"
                      className={`w-full px-4 py-2.5 rounded-xl border-2 text-sm outline-none transition-all
                        ${errors.pincode ? 'border-red-400' : 'border-gray-200 focus:border-[#E74C3C]'}`}
                      {...register('pincode')}
                    />
                    {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="booking-notes" className="text-xs font-medium text-gray-500 mb-1 block">Special Instructions (optional)</label>
                  <textarea
                    id="booking-notes"
                    rows={2}
                    placeholder="Any special requests or access instructions..."
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#E74C3C] text-sm outline-none transition-all resize-none"
                    {...register('notes')}
                  />
                </div>
              </div>
            </div>
          </form>

          {/* ── Order Summary ── */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-20">
              <h2 className="font-semibold text-[#1A2B4A] mb-4 border-b border-gray-100 pb-3">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Base Price</span>
                  <span className="font-medium text-[#1A2B4A]">₹{basePrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span className="font-medium text-[#1A2B4A]">₹{tax}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base">
                  <span className="text-[#1A2B4A]">Total</span>
                  <span className="text-[#E74C3C]">₹{total}</span>
                </div>
              </div>

              {selectedDate && selectedSlot && (
                <div className="mt-4 bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
                  <p>📅 {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                  <p>⏰ {TIME_SLOTS.find((s) => s.id === selectedSlot)?.time}</p>
                </div>
              )}

              <div className="mt-4 text-xs text-gray-400 space-y-1">
                <p>✅ Free cancellation up to 2 hours before</p>
                <p>🛡️ Work insured up to ₹10,000</p>
              </div>

              <button
                id="confirm-booking-btn"
                type="button"
                disabled={submitting}
                onClick={handleSubmit(onSubmit)}
                className="mt-5 w-full bg-[#E74C3C] hover:bg-red-600 text-white font-bold py-4 rounded-xl
                           transition-all shadow-md hover:shadow-red-200 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting && (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                )}
                {submitting ? 'Booking…' : '✅ Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Success Modal ── */}
      {successModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-slide-up">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-xl font-heading font-bold text-[#1A2B4A] mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 text-sm mb-4">Your professional will arrive at the scheduled time.</p>
            <div className="bg-gray-50 rounded-xl px-4 py-3 mb-6">
              <p className="text-xs text-gray-400">Booking ID</p>
              <p className="font-bold text-[#E74C3C] tracking-wider text-lg">{successModal.bookingId}</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/bookings')}
              className="w-full bg-[#1A2B4A] text-white font-semibold py-3 rounded-xl hover:bg-[#162540] transition-all"
            >
              View My Bookings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
