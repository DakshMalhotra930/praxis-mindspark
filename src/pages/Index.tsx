import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Settings, Crown, BookOpen, Lightbulb } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UsageProgressDisplay } from '@/components/UsageProgressDisplay';
import { SyllabusExplorer } from '@/components/SyllabusExplorer';
import { ContentViewer } from '@/components/ContentViewer';
import { AgenticStudyMode } from '@/components/AgenticStudyMode';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('syllabus');
  const [selectedTopic, setSelectedTopic] = useState<{
    subject: string;
    chapter: string;
    topic: string;
  } | null>(null);

  const handleTopicSelect = (subject: string, chapter: string, topic: string) => {
    setSelectedTopic({ subject, chapter, topic });
    setActiveTab('syllabus'); // Switch to syllabus tab when topic is selected
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-header border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="gradient-text-primary text-2xl font-bold">
              Praxis AI
            </h1>
            
            <nav className="hidden md:flex items-center gap-4">
              <Link 
                to="/pricing" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-glow"
              >
                Pricing
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <UsageProgressDisplay className="hidden md:block" showUpgrade />
            
            <div className="flex items-center gap-2 text-sm">
              <div className="text-right hidden sm:block">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="hover-glow"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Usage Display */}
      <div className="md:hidden p-4">
        <UsageProgressDisplay showUpgrade />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
          
          {/* Left Sidebar - Syllabus Explorer */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="academic-card h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  JEE Syllabus
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-5rem)] overflow-hidden">
                <SyllabusExplorer onTopicSelect={handleTopicSelect} />
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="syllabus" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Syllabus Study
                </TabsTrigger>
                <TabsTrigger value="deep-study" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Deep Study
                </TabsTrigger>
              </TabsList>

              <TabsContent value="syllabus" className="h-[calc(100%-4rem)]">
                <Card className="academic-card h-full">
                  <CardContent className="p-6 h-full">
                    {selectedTopic ? (
                      <ContentViewer
                        subject={selectedTopic.subject}
                        chapter={selectedTopic.chapter}
                        topic={selectedTopic.topic}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-center">
                        <div className="space-y-4">
                          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground" />
                          <div>
                            <h3 className="text-xl font-semibold mb-2">
                              Select a Topic to Begin
                            </h3>
                            <p className="text-muted-foreground max-w-md">
                              Choose a subject, chapter, and topic from the sidebar to start
                              your study session with AI-powered content and quizzes.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="deep-study" className="h-[calc(100%-4rem)]">
                <Card className="academic-card h-full">
                  <CardContent className="p-6 h-full">
                    <AgenticStudyMode />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
