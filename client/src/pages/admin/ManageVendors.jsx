import { useState, useEffect } from 'react';
import api from '../../services/axiosInstance';
import toast from 'react-hot-toast';

const APPROVAL_BADGE = {
  true: 'bg-green-100 text-green-700',
  false: 'bg-yellow-100 text-yellow-700',
};

export default function ManageVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab === 'pending') params.approval = 'pending';
      if (activeTab === 'approved') params.approval = 'approved';
      const { data } = await api.get('/admin/vendors', { params });
      setVendors(data.vendors || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVendors(); }, [activeTab]);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/admin/vendors/${id}/approve`);
      toast.success('Vendor approved!');
      fetchVendors();
    } catch { toast.error('Failed to approve'); }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/admin/vendors/${id}/reject`);
      toast.success('Vendor rejected');
      fetchVendors();
    } catch { toast.error('Failed to reject'); }
  };

  const handleToggle = async (id) => {
    try {
      await api.patch(`/admin/vendors/${id}/toggle`);
      fetchVendors();
    } catch { toast.error('Action failed'); }
  };

  const filtered = vendors.filter((v) =>
    !search || v.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.user?.phone?.includes(search)
  );

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-heading font-bold text-[#1A2B4A] mb-6">Manage Vendors</h2>

      {/* Tabs + Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {['all', 'pending', 'approved'].map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all
                ${activeTab === t ? 'bg-white text-[#1A2B4A] shadow-sm' : 'text-gray-500 hover:text-[#1A2B4A]'}`}>
              {t}
            </button>
          ))}
        </div>
        <input
          type="text" placeholder="Search by name or phone..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border-2 border-gray-200 focus:border-[#E74C3C] rounded-xl text-sm outline-none w-56"
        />
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-xl h-16 animate-pulse" />)}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name', 'Phone', 'Services', 'Rating', 'Status', 'Approval', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((v) => (
                <tr key={v._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-[#1A2B4A]">{v.user?.name}</td>
                  <td className="px-4 py-3 text-gray-500">{v.user?.phone}</td>
                  <td className="px-4 py-3 text-gray-500">{v.services?.map((s) => s.name).join(', ').substring(0, 30) || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="text-[#F39C12] font-semibold">★ {v.avgRating?.toFixed(1) || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {v.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${APPROVAL_BADGE[v.isVerified]}`}>
                      {v.isVerified ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {!v.isVerified && (
                        <>
                          <button onClick={() => handleApprove(v._id)}
                            className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-all">
                            Approve
                          </button>
                          <button onClick={() => handleReject(v._id)}
                            className="px-3 py-1 bg-red-100 text-red-600 text-xs rounded-lg hover:bg-red-200 transition-all">
                            Reject
                          </button>
                        </>
                      )}
                      <button onClick={() => handleToggle(v._id)}
                        className="px-3 py-1 border border-gray-200 text-gray-500 text-xs rounded-lg hover:bg-gray-100 transition-all">
                        {v.isActive ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">No vendors found</div>
          )}
        </div>
      )}
    </div>
  );
}
