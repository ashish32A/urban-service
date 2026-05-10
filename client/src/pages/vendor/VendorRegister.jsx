import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const SERVICES = ['AC Repair', 'Cleaning', 'Plumbing', 'Electrician', 'Painting', 'Pest Control', 'Carpentry', 'Appliance Repair'];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];

const step1Schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid Indian mobile required'),
  password: z.string().min(8, 'Min 8 characters').regex(/[A-Z]/, 'One uppercase').regex(/[0-9]/, 'One number'),
});

export default function VendorRegister() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [cities, setCities] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm({ resolver: zodResolver(step1Schema) });

  const toggleChip = (item, arr, setter) =>
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);

  const handleFinalSubmit = async () => {
    // Combine all step data
    const formData = getValues();
    toast.success('Application submitted! Under review.', { duration: 4000 });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A2B4A] to-[#0d1e3c] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-heading font-bold text-[#1A2B4A] mb-2">Application Under Review</h2>
          <p className="text-gray-500 text-sm">Our team will verify your documents and get back within 24-48 hours.</p>
          <a href="/vendor/login" className="mt-6 inline-block bg-[#F39C12] text-white font-semibold px-6 py-3 rounded-xl hover:bg-amber-600 transition-all no-underline">
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  const STEP_TITLES = ['Personal Info', 'Services & Skills', 'Service Area & Pricing', 'ID Verification'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A2B4A] to-[#0d1e3c] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors w-fit">
            <span>←</span> Back to Site
          </Link>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Join as a Professional</h1>
          <p className="text-gray-400 text-sm">Create your vendor account to start earning</p>
          {/* Progress bar */}
          <div className="flex gap-1 mt-4 max-w-xs mx-auto">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-[#F39C12]' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <form onSubmit={handleSubmit(() => setStep(2))} noValidate className="space-y-4">
              {[
                { id: 's1-name', label: 'Full Name *', field: 'name', type: 'text', placeholder: 'Rajesh Kumar' },
                { id: 's1-email', label: 'Email *', field: 'email', type: 'email', placeholder: 'rajesh@example.com' },
                { id: 's1-phone', label: 'Mobile Number *', field: 'phone', type: 'tel', placeholder: '9876543210' },
                { id: 's1-password', label: 'Password *', field: 'password', type: 'password', placeholder: '••••••••' },
              ].map(({ id, label, field, type, placeholder }) => (
                <div key={field}>
                  <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input id={id} type={type} placeholder={placeholder}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all
                      ${errors[field] ? 'border-red-400' : 'border-gray-200 focus:border-[#F39C12]'}`}
                    {...register(field)}
                  />
                  {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field].message}</p>}
                </div>
              ))}
              <button type="submit" className="w-full bg-[#F39C12] text-white font-bold py-3.5 rounded-xl hover:bg-amber-600 transition-all">
                Next: Services & Skills →
              </button>
            </form>
          )}

          {/* Step 2: Services */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Select the services you can provide:</p>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map((s) => (
                  <button key={s} type="button" onClick={() => toggleChip(s, services, setServices)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all
                      ${services.includes(s) ? 'bg-[#F39C12] text-white border-[#F39C12]' : 'border-gray-200 text-gray-600 hover:border-[#F39C12]'}`}>
                    {s}
                  </button>
                ))}
              </div>
              {services.length === 0 && <p className="text-xs text-red-500">Select at least one service</p>}
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50">← Back</button>
                <button onClick={() => services.length > 0 && setStep(3)} disabled={services.length === 0}
                  className="flex-1 py-3 bg-[#F39C12] text-white font-bold rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-all">
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: City & Pricing */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Cities you work in:</p>
                <div className="flex flex-wrap gap-2">
                  {CITIES.map((c) => (
                    <button key={c} type="button" onClick={() => toggleChip(c, cities, setCities)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all
                        ${cities.includes(c) ? 'bg-[#1A2B4A] text-white border-[#1A2B4A]' : 'border-gray-200 text-gray-600 hover:border-[#1A2B4A]'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="hourly-rate" className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (₹)</label>
                <input id="hourly-rate" type="number" min="100" max="2000" placeholder="350"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F39C12] text-sm outline-none" />
              </div>
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input id="experience" type="number" min="0" max="50" placeholder="5"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F39C12] text-sm outline-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50">← Back</button>
                <button onClick={() => setStep(4)} className="flex-1 py-3 bg-[#F39C12] text-white font-bold rounded-xl hover:bg-amber-600 transition-all">Next →</button>
              </div>
            </div>
          )}

          {/* Step 4: Documents (placeholder) */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400">
                <p className="text-3xl mb-2">🪪</p>
                <p className="text-sm font-medium">Upload Government ID</p>
                <p className="text-xs mt-1">Aadhar Card / PAN / Driving License</p>
                <button className="mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded-lg transition-all">
                  Choose File (coming soon)
                </button>
              </div>
              <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-4 py-3 rounded-xl">
                Document upload is optional for now. Our team will contact you for verification.
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 py-3 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50">← Back</button>
                <button onClick={handleFinalSubmit} className="flex-1 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all">
                  Submit Application ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
