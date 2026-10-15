import type { FieldDef } from '@/components/ui';
import { districts } from './districts';

export const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Visiting / Guest'];
export const academicSubjects = ['Tamil', 'English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Botany', 'Zoology', 'Science', 'Social Science', 'Computer Science', 'Accountancy', 'Commerce', 'Economics', 'Hindi', 'All subjects (Primary)'];
export const extraActivities = ['Chess', 'Silambam', 'Karate', 'Yoga', 'Music (Vocal)', 'Keyboard / Piano', 'Guitar', 'Bharatanatyam', 'Western Dance', 'Drawing & Painting', 'Abacus', 'Spoken English', 'Handwriting', 'Swimming', 'Robotics & Coding', 'Skating'];
export const competitiveCourses = ['NEET', 'NEET Repeater', 'JEE Main', 'JEE Advanced', 'Foundation (Class 8-10)', 'Olympiad', 'NTSE', 'CUET', 'TNPSC', 'Banking / SSC'];
export const eventCategories = ['Sports', 'Competition', 'Cultural', 'Academic', 'Workshop', 'Seminar', 'Exhibition'];
export const requirementCategories = ['Bags', 'Ties & Belts', 'Uniforms', 'Shoes & Socks', 'Notebooks & Stationery', 'Textbooks', 'Computers & Hardware', 'Software', 'Smart Boards & AV', 'Furniture', 'Lab Equipment', 'Sports Equipment', 'Transport', 'Printing', 'Other'];
export const vendorCategories = requirementCategories;
export const amenityOptions = ['Smart Classrooms', 'Science Labs', 'Computer Lab', 'Library', 'Playground', 'Indoor Games', 'Swimming Pool', 'Auditorium', 'Transport', 'Hostel', 'Canteen', 'Medical Room', 'CCTV', 'RO Drinking Water', 'Robotics Lab', 'Yoga Hall', 'Art Studio', 'Music Room', 'Language Lab', 'Day Care'];

const district: FieldDef = { name: 'district', label: 'District', type: 'select', options: districts, required: true };

export const schoolProfileFields: FieldDef[] = [
  { name: 'name', label: 'School name', required: true, full: true },
  { name: 'board', label: 'Board', type: 'select', options: ['CBSE', 'State Board', 'Matriculation', 'ICSE', 'IB', 'Cambridge (IGCSE)'], required: true },
  { name: 'grades', label: 'Classes offered', placeholder: 'e.g. Pre-KG to 12', required: true },
  district,
  { name: 'address', label: 'Address', placeholder: 'Street, area' },
  { name: 'phone', label: 'Phone', type: 'tel', required: true },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'website', label: 'Website', type: 'url', placeholder: 'https://' },
  { name: 'established', label: 'Year established', type: 'number' },
  { name: 'students', label: 'Number of students', type: 'number' },
  { name: 'teachers', label: 'Number of teachers', type: 'number' },
  { name: 'image', label: 'Photo link (optional)', type: 'url', placeholder: 'https://… image of your campus', full: true },
  { name: 'courses', label: 'Courses & programmes offered', type: 'multi', options: ['NEET Foundation', 'JEE Foundation', 'Board Excellence', 'NEET Crash', 'Board Booster', 'Olympiad Prep', 'Spoken English', 'Chess Academy', 'Abacus', 'Silambam', 'Robotics & Coding', 'Music & Dance'] },
  { name: 'about', label: 'About the school', type: 'textarea' },
];

export const jobFields: FieldDef[] = [
  { name: 'title', label: 'Job title', placeholder: 'e.g. PGT Physics Teacher', required: true, full: true },
  { name: 'subject', label: 'Subject', required: true },
  { name: 'jobType', label: 'Job type', type: 'select', options: jobTypes, required: true },
  { name: 'qualification', label: 'Qualification', placeholder: 'e.g. M.Sc, B.Ed' },
  { name: 'experience', label: 'Experience', placeholder: 'e.g. 3-5 years' },
  { name: 'salary', label: 'Salary', placeholder: 'e.g. ₹30,000 - ₹40,000' },
  district,
  { name: 'lastDate', label: 'Last date to apply', type: 'date' },
  { name: 'description', label: 'Job description', type: 'textarea' },
];

export const eventFields: FieldDef[] = [
  { name: 'title', label: 'Event name', required: true, full: true },
  { name: 'category', label: 'Category', type: 'select', options: eventCategories, required: true },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'time', label: 'Time', type: 'time' },
  { name: 'venue', label: 'Venue', required: true },
  district,
  { name: 'whatsapp', label: 'WhatsApp number for invitations', type: 'tel', required: true },
  { name: 'registerLink', label: 'Registration link (optional)', type: 'url', placeholder: 'https://' },
  { name: 'image', label: 'Poster / photo link (optional)', type: 'url', placeholder: 'https://' },
  { name: 'description', label: 'Description', type: 'textarea' },
];

export const requirementFields: FieldDef[] = [
  { name: 'category', label: 'Category', type: 'select', options: requirementCategories, required: true },
  { name: 'item', label: 'Item / service needed', placeholder: 'e.g. School bags with logo', required: true },
  { name: 'quantity', label: 'Quantity', placeholder: 'e.g. 500 pcs', required: true },
  { name: 'neededBy', label: 'Needed by', type: 'date' },
  { name: 'budget', label: 'Budget (optional)', placeholder: 'e.g. ₹1,50,000' },
  district,
  { name: 'details', label: 'Specifications / details', type: 'textarea' },
];

export const achievementFields: FieldDef[] = [
  { name: 'title', label: 'Achievement', placeholder: 'e.g. 12 students cleared NEET 2026', required: true, full: true },
  { name: 'category', label: 'Category', type: 'select', options: ['Academic', 'Sports', 'Cultural', 'Science & Technology', 'Other'], required: true },
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'details', label: 'Details', type: 'textarea' },
];

export const admissionFields: FieldDef[] = [
  { name: 'occasion', label: 'Occasion', type: 'select', options: ['Vijayadasami', 'New Academic Year', 'Mid-year Admission', 'Tamil New Year', 'Other occasion'], required: true },
  { name: 'classes', label: 'Classes open for admission', placeholder: 'e.g. Pre-KG, LKG, UKG', required: true },
  { name: 'startDate', label: 'Admission starts', type: 'date', required: true },
  { name: 'lastDate', label: 'Last date', type: 'date' },
  { name: 'details', label: 'Details (fees, documents, offers)', type: 'textarea' },
];

export const concessionFields: FieldDef[] = [
  { name: 'title', label: 'Concession name', placeholder: 'e.g. Sibling concession', required: true },
  { name: 'eligibility', label: 'Who is eligible', type: 'select', options: ['Sibling', 'Merit / Academic', 'Sports quota', 'Single parent', 'Economically weaker section', 'Staff ward', 'Early admission', 'Other'], required: true },
  { name: 'benefit', label: 'Benefit', placeholder: 'e.g. 20% on tuition fee', required: true },
  { name: 'validTill', label: 'Valid till', type: 'date' },
  { name: 'details', label: 'Details', type: 'textarea' },
];

export const extracurricularFields: FieldDef[] = [
  { name: 'activity', label: 'Activity', placeholder: 'e.g. Silambam', required: true },
  { name: 'category', label: 'Category', type: 'select', options: ['Sports', 'Martial arts', 'Music', 'Dance', 'Arts & Crafts', 'STEM', 'Languages', 'Yoga', 'Other'], required: true },
  { name: 'schedule', label: 'Days & timing', placeholder: 'e.g. Mon, Wed · 4-5 pm' },
  { name: 'coach', label: 'Coach / trainer' },
  { name: 'fee', label: 'Fee', placeholder: 'e.g. Included / ₹1,000 per term' },
];

export const coachingCategoryInfo = {
  academic: { title: 'Academic', subjectsLabel: 'Subjects taken', options: academicSubjects },
  extra: { title: 'Extra Curricular', subjectsLabel: 'Activities taught', options: extraActivities },
  courses: { title: 'Courses (NEET & others)', subjectsLabel: 'Courses offered', options: competitiveCourses },
} as const;

export type CoachingCategory = keyof typeof coachingCategoryInfo;

export const coachingFields = (cat: CoachingCategory): FieldDef[] => [
  { name: 'providerType', label: 'You are', type: 'select', options: ['Individual Tutor', 'Tuition Centre', 'Institute'], required: true },
  { name: 'name', label: 'Name (tutor / centre)', required: true },
  { name: 'subjects', label: coachingCategoryInfo[cat].subjectsLabel, type: 'multi', options: [...coachingCategoryInfo[cat].options], required: true },
  { name: 'classes', label: 'Classes / age group', placeholder: 'e.g. Class 9-12' },
  { name: 'experience', label: 'Experience (years)', type: 'number', required: true },
  { name: 'charges', label: 'Charges per month (₹)', type: 'number', required: true },
  { name: 'mode', label: 'Mode', type: 'select', options: ['Offline', 'Online', 'Home tuition', 'Hybrid'], required: true },
  district,
  { name: 'area', label: 'Area / locality', required: true },
  { name: 'phone', label: 'Contact number', type: 'tel', required: true },
  { name: 'achievements', label: 'Achievements', type: 'textarea', placeholder: 'Results, medals, certifications…' },
];

export const tuitionRequestFields: FieldDef[] = [
  { name: 'studentName', label: 'Student / parent name', required: true },
  { name: 'classLevel', label: 'Class', type: 'select', options: ['Class 1-5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'NEET / JEE repeater', 'College', 'Other'], required: true },
  { name: 'subjects', label: 'Subjects / activities needed', type: 'multi', options: [...academicSubjects, ...extraActivities.slice(0, 8), 'NEET', 'JEE'], required: true },
  { name: 'mode', label: 'Preferred mode', type: 'select', options: ['Home tuition', 'Tuition centre', 'Online', 'Any'], required: true },
  district,
  { name: 'area', label: 'Area / locality', required: true },
  { name: 'budget', label: 'Budget', placeholder: 'e.g. ₹2,000 / month' },
  { name: 'phone', label: 'Contact number', type: 'tel', required: true },
  { name: 'details', label: 'Other details', type: 'textarea', placeholder: 'Board, timing, special needs…' },
];

export const teacherProfileFields: FieldDef[] = [
  { name: 'name', label: 'Full name', required: true },
  { name: 'qualification', label: 'Qualification', placeholder: 'e.g. M.Sc, B.Ed', required: true },
  { name: 'subjects', label: 'Subjects you teach', type: 'multi', options: academicSubjects.concat(extraActivities.slice(0, 6)), required: true },
  { name: 'experience', label: 'Experience (years)', type: 'number', required: true },
  { name: 'jobType', label: 'Looking for', type: 'select', options: jobTypes, required: true },
  { name: 'expectedSalary', label: 'Expected salary', placeholder: 'e.g. ₹35,000 / month' },
  { name: 'availability', label: 'Available from', placeholder: 'e.g. Immediate / June 2027' },
  { name: 'phone', label: 'Contact number', type: 'tel', required: true },
  { name: 'districts', label: 'Preferred districts', type: 'multi', options: districts, required: true },
  { name: 'about', label: 'About you', type: 'textarea', placeholder: 'Boards handled, classes, achievements…' },
];

export const vendorFields: FieldDef[] = [
  { name: 'company', label: 'Company name', required: true },
  { name: 'category', label: 'Main category', type: 'select', options: vendorCategories, required: true },
  { name: 'services', label: 'Products / services', placeholder: 'e.g. Uniforms, ties, belts, ID cards', required: true, full: true },
  { name: 'experience', label: 'Experience (years)', type: 'number', required: true },
  { name: 'contactPerson', label: 'Contact person', required: true },
  { name: 'phone', label: 'Phone', type: 'tel', required: true },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'locations', label: 'Locations served', type: 'multi', options: ['All Tamil Nadu', ...districts], required: true },
  { name: 'about', label: 'About the company', type: 'textarea' },
];
