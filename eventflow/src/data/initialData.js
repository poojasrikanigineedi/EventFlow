// Initial rich mock data for EventFlow

export const INITIAL_VENUES = [
  {
    id: 'venue-auditorium',
    name: 'Main Auditorium',
    building: 'Main Block',
    block: 'Block M',
    room: 'Auditorium Hall 1',
    floor: 'Ground Floor',
    campusLocation: 'Central Campus Plaza',
    capacity: 300,
    currentCrowd: 45,
    coordinates: { x: 50, y: 35 }, // percentage on campus map
    indoorDetails: {
      building: 'Main Block',
      floor: 'Ground Floor',
      wing: 'North Wing',
      directions: 'Enter via Main Archway -> Proceed straight past Reception -> Double doors on right.'
    }
  },
  {
    id: 'venue-block-a-lab1',
    name: 'Block A – Lab 1',
    building: 'Engineering Sciences',
    block: 'Block A',
    room: 'Lab 101 (Software Systems)',
    floor: '1st Floor',
    campusLocation: 'North Wing, Quadrangle',
    capacity: 100,
    currentCrowd: 72,
    coordinates: { x: 28, y: 22 },
    indoorDetails: {
      building: 'Block A',
      floor: '1st Floor',
      wing: 'East Wing',
      directions: 'Block A Staircase -> Turn Left on 1st Floor -> Room 101 adjacent to CS Dept.'
    }
  },
  {
    id: 'venue-block-b-lab1',
    name: 'Block B – Lab 1',
    building: 'Technology & Computing Block',
    block: 'Block B',
    room: 'Lab 201 (AI & Networks)',
    floor: '2nd Floor',
    campusLocation: 'Tech Park Zone',
    capacity: 100,
    currentCrowd: 72,
    coordinates: { x: 74, y: 24 },
    indoorDetails: {
      building: 'Block B',
      floor: '2nd Floor',
      wing: 'West Wing',
      directions: 'Take Central Elevator to 2nd Floor -> Corridor B2 -> Lab 201 on right.'
    }
  },
  {
    id: 'venue-block-b-lab2',
    name: 'Block B – Lab 2',
    building: 'Technology & Computing Block',
    block: 'Block B',
    room: 'Lab 204 (Advanced Systems)',
    floor: '2nd Floor',
    campusLocation: 'Tech Park Zone',
    capacity: 100,
    currentCrowd: 95,
    coordinates: { x: 80, y: 30 },
    indoorDetails: {
      building: 'Block B',
      floor: '2nd Floor',
      wing: 'West Wing',
      directions: 'Block B Elevator -> 2nd Floor -> Pass Lab 201 -> Follow corridor to Lab 204.'
    }
  },
  {
    id: 'venue-seminar-hall',
    name: 'Seminar Hall',
    building: 'Management & Arts Center',
    block: 'Block C',
    room: 'Silver Jubilee Hall',
    floor: '3rd Floor',
    campusLocation: 'South Campus Green',
    capacity: 150,
    currentCrowd: 110,
    coordinates: { x: 68, y: 70 },
    indoorDetails: {
      building: 'Block C',
      floor: '3rd Floor',
      wing: 'Central Hub',
      directions: 'Block C Main Lobby -> Elevator 1 to 3rd Floor -> Grand Hallway entrance.'
    }
  },
  {
    id: 'venue-v-block-lab2',
    name: 'V Block – Lab 2',
    building: 'Innovation & Robotics Wing',
    block: 'V Block',
    room: 'VLSI & IoT Center',
    floor: '2nd Floor',
    campusLocation: 'West Innovation Corridor',
    capacity: 80,
    currentCrowd: 38,
    coordinates: { x: 22, y: 65 },
    indoorDetails: {
      building: 'V Block',
      floor: '2nd Floor',
      wing: 'South Wing',
      directions: 'Enter V Block gate -> Lift B to 2nd Floor -> Room V-202.'
    }
  }
];

export const INITIAL_EVENTS = [
  {
    id: 'evt-codesprint-2026',
    name: 'CodeSprint Hackathon',
    category: 'Hackathon',
    tagline: '24-hour National Level Hackathon pushing boundaries in AI & Web3',
    organizer: 'VVI Coding Club & IEEE Student Branch',
    college: 'VVI University, Main Campus',
    startDate: '2026-10-03',
    endDate: '2026-10-04',
    time: '9:00 AM',
    endTime: '5:00 PM',
    venueId: 'venue-auditorium',
    venueName: 'Main Block, VVI University',
    registrationOpen: true,
    registrationDeadline: '2026-10-02T23:59:00',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
    about: 'CodeSprint Hackathon brings together over 400 passionate student developers, designers, and innovators to solve high-impact challenges across AI, Healthcare, FinTech, and Smart Cities.',
    eligibility: 'Open to all undergraduate & postgraduate students from recognized universities and colleges.',
    teamSize: '2 to 4 members per team',
    requirements: 'Bring your laptop, chargers, college ID, and enthusiasm to build innovative solutions.',
    rules: [
      'All code must be written during the hackathon timeframe.',
      'Open-source libraries and APIs are allowed, but core solution must be developed on site.',
      'Plagiarism or pre-existing completed projects will lead to immediate disqualification.',
      'Active physical or verified check-in required for food and mentorship access.'
    ],
    instructions: 'Report at Main Auditorium by 8:30 AM for badge pickup, WiFi access credentials, and opening keynote.',
    registrationsCount: 248,
    status: 'Active'
  },
  {
    id: 'evt-ai-innovate-2026',
    name: 'AI Innovation Hackathon',
    category: 'Hackathon',
    tagline: 'Build next-generation autonomous AI agents and multimodal apps',
    organizer: 'AI Research Lab & Google Developer Student Club',
    college: 'VVI University',
    startDate: '2026-10-05',
    endDate: '2026-10-06',
    time: '9:00 AM',
    endTime: '6:00 PM',
    venueId: 'venue-v-block-lab2',
    venueName: 'V Block – Lab 2',
    registrationOpen: true,
    registrationDeadline: '2026-10-04T23:59:00',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    about: 'A premier hackathon dedicated to exploring frontier AI, LLMs, vision models, and real-world edge AI deployments.',
    eligibility: 'Engineers, data scientists, and designers.',
    teamSize: '1 to 3 members',
    requirements: 'Python 3.11+, GPU access account, GitHub account.',
    rules: [
      'Model architectures must be documented.',
      'Live demo during final evaluation is mandatory.'
    ],
    instructions: 'Bring your student identity proof and pre-registered ticket confirmation.',
    registrationsCount: 112,
    status: 'Upcoming'
  },
  {
    id: 'evt-robotics-workshop-2026',
    name: 'Hands-on IoT & Drone Robotics Workshop',
    category: 'Workshop',
    tagline: 'Hands-on hardware interfacing and autopilot calibration',
    organizer: 'Robotics & Automation Society',
    college: 'VVI University',
    startDate: '2026-10-06',
    endDate: '2026-10-06',
    time: '10:00 AM',
    endTime: '4:00 PM',
    venueId: 'venue-block-a-lab1',
    venueName: 'Block A – Lab 1',
    registrationOpen: true,
    registrationDeadline: '2026-10-05T18:00:00',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    about: 'Learn micro-controller programming, sensor fusion, PID motor control, and assemble an autonomous quadcopter kit in groups.',
    eligibility: 'ECE, EEE, CSE, Mechanical students with basic C/C++ knowledge.',
    teamSize: 'Individual or pairs',
    requirements: 'Personal laptop with Arduino IDE installed.',
    rules: ['Handle hardware test benches with care.', 'Safety goggles provided.'],
    instructions: 'Kit components will be distributed at Block A counter upon verification.',
    registrationsCount: 65,
    status: 'Upcoming'
  },
  {
    id: 'evt-cybersec-summit-2026',
    name: 'CyberDefend Security Summit & CTF',
    category: 'Technical Event',
    tagline: 'Capture The Flag competition and live threat hunting drills',
    organizer: 'Cyber Security Guild',
    college: 'VVI University',
    startDate: '2026-10-08',
    endDate: '2026-10-08',
    time: '11:00 AM',
    endTime: '5:00 PM',
    venueId: 'venue-block-b-lab2',
    venueName: 'Block B – Lab 2',
    registrationOpen: false, // Closed example
    registrationDeadline: '2026-10-01T23:59:00',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80',
    about: 'Sharpen your ethical hacking, reverse engineering, web penetration, and cryptography skills in a high-stakes competitive CTF.',
    eligibility: 'All collegiate cybersecurity enthusiasts.',
    teamSize: 'Individual or 2 members',
    requirements: 'Kali Linux or security tools environment.',
    rules: ['Attacking event infrastructure outside target sandbox is prohibited.'],
    instructions: 'Bring your pre-configured VM image.',
    registrationsCount: 90,
    status: 'Closed'
  },
  {
    id: 'evt-tedx-ignite-2026',
    name: 'Ignite Horizons: Annual Youth Leadership Fest',
    category: 'Fest',
    tagline: 'Keynotes, entrepreneur pitch tanks, music and cultural exhibits',
    organizer: 'Student Council & Cultural Directorate',
    college: 'VVI University',
    startDate: '2026-10-12',
    endDate: '2026-10-13',
    time: '10:00 AM',
    endTime: '8:00 PM',
    venueId: 'venue-seminar-hall',
    venueName: 'Seminar Hall & Central Greens',
    registrationOpen: true,
    registrationDeadline: '2026-10-10T23:59:00',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    about: 'Two days of visionary guest lectures, startup demo day, cultural performances, and networking with top venture leaders.',
    eligibility: 'Open to all students, alumni and faculty.',
    teamSize: 'Individual',
    requirements: 'Event Pass barcode on phone.',
    rules: ['Badge must be visibly worn at all times.'],
    instructions: 'Gates open at 9:15 AM.',
    registrationsCount: 380,
    status: 'Upcoming'
  }
];

export const INITIAL_SESSIONS = [
  {
    id: 'sess-cs-1',
    eventId: 'evt-codesprint-2026',
    title: 'Opening Ceremony & Keynote',
    time: '9:00 AM – 9:30 AM',
    startTime: '09:00',
    endTime: '09:30',
    venueId: 'venue-auditorium',
    venueName: 'Main Auditorium',
    order: 1,
    description: 'Welcome speech, theme reveal, problem statements walkthrough, and judging criteria explanation.'
  },
  {
    id: 'sess-cs-2',
    eventId: 'evt-codesprint-2026',
    title: 'Idea Submission & Mentorship Sync',
    time: '9:30 AM – 10:30 AM',
    startTime: '09:30',
    endTime: '10:30',
    venueId: 'venue-block-a-lab1',
    venueName: 'Block A – Lab 1',
    order: 2,
    description: 'Teams submit their architectural blueprints and discuss technical feasibility with industry mentors.'
  },
  {
    id: 'sess-cs-3',
    eventId: 'evt-codesprint-2026',
    title: 'Coding Round & Hack Milestone 1',
    time: '10:30 AM – 1:00 PM',
    startTime: '10:30',
    endTime: '13:00',
    // Initially set to Block B - Lab 1 for live demo shift to Block B - Lab 2!
    venueId: 'venue-block-b-lab1',
    venueName: 'Block B – Lab 1',
    order: 3,
    description: 'Intense development sprint with live code check-ins and server infrastructure support.'
  },
  {
    id: 'sess-cs-4',
    eventId: 'evt-codesprint-2026',
    title: 'Evaluation & Final Pitching',
    time: '2:00 PM – 4:00 PM',
    startTime: '14:00',
    endTime: '16:00',
    venueId: 'venue-seminar-hall',
    venueName: 'Seminar Hall',
    order: 4,
    description: 'Top teams present functional demos in front of the judge panel and live audience.'
  }
];

export const INITIAL_USER = {
  id: 'usr-teju-2026',
  name: 'Teju',
  email: 'teju.k@vvi.edu.in',
  role: 'student', // 'student' or 'organizer'
  college: 'VVI University',
  studentId: 'VVI-2023-CS084',
  department: 'Computer Science & Engineering',
  year: '3rd Year',
  phone: '+91 98765 43210'
};

export const INITIAL_REGISTRATIONS = [
  {
    id: 'reg-evf-1024',
    registrationId: 'EVF-2026-1024',
    userId: 'usr-teju-2026',
    userName: 'Teju',
    userEmail: 'teju.k@vvi.edu.in',
    eventId: 'evt-codesprint-2026',
    eventName: 'CodeSprint Hackathon',
    eventDate: '3 October 2026',
    eventTime: '9:00 AM',
    venueName: 'Main Block, VVI University',
    registeredAt: '2026-09-28 14:22',
    status: 'Confirmed',
    teamName: 'NeuralByte Innovators',
    teamMembers: 'Teju, Ananya, Rohan, Karthik',
    teamSize: '4',
    technicalSkills: 'React, Node.js, Python, TensorFlow, TailwindCSS',
    branch: 'CSE',
    year: '3rd Year'
  }
];

export const INITIAL_CHECKINS = [
  {
    id: 'chk-1',
    attendeeId: 'usr-other-101',
    attendeeName: 'Aarav Mehta',
    deviceId: 'dev-iphone-101',
    eventId: 'evt-codesprint-2026',
    sessionId: 'sess-cs-3',
    venueId: 'venue-block-b-lab1',
    timestamp: '10:41 AM',
    status: 'VALID'
  },
  {
    id: 'chk-2',
    attendeeId: 'usr-other-102',
    attendeeName: 'Pooja Sharma',
    deviceId: 'dev-pixel-102',
    eventId: 'evt-codesprint-2026',
    sessionId: 'sess-cs-3',
    venueId: 'venue-block-b-lab1',
    timestamp: '10:42 AM',
    status: 'VALID'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Registration Successful',
    type: 'REGISTRATION',
    icon: '🎉',
    message: 'You are registered for CodeSprint Hackathon.',
    time: '2 hours ago',
    unread: false,
    timestamp: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'notif-2',
    title: 'Event Reminder',
    type: 'REMINDER',
    icon: '⏰',
    message: 'Your Coding Round starts in 30 minutes at Block B – Lab 1.',
    time: '35 mins ago',
    unread: true,
    timestamp: new Date(Date.now() - 2100000).toISOString()
  },
  {
    id: 'notif-3',
    title: 'Venue Nearly Full',
    type: 'CROWD_ALERT',
    icon: '⚠️',
    message: 'Block B – Lab 2 is currently at 95% capacity.',
    time: '15 mins ago',
    unread: true,
    timestamp: new Date(Date.now() - 900000).toISOString()
  }
];
