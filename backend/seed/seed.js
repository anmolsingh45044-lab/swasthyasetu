/**
 * Seed script - populates MongoDB with realistic DEMO data so the app is
 * never empty right after install. All seeded documents are flagged
 * isDemo: true so they can be distinguished from real production data.
 *
 * Run with: npm run seed
 */
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Facility = require('../models/Facility');
const BloodInventory = require('../models/BloodInventory');
const BloodRequest = require('../models/BloodRequest');
const Bed = require('../models/Bed');
const OxygenInventory = require('../models/OxygenInventory');
const Delivery = require('../models/Delivery');
const Donation = require('../models/Donation');
const ResourceRequest = require('../models/ResourceRequest');
const Notification = require('../models/Notification');

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const facilitiesData = [
  {
    name: 'District General Hospital, Ghaziabad',
    type: 'Government Hospital',
    services: ['Emergency', 'ICU', 'Blood Bank', 'Oxygen Plant', 'Maternity'],
    address: 'Nehru Nagar, Ghaziabad',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    pincode: '201001',
    phone: '0120-2345678',
    location: { lat: 28.6692, lng: 77.4538 }
  },
  {
    name: 'Community Health Centre, Loni',
    type: 'Community Health Centre',
    services: ['General Ward', 'Vaccination', 'Diagnostics'],
    address: 'Loni Road',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    pincode: '201102',
    phone: '0120-2765432',
    location: { lat: 28.7515, lng: 77.2905 }
  },
  {
    name: 'Rural Primary Health Centre, Muradnagar',
    type: 'Primary Health Centre',
    services: ['OPD', 'Basic Diagnostics', 'Maternal Care'],
    address: 'Muradnagar',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    pincode: '201206',
    phone: '0120-2988877',
    location: { lat: 28.7773, lng: 77.4938 }
  },
  {
    name: 'Sanjay Nagar Blood Bank',
    type: 'Blood Bank',
    services: ['Blood Storage', 'Component Separation'],
    address: 'Sanjay Nagar',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    pincode: '201002',
    phone: '0120-2551122',
    location: { lat: 28.6862, lng: 77.4408 }
  },
  {
    name: 'Metro Care Multispeciality Hospital',
    type: 'Private Hospital',
    services: ['Emergency', 'ICU', 'Surgery', 'Diagnostics', 'Pharmacy'],
    address: 'Raj Nagar Extension',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    pincode: '201017',
    phone: '0120-4567890',
    location: { lat: 28.7196, lng: 77.4269 }
  },
  {
    name: 'Civil Hospital, Meerut',
    type: 'Government Hospital',
    services: ['Emergency', 'ICU', 'Blood Bank', 'Oxygen Plant'],
    address: 'Civil Lines',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    pincode: '250001',
    phone: '0121-2653211',
    location: { lat: 28.9845, lng: 77.7064 }
  }
];

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const run = async () => {
  await connectDB();
  console.log('[Seed] Connected. Clearing existing demo data...');

  await Promise.all([
    User.deleteMany({ isDemo: true }),
    Facility.deleteMany({ isDemo: true }),
    BloodInventory.deleteMany({ isDemo: true }),
    BloodRequest.deleteMany({ isDemo: true }),
    Bed.deleteMany({ isDemo: true }),
    OxygenInventory.deleteMany({ isDemo: true }),
    Delivery.deleteMany({ isDemo: true }),
    Donation.deleteMany({ isDemo: true }),
    ResourceRequest.deleteMany({ isDemo: true }),
    Notification.deleteMany({ isDemo: true })
  ]);

  console.log('[Seed] Creating facilities...');
  const facilities = await Facility.insertMany(facilitiesData.map((f) => ({ ...f, isDemo: true })));

  console.log('[Seed] Creating blood inventory...');
  const bloodInventoryDocs = [];
  facilities.forEach((facility) => {
    BLOOD_GROUPS.forEach((bg) => {
      bloodInventoryDocs.push({
        facility: facility._id,
        bloodGroup: bg,
        units: randomBetween(0, 40),
        isDemo: true
      });
    });
  });
  await BloodInventory.insertMany(bloodInventoryDocs);

  console.log('[Seed] Creating bed availability...');
  const bedTypes = ['General', 'ICU', 'Emergency', 'Maternal', 'Pediatric'];
  const bedDocs = [];
  facilities.forEach((facility) => {
    bedTypes.forEach((type) => {
      const total = randomBetween(5, 40);
      bedDocs.push({
        facility: facility._id,
        bedType: type,
        totalBeds: total,
        availableBeds: randomBetween(0, total),
        isDemo: true
      });
    });
  });
  await Bed.insertMany(bedDocs);

  console.log('[Seed] Creating oxygen inventory...');
  const oxygenDocs = facilities.map((facility) => ({
    facility: facility._id,
    cylinderType: ['B-Type', 'D-Type', 'Jumbo'][randomBetween(0, 2)],
    availableCylinders: randomBetween(0, 60),
    capacity: '10L',
    isDemo: true
  }));
  await OxygenInventory.insertMany(oxygenDocs);

  console.log('[Seed] Creating demo users (patients + donors + admin)...');
  const adminExists = await User.findOne({ email: 'admin@swasthyasetu.demo' });
  if (!adminExists) {
    await User.create({
      name: 'Swasthya Setu Admin',
      email: 'admin@swasthyasetu.demo',
      password: 'Admin@123',
      role: 'admin',
      activeMode: 'patient',
      phone: '9999900000',
      isDemo: true
    });
  }

  const demoPeople = [
    { name: 'Ravi Kumar', email: 'ravi.patient@demo.com', bloodGroup: 'O+' },
    { name: 'Sunita Devi', email: 'sunita.patient@demo.com', bloodGroup: 'B+' },
    { name: 'Anil Sharma', email: 'anil.donor@demo.com', bloodGroup: 'A+' },
    { name: 'Priya Singh', email: 'priya.donor@demo.com', bloodGroup: 'AB+' },
    { name: 'Mohammed Aslam', email: 'aslam.donor@demo.com', bloodGroup: 'O-' }
  ];

  const users = [];
  for (const person of demoPeople) {
    const existing = await User.findOne({ email: person.email });
    if (existing) {
      users.push(existing);
      continue;
    }
    const user = await User.create({
      name: person.name,
      email: person.email,
      password: 'Demo@123',
      bloodGroup: person.bloodGroup,
      phone: `9${randomBetween(100000000, 999999999)}`,
      activeMode: person.email.includes('donor') ? 'donor' : 'patient',
      donorProfile: { isAvailable: true, totalDonations: randomBetween(0, 5) },
      location: { city: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538 },
      isDemo: true
    });
    users.push(user);
  }

  console.log('[Seed] Creating blood requests...');
  const patientUsers = users.filter((u) => u.activeMode === 'patient');
  const bloodRequestDocs = patientUsers.map((patient, idx) => ({
    requestedBy: patient._id,
    facility: facilities[idx % facilities.length]._id,
    bloodGroup: patient.bloodGroup || BLOOD_GROUPS[randomBetween(0, 7)],
    units: randomBetween(1, 4),
    urgency: ['Normal', 'Urgent', 'Critical'][randomBetween(0, 2)],
    status: 'Pending',
    isDemo: true
  }));
  const bloodRequests = await BloodRequest.insertMany(bloodRequestDocs);

  console.log('[Seed] Creating a sample delivery in progress...');
  if (bloodRequests.length) {
    await Delivery.create({
      requestType: 'BloodRequest',
      request: bloodRequests[0]._id,
      pickupFacility: facilities[0]._id,
      destination: 'Patient residence, Ghaziabad',
      status: 'In Transit',
      estimatedDeliveryTime: new Date(Date.now() + 1000 * 60 * 60 * 2),
      isDemo: true
    });
  }

  console.log('[Seed] Creating a sample resource request...');
  await ResourceRequest.create({
    requestedBy: patientUsers[0]._id,
    facility: facilities[0]._id,
    resourceType: 'Bed',
    details: 'ICU bed needed for elderly patient',
    quantity: 1,
    urgency: 'Urgent',
    status: 'Pending',
    isDemo: true
  });

  console.log('[Seed] Creating donation history and notifications...');
  const donorUsers = users.filter((user) => user.activeMode === 'donor');
  const donationDates = [
    new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
    new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 5)
  ];
  await Donation.insertMany([
    {
      donor: donorUsers[0]._id,
      facility: facilities[0]._id,
      bloodGroup: donorUsers[0].bloodGroup,
      units: 1,
      donationDate: donationDates[0],
      status: 'Completed',
      isDemo: true
    },
    {
      donor: donorUsers[1]._id,
      facility: facilities[3]._id,
      bloodGroup: donorUsers[1].bloodGroup,
      units: 2,
      donationDate: donationDates[1],
      status: 'Completed',
      isDemo: true
    },
    {
      donor: donorUsers[2]._id,
      facility: facilities[0]._id,
      bloodGroup: donorUsers[2].bloodGroup,
      units: 1,
      donationDate: donationDates[2],
      status: 'Scheduled',
      isDemo: true
    }
  ]);

  await Notification.insertMany([
    {
      user: patientUsers[0]._id,
      title: 'Blood request received',
      message: 'Your O+ blood request is being reviewed by District General Hospital.',
      type: 'info',
      isRead: false,
      isDemo: true
    },
    {
      user: patientUsers[1]._id,
      title: 'Request needs attention',
      message: 'Your B+ request is marked urgent. Track delivery updates from your dashboard.',
      type: 'warning',
      isRead: false,
      isDemo: true
    },
    {
      user: donorUsers[0]._id,
      title: 'Donation completed',
      message: 'Thank you for helping your community. Your donation has been recorded.',
      type: 'success',
      isRead: true,
      isDemo: true
    },
    {
      user: donorUsers[2]._id,
      title: 'Donation scheduled',
      message: 'Your next donation appointment is scheduled at District General Hospital.',
      type: 'info',
      isRead: false,
      isDemo: true
    }
  ]);

  console.log('[Seed] Done! Demo data seeded successfully.');
  console.log('[Seed] Admin login -> email: admin@swasthyasetu.demo | password: Admin@123');
  console.log('[Seed] Demo user login -> email: ravi.patient@demo.com | password: Demo@123');
  process.exit(0);
};

run().catch((err) => {
  console.error('[Seed] Failed:', err);
  process.exit(1);
});
