const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'mongo_seed_files');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helpers for MongoDB Extended JSON
const oid = (hex) => ({ "$oid": hex });
const date = (d) => ({ "$date": new Date(d).toISOString() });

// Precomputed bcrypt hash for: shivsagar@9911
const passwordHash = "$2b$10$b7.3XpHvjzXAvDU1p1efgulNzACpUApBD0frqrZvG1mzG.nYSDLJy";

const now = new Date('2026-11-03T10:00:00.000Z');
const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

// Helper for random date in range
function randomDate(start, end) {
  const t = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(t);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. HOSPITALS
// ─────────────────────────────────────────────────────────────────────────────
const hospitalIds = [
  '65a000000000000000000001',
  '65a000000000000000000002',
  '65a000000000000000000003',
];

const hospitals = [
  {
    "_id": oid(hospitalIds[0]),
    "name": "Ayurvishwa Ayurvedic Hospital - Pune",
    "city": "Pune",
    "createdAt": date('2026-01-01T00:00:00.000Z'),
    "updatedAt": date('2026-01-01T00:00:00.000Z'),
    "__v": 0
  },
  {
    "_id": oid(hospitalIds[1]),
    "name": "Ayurvishwa Wellness Center - Mumbai",
    "city": "Mumbai",
    "createdAt": date('2026-01-01T00:00:00.000Z'),
    "updatedAt": date('2026-01-01T00:00:00.000Z'),
    "__v": 0
  },
  {
    "_id": oid(hospitalIds[2]),
    "name": "Ayurvishwa Holistic Clinic - Nashik",
    "city": "Nashik",
    "createdAt": date('2026-01-01T00:00:00.000Z'),
    "updatedAt": date('2026-01-01T00:00:00.000Z'),
    "__v": 0
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. USERS
// Password same for all: shivsagar@9911
// Emails: admin@gmail.com, doctor@gmail.com, receptionist@gmail.com, pharmacist@gmail.com, viewer@gmail.com
// ─────────────────────────────────────────────────────────────────────────────
const userIds = {
  admin: '65b000000000000000000001',
  doctor1: '65b000000000000000000002',
  doctor2: '65b000000000000000000003',
  receptionist: '65b000000000000000000004',
  pharmacist: '65b000000000000000000005',
  viewer: '65b000000000000000000006'
};

const users = [
  {
    "_id": oid(userIds.admin),
    "fullName": "Super Administrator",
    "email": "admin@gmail.com",
    "passwordHash": passwordHash,
    "userRoles": ["admin"],
    "departments": ["Executive Management"],
    "specializations": ["Hospital Administration"],
    "createdAt": date('2026-01-01T00:00:00.000Z'),
    "updatedAt": date('2026-01-01T00:00:00.000Z'),
    "__v": 0
  },
  {
    "_id": oid(userIds.doctor1),
    "fullName": "Dr. Rajesh Sharma",
    "email": "doctor@gmail.com",
    "passwordHash": passwordHash,
    "userRoles": ["doctor"],
    "departments": ["Kayachikitsa", "Panchakarma"],
    "specializations": ["Nadi Pariksha", "Chronic Metabolic Disorders"],
    "consultationFee": 500,
    "extraLine": "BAMS, MD (Ayurveda) - Gold Medalist, 15+ yrs experience",
    "createdAt": date('2026-01-01T00:00:00.000Z'),
    "updatedAt": date('2026-01-01T00:00:00.000Z'),
    "__v": 0
  },
  {
    "_id": oid(userIds.doctor2),
    "fullName": "Dr. Priya Kulkarni",
    "email": "doctor2@gmail.com",
    "passwordHash": passwordHash,
    "userRoles": ["doctor"],
    "departments": ["Prasuti & Stree Roga", "Twak Roga"],
    "specializations": ["Ayurvedic Gynecology & PCOD", "Skin & Hair Disorders"],
    "consultationFee": 600,
    "extraLine": "BAMS, PG Dip. Panchakarma Therapy",
    "createdAt": date('2026-01-01T00:00:00.000Z'),
    "updatedAt": date('2026-01-01T00:00:00.000Z'),
    "__v": 0
  },
  {
    "_id": oid(userIds.receptionist),
    "fullName": "Amit Deshmukh",
    "email": "receptionist@gmail.com",
    "passwordHash": passwordHash,
    "userRoles": ["receptionist"],
    "departments": ["Front Desk & Patient Care"],
    "specializations": ["Patient Registration", "Queue & Slot Allocation"],
    "createdAt": date('2026-01-01T00:00:00.000Z'),
    "updatedAt": date('2026-01-01T00:00:00.000Z'),
    "__v": 0
  },
  {
    "_id": oid(userIds.pharmacist),
    "fullName": "Sneha Joshi",
    "email": "pharmacist@gmail.com",
    "passwordHash": passwordHash,
    "userRoles": ["admin"], // Admin role powers pharmacist routes
    "departments": ["Ayurvedic Pharmacy & Dispensary"],
    "specializations": ["Classical Formulations", "Herbal Inventory Control"],
    "createdAt": date('2026-01-01T00:00:00.000Z'),
    "updatedAt": date('2026-01-01T00:00:00.000Z'),
    "__v": 0
  },
  {
    "_id": oid(userIds.viewer),
    "fullName": "Clinical Quality Auditor (Viewer)",
    "email": "viewer@gmail.com",
    "passwordHash": passwordHash,
    "userRoles": ["viewer"],
    "departments": ["Clinical Audit & Quality Assurance"],
    "specializations": ["Read-Only Inspection Across All 4 Dashboards"],
    "createdAt": date('2026-01-01T00:00:00.000Z'),
    "updatedAt": date('2026-01-01T00:00:00.000Z'),
    "__v": 0
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. MEDICINES
// ─────────────────────────────────────────────────────────────────────────────
const medicineItems = [
  { id: '65c000000000000000000001', name: "Triphala Churna", qty: 120, threshold: 15 },
  { id: '65c000000000000000000002', name: "Brahmi Vati", qty: 45, threshold: 10 },
  { id: '65c000000000000000000003', name: "Ashwagandha Churna", qty: 80, threshold: 12 },
  { id: '65c000000000000000000004', name: "Arjunarishta", qty: 35, threshold: 8 },
  { id: '65c000000000000000000005', name: "Giloy Satva", qty: 60, threshold: 10 },
  { id: '65c000000000000000000006', name: "Neem Capsule", qty: 150, threshold: 20 },
  { id: '65c000000000000000000007', name: "Haridra Khand", qty: 4, threshold: 10 },      // LOW STOCK
  { id: '65c000000000000000000008', name: "Punarnava Mandur", qty: 3, threshold: 8 },     // LOW STOCK
  { id: '65c000000000000000000009', name: "Chandraprabha Vati", qty: 70, threshold: 10 },
  { id: '65c00000000000000000000a', name: "Yograj Guggulu", qty: 90, threshold: 15 },
  { id: '65c00000000000000000000b', name: "Mahasudarshan Churna", qty: 2, threshold: 6 }, // LOW STOCK
  { id: '65c00000000000000000000c', name: "Shatavari Kalpa", qty: 110, threshold: 15 },
  { id: '65c00000000000000000000d', name: "Dashmoolarishta", qty: 28, threshold: 8 },
  { id: '65c00000000000000000000e', name: "Kaishore Guggulu", qty: 42, threshold: 10 },
  { id: '65c00000000000000000000f', name: "Avipattikar Churna", qty: 85, threshold: 12 },
  { id: '65c000000000000000000010', name: "Arogyavardhini Vati", qty: 55, threshold: 10 }
];

const medicines = medicineItems.map(m => ({
  "_id": oid(m.id),
  "name": m.name,
  "quantity": m.qty,
  "lowStockThreshold": m.threshold
}));

// ─────────────────────────────────────────────────────────────────────────────
// 4. METADATAS
// ─────────────────────────────────────────────────────────────────────────────
const metadatas = [
  {
    "_id": oid('65d000000000000000000001'),
    "treatments": [
      "Nadi Pariksha", "Panchakarma", "Shirodhara", "Abhyanga",
      "Nasya", "Virechana", "Basti", "Prakriti Analysis",
      "Raktamokshana", "Janu Basti", "Kati Basti", "Udvartana"
    ],
    "diseases": [
      "Diabetes Mellitus", "Hypertension", "Osteoarthritis", "Rheumatoid Arthritis",
      "Chronic Migraine", "Gastritis / Hyperacidity", "Skin Allergy & Eczema",
      "Bronchial Asthma", "PCOS / PCOD", "Hypothyroidism", "Lumbar Spondylosis",
      "Chronic Insomnia", "IBS (Grahani)", "Hair Fall & Alopecia"
    ],
    "medicines": medicineItems.map(m => m.name),
    "symptoms": [
      "Joint Stiffness", "Morning Pain", "Acid Reflux", "Burning Sensation",
      "Chronic Fatigue", "Severe Headache", "Indigestion", "Skin Rash & Itching",
      "Breathlessness", "Irregular Menstrual Cycles", "Sleep Deprivation",
      "Hair Thinning", "Swelling in Lower Limbs", "Anxiety & Stress"
    ],
    "createdAt": date('2026-01-01T00:00:00.000Z'),
    "updatedAt": date('2026-01-01T00:00:00.000Z'),
    "__v": 0
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. PATIENTS
// ─────────────────────────────────────────────────────────────────────────────
const patientRaw = [
  { name: "Vikram Singh", sex: "male", age: 42, city: "Pune", state: "Maharashtra", street: "FC Road, Deccan", phone: "9876543210", ref: "YouTube" },
  { name: "Meera Patel", sex: "female", age: 34, city: "Mumbai", state: "Maharashtra", street: "MG Road, Bandra West", phone: "9876512345", ref: "Online Booking" },
  { name: "Suresh Gupta", sex: "male", age: 56, city: "Nashik", state: "Maharashtra", street: "College Road, Gangapur", phone: "9812345678", ref: "Referral" },
  { name: "Anita Reddy", sex: "female", age: 28, city: "Pune", state: "Maharashtra", street: "Kothrud, Stand Road", phone: "9988776655", ref: "Instagram" },
  { name: "Ramesh Rao", sex: "male", age: 64, city: "Mumbai", state: "Maharashtra", street: "Marine Lines, Churchgate", phone: "9001122334", ref: "Doctor Referral" },
  { name: "Pooja Sharma", sex: "female", age: 31, city: "Pune", state: "Maharashtra", street: "Viman Nagar, Lane 2", phone: "9823011223", ref: "Google" },
  { name: "Arjun Deshmukh", sex: "male", age: 38, city: "Nashik", state: "Maharashtra", street: "Panchavati, Sector 4", phone: "9890123456", ref: "Word of Mouth" },
  { name: "Kavita Joshi", sex: "female", age: 49, city: "Mumbai", state: "Maharashtra", street: "Dadar East, Hindu Colony", phone: "9765432109", ref: "Friends" },
  { name: "Deepak Verma", sex: "male", age: 52, city: "Pune", state: "Maharashtra", street: "Baner Road, Balewadi", phone: "9654321987", ref: "YouTube" },
  { name: "Sneha Nair", sex: "female", age: 26, city: "Mumbai", state: "Maharashtra", street: "Andheri West, Lokhandwala", phone: "9543216789", ref: "Instagram" },
  { name: "Sanjay Mehta", sex: "male", age: 60, city: "Nashik", state: "Maharashtra", street: "Cidco, Near Trimurti Chowk", phone: "9432167890", ref: "Referral" },
  { name: "Anjali Shah", sex: "female", age: 37, city: "Pune", state: "Maharashtra", street: "Aundh, DP Road", phone: "9321678901", ref: "Google" }
];

const patientIds = patientRaw.map((_, i) => `65e0000000000000000000${(i + 1).toString(16).padStart(2, '0')}`);

const patients = patientRaw.map((p, i) => {
  const pCreated = new Date(now.getTime() - (150 - i * 10) * 24 * 60 * 60 * 1000);
  const birthYear = 2026 - p.age;
  return {
    "_id": oid(patientIds[i]),
    "patientId": `PAT${String(i + 1).padStart(3, '0')}`,
    "name": p.name,
    "email": `${p.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    "phoneNo": p.phone,
    "sex": p.sex,
    "dob": date(new Date(`${birthYear}-04-15T00:00:00.000Z`)),
    "referralSource": p.ref,
    "address": {
      "city": p.city,
      "state": p.state,
      "street": p.street
    },
    "createdAt": date(pCreated),
    "updatedAt": date(pCreated),
    "__v": 0
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. LEADS (6 Months Booking Calendar spread on random dates!)
// ─────────────────────────────────────────────────────────────────────────────
const firstNames = ["Amit", "Rohit", "Pooja", "Sunil", "Neha", "Vikas", "Shweta", "Sachin", "Swati", "Manoj", "Alok", "Divya", "Kiran", "Nikhil", "Bhavna", "Pradeep", "Asha", "Gaurav", "Simran", "Chetan"];
const lastNames = ["Kulkarni", "Patil", "Deshmukh", "Jadhav", "Pawar", "Shinde", "More", "Bhosale", "Chavan", "Tambe", "Kadam", "Sawant", "Gaikwad", "Wagh", "Thakur", "Rathore"];
const healthIssues = [
  "Chronic Back Pain & Sciatica", "Severe Migraine & Sinusitis", "PCOD & Weight Gain",
  "Psoriasis & Skin Rashes", "Knee Joint Arthritis", "Severe Hair Fall & Dandruff",
  "Diabetes Control & Fatigue", "Chronic Acidity & IBS", "Anxiety & Sleep Disorder",
  "Thyroid Imbalance", "Cervical Spondylitis", "Fatty Liver & Digestion"
];
const leadCities = ["Pune", "Mumbai", "Nashik", "Nagpur", "Bangalore", "Thane", "Navi Mumbai"];

const leads = [];
for (let i = 0; i < 75; i++) {
  const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lname = lastNames[Math.floor(Math.random() * lastNames.length)];
  const leadDate = randomDate(sixMonthsAgo, now);
  const isConverted = i < 25; // ~33% conversion rate creates realistic analytics!
  const phone = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
  const hex = (i + 1).toString(16).padStart(4, '0');

  leads.push({
    "_id": oid(`65f00000000000000000${hex}`),
    "name": `${fname} ${lname}`,
    "email": `${fname.toLowerCase()}.${lname.toLowerCase()}@gmail.com`,
    "phoneNumber": phone,
    "city": leadCities[Math.floor(Math.random() * leadCities.length)],
    "healthIssue": healthIssues[Math.floor(Math.random() * healthIssues.length)],
    "isConverted": isConverted,
    "createdAt": date(leadDate),
    "updatedAt": date(leadDate),
    "__v": 0
  });
}

// Sort leads chronologically
leads.sort((a, b) => new Date(a.createdAt.$date).getTime() - new Date(b.createdAt.$date).getTime());

// ─────────────────────────────────────────────────────────────────────────────
// 7. SLOT WINDOWS (Today and next 14 days)
// ─────────────────────────────────────────────────────────────────────────────
const slotwindows = [];
let slotIndex = 1;

const todayMidnight = new Date('2026-11-03T00:00:00.000Z');

for (let dayOffset = 0; dayOffset <= 10; dayOffset++) {
  const slotDay = new Date(todayMidnight.getTime() + dayOffset * 24 * 60 * 60 * 1000);
  
  // Hospital 1 - Morning batches: 09:00, 10:00, 11:00, 14:00, 15:00, 16:00
  const times = [
    { startH: 9, startM: 0, endH: 9, endM: 30 },
    { startH: 9, startM: 30, endH: 10, endM: 0 },
    { startH: 10, startM: 0, endH: 10, endM: 30 },
    { startH: 10, startM: 30, endH: 11, endM: 0 },
    { startH: 14, startM: 0, endH: 14, endM: 30 },
    { startH: 15, startM: 0, endH: 15, endM: 30 },
  ];

  times.forEach((t, idx) => {
    const sTime = new Date(slotDay);
    sTime.setUTCHours(t.startH, t.startM, 0, 0);
    const eTime = new Date(slotDay);
    eTime.setUTCHours(t.endH, t.endM, 0, 0);

    const isToday = dayOffset === 0;
    const bookedCount = isToday && idx < 3 ? (idx === 0 ? 2 : 1) : (dayOffset === 1 && idx === 0 ? 1 : 0);

    slotwindows.push({
      "_id": oid(`66000000000000000000${slotIndex.toString(16).padStart(4, '0')}`),
      "hospitalId": oid(hospitalIds[0]),
      "slotDate": date(slotDay),
      "startTime": date(sTime),
      "endTime": date(eTime),
      "slotNumber": idx + 1,
      "maxCapacity": 5,
      "bookedCount": bookedCount,
      "createdAt": date(slotDay),
      "updatedAt": date(slotDay),
      "__v": 0
    });
    slotIndex++;
  });

  // Hospital 2 - Afternoon batches
  const timesH2 = [
    { startH: 11, startM: 0, endH: 11, endM: 30 },
    { startH: 11, startM: 30, endH: 12, endM: 0 },
    { startH: 16, startM: 0, endH: 16, endM: 30 },
    { startH: 16, startM: 30, endH: 17, endM: 0 },
  ];

  timesH2.forEach((t, idx) => {
    const sTime = new Date(slotDay);
    sTime.setUTCHours(t.startH, t.startM, 0, 0);
    const eTime = new Date(slotDay);
    eTime.setUTCHours(t.endH, t.endM, 0, 0);

    const isToday = dayOffset === 0;
    const bookedCount = isToday && idx === 0 ? 1 : 0;

    slotwindows.push({
      "_id": oid(`66000000000000000000${slotIndex.toString(16).padStart(4, '0')}`),
      "hospitalId": oid(hospitalIds[1]),
      "slotDate": date(slotDay),
      "startTime": date(sTime),
      "endTime": date(eTime),
      "slotNumber": idx + 1,
      "maxCapacity": 4,
      "bookedCount": bookedCount,
      "createdAt": date(slotDay),
      "updatedAt": date(slotDay),
      "__v": 0
    });
    slotIndex++;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. APPOINTMENTS (Today's, Past, and Upcoming)
// ─────────────────────────────────────────────────────────────────────────────
const todaySlot1 = slotwindows[0];
const todaySlot2 = slotwindows[1];
const todaySlot3 = slotwindows[2];
const tomorrowSlot1 = slotwindows[10];

const appointments = [
  {
    "_id": oid("661000000000000000000001"),
    "appointmentId": "APT8492011",
    "name": "Vikram Singh",
    "email": "vikram.singh@example.com",
    "phoneNo": "9876543210",
    "healthIssue": "Chronic Knee Joint Pain",
    "hospitalId": oid(hospitalIds[0]),
    "mode": "offline",
    "status": "checked_in",
    "amountPaid": 500,
    "appointmentDate": todaySlot1.slotDate,
    "doctorId": oid(userIds.doctor1),
    "doctorName": "Dr. Rajesh Sharma",
    "duration": 30,
    "slotWindowId": todaySlot1._id,
    "slotNumber": 1,
    "slotStartTime": todaySlot1.startTime,
    "slotEndTime": todaySlot1.endTime,
    "createdAt": date('2026-11-02T10:00:00.000Z'),
    "updatedAt": date('2026-11-03T08:30:00.000Z'),
    "__v": 0
  },
  {
    "_id": oid("661000000000000000000002"),
    "appointmentId": "APT8492012",
    "name": "Meera Patel",
    "email": "meera.patel@example.com",
    "phoneNo": "9876512345",
    "healthIssue": "PCOD & Weight Management",
    "hospitalId": oid(hospitalIds[0]),
    "mode": "offline",
    "status": "checked_in",
    "amountPaid": 600,
    "appointmentDate": todaySlot1.slotDate,
    "doctorId": oid(userIds.doctor2),
    "doctorName": "Dr. Priya Kulkarni",
    "duration": 30,
    "slotWindowId": todaySlot1._id,
    "slotNumber": 1,
    "slotStartTime": todaySlot1.startTime,
    "slotEndTime": todaySlot1.endTime,
    "createdAt": date('2026-11-02T11:00:00.000Z'),
    "updatedAt": date('2026-11-03T08:45:00.000Z'),
    "__v": 0
  },
  {
    "_id": oid("661000000000000000000003"),
    "appointmentId": "APT8492013",
    "name": "Suresh Gupta",
    "email": "suresh.gupta@example.com",
    "phoneNo": "9812345678",
    "healthIssue": "Type 2 Diabetes Mellitus & Neuropathy",
    "hospitalId": oid(hospitalIds[0]),
    "mode": "offline",
    "status": "booked",
    "amountPaid": 500,
    "appointmentDate": todaySlot2.slotDate,
    "doctorId": oid(userIds.doctor1),
    "doctorName": "Dr. Rajesh Sharma",
    "duration": 30,
    "slotWindowId": todaySlot2._id,
    "slotNumber": 2,
    "slotStartTime": todaySlot2.startTime,
    "slotEndTime": todaySlot2.endTime,
    "createdAt": date('2026-11-02T14:20:00.000Z'),
    "updatedAt": date('2026-11-02T14:20:00.000Z'),
    "__v": 0
  },
  {
    "_id": oid("661000000000000000000004"),
    "appointmentId": "APT8492014",
    "name": "Anita Reddy",
    "email": "anita.reddy@example.com",
    "phoneNo": "9988776655",
    "healthIssue": "Severe Migraine & Insomnia",
    "hospitalId": oid(hospitalIds[0]),
    "mode": "offline",
    "status": "booked",
    "amountPaid": 500,
    "appointmentDate": todaySlot3.slotDate,
    "doctorId": oid(userIds.doctor1),
    "doctorName": "Dr. Rajesh Sharma",
    "duration": 30,
    "slotWindowId": todaySlot3._id,
    "slotNumber": 3,
    "slotStartTime": todaySlot3.startTime,
    "slotEndTime": todaySlot3.endTime,
    "createdAt": date('2026-11-02T16:00:00.000Z'),
    "updatedAt": date('2026-11-02T16:00:00.000Z'),
    "__v": 0
  },
  {
    "_id": oid("661000000000000000000005"),
    "appointmentId": "APT8492015",
    "name": "Pooja Sharma",
    "email": "pooja.sharma@example.com",
    "phoneNo": "9823011223",
    "healthIssue": "Skin Eczema & Itching",
    "hospitalId": oid(hospitalIds[0]),
    "mode": "online",
    "status": "booked",
    "amountPaid": 600,
    "appointmentDate": tomorrowSlot1.slotDate,
    "doctorId": oid(userIds.doctor2),
    "doctorName": "Dr. Priya Kulkarni",
    "duration": 30,
    "slotWindowId": tomorrowSlot1._id,
    "slotNumber": 1,
    "slotStartTime": tomorrowSlot1.startTime,
    "slotEndTime": tomorrowSlot1.endTime,
    "createdAt": date('2026-11-03T09:00:00.000Z'),
    "updatedAt": date('2026-11-03T09:00:00.000Z'),
    "__v": 0
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 9. VISITS (Doctor queues + Completed prescriptions for Pharmacist)
// ─────────────────────────────────────────────────────────────────────────────
const visits = [
  // Visit 1: Completed examination, prescription waiting to be dispensed by Pharmacist!
  {
    "_id": oid("662000000000000000000001"),
    "visitToken": 1,
    "patientId": oid(patientIds[0]), // Vikram Singh
    "hospitalId": oid(hospitalIds[0]),
    "doctorId": oid(userIds.doctor1),
    "appointmentId": "APT8492011",
    "status": "done",
    "isOfflineAppointment": false,
    "disease": ["Osteoarthritis", "Lumbar Spondylosis"],
    "diseaseDuration": "6 months",
    "presentSymptoms": ["Joint Stiffness", "Morning Pain", "Swelling in Lower Limbs"],
    "previousTreatment": ["Allopathy (NSAIDs, temporary relief)"],
    "treatmentGiven": ["Nadi Pariksha", "Janu Basti", "Panchakarma"],
    "vitals": {
      "pulse": 76,
      "bp": "124/82",
      "temperature": 98.4
    },
    "nadi": {
      "wrist": "Right",
      "gati": "Mandook (Frog-like)",
      "bala": "Madhyama (Medium)",
      "tala": "Sama",
      "temperature": "Normal"
    },
    "ayurvedicBaseline": {
      "dosha": {
        "vata": 65,
        "pitta": 20,
        "kapha": 15,
        "indication": "Chronic",
        "dominant": "Vata"
      },
      "agni": "Vishamagni (Irregular digestive fire)",
      "amaStatus": "Sama (Endotoxins present)",
      "dailyHabits": {
        "sleep": "5-6 hours, restless",
        "appetite": "Low & irregular",
        "bowel": "Constipated / dry stools"
      }
    },
    "otherProblems": {
      "acidity": true,
      "diabetes": false,
      "constipation": true,
      "amebiasis": false,
      "bp": false,
      "heartProblems": false,
      "other": "Mild lower back stiffness upon waking"
    },
    "prescribedMedicines": [
      {
        "medicineId": oid(medicineItems[9].id), // Yograj Guggulu
        "medicineName": "Yograj Guggulu",
        "quantity": 2,
        "dosage": "1-0-1",
        "kala": "After",
        "anupana": "Warm Water",
        "instructions": "Take after meals with lukewarm water",
        "duration": "30 days"
      },
      {
        "medicineId": oid(medicineItems[0].id), // Triphala Churna
        "medicineName": "Triphala Churna",
        "quantity": 1,
        "dosage": "0-0-1",
        "kala": "Night",
        "anupana": "Warm Water",
        "instructions": "Take 1 tsp at bedtime with warm water",
        "duration": "30 days"
      },
      {
        "medicineId": oid(medicineItems[6].id), // Haridra Khand (Low stock medicine test!)
        "medicineName": "Haridra Khand",
        "quantity": 1,
        "dosage": "1-0-0",
        "kala": "Morning",
        "anupana": "Warm Milk",
        "instructions": "Early morning with warm milk for inflammation",
        "duration": "15 days"
      }
    ],
    "medicineGiven": false, // Ready for Pharmacist to search token 1 & dispense!
    "givenMedicines": [],
    "advice": "Strictly avoid curd, sour foods, and direct air conditioning. Apply warm sesame oil locally.",
    "followUpDate": "2026-12-03",
    "createdAt": date('2026-11-03T09:15:00.000Z'),
    "updatedAt": date('2026-11-03T09:40:00.000Z'),
    "__v": 0
  },

  // Visit 2: Completed and already dispensed by Pharmacist
  {
    "_id": oid("662000000000000000000002"),
    "visitToken": 2,
    "patientId": oid(patientIds[1]), // Meera Patel
    "hospitalId": oid(hospitalIds[0]),
    "doctorId": oid(userIds.doctor2),
    "appointmentId": "APT8492012",
    "status": "done",
    "isOfflineAppointment": false,
    "disease": ["PCOS / PCOD", "Hypothyroidism"],
    "diseaseDuration": "1.5 years",
    "presentSymptoms": ["Irregular Menstrual Cycles", "Weight Gain", "Hair Thinning"],
    "previousTreatment": ["Hormonal Pills (discontinued due to side-effects)"],
    "treatmentGiven": ["Nadi Pariksha", "Udvartana", "Nasya"],
    "vitals": {
      "pulse": 82,
      "bp": "118/78",
      "temperature": 98.6
    },
    "nadi": {
      "wrist": "Left",
      "gati": "Hamsa (Swan-like)",
      "bala": "Pravara",
      "tala": "Sama",
      "temperature": "Normal"
    },
    "ayurvedicBaseline": {
      "dosha": {
        "vata": 25,
        "pitta": 30,
        "kapha": 45,
        "indication": "Chronic",
        "dominant": "Kapha"
      },
      "agni": "Mandagni (Sluggish metabolic fire)",
      "amaStatus": "Nirama",
      "dailyHabits": {
        "sleep": "7-8 hours, daytime drowsiness",
        "appetite": "Variable",
        "bowel": "Regular"
      }
    },
    "otherProblems": {
      "acidity": false,
      "diabetes": false,
      "constipation": false,
      "amebiasis": false,
      "bp": false,
      "heartProblems": false,
      "other": "Lethargy and water retention"
    },
    "prescribedMedicines": [
      {
        "medicineId": oid(medicineItems[11].id), // Shatavari Kalpa
        "medicineName": "Shatavari Kalpa",
        "quantity": 1,
        "dosage": "1-0-1",
        "kala": "After",
        "anupana": "Warm Milk",
        "instructions": "1 tsp morning and evening with warm milk",
        "duration": "45 days"
      },
      {
        "medicineId": oid(medicineItems[8].id), // Chandraprabha Vati
        "medicineName": "Chandraprabha Vati",
        "quantity": 2,
        "dosage": "1-0-1",
        "kala": "After",
        "anupana": "Warm Water",
        "instructions": "Take after meals",
        "duration": "30 days"
      }
    ],
    "medicineGiven": true,
    "givenMedicines": [
      {
        "medicineId": oid(medicineItems[11].id),
        "medicineName": "Shatavari Kalpa",
        "quantity": 1,
        "dosage": "1-0-1"
      },
      {
        "medicineId": oid(medicineItems[8].id),
        "medicineName": "Chandraprabha Vati",
        "quantity": 2,
        "dosage": "1-0-1"
      }
    ],
    "advice": "Daily 30 minutes brisk walking. Practice Surya Namaskar and avoid sugar and refined bakery items.",
    "followUpDate": "2026-12-18",
    "createdAt": date('2026-11-03T09:30:00.000Z'),
    "updatedAt": date('2026-11-03T10:15:00.000Z'),
    "__v": 0
  },

  // Visit 3: Waiting in Doctor's queue right now!
  {
    "_id": oid("662000000000000000000003"),
    "visitToken": 3,
    "patientId": oid(patientIds[2]), // Suresh Gupta
    "hospitalId": oid(hospitalIds[0]),
    "doctorId": oid(userIds.doctor1),
    "appointmentId": "APT8492013",
    "status": "waiting", // Waiting in Doctor queue!
    "isOfflineAppointment": false,
    "disease": ["Diabetes Mellitus"],
    "diseaseDuration": "5 years",
    "presentSymptoms": ["Chronic Fatigue", "Burning Sensation", "Frequent Urination"],
    "previousTreatment": ["Metformin 500mg BD"],
    "treatmentGiven": [],
    "medicineGiven": false,
    "createdAt": date('2026-11-03T10:05:00.000Z'),
    "updatedAt": date('2026-11-03T10:05:00.000Z'),
    "__v": 0
  },

  // Visit 4: Walk-in waiting in Doctor's queue
  {
    "_id": oid("662000000000000000000004"),
    "visitToken": 4,
    "patientId": oid(patientIds[3]), // Anita Reddy
    "hospitalId": oid(hospitalIds[0]),
    "doctorId": oid(userIds.doctor1),
    "status": "waiting",
    "isOfflineAppointment": true, // Walk-in offline visit!
    "disease": ["Chronic Migraine"],
    "diseaseDuration": "2 years",
    "presentSymptoms": ["Severe Headache", "Burning Sensation"],
    "previousTreatment": [],
    "treatmentGiven": [],
    "medicineGiven": false,
    "createdAt": date('2026-11-03T10:20:00.000Z'),
    "updatedAt": date('2026-11-03T10:20:00.000Z'),
    "__v": 0
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 10. TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const tokens = [
  {
    "_id": oid("663000000000000000000001"),
    "hospitalId": oid(hospitalIds[0]),
    "date": date(todayMidnight),
    "currentToken": 4,
    "createdAt": date(todayMidnight),
    "updatedAt": date(now),
    "__v": 0
  },
  {
    "_id": oid("663000000000000000000002"),
    "hospitalId": oid(hospitalIds[1]),
    "date": date(todayMidnight),
    "currentToken": 1,
    "createdAt": date(todayMidnight),
    "updatedAt": date(now),
    "__v": 0
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 11. SLOTLOCKS (Transient collection, empty by default)
// ─────────────────────────────────────────────────────────────────────────────
const slotlocks = [];

// ─────────────────────────────────────────────────────────────────────────────
// WRITE ALL JSON FILES (Ready to import via MongoDB Compass or mongoimport)
// ─────────────────────────────────────────────────────────────────────────────
const collections = {
  hospitals,
  users,
  medicines,
  metadatas,
  patients,
  leads,
  slotwindows,
  appointments,
  visits,
  tokens,
  slotlocks
};

for (const [colName, data] of Object.entries(collections)) {
  const filePath = path.join(outputDir, `${colName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Generated: ${colName}.json (${data.length} records)`);
}

console.log(`\nAll files saved successfully to: ${outputDir}`);
