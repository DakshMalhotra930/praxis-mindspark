// Updated by DakshMalhotra930 for complete backend integration
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Send, Brain, Image, BookOpen, Loader2, Crown, Lightbulb } from 'lucide-react';
import { ImageUpload } from '@/components/ImageUpload';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useAuth } from '@/hooks/useAuth';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useToast } from '@/hooks/use-toast';
import { ApiService, type ChatResponse, type ImageSolveResponse } from '@/lib/api';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageData?: string;
}

interface StudySession {
  session_id: string;
  subject: string;
  chapter: string;
  topic?: string;
  session_type: 'deep_study' | 'quick_review';
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  last_activity: string;
}


export const AgenticStudyMode = () => {
  const { user } = useAuth();
  const { trackUsage, usageStatus } = useUsageTracking();
  const { toast } = useToast();
  
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startNewSession = async (sessionType: 'deep_study' | 'quick_review' = 'deep_study') => {
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
      setIsLoading(true);
      
      // Track usage
      const canProceed = await trackUsage('deep_study_session');
      if (!canProceed) {
        toast({
          title: "Usage Limit Reached",
          description: "You've reached your daily limit. Upgrade to Pro for unlimited access.",
          variant: "destructive",
        });
        return;
      }

      const sessionId = `session_${Date.now()}`;
      const newSession: StudySession = {
        session_id: sessionId,
        subject: 'General',
        chapter: 'AI Tutoring',
        session_type: sessionType,
        status: 'active',
        created_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
      };

      setCurrentSession(newSession);
      
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        type: 'assistant',
        content: `# Welcome to Deep Study Mode! 🎓

I'm your AI tutor, ready to help you master JEE concepts. Here's what I can do:

**📚 Study Support**
- Explain complex concepts in simple terms
- Break down difficult problems step by step
- Create personalized study plans
- Generate practice questions

**🖼️ Image Problem Solving**
- Upload images of problems from textbooks
- Get detailed solutions with explanations
- Understand diagram-based questions

**🎯 Personalized Learning**
- Adapt to your learning pace
- Focus on your weak areas
- Provide targeted practice

**How would you like to start your study session today?**

You can:
- Ask me to explain any JEE topic
- Upload an image of a problem you're stuck on
- Request a study plan for specific subjects
- Ask for practice questions on any topic

What would you like to study first?`,
        timestamp: new Date(),
      };

      setMessages([welcomeMessage]);
      
      toast({
        title: "Study Session Started",
        description: "Your AI tutor is ready to help you learn!",
      });
    } catch (error) {
      console.error('Failed to start session:', error);
      toast({
        title: "Session Start Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageContent: string, imageData?: string) => {
    if (!currentSession || !user?.user_id || (!messageContent.trim() && !imageData)) {
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
      imageData,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowImageUpload(false);

    try {
      // Track usage
      const canProceed = await trackUsage('ai_interaction', currentSession.session_id);
      if (!canProceed) {
        toast({
          title: "Usage Limit Reached",
          description: "You've reached your daily limit. Upgrade to Pro for unlimited access.",
          variant: "destructive",
        });
        return;
      }

      let response;
      
      if (imageData) {
        // Image problem solving
        response = await ApiService.solveImage({
          user_id: user.user_id,
          session_id: currentSession.session_id,
          image_data: imageData,
          question: messageContent,
        });
      } else {
        // Regular chat
        response = await ApiService.chat({
          user_id: user.user_id,
          session_id: currentSession.session_id,
          message: messageContent,
          context: messages.slice(-5), // Send last 5 messages for context
        });
      }

      let assistantContent = '';
      
      if (response.success && response.data) {
        assistantContent = response.data.response || response.data.solution || 'I apologize, but I encountered an issue processing your request.';
      } else {
        // Fallback response
        if (imageData) {
          assistantContent = `I can see you've uploaded an image. While I can't process the image right now, I'd be happy to help you with the problem if you can describe it to me or type out the question.

Here's how I typically approach problem-solving:

1. **Identify the concept** - What topic does this problem cover?
2. **List the given information** - What data do we have?
3. **Determine what to find** - What is the question asking for?
4. **Choose the right formula/method** - Which approach should we use?
5. **Solve step by step** - Work through the solution methodically
6. **Verify the answer** - Check if the result makes sense

Please describe the problem, and I'll help you solve it step by step!`;
        } else {
          assistantContent = generateFallbackResponse(messageContent);
        }
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
        content: "I'm sorry, I encountered a technical issue. Please try asking your question again. I'm here to help you with your JEE preparation!",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('physics')) {
      return `# Physics Help 📐

I'd be happy to help you with Physics! Physics is one of the most important subjects for JEE, covering:

**Major Topics:**
- Mechanics (Kinematics, Dynamics, Energy)
- Thermodynamics
- Optics and Waves
- Electricity and Magnetism
- Modern Physics

What specific physics topic would you like to explore? I can:
- Explain concepts with examples
- Help solve numerical problems
- Provide practice questions
- Create study plans

Just let me know what you'd like to focus on!`;
    }
    
    if (lowerInput.includes('chemistry')) {
      return `# Chemistry Help ⚗️

Chemistry is fascinating! Let me help you master it for JEE:

**Key Areas:**
- Physical Chemistry (Thermodynamics, Kinetics)
- Organic Chemistry (Reactions, Mechanisms)
- Inorganic Chemistry (Periodic Properties, Compounds)

**How I can help:**
- Break down complex reactions
- Explain mechanisms step by step
- Help with numerical problems
- Provide memory techniques

What chemistry topic interests you today?`;
    }
    
    if (lowerInput.includes('math') || lowerInput.includes('mathematics')) {
      return `# Mathematics Help 📊

Mathematics is the foundation of JEE success! I'm here to help with:

**Core Topics:**
- Algebra and Number Theory
- Calculus (Limits, Derivatives, Integrals)
- Coordinate Geometry
- Trigonometry
- Probability and Statistics

**My approach:**
- Step-by-step solutions
- Multiple solving methods
- Conceptual understanding
- Practice problem generation

Which mathematical concept would you like to work on?`;
    }
    
    if (lowerInput.includes('study plan') || lowerInput.includes('preparation')) {
      return `# Study Plan Creation 📅

I'll help you create an effective JEE study plan! Here's my approach:

**Assessment Phase:**
1. Current preparation level
2. Strengths and weaknesses
3. Available time until exam
4. Preferred study methods

**Plan Components:**
- Daily/weekly schedule
- Topic-wise allocation
- Practice and revision cycles
- Mock test schedule

**To create your personalized plan, tell me:**
- How much time do you have for preparation?
- Which subjects need more focus?
- What's your current preparation level?
- Any specific challenges you're facing?

Let's build a plan that works for you!`;
    }
    
    return `# I'm Here to Help! 🎓

Thank you for your question! While I'm processing your request, here are some ways I can assist you:

**📚 Subject Help**
- Physics, Chemistry, Mathematics
- Concept explanations
- Problem solving
- Formula derivations

**🎯 Study Support**
- Personalized study plans
- Practice questions
- Revision strategies
- Exam tips

**🔍 Problem Solving**
- Step-by-step solutions
- Multiple approaches
- Conceptual understanding
- Common mistake prevention

Could you be more specific about what you'd like help with? I'm ready to dive deep into any JEE topic with you!`;
  };

  const handleImageUpload = (imageData: string) => {
    const message = inputMessage.trim() || "Please solve this problem for me.";
    sendMessage(message, imageData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim()) {
        sendMessage(inputMessage);
      }
    }
  };

  if (!currentSession) {
    return (
      <div className="h-full flex items-center justify-center text-center">
        <div className="space-y-6 max-w-md">
          <div className="space-y-4">
            <Brain className="h-16 w-16 mx-auto text-primary" />
            <div>
              <h3 className="text-xl font-semibold mb-2">AI Deep Study Mode</h3>
              <p className="text-muted-foreground">
                Start a personalized study session with your AI tutor. Get instant help
                with concepts, problem-solving, and study planning.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <Button
              onClick={() => startNewSession('deep_study')}
              disabled={isLoading}
              className="bg-gradient-primary hover:bg-gradient-secondary hover-glow"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Lightbulb className="h-4 w-4 mr-2" />
              )}
              Start Deep Study Session
            </Button>
            
            <Button
              variant="outline"
              onClick={() => startNewSession('quick_review')}
              disabled={isLoading}
              className="hover-glow"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Quick Review Session
            </Button>
          </div>

          {usageStatus && !usageStatus.isPremium && (
            <div className="text-xs text-center p-3 bg-warning/10 rounded-lg border border-warning/20">
              <p className="text-warning font-medium">
                Free Plan: {usageStatus.usageCount}/{usageStatus.usageLimit} uses today
              </p>
              <p className="text-muted-foreground">
                Upgrade to Pro for unlimited access
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Session Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
            <Brain className="h-3 w-3 mr-1" />
            AI Study Session
          </Badge>
          {usageStatus?.isPremium && (
            <Badge variant="outline" className="border-warning/30">
              <Crown className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          )}
        </div>
        
        <Button
          variant="outline"
          onClick={() => {
            setCurrentSession(null);
            setMessages([]);
          }}
          size="sm"
        >
          End Session
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
                    {message.imageData && (
                      <div className="mb-3">
                        <img
                          src={message.imageData}
                          alt="Uploaded problem"
                          className="max-w-full h-auto rounded border"
                        />
                      </div>
                    )}
                    
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
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            {showImageUpload && (
              <div className="mb-4">
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  onCancel={() => setShowImageUpload(false)}
                />
              </div>
            )}
            
            <div className="flex gap-2">
              <div className="flex-1">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={showImageUpload ? "Describe the problem or ask for help..." : "Ask me anything about JEE preparation..."}
                  disabled={isLoading}
                  rows={2}
                  className="resize-none"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  className="hover-glow"
                >
                  <Image className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={() => inputMessage.trim() && sendMessage(inputMessage)}
                  disabled={isLoading || (!inputMessage.trim() && !showImageUpload)}
                  size="sm"
                  className="hover-glow"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};