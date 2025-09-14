import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, BookOpen, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Topic {
  id: string;
  name: string;
  subtopics?: string[];
  content?: {
    learn: string;
    revise: string;
  };
}

interface Chapter {
  id: string;
  name: string;
  class: 11 | 12;
  topics: Topic[];
}

interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}

interface SyllabusExplorerProps {
  onTopicSelect: (subject: string, chapter: string, topic: string) => void;
}

const API_BASE_URL = 'https://praxis-ai.fly.dev';

// Fallback syllabus data with detailed subtopics
const fallbackSyllabus: Subject[] = [
  {
    id: 'physics',
    name: 'Physics',
    chapters: [
      {
        id: 'mechanics',
        name: 'Mechanics',
        class: 11,
        topics: [
          { 
            id: 'gravitation', 
            name: 'Gravitation',
            subtopics: [
              "Newton's Law of Gravitation",
              "Gravitational Field and Potential", 
              "Acceleration due to Gravity",
              "Escape Velocity and Orbital Velocity",
              "Motion of Satellites",
              "Kepler's Laws"
            ]
          },
          { 
            id: 'kinetic-theory', 
            name: 'Kinetic Theory',
            subtopics: [
              "Ideal Gas Laws",
              "Kinetic Theory of Gases",
              "Mean Free Path and Pressure",
              "Degrees of Freedom, Equipartition Principle",
              "Maxwell-Boltzmann Distribution"
            ]
          },
          { 
            id: 'laws-of-motion', 
            name: 'Laws Of Motion',
            subtopics: [
              "Inertia and Newton's Laws",
              "Force and Types of Forces",
              "Friction (Static, Kinetic, Rolling)",
              "Circular Motion",
              "Dynamics of Connected Bodies (Pulley, String)"
            ]
          },
          { 
            id: 'mechanical-properties-fluids', 
            name: 'Mechanical Properties Of Fluids',
            subtopics: [
              "Pressure, Pascal's Law",
              "Buoyancy and Archimedes' Principle",
              "Viscosity (Poiseuille's Law)",
              "Surface Tension (Capillarity)",
              "Flow of Fluids (Equation of Continuity, Bernoulli's Principle)"
            ]
          },
          { 
            id: 'mechanical-properties-solids', 
            name: 'Mechanical Properties Of Solids',
            subtopics: [
              "Stress and Strain",
              "Hooke's Law",
              "Young's Modulus, Bulk Modulus, Shear Modulus",
              "Elastic and Plastic Deformation",
              "Energy Stored in a Stretched Wire"
            ]
          },
          { 
            id: 'motion-plane', 
            name: 'Motion In A Plane',
            subtopics: [
              "Projectile Motion",
              "Uniform Circular Motion",
              "Relative Motion"
            ]
          },
          { 
            id: 'motion-straight-line', 
            name: 'Motion In A Straight Line',
            subtopics: [
              "Displacement, Velocity, Acceleration",
              "Graphical Analysis (x-t, v-t, a-t)",
              "Equations of Motion"
            ]
          },
          { 
            id: 'oscillations', 
            name: 'Oscillations',
            subtopics: [
              "Simple Harmonic Motion (SHM) theory",
              "Damped, Forced, Resonance",
              "Energy in SHM",
              "LC and LCR Oscillations"
            ]
          },
          { 
            id: 'system-particles-rotational', 
            name: 'System Of Particles And Rotational Motion',
            subtopics: [
              "Centre of Mass",
              "Linear Momentum and Collisions",
              "Rotational Kinematics & Dynamics",
              "Torque, Angular Momentum",
              "Moment of Inertia, Parallel/Perpendicular Axis Theorem"
            ]
          },
          { 
            id: 'thermal-properties', 
            name: 'Thermal Properties Of Matter',
            subtopics: [
              "Heat, Temperature, Calorimetry",
              "Thermal Expansion",
              "Specific Heat Capacity, Latent Heat",
              "Transfer of Heat (Conduction, Convection, Radiation)"
            ]
          },
          { 
            id: 'units-measurements', 
            name: 'Units And Measurements',
            subtopics: [
              "Fundamental and Derived Units",
              "Dimensional Analysis",
              "Error Analysis"
            ]
          },
          { 
            id: 'waves', 
            name: 'Waves',
            subtopics: [
              "Wave Motion (Progressive, Standing Waves)",
              "Superposition Principle",
              "Beats, Doppler Effect",
              "Sound Waves (Properties, Equations)"
            ]
          },
          { 
            id: 'work-energy-power', 
            name: 'Work Energy Power',
            subtopics: [
              "Work Done by Constant/Variable Force",
              "Energy (Kinetic, Potential)",
              "Conservation of Energy",
              "Collision (Elastic and Inelastic)",
              "Power (Instantaneous and Average)"
            ]
          },
        ],
      },
      {
        id: 'electromagnetism',
        name: 'Electromagnetism',
        class: 12,
        topics: [
          { 
            id: 'alternating-current', 
            name: 'Alternating Current',
            subtopics: [
              "AC Generation",
              "RMS and Average Values",
              "Phasor Diagrams",
              "LCR Circuit",
              "Resonance and Power Factor"
            ]
          },
          { 
            id: 'current-electricity', 
            name: 'Current Electricity',
            subtopics: [
              "Ohm's Law, Kirchhoff's Laws",
              "EMF and Internal Resistance",
              "Series and Parallel Circuits",
              "Wheatstone Bridge, Potentiometer"
            ]
          },
          { 
            id: 'electric-charges-fields', 
            name: 'Electric Charges And Fields',
            subtopics: [
              "Coulomb's Law",
              "Electric Field and Potential",
              "Gauss's Law"
            ]
          },
          { 
            id: 'electromagnetic-induction', 
            name: 'Electromagnetic Induction',
            subtopics: [
              "Faraday's Law & Lenz's Law",
              "Induced EMF",
              "Eddy Currents",
              "Mutual and Self-Inductance"
            ]
          },
          { 
            id: 'electromagnetic-waves', 
            name: 'Electromagnetic Waves',
            subtopics: [
              "Properties, Maxwell's Equations",
              "Electromagnetic Spectrum"
            ]
          },
          { 
            id: 'electrostatic-potential', 
            name: 'Electrostatic Potential And Capacitance',
            subtopics: [
              "Potential Energy, Potential Difference",
              "Capacitance, Series and Parallel Connection",
              "Energy Stored in Capacitor"
            ]
          },
          { 
            id: 'magnetism-matter', 
            name: 'Magnetism And Matter',
            subtopics: [
              "Magnetization and Magnetic Intensity",
              "Magnetic Materials (Dia-, Para-, Ferro-)",
              "Hysteresis"
            ]
          },
          { 
            id: 'moving-charges-magnetism', 
            name: 'Moving Charges And Magnetism',
            subtopics: [
              "Moving Charges in Magnetic Field",
              "Biot-Savart Law, Ampere's Law",
              "Force on a Current-Carrying Conductor"
            ]
          },
        ],
      },
      {
        id: 'modern-physics',
        name: 'Modern Physics',
        class: 12,
        topics: [
          { 
            id: 'atoms', 
            name: 'Atoms',
            subtopics: [
              "Rutherford and Bohr Models",
              "Energy Levels, Spectra",
              "Hydrogen Atom Calculations"
            ]
          },
          { 
            id: 'dual-nature-radiation', 
            name: 'Dual Nature Of Radiation And Matter',
            subtopics: [
              "Photoelectric Effect",
              "Matter Waves",
              "de Broglie Hypothesis"
            ]
          },
          { 
            id: 'nuclei', 
            name: 'Nuclei',
            subtopics: [
              "Nuclear Structure, Radioactivity",
              "Mass Defect, Binding Energy",
              "Nuclear Reactions, Fission & Fusion"
            ]
          },
          { 
            id: 'semiconductor-electronics', 
            name: 'Semiconductor Electronics',
            subtopics: [
              "Energy Bands",
              "Intrinsic and Extrinsic Semiconductors",
              "Diodes, Transistors Logic Gates"
            ]
          },
        ],
      },
      {
        id: 'optics',
        name: 'Optics',
        class: 12,
        topics: [
          { 
            id: 'ray-optics', 
            name: 'Ray Optics',
            subtopics: [
              "Reflection, Refraction Laws",
              "Lenses, Mirrors",
              "Total Internal Reflection",
              "Optical Instruments"
            ]
          },
          { 
            id: 'wave-optics', 
            name: 'Wave Optics',
            subtopics: [
              "Young's Double Slit Experiment",
              "Interference, Diffraction, Polarization"
            ]
          },
        ],
      },
    ],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    chapters: [
      {
        id: 'physical-chemistry',
        name: 'Physical Chemistry',
        class: 11,
        topics: [
          { 
            id: 'chemical-bonding', 
            name: 'Chemical Bonding And Molecular Structure',
            subtopics: [
              "Ionic, Covalent, Coordinate Bonds",
              "Hybridization, Molecular Orbital Theory",
              "VSEPR Theory, Resonance"
            ]
          },
          { 
            id: 'classification-elements', 
            name: 'Classification Of Elements And Periodicity',
            subtopics: [
              "Periodic Law, Modern Periodic Table",
              "Trends in Properties (Radius, IE, EN, EA)",
              "Nomenclature"
            ]
          },
          { 
            id: 'equilibrium', 
            name: 'Equilibrium',
            subtopics: [
              "Physical and Chemical Equilibrium",
              "Law of Mass Action",
              "Le Chatelier's Principle",
              "Ionic Equilibrium, pH Calculations, Buffer Solutions"
            ]
          },
          { 
            id: 'redox-reactions', 
            name: 'Redox Reactions',
            subtopics: [
              "Oxidation-Reduction, Balancing (Ion-Electron Method)",
              "Standard Electrode Potential"
            ]
          },
          { 
            id: 'basic-concepts', 
            name: 'Some Basic Concepts Of Chemistry',
            subtopics: [
              "Mole Concept, Equivalent Concept",
              "Concentration Units",
              "Stoichiometry"
            ]
          },
          { 
            id: 'structure-atom', 
            name: 'Structure Of Atom',
            subtopics: [
              "Atomic Models, Quantum Numbers",
              "Electronic Configuration",
              "Photoelectric Effect"
            ]
          },
          { 
            id: 'thermodynamics', 
            name: 'Thermodynamics',
            subtopics: [
              "First Law, Second Law",
              "Enthalpy, Entropy, Gibbs Free Energy",
              "Hess Law, Spontaneity"
            ]
          },
        ],
      },
      {
        id: 'organic-chemistry',
        name: 'Organic Chemistry',
        class: 11,
        topics: [
          { 
            id: 'hydrocarbons', 
            name: 'Hydrocarbons',
            subtopics: [
              "Alkanes, Alkenes, Alkynes: Nomenclature, Preparation, Properties",
              "Aromatic Hydrocarbons: Benzene Reactions"
            ]
          },
          { 
            id: 'organic-basics', 
            name: 'Organic Chemistry Basics',
            subtopics: [
              "IUPAC Naming",
              "Inductive, Resonance Effects",
              "Reaction Mechanisms (SN1, SN2, E1, E2)",
              "Isomerism"
            ]
          },
        ],
      },
      {
        id: 'organic-chemistry-2',
        name: 'Organic Chemistry II',
        class: 12,
        topics: [
          { 
            id: 'alcohol-phenols-ethers', 
            name: 'Alcohol Phenols Ethers',
            subtopics: [
              "Preparation, Properties, Reactions",
              "Identification"
            ]
          },
          { 
            id: 'aldehydes-ketones-carboxylic', 
            name: 'Aldehydes, Ketones And Carboxylic Acid',
            subtopics: [
              "Structure, Nomenclature",
              "Preparation and Chemical Reactions",
              "Detection Tests"
            ]
          },
          { 
            id: 'amines', 
            name: 'Amines',
            subtopics: [
              "Classification",
              "Preparation, Properties",
              "Reactions and Distinction"
            ]
          },
          { 
            id: 'biomolecules', 
            name: 'Biomolecules',
            subtopics: [
              "Carbohydrates, Proteins, Nucleic Acids, Vitamins",
              "Structure and Functions"
            ]
          },
          { 
            id: 'haloalkanes-haloarenes', 
            name: 'Haloalkanes And Haloarenes',
            subtopics: [
              "Preparation, Properties",
              "Reactions (Substitution, Elimination)"
            ]
          },
        ],
      },
      {
        id: 'physical-chemistry-2',
        name: 'Physical Chemistry II',
        class: 12,
        topics: [
          { 
            id: 'chemical-kinetics', 
            name: 'Chemical Kinetics',
            subtopics: [
              "Rate Laws, Order and Molecularity",
              "Integrated Rate Equations",
              "Activation Energy, Catalysis"
            ]
          },
          { 
            id: 'electrochemistry', 
            name: 'Electrochemistry',
            subtopics: [
              "Conductance, Kohlrausch Law",
              "Cell EMF, Nernst Equation",
              "Corrosion"
            ]
          },
          { 
            id: 'solutions', 
            name: 'Solutions',
            subtopics: [
              "Types of Solutions",
              "Concentration (Molarity, Molality, etc.)",
              "Raoult's Law, Colligative Properties"
            ]
          },
        ],
      },
      {
        id: 'inorganic-chemistry',
        name: 'Inorganic Chemistry',
        class: 12,
        topics: [
          { 
            id: 'coordination-compounds', 
            name: 'Coordination Compounds',
            subtopics: [
              "Nomenclature, Structure",
              "Isomerism",
              "Bonding (Werner, crystal field theory)"
            ]
          },
          { 
            id: 'd-f-block', 
            name: 'D And F Block',
            subtopics: [
              "Electronic Configuration",
              "Properties and Reactions",
              "Lanthanides, Actinides"
            ]
          },
        ],
      },
    ],
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    chapters: [
      {
        id: 'algebra',
        name: 'Algebra',
        class: 11,
        topics: [
          { 
            id: 'binomial-theorem', 
            name: 'Binomial Theorem',
            subtopics: [
              "Statement, Proof",
              "General and Middle Term",
              "Approximation, Applications"
            ]
          },
          { 
            id: 'complex-numbers-quadratic', 
            name: 'Complex Numbers And Quadratic Equations',
            subtopics: [
              "Argand Plane, Modulus, Argument",
              "De Moivre's Theorem",
              "Quadratic Equations, Nature of Roots"
            ]
          },
          { 
            id: 'linear-inequalities', 
            name: 'Linear Inequalities',
            subtopics: [
              "Solution of Linear Inequalities—One, Two Variables",
              "Graphical Representation"
            ]
          },
          { 
            id: 'permutations-combinations', 
            name: 'Permutations And Combinations',
            subtopics: [
              "Fundamental Principle",
              "Permutations, Combinations, Circular Permutations"
            ]
          },
          { 
            id: 'probability', 
            name: 'Probability',
            subtopics: [
              "Definition and Types (Classical, Empirical, Bayesian)",
              "Conditional Probability, Bayes' Theorem",
              "Binomial, Poisson Distributions"
            ]
          },
          { 
            id: 'relations-functions', 
            name: 'Relations And Functions',
            subtopics: [
              "Types of Relations, Types of Functions",
              "Domain, Range",
              "Composite and Inverse Function"
            ]
          },
          { 
            id: 'sequences-series', 
            name: 'Sequences And Series',
            subtopics: [
              "Arithmetic, Geometric, Harmonic Progression",
              "Sum to n Terms",
              "AM-GM Inequality"
            ]
          },
          { 
            id: 'sets', 
            name: 'Sets',
            subtopics: [
              "Representation, Types",
              "Operations, Venn Diagram"
            ]
          },
        ],
      },
      {
        id: 'geometry',
        name: 'Geometry',
        class: 11,
        topics: [
          { 
            id: 'conic-sections', 
            name: 'Conic Sections',
            subtopics: [
              "Parabola, Ellipse, Hyperbola: Equations, Properties, Tangents, Normals",
              "Director Circle, Focal Properties"
            ]
          },
          { 
            id: 'intro-3d-geometry', 
            name: 'Introduction to Three Dimensional Geometry',
            subtopics: [
              "Cartesian System, Distance Formula",
              "Direction Cosines and Ratios"
            ]
          },
          { 
            id: 'straight-lines', 
            name: 'Straight Lines',
            subtopics: [
              "Slope, Equation, Intersections",
              "Distance, Area",
              "Family of Lines"
            ]
          },
        ],
      },
      {
        id: 'calculus',
        name: 'Calculus',
        class: 11,
        topics: [
          { 
            id: 'limits-derivatives', 
            name: 'Limits And Derivatives',
            subtopics: [
              "Limit Theorems, Evaluation",
              "Continuity",
              "Derivative Rules, Geometric Meaning"
            ]
          },
          { 
            id: 'statistics', 
            name: 'Statistics',
            subtopics: [
              "Mean, Median, Mode",
              "Variance, Standard Deviation"
            ]
          },
          { 
            id: 'trigonometric-functions', 
            name: 'Trigonometric Functions',
            subtopics: [
              "Identities, Equations",
              "Graphs, Maximum-Minimum Values"
            ]
          },
        ],
      },
      {
        id: 'calculus-2',
        name: 'Calculus II',
        class: 12,
        topics: [
          { 
            id: 'application-derivatives', 
            name: 'Application Of Derivatives',
            subtopics: [
              "Tangents, Normals",
              "Rate of Change",
              "Maxima and Minima, Curve Sketching"
            ]
          },
          { 
            id: 'application-integrals', 
            name: 'Application Of Integrals',
            subtopics: [
              "Area Under Curve",
              "Volume of Solid of Revolution"
            ]
          },
          { 
            id: 'continuity-differentiability', 
            name: 'Continuity And Differentiability',
            subtopics: [
              "Definition, Properties",
              "Algebra of Continuous and Differentiable Functions"
            ]
          },
          { 
            id: 'differential-equations', 
            name: 'Differential Equations',
            subtopics: [
              "Order, Degree",
              "Formation, Solution (Variable Separation, Homogeneous)"
            ]
          },
          { 
            id: 'infinite-series', 
            name: 'Infinite Series',
            subtopics: [
              "Convergence Tests",
              "Power Series"
            ]
          },
          { 
            id: 'integrals', 
            name: 'Integrals',
            subtopics: [
              "Indefinite, Definite Integration",
              "Properties, Substitution Methods",
              "Integration by Parts, Partial Fractions"
            ]
          },
          { 
            id: 'inverse-trigonometric', 
            name: 'Inverse Trigonometric Functions',
            subtopics: [
              "Definition, Properties",
              "Principal Values"
            ]
          },
        ],
      },
      {
        id: 'algebra-2',
        name: 'Algebra II',
        class: 12,
        topics: [
          { 
            id: 'determinants', 
            name: 'Determinants',
            subtopics: [
              "Properties, Evaluation",
              "Applications: Solving Equations, Area"
            ]
          },
          { 
            id: 'linear-programming', 
            name: 'Linear Programming',
            subtopics: [
              "Formulation, Graphical Solution",
              "Feasible Region, Optimization"
            ]
          },
          { 
            id: 'matrices', 
            name: 'Matrices',
            subtopics: [
              "Types, Operations, Properties",
              "Inverse, Transpose",
              "Applications to Simultaneous Equations"
            ]
          },
          { 
            id: 'proofs-mathematics', 
            name: 'Proofs In Mathematics',
            subtopics: [
              "Mathematical Induction",
              "Direct, Contrapositive, Contradiction Methods"
            ]
          },
        ],
      },
      {
        id: 'geometry-2',
        name: 'Geometry II',
        class: 12,
        topics: [
          { 
            id: 'three-dimensional-geometry', 
            name: 'Three Dimensional Geometry',
            subtopics: [
              "Line, Plane Equation, Intersection",
              "Angle Between Lines/Planes",
              "Distance Between Objects"
            ]
          },
          { 
            id: 'vector-algebra', 
            name: 'Vector Algebra',
            subtopics: [
              "Scalars and Vectors",
              "Dot, Cross Product",
              "Applications in Physics"
            ]
          },
        ],
      },
    ],
  },
];

export const SyllabusExplorer = ({ onTopicSelect }: SyllabusExplorerProps) => {
  const [syllabus, setSyllabus] = useState<Subject[]>(fallbackSyllabus);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>({
    physics: true, // Open physics by default
    chemistry: false,
    mathematics: false,
  });
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({
    mechanics: true, // Open first physics chapter by default
  });
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Use fallback data immediately, then try to fetch from API
    setSyllabus(fallbackSyllabus);
    fetchSyllabus();
  }, []);

  const fetchSyllabus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/syllabus`);
      
      if (response.ok) {
        const data = await response.json();
        setSyllabus(data.syllabus || fallbackSyllabus);
      }
    } catch (error) {
      console.warn('Failed to fetch syllabus from API, using fallback data:', error);
      // Keep using fallback data
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (subjectId: string) => {
    setOpenSubjects(prev => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  const toggleChapter = (chapterId: string) => {
    setOpenChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const toggleTopic = (topicId: string) => {
    setOpenTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const filteredSyllabus = syllabus.map(subject => ({
    ...subject,
    chapters: subject.chapters.map(chapter => ({
      ...chapter,
      topics: chapter.topics.filter(topic =>
        searchQuery === '' ||
        topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (topic.subtopics && topic.subtopics.some(subtopic => 
          subtopic.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      ),
    })).filter(chapter => chapter.topics.length > 0),
  })).filter(subject => subject.chapters.length > 0);

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Syllabus Tree */}
      <ScrollArea className="flex-1 custom-scrollbar">
        <div className="p-4 space-y-2">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="loading-shimmer h-8 rounded"></div>
              ))}
            </div>
          ) : (
            filteredSyllabus.map((subject) => (
              <div key={subject.id} className="space-y-1">
                <Collapsible
                  open={openSubjects[subject.id]}
                  onOpenChange={() => toggleSubject(subject.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 hover:bg-accent/50 syllabus-subject"
                    >
                      {openSubjects[subject.id] ? (
                        <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                      )}
                      <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="font-medium text-left">{subject.name}</span>
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="ml-6 space-y-1">
                    {subject.chapters.map((chapter) => (
                      <div key={chapter.id} className="space-y-1">
                        <Collapsible
                          open={openChapters[chapter.id]}
                          onOpenChange={() => toggleChapter(chapter.id)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-start h-auto p-2 hover:bg-accent/50 text-sm syllabus-chapter"
                            >
                              {openChapters[chapter.id] ? (
                                <ChevronDown className="h-3 w-3 mr-2 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="h-3 w-3 mr-2 flex-shrink-0" />
                              )}
                              <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                              <span className="text-left">
                                {chapter.name}
                                <span className="ml-2 text-xs text-muted-foreground">
                                  Class {chapter.class}
                                </span>
                              </span>
                            </Button>
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent className="ml-6 space-y-1">
                            {chapter.topics.map((topic) => (
                              <div key={topic.id} className="space-y-1">
                                {topic.subtopics && topic.subtopics.length > 0 ? (
                                  <Collapsible
                                    open={openTopics[topic.id]}
                                    onOpenChange={() => toggleTopic(topic.id)}
                                  >
                                    <CollapsibleTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="w-full justify-start h-auto p-2 hover:bg-accent/50 text-sm syllabus-topic"
                                      >
                                        {openTopics[topic.id] ? (
                                          <ChevronDown className="h-3 w-3 mr-2 flex-shrink-0" />
                                        ) : (
                                          <ChevronRight className="h-3 w-3 mr-2 flex-shrink-0" />
                                        )}
                                        <div className="h-2 w-2 rounded-full bg-primary mr-2 flex-shrink-0" />
                                        <span className="text-left text-foreground">{topic.name}</span>
                                      </Button>
                                    </CollapsibleTrigger>
                                    
                                    <CollapsibleContent className="ml-6 space-y-1">
                                      {topic.subtopics.map((subtopic, index) => (
                                        <Button
                                          key={`${topic.id}-${index}`}
                                          variant="ghost"
                                          onClick={() => onTopicSelect(subject.name, chapter.name, topic.name)}
                                          className="w-full justify-start h-auto p-2 hover:bg-primary/10 text-xs interactive"
                                        >
                                          <div className="h-1 w-1 rounded-full bg-muted-foreground mr-3 flex-shrink-0" />
                                          <span className="text-left text-muted-foreground">{subtopic}</span>
                                        </Button>
                                      ))}
                                    </CollapsibleContent>
                                  </Collapsible>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    onClick={() => onTopicSelect(subject.name, chapter.name, topic.name)}
                                    className="w-full justify-start h-auto p-2 hover:bg-primary/10 text-sm interactive syllabus-topic"
                                  >
                                    <div className="h-2 w-2 rounded-full bg-primary mr-3 flex-shrink-0" />
                                    <span className="text-left text-foreground">{topic.name}</span>
                                  </Button>
                                )}
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
