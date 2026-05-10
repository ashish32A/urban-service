import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/axiosInstance';

const STAR = '★';

export default function VendorListPage() {
  const [params] = useSearchParams();
  const serviceId = params.get('serviceId');
  const serviceName = params.get('name') || 'Service';
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');
  const [city, setCity] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/vendors/available', {
          params: { serviceId, sortBy, ...(city && { city }) },
        });
        setVendors(data.vendors || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (serviceId) fetch();
  }, [serviceId, sortBy, city]);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <div className="bg-[#1A2B4A] py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-gray-400 text-sm mb-1">Available professionals for</p>
          <h1 className="text-2xl font-heading font-bold text-white">{serviceName}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Sort + Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-sm text-gray-500 font-medium">Sort by:</span>
          {[['rating', '⭐ Top Rated'], ['price', '💰 Lowest Price'], ['experience', '🏅 Most Experienced']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setSortBy(val)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border
                ${sortBy === val ? 'bg-[#1A2B4A] text-white border-[#1A2B4A]' : 'bg-white border-gray-200 text-gray-600 hover:border-[#1A2B4A]'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-36 animate-pulse" />
            ))}
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">😔</p>
            <p className="font-medium">No professionals available</p>
            <p className="text-sm mt-1">Try a different city or service</p>
          </div>
        ) : (
          <div className="space-y-4">
            {vendors.map((vendor) => (
              <div key={vendor._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1A2B4A] to-[#2C3E50] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {vendor.user?.name?.charAt(0) || 'V'}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-[#1A2B4A] text-base">{vendor.user?.name}</h3>
                      <p className="text-xs text-gray-400">{vendor.businessName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#E74C3C]">₹{vendor.hourlyRate}<span className="text-xs font-normal text-gray-400">/hr</span></p>
                    </div>
                  </div>

                  {/* Ratings & Experience */}
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                    <span className="text-[#F39C12] font-semibold">
                      {STAR.repeat(Math.round(vendor.avgRating || 0))} {vendor.avgRating?.toFixed(1)} ({vendor.totalRatings} reviews)
                    </span>
                    <span>🏅 {vendor.experience} yrs experience</span>
                    <span>✅ {vendor.totalJobsCompleted} jobs done</span>
                  </div>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {vendor.cities?.map((c) => (
                      <span key={c} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">📍 {c}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 justify-end">
                  <Link
                    to={`/vendors/${vendor._id}`}
                    className="px-5 py-2.5 border-2 border-[#1A2B4A] text-[#1A2B4A] text-sm font-semibold rounded-xl hover:bg-[#1A2B4A] hover:text-white transition-all no-underline text-center"
                  >
                    View Profile
                  </Link>
                  <Link
                    to={`/book/${serviceId}?vendorId=${vendor._id}`}
                    className="px-5 py-2.5 bg-[#E74C3C] text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-all no-underline text-center"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
