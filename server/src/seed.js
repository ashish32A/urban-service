require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Booking = require('./models/Booking');
const { Category, Service } = require('./models/Service');

const CATEGORIES = [
  { name: 'AC Repair & Service', slug: 'ac-repair', icon: '❄️', color: '#DBEAFE', sortOrder: 1 },
  { name: 'Home Cleaning', slug: 'cleaning', icon: '🧹', color: '#D1FAE5', sortOrder: 2 },
  { name: 'Plumbing', slug: 'plumbing', icon: '🔧', color: '#FEF3C7', sortOrder: 3 },
  { name: 'Electrician', slug: 'electrical', icon: '⚡', color: '#FDE8D8', sortOrder: 4 },
  { name: 'Painting', slug: 'painting', icon: '🎨', color: '#EDE9FE', sortOrder: 5 },
  { name: 'Pest Control', slug: 'pest-control', icon: '🐛', color: '#FCE7F3', sortOrder: 6 },
  { name: 'Carpentry', slug: 'carpentry', icon: '🪚', color: '#FEF9C3', sortOrder: 7 },
  { name: 'Appliance Repair', slug: 'appliance-repair', icon: '🛠️', color: '#F1F5F9', sortOrder: 8 },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/urban_db');
    console.log('✅ Connected to MongoDB');

    // Drop existing database to clear data and old indexes
    await mongoose.connection.db.dropDatabase();
    console.log('🗑️  Dropped database (cleared data & indexes)');

    // ── Admin ────────────────────────────────────────────────────────────────
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@urbanserve.com',
      phone: '9000000000',
      password: await bcrypt.hash('Admin@1234', 12),
      role: 'admin',
      isPhoneVerified: true,
      isProfileComplete: true,
      isActive: true,
    });
    console.log('👤 Admin created: admin@urbanserve.com / Admin@1234');

    // ── Categories ────────────────────────────────────────────────────────────
    const categories = await Category.insertMany(CATEGORIES);
    console.log(`📁 ${categories.length} categories created`);

    const catMap = Object.fromEntries(categories.map((c) => [c.slug, c._id]));

    // ── Services ──────────────────────────────────────────────────────────────
    const services = await Service.insertMany([
      // AC Repair
      { name: 'AC Deep Service', slug: 'ac-deep-service', category: catMap['ac-repair'], basePrice: 599, estimatedDuration: 90, priceUnit: 'fixed', description: 'Complete AC cleaning, gas check, and filter service', avgRating: 4.6 },
      { name: 'AC Installation', slug: 'ac-installation', category: catMap['ac-repair'], basePrice: 999, estimatedDuration: 120, priceUnit: 'fixed', description: 'Professional AC installation with 1-year warranty', avgRating: 4.7 },
      { name: 'AC Gas Charge', slug: 'ac-gas-charge', category: catMap['ac-repair'], basePrice: 2499, estimatedDuration: 60, priceUnit: 'fixed', description: 'Complete AC gas refill with leak check', avgRating: 4.5 },
      { name: 'AC PCB Repair', slug: 'ac-pcb-repair', category: catMap['ac-repair'], basePrice: 1499, estimatedDuration: 120, priceUnit: 'fixed', description: 'Circuit board repair for split or window ACs', avgRating: 4.3 },
      { name: 'Window AC Uninstallation', slug: 'window-ac-uninstallation', category: catMap['ac-repair'], basePrice: 399, estimatedDuration: 45, priceUnit: 'fixed', description: 'Safe removal of window AC units', avgRating: 4.8 },

      // Cleaning
      { name: 'Full Home Cleaning', slug: 'full-home-cleaning', category: catMap['cleaning'], basePrice: 1499, estimatedDuration: 180, priceUnit: 'fixed', description: '3-4 BHK deep cleaning with eco-friendly products', avgRating: 4.8 },
      { name: 'Bathroom Cleaning', slug: 'bathroom-cleaning', category: catMap['cleaning'], basePrice: 299, estimatedDuration: 60, priceUnit: 'fixed', description: 'Deep bathroom scrubbing and sanitization', avgRating: 4.5 },
      { name: 'Sofa Cleaning', slug: 'sofa-cleaning', category: catMap['cleaning'], basePrice: 499, estimatedDuration: 90, priceUnit: 'fixed', description: 'Shampoo and vacuum for 3-seater sofa', avgRating: 4.6 },
      { name: 'Kitchen Deep Cleaning', slug: 'kitchen-deep-cleaning', category: catMap['cleaning'], basePrice: 899, estimatedDuration: 120, priceUnit: 'fixed', description: 'Stain removal and cabinet deep clean', avgRating: 4.7 },
      { name: 'Post-Party Cleanup', slug: 'post-party-cleanup', category: catMap['cleaning'], basePrice: 1999, estimatedDuration: 240, priceUnit: 'fixed', description: 'Complete house cleaning after events', avgRating: 4.9 },

      // Plumbing
      { name: 'Pipe Leak Fix', slug: 'pipe-leak-fix', category: catMap['plumbing'], basePrice: 199, estimatedDuration: 45, priceUnit: 'fixed', description: 'Fast detection and repair of pipe leaks', avgRating: 4.4 },
      { name: 'Tap Installation', slug: 'tap-installation', category: catMap['plumbing'], basePrice: 149, estimatedDuration: 30, priceUnit: 'fixed', description: 'Supply and install new taps', avgRating: 4.6 },
      { name: 'Toilet Blockage Fix', slug: 'toilet-blockage-fix', category: catMap['plumbing'], basePrice: 499, estimatedDuration: 60, priceUnit: 'fixed', description: 'Professional unblocking of toilets', avgRating: 4.5 },
      { name: 'Water Tank Cleaning', slug: 'water-tank-cleaning', category: catMap['plumbing'], basePrice: 799, estimatedDuration: 120, priceUnit: 'fixed', description: 'Anti-bacterial cleaning for up to 1000L tanks', avgRating: 4.7 },
      { name: 'Shower Installation', slug: 'shower-installation', category: catMap['plumbing'], basePrice: 299, estimatedDuration: 45, priceUnit: 'fixed', description: 'Mounting and connection of shower heads', avgRating: 4.8 },

      // Electrical
      { name: 'Fan Installation', slug: 'fan-installation', category: catMap['electrical'], basePrice: 199, estimatedDuration: 30, priceUnit: 'fixed', description: 'Ceiling fan fitting and wiring', avgRating: 4.7 },
      { name: 'Switchboard Repair', slug: 'switchboard-repair', category: catMap['electrical'], basePrice: 149, estimatedDuration: 45, priceUnit: 'fixed', description: 'Repair faulty switches, sockets & MCBs', avgRating: 4.5 },
      { name: 'MCB Fuse Replacement', slug: 'mcb-fuse-replacement', category: catMap['electrical'], basePrice: 299, estimatedDuration: 30, priceUnit: 'fixed', description: 'Replacement of burnt out fuses and MCBs', avgRating: 4.6 },
      { name: 'Inverter Installation', slug: 'inverter-installation', category: catMap['electrical'], basePrice: 499, estimatedDuration: 90, priceUnit: 'fixed', description: 'Setup of inverter and battery connections', avgRating: 4.8 },
      { name: 'Tube Light Fitting', slug: 'tube-light-fitting', category: catMap['electrical'], basePrice: 99, estimatedDuration: 20, priceUnit: 'fixed', description: 'Installation of LED tube lights', avgRating: 4.4 },

      // Painting
      { name: 'Room Painting', slug: 'room-painting', category: catMap['painting'], basePrice: 2499, estimatedDuration: 480, priceUnit: 'per_sqft', description: 'Interior painting with premium Asian Paints', avgRating: 4.6 },
      { name: 'Full House Painting', slug: 'full-house-painting', category: catMap['painting'], basePrice: 14999, estimatedDuration: 2880, priceUnit: 'fixed', description: 'Complete interior and exterior painting', avgRating: 4.8 },
      { name: 'Texture Painting', slug: 'texture-painting', category: catMap['painting'], basePrice: 3999, estimatedDuration: 960, priceUnit: 'per_sqft', description: 'Custom wall textures for living rooms', avgRating: 4.9 },
      { name: 'Wood Polishing', slug: 'wood-polishing', category: catMap['painting'], basePrice: 1999, estimatedDuration: 360, priceUnit: 'fixed', description: 'PU and Melamine polish for doors and furniture', avgRating: 4.7 },
      { name: 'Waterproofing', slug: 'waterproofing', category: catMap['painting'], basePrice: 5999, estimatedDuration: 1440, priceUnit: 'per_sqft', description: 'Terrace and bathroom waterproofing solutions', avgRating: 4.5 },

      // Pest Control
      { name: 'Cockroach Treatment', slug: 'cockroach-treatment', category: catMap['pest-control'], basePrice: 499, estimatedDuration: 60, priceUnit: 'fixed', description: 'Gel-based cockroach elimination', avgRating: 4.3 },
      { name: 'Termite Control', slug: 'termite-control', category: catMap['pest-control'], basePrice: 3999, estimatedDuration: 240, priceUnit: 'fixed', description: 'Drill-fill-seal anti-termite treatment', avgRating: 4.6 },
      { name: 'Bed Bug Treatment', slug: 'bed-bug-treatment', category: catMap['pest-control'], basePrice: 1499, estimatedDuration: 120, priceUnit: 'fixed', description: 'Chemical spray for bed bugs (2 visits)', avgRating: 4.4 },
      { name: 'Ant Control', slug: 'ant-control', category: catMap['pest-control'], basePrice: 399, estimatedDuration: 45, priceUnit: 'fixed', description: 'Targeted gel application for ant infestations', avgRating: 4.5 },
      { name: 'Mosquito Control', slug: 'mosquito-control', category: catMap['pest-control'], basePrice: 899, estimatedDuration: 90, priceUnit: 'fixed', description: 'Indoor and outdoor thermal fogging', avgRating: 4.7 },

      // Carpentry
      { name: 'Furniture Assembly', slug: 'furniture-assembly', category: catMap['carpentry'], basePrice: 299, estimatedDuration: 90, priceUnit: 'fixed', description: 'IKEA and flat-pack furniture assembly', avgRating: 4.5 },
      { name: 'Door Lock Repair', slug: 'door-lock-repair', category: catMap['carpentry'], basePrice: 199, estimatedDuration: 45, priceUnit: 'fixed', description: 'Fixing jammed or broken door locks', avgRating: 4.6 },
      { name: 'Custom Wardrobe', slug: 'custom-wardrobe', category: catMap['carpentry'], basePrice: 15000, estimatedDuration: 2880, priceUnit: 'fixed', description: 'Built-to-order wooden wardrobes', avgRating: 4.9 },
      { name: 'Bed Repair', slug: 'bed-repair', category: catMap['carpentry'], basePrice: 499, estimatedDuration: 120, priceUnit: 'fixed', description: 'Fixing squeaky or broken bed frames', avgRating: 4.4 },
      { name: 'Drill & Hang', slug: 'drill-hang', category: catMap['carpentry'], basePrice: 149, estimatedDuration: 30, priceUnit: 'fixed', description: 'Drilling for shelves, mirrors, or frames', avgRating: 4.8 },

      // Appliance Repair
      { name: 'Washing Machine Repair', slug: 'washing-machine-repair', category: catMap['appliance-repair'], basePrice: 299, estimatedDuration: 60, priceUnit: 'fixed', description: 'All brands, all types of washing machine repair', avgRating: 4.4 },
      { name: 'Refrigerator Repair', slug: 'refrigerator-repair', category: catMap['appliance-repair'], basePrice: 349, estimatedDuration: 60, priceUnit: 'fixed', description: 'Cooling issues and compressor checks', avgRating: 4.5 },
      { name: 'Microwave Repair', slug: 'microwave-repair', category: catMap['appliance-repair'], basePrice: 249, estimatedDuration: 45, priceUnit: 'fixed', description: 'Fixing heating and display issues', avgRating: 4.6 },
      { name: 'Water Purifier Service', slug: 'water-purifier-service', category: catMap['appliance-repair'], basePrice: 399, estimatedDuration: 60, priceUnit: 'fixed', description: 'Filter replacement and RO servicing', avgRating: 4.7 },
      { name: 'Geyser Repair', slug: 'geyser-repair', category: catMap['appliance-repair'], basePrice: 299, estimatedDuration: 45, priceUnit: 'fixed', description: 'Thermostat and heating coil replacements', avgRating: 4.5 },
    ]);
    console.log(`🛠️  ${services.length} services created`);

    // ── Customers ──────────────────────────────────────────────────────────────
    const customers = await User.insertMany([
      { name: 'Amit Singh', phone: '9888888888', role: 'customer', isPhoneVerified: true, isProfileComplete: true, city: 'Mumbai' },
      { name: 'Neha Gupta', phone: '9777777777', role: 'customer', isPhoneVerified: true, isProfileComplete: true, city: 'Bangalore' },
      { name: 'Rahul Desai', phone: '9666666666', role: 'customer', isPhoneVerified: true, isProfileComplete: true, city: 'Delhi' },
      { name: 'Test User', phone: '9999999999', role: 'customer', isPhoneVerified: true, isProfileComplete: true, city: 'Mumbai' },
    ]);
    console.log(`👥 3 customers created`);

    // ── Vendors ────────────────────────────────────────────────────────────────
    const vendorUsers = await User.insertMany([
      { name: 'Rajesh Kumar', email: 'rajesh@vendor.com', phone: '9111111111', password: await bcrypt.hash('Vendor@123', 12), role: 'vendor', isPhoneVerified: true, isProfileComplete: true },
      { name: 'Priya Sharma', email: 'priya@vendor.com', phone: '9222222222', password: await bcrypt.hash('Vendor@123', 12), role: 'vendor', isPhoneVerified: true, isProfileComplete: true },
      { name: 'Mohammed Ali', email: 'ali@vendor.com', phone: '9333333333', password: await bcrypt.hash('Vendor@123', 12), role: 'vendor', isPhoneVerified: true, isProfileComplete: true },
    ]);

    const vendors = await Vendor.insertMany([
      {
        user: vendorUsers[0]._id,
        businessName: 'RK Home Services',
        bio: '10+ years in AC repair and electrical work across Mumbai.',
        experience: 10,
        services: [services[0]._id, services[1]._id, services[6]._id, services[7]._id],
        cities: ['Mumbai', 'Thane', 'Navi Mumbai'],
        hourlyRate: 350,
        isVerified: true,
        isAvailable: true,
        avgRating: 4.7,
        totalRatings: 238,
        totalJobsCompleted: 312,
      },
      {
        user: vendorUsers[1]._id,
        businessName: 'Priya Clean Pro',
        bio: 'Specialist in deep cleaning and sanitization services.',
        experience: 6,
        services: [services[2]._id, services[3]._id],
        cities: ['Bangalore', 'Mysore'],
        hourlyRate: 280,
        isVerified: true,
        isAvailable: true,
        avgRating: 4.8,
        totalRatings: 185,
        totalJobsCompleted: 201,
      },
      {
        user: vendorUsers[2]._id,
        businessName: 'Ali Plumbing Works',
        bio: 'Licensed plumber with expertise in residential and commercial projects.',
        experience: 8,
        services: [services[4]._id, services[5]._id],
        cities: ['Delhi', 'Gurgaon', 'Noida'],
        hourlyRate: 300,
        isVerified: true,
        isAvailable: true,
        avgRating: 4.5,
        totalRatings: 142,
        totalJobsCompleted: 178,
      },
    ]);
    console.log(`👷 3 vendors created`);
    console.log('\n✅ Seed complete!');
    console.log('\n📋 Credentials:');
    console.log('   Admin:    admin@urbanserve.com / Admin@1234');
    console.log('   Vendor:   rajesh@vendor.com / Vendor@123');
    console.log('   Customer: 9888888888 (Use OTP 123456 or view terminal for OTP)');

    // ── Bookings ──────────────────────────────────────────────────────────────
    const dummyAddress = { line1: '123 Main Street', city: 'Mumbai', pincode: '400001' };
    const now = new Date();

    const testUser = customers.find((c) => c.phone === '9999999999') || customers[0];
    const rajeshVendor = vendors[0];

    await Booking.insertMany([
      // --- VENDOR RAJESH DATA ---
      {
        customer: customers[0]._id,
        vendor: rajeshVendor._id,
        service: services[0]._id,
        scheduledAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow (Upcoming)
        timeSlot: 'morning',
        address: dummyAddress,
        status: 'confirmed',
        pricing: { basePrice: 599, total: 599 },
      },
      {
        customer: customers[1]._id,
        vendor: rajeshVendor._id,
        service: services[1]._id,
        scheduledAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (Completed)
        timeSlot: 'afternoon',
        address: dummyAddress,
        status: 'completed',
        pricing: { basePrice: 999, total: 999 },
        completedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        customer: customers[2]._id,
        vendor: rajeshVendor._id,
        service: services[2]._id,
        scheduledAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (Cancelled)
        timeSlot: 'evening',
        address: dummyAddress,
        status: 'cancelled',
        cancellationReason: 'Vendor unavailable',
        pricing: { basePrice: 2499, total: 2499 },
        cancelledAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      },
      // --- TEST USER (9892653200) DATA ---
      {
        customer: testUser._id,
        vendor: vendors[1]._id, // Different vendor
        service: services[5]._id, // Cleaning
        scheduledAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow (Upcoming)
        timeSlot: 'morning',
        address: dummyAddress,
        status: 'confirmed',
        pricing: { basePrice: 1499, total: 1499 },
      },
      {
        customer: testUser._id,
        vendor: vendors[2]._id,
        service: services[10]._id, // Plumbing
        scheduledAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago (Completed)
        timeSlot: 'afternoon',
        address: dummyAddress,
        status: 'completed',
        pricing: { basePrice: 199, total: 199 },
        completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        customer: testUser._id,
        vendor: vendors[1]._id,
        service: services[6]._id,
        scheduledAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago (Cancelled)
        timeSlot: 'morning',
        address: dummyAddress,
        status: 'cancelled',
        cancellationReason: 'Changed my mind',
        pricing: { basePrice: 299, total: 299 },
        cancelledAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      },
      // --- PENDING REQUEST FOR VENDOR DASHBOARD ---
      {
        customer: customers[1]._id,
        service: services[6]._id,
        scheduledAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // Pending
        timeSlot: 'evening',
        address: dummyAddress,
        status: 'pending',
        pricing: { basePrice: 299, total: 299 },
      }
    ]);
    console.log(`📅 6 bookings created\n`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();
