export type Role = 'student' | 'school' | 'teacher' | 'tutor' | 'admin';

export interface NavLink {
  label: string;
  href: string;
  icon?: string;
}

export interface School {
  id: string;
  name: string;
  location: string;
  board: string;
  rating: number;
  grades: string;
  image: string;
  tag?: string;
  tagType?: 'verified' | 'smart' | 'premier' | string;
  photoCount?: number;
  thumbnails?: string[];
  facilities: string[];
  courses: string[];
  featured?: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: 'NEET' | 'JEE' | 'Board' | 'Foundation' | 'Skill';
  level: string;
  duration: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  price: string;
  enrolled: number;
  rating: number;
  topics: string[];
}

export interface Job {
  id: string;
  title: string;
  school: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  subject: string;
  experience: string;
  posted: string;
  salary: string;
}

export interface Tuition {
  id: string;
  name: string;
  tutor: string;
  subject: string;
  level: string;
  mode: 'Online' | 'Offline' | 'Home';
  location: string;
  rating: number;
  skills: string[];
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  category: 'Sports' | 'Cultural' | 'Academic' | 'Workshop' | 'Competition';
  organizer: string;
  image: string;
  registrationOpen: boolean;
}

export const schools: School[] = [
  {
    id: 's1',
    name: 'Sunrise International School',
    location: 'Coimbatore, TN',
    board: 'CBSE',
    rating: 4.5,
    grades: 'Pre-KG to 12',
    tag: 'Verified',
    tagType: 'verified',
    photoCount: 3,
    image: 'https://images.pexels.com/photos/30945258/pexels-photo-30945258.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    thumbnails: [
      'https://images.pexels.com/photos/30945258/pexels-photo-30945258.jpeg?auto=compress&cs=tinysrgb&h=150&w=200',
      'https://images.pexels.com/photos/5147363/pexels-photo-5147363.jpeg?auto=compress&cs=tinysrgb&h=150&w=200',
      'https://images.pexels.com/photos/5147365/pexels-photo-5147365.jpeg?auto=compress&cs=tinysrgb&h=150&w=200',
    ],
    facilities: ['Smart Classrooms', 'Science Labs', 'Sports Academy'],
    courses: ['NEET Foundation', 'JEE Foundation', 'Board Excellence'],
    featured: true,
  },
  {
    id: 's2',
    name: 'Vidya Mandir Senior Secondary',
    location: 'Madurai, TN',
    board: 'State Board',
    rating: 4.5,
    grades: 'LKG to 12',
    tag: 'Smart School',
    tagType: 'smart',
    photoCount: 3,
    image: 'https://images.pexels.com/photos/39198178/pexels-photo-39198178.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    thumbnails: [
      'https://images.pexels.com/photos/39198178/pexels-photo-39198178.jpeg?auto=compress&cs=tinysrgb&h=150&w=200',
      'https://images.pexels.com/photos/30945258/pexels-photo-30945258.jpeg?auto=compress&cs=tinysrgb&h=150&w=200',
      'https://images.pexels.com/photos/5147363/pexels-photo-5147363.jpeg?auto=compress&cs=tinysrgb&h=150&w=200',
    ],
    facilities: ['Robotics Lab', 'Digital Library', 'STEM Based Arena'],
    courses: ['NEET Crash', 'Board Booster', 'Chess Academy'],
    featured: true,
  },
  {
    id: 's3',
    name: 'Greenfield Public School',
    location: 'Salem, TN',
    board: 'CBSE',
    rating: 4.6,
    grades: '1 to 12',
    tag: 'Verified',
    tagType: 'verified',
    photoCount: 4,
    image: 'https://images.pexels.com/photos/5147363/pexels-photo-5147363.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    thumbnails: [
      'https://images.pexels.com/photos/5147363/pexels-photo-5147363.jpeg?auto=compress&cs=tinysrgb&h=150&w=200',
      'https://images.pexels.com/photos/39198178/pexels-photo-39198178.jpeg?auto=compress&cs=tinysrgb&h=150&w=200',
      'https://images.pexels.com/photos/5147365/pexels-photo-5147365.jpeg?auto=compress&cs=tinysrgb&h=150&w=200',
    ],
    facilities: ['STEM Lab', 'Athletics Track', 'Hostel'],
    courses: ['JEE Foundation', 'Olympiad Prep', 'Spoken English'],
  },
  {
    id: 's4',
    name: 'Akshara Vidyalaya',
    location: 'Erode, TN',
    board: 'Matriculation',
    rating: 4.4,
    grades: 'Pre-KG to 10',
    tag: 'Smart School',
    tagType: 'smart',
    photoCount: 5,
    image: 'https://images.pexels.com/photos/5147365/pexels-photo-5147365.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    thumbnails: [
      'https://images.pexels.com/photos/5147365/pexels-photo-5147365.jpeg?auto=compress&cs=tinysrgb&h=150&w=200',
      'https://images.pexels.com/photos/30945258/pexels-photo-30945258.jpeg?auto=compress&cs=tinysrgb&h=150&w=200',
      'https://images.pexels.com/photos/5147363/pexels-photo-5147363.jpeg?auto=compress&cs=tinysrgb&h=150&w=200',
    ],
    facilities: ['Language Lab', 'Yoga Hall', 'Art Studio'],
    courses: ['Spoken English', 'Abacus', 'Silambam'],
  },
];

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'NEET 2026 Power Batch',
    category: 'NEET',
    level: 'Class 11 & 12',
    duration: '12 months',
    mode: 'Hybrid',
    price: '₹38,000',
    enrolled: 4200,
    rating: 4.9,
    topics: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
  },
  {
    id: 'c2',
    title: 'JEE Main + Advanced Pro',
    category: 'JEE',
    level: 'Class 11 & 12',
    duration: '14 months',
    mode: 'Online',
    price: '₹42,000',
    enrolled: 3600,
    rating: 4.8,
    topics: ['Physics', 'Chemistry', 'Maths'],
  },
  {
    id: 'c3',
    title: 'Foundation Olympiad Pack',
    category: 'Foundation',
    level: 'Class 6 to 10',
    duration: '10 months',
    mode: 'Hybrid',
    price: '₹14,000',
    enrolled: 5200,
    rating: 4.7,
    topics: ['Maths', 'Science', 'Reasoning'],
  },
  {
    id: 'c4',
    title: 'Board Exam Booster 2026',
    category: 'Board',
    level: 'Class 10 & 12',
    duration: '6 months',
    mode: 'Offline',
    price: '₹9,500',
    enrolled: 2800,
    rating: 4.6,
    topics: ['All Subjects', 'Sample Papers', 'Revision'],
  },
  {
    id: 'c5',
    title: 'Chess & Silambam Academy',
    category: 'Skill',
    level: 'All Ages',
    duration: 'Flexible',
    mode: 'Offline',
    price: '₹3,200/mo',
    enrolled: 980,
    rating: 4.9,
    topics: ['Chess Strategy', 'Silambam', 'Yoga'],
  },
  {
    id: 'c6',
    title: 'Spoken English & Personality',
    category: 'Skill',
    level: 'Class 5 to 12',
    duration: '3 months',
    mode: 'Online',
    price: '₹4,800',
    enrolled: 1450,
    rating: 4.5,
    topics: ['Grammar', 'Conversation', 'Public Speaking'],
  },
];

export const jobs: Job[] = [
  {
    id: 'j1',
    title: 'PGT Physics Teacher',
    school: 'Sunrise International School',
    location: 'Coimbatore, TN',
    type: 'Full-time',
    subject: 'Physics',
    experience: '3-8 yrs',
    posted: '2 days ago',
    salary: '₹45,000 - ₹60,000',
  },
  {
    id: 'j2',
    title: 'TGT Mathematics Faculty',
    school: 'Vidya Mandir Senior Secondary',
    location: 'Madurai, TN',
    type: 'Full-time',
    subject: 'Mathematics',
    experience: '2-5 yrs',
    posted: '5 days ago',
    salary: '₹32,000 - ₹45,000',
  },
  {
    id: 'j3',
    title: 'NEET Biology Mentor',
    school: 'Greenfield Public School',
    location: 'Salem, TN',
    type: 'Contract',
    subject: 'Biology',
    experience: '4+ yrs',
    posted: '1 day ago',
    salary: '₹50,000 - ₹70,000',
  },
  {
    id: 'j4',
    title: 'Silambam & Yoga Coach',
    school: 'Akshara Vidyalaya',
    location: 'Erode, TN',
    type: 'Part-time',
    subject: 'Physical Education',
    experience: '2+ yrs',
    posted: '3 days ago',
    salary: '₹18,000 - ₹25,000',
  },
];

export const tuitions: Tuition[] = [
  {
    id: 't1',
    name: 'Brilliant Minds Academy',
    tutor: 'Mr. Senthil Kumar, M.Sc',
    subject: 'Maths & Science',
    level: 'Class 9-12',
    mode: 'Offline',
    location: 'Coimbatore',
    rating: 4.8,
    skills: ['NEET', 'JEE', 'Board'],
  },
  {
    id: 't2',
    name: 'LearnRight Online Tuition',
    tutor: 'Ms. Priya Raghavan, M.Phil',
    subject: 'English & Social',
    level: 'Class 6-10',
    mode: 'Online',
    location: 'Pan India',
    rating: 4.7,
    skills: ['Board', 'Olympiad'],
  },
  {
    id: 't3',
    name: 'MasterChess Home Tuition',
    tutor: 'Coach Aravind, FIDE rated',
    subject: 'Chess',
    level: 'Beginner to Advanced',
    mode: 'Home',
    location: 'Madurai',
    rating: 4.9,
    skills: ['Chess', 'Strategy'],
  },
  {
    id: 't4',
    name: 'Silambam Warriors Camp',
    tutor: 'Master Vignesh, State Champion',
    subject: 'Silambam',
    level: 'All Levels',
    mode: 'Offline',
    location: 'Erode',
    rating: 4.8,
    skills: ['Silambam', 'Fitness'],
  },
];

export const events: EventItem[] = [
  {
    id: 'e1',
    title: 'Inter-School Silambam Championship',
    date: 'Oct 12, 2025',
    location: 'Coimbatore',
    category: 'Competition',
    organizer: 'Padasala Sports Council',
    image: 'https://images.pexels.com/photos/36781049/pexels-photo-36781049.png?auto=compress&cs=tinysrgb&h=650&w=940',
    registrationOpen: true,
  },
  {
    id: 'e2',
    title: 'District Chess Open Tournament',
    date: 'Oct 20, 2025',
    location: 'Madurai',
    category: 'Competition',
    organizer: 'Vidya Mandir',
    image: 'https://images.pexels.com/photos/4800923/pexels-photo-4800923.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    registrationOpen: true,
  },
  {
    id: 'e3',
    title: 'Science & Robotics Expo 2025',
    date: 'Nov 02, 2025',
    location: 'Salem',
    category: 'Academic',
    organizer: 'Greenfield Public School',
    image: 'https://images.pexels.com/photos/5427683/pexels-photo-5427683.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    registrationOpen: true,
  },
  {
    id: 'e4',
    title: 'Annual Cultural Fest — Rangoli',
    date: 'Nov 15, 2025',
    location: 'Erode',
    category: 'Cultural',
    organizer: 'Akshara Vidyalaya',
    image: 'https://images.pexels.com/photos/30455278/pexels-photo-30455278.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    registrationOpen: false,
  },
];

export const stats = [
  { label: 'Verified Schools', value: '1,200+' },
  { label: 'Active Students', value: '85,000+' },
  { label: 'Teacher Jobs', value: '3,400+' },
  { label: 'Live Events', value: '120+' },
];

export const features = [
  {
    icon: 'School',
    title: 'Discover Verified Schools',
    desc: 'Compare and apply in minutes.',
  },
  {
    icon: 'GraduationCap',
    title: 'NEET & JEE Courses',
    desc: 'Timed mock tests with instant solutions.',
  },
  {
    icon: 'Briefcase',
    title: 'Teacher Job Portal',
    desc: 'One profile to apply and track every job.',
  },
  {
    icon: 'BookOpen',
    title: 'Tuition & Skill Classes',
    desc: 'Tutors and skill coaches near you.',
  },
  {
    icon: 'CalendarDays',
    title: 'School Events & Competitions',
    desc: 'Competitions and fests by date and district.',
  },
  {
    icon: 'ClipboardCheck',
    title: 'Admissions Made Simple',
    desc: 'Admissions, offers and enquiries.',
  },
];
