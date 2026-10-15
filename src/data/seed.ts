import sunriseImg from '@/assets/schools/sunrise.webp';
import vidyaMandirImg from '@/assets/schools/vidya-mandir.webp';
import greenfieldImg from '@/assets/schools/greenfield.webp';
import aksharaImg from '@/assets/schools/akshara.webp';

// Demo records shown until real users start posting. Owner ids starting with "demo-" belong to the
// demo accounts available from the login dialog.

type Seed = Record<string, string | string[] | number | boolean | undefined> & { id: string };

const t = (daysAgo: number) => Date.UTC(2026, 9, 15) - daysAgo * 86_400_000;
const own = (ownerId: string, ownerName: string, daysAgo = 1) => ({ ownerId, ownerName, createdAt: t(daysAgo) });

const SCHOOL = own('demo-school', 'Sunrise International School');

const users: Seed[] = [
  { id: 'demo-student', role: 'student', name: 'Arjun Kumar', phone: '9876500001', district: 'Coimbatore', ...own('demo-student', 'Arjun Kumar', 30) },
  { id: 'demo-school', role: 'school', name: 'Sunrise International School', phone: '9876500002', district: 'Coimbatore', ...own('demo-school', 'Sunrise International School', 30) },
  { id: 'demo-coaching', role: 'coaching', name: 'Brilliant Minds Academy', phone: '9876500003', district: 'Coimbatore', ...own('demo-coaching', 'Brilliant Minds Academy', 30) },
  { id: 'demo-teacher', role: 'teacher', name: 'Kavitha Ramesh', phone: '9876500004', district: 'Madurai', ...own('demo-teacher', 'Kavitha Ramesh', 30) },
  { id: 'demo-vendor', role: 'vendor', name: 'Sri Murugan School Supplies', phone: '9876500005', district: 'Tiruppur', ...own('demo-vendor', 'Sri Murugan School Supplies', 30) },
  { id: 'demo-organizer', role: 'organizer', name: 'Padasala Sports Council', phone: '9876500006', district: 'Coimbatore', ...own('demo-organizer', 'Padasala Sports Council', 30) },
  { id: 'demo-admin', role: 'admin', name: 'Padasala Admin', phone: '9876500000', district: 'Coimbatore', ...own('demo-admin', 'Padasala Admin', 30) },
];

const schoolProfiles: Seed[] = [
  {
    id: 'sp1', ...SCHOOL, name: 'Sunrise International School', board: 'CBSE', grades: 'Pre-KG to 12', district: 'Coimbatore',
    address: 'Avinashi Road, Peelamedu, Coimbatore', phone: '9876500002', email: 'admissions@sunrise.example', established: '2004',
    students: '1850', teachers: '96', about: 'A CBSE school focused on strong academics, NEET/JEE foundation and sports.',
    amenities: ['Smart Classrooms', 'Science Labs', 'Computer Lab', 'Library', 'Playground', 'Transport', 'CCTV'],
    features: ['NEET & JEE foundation from Class 8', 'Bilingual support (Tamil & English)', 'Weekly parent updates on app'],
    courses: ['NEET Foundation', 'JEE Foundation', 'Board Excellence'],
    rating: 4.5, tag: 'Verified', photoCount: 3,
    image: sunriseImg,
  },
  {
    id: 'sp2', ...own('seed-school-2', 'Vidya Mandir Senior Secondary', 20), name: 'Vidya Mandir Senior Secondary', board: 'State Board', grades: 'LKG to 12', district: 'Madurai',
    address: 'KK Nagar, Madurai', phone: '9876511002', about: 'State board school with robotics lab, digital library and chess academy.',
    amenities: ['Robotics Lab', 'Digital Library', 'STEM Based Arena', 'Smart Classrooms', 'Transport', 'Canteen'], features: ['Robotics club', 'Chess academy'],
    courses: ['NEET Crash', 'Board Booster', 'Chess Academy'], rating: 4.5, tag: 'Smart School', photoCount: 3,
    image: vidyaMandirImg,
  },
  {
    id: 'sp3', ...own('seed-school-3', 'Greenfield Public School', 20), name: 'Greenfield Public School', board: 'CBSE', grades: '1 to 12', district: 'Salem',
    address: 'Fairlands, Salem', phone: '9876511003', about: 'CBSE school with STEM lab, athletics track and hostel.',
    amenities: ['STEM Lab', 'Athletics Track', 'Hostel', 'Science Labs', 'Medical Room'], features: ['Olympiad preparation', 'Residential option'],
    courses: ['JEE Foundation', 'Olympiad Prep', 'Spoken English'], rating: 4.6, tag: 'Verified', photoCount: 4,
    image: greenfieldImg,
  },
  {
    id: 'sp4', ...own('seed-school-4', 'Akshara Vidyalaya', 20), name: 'Akshara Vidyalaya', board: 'Matriculation', grades: 'Pre-KG to 10', district: 'Erode',
    address: 'Perundurai Road, Erode', phone: '9876511004', about: 'Matriculation school known for languages, yoga and silambam.',
    amenities: ['Language Lab', 'Yoga Hall', 'Art Studio', 'Library', 'Transport'], features: ['Spoken English programme', 'Silambam training'],
    courses: ['Spoken English', 'Abacus', 'Silambam'], rating: 4.4, tag: 'Smart School', photoCount: 5,
    image: aksharaImg,
  },
];

const jobs: Seed[] = [
  { id: 'j1', ...SCHOOL, title: 'PGT Physics Teacher', subject: 'Physics', qualification: 'M.Sc, B.Ed', experience: '3-8 years', salary: '₹45,000 - ₹60,000', jobType: 'Full-time', district: 'Coimbatore', lastDate: '2026-11-10', description: 'Teach Classes 11-12 and support NEET/JEE foundation batches.' },
  { id: 'j2', ...own('seed-school-2', 'Vidya Mandir Senior Secondary', 3), title: 'TGT Mathematics Faculty', subject: 'Mathematics', qualification: 'B.Sc, B.Ed', experience: '2-5 years', salary: '₹32,000 - ₹45,000', jobType: 'Full-time', district: 'Madurai', lastDate: '2026-11-05', description: 'Classes 6-10, state board syllabus.' },
  { id: 'j3', ...own('seed-school-3', 'Greenfield Public School', 2), title: 'NEET Biology Mentor', subject: 'Biology', qualification: 'M.Sc Zoology / Botany', experience: '4+ years', salary: '₹50,000 - ₹70,000', jobType: 'Contract', district: 'Salem', lastDate: '2026-10-31', description: 'Mentor NEET aspirants in the evening batch.' },
  { id: 'j4', ...own('seed-school-4', 'Akshara Vidyalaya', 4), title: 'Silambam & Yoga Coach', subject: 'Physical Education', qualification: 'Certified coach', experience: '2+ years', salary: '₹18,000 - ₹25,000', jobType: 'Part-time', district: 'Erode', lastDate: '2026-11-20', description: 'Three days a week, after school hours.' },
];

const events: Seed[] = [
  { id: 'e1', ...own('demo-organizer', 'Padasala Sports Council', 6), title: 'Inter-School Silambam Championship', category: 'Sports', date: '2026-10-24', time: '09:00', venue: 'Nehru Stadium', district: 'Coimbatore', organizerType: 'Event Organizer', whatsapp: '9876500006', registerLink: '', description: 'Open to students of Classes 5-12. Individual and team categories.', image: 'https://images.pexels.com/photos/36781049/pexels-photo-36781049.png?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'e2', ...own('seed-school-2', 'Vidya Mandir Senior Secondary', 5), title: 'District Chess Open Tournament', category: 'Competition', date: '2026-11-02', time: '10:00', venue: 'Vidya Mandir Campus, KK Nagar', district: 'Madurai', organizerType: 'School', whatsapp: '9876511002', registerLink: '', description: 'Under-11, Under-14 and Under-17 sections. Swiss format, 7 rounds.', image: 'https://images.pexels.com/photos/4800923/pexels-photo-4800923.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'e3', ...own('seed-school-3', 'Greenfield Public School', 4), title: 'Science & Robotics Expo', category: 'Academic', date: '2026-11-14', time: '09:30', venue: 'Greenfield Auditorium', district: 'Salem', organizerType: 'School', whatsapp: '9876511003', registerLink: '', description: 'Student projects, robotics demos and a model-making contest.', image: 'https://images.pexels.com/photos/5427683/pexels-photo-5427683.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'e4', ...own('seed-school-4', 'Akshara Vidyalaya', 3), title: 'Annual Cultural Fest — Rangoli', category: 'Cultural', date: '2026-11-28', time: '16:00', venue: 'Akshara Vidyalaya Grounds', district: 'Erode', organizerType: 'School', whatsapp: '9876511004', registerLink: '', description: 'Rangoli, folk dance and music competitions for all ages.', image: 'https://images.pexels.com/photos/30455278/pexels-photo-30455278.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'e5', ...SCHOOL, title: 'NEET Awareness Seminar for Parents', category: 'Workshop', date: '2026-12-05', time: '11:00', venue: 'Sunrise Auditorium, Peelamedu', district: 'Coimbatore', organizerType: 'School', whatsapp: '9876500002', registerLink: '', description: 'Exam pattern, preparation timeline and Q&A with NEET mentors.' },
  { id: 'e6', ...own('demo-organizer', 'Padasala Sports Council', 20), title: 'Zonal Athletics Meet', category: 'Sports', date: '2026-10-05', time: '08:00', venue: 'Anna Stadium', district: 'Tiruchirappalli', organizerType: 'Event Organizer', whatsapp: '9876500006', registerLink: '', description: 'Track and field events for Classes 6-12.' },
];

const requirements: Seed[] = [
  { id: 'r1', ...SCHOOL, category: 'Uniforms', item: 'Summer uniform sets (shirt + trousers/skirt)', quantity: '600 sets', neededBy: '2027-03-15', budget: '₹4,50,000', district: 'Coimbatore', details: 'Sizes for Classes 1-12. School logo embroidery required.' },
  { id: 'r2', ...SCHOOL, category: 'Ties & Belts', item: 'School ties and belts with logo', quantity: '1,200 each', neededBy: '2027-03-15', budget: '₹1,20,000', district: 'Coimbatore', details: 'Navy blue with gold stripe.' },
  { id: 'r3', ...own('seed-school-2', 'Vidya Mandir Senior Secondary', 2), category: 'Notebooks & Stationery', item: 'Long-size ruled notebooks', quantity: '8,000 pcs', neededBy: '2027-04-01', budget: '₹2,40,000', district: 'Madurai', details: '200 pages, school cover print.' },
  { id: 'r4', ...own('seed-school-3', 'Greenfield Public School', 3), category: 'Computers & Hardware', item: 'Desktop computers for lab', quantity: '30 units', neededBy: '2026-12-20', budget: '₹12,00,000', district: 'Salem', details: 'i5 / 16 GB RAM / SSD, with UPS.' },
  { id: 'r5', ...own('seed-school-4', 'Akshara Vidyalaya', 1), category: 'Software', item: 'School management software (fees, attendance, report cards)', quantity: '1 licence', neededBy: '2027-01-10', budget: 'Open', district: 'Erode', details: 'Tamil + English, parent mobile app preferred.' },
];

const schoolPosts: Seed[] = [
  { id: 'a1', ...SCHOOL, kind: 'admission', occasion: 'Vijayadasami', classes: 'Pre-KG, LKG, UKG', startDate: '2026-10-20', lastDate: '2026-11-15', details: 'Vidyarambham ceremony on Vijayadasami day. Spot admission with application fee waiver.' },
  { id: 'a2', ...own('seed-school-2', 'Vidya Mandir Senior Secondary', 2), kind: 'admission', occasion: 'New Academic Year 2027-28', classes: 'LKG to Class 11', startDate: '2026-12-01', lastDate: '2027-03-31', details: 'Entrance assessment for Class 6 and above.' },
  { id: 'cn1', ...SCHOOL, kind: 'concession', title: 'Sibling concession', eligibility: 'Sibling', benefit: '15% on tuition fee', validTill: '2027-03-31', details: 'For the second child studying in the same school.' },
  { id: 'cn2', ...own('seed-school-4', 'Akshara Vidyalaya', 4), kind: 'concession', title: 'Sports quota scholarship', eligibility: 'Sports quota', benefit: 'Up to 50% fee waiver', validTill: '2027-06-30', details: 'District-level medal winners in any recognised sport.' },
  { id: 'ac1', ...SCHOOL, kind: 'achievement', title: '12 students cleared NEET 2026', category: 'Academic', date: '2026-06-14', details: 'Highest score 652/720. Congratulations to our students and mentors!' },
  { id: 'ac2', ...own('seed-school-2', 'Vidya Mandir Senior Secondary', 9), kind: 'achievement', title: 'State champions — Under-14 Chess', category: 'Sports', date: '2026-08-22', details: 'Team won gold at the state school chess championship.' },
  { id: 'x1', ...own('seed-school-4', 'Akshara Vidyalaya', 6), kind: 'extracurricular', activity: 'Silambam', category: 'Martial arts', schedule: 'Mon, Wed, Fri · 4:00-5:00 pm', coach: 'Master Vignesh', fee: 'Included in fees' },
  { id: 'x2', ...SCHOOL, kind: 'extracurricular', activity: 'Robotics & Coding Club', category: 'STEM', schedule: 'Saturdays · 9:30-11:30 am', coach: 'In-house STEM team', fee: '₹1,500 / term' },
];

const coaching: Seed[] = [
  { id: 'cc1', ...own('demo-coaching', 'Brilliant Minds Academy', 8), category: 'academic', providerType: 'Tuition Centre', name: 'Brilliant Minds Academy', subjects: ['Mathematics', 'Physics', 'Chemistry'], classes: 'Class 9-12', experience: '12', charges: '2500', mode: 'Offline', achievements: '40+ students scored centum in board exams (2026).', district: 'Coimbatore', area: 'Gandhipuram', phone: '9876500003' },
  { id: 'cc2', ...own('seed-coaching-2', 'Priya Raghavan', 6), category: 'academic', providerType: 'Individual Tutor', name: 'Ms. Priya Raghavan, M.Phil', subjects: ['English', 'Social Science'], classes: 'Class 6-10', experience: '8', charges: '1800', mode: 'Online', achievements: 'Former CBSE school teacher.', district: 'Chennai', area: 'Online — all Tamil Nadu', phone: '9876522002' },
  { id: 'cc3', ...own('seed-coaching-3', 'MasterChess Academy', 5), category: 'extra', providerType: 'Tuition Centre', name: 'MasterChess Academy', subjects: ['Chess'], classes: 'Age 6+', experience: '10', charges: '1500', mode: 'Offline', achievements: 'Coach Aravind, FIDE rated. 25 state-level medal winners.', district: 'Madurai', area: 'Anna Nagar', phone: '9876522003' },
  { id: 'cc4', ...own('seed-coaching-4', 'Silambam Warriors Camp', 5), category: 'extra', providerType: 'Individual Tutor', name: 'Master Vignesh — Silambam', subjects: ['Silambam', 'Fitness'], classes: 'All ages', experience: '15', charges: '1200', mode: 'Offline', achievements: 'State champion; trains school teams.', district: 'Erode', area: 'Perundurai Road', phone: '9876522004' },
  { id: 'cc5', ...own('seed-coaching-5', 'Apex NEET Institute', 3), category: 'courses', providerType: 'Institute', name: 'Apex NEET Institute', subjects: ['NEET', 'NEET Repeater'], classes: 'Class 11, 12 & repeaters', experience: '9', charges: '6500', mode: 'Hybrid', achievements: '120+ selections in NEET 2026.', district: 'Tiruchirappalli', area: 'Thillai Nagar', phone: '9876522005' },
  { id: 'cc6', ...own('seed-coaching-6', 'Spark JEE Classes', 3), category: 'courses', providerType: 'Tuition Centre', name: 'Spark JEE & Foundation', subjects: ['JEE Main', 'Foundation (Class 8-10)'], classes: 'Class 8-12', experience: '6', charges: '4000', mode: 'Offline', achievements: 'Small batches of 20.', district: 'Salem', area: 'Hasthampatti', phone: '9876522006' },
];

const tuitionRequests: Seed[] = [
  { id: 'tr1', ...own('demo-student', 'Arjun Kumar', 2), studentName: 'Arjun Kumar', classLevel: 'Class 11', subjects: ['Physics', 'Chemistry'], mode: 'Home tuition', district: 'Coimbatore', area: 'Saravanampatti', budget: '₹3,000 / month', phone: '9876500001', details: 'Evenings after 6 pm, CBSE. Preparing for NEET.' },
  { id: 'tr2', ...own('seed-student-2', 'Meena S (parent)', 1), studentName: 'Meena S (parent)', classLevel: 'Class 7', subjects: ['Mathematics'], mode: 'Tuition centre', district: 'Madurai', area: 'KK Nagar', budget: '₹1,500 / month', phone: '9876533002', details: 'State board. Weekend classes preferred.' },
  { id: 'tr3', ...own('seed-student-3', 'Rahul V', 1), studentName: 'Rahul V', classLevel: 'Class 9', subjects: ['Chess'], mode: 'Online', district: 'Chennai', area: 'Velachery', budget: '₹1,000 / month', phone: '9876533003', details: 'Beginner, wants to play rated tournaments.' },
];

const teacherProfiles: Seed[] = [
  { id: 'tp1', ...own('demo-teacher', 'Kavitha Ramesh', 3), name: 'Kavitha Ramesh', subjects: ['Chemistry'], qualification: 'M.Sc Chemistry, B.Ed', experience: '7', districts: ['Madurai', 'Dindigul'], expectedSalary: '₹40,000 / month', jobType: 'Full-time', availability: 'From June 2027', phone: '9876500004', about: 'CBSE PGT with NEET coaching experience.' },
  { id: 'tp2', ...own('seed-teacher-2', 'Suresh Babu', 2), name: 'Suresh Babu', subjects: ['Mathematics', 'Physics'], qualification: 'M.Sc Maths, B.Ed', experience: '11', districts: ['Coimbatore', 'Tiruppur'], expectedSalary: '₹50,000 / month', jobType: 'Full-time', availability: 'Immediate', phone: '9876544002', about: 'State board and CBSE, Classes 9-12.' },
  { id: 'tp3', ...own('seed-teacher-3', 'Anitha Joseph', 1), name: 'Anitha Joseph', subjects: ['English'], qualification: 'M.A English, B.Ed', experience: '4', districts: ['Chennai'], expectedSalary: '₹28,000 / month', jobType: 'Part-time', availability: 'Immediate', phone: '9876544003', about: 'Spoken English trainer, primary and middle school.' },
];

const vendors: Seed[] = [
  { id: 'v1', ...own('demo-vendor', 'Sri Murugan School Supplies', 10), company: 'Sri Murugan School Supplies', category: 'Uniforms', services: 'School uniforms, ties, belts, ID cards', experience: '18', locations: ['Tiruppur', 'Coimbatore', 'Erode', 'Salem'], contactPerson: 'R. Murugan', phone: '9876500005', email: 'sales@srimurugan.example', about: 'In-house stitching unit, 50,000+ sets supplied every year.' },
  { id: 'v2', ...own('seed-vendor-2', 'BookNest Distributors', 8), company: 'BookNest Distributors', category: 'Notebooks & Stationery', services: 'Notebooks with school branding, stationery kits', experience: '9', locations: ['Madurai', 'Theni', 'Dindigul', 'Virudhunagar'], contactPerson: 'S. Karthik', phone: '9876555002', email: 'orders@booknest.example', about: 'Sivakasi printing partner, delivery within 15 days.' },
  { id: 'v3', ...own('seed-vendor-3', 'EduTech Systems', 6), company: 'EduTech Systems', category: 'Computers & Hardware', services: 'Computer labs, smart boards, CCTV, networking', experience: '12', locations: ['Chennai', 'Chengalpattu', 'Kancheepuram', 'Tiruvallur'], contactPerson: 'Priya N', phone: '9876555003', email: 'hello@edutech.example', about: 'Authorised partner for leading brands. AMC available.' },
  { id: 'v4', ...own('seed-vendor-4', 'SchoolSoft Tamil', 4), company: 'SchoolSoft Tamil', category: 'Software', services: 'School ERP — fees, attendance, report cards, parent app', experience: '5', locations: ['All Tamil Nadu'], contactPerson: 'Dinesh K', phone: '9876555004', email: 'demo@schoolsoft.example', about: 'Tamil and English interface, WhatsApp alerts for parents.' },
];

export const seeds = {
  users,
  schoolProfiles,
  jobs,
  events,
  requirements,
  schoolPosts,
  coaching,
  tuitionRequests,
  teacherProfiles,
  vendors,
  enquiries: [] as Seed[],
  applications: [] as Seed[],
  questions: [] as Seed[],
  attempts: [] as Seed[],
};

// Photo links used by earlier versions of the demo schools; saved copies with these get the new bundled photos.
export const legacySeedImages = new Set([
  'https://images.pexels.com/photos/30945258/pexels-photo-30945258.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/39198178/pexels-photo-39198178.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/5147363/pexels-photo-5147363.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/5147365/pexels-photo-5147365.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
]);
