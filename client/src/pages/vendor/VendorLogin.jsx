import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function VendorLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (!result.error) {
      if (!['vendor', 'admin'].includes(result.payload?.user?.role)) {
        toast.error('This portal is for vendors only');
        return;
      }
      toast.success('Welcome back!');
      navigate('/vendor');
    } else {
      const errMsg =
        typeof result.payload === 'string'
          ? result.payload
          : result.payload?.message || result.error?.message || 'Login failed. Check your email and password.';
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A2B4A] via-[#1e3461] to-[#0d1e3c] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors w-fit">
            <span>←</span> Back to Site
          </Link>
        </div>
        <div className="text-center mb-8">
          <span className="w-12 h-12 bg-[#F39C12] rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">V</span>
          <h1 className="text-2xl font-heading font-bold text-white">Vendor Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage your jobs</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <label htmlFor="vendor-email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                id="vendor-email" type="email" autoComplete="email"
                placeholder="rajesh@vendor.com"
                className={`w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all
                  ${errors.email ? 'border-red-400' : 'border-gray-200 focus:border-[#F39C12]'}`}
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="vendor-password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                id="vendor-password" type="password" autoComplete="current-password"
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all
                  ${errors.password ? 'border-red-400' : 'border-gray-200 focus:border-[#F39C12]'}`}
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button id="vendor-login-btn" type="submit" disabled={isSubmitting}
              className="w-full bg-[#F39C12] hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              {isSubmitting ? 'Signing in…' : 'Sign In to Vendor Portal'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Not registered yet?{' '}
            <Link to="/vendor/register" className="text-[#F39C12] font-medium hover:underline">Apply as Vendor →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
