import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/axiosInstance';

const CATEGORIES = [
  { name: 'All Services', slug: '' },
  { name: 'AC Repair', slug: 'ac-repair' },
  { name: 'Cleaning', slug: 'cleaning' },
  { name: 'Plumbing', slug: 'plumbing' },
  { name: 'Electrician', slug: 'electrical' },
  { name: 'Painting', slug: 'painting' },
  { name: 'Pest Control', slug: 'pest-control' },
  { name: 'Carpentry', slug: 'carpentry' },
  { name: 'Appliance Repair', slug: 'appliance-repair' },
];

const CATEGORY_IMAGES = {
  'ac-repair': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop',
  'cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop',
  'plumbing': 'https://images.unsplash.com/photo-1607472586893-edb57cbceb42?q=80&w=400&auto=format&fit=crop',
  'electrical': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=400&auto=format&fit=crop',
  'painting': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=400&auto=format&fit=crop',
  'pest-control': 'https://images.unsplash.com/photo-1518296316279-e58eb91f5313?q=80&w=400&auto=format&fit=crop',
  'carpentry': 'https://images.unsplash.com/photo-1505015920881-0f83c2f7c95e?q=80&w=400&auto=format&fit=crop',
  'appliance-repair': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=400&auto=format&fit=crop',
};

const STAR = '★';

export default function ServicesPage() {
  const { categorySlug } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(categorySlug || '');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const fetchServices = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeCategory) params.category = activeCategory;
        if (search) params.search = search;
        if (maxPrice < 5000) params.maxPrice = maxPrice;
        const { data } = await api.get('/services', { params, signal: controller.signal });
        setServices(data.services || []);
      } catch (err) {
        if (err.name !== 'CanceledError') console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
    return () => controller.abort();
  }, [activeCategory, search, maxPrice]);

  const filtered = services.filter((s) => s.avgRating >= minRating);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Search Header */}
      <div className="bg-[#1A2B4A] py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-heading font-bold text-white mb-4">Find a Service</h1>
          <input
            id="service-search"
            type="text"
            placeholder="Search for cleaning, AC repair, plumbing..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3.5 rounded-xl text-sm bg-white text-gray-800 outline-none shadow-lg
                       focus:ring-2 focus:ring-[#E74C3C]"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        {/* ── Sidebar Filters ── */}
        <aside className="hidden lg:block w-56 flex-shrink-0 space-y-6">
          {/* Category Chips */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Category</h3>
            <div className="space-y-1">
              {CATEGORIES.map(({ name, slug }) => (
                <button
                  key={slug}
                  onClick={() => setActiveCategory(slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${activeCategory === slug
                      ? 'bg-[#E74C3C] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Max Price: <span className="text-[#E74C3C]">₹{maxPrice}</span>
            </h3>
            <input
              type="range" min={100} max={5000} step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#E74C3C]"
            />
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Min Rating</h3>
            <div className="flex gap-1 flex-wrap">
              {[0, 3, 3.5, 4, 4.5].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium border transition-all
                    ${minRating === r ? 'bg-[#F39C12] text-white border-[#F39C12]' : 'border-gray-200 text-gray-600 hover:border-[#F39C12]'}`}
                >
                  {r === 0 ? 'All' : `${r}${STAR}+`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Service Grid ── */}
        <div className="flex-1">
          {/* Mobile Category Scroll */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-4">
            {CATEGORIES.map(({ name, slug }) => (
              <button
                key={slug}
                onClick={() => setActiveCategory(slug)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all
                  ${activeCategory === slug ? 'bg-[#E74C3C] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{filtered.length} services found</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-medium">No services found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((service) => (
                <div key={service._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                  {/* Real Image */}
                  <div className="h-36 w-full overflow-hidden">
                    <img
                      src={service.image || CATEGORY_IMAGES[service.category?.slug] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop'}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-[#1A2B4A] text-sm leading-tight">{service.name}</h3>
                      <span className="flex-shrink-0 text-xs font-medium text-[#F39C12]">
                        {STAR} {service.avgRating?.toFixed(1) || '—'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400">Starting from</span>
                        <p className="font-bold text-[#E74C3C] text-lg">₹{service.basePrice}</p>
                      </div>
                      {service.estimatedDuration && (
                        <span className="text-xs text-gray-400">⏱ {service.estimatedDuration} min</span>
                      )}
                    </div>
                    <Link
                      to={`/vendors?serviceId=${service._id}&name=${encodeURIComponent(service.name)}`}
                      className="mt-3 w-full flex items-center justify-center bg-[#E74C3C] hover:bg-red-600
                                 text-white text-sm font-semibold py-2.5 rounded-xl transition-all no-underline"
                    >
                      Book Now →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
