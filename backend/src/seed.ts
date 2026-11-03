/**
 * OpenHMS Database Seed Script
 * Run with: npx ts-node src/seed.ts
 *
 * Seeds: 1 admin, 2 hospitals, 2 doctors, 1 receptionist, 1 pharmacist,
 *        5 patients, metadata, medicines, slot windows, 3 appointments
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from './config/env';
import { User } from './models/User';
import { Hospital } from './models/Hospital';
import { Patient } from './models/Patient';
import { SlotWindow } from './models/SlotWindow';
import { Appointment } from './models/Appointment';
import { Metadata } from './models/Metadata';
import { Medicine } from './models/Medicine';
import { Visit } from './models/Visit';

const hashPassword = (plain: string) => bcrypt.hashSync(plain, 10);

async function seed() {
  console.log('🌱  Connecting to MongoDB…');
  await mongoose.connect(env.MONGODB_URI);
  console.log('✅  Connected to', env.MONGODB_URI);

  // ── Clear existing seed data ──────────────────────────────────────────────
  console.log('\n🗑   Clearing old data…');
  await Promise.all([
    User.deleteMany({}),
    Hospital.deleteMany({}),
    Patient.deleteMany({}),
    SlotWindow.deleteMany({}),
    Appointment.deleteMany({}),
    Metadata.deleteMany({}),
    Medicine.deleteMany({}),
    Visit.deleteMany({}),
  ]);

  // ── 1. Hospitals ──────────────────────────────────────────────────────────
  console.log('\n🏥  Seeding Hospitals…');
  const [hospital1, hospital2] = await Hospital.insertMany([
    { name: 'Ayurvishwa Wellness Clinic – Pune', city: 'Pune' },
    { name: 'Ayurvishwa Wellness Clinic – Mumbai', city: 'Mumbai' },
  ]);
  console.log('   Created hospitals:', hospital1.name, '|', hospital2.name);

  // ── 2. Users (admin, doctors, receptionist, pharmacist) ───────────────────
  console.log('\n👥  Seeding Users…');
  const [admin, doctor1, doctor2, receptionist, pharmacist, viewer] = await User.insertMany([
    {
      fullName: 'Super Admin',
      email: 'admin@gmail.com',
      passwordHash: hashPassword('shivsagar@9911'),
      userRoles: ['admin'],
      departments: [],
      specializations: [],
    },
    {
      fullName: 'Dr. Rajesh Sharma',
      email: 'doctor@gmail.com',
      passwordHash: hashPassword('shivsagar@9911'),
      userRoles: ['doctor'],
      departments: ['Ayurveda', 'Panchakarma'],
      specializations: ['Nadi Pariksha', 'Kayachikitsa'],
      consultationFee: 500,
      extraLine: 'BAMS, MD (Ayurveda)',
    },
    {
      fullName: 'Dr. Priya Kulkarni',
      email: 'doctor2@gmail.com',
      passwordHash: hashPassword('shivsagar@9911'),
      userRoles: ['doctor'],
      departments: ['Ayurveda', 'Stree Roga'],
      specializations: ['Gynecology', 'Skin Disorders'],
      consultationFee: 600,
      extraLine: 'BAMS, PG Dip. Panchakarma',
    },
    {
      fullName: 'Amit Deshmukh',
      email: 'receptionist@gmail.com',
      passwordHash: hashPassword('shivsagar@9911'),
      userRoles: ['receptionist'],
      departments: ['Front Desk'],
      specializations: [],
    },
    {
      fullName: 'Sneha Joshi',
      email: 'pharmacist@gmail.com',
      passwordHash: hashPassword('shivsagar@9911'),
      userRoles: ['pharmacist'],
      departments: ['Pharmacy'],
      specializations: [],
    },
    {
      fullName: 'Clinical Auditor (Viewer)',
      email: 'viewer@gmail.com',
      passwordHash: hashPassword('shivsagar@9911'),
      userRoles: ['viewer'],
      departments: ['Auditing'],
      specializations: [],
    },
  ]);
  console.log('   Admin:', admin.email);
  console.log('   Doctor 1:', doctor1.email);
  console.log('   Doctor 2:', doctor2.email);
  console.log('   Receptionist:', receptionist.email);
  console.log('   Pharmacist:', pharmacist.email);
  console.log('   Viewer:', viewer.email);

  // ── 3. Patients ───────────────────────────────────────────────────────────
  console.log('\n🧑‍⚕️  Seeding Patients…');
  const [p1, p2, p3, p4, _p5] = await Patient.insertMany([
    {
      patientId: 'PAT001',
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      phoneNo: '9876543210',
      sex: 'male',
      dob: new Date('1985-06-15'),
      referralSource: 'Walk-in',
      address: { city: 'Pune', state: 'Maharashtra', street: 'Sector 12' },
    },
    {
      patientId: 'PAT002',
      name: 'Meera Patel',
      email: 'meera.patel@example.com',
      phoneNo: '9876512345',
      sex: 'female',
      dob: new Date('1992-03-20'),
      referralSource: 'Online Booking',
      address: { city: 'Mumbai', state: 'Maharashtra', street: 'MG Road' },
    },
    {
      patientId: 'PAT003',
      name: 'Suresh Gupta',
      email: 'suresh.gupta@example.com',
      phoneNo: '9812345678',
      sex: 'male',
      dob: new Date('1970-11-01'),
      referralSource: 'Referral',
      address: { city: 'Nashik', state: 'Maharashtra', street: 'College Road' },
    },
    {
      patientId: 'PAT004',
      name: 'Anita Reddy',
      email: 'anita.reddy@example.com',
      phoneNo: '9988776655',
      sex: 'female',
      dob: new Date('1998-07-25'),
      referralSource: 'Walk-in',
      address: { city: 'Pune', state: 'Maharashtra', street: 'FC Road' },
    },
    {
      patientId: 'PAT005',
      name: 'Ramesh Rao',
      email: 'ramesh.rao@example.com',
      phoneNo: '9001122334',
      sex: 'male',
      dob: new Date('1960-04-10'),
      referralSource: 'Doctor Referral',
      address: { city: 'Mumbai', state: 'Maharashtra', street: 'Marine Drive' },
    },
  ]);
  console.log('   Created 5 patients');

  // ── 4. Metadata ───────────────────────────────────────────────────────────
  console.log('\n📋  Seeding Metadata…');
  await Metadata.create({
    treatments: [
      'Nadi Pariksha', 'Panchakarma', 'Shirodhara', 'Abhyanga',
      'Nasya', 'Virechana', 'Basti', 'Prakriti Analysis',
    ],
    diseases: [
      'Diabetes', 'Hypertension', 'Thyroid', 'Joint Pain',
      'Migraine', 'Gastritis', 'Skin Allergy', 'Arthritis',
      'Asthma', 'PCOS', 'Digestive Problems', 'Hair Fall',
    ],
    medicines: [
      'Triphala Churna', 'Brahmi Vati', 'Ashwagandha Churna',
      'Arjunarishta', 'Giloy Satva', 'Neem Capsule',
      'Haridra Khand', 'Punarnava Mandur',
    ],
    symptoms: [
      'Fever', 'Cough', 'Cold', 'Joint Pain', 'Swelling',
      'Burning Sensation', 'Itching', 'Weakness', 'Fatigue',
      'Headache', 'Nausea', 'Indigestion',
    ],
  });
  console.log('   Metadata created');

  // ── 5. Medicines ──────────────────────────────────────────────────────────
  console.log('\n💊  Seeding Medicines…');
  const medicines = await Medicine.insertMany([
    { name: 'Triphala Churna', quantity: 100, lowStockThreshold: 10 },
    { name: 'Brahmi Vati', quantity: 50, lowStockThreshold: 5 },
    { name: 'Ashwagandha Churna', quantity: 80, lowStockThreshold: 10 },
    { name: 'Arjunarishta', quantity: 30, lowStockThreshold: 5 },
    { name: 'Giloy Satva', quantity: 60, lowStockThreshold: 8 },
    { name: 'Neem Capsule', quantity: 200, lowStockThreshold: 20 },
    { name: 'Haridra Khand', quantity: 4, lowStockThreshold: 10 },   // low stock intentionally
    { name: 'Punarnava Mandur', quantity: 45, lowStockThreshold: 5 },
  ]);
  console.log(`   Created ${medicines.length} medicines (1 low-stock item for demo)`);

  // ── 6. Slot Windows (future dates) ────────────────────────────────────────
  console.log('\n🗓   Seeding Slot Windows…');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const slotsToCreate: any[] = [];

  for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
    const slotDate = new Date(today);
    slotDate.setDate(today.getDate() + dayOffset);

    // Morning slots (09:00 – 12:00, 30-min each) for hospital1
    const morningTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
    morningTimes.forEach((time, idx) => {
      const [h, m] = time.split(':').map(Number);
      const startTime = new Date(slotDate);
      startTime.setHours(h, m, 0, 0);
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 30);
      slotsToCreate.push({
        hospitalId: hospital1._id,
        startTime,
        endTime,
        slotDate,
        slotNumber: idx + 1,
        maxCapacity: 5,
        bookedCount: 0,
      });
    });

    // Afternoon slots (14:00 – 17:00) for hospital2
    const afternoonTimes = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
    afternoonTimes.forEach((time, idx) => {
      const [h, m] = time.split(':').map(Number);
      const startTime = new Date(slotDate);
      startTime.setHours(h, m, 0, 0);
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 30);
      slotsToCreate.push({
        hospitalId: hospital2._id,
        startTime,
        endTime,
        slotDate,
        slotNumber: idx + 1,
        maxCapacity: 5,
        bookedCount: 0,
      });
    });
  }

  const createdSlots = await SlotWindow.insertMany(slotsToCreate);
  console.log(`   Created ${createdSlots.length} slot windows across 7 days`);

  // ── 7. Appointments ───────────────────────────────────────────────────────
  console.log('\n📅  Seeding Appointments…');
  const tomorrowSlot = createdSlots[0]; // First slot of tomorrow for hospital1

  await Appointment.insertMany([
    {
      appointmentId: 'APT0000001',
      name: p1.name,
      email: p1.email,
      phoneNo: p1.phoneNo,
      healthIssue: 'Joint Pain',
      hospitalId: hospital1._id,
      mode: 'offline',
      status: 'booked',
      amountPaid: 500,
      appointmentDate: tomorrowSlot.slotDate,
      doctorId: doctor1._id,
      doctorName: doctor1.fullName,
      duration: 30,
      slotWindowId: tomorrowSlot._id,
      slotNumber: tomorrowSlot.slotNumber,
      slotStartTime: tomorrowSlot.startTime,
      slotEndTime: tomorrowSlot.endTime,
    },
    {
      appointmentId: 'APT0000002',
      name: p2.name,
      email: p2.email,
      phoneNo: p2.phoneNo,
      healthIssue: 'Skin Allergy',
      hospitalId: hospital1._id,
      mode: 'offline',
      status: 'checked_in',
      amountPaid: 600,
      appointmentDate: tomorrowSlot.slotDate,
      doctorId: doctor2._id,
      doctorName: doctor2.fullName,
      duration: 30,
      slotWindowId: createdSlots[1]._id,
      slotNumber: createdSlots[1].slotNumber,
      slotStartTime: createdSlots[1].startTime,
      slotEndTime: createdSlots[1].endTime,
    },
    {
      appointmentId: 'APT0000003',
      name: p3.name,
      email: p3.email,
      phoneNo: p3.phoneNo,
      healthIssue: 'Diabetes',
      hospitalId: hospital2._id,
      mode: 'online',
      status: 'booked',
      amountPaid: 500,
      appointmentDate: createdSlots[6].slotDate,
      doctorId: doctor1._id,
      doctorName: doctor1.fullName,
      duration: 30,
      slotWindowId: createdSlots[6]._id,
      slotNumber: createdSlots[6].slotNumber,
      slotStartTime: createdSlots[6].startTime,
      slotEndTime: createdSlots[6].endTime,
    },
  ]);
  console.log('   Created 3 appointments');

  // ── 8. Visits (completed) ─────────────────────────────────────────────────
  console.log('\n🩺  Seeding Visits…');
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  await Visit.insertMany([
    {
      visitToken: 1,
      patientId: p1._id,
      hospitalId: hospital1._id,
      doctorId: doctor1._id,
      status: 'done',
      isOfflineAppointment: false,
      disease: ['Joint Pain', 'Arthritis'],
      diseaseDuration: '3 months',
      presentSymptoms: ['Swelling', 'Joint Pain'],
      previousTreatment: ['Allopathy'],
      treatmentGiven: ['Nadi Pariksha', 'Panchakarma'],
      vitals: { pulse: 78, bp: '120/80', temperature: 98.4 },
      ayurvedicBaseline: {
        dosha: { vata: 60, pitta: 25, kapha: 15, indication: 'Chronic', dominant: 'Vata' },
        agni: 'Vishamagni',
        amaStatus: 'Sama',
        dailyHabits: { sleep: '6 hrs', appetite: 'Low', bowel: 'Irregular' },
      },
      prescribedMedicines: [
        {
          medicineId: medicines[0]._id,
          medicineName: 'Triphala Churna',
          quantity: 1,
          dosage: 'BD',
          instructions: 'After meal',
          kala: 'After',
          anupana: 'Warm Water',
          duration: '30 days',
        },
        {
          medicineId: medicines[7]._id,
          medicineName: 'Punarnava Mandur',
          quantity: 2,
          dosage: 'OD',
          instructions: 'Before meal',
          kala: 'Before',
          anupana: 'Milk',
          duration: '15 days',
        },
      ],
      advice: 'Avoid cold food. Take warm water throughout the day.',
      followUpDate: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      medicineGiven: true,
      givenMedicines: [
        {
          medicineId: medicines[0]._id,
          medicineName: 'Triphala Churna',
          quantity: 1,
          dosage: 'BD',
        },
      ],
      createdAt: yesterday,
      updatedAt: yesterday,
    },
    {
      visitToken: 2,
      patientId: p2._id,
      hospitalId: hospital1._id,
      doctorId: doctor2._id,
      status: 'done',
      isOfflineAppointment: false,
      disease: ['Skin Allergy', 'Eczema'],
      diseaseDuration: '1 month',
      presentSymptoms: ['Itching', 'Burning Sensation'],
      previousTreatment: ['Homeopathy'],
      treatmentGiven: ['Shirodhara', 'Abhyanga'],
      vitals: { pulse: 82, bp: '118/76', temperature: 98.6 },
      prescribedMedicines: [
        {
          medicineId: medicines[5]._id,
          medicineName: 'Neem Capsule',
          quantity: 1,
          dosage: 'BD',
          instructions: 'After food',
          kala: 'After',
          anupana: 'Water',
          duration: '30 days',
        },
      ],
      advice: 'Use herbal soap only. Avoid synthetic fabrics.',
      followUpDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      medicineGiven: false,
      createdAt: yesterday,
      updatedAt: yesterday,
    },
    {
      visitToken: 3,
      patientId: p4._id,
      hospitalId: hospital1._id,
      doctorId: doctor1._id,
      status: 'waiting',
      isOfflineAppointment: true,
      disease: ['Migraine'],
      diseaseDuration: '6 months',
      presentSymptoms: ['Headache', 'Nausea'],
      previousTreatment: [],
      treatmentGiven: [],
      medicineGiven: false,
      createdAt: today,
      updatedAt: today,
    },
  ]);
  console.log('   Created 3 visits (2 done, 1 waiting)');

  // ── Done ──────────────────────────────────────────────────────────────────
  console.log('\n🎉  Seed complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Login credentials:');
  console.log('  Password for all : shivsagar@9911');
  console.log('  Admin            : admin@gmail.com');
  console.log('  Doctor           : doctor@gmail.com');
  console.log('  Doctor 2         : doctor2@gmail.com');
  console.log('  Receptionist     : receptionist@gmail.com');
  console.log('  Pharmacist       : pharmacist@gmail.com');
  console.log('  Viewer           : viewer@gmail.com');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
