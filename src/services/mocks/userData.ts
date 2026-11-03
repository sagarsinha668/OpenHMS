export type UserRole = 'admin' | 'doctor' | 'receptionist' | 'pharmacist' | 'viewer';

export interface User {
  id: string; // This corresponds to _id from MongoDB in live API
  fullName: string;
  email: string;
  userRoles: UserRole[];
  departments?: string[];
  specializations?: string[];
  consultationFee?: number;
  extraLine?: string; // e.g., "13 years of exp"
}

export const mockUsers: User[] = [
  {
    id: 'usr_viewer_01',
    fullName: 'Clinical Quality Auditor (Viewer)',
    email: 'viewer@gmail.com',
    userRoles: ['viewer'],
    departments: ['Clinical Audit & Quality Assurance'],
    specializations: ['Read-Only Inspection Across All 4 Dashboards'],
    extraLine: 'All Dashboard Read-Only Viewer',
  },
  {
    id: 'usr_admin_01',
    fullName: 'Super Administrator',
    email: 'admin@gmail.com',
    userRoles: ['admin'],
    departments: ['Executive Management'],
    specializations: ['Hospital Administration'],
  },
  {
    id: 'usr_doctor_01',
    fullName: 'Dr. Rajesh Sharma',
    email: 'doctor@gmail.com',
    userRoles: ['doctor'],
    departments: ['Kayachikitsa', 'Panchakarma'],
    specializations: ['Nadi Pariksha', 'Chronic Metabolic Disorders'],
    consultationFee: 500,
    extraLine: 'BAMS, MD (Ayurveda) - 15+ yrs experience',
  },
  {
    id: 'usr_receptionist_01',
    fullName: 'Amit Deshmukh',
    email: 'receptionist@gmail.com',
    userRoles: ['receptionist'],
    departments: ['Front Desk & Patient Care'],
    specializations: ['Patient Registration', 'Queue Allocation'],
  },
  {
    id: 'usr_pharmacist_01',
    fullName: 'Sneha Joshi',
    email: 'pharmacist@gmail.com',
    userRoles: ['pharmacist'],
    departments: ['Ayurvedic Pharmacy & Dispensary'],
    specializations: ['Classical Formulations', 'Inventory Control'],
  },
  {
    id: '1',
    fullName: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@sagarhealth.com',
    userRoles: ['doctor'],
    departments: ['Cardiology'],
    specializations: ['Interventional Cardiologist'],
    consultationFee: 1000,
    extraLine: '15 years of experience',
  },
  {
    id: '2',
    fullName: 'Dr. Priya Sharma',
    email: 'priya.sharma@sagarhealth.com',
    userRoles: ['doctor'],
    departments: ['Pediatrics'],
    specializations: ['Child Specialist'],
    consultationFee: 800,
    extraLine: '10 years of experience',
  },
  {
    id: '3',
    fullName: 'Anita Desai',
    email: 'anita.desai@sagarhealth.com',
    userRoles: ['receptionist'],
  },
  {
    id: '4',
    fullName: 'Suresh Patil',
    email: 'suresh.patil@sagarhealth.com',
    userRoles: ['pharmacist'],
  },
  {
    id: '5',
    fullName: 'Sagar',
    email: 'sagar@sagarhealth.com',
    userRoles: ['admin'],
  },
  {
    id: '6',
    fullName: 'Sagar',
    email: 'sagar1@sagarhealth.com',
    userRoles: ['admin','doctor','receptionist','pharmacist'],
  },
];
