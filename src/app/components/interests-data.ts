export interface Interest {
  id: string;
  text: string;
  icon: string;
  category: string;
  scores: {
    technician: number;
    specialist: number;
    integrator: number;
  };
}

export interface InterestRound {
  id: number;
  theme: string;
  interests: Interest[];
}

export const interestRounds: InterestRound[] = [
  {
    id: 1,
    theme: "Hobbies & Activities",
    interests: [
      {
        id: "h1",
        text: "Building things with LEGO or crafts",
        icon: "Box",
        category: "hands-on",
        scores: { technician: 3, specialist: 1, integrator: 0 }
      },
      {
        id: "h2",
        text: "Playing video games",
        icon: "Gamepad2",
        category: "digital",
        scores: { technician: 1, specialist: 2, integrator: 1 }
      },
      {
        id: "h3",
        text: "Coding or making apps",
        icon: "Code",
        category: "tech",
        scores: { technician: 0, specialist: 3, integrator: 1 }
      },
      {
        id: "h4",
        text: "Planning events or activities",
        icon: "CalendarCheck",
        category: "organizing",
        scores: { technician: 0, specialist: 1, integrator: 3 }
      },
      {
        id: "h5",
        text: "Taking things apart to see how they work",
        icon: "Settings",
        category: "hands-on",
        scores: { technician: 3, specialist: 1, integrator: 0 }
      },
      {
        id: "h6",
        text: "Drawing or digital art",
        icon: "Palette",
        category: "creative",
        scores: { technician: 1, specialist: 2, integrator: 2 }
      }
    ]
  },
  {
    id: 2,
    theme: "School Subjects",
    interests: [
      {
        id: "s1",
        text: "Math class",
        icon: "Calculator",
        category: "academic",
        scores: { technician: 1, specialist: 3, integrator: 1 }
      },
      {
        id: "s2",
        text: "Science experiments",
        icon: "FlaskConical",
        category: "academic",
        scores: { technician: 2, specialist: 3, integrator: 0 }
      },
      {
        id: "s3",
        text: "Shop or hands-on classes",
        icon: "Wrench",
        category: "hands-on",
        scores: { technician: 3, specialist: 0, integrator: 0 }
      },
      {
        id: "s4",
        text: "Computer class",
        icon: "Laptop",
        category: "tech",
        scores: { technician: 1, specialist: 3, integrator: 1 }
      },
      {
        id: "s5",
        text: "Group projects",
        icon: "Users",
        category: "social",
        scores: { technician: 1, specialist: 1, integrator: 3 }
      },
      {
        id: "s6",
        text: "Art or Music",
        icon: "Music",
        category: "creative",
        scores: { technician: 1, specialist: 1, integrator: 1 }
      }
    ]
  },
  {
    id: 3,
    theme: "Ways to Solve Problems",
    interests: [
      {
        id: "p1",
        text: "Trying things hands-on until it works",
        icon: "Hammer",
        category: "hands-on",
        scores: { technician: 3, specialist: 1, integrator: 0 }
      },
      {
        id: "p2",
        text: "Researching the answer online",
        icon: "Search",
        category: "research",
        scores: { technician: 1, specialist: 3, integrator: 1 }
      },
      {
        id: "p3",
        text: "Making a plan before starting",
        icon: "ClipboardList",
        category: "planning",
        scores: { technician: 0, specialist: 1, integrator: 3 }
      },
      {
        id: "p4",
        text: "Asking for help from others",
        icon: "MessageCircle",
        category: "social",
        scores: { technician: 1, specialist: 1, integrator: 2 }
      },
      {
        id: "p5",
        text: "Testing different solutions",
        icon: "Lightbulb",
        category: "experimental",
        scores: { technician: 2, specialist: 3, integrator: 1 }
      },
      {
        id: "p6",
        text: "Breaking it down into smaller steps",
        icon: "ListChecks",
        category: "organizing",
        scores: { technician: 1, specialist: 2, integrator: 3 }
      }
    ]
  },
  {
    id: 4,
    theme: "Fun Activities",
    interests: [
      {
        id: "f1",
        text: "Building models or puzzles",
        icon: "Puzzle",
        category: "hands-on",
        scores: { technician: 3, specialist: 1, integrator: 0 }
      },
      {
        id: "f2",
        text: "Watching how-to videos on YouTube",
        icon: "Video",
        category: "learning",
        scores: { technician: 2, specialist: 2, integrator: 1 }
      },
      {
        id: "f3",
        text: "Playing strategy games",
        icon: "Map",
        category: "strategic",
        scores: { technician: 0, specialist: 2, integrator: 3 }
      },
      {
        id: "f4",
        text: "Sports or physical activities",
        icon: "Trophy",
        category: "active",
        scores: { technician: 2, specialist: 0, integrator: 1 }
      },
      {
        id: "f5",
        text: "Reading books or comics",
        icon: "BookOpen",
        category: "learning",
        scores: { technician: 0, specialist: 2, integrator: 2 }
      },
      {
        id: "f6",
        text: "Leading a team or club",
        icon: "Flag",
        category: "leadership",
        scores: { technician: 0, specialist: 1, integrator: 3 }
      }
    ]
  }
];

export interface CareerResult {
  type: 'technician' | 'specialist' | 'integrator';
  title: string;
  roboTI: string;
  description: string;
  traits: string[];
  color: string;
  skills: string[];
  careers: string[];
  careerPath: string;
}

export const careerResults: Record<string, CareerResult> = {
  technician: {
    type: 'technician',
    title: 'Robotics Technician',
    roboTI: 'BUILDER',
    description: "Based on your hands-on style and love of building things, you'd be perfect as a Robotics Technician! You're someone who learns by doing and loves working with real equipment. Technicians install, maintain, and repair the robots that build everything from cars to smartphones.",
    traits: [
      "Great with your hands",
      "Detail-oriented and careful",
      "Love fixing and building things",
      "Prefer to jump in and learn by doing"
    ],
    color: "#f7931e",
    skills: [
      "Maintenance & Troubleshooting",
      "Electrical Systems",
      "PLC (Programmable Logic Controllers)",
      "Electronics & Controls",
      "Robot Programming",
      "Mechanical Systems"
    ],
    careers: [
      "Maintenance & Troubleshooting",
      "Electrical Systems",
      "PLC (Programmable Logic Controllers)",
      "Electronics & Controls",
      "Robot Programming",
      "Mechanical Systems",
      "Fluid Power",
      "Safety (systems and Procedures)"
    ],
    careerPath: "You might start as an apprentice or with a technical certificate, learning on the job. Many technicians work their way up to senior technician or shift supervisor roles!"
  },
  specialist: {
    type: 'specialist',
    title: 'Robotics Specialist',
    roboTI: 'INNOVATOR',
    description: "Your love of puzzles, tech, and figuring out how things work makes you a perfect fit for a Robotics Specialist! If you enjoy math, science, and solving problems, you'll love programming robots and designing automated systems that make manufacturing faster and smarter.",
    traits: [
      "Love coding and technology",
      "Enjoy solving complex problems",
      "Curious about how things work",
      "Like to research and learn new things"
    ],
    color: "#3498db",
    skills: [
      "Inspection/QA",
      "Sensors",
      "Advanced Robot Programming",
      "Installation Concepts",
      "Application Emphasis",
      "Safety-Risk Assessment"
    ],
    careers: [
      "Inspection/QA",
      "Sensors",
      "Advanced Robot Programming",
      "Installation Concepts",
      "Application Emphasis",
      "Safety-Risk Assessment",
      "Vision",
      "Project Management",
      "Robot and System Troubleshooting"
    ],
    careerPath: "You might pursue a degree in engineering, computer science, or robotics. Specialists often become senior engineers, team leads, or research and development experts!"
  },
  integrator: {
    type: 'integrator',
    title: 'Robotics Integrator',
    roboTI: 'ARCHITECT',
    description: "You're a natural planner and organizer who sees the big picture - perfect for a Robotics Integrator! If you like coordinating projects and understanding how all the pieces fit together, you'll love designing robotic systems that transform entire factories and manufacturing plants.",
    traits: [
      "Great at planning and organizing",
      "See how everything connects",
      "Enjoy leading and coordinating",
      "Think strategically about problems"
    ],
    color: "#dc2626",
    skills: [
      "System and Process Design",
      "Augmented Reality/Virtual Reality",
      "Visualization",
      "Big Data",
      "Systems Simulation/Modeling",
      "Simulation"
    ],
    careers: [
      "System and Process Design",
      "Augmented Reality/Virtual Reality",
      "Visualization",
      "Big Data",
      "Systems Simulation/Modeling",
      "Simulation",
      "Offline Programming",
      "Interoperability",
      "Computer Programming"
    ],
    careerPath: "You might study engineering or project management and work your way up from specialist roles. Integrators often become project managers, system architects, or start their own robotics companies!"
  }
};
