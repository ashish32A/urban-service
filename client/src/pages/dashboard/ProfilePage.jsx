import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';

export default function ProfilePage() {
  const user = useSelector(selectUser);
  return (
    <div className="animate-fade-in max-w-2xl">
      <h2 className="text-2xl font-heading font-bold text-secondary-500 mb-6">My Profile</h2>
      <div className="card card-body space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-semibold text-secondary-500 text-lg">{user?.name || '—'}</p>
            <p className="text-sm text-gray-500">{user?.email || '—'}</p>
          </div>
        </div>
        <hr className="border-gray-100" />
        {[
          { label: 'Phone', value: user?.phone || '—' },
          { label: 'Role', value: user?.role || '—' },
          { label: 'Member since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—' },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-secondary-500 capitalize">{value}</span>
          </div>
        ))}
        <button className="btn btn-outline w-full mt-2">Edit Profile</button>
      </div>
    </div>
  );
}
