import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Brain, Zap, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    google: any;
  }
}

const GOOGLE_CLIENT_ID = "your-google-client-id"; // This should be replaced with actual client ID

export const GoogleLogin = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleLogin,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'filled_blue',
          size: 'large',
          text: 'signin_with',
          shape: 'pill',
          width: '100%',
        });
      }
    };

    const loadGoogleScript = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleSignIn;
        document.head.appendChild(script);
      } else {
        initializeGoogleSignIn();
      }
    };

    loadGoogleScript();
  }, []);

  const handleGoogleLogin = async (response: any) => {
    try {
      await login(response);
      toast({
        title: "Welcome to Praxis AI!",
        description: "You've successfully signed in to your JEE prep dashboard.",
      });
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login Failed",
        description: "There was an issue signing you in. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleManualLogin = () => {
    // For demo purposes, create a mock user
    const mockUser = {
      user_id: 'demo_user_' + Date.now(),
      email: 'demo@praxisai.com',
      name: 'Demo Student',
      subscription_status: 'FREE' as const,
      is_premium: false,
    };

    try {
      localStorage.setItem('authToken', 'demo_token');
      localStorage.setItem('userData', JSON.stringify(mockUser));
      
      // Trigger re-authentication check
      window.location.reload();
    } catch (error) {
      console.error('Demo login failed:', error);
      toast({
        title: "Demo Login Failed",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="gradient-text-primary">Praxis AI</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Your AI-powered JEE preparation companion. Master Physics, Chemistry, and Mathematics with personalized study plans and intelligent tutoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="academic-card p-6 text-center">
              <Brain className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">AI Tutoring</h3>
              <p className="text-sm text-muted-foreground">
                Get instant help with concepts and problem-solving
              </p>
            </div>
            <div className="academic-card p-6 text-center">
              <Target className="h-8 w-8 mx-auto mb-3 text-secondary" />
              <h3 className="font-semibold mb-2">Personalized</h3>
              <p className="text-sm text-muted-foreground">
                Adaptive learning paths based on your progress
              </p>
            </div>
            <div className="academic-card p-6 text-center">
              <Zap className="h-8 w-8 mx-auto mb-3 text-warning" />
              <h3 className="font-semibold mb-2">Comprehensive</h3>
              <p className="text-sm text-muted-foreground">
                Complete syllabus coverage with practice tests
              </p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="academic-card max-w-md mx-auto w-full">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to continue your JEE preparation journey
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div ref={googleButtonRef} className="w-full"></div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with demo
                </span>
              </div>
            </div>

            <Button 
              onClick={handleManualLogin}
              variant="outline" 
              className="w-full hover-glow"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Demo Login
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By signing in, you agree to our Terms of Service and Privacy Policy.
              Free users get 5 uses per day.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};