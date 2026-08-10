import { ProcessedLesson } from "../types";

export const INITIAL_PROCESSED_LESSON: ProcessedLesson = {
  lessonTitle: "Rocket Science & Newton's 3rd Law",
  duration: "45-60 minutes",
  summary: "An interactive, high-energy exploration of aerospace propulsion. Students will discover how objects move in space and build their own balloon-propelled rockets to test the physics of thrust!",
  keyTakeaways: [
    "Forces always come in matched pairs: Action and Reaction.",
    "Rockets move forward by pushing fuel out backward—not by pushing against the air.",
    "Triangles and streamlined shapes maximize speed and reduce atmospheric drag.",
    "Robert Goddard proved that physics works perfectly in the airless vacuum of space."
  ],
  slides: [
    {
      title: "How Do Rockets Fly?",
      content: [
        "Rockets carry their own fuel and oxygen inside combustion chambers.",
        "Burning fuel creates high-pressure gas that rushes out of the nozzle backwards.",
        "The rushing gas pushes the rocket body forward in the opposite direction!"
      ],
      visualConcept: "A detailed cutaway diagram of a chemical rocket engine. Large arrows show fuel and oxidizer mixing in the combustion chamber, igniting, and rushing out of the flared nozzle (colored in hot orange/red) creating a massive green thrust arrow pointing upward.",
      instructorNotes: "Start with a playful question: 'If there's no air in space to push against, how does a rocket steer?' Wait for answers, then blow up a balloon and let it go to show them the answer!"
    },
    {
      title: "Newton's Third Law of Motion",
      content: [
        "For every Action, there is an equal and opposite Reaction.",
        "Action: Rocket nozzle ejects exhaust gases downward.",
        "Reaction: Rocket body gets pushed upward with equal force (thrust)."
      ],
      visualConcept: "An animated split-screen: On the left, a foot pushing backward on a skateboard, making the skateboard go forward. On the right, a giant Saturn V rocket lifting off, with huge fire arrows pointing down labeled 'Action' and a giant rocket arrow pointing up labeled 'Reaction'.",
      instructorNotes: "Ask two students to stand on wheeled chairs or skateboards (safely) and push against each other's hands. What happens? Both roll backward! This is Action-Reaction."
    },
    {
      title: "The Genius of Robert Goddard",
      content: [
        "In 1920, newspapers mocked Robert Goddard, saying rockets couldn't fly in space because there is no air.",
        "He proved that rockets actually fly BETTER in space!",
        "Why? Because there is zero air resistance (drag) to slow them down."
      ],
      visualConcept: "A split space diagram. One side has a rocket in dense blue atmosphere with friction waves. The other side has a rocket in deep black outer space, moving completely smoothly with zero friction waves, surrounded by glowing stars.",
      instructorNotes: "Highlight that sometimes people will tell you your ideas are impossible. Robert Goddard ignored the critics and built the first liquid-fueled rocket anyway!"
    },
    {
      title: "Friction & Streamlining",
      content: [
        "Air looks empty, but it's full of gas molecules that collide with moving objects.",
        "We call this air resistance or atmospheric drag.",
        "Streamlined shapes (pointed cones, thin fins) slice through air molecules easily."
      ],
      visualConcept: "Comparison graphic. Shape A: A flat-nosed cardboard box pushing through air with chaotic red turbulence lines piling up in front of it. Shape B: A pointed needle-nosed rocket with smooth blue air flowlines wrapping perfectly around its fins.",
      instructorNotes: "Have students rub their hands together as fast as they can. Do they feel warmth? That is friction! Rockets feel air friction too, which is why they must be sharp and smooth."
    }
  ],
  handsOnActivity: {
    title: "The Great Balloon Rocket Race",
    materials: [
      "12-inch latex balloons (high stretch)",
      "15-foot nylon fishing line (the track)",
      "Standard plastic drinking straw",
      "Cellulose tape (Scotch tape)",
      "Metal binder clips or clothespins",
      "Measuring tape or ruler"
    ],
    steps: [
      "Secure one end of the nylon fishing line to a heavy chair or door handle.",
      "Thread the plastic straw onto the line, then pull the line tight and tie the other end across the room.",
      "Blow up your balloon completely, but DO NOT tie it. Clamp the nozzle shut with a binder clip.",
      "Tape the inflated balloon securely to the straw using 3 pieces of tape, making sure the balloon points straight.",
      "Slide the straw-balloon assembly back to the starting line.",
      "Unclamp the binder clip and watch your rocket fly! Measure and record the distance traveled."
    ],
    scientificPrinciple: "When you release the clip, the stretched latex squeezes the air out of the nozzle (Action). The escaping air pushes forward against the inside of the balloon, launching the balloon-straw car along the fishing line in the opposite direction (Reaction)!",
    finishedProductSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 420" width="100%" height="100%" style="background:#0f172a; border-radius:16px;">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="balloonGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="50%" stop-color="#fb7185" />
      <stop offset="100%" stop-color="#e11d48" />
    </linearGradient>
    <linearGradient id="thrustGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ef4444" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#f97316" stop-opacity="0.8" />
      <stop offset="80%" stop-color="#facc15" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#facc15" stop-opacity="0" />
    </linearGradient>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
    </pattern>
  </defs>

  <rect width="700" height="420" fill="url(#bgGrad)" rx="16" />
  <rect width="700" height="420" fill="url(#grid)" rx="16" />

  <rect x="25" y="20" width="260" height="28" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
  <text x="35" y="38" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold">FINISHED ASSEMBLY BLUEPRINT</text>

  <text x="25" y="72" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="800">BALLOON ROCKET CAR ASSEMBLY</text>
  <text x="25" y="92" fill="#94a3b8" font-family="sans-serif" font-size="12">Newton's Third Law Propulsion Demo</text>

  <line x1="50" y1="230" x2="650" y2="230" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6,4" />
  <circle cx="50" cy="230" r="6" fill="#0284c7" />
  <text x="30" y="260" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">Start Anchor</text>
  <circle cx="650" cy="230" r="6" fill="#0284c7" />
  <text x="610" y="260" fill="#94a3b8" font-family="sans-serif" font-size="10" font-weight="bold">Target Wall</text>

  <rect x="280" y="222" width="140" height="16" rx="4" fill="#0ea5e9" stroke="#bae6fd" stroke-width="1.5" />

  <rect x="300" y="208" width="18" height="42" rx="2" fill="#fef08a" opacity="0.8" stroke="#ca8a04" stroke-width="1" />
  <rect x="340" y="208" width="18" height="42" rx="2" fill="#fef08a" opacity="0.8" stroke="#ca8a04" stroke-width="1" />
  <rect x="380" y="208" width="18" height="42" rx="2" fill="#fef08a" opacity="0.8" stroke="#ca8a04" stroke-width="1" />

  <ellipse cx="350" cy="170" rx="100" ry="45" fill="url(#balloonGrad)" stroke="#fda4af" stroke-width="2" />
  <path d="M 250 170 L 230 162 L 225 178 L 250 170 Z" fill="#e11d48" stroke="#fda4af" stroke-width="1" />
  
  <polygon points="220,170 120,130 120,210" fill="url(#thrustGrad)" />
  <path d="M 210 170 L 140 170" stroke="#fef08a" stroke-width="3" stroke-dasharray="4,4" />
  <text x="110" y="155" fill="#f87171" font-family="sans-serif" font-size="12" font-weight="bold">ACTION: Air Exhaust</text>

  <path d="M 470 170 L 570 170" stroke="#4ade80" stroke-width="5" />
  <polygon points="570,170 550,160 550,180" fill="#4ade80" />
  <text x="475" y="155" fill="#4ade80" font-family="sans-serif" font-size="12" font-weight="bold">REACTION: Forward Flight</text>

  <line x1="350" y1="238" x2="350" y2="300" stroke="#94a3b8" stroke-width="1.5" />
  <circle cx="350" cy="300" r="3" fill="#38bdf8" />
  <rect x="280" y="305" width="140" height="30" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1" />
  <text x="350" y="324" fill="#38bdf8" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Plastic Straw Guide</text>

  <line x1="350" y1="125" x2="350" y2="50" stroke="#94a3b8" stroke-width="1.5" />
  <circle cx="350" cy="50" r="3" fill="#fb7185" />
  <rect x="270" y="25" width="160" height="30" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1" />
  <text x="350" y="44" fill="#fb7185" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">12" Inflated Balloon</text>

  <text x="350" y="380" fill="#94a3b8" font-family="monospace" font-size="11" text-anchor="middle">15-Foot Taut Nylon Track</text>
</svg>`
  },
  worksheet: {
    title: "Balloon Rocket Physics Lab Guide",
    instructions: "Complete this worksheet as you run your Balloon Rocket experiment. Observe carefully!",
    questions: [
      {
        id: "Q1",
        questionText: "According to Newton's Third Law, if the 'Action' is air rushing out of the balloon nozzle to the LEFT, what is the 'Reaction'?",
        answerType: "Short Answer",
        sampleAnswer: "The reaction is the balloon rocket moving to the RIGHT with equal force."
      },
      {
        id: "Q2",
        questionText: "How does the size of the balloon (amount of air) affect the distance it travels? Select your hypothesis:",
        answerType: "Multiple Choice",
        options: [
          "More air = More thrust = Travels further",
          "Less air = Lighter weight = Travels further",
          "Air volume has absolutely no effect on distance"
        ],
        sampleAnswer: "More air = More thrust = Travels further (because more mass is ejected, creating more momentum)."
      },
      {
        id: "Q3",
        questionText: "If we added a heavy weight (like a metal paperclip) to our balloon rocket, would it travel faster or slower? Why?",
        answerType: "Short Answer",
        sampleAnswer: "It would travel slower because more mass requires more force to accelerate (Newton's Second Law: F=ma)."
      }
    ]
  },
  quiz: [
    {
      question: "What is Newton's Third Law of Motion?",
      options: [
        "Gravity pulls everything down at the exact same rate.",
        "For every action, there is an equal and opposite reaction.",
        "Objects in motion will stay in motion forever.",
        "Force is equal to mass multiplied by acceleration."
      ],
      correctAnswerIndex: 1,
      explanation: "Newton's Third Law states that forces always exist in matched action-reaction pairs!"
    },
    {
      question: "In a real chemical rocket, what is the 'Action'?",
      options: [
        "The astronauts waving goodbye.",
        "The computer calculating the trajectory.",
        "High-pressure exhaust gas rushing out of the nozzle backward.",
        "The sound of the engines roaring."
      ],
      correctAnswerIndex: 2,
      explanation: "Ejecting high-pressure exhaust gas at extreme speed is the ACTION that pushes the rocket forward!"
    },
    {
      question: "Why do rockets fly BETTER in the vacuum of space than in air?",
      options: [
        "Because there is no gravity in space.",
        "Because there is no air resistance (friction) to slow them down.",
        "Because space is much colder and cools the engines.",
        "Because rocket fuel burns faster in space."
      ],
      correctAnswerIndex: 1,
      explanation: "Air creates atmospheric drag (friction). Space is a vacuum, meaning there are no air molecules to crash into, allowing rockets to glide effortlessly!"
    },
    {
      question: "Who was mocked in 1920 for proposing that rockets could fly in a vacuum?",
      options: [
        "Isaac Newton",
        "Albert Einstein",
        "Robert Goddard",
        "Elon Musk"
      ],
      correctAnswerIndex: 2,
      explanation: "The New York Times mocked Robert Goddard in an editorial, which they famously retracted in 1969 when Apollo 11 landed on the moon!"
    }
  ],
  mediaRecommendations: [
    {
      resourceType: "Video Demonstration",
      suggestedSearchQuery: "Apollo 11 Saturn V Launch Ultra HD slow motion",
      whyItHelps: "Shows beautiful slow-motion visual of Newton's 3rd law in action, capturing the extreme velocity of fire rushing down while the massive rocket lifts up."
    },
    {
      resourceType: "Interactive Web App",
      suggestedSearchQuery: "PhET Balloon Rocket Simulation physics html5",
      whyItHelps: "A high-quality interactive virtual simulation that allows kids to change rocket mass, thrust, and angle on a digital smart-board if physical materials are limited."
    }
  ],
  gamifiedVideoPackage: {
    gamificationBreakdown: {
      targetConcept: "Rocket Science & Newton's 3rd Law (Thrust & Momentum)",
      gamingPopCultureHook: "Kerbal Space Program & Fortnite Launch Pad Mechanics",
      theAnalogy: "Just like crouching and jumping on a Fortnite Launch Pad exerts force downward to catapult your avatar skyward, a rocket expels superheated exhaust gas downward to propel the heavy hull upward into orbit!",
      groundingSources: [
        { title: "Kerbal Space Program Propulsion Physics Guide", uri: "https://www.kerbalspaceprogram.com" },
        { title: "Fortnite Launch Pad Velocity & Physics Mechanics", uri: "https://www.epicgames.com/fortnite" }
      ]
    },
    cutsceneConcept: {
      title: "Operation Orbital Escape: The Thruster Crisis",
      duration: "75s",
      settingAndLore: "Deep space orbit surrounding Sector-7. Captain Nova's exploration vessel is stuck in a gravitational orbit trap with zero fuel remaining except for auxiliary plasma canisters.",
      characters: [
        "CAPTAIN NOVA: Ace space explorer and tactical engineer.",
        "A.I. ZAX: The ship's witty holographic flight computer."
      ],
      script: [
        { visual: "[VISUAL] Dramatic 3D camera pan around a sleek titanium starship trapped near a glowing purple singularity. Red warning lights flash on the cockpit HUD overlay.", character: "A.I. ZAX", dialogue: "Warning Captain! Gravitational pull increasing by 14% per second! Auxiliary engines offline." },
        { visual: "[VISUAL] Close-up on Captain Nova pulling a glowing blue plasma canisters lever. Quick-Time Event (QTE) prompt appears on HUD: 'PRESS [SPACEBAR] TO EJECT PLASMA'.", character: "CAPTAIN NOVA", dialogue: "Zax, remember Newton's Third Law! We don't need air to push against—we just need MASS to throw backward!" },
        { visual: "[VISUAL] Nova slams the button. The rear ventral exhaust ports blast a massive beam of hyper-dense plasma particles backward into the void.", character: "A.I. ZAX", dialogue: "Action force verified! 50,000 Newtons of rear thrust generated!" },
        { visual: "[VISUAL] High-speed camera angle tracks the starship breaking free of the gravity trap, shooting forward into hyper-drive with glowing thruster trails.", character: "CAPTAIN NOVA", dialogue: "Equal and opposite reaction, baby! See you in orbit!" }
      ],
      takeaway: "Demonstrates that rockets fly in the vacuum of space by expelling mass (plasma/exhaust) backward, generating forward thrust without needing air to push against.",
      visualPromptForVeo: "Cinematic sci-fi 3D game cutscene. A sleek silver spaceship trapped near a glowing purple nebula ejects a sudden burst of blue plasma thrusters from the rear, shooting forward through space. Unreal Engine 5 render style, dramatic lighting, 16:9 aspect ratio."
    },
    cartoonConcept: {
      title: "Professor Pip & The Skateboard Cannon Catastrophe",
      duration: "70s",
      scenario: "A brightly colored cartoon science laboratory equipped with oversized treadmills, giant rubber bands, and an indoor skate park.",
      characters: [
        "PROFESSOR PIP: Energetic eccentric scientist with wild blue hair.",
        "SQUEAKS: Pip's sassy hamster assistant wearing safety goggles."
      ],
      script: [
        { visual: "[VISUAL] Bright 2D cartoon animation. Professor Pip stands on a skateboard holding a massive watermelon cannon labeled 'NO EXCUSES 9000'.", character: "PROFESSOR PIP", dialogue: "Behold Squeaks! I will prove Newton's 3rd Law using pure fruit propulsion!" },
        { visual: "[VISUAL] Squeaks covers his eyes with his tiny hamster paws and holds up a sign reading 'INCOMING DAMAGE'.", character: "SQUEAKS", dialogue: "(Squeaks nervously points at Pip's feet on the skateboard wheels)" },
        { visual: "[VISUAL] PIP pulls the trigger. BOOM! The cannon fires a giant watermelon to the LEFT. With cartoon slapstick physics, Pip and his skateboard shoot backwards to the RIGHT at top speed, crashing into a stack of cardboard boxes.", character: "PROFESSOR PIP", dialogue: "Woooahhh! The watermelon went LEFT, so I went RIGHT with equal force! Newton was right!" },
        { visual: "[VISUAL] Pip pops out of the cardboard box with a slice of watermelon on his head and gives a thumbs-up as cartoon stars spin around him.", character: "PROFESSOR PIP", dialogue: "For every action, there's an equal and opposite reaction! Plus, free snack!" }
      ],
      takeaway: "Uses slapstick cartoon recoil physics to make Newton's Third Law memorable and intuitive.",
      visualPromptForVeo: "Fun whimsical 2D cartoon animation. An eccentric scientist on a skateboard fires a giant watermelon cannon to the left, causing the scientist and skateboard to zoom rapidly backward to the right in slapstick fashion. Bright friendly colors, 16:9 aspect ratio."
    }
  }
};
