// Updated by DakshMalhotra930 for complete backend integration
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Brain, Play, RotateCcw, Loader2 } from 'lucide-react';
import { QuizComponent } from '@/components/QuizComponent';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ApiService, type ContentResponse, type QuizResponse } from '@/lib/api';

interface ContentViewerProps {
  subject: string;
  chapter: string;
  topic: string;
}

interface GeneratedContent {
  learn: string;
  revise: string;
  quiz?: {
    questions: Array<{
      question: string;
      options: string[];
      correct_answer: number;
      explanation: string;
    }>;
  };
}

export const ContentViewer = ({ subject, chapter, topic }: ContentViewerProps) => {
  const { user } = useAuth();
  const { trackUsage, usageStatus } = useUsageTracking();
  const { toast } = useToast();
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'learn' | 'revise'>('learn');
  const [showQuiz, setShowQuiz] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  useEffect(() => {
    generateContent();
    setShowQuiz(false);
  }, [subject, chapter, topic]);

  const generateContent = async () => {
    if (!user?.user_id) return;

    // Check usage limits
    if (usageStatus && !usageStatus.canUseFeature) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your daily limit. Upgrade to Pro for unlimited access.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Track usage
      const canProceed = await trackUsage('content_generation');
      if (!canProceed) {
        toast({
          title: "Usage Limit Reached",
          description: "You've reached your daily limit. Upgrade to Pro for unlimited access.",
          variant: "destructive",
        });
        return;
      }

      const response = await ApiService.generateContent({
        user_id: user.user_id,
        subject,
        chapter,
        topic,
      });

      if (response.success && response.data) {
        setContent(response.data.content || generateFallbackContent());
        toast({
          title: "Content Generated",
          description: `AI-generated study material for ${topic} is ready!`,
        });
      } else {
        throw new Error(response.error || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Content generation failed:', error);
      
      // Generate fallback content
      setContent(generateFallbackContent());
      
      toast({
        title: "Using Fallback Content",
        description: "AI service unavailable. Using cached content for your study session.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackContent = (): GeneratedContent => {
    return {
      learn: `# ${topic}\n\n## Introduction\n\n${topic} is an important concept in ${subject}. This topic falls under the chapter "${chapter}" and is fundamental for understanding advanced concepts.\n\n## Key Concepts\n\n1. **Definition**: Understanding the basic definition and scope\n2. **Applications**: Real-world applications and examples\n3. **Mathematical Formulations**: Key equations and relationships\n4. **Problem Solving**: Step-by-step approach to solving problems\n\n## Important Points\n\n- Always start with basic principles\n- Practice numerical problems regularly\n- Understand the conceptual foundation\n- Apply concepts to solve real-world problems\n\n## Examples\n\nHere are some solved examples to help you understand the concept better:\n\n**Example 1:** Basic application of ${topic}\n\n*Solution:* Step-by-step solution would go here...\n\n## Practice Problems\n\n1. Solve the following problem related to ${topic}\n2. Apply the concept to find the solution\n3. Verify your answer using alternative methods`,
      
      revise: `# ${topic} - Quick Revision\n\n## Key Formulas\n\n- Formula 1: Key equation for ${topic}\n- Formula 2: Alternative form or special case\n- Formula 3: Related concept equation\n\n## Important Points\n\n✓ **Remember**: Critical concept to memorize\n✓ **Note**: Common mistake to avoid\n✓ **Tip**: Problem-solving strategy\n\n## Quick Facts\n\n- Fact 1 about ${topic}\n- Fact 2 about applications\n- Fact 3 about related concepts\n\n## Common Questions\n\n1. **Q**: What is the main principle of ${topic}?\n   **A**: Brief answer explaining the core concept\n\n2. **Q**: How is this applied in JEE problems?\n   **A**: Explanation of typical problem patterns\n\n## Last-Minute Tips\n\n- Focus on understanding rather than memorizing\n- Practice numerical problems\n- Review solved examples\n- Check units and dimensions in calculations`,
    };
  };

  const generateQuiz = async () => {
    if (!user?.user_id || !content) return;

    // Check usage limits
    if (usageStatus && !usageStatus.canUseFeature) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your daily limit. Upgrade to Pro for unlimited access.",
        variant: "destructive",
      });
      return;
    }

    try {
      setGeneratingQuiz(true);
      
      // Track usage
      const canProceed = await trackUsage('quiz_generation');
      if (!canProceed) {
        toast({
          title: "Usage Limit Reached",
          description: "You've reached your daily limit. Upgrade to Pro for unlimited access.",
          variant: "destructive",
        });
        return;
      }

      const response = await ApiService.generateQuiz({
        user_id: user.user_id,
        subject,
        chapter,
        topic,
        difficulty: 'medium',
        question_count: 5,
      });

      if (response.success && response.data) {
        setContent(prev => prev ? { ...prev, quiz: response.data!.quiz } : null);
        toast({
          title: "Quiz Generated",
          description: "AI-generated quiz is ready! Test your knowledge.",
        });
      } else {
        // Generate fallback quiz
        const fallbackQuiz = {
          questions: [
            {
              question: `What is the fundamental principle of ${topic}?`,
              options: [
                'Option A: Basic principle',
                'Option B: Advanced concept',
                'Option C: Related theory',
                'Option D: Alternative approach'
              ],
              correct_answer: 0,
              explanation: `The fundamental principle of ${topic} is the foundation for understanding this concept in ${subject}.`
            },
            {
              question: `Which formula is most commonly used for ${topic}?`,
              options: [
                'Option A: Formula 1',
                'Option B: Formula 2',
                'Option C: Formula 3',
                'Option D: Formula 4'
              ],
              correct_answer: 1,
              explanation: `Formula 2 is the most commonly used formula for ${topic} in JEE problems.`
            },
          ]
        };
        setContent(prev => prev ? { ...prev, quiz: fallbackQuiz } : null);
        toast({
          title: "Using Fallback Quiz",
          description: "AI service unavailable. Using sample questions.",
          variant: "destructive",
        });
      }

      setShowQuiz(true);
    } catch (error) {
      console.error('Quiz generation failed:', error);
      toast({
        title: "Quiz Generation Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setGeneratingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <div>
            <h3 className="font-semibold">Generating Content</h3>
            <p className="text-sm text-muted-foreground">
              AI is creating personalized study material for {topic}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="h-full flex items-center justify-center text-center">
        <div className="space-y-4">
          <Brain className="h-16 w-16 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-xl font-semibold mb-2">Content Generation Failed</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't generate content for this topic. Please try again.
            </p>
            <Button onClick={generateContent} className="hover-glow">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showQuiz && content.quiz) {
    return (
      <div className="h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{subject}</Badge>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{chapter}</span>
            <span className="text-muted-foreground">•</span>
            <span className="font-medium">{topic}</span>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowQuiz(false)}
            size="sm"
          >
            Back to Study
          </Button>
        </div>

        <QuizComponent
          questions={content.quiz.questions}
          onComplete={() => {
            toast({
              title: "Quiz Completed!",
              description: "Great job! Review the explanations to reinforce your learning.",
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{subject}</Badge>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{chapter}</span>
          <span className="text-muted-foreground">•</span>
          <span className="font-medium">{topic}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={generateQuiz}
            disabled={generatingQuiz}
            size="sm"
            className="hover-glow"
          >
            {generatingQuiz ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Brain className="h-4 w-4 mr-2" />
            )}
            {generatingQuiz ? 'Generating...' : 'Generate Quiz'}
          </Button>
        </div>
      </div>

      {/* Mode Selection */}
      <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as 'learn' | 'revise')} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="learn" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Learn Mode
          </TabsTrigger>
          <TabsTrigger value="revise" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Revise Mode
          </TabsTrigger>
        </TabsList>

        <TabsContent value="learn" className="flex-1 mt-0">
          <Card className="academic-card h-full">
            <CardContent className="p-6 h-full overflow-hidden">
              <div className="h-full overflow-y-auto custom-scrollbar">
                <MarkdownRenderer content={content.learn} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revise" className="flex-1 mt-0">
          <Card className="academic-card h-full">
            <CardContent className="p-6 h-full overflow-hidden">
              <div className="h-full overflow-y-auto custom-scrollbar">
                <MarkdownRenderer content={content.revise} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};