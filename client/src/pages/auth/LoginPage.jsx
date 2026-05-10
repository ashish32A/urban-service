import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../services/axiosInstance';
import toast from 'react-hot-toast';

const schema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  agreed: z.boolean().refine(val => val === true, { message: 'You must agree to the terms' }),
});

export default function PhoneEntry() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ phone }) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/send-otp', { phone });
      if (data.otp) {
        toast.success(`TEST OTP: ${data.otp}`, { duration: 8000, icon: '🔑' });
      } else {
        toast.success('OTP sent to your mobile!');
      }
      navigate('/verify-otp', { state: { phone, isNewUser: data.isNewUser } });
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4">
        <a href="/" className="text-gray-500 hover:text-[#1A2B4A] flex items-center gap-1.5 text-sm font-medium transition-colors w-fit">
          <span>←</span> Back to Site
        </a>
      </div>
      <h2 className="text-2xl font-heading font-bold text-[#1A2B4A] mb-1">Login / Sign Up</h2>
      <p className="text-gray-500 text-sm mb-6">
        Enter your mobile number to get started — no password needed!
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Phone input with country code */}
        <div>
          <label htmlFor="phone-input" className="block text-sm font-medium text-gray-700 mb-1.5">
            Mobile Number
          </label>
          <div className={`flex rounded-xl border-2 overflow-hidden transition-all
            ${errors.phone ? 'border-red-400' : 'border-gray-200 focus-within:border-[#E74C3C]'}`}>
            {/* Country code badge */}
            <div className="flex items-center gap-1.5 px-3 py-3 bg-gray-50 border-r border-gray-200 whitespace-nowrap">
              <span className="text-base">🇮🇳</span>
              <span className="text-sm font-semibold text-gray-600">+91</span>
            </div>
            <input
              id="phone-input"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="9876543210"
              className="flex-1 px-4 py-3 text-sm font-medium text-[#1A2B4A] outline-none bg-white placeholder-gray-400"
              {...register('phone')}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Terms checkbox */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              id="terms-checkbox"
              type="checkbox"
              className="mt-0.5 w-4 h-4 accent-[#E74C3C] cursor-pointer"
              {...register('agreed')}
            />
            <span className="text-xs text-gray-500 leading-relaxed">
              I agree to the{' '}
              <a href="/terms" className="text-[#E74C3C] hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="/privacy" className="text-[#E74C3C] hover:underline">Privacy Policy</a>
            </span>
          </label>
          {errors.agreed && (
            <p className="text-xs text-red-500 mt-1">{errors.agreed.message}</p>
          )}
        </div>

        <button
          id="get-otp-btn"
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#E74C3C] hover:bg-red-600
                     text-white font-semibold py-3.5 rounded-xl transition-all shadow-md
                     hover:shadow-red-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading && (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          )}
          {loading ? 'Sending OTP…' : 'Get OTP →'}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400 mb-3">Are you a professional?</p>
        <a href="/vendor/login" className="text-sm font-medium text-[#1A2B4A] hover:text-[#E74C3C] transition-colors">
          Login as Vendor →
        </a>
      </div>
    </>
  );
}
