export const NAV_ITEMS = [
  { label: 'HOME', path: '/' },
  { label: 'COURSE INFO', path: '/courses' },
  { label: 'DEPARTMENT & STAFF', path: '/department' },
  { label: 'EVENTS', path: '/events' },
  { label: 'NOTICE BOARD', path: '/notices' },
  { label: 'MORE', path: '/more' },
];

export const STATS = [
  { value: '50+', label: 'Years of Excellence' },
  { value: '18', label: 'Faculty & Staff' },
  { value: 'UG & PG', label: 'Accredited Degrees' },
  { value: 'NBA', label: 'Accredited Department' },
];

export const FACULTY = [
  {
    name: 'Dr. Paresh H. Rana',
    role: 'Head of Department & Professor',
    email: 'hod_chem@ldce.ac.in',
    image: 'images/hod.png',
    qualification: 'Ph.D. Chemical Engineering (IIT Bombay)',
    specialization: 'Reaction Kinetics, Process Modeling & Green Tech',
    office: 'Block 2, Room 104',
    experience: '24+ Years',
  },
  {
    name: 'Prof. S. M. Dutta',
    role: 'Associate Professor',
    email: 'smdutta@ldce.ac.in',
    image: 'images/faculty1.png',
    qualification: 'M.E. Chemical Engineering (GTU)',
    specialization: 'Fluid Dynamics & Unit Operations',
    office: 'Block 2, Room 108',
    experience: '18+ Years',
  },
  {
    name: 'Prof. R. P. Vyas',
    role: 'Assistant Professor',
    email: 'rpvyas@ldce.ac.in',
    image: 'images/faculty2.png',
    qualification: 'M.Tech Chemical Processing (Nirma Tech)',
    specialization: 'Mass Transfer & Industrial Safety HAZOP',
    office: 'Block 2, Room 112',
    experience: '12+ Years',
  },
];

export const COURSES = [
  {
    tag: 'Undergraduate',
    altTag: false,
    title: 'B.E. in Chemical Engineering',
    duration: '4 Academic Years (8 Semesters)',
    intake: '60 Seats',
    gtuSchemeUrl: 'https://www.gtu.ac.in/Syllabus.aspx',
    description:
      'A comprehensive GTU-accredited 4-year degree focusing on fluid flow, heat & mass transfer, chemical reaction engineering, process equipment design, and plant economics. Prepares students for leading roles in petrochemical, pharmaceutical, and environmental sectors.',
    keySubjects: [
      'Fluid Flow Operations',
      'Mass Transfer Operations I & II',
      'Chemical Reaction Engineering',
      'Process Equipment Design',
      'Industrial Safety & HAZOP',
    ],
  },
  {
    tag: 'Postgraduate',
    altTag: true,
    title: 'M.E. in Chemical Engineering',
    duration: '2 Academic Years (4 Semesters)',
    intake: '18 Seats',
    gtuSchemeUrl: 'https://www.gtu.ac.in/Syllabus.aspx',
    description:
      'A 2-year specialized master’s program emphasizing advanced process control, mathematical modeling & simulation, industrial waste treatment, computational fluid dynamics (CFD), and sustainable green technology research.',
    keySubjects: [
      'Advanced Transport Phenomena',
      'Mathematical Methods in Chemical Eng.',
      'Aspen Plus Process Simulation',
      'Green Technology & Catalysis',
      'Advanced Process Dynamics',
    ],
  },
];

export const LABORATORIES = [
  {
    name: 'Unit Operations & Mass Transfer Lab',
    desc: 'Equipped with packed bed distillation columns, liquid-liquid extraction units, and tray dryers for practical industrial simulation.',
  },
  {
    name: 'Chemical Reaction Engineering (CRE) Lab',
    desc: 'Features batch reactors, CSTR, tubular flow reactors, and residence time distribution (RTD) apparatus for kinetic study.',
  },
  {
    name: 'Process Control & Dynamics Lab',
    desc: 'Includes pneumatic valve controls, PID controllers, and SCADA-integrated real-time temperature & pressure loops.',
  },
  {
    name: 'Environmental Engineering Lab',
    desc: 'Facilities for effluent analysis, BOD/COD testing, spectrophotometry, and industrial wastewater treatment modeling.',
  },
];

export const EVENTS = [
  {
    tag: 'Industrial Tour',
    status: 'Completed',
    date: 'August 18, 2026',
    venue: 'GIDC Ankleshwar & Jhagadia Chemical Belt',
    title: 'Annual Visit to GIDC Ankleshwar Industrial Cluster',
    description:
      'Third-year students visited major chemical processing units to observe large-scale distillation columns, heat exchanger networks, and industrial effluent treatment plants (ETP) in action.',
  },
  {
    tag: 'Expert Talk',
    status: 'Upcoming',
    date: 'September 18, 2026',
    venue: 'Department Seminar Hall (Block 2)',
    title: 'Lecture on Industrial Safety & HAZOP Analysis',
    description:
      'Interactive session by lead safety engineers from Reliance Industries covering Hazard and Operability (HAZOP) analysis, quantitative risk assessment, and OSHA plant safety standards.',
  },
  {
    tag: 'Workshop',
    status: 'Upcoming',
    date: 'October 05 - 09, 2026',
    venue: 'CAD & Simulation Lab',
    title: 'STTP on Process Simulation using Aspen Plus',
    description:
      'A week-long faculty and postgraduate workshop focusing on Aspen Plus software modeling, steady-state mass balance, and pinch analysis for sustainable chemical manufacturing.',
  },
];

export const NOTICES = [
  {
    category: 'Exams',
    date: 'October 15, 2026',
    title: 'Mid-Semester Examination Schedule (Odd Sem 2026)',
    description:
      'The mid-semester examinations for B.E. Semesters 3, 5, and 7 are scheduled to commence from November 2. Detailed timetable and seating plan uploaded on the departmental bulletin.',
    isUrgent: true,
    downloadUrl: '#/notices',
  },
  {
    category: 'Submissions',
    date: 'September 28, 2026',
    title: 'Final Year Major Project Progress Review',
    description:
      'All 8th semester B.E. students must submit their interim progress reports and present project slides to their respective faculty guides before October 10.',
    isUrgent: false,
    downloadUrl: '#/notices',
  },
  {
    category: 'Circulars',
    date: 'September 10, 2026',
    title: 'GTU Remedial Exam Registration Notice',
    description:
      'Online registration for GTU remedial examinations is active on the student portal. Eligible students are instructed to complete fee payments promptly before the cutoff date.',
    isUrgent: false,
    downloadUrl: '#/notices',
  },
];
