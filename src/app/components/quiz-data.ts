export interface QuizQuestion {
  id: number;
  question: string;
  category: 'skills' | 'interests' | 'workstyle';
  interactionType: 'drag' | 'emoji' | 'flip' | 'battle' | 'standard';
  options: QuizOption[];
}

export interface QuizOption {
  text: string;
  icon: string;
  scores: {
    technician: number;
    specialist: number;
    integrator: number;
  };
}

export interface CareerResult {
  type: 'technician' | 'specialist' | 'integrator';
  title: string;
  roboTI: string;
  description: string;
  traits: string[];
  color: string;
  skills: string[];
  careerPath: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "How do you like to spend your free time?",
    category: 'interests',
    interactionType: 'drag',
    options: [
      {
        text: "Building things, crafting, or working on DIY projects",
        icon: "Hammer",
        scores: { technician: 3, specialist: 1, integrator: 0 }
      },
      {
        text: "Playing with apps, coding, or exploring new tech",
        icon: "Smartphone",
        scores: { technician: 1, specialist: 3, integrator: 1 }
      },
      {
        text: "Planning events, organizing activities, or leading groups",
        icon: "CalendarCheck",
        scores: { technician: 0, specialist: 1, integrator: 3 }
      },
      {
        text: "Creating art, making videos, or designing things",
        icon: "Palette",
        scores: { technician: 1, specialist: 2, integrator: 2 }
      }
    ]
  },
  {
    id: 2,
    question: "What type of challenges do you enjoy most?",
    category: 'skills',
    interactionType: 'battle',
    options: [
      {
        text: "Figuring out how to fix or improve physical objects",
        icon: "Wrench",
        scores: { technician: 3, specialist: 1, integrator: 0 }
      },
      {
        text: "Solving logic puzzles or brain teasers",
        icon: "Brain",
        scores: { technician: 0, specialist: 3, integrator: 1 }
      },
      {
        text: "Organizing complex projects with lots of moving parts",
        icon: "Network",
        scores: { technician: 0, specialist: 1, integrator: 3 }
      },
      {
        text: "Coming up with creative solutions to everyday problems",
        icon: "Lightbulb",
        scores: { technician: 1, specialist: 2, integrator: 2 }
      }
    ]
  },
  {
    id: 3,
    question: "In a group project, you usually...",
    category: 'workstyle',
    interactionType: 'flip',
    options: [
      {
        text: "Volunteer to build, assemble, or make the physical parts",
        icon: "Box",
        scores: { technician: 3, specialist: 0, integrator: 0 }
      },
      {
        text: "Do the research and figure out the best way to do things",
        icon: "Search",
        scores: { technician: 0, specialist: 3, integrator: 1 }
      },
      {
        text: "Create the timeline, assign tasks, and keep everyone on track",
        icon: "ClipboardList",
        scores: { technician: 0, specialist: 1, integrator: 3 }
      },
      {
        text: "Help teammates communicate and work well together",
        icon: "Users",
        scores: { technician: 1, specialist: 1, integrator: 2 }
      }
    ]
  },
  {
    id: 4,
    question: "What kind of video games do you like?",
    category: 'interests',
    interactionType: 'standard',
    options: [
      {
        text: "Sandbox games where I can build and create (Minecraft, Roblox)",
        icon: "Box",
        scores: { technician: 3, specialist: 1, integrator: 1 }
      },
      {
        text: "Puzzle games that make me think (Portal, Monument Valley)",
        icon: "Puzzle",
        scores: { technician: 1, specialist: 3, integrator: 1 }
      },
      {
        text: "Strategy games where I plan and manage (Clash of Clans, SimCity)",
        icon: "Map",
        scores: { technician: 0, specialist: 1, integrator: 3 }
      },
      {
        text: "Action or sports games (FIFA, NBA 2K, Fortnite)",
        icon: "Gamepad2",
        scores: { technician: 1, specialist: 0, integrator: 1 }
      }
    ]
  },
  {
    id: 5,
    question: "When something breaks at home, you...",
    category: 'skills',
    interactionType: 'emoji',
    options: [
      {
        text: "Get excited to take it apart and see how it works",
        icon: "Settings",
        scores: { technician: 3, specialist: 1, integrator: 0 }
      },
      {
        text: "Search YouTube or Google for tutorials on how to fix it",
        icon: "Video",
        scores: { technician: 1, specialist: 3, integrator: 1 }
      },
      {
        text: "Think about why it broke and what we can do differently",
        icon: "MessageSquare",
        scores: { technician: 0, specialist: 2, integrator: 3 }
      },
      {
        text: "Usually not interested - rather do something else",
        icon: "CircleHelp",
        scores: { technician: 0, specialist: 0, integrator: 1 }
      }
    ]
  },
  {
    id: 6,
    question: "What subject do you enjoy most in school?",
    category: 'interests',
    interactionType: 'battle',
    options: [
      {
        text: "Hands-on classes like shop, art, music, or PE",
        icon: "Pencil",
        scores: { technician: 3, specialist: 0, integrator: 0 }
      },
      {
        text: "Math, Science, or Computer classes",
        icon: "Calculator",
        scores: { technician: 1, specialist: 3, integrator: 1 }
      },
      {
        text: "English, History, or Social Studies",
        icon: "BookOpen",
        scores: { technician: 0, specialist: 1, integrator: 2 }
      },
      {
        text: "Electives where I can explore different interests",
        icon: "Sparkles",
        scores: { technician: 1, specialist: 1, integrator: 2 }
      }
    ]
  },
  {
    id: 7,
    question: "Which activity sounds most appealing to you?",
    category: 'workstyle',
    interactionType: 'drag',
    options: [
      {
        text: "Taking apart old electronics or machines to see inside",
        icon: "Cpu",
        scores: { technician: 3, specialist: 1, integrator: 0 }
      },
      {
        text: "Learning a new programming language or app",
        icon: "Code",
        scores: { technician: 0, specialist: 3, integrator: 0 }
      },
      {
        text: "Planning a fundraiser or school event from start to finish",
        icon: "ClipboardCheck",
        scores: { technician: 0, specialist: 1, integrator: 3 }
      },
      {
        text: "Starting a club or team around something I care about",
        icon: "Flag",
        scores: { technician: 1, specialist: 1, integrator: 2 }
      }
    ]
  },
  {
    id: 8,
    question: "When learning something new, you prefer to...",
    category: 'skills',
    interactionType: 'flip',
    options: [
      {
        text: "Jump right in and figure it out as I go",
        icon: "Zap",
        scores: { technician: 3, specialist: 1, integrator: 0 }
      },
      {
        text: "Read instructions or watch tutorials first",
        icon: "GraduationCap",
        scores: { technician: 1, specialist: 3, integrator: 1 }
      },
      {
        text: "Understand why it matters before learning the details",
        icon: "Eye",
        scores: { technician: 0, specialist: 1, integrator: 3 }
      },
      {
        text: "Learn alongside friends or classmates",
        icon: "UserPlus",
        scores: { technician: 1, specialist: 1, integrator: 2 }
      }
    ]
  }
];

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
    color: "#06ffa5",
    skills: [
      "Mechanical repair",
      "Troubleshooting",
      "Equipment maintenance",
      "Safety procedures",
      "Tool operation"
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
    color: "#00d9ff",
    skills: [
      "Programming robots",
      "System design",
      "Software testing",
      "Data analysis",
      "Technical troubleshooting"
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
    color: "#ff006e",
    skills: [
      "Project management",
      "System integration",
      "Problem-solving",
      "Team coordination",
      "Technical planning"
    ],
    careerPath: "You might study engineering or project management and work your way up from specialist roles. Integrators often become project managers, system architects, or start their own robotics companies!"
  }
};
