import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, BookOpen, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Topic {
  id: string;
  name: string;
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

// Fallback syllabus data
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
          { id: 'gravitation', name: 'Gravitation' },
          { id: 'kinetic-theory', name: 'Kinetic Theory' },
          { id: 'laws-of-motion', name: 'Laws Of Motion' },
          { id: 'mechanical-properties-fluids', name: 'Mechanical Properties Of Fluids' },
          { id: 'mechanical-properties-solids', name: 'Mechanical Properties Of Solids' },
          { id: 'motion-plane', name: 'Motion In A Plane' },
          { id: 'motion-straight-line', name: 'Motion In A Straight Line' },
          { id: 'oscillations', name: 'Oscillations' },
          { id: 'system-particles-rotational', name: 'System Of Particles And Rotational Motion' },
          { id: 'thermal-properties', name: 'Thermal Properties Of Matter' },
          { id: 'units-measurements', name: 'Units And Measurements' },
          { id: 'waves', name: 'Waves' },
          { id: 'work-energy-power', name: 'Work Energy Power' },
        ],
      },
      {
        id: 'electromagnetism',
        name: 'Electromagnetism',
        class: 12,
        topics: [
          { id: 'alternating-current', name: 'Alternating Current' },
          { id: 'current-electricity', name: 'Current Electricity' },
          { id: 'electric-charges-fields', name: 'Electric Charges And Fields' },
          { id: 'electromagnetic-induction', name: 'Electromagnetic Induction' },
          { id: 'electromagnetic-waves', name: 'Electromagnetic Waves' },
          { id: 'electrostatic-potential', name: 'Electrostatic Potential And Capacitance' },
          { id: 'magnetism-matter', name: 'Magnetism And Matter' },
          { id: 'moving-charges-magnetism', name: 'Moving Charges And Magnetism' },
        ],
      },
      {
        id: 'modern-physics',
        name: 'Modern Physics',
        class: 12,
        topics: [
          { id: 'atoms', name: 'Atoms' },
          { id: 'dual-nature-radiation', name: 'Dual Nature Of Radiation And Matter' },
          { id: 'nuclei', name: 'Nuclei' },
          { id: 'semiconductor-electronics', name: 'Semiconductor Electronics' },
        ],
      },
      {
        id: 'optics',
        name: 'Optics',
        class: 12,
        topics: [
          { id: 'ray-optics', name: 'Ray Optics' },
          { id: 'wave-optics', name: 'Wave Optics' },
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
          { id: 'chemical-bonding', name: 'Chemical Bonding And Molecular Structure' },
          { id: 'classification-elements', name: 'Classification Of Elements And Periodicity' },
          { id: 'equilibrium', name: 'Equilibrium' },
          { id: 'redox-reactions', name: 'Redox Reactions' },
          { id: 'basic-concepts', name: 'Some Basic Concepts Of Chemistry' },
          { id: 'structure-atom', name: 'Structure Of Atom' },
          { id: 'thermodynamics', name: 'Thermodynamics' },
        ],
      },
      {
        id: 'organic-chemistry',
        name: 'Organic Chemistry',
        class: 11,
        topics: [
          { id: 'hydrocarbons', name: 'Hydrocarbons' },
          { id: 'organic-basics', name: 'Organic Chemistry Basics' },
        ],
      },
      {
        id: 'organic-chemistry-2',
        name: 'Organic Chemistry II',
        class: 12,
        topics: [
          { id: 'alcohol-phenols-ethers', name: 'Alcohol Phenols Ethers' },
          { id: 'aldehydes-ketones-carboxylic', name: 'Aldehydes, Ketones And Carboxylic Acid' },
          { id: 'amines', name: 'Amines' },
          { id: 'biomolecules', name: 'Biomolecules' },
          { id: 'haloalkanes-haloarenes', name: 'Haloalkanes And Haloarenes' },
        ],
      },
      {
        id: 'physical-chemistry-2',
        name: 'Physical Chemistry II',
        class: 12,
        topics: [
          { id: 'chemical-kinetics', name: 'Chemical Kinetics' },
          { id: 'electrochemistry', name: 'Electrochemistry' },
          { id: 'solutions', name: 'Solutions' },
        ],
      },
      {
        id: 'inorganic-chemistry',
        name: 'Inorganic Chemistry',
        class: 12,
        topics: [
          { id: 'coordination-compounds', name: 'Coordination Compounds' },
          { id: 'd-f-block', name: 'D And F Block' },
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
          { id: 'binomial-theorem', name: 'Binomial Theorem' },
          { id: 'complex-numbers-quadratic', name: 'Complex Numbers And Quadratic Equations' },
          { id: 'linear-inequalities', name: 'Linear Inequalities' },
          { id: 'permutations-combinations', name: 'Permutations And Combinations' },
          { id: 'probability', name: 'Probability' },
          { id: 'relations-functions', name: 'Relations And Functions' },
          { id: 'sequences-series', name: 'Sequences And Series' },
          { id: 'sets', name: 'Sets' },
        ],
      },
      {
        id: 'geometry',
        name: 'Geometry',
        class: 11,
        topics: [
          { id: 'conic-sections', name: 'Conic Sections' },
          { id: 'intro-3d-geometry', name: 'Introduction to Three Dimensional Geometry' },
          { id: 'straight-lines', name: 'Straight Lines' },
        ],
      },
      {
        id: 'calculus',
        name: 'Calculus',
        class: 11,
        topics: [
          { id: 'limits-derivatives', name: 'Limits And Derivatives' },
          { id: 'statistics', name: 'Statistics' },
          { id: 'trigonometric-functions', name: 'Trigonometric Functions' },
        ],
      },
      {
        id: 'calculus-2',
        name: 'Calculus II',
        class: 12,
        topics: [
          { id: 'application-derivatives', name: 'Application Of Derivatives' },
          { id: 'application-integrals', name: 'Application Of Integrals' },
          { id: 'continuity-differentiability', name: 'Continuity And Differentiability' },
          { id: 'differential-equations', name: 'Differential Equations' },
          { id: 'infinite-series', name: 'Infinite Series' },
          { id: 'integrals', name: 'Integrals' },
          { id: 'inverse-trigonometric', name: 'Inverse Trigonometric Functions' },
        ],
      },
      {
        id: 'algebra-2',
        name: 'Algebra II',
        class: 12,
        topics: [
          { id: 'determinants', name: 'Determinants' },
          { id: 'linear-programming', name: 'Linear Programming' },
          { id: 'matrices', name: 'Matrices' },
          { id: 'proofs-mathematics', name: 'Proofs In Mathematics' },
        ],
      },
      {
        id: 'geometry-2',
        name: 'Geometry II',
        class: 12,
        topics: [
          { id: 'three-dimensional-geometry', name: 'Three Dimensional Geometry' },
          { id: 'vector-algebra', name: 'Vector Algebra' },
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

  const filteredSyllabus = syllabus.map(subject => ({
    ...subject,
    chapters: subject.chapters.map(chapter => ({
      ...chapter,
      topics: chapter.topics.filter(topic =>
        searchQuery === '' ||
        topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                              <Button
                                key={topic.id}
                                variant="ghost"
                                onClick={() => onTopicSelect(subject.name, chapter.name, topic.name)}
                                className="w-full justify-start h-auto p-2 hover:bg-primary/10 text-sm interactive syllabus-topic"
                              >
                                <div className="h-2 w-2 rounded-full bg-primary mr-3 flex-shrink-0" />
                                <span className="text-left text-foreground">{topic.name}</span>
                              </Button>
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
