import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setAccessToken } from '../../store/slices/authSlice';
import api from '../../services/axiosInstance';
import toast from 'react-hot-toast';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function OTPVerify() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const phone = location.state?.phone || '';
  const isNewUser = location.state?.isNewUser;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(RESEND_SECONDS);
  const [error, setError] = useState('');
  const refs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setInterval(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCountdown]);

  const handleChange = (value, idx) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[idx] = value.slice(-1);
    setOtp(updated);
    setError('');
    if (value && idx < OTP_LENGTH - 1) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) refs.current[idx - 1]?.focus();
    if (e.key === 'ArrowLeft' && idx > 0) refs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < OTP_LENGTH - 1) refs.current[idx + 1]?.focus();
  };

  // Handle paste
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (pasted.length === OTP_LENGTH) {
      setOtp(pasted.split(''));
      refs.current[OTP_LENGTH - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) { setError('Enter all 6 digits'); return; }

    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/verify-otp', { phone, otp: code });
      const { accessToken, user } = data;

      // Persist token to localStorage + Redux so subsequent protected requests work
      dispatch(setAccessToken(accessToken));
      dispatch(setUser(user));

      toast.success('Verified! Welcome to UrbanServe 🎉');

      if (isNewUser || !user?.isProfileComplete) {
        navigate('/complete-profile');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const { data } = await api.post('/auth/send-otp', { phone });
      setResendCountdown(RESEND_SECONDS);
      setOtp(Array(OTP_LENGTH).fill(''));
      refs.current[0]?.focus();
      if (data.otp) {
        toast.success(`TEST OTP: ${data.otp}`, { duration: 8000, icon: '🔑' });
      } else {
        toast.success('OTP resent!');
      }
    } catch {
      toast.error('Could not resend OTP. Try again.');
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#E74C3C]/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
          📲
        </div>
        <h2 className="text-2xl font-heading font-bold text-[#1A2B4A]">Verify OTP</h2>
        <p className="text-gray-500 text-sm mt-1">
          Sent to <span className="font-semibold text-[#1A2B4A]">+91 {phone}</span>
        </p>
      </div>

      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 text-center">
          {error}
        </div>
      )}

      {/* OTP Boxes */}
      <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            id={`otp-box-${idx}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            ref={(el) => (refs.current[idx] = el)}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all duration-200
              ${digit ? 'border-[#E74C3C] bg-red-50 text-[#E74C3C]' : 'border-gray-200 bg-white text-[#1A2B4A]'}
              focus:border-[#E74C3C] focus:ring-2 focus:ring-red-100`}
            aria-label={`OTP digit ${idx + 1}`}
          />
        ))}
      </div>

      <button
        id="verify-otp-btn"
        onClick={handleVerify}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#E74C3C] hover:bg-red-600
                   text-white font-semibold py-3.5 rounded-xl transition-all shadow-md
                   active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mb-4"
      >
        {loading && (
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        )}
        {loading ? 'Verifying…' : 'Verify & Continue'}
      </button>

      <div className="text-center">
        {resendCountdown > 0 ? (
          <p className="text-sm text-gray-400">
            Resend OTP in{' '}
            <span className="font-semibold text-[#1A2B4A] tabular-nums">{String(resendCountdown).padStart(2, '0')}s</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="text-sm font-medium text-[#E74C3C] hover:underline"
          >
            Resend OTP
          </button>
        )}
      </div>
    </>
  );
}
