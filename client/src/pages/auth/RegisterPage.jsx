import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axiosInstance';
import { setUser } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'];

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  city: z.string().min(1, 'Please select your city'),
});

export default function CompleteProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const { data: res } = await api.post('/auth/complete-profile', data);
      dispatch(setUser(res.user));
      toast.success('Profile saved! Let\'s get started 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to save profile');
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">🎉</div>
        <h2 className="text-2xl font-heading font-bold text-[#1A2B4A]">Almost there!</h2>
        <p className="text-gray-500 text-sm mt-1">Tell us a bit about yourself to complete your profile</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
          <input
            id="profile-name"
            type="text"
            autoComplete="name"
            placeholder="Rahul Sharma"
            className={`w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all
              ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#E74C3C]'}`}
            {...register('name')}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Email (optional) */}
        <div>
          <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="profile-email"
            type="email"
            autoComplete="email"
            placeholder="rahul@example.com"
            className={`w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all
              ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#E74C3C]'}`}
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* City */}
        <div>
          <label htmlFor="profile-city" className="block text-sm font-medium text-gray-700 mb-1.5">Your City *</label>
          <select
            id="profile-city"
            className={`w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all bg-white
              ${errors.city ? 'border-red-400' : 'border-gray-200 focus:border-[#E74C3C]'}`}
            {...register('city')}
          >
            <option value="">Select your city</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
        </div>

        <button
          id="complete-profile-btn"
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#E74C3C] hover:bg-red-600 text-white font-semibold py-3.5 rounded-xl
                     transition-all shadow-md active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSubmitting && (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          )}
          {isSubmitting ? 'Saving…' : 'Complete Setup →'}
        </button>
      </form>
    </>
  );
}
