const projects = [
    {
      id: 0, index: '01',
      title: "ALIEN OUTPOST", genre: "SCI-FI",
      tagline: "Fight for Mars in an alien invasion scenario.",
      engine: "Unity", year: "2023", role: "Solo Dev", status: "SHIPPED",
      duration: "6 WEEKS", tech: ["Unity", "C#", "Blender"],
      description: "An action-adventure game set in an alien invasion scenario. Aliens have invaded Earth, and you must fight for Mars. Features custom enemy AI and wave-based combat.",
      palette: ["#2a1a0a","#5c3010","#c86020","#ff8c42"],
      demoLink: "https://sudpy-dev.itch.io/alien-outpost", sourceLink: null
    },
    {
      id: 1, index: '02',
      title: "YEAR 3000", genre: "PLATFORMER",
      tagline: "A platformer set in the far future.",
      engine: "Unity", year: "2023", role: "Solo Dev", status: "SHIPPED",
      duration: "4 WEEKS", tech: ["Unity", "C#", "FMOD"],
      description: "Face challenges and retrieve the lost object in a futuristic world. Navigate difficult terrain to uncover the truth using advanced movement mechanics.",
      palette: ["#0d1f3c","#1a3a6b","#0a4fa8","#00d4ff"],
      demoLink: "https://sudpy-dev.itch.io/three-thousand-years", sourceLink: null
    },
    {
      id: 2, index: '03',
      title: "HEALTH++", genre: "ACTION",
      tagline: "Defeat enemies before time runs out.",
      engine: "Unity", year: "2024", role: "Solo Dev", status: "SHIPPED",
      duration: "8 WEEKS", tech: ["Unity", "C#", "Android"],
      description: "A fast-paced clicker game where you battle enemies to reach 100 health and win. Highly optimized for Browser and Android with juicy feedback.",
      palette: ["#0a2010","#1a4a20","#2d7a3a","#39ff6e"],
      demoLink: "https://sudpy-dev.itch.io/health-plus-clicker-game", sourceLink: null
    },
    {
      id: 3, index: '04',
      title: "THEY ARE COMING", genre: "SURVIVAL",
      tagline: "Unreal Engine 5 survival horror action.",
      engine: "Unreal 5", year: "2025", role: "Solo Dev", status: "WIP",
      duration: "ONGOING", tech: ["Unreal 5", "Blueprints", "Lumen"],
      description: "A survival game built in Unreal Engine 5. Face the incoming horde and fight to survive. Environment-focused narrative piece exploring Lumen GI.",
      palette: ["#1a0a2e","#3d1a6b","#7c3fcf","#b060ff"],
      demoLink: null, sourceLink: "https://github.com/SPY-Github22/UE5-Game---They-are-coming"
    }
  ];

const milestones = [
    { year: "2022", text: "Started Game Dev", type: "milestone" },
    { type: "project", id: 0 },
    { year: "2023", text: "First Unity Project", type: "milestone" },
    { type: "project", id: 1 },
    { type: "project", id: 2 },
    { year: "2024", text: "Explored Unreal Engine 5", type: "milestone" },
    { type: "project", id: 3 }
  ];
