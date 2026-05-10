import { useState } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { name: 'AC Repair', icon: '❄️', slug: 'ac-repair', bg: '#DBEAFE' },
  { name: 'Cleaning', icon: '🧹', slug: 'cleaning', bg: '#D1FAE5' },
  { name: 'Plumbing', icon: '🔧', slug: 'plumbing', bg: '#FEF3C7' },
  { name: 'Electrician', icon: '⚡', slug: 'electrical', bg: '#FDE8D8' },
  { name: 'Painting', icon: '🎨', slug: 'painting', bg: '#EDE9FE' },
  { name: 'Pest Control', icon: '🐛', slug: 'pest-control', bg: '#FCE7F3' },
  { name: 'Carpentry', icon: '🪚', slug: 'carpentry', bg: '#FEF9C3' },
  { name: 'Appliance Repair', icon: '🛠️', slug: 'appliance-repair', bg: '#F1F5F9' },
];

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];

const TRUST_BADGES = [
  { icon: '✅', title: 'Verified Professionals', desc: 'Background-checked & trained experts' },
  { icon: '🛡️', title: 'Insured Work', desc: 'Up to ₹10,000 property damage cover' },
  { icon: '⭐', title: 'Satisfaction Guarantee', desc: 'Free redo if not 100% satisfied' },
  { icon: '📍', title: 'On-Time Arrival', desc: 'Professionals arrive within the slot' },
];

const STEPS = [
  { num: '01', title: 'Book Online', desc: 'Choose service, pick a time slot. Takes under 2 minutes.', icon: '📱' },
  { num: '02', title: 'Professional Arrives', desc: 'Verified expert arrives with all tools at your doorstep.', icon: '🚗' },
  { num: '03', title: 'Job Done!', desc: 'Quality work completed. Pay via OTP verification.', icon: '✅' },
];

export default function LandingPage() {
  const [city, setCity] = useState('');
  const [service, setService] = useState('');

  return (
    <div className="font-sans">


      {/* ─── Hero Banner ────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#1A2B4A] via-[#1e3461] to-[#0d1e3c] text-white py-20 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-5"
            style={{ background: 'radial-gradient(ellipse at top right, #E74C3C 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F39C12] opacity-5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="text-[#F39C12]">★★★★★</span>
              <span className="text-gray-300">Trusted by 50,000+ customers across India</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-4 text-white">
              Home Services,{' '}
              <span style={{ background: 'linear-gradient(135deg, #E74C3C, #F39C12)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Simplified
              </span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Book verified professionals for cleaning, repairs, beauty & more. Quality guaranteed with same-day availability.
            </p>
          </div>

          {/* ─── MakeMyTrip-Style Search Bar ──────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-2xl p-3 sm:p-2 max-w-3xl mx-auto flex flex-col sm:flex-row gap-2">
            {/* City Selector */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 sm:py-2 bg-gray-50 rounded-xl border border-gray-100 sm:border-none">
              <span className="text-xl">📍</span>
              <div className="flex-1 text-left">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">City</label>
                <select
                  id="hero-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent text-[#1A2B4A] font-semibold text-sm outline-none cursor-pointer"
                >
                  <option value="">Select your city</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="w-px bg-gray-200 hidden sm:block" />

            {/* Service Selector */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 sm:py-2 bg-gray-50 rounded-xl border border-gray-100 sm:border-none">
              <span className="text-xl">🔍</span>
              <div className="flex-1 text-left">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Service</label>
                <select
                  id="hero-service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-transparent text-[#1A2B4A] font-semibold text-sm outline-none cursor-pointer"
                >
                  <option value="">What do you need?</option>
                  {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
            </div>

            {/* CTA */}
            <Link
              to={service ? `/services/${service}` : '/services'}
              className="bg-[#E74C3C] hover:bg-red-600 text-white font-bold px-8 py-4 sm:py-3.5 rounded-xl transition-all
                         shadow-lg hover:shadow-red-200 active:scale-95 whitespace-nowrap no-underline text-sm flex items-center justify-center gap-2"
            >
              🔍 Find Professionals
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-12 mt-10">
            {[['50K+', 'Happy Customers'], ['5K+', 'Verified Pros'], ['30+', 'Services'], ['4.8★', 'Avg Rating']].map(([v, l]) => (
              <div key={l} className="text-center min-w-[80px]">
                <p className="text-xl sm:text-2xl font-bold text-[#F39C12]">{v}</p>
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase font-medium">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Category Grid ───────────────────────────────────────────────── */}
      <section id="services" className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1A2B4A]">What are you looking for?</h2>
            <p className="text-gray-500 text-sm mt-2">Choose from 30+ professional home service categories</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {CATEGORIES.map(({ name, icon, slug, bg }) => (
              <Link
                key={slug}
                to={`/services/${slug}`}
                className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100
                           shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 no-underline cursor-pointer"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
                              group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: bg }}
                >
                  {icon}
                </div>
                <p className="text-xs font-semibold text-[#1A2B4A] text-center group-hover:text-[#E74C3C] transition-colors leading-tight">
                  {name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-[#1A2B4A]">How UrbanServe Works</h2>
            <p className="text-gray-500 mt-2">Getting help at home has never been easier</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-[#E74C3C] to-[#F39C12] hidden md:block" aria-hidden="true" />

            {STEPS.map(({ num, title, desc, icon }) => (
              <div key={num} className="text-center relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-[#1A2B4A] to-[#2C3E50] rounded-full
                                flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg ring-4 ring-white">
                  {icon}
                </div>
                <span className="inline-block bg-[#E74C3C] text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                  Step {num}
                </span>
                <h3 className="font-heading font-bold text-[#1A2B4A] text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust Badges ────────────────────────────────────────────────── */}
      <section className="py-12 bg-[#1A2B4A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_BADGES.map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 text-white">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Strip ───────────────────────────────────────────────────── */}
      <section className="py-14 bg-gradient-to-r from-[#E74C3C] to-[#c0392b] text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold mb-3">Book Your First Service Today</h2>
          <p className="text-red-100 mb-8">New user? Get ₹100 off your first booking with code <strong>URBAN100</strong></p>
          <Link to="/register"
            className="inline-block bg-white text-[#E74C3C] font-bold px-10 py-4 rounded-xl
                       shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 no-underline">
            Get Started — It's Free →
          </Link>
        </div>
      </section>


    </div>
  );
}
