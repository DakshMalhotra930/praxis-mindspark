// Updated by DakshMalhotra930 for complete backend integration
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Send, Brain, Calendar, Target, Clock, BookOpen, Loader2, Crown, Lightbulb, CheckCircle } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useAuth } from '@/hooks/useAuth';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useToast } from '@/hooks/use-toast';
import { ApiService, type ChatResponse, type StudyPlanResponse, type StudyPlan } from '@/lib/api';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}


export const DeepStudyPlan = () => {
  const { user } = useAuth();
  const { trackUsage, usageStatus } = useUsageTracking();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null);
  const [planGenerating, setPlanGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      type: 'assistant',
      content: `# Welcome to Deep Study Plan! 📚

I'm your AI study planner, ready to create personalized JEE preparation plans based on your specific needs and goals.

**🎯 What I can help you with:**

**📋 Personalized Study Plans**
- Custom schedules based on your timeline
- Subject-wise focus areas
- Goal-oriented milestones
- Weakness-driven preparation

**📊 Smart Planning**
- Time management strategies
- Revision cycles
- Mock test schedules
- Progress tracking

**💬 Interactive Planning**
- Chat-based plan creation
- Real-time adjustments
- Continuous feedback
- Plan refinements

**To get started, tell me about:**
- How much time you have for JEE preparation?
- Which subjects need more focus (Physics, Chemistry, Mathematics)?
- Your current preparation level (beginner, intermediate, advanced)?
- Specific topics you find challenging?
- Your target JEE score or rank?
- Any specific study preferences or constraints?

Let's create a study plan that's perfect for you! 🚀`,
      timestamp: new Date(),
    };

    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async (messageContent: string) => {
    if (!user?.user_id || !messageContent.trim()) {
      return;
    }

    // Check usage limits
    if (usageStatus && !usageStatus.canUseFeature) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your daily limit. Upgrade to Pro for unlimited access.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Track usage
      const canProceed = await trackUsage('study_plan_chat');
      if (!canProceed) {
        toast({
          title: "Usage Limit Reached",
          description: "You've reached your daily limit. Upgrade to Pro for unlimited access.",
          variant: "destructive",
        });
        return;
      }

      const response = await ApiService.studyPlanChat({
        user_id: user.user_id,
        message: messageContent,
        context: messages.slice(-5), // Send last 5 messages for context
        current_plan: currentPlan,
      });

      let assistantContent = '';
      
      if (response.success && response.data) {
        assistantContent = response.data.response || 'I apologize, but I encountered an issue processing your request.';
      } else {
        // Fallback response
        assistantContent = generateFallbackResponse(messageContent);
      }

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        type: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        type: 'assistant',
        content: "I'm sorry, I encountered a technical issue. Please try asking your question again. I'm here to help you create the perfect study plan!",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('time') || lowerInput.includes('schedule')) {
      return `# Time Management for JEE Preparation ⏰

Based on your available time, here's a general approach:

**📅 Daily Schedule Template:**
- **Morning (2-3 hours)**: Fresh mind for Mathematics
- **Afternoon (2-3 hours)**: Physics concepts and problems
- **Evening (2-3 hours)**: Chemistry theory and reactions
- **Night (1 hour)**: Revision and quick recap

**🗓️ Weekly Pattern:**
- **Monday-Tuesday**: Focus on weak subjects
- **Wednesday-Thursday**: Balanced approach
- **Friday**: Revision and problem solving
- **Saturday**: Mock tests and analysis
- **Sunday**: Light revision and planning

Could you tell me your specific available hours per day so I can create a more detailed plan?`;
    }
    
    if (lowerInput.includes('weak') || lowerInput.includes('difficult') || lowerInput.includes('challenging')) {
      return `# Addressing Weak Areas 🎯

Let me help you strengthen your weak subjects:

**🔍 Assessment Strategy:**
1. Take diagnostic tests for each subject
2. Identify specific topics causing trouble
3. Analyze error patterns
4. Create targeted practice plans

**📚 Subject-wise Approaches:**

**Physics**: Start with concept clarity, then numerical practice
**Chemistry**: Focus on NCERT, then advanced problems  
**Mathematics**: Practice diverse problem types daily

**💪 Improvement Plan:**
- Dedicate 40% time to weak areas
- 30% to moderate areas  
- 30% to strong areas for maintenance

Which specific subjects or topics are you finding most challenging? I'll create a targeted improvement plan for you.`;
    }
    
    if (lowerInput.includes('rank') || lowerInput.includes('score') || lowerInput.includes('target')) {
      return `# Target-Based Study Planning 🎯

Let me help you create a goal-oriented study plan:

**🏆 Rank-wise Preparation Strategy:**

**Top 1000 Rank:**
- 8-10 hours daily study
- Advanced problem solving
- Multiple mock tests weekly
- Regular performance analysis

**Top 5000 Rank:**
- 6-8 hours daily study
- Strong NCERT foundation
- Regular practice tests
- Focused weak area improvement

**Top 10000 Rank:**
- 5-6 hours daily study
- Solid concept building
- Weekly mock tests
- Consistent revision

What's your target rank or score? I'll create a specific strategy to help you achieve it!`;
    }
    
    return `# Let's Create Your Perfect Study Plan! 📋

Thank you for sharing that information! To create the most effective study plan for you, I need to understand your situation better.

**🤔 Help me understand:**

**Time Assessment:**
- How many hours can you dedicate daily?
- How many months until your JEE exam?
- Any specific time constraints?

**Current Level:**
- Which topics are you comfortable with?
- What subjects need the most work?
- Have you taken any practice tests?

**Goals & Preferences:**
- Target rank or percentile?
- Preferred study methods?
- Any coaching classes or resources you're using?

The more details you share, the better I can tailor your study plan. What would you like to focus on first?`;
  };

  const generateStudyPlan = async () => {
    if (!user?.user_id || messages.length < 3) {
      toast({
        title: "More Information Needed",
        description: "Please chat a bit more so I can understand your needs better.",
        variant: "destructive",
      });
      return;
    }

    // Check usage limits
    if (usageStatus && !usageStatus.canUseFeature) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your daily limit. Upgrade to Pro for unlimited access.",
        variant: "destructive",
      });
      return;
    }

    setPlanGenerating(true);

    try {
      // Track usage
      const canProceed = await trackUsage('study_plan_generation');
      if (!canProceed) {
        toast({
          title: "Usage Limit Reached",
          description: "You've reached your daily limit. Upgrade to Pro for unlimited access.",
          variant: "destructive",
        });
        return;
      }

      const response = await ApiService.generateStudyPlan({
        user_id: user.user_id,
        chat_history: messages,
        preferences: {
          subjects: ['Physics', 'Chemistry', 'Mathematics'],
          duration: 'flexible',
          intensity: 'high'
        }
      });

      if (response.success && response.data) {
        setCurrentPlan(response.data.study_plan);
        toast({
          title: "Study Plan Generated!",
          description: "Your personalized JEE study plan is ready.",
        });
      } else {
        // Generate fallback plan
        const fallbackPlan: StudyPlan = {
          id: `plan_${Date.now()}`,
          title: "Comprehensive JEE Preparation Plan",
          description: "A balanced approach to JEE preparation covering all subjects with focus on problem-solving and concept clarity.",
          duration: "6 months",
          subjects: ["Physics", "Chemistry", "Mathematics"],
          goals: [
            "Master fundamental concepts",
            "Develop problem-solving skills",
            "Achieve target rank",
            "Build exam temperament"
          ],
          schedule: [
            {
              week: 1,
              topics: ["Mechanics basics", "Atomic structure", "Coordinate geometry"],
              goals: ["Foundation building", "Concept clarity"]
            },
            {
              week: 2,
              topics: ["Thermodynamics", "Chemical bonding", "Trigonometry"],
              goals: ["Problem solving", "Application practice"]
            },
            {
              week: 3,
              topics: ["Waves and optics", "Periodic table", "Calculus basics"],
              goals: ["Advanced concepts", "Integration skills"]
            },
            {
              week: 4,
              topics: ["Revision week", "Mock tests", "Weak area focus"],
              goals: ["Assessment", "Gap analysis"]
            }
          ],
          created_at: new Date().toISOString()
        };
        
        setCurrentPlan(fallbackPlan);
        
        toast({
          title: "Using Fallback Plan",
          description: "AI service unavailable. Generated a comprehensive study plan based on our conversation.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Plan generation failed:', error);
      toast({
        title: "Plan Generation Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setPlanGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim()) {
        sendMessage(inputMessage);
      }
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              Study Planner
            </Badge>
            {usageStatus?.isPremium && (
              <Badge variant="outline" className="border-warning/30">
                <Crown className="h-3 w-3 mr-1" />
                Pro
              </Badge>
            )}
          </div>
          
          <Button
            onClick={generateStudyPlan}
            disabled={planGenerating || messages.length < 3}
            className="bg-gradient-secondary hover:bg-gradient-primary hover-glow"
          >
            {planGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Target className="h-4 w-4 mr-2" />
            )}
            {planGenerating ? 'Generating...' : 'Generate Study Plan'}
          </Button>
        </div>

        {/* Messages */}
        <Card className="academic-card flex-1 flex flex-col">
          <CardContent className="p-0 flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-6 custom-scrollbar">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-4`}>
                      {message.type === 'assistant' ? (
                        <MarkdownRenderer content={message.content} />
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                      <div className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Creating your study plan...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tell me about your JEE preparation goals, timeline, and challenges..."
                  className="min-h-[60px] resize-none"
                  rows={2}
                />
                <Button
                  onClick={() => sendMessage(inputMessage)}
                  disabled={!inputMessage.trim() || isLoading}
                  className="hover-glow"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Study Plan Display */}
      {currentPlan && (
        <div className="lg:w-96 space-y-4">
          <Card className="academic-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Your Study Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{currentPlan.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{currentPlan.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <Clock className="h-4 w-4 mx-auto mb-1" />
                  <div className="text-sm font-medium">{currentPlan.duration}</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
                <div className="text-center p-3 bg-secondary/10 rounded-lg">
                  <BookOpen className="h-4 w-4 mx-auto mb-1" />
                  <div className="text-sm font-medium">{currentPlan.subjects.length}</div>
                  <div className="text-xs text-muted-foreground">Subjects</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Key Goals:</h4>
                <ul className="space-y-1">
                  {currentPlan.goals.map((goal, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Weekly Schedule:</h4>
                <ScrollArea className="h-40 custom-scrollbar">
                  <div className="space-y-2">
                    {currentPlan.schedule.map((week, index) => (
                      <div key={index} className="p-2 bg-muted/50 rounded text-sm">
                        <div className="font-medium">Week {week.week}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {week.topics.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <Button variant="outline" className="w-full hover-glow">
                <Lightbulb className="h-4 w-4 mr-2" />
                Customize Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};