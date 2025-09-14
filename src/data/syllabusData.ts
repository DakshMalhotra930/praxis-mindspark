// Complete JEE Syllabus data
export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  subtopics: string[];
}

export const completeJeeSyllabus: Subject[] = [
  {
    id: 'physics',
    name: 'Physics',
    chapters: [
      {
        id: 'gravitation',
        name: 'Gravitation',
        topics: [
          {
            id: 'gravitation-basics',
            name: 'Newton\'s Law of Gravitation',
            subtopics: [
              'Newton\'s Law of Gravitation',
              'Gravitational Field and Potential',
              'Acceleration due to Gravity',
              'Escape Velocity and Orbital Velocity',
              'Motion of Satellites',
              'Kepler\'s Laws'
            ]
          }
        ]
      },
      {
        id: 'kinetic-theory',
        name: 'Kinetic Theory',
        topics: [
          {
            id: 'kinetic-theory-basics',
            name: 'Kinetic Theory of Gases',
            subtopics: [
              'Ideal Gas Laws',
              'Kinetic Theory of Gases',
              'Mean Free Path and Pressure',
              'Degrees of Freedom, Equipartition Principle',
              'Maxwell-Boltzmann Distribution'
            ]
          }
        ]
      },
      {
        id: 'laws-of-motion',
        name: 'Laws Of Motion',
        topics: [
          {
            id: 'laws-of-motion-basics',
            name: 'Newton\'s Laws and Forces',
            subtopics: [
              'Inertia and Newton\'s Laws',
              'Force and Types of Forces',
              'Friction (Static, Kinetic, Rolling)',
              'Circular Motion',
              'Dynamics of Connected Bodies (Pulley, String)'
            ]
          }
        ]
      },
      {
        id: 'mechanical-properties-fluids',
        name: 'Mechanical Properties Of Fluids',
        topics: [
          {
            id: 'fluids-basics',
            name: 'Fluid Mechanics',
            subtopics: [
              'Pressure, Pascal\'s Law',
              'Buoyancy and Archimedes\' Principle',
              'Viscosity (Poiseuille\'s Law)',
              'Surface Tension (Capillarity)',
              'Flow of Fluids (Equation of Continuity, Bernoulli\'s Principle)'
            ]
          }
        ]
      },
      {
        id: 'mechanical-properties-solids',
        name: 'Mechanical Properties Of Solids',
        topics: [
          {
            id: 'solids-basics',
            name: 'Solid Mechanics',
            subtopics: [
              'Stress and Strain',
              'Hooke\'s Law',
              'Young\'s Modulus, Bulk Modulus, Shear Modulus',
              'Elastic and Plastic Deformation',
              'Energy Stored in a Stretched Wire'
            ]
          }
        ]
      },
      {
        id: 'motion-in-plane',
        name: 'Motion In A Plane',
        topics: [
          {
            id: 'plane-motion-basics',
            name: 'Two-Dimensional Motion',
            subtopics: [
              'Projectile Motion',
              'Uniform Circular Motion',
              'Relative Motion'
            ]
          }
        ]
      },
      {
        id: 'motion-straight-line',
        name: 'Motion In A Straight Line',
        topics: [
          {
            id: 'straight-line-motion',
            name: 'One-Dimensional Motion',
            subtopics: [
              'Displacement, Velocity, Acceleration',
              'Graphical Analysis (x-t, v-t, a-t)',
              'Equations of Motion'
            ]
          }
        ]
      },
      {
        id: 'oscillations',
        name: 'Oscillations',
        topics: [
          {
            id: 'oscillations-basics',
            name: 'Simple Harmonic Motion',
            subtopics: [
              'Simple Harmonic Motion (SHM) theory',
              'Damped, Forced, Resonance',
              'Energy in SHM',
              'LC and LCR Oscillations'
            ]
          }
        ]
      },
      {
        id: 'system-particles-rotational',
        name: 'System Of Particles And Rotational Motion',
        topics: [
          {
            id: 'rotational-motion',
            name: 'Rotational Dynamics',
            subtopics: [
              'Centre of Mass',
              'Linear Momentum and Collisions',
              'Rotational Kinematics & Dynamics',
              'Torque, Angular Momentum',
              'Moment of Inertia, Parallel/Perpendicular Axis Theorem'
            ]
          }
        ]
      },
      {
        id: 'thermal-properties',
        name: 'Thermal Properties Of Matter',
        topics: [
          {
            id: 'thermal-basics',
            name: 'Heat and Temperature',
            subtopics: [
              'Heat, Temperature, Calorimetry',
              'Thermal Expansion',
              'Specific Heat Capacity, Latent Heat',
              'Transfer of Heat (Conduction, Convection, Radiation)'
            ]
          }
        ]
      },
      {
        id: 'units-measurements',
        name: 'Units And Measurements',
        topics: [
          {
            id: 'units-basics',
            name: 'Measurement and Units',
            subtopics: [
              'Fundamental and Derived Units',
              'Dimensional Analysis',
              'Error Analysis'
            ]
          }
        ]
      },
      {
        id: 'waves',
        name: 'Waves',
        topics: [
          {
            id: 'waves-basics',
            name: 'Wave Motion',
            subtopics: [
              'Wave Motion (Progressive, Standing Waves)',
              'Superposition Principle',
              'Beats, Doppler Effect',
              'Sound Waves (Properties, Equations)'
            ]
          }
        ]
      },
      {
        id: 'work-energy-power',
        name: 'Work Energy Power',
        topics: [
          {
            id: 'energy-basics',
            name: 'Energy and Power',
            subtopics: [
              'Work Done by Constant/Variable Force',
              'Energy (Kinetic, Potential)',
              'Conservation of Energy',
              'Collision (Elastic and Inelastic)',
              'Power (Instantaneous and Average)'
            ]
          }
        ]
      },
      {
        id: 'alternating-current',
        name: 'Alternating Current',
        topics: [
          {
            id: 'ac-basics',
            name: 'AC Circuits',
            subtopics: [
              'AC Generation',
              'RMS and Average Values',
              'Phasor Diagrams',
              'LCR Circuit',
              'Resonance and Power Factor'
            ]
          }
        ]
      },
      {
        id: 'atoms',
        name: 'Atoms',
        topics: [
          {
            id: 'atoms-basics',
            name: 'Atomic Structure',
            subtopics: [
              'Rutherford and Bohr Models',
              'Energy Levels, Spectra',
              'Hydrogen Atom Calculations'
            ]
          }
        ]
      },
      {
        id: 'current-electricity',
        name: 'Current Electricity',
        topics: [
          {
            id: 'current-basics',
            name: 'Electric Current',
            subtopics: [
              'Ohm\'s Law, Kirchhoff\'s Laws',
              'EMF and Internal Resistance',
              'Series and Parallel Circuits',
              'Wheatstone Bridge, Potentiometer'
            ]
          }
        ]
      },
      {
        id: 'dual-nature-radiation',
        name: 'Dual Nature Of Radiation And Matter',
        topics: [
          {
            id: 'dual-nature-basics',
            name: 'Wave-Particle Duality',
            subtopics: [
              'Photoelectric Effect',
              'Matter Waves',
              'de Broglie Hypothesis'
            ]
          }
        ]
      },
      {
        id: 'electric-charges-fields',
        name: 'Electric Charges And Fields',
        topics: [
          {
            id: 'electric-fields-basics',
            name: 'Electrostatics',
            subtopics: [
              'Coulomb\'s Law',
              'Electric Field and Potential',
              'Gauss\'s Law'
            ]
          }
        ]
      },
      {
        id: 'electromagnetic-induction',
        name: 'Electromagnetic Induction',
        topics: [
          {
            id: 'em-induction-basics',
            name: 'Electromagnetic Induction',
            subtopics: [
              'Faraday\'s Law & Lenz\'s Law',
              'Induced EMF',
              'Eddy Currents',
              'Mutual and Self-Inductance'
            ]
          }
        ]
      },
      {
        id: 'electromagnetic-waves',
        name: 'Electromagnetic Waves',
        topics: [
          {
            id: 'em-waves-basics',
            name: 'EM Waves',
            subtopics: [
              'Properties, Maxwell\'s Equations',
              'Electromagnetic Spectrum'
            ]
          }
        ]
      },
      {
        id: 'electrostatic-potential-capacitance',
        name: 'Electrostatic Potential And Capacitance',
        topics: [
          {
            id: 'potential-capacitance-basics',
            name: 'Potential and Capacitance',
            subtopics: [
              'Potential Energy, Potential Difference',
              'Capacitance, Series and Parallel Connection',
              'Energy Stored in Capacitor'
            ]
          }
        ]
      },
      {
        id: 'magnetism-matter',
        name: 'Magnetism And Matter',
        topics: [
          {
            id: 'magnetism-basics',
            name: 'Magnetic Properties',
            subtopics: [
              'Magnetization and Magnetic Intensity',
              'Magnetic Materials (Dia-, Para-, Ferro-)',
              'Hysteresis'
            ]
          }
        ]
      },
      {
        id: 'moving-charges-magnetism',
        name: 'Moving Charges And Magnetism',
        topics: [
          {
            id: 'moving-charges-basics',
            name: 'Magnetic Effects of Current',
            subtopics: [
              'Moving Charges in Magnetic Field',
              'Biot-Savart Law, Ampere\'s Law',
              'Force on a Current-Carrying Conductor'
            ]
          }
        ]
      },
      {
        id: 'nuclei',
        name: 'Nuclei',
        topics: [
          {
            id: 'nuclei-basics',
            name: 'Nuclear Physics',
            subtopics: [
              'Nuclear Structure, Radioactivity',
              'Mass Defect, Binding Energy',
              'Nuclear Reactions, Fission & Fusion'
            ]
          }
        ]
      },
      {
        id: 'ray-optics',
        name: 'Ray Optics',
        topics: [
          {
            id: 'ray-optics-basics',
            name: 'Geometric Optics',
            subtopics: [
              'Reflection, Refraction Laws',
              'Lenses, Mirrors',
              'Total Internal Reflection',
              'Optical Instruments'
            ]
          }
        ]
      },
      {
        id: 'semiconductor-electronics',
        name: 'Semiconductor Electronics',
        topics: [
          {
            id: 'semiconductor-basics',
            name: 'Semiconductors',
            subtopics: [
              'Energy Bands',
              'Intrinsic and Extrinsic Semiconductors',
              'Diodes, Transistors Logic Gates'
            ]
          }
        ]
      },
      {
        id: 'wave-optics',
        name: 'Wave Optics',
        topics: [
          {
            id: 'wave-optics-basics',
            name: 'Physical Optics',
            subtopics: [
              'Young\'s Double Slit Experiment',
              'Interference, Diffraction, Polarization'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    chapters: [
      {
        id: 'chemical-bonding',
        name: 'Chemical Bonding And Molecular Structure',
        topics: [
          {
            id: 'bonding-basics',
            name: 'Chemical Bonding',
            subtopics: [
              'Ionic, Covalent, Coordinate Bonds',
              'Hybridization, Molecular Orbital Theory',
              'VSEPR Theory, Resonance'
            ]
          }
        ]
      },
      {
        id: 'classification-elements',
        name: 'Classification Of Elements And Periodicity',
        topics: [
          {
            id: 'periodicity-basics',
            name: 'Periodic Properties',
            subtopics: [
              'Periodic Law, Modern Periodic Table',
              'Trends in Properties (Radius, IE, EN, EA)',
              'Nomenclature'
            ]
          }
        ]
      },
      {
        id: 'equilibrium',
        name: 'Equilibrium',
        topics: [
          {
            id: 'equilibrium-basics',
            name: 'Chemical Equilibrium',
            subtopics: [
              'Physical and Chemical Equilibrium',
              'Law of Mass Action',
              'Le Chatelier\'s Principle',
              'Ionic Equilibrium, pH Calculations, Buffer Solutions'
            ]
          }
        ]
      },
      {
        id: 'hydrocarbons',
        name: 'Hydrocarbons',
        topics: [
          {
            id: 'hydrocarbons-basics',
            name: 'Hydrocarbon Chemistry',
            subtopics: [
              'Alkanes, Alkenes, Alkynes: Nomenclature, Preparation, Properties',
              'Aromatic Hydrocarbons: Benzene Reactions'
            ]
          }
        ]
      },
      {
        id: 'organic-chemistry-basics',
        name: 'Organic Chemistry Basics',
        topics: [
          {
            id: 'organic-basics',
            name: 'Fundamentals of Organic Chemistry',
            subtopics: [
              'IUPAC Naming',
              'Inductive, Resonance Effects',
              'Reaction Mechanisms (SN1, SN2, E1, E2)',
              'Isomerism'
            ]
          }
        ]
      },
      {
        id: 'redox-reactions',
        name: 'Redox Reactions',
        topics: [
          {
            id: 'redox-basics',
            name: 'Oxidation-Reduction',
            subtopics: [
              'Oxidation-Reduction, Balancing (Ion-Electron Method)',
              'Standard Electrode Potential'
            ]
          }
        ]
      },
      {
        id: 'basic-concepts-chemistry',
        name: 'Some Basic Concepts Of Chemistry',
        topics: [
          {
            id: 'basic-concepts',
            name: 'Fundamental Concepts',
            subtopics: [
              'Mole Concept, Equivalent Concept',
              'Concentration Units',
              'Stoichiometry'
            ]
          }
        ]
      },
      {
        id: 'structure-atom',
        name: 'Structure Of Atom',
        topics: [
          {
            id: 'atomic-structure',
            name: 'Atomic Structure',
            subtopics: [
              'Atomic Models, Quantum Numbers',
              'Electronic Configuration',
              'Photoelectric Effect'
            ]
          }
        ]
      },
      {
        id: 'thermodynamics',
        name: 'Thermodynamics',
        topics: [
          {
            id: 'thermodynamics-basics',
            name: 'Chemical Thermodynamics',
            subtopics: [
              'First Law, Second Law',
              'Enthalpy, Entropy, Gibbs Free Energy',
              'Hess Law, Spontaneity'
            ]
          }
        ]
      },
      {
        id: 'alcohol-phenols-ethers',
        name: 'Alcohol Phenols Ethers',
        topics: [
          {
            id: 'alcohols-basics',
            name: 'Alcohols and Phenols',
            subtopics: [
              'Preparation, Properties, Reactions',
              'Identification'
            ]
          }
        ]
      },
      {
        id: 'aldehydes-ketones-carboxylic',
        name: 'Aldehydes, Ketones And Carboxylic Acid',
        topics: [
          {
            id: 'carbonyl-basics',
            name: 'Carbonyl Compounds',
            subtopics: [
              'Structure, Nomenclature',
              'Preparation and Chemical Reactions',
              'Detection Tests'
            ]
          }
        ]
      },
      {
        id: 'amines',
        name: 'Amines',
        topics: [
          {
            id: 'amines-basics',
            name: 'Amines',
            subtopics: [
              'Classification',
              'Preparation, Properties',
              'Reactions and Distinction'
            ]
          }
        ]
      },
      {
        id: 'biomolecules',
        name: 'Biomolecules',
        topics: [
          {
            id: 'biomolecules-basics',
            name: 'Biological Molecules',
            subtopics: [
              'Carbohydrates, Proteins, Nucleic Acids, Vitamins',
              'Structure and Functions'
            ]
          }
        ]
      },
      {
        id: 'chemical-kinetics',
        name: 'Chemical Kinetics',
        topics: [
          {
            id: 'kinetics-basics',
            name: 'Reaction Kinetics',
            subtopics: [
              'Rate Laws, Order and Molecularity',
              'Integrated Rate Equations',
              'Activation Energy, Catalysis'
            ]
          }
        ]
      },
      {
        id: 'coordination-compounds',
        name: 'Coordination Compounds',
        topics: [
          {
            id: 'coordination-basics',
            name: 'Coordination Chemistry',
            subtopics: [
              'Nomenclature, Structure',
              'Isomerism',
              'Bonding (Werner, crystal field theory)'
            ]
          }
        ]
      },
      {
        id: 'd-f-block',
        name: 'D And F Block',
        topics: [
          {
            id: 'd-f-block-basics',
            name: 'Transition Elements',
            subtopics: [
              'Electronic Configuration',
              'Properties and Reactions',
              'Lanthanides, Actinides'
            ]
          }
        ]
      },
      {
        id: 'electrochemistry',
        name: 'Electrochemistry',
        topics: [
          {
            id: 'electrochemistry-basics',
            name: 'Electrochemical Cells',
            subtopics: [
              'Conductance, Kohlrausch Law',
              'Cell EMF, Nernst Equation',
              'Corrosion'
            ]
          }
        ]
      },
      {
        id: 'haloalkanes-haloarenes',
        name: 'Haloalkanes And Haloarenes',
        topics: [
          {
            id: 'haloalkanes-basics',
            name: 'Halogen Compounds',
            subtopics: [
              'Preparation, Properties',
              'Reactions (Substitution, Elimination)'
            ]
          }
        ]
      },
      {
        id: 'solutions',
        name: 'Solutions',
        topics: [
          {
            id: 'solutions-basics',
            name: 'Solution Chemistry',
            subtopics: [
              'Types of Solutions',
              'Concentration (Molarity, Molality, etc.)',
              'Raoult\'s Law, Colligative Properties'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    chapters: [
      {
        id: 'binomial-theorem',
        name: 'Binomial Theorem',
        topics: [
          {
            id: 'binomial-basics',
            name: 'Binomial Expansion',
            subtopics: [
              'Statement, Proof',
              'General and Middle Term',
              'Approximation, Applications'
            ]
          }
        ]
      },
      {
        id: 'complex-numbers-quadratic',
        name: 'Complex Numbers And Quadratic Equations',
        topics: [
          {
            id: 'complex-quadratic-basics',
            name: 'Complex Numbers and Quadratics',
            subtopics: [
              'Argand Plane, Modulus, Argument',
              'De Moivre\'s Theorem',
              'Quadratic Equations, Nature of Roots'
            ]
          }
        ]
      },
      {
        id: 'conic-sections',
        name: 'Conic Sections',
        topics: [
          {
            id: 'conic-basics',
            name: 'Conic Sections',
            subtopics: [
              'Parabola, Ellipse, Hyperbola: Equations, Properties, Tangents, Normals',
              'Director Circle, Focal Properties'
            ]
          }
        ]
      },
      {
        id: 'three-dimensional-geometry',
        name: 'Introduction to Three Dimensional Geometry',
        topics: [
          {
            id: '3d-geometry-basics',
            name: '3D Geometry',
            subtopics: [
              'Cartesian System, Distance Formula',
              'Direction Cosines and Ratios'
            ]
          }
        ]
      },
      {
        id: 'limits-derivatives',
        name: 'Limits And Derivatives',
        topics: [
          {
            id: 'limits-derivatives-basics',
            name: 'Calculus Basics',
            subtopics: [
              'Limit Theorems, Evaluation',
              'Continuity',
              'Derivative Rules, Geometric Meaning'
            ]
          }
        ]
      },
      {
        id: 'linear-inequalities',
        name: 'Linear Inequalities',
        topics: [
          {
            id: 'inequalities-basics',
            name: 'Linear Inequalities',
            subtopics: [
              'Solution of Linear Inequalities—One, Two Variables',
              'Graphical Representation'
            ]
          }
        ]
      },
      {
        id: 'permutations-combinations',
        name: 'Permutations And Combinations',
        topics: [
          {
            id: 'permutations-basics',
            name: 'Counting Principles',
            subtopics: [
              'Fundamental Principle',
              'Permutations, Combinations, Circular Permutations'
            ]
          }
        ]
      },
      {
        id: 'probability',
        name: 'Probability',
        topics: [
          {
            id: 'probability-basics',
            name: 'Probability Theory',
            subtopics: [
              'Definition and Types (Classical, Empirical, Bayesian)',
              'Conditional Probability, Bayes\' Theorem',
              'Binomial, Poisson Distributions'
            ]
          }
        ]
      },
      {
        id: 'relations-functions',
        name: 'Relations And Functions',
        topics: [
          {
            id: 'relations-functions-basics',
            name: 'Relations and Functions',
            subtopics: [
              'Types of Relations, Types of Functions',
              'Domain, Range',
              'Composite and Inverse Function'
            ]
          }
        ]
      },
      {
        id: 'sequences-series',
        name: 'Sequences And Series',
        topics: [
          {
            id: 'sequences-basics',
            name: 'Sequences and Series',
            subtopics: [
              'Arithmetic, Geometric, Harmonic Progression',
              'Sum to n Terms',
              'AM-GM Inequality'
            ]
          }
        ]
      },
      {
        id: 'sets',
        name: 'Sets',
        topics: [
          {
            id: 'sets-basics',
            name: 'Set Theory',
            subtopics: [
              'Representation, Types',
              'Operations, Venn Diagram'
            ]
          }
        ]
      },
      {
        id: 'statistics',
        name: 'Statistics',
        topics: [
          {
            id: 'statistics-basics',
            name: 'Statistical Analysis',
            subtopics: [
              'Mean, Median, Mode',
              'Variance, Standard Deviation'
            ]
          }
        ]
      },
      {
        id: 'straight-lines',
        name: 'Straight Lines',
        topics: [
          {
            id: 'straight-lines-basics',
            name: 'Line Geometry',
            subtopics: [
              'Slope, Equation, Intersections',
              'Distance, Area',
              'Family of Lines'
            ]
          }
        ]
      },
      {
        id: 'trigonometric-functions',
        name: 'Trigonometric Functions',
        topics: [
          {
            id: 'trigonometry-basics',
            name: 'Trigonometry',
            subtopics: [
              'Identities, Equations',
              'Graphs, Maximum-Minimum Values'
            ]
          }
        ]
      },
      {
        id: 'application-derivatives',
        name: 'Application Of Derivatives',
        topics: [
          {
            id: 'derivatives-applications',
            name: 'Derivative Applications',
            subtopics: [
              'Tangents, Normals',
              'Rate of Change',
              'Maxima and Minima, Curve Sketching'
            ]
          }
        ]
      },
      {
        id: 'application-integrals',
        name: 'Application Of Integrals',
        topics: [
          {
            id: 'integrals-applications',
            name: 'Integral Applications',
            subtopics: [
              'Area Under Curve',
              'Volume of Solid of Revolution'
            ]
          }
        ]
      },
      {
        id: 'continuity-differentiability',
        name: 'Continuity And Differentiability',
        topics: [
          {
            id: 'continuity-basics',
            name: 'Continuity and Differentiability',
            subtopics: [
              'Definition, Properties',
              'Algebra of Continuous and Differentiable Functions'
            ]
          }
        ]
      },
      {
        id: 'determinants',
        name: 'Determinants',
        topics: [
          {
            id: 'determinants-basics',
            name: 'Determinants',
            subtopics: [
              'Properties, Evaluation',
              'Applications: Solving Equations, Area'
            ]
          }
        ]
      },
      {
        id: 'differential-equations',
        name: 'Differential Equations',
        topics: [
          {
            id: 'differential-eq-basics',
            name: 'Differential Equations',
            subtopics: [
              'Order, Degree',
              'Formation, Solution (Variable Separation, Homogeneous)'
            ]
          }
        ]
      },
      {
        id: 'infinite-series',
        name: 'Infinite Series',
        topics: [
          {
            id: 'series-basics',
            name: 'Infinite Series',
            subtopics: [
              'Convergence Tests',
              'Power Series'
            ]
          }
        ]
      },
      {
        id: 'integrals',
        name: 'Integrals',
        topics: [
          {
            id: 'integrals-basics',
            name: 'Integration',
            subtopics: [
              'Indefinite, Definite Integration',
              'Properties, Substitution Methods',
              'Integration by Parts, Partial Fractions'
            ]
          }
        ]
      },
      {
        id: 'inverse-trigonometric',
        name: 'Inverse Trigonometric Functions',
        topics: [
          {
            id: 'inverse-trig-basics',
            name: 'Inverse Trigonometry',
            subtopics: [
              'Definition, Properties',
              'Principal Values'
            ]
          }
        ]
      },
      {
        id: 'linear-programming',
        name: 'Linear Programming',
        topics: [
          {
            id: 'linear-programming-basics',
            name: 'Linear Programming',
            subtopics: [
              'Formulation, Graphical Solution',
              'Feasible Region, Optimization'
            ]
          }
        ]
      },
      {
        id: 'matrices',
        name: 'Matrices',
        topics: [
          {
            id: 'matrices-basics',
            name: 'Matrix Algebra',
            subtopics: [
              'Types, Operations, Properties',
              'Inverse, Transpose',
              'Applications to Simultaneous Equations'
            ]
          }
        ]
      },
      {
        id: 'proofs-mathematics',
        name: 'Proofs In Mathematics',
        topics: [
          {
            id: 'proofs-basics',
            name: 'Mathematical Proofs',
            subtopics: [
              'Mathematical Induction',
              'Direct, Contrapositive, Contradiction Methods'
            ]
          }
        ]
      },
      {
        id: 'three-dimensional-geometry-advanced',
        name: 'Three Dimensional Geometry',
        topics: [
          {
            id: '3d-geometry-advanced',
            name: 'Advanced 3D Geometry',
            subtopics: [
              'Line, Plane Equation, Intersection',
              'Angle Between Lines/Planes',
              'Distance Between Objects'
            ]
          }
        ]
      },
      {
        id: 'vector-algebra',
        name: 'Vector Algebra',
        topics: [
          {
            id: 'vectors-basics',
            name: 'Vector Mathematics',
            subtopics: [
              'Scalars and Vectors',
              'Dot, Cross Product',
              'Applications in Physics'
            ]
          }
        ]
      }
    ]
  }
];
