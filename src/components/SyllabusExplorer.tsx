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
          { id: 'kinematics', name: 'Kinematics' },
          { id: 'laws-of-motion', name: 'Laws of Motion' },
          { id: 'work-energy-power', name: 'Work, Energy and Power' },
          { id: 'rotational-motion', name: 'Rotational Motion' },
        ],
      },
      {
        id: 'thermodynamics',
        name: 'Thermodynamics',
        class: 11,
        topics: [
          { id: 'thermal-properties', name: 'Thermal Properties of Matter' },
          { id: 'kinetic-theory', name: 'Kinetic Theory of Gases' },
          { id: 'first-law', name: 'First Law of Thermodynamics' },
          { id: 'second-law', name: 'Second Law of Thermodynamics' },
        ],
      },
      {
        id: 'waves-optics',
        name: 'Waves and Optics',
        class: 12,
        topics: [
          { id: 'wave-motion', name: 'Wave Motion' },
          { id: 'sound-waves', name: 'Sound Waves' },
          { id: 'geometrical-optics', name: 'Geometrical Optics' },
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
        id: 'atomic-structure',
        name: 'Atomic Structure',
        class: 11,
        topics: [
          { id: 'bohr-model', name: 'Bohr Model' },
          { id: 'quantum-numbers', name: 'Quantum Numbers' },
          { id: 'electronic-configuration', name: 'Electronic Configuration' },
          { id: 'periodic-properties', name: 'Periodic Properties' },
        ],
      },
      {
        id: 'organic-chemistry',
        name: 'Organic Chemistry',
        class: 12,
        topics: [
          { id: 'hydrocarbons', name: 'Hydrocarbons' },
          { id: 'haloalkanes', name: 'Haloalkanes and Haloarenes' },
          { id: 'alcohols-phenols', name: 'Alcohols, Phenols and Ethers' },
          { id: 'aldehydes-ketones', name: 'Aldehydes and Ketones' },
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
          { id: 'complex-numbers', name: 'Complex Numbers' },
          { id: 'quadratic-equations', name: 'Quadratic Equations' },
          { id: 'sequences-series', name: 'Sequences and Series' },
          { id: 'permutations-combinations', name: 'Permutations and Combinations' },
        ],
      },
      {
        id: 'calculus',
        name: 'Calculus',
        class: 12,
        topics: [
          { id: 'limits-continuity', name: 'Limits and Continuity' },
          { id: 'differentiation', name: 'Differentiation' },
          { id: 'integration', name: 'Integration' },
          { id: 'differential-equations', name: 'Differential Equations' },
        ],
      },
      {
        id: 'coordinate-geometry',
        name: 'Coordinate Geometry',
        class: 11,
        topics: [
          { id: 'straight-lines', name: 'Straight Lines' },
          { id: 'circles', name: 'Circles' },
          { id: 'conic-sections', name: 'Conic Sections' },
          { id: 'three-dimensional', name: 'Three Dimensional Geometry' },
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
  });
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});

  useEffect(() => {
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
                      className="w-full justify-start h-auto p-2 hover:bg-accent/50"
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
                              className="w-full justify-start h-auto p-2 hover:bg-accent/50 text-sm"
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
                                className="w-full justify-start h-auto p-2 hover:bg-primary/10 text-sm interactive"
                              >
                                <div className="h-2 w-2 rounded-full bg-muted-foreground mr-3 flex-shrink-0" />
                                <span className="text-left">{topic.name}</span>
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
