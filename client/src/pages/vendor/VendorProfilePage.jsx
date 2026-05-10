import { useState, useEffect } from 'react';
import api from '../../services/axiosInstance';
import toast from 'react-hot-toast';

export default function VendorProfilePage() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bio, setBio] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    api.get('/vendors/portal/profile').then(({ data }) => {
      setVendor(data.vendor);
      setBio(data.vendor?.bio || '');
      setIsAvailable(data.vendor?.isAvailable ?? true);
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/vendors/portal/profile', { bio, isAvailable });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-64 bg-white rounded-2xl animate-pulse" />;

  return (
    <div className="animate-fade-in max-w-2xl space-y-5">
      <h2 className="text-2xl font-heading font-bold text-[#1A2B4A]">My Profile</h2>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 bg-[#F39C12] rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {vendor?.user?.name?.charAt(0) || 'V'}
          </div>
          <div>
            <p className="font-bold text-[#1A2B4A] text-lg">{vendor?.user?.name}</p>
            <p className="text-sm text-gray-400">{vendor?.user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-400' : 'bg-gray-300'}`} />
              <span className="text-xs text-gray-500">{isAvailable ? 'Available for jobs' : 'Not available'}</span>
            </div>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
          <div>
            <p className="text-sm font-semibold text-[#1A2B4A]">Availability Status</p>
            <p className="text-xs text-gray-400">Toggle off to pause incoming jobs</p>
          </div>
          <button
            id="availability-toggle"
            onClick={() => setIsAvailable(!isAvailable)}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isAvailable ? 'bg-green-400' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${isAvailable ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label htmlFor="vendor-bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            id="vendor-bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#F39C12] rounded-xl text-sm outline-none resize-none"
            placeholder="Tell customers about your expertise..."
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            ['⭐', vendor?.avgRating?.toFixed(1) || '—', 'Rating'],
            ['✅', vendor?.totalJobsCompleted || 0, 'Jobs Done'],
            ['🏅', `${vendor?.experience || 0} yrs`, 'Experience'],
          ].map(([icon, val, label]) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-lg">{icon}</p>
              <p className="font-bold text-[#1A2B4A] text-base">{val}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full bg-[#F39C12] hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
