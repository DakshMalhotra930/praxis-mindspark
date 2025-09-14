// Updated by DakshMalhotra930 for complete backend integration
import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, BookOpen, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { ApiService, type Subject, type Chapter, type Topic } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { completeJeeSyllabus } from '@/data/syllabusData';

interface SyllabusExplorerProps {
  onTopicSelect: (topic: { subject: string; chapter: string; topic: string }) => void;
}

// Use complete JEE syllabus data
const fallbackSyllabus = completeJeeSyllabus;

export const SyllabusExplorer = ({ onTopicSelect }: SyllabusExplorerProps) => {
  const { toast } = useToast();
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
    // Use fallback data immediately for instant loading
    setSyllabus(fallbackSyllabus);
    setLoading(false);
    
    // Try to fetch from API in background (non-blocking)
    fetchSyllabus();
  }, []);

  const fetchSyllabus = async () => {
    try {
      const response = await ApiService.getSyllabus();
      
      if (response.success && response.data) {
        setSyllabus(response.data.syllabus || fallbackSyllabus);
        // Silent update - no toast to avoid interrupting user
      } else {
        console.warn('Failed to fetch syllabus from API, using fallback data:', response.error);
      }
    } catch (error) {
      console.warn('Failed to fetch syllabus from API, using fallback data:', error);
      // Silent fallback - no toast to avoid interrupting user
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

  const handleTopicClick = (subject: string, chapter: string, topic: string) => {
    onTopicSelect({ subject, chapter, topic });
  };

  // Filter syllabus based on search query
  const filteredSyllabus = syllabus.map(subject => ({
    ...subject,
    chapters: subject.chapters.map(chapter => ({
      ...chapter,
      topics: chapter.topics.filter(topic =>
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
          {filteredSyllabus.map((subject) => (
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
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="font-medium text-left truncate">{subject.name}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {subject.chapters.length} chapters
                      </Badge>
                    </div>
                    </Button>
                  </CollapsibleTrigger>
                  
                <CollapsibleContent className="space-y-1 ml-4">
                    {subject.chapters.map((chapter) => (
                      <div key={chapter.id} className="space-y-1">
                        <Collapsible
                          open={openChapters[chapter.id]}
                          onOpenChange={() => toggleChapter(chapter.id)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                            className="w-full justify-start h-auto p-2 hover:bg-accent/30 syllabus-chapter"
                            >
                              {openChapters[chapter.id] ? (
                                <ChevronDown className="h-3 w-3 mr-2 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="h-3 w-3 mr-2 flex-shrink-0" />
                              )}
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FileText className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm text-left truncate">{chapter.name}</span>
                              <Badge variant="outline" className="ml-auto text-xs">
                                {chapter.topics.length} topics
                              </Badge>
                            </div>
                            </Button>
                          </CollapsibleTrigger>
                          
                        <CollapsibleContent className="space-y-1 ml-4">
                            {chapter.topics.map((topic) => (
                              <div key={topic.id} className="space-y-1">
                                  <Collapsible
                                    open={openTopics[topic.id]}
                                    onOpenChange={() => toggleTopic(topic.id)}
                                  >
                                    <CollapsibleTrigger asChild>
                                      <Button
                                        variant="ghost"
                                    className="w-full justify-start h-auto p-2 hover:bg-accent/20 syllabus-topic"
                                      >
                                        {openTopics[topic.id] ? (
                                          <ChevronDown className="h-3 w-3 mr-2 flex-shrink-0" />
                                        ) : (
                                          <ChevronRight className="h-3 w-3 mr-2 flex-shrink-0" />
                                        )}
                                    <span className="text-sm text-left truncate">{topic.name}</span>
                                    {topic.subtopics && topic.subtopics.length > 0 && (
                                      <Badge variant="outline" className="ml-auto text-xs">
                                        {topic.subtopics.length} subtopics
                                      </Badge>
                                    )}
                                      </Button>
                                    </CollapsibleTrigger>
                                    
                                <CollapsibleContent className="space-y-1 ml-4">
                                  {topic.subtopics && topic.subtopics.map((subtopic, index) => (
                                        <Button
                                      key={index}
                                          variant="ghost"
                                      className="w-full justify-start h-auto p-2 text-xs hover:bg-primary/10 hover:text-primary syllabus-subtopic"
                                      onClick={() => handleTopicClick(subject.name, chapter.name, subtopic)}
                                        >
                                      <div className="w-1 h-1 bg-muted-foreground rounded-full mr-2 flex-shrink-0" />
                                      <span className="text-left truncate">{subtopic}</span>
                                        </Button>
                                      ))}
                                    </CollapsibleContent>
                                  </Collapsible>
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};