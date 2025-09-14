import { Check, Crown, ArrowLeft, Zap, Brain, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const features = {
    free: [
      '5 AI interactions per day',
      'Basic study materials',
      'Multiple choice quizzes',
      'Progress tracking',
      'Email support',
    ],
    pro: [
      'Unlimited AI interactions',
      'Advanced study materials',
      'Personalized study plans',
      'Image problem solving',
      'Deep study sessions',
      'Priority support',
      'Analytics dashboard',
      'Download study materials',
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover-glow">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Back to Dashboard</span>
            </Link>
            <div className="gradient-text-primary text-xl font-bold">
              Praxis AI
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-5xl font-bold tracking-tight">
              Choose Your <span className="gradient-text-primary">Learning Path</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Unlock your full potential with Praxis AI Pro. Get unlimited access to advanced AI tutoring,
              personalized study plans, and comprehensive JEE preparation tools.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Free Plan */}
            <Card className="academic-card relative">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Clock className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">Free Plan</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {features.free.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="academic-card relative border-primary/30 shadow-glow">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-primary text-primary-foreground px-4 py-1">
                  <Crown className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
              
              <CardHeader className="text-center pb-8">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Pro Plan</CardTitle>
                <CardDescription>For serious JEE aspirants</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {features.pro.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-primary hover:bg-gradient-secondary hover-glow">
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Pro?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Take your JEE preparation to the next level with advanced AI features
              designed for serious aspirants.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="academic-card p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Unlimited AI Tutoring</h3>
              <p className="text-muted-foreground">
                Get instant help with unlimited AI interactions. No daily limits,
                study as much as you want.
              </p>
            </div>

            <div className="academic-card p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-secondary">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Personalized Plans</h3>
              <p className="text-muted-foreground">
                AI-generated study plans tailored to your strengths, weaknesses,
                and exam timeline.
              </p>
            </div>

            <div className="academic-card p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-accent">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Advanced Features</h3>
              <p className="text-muted-foreground">
                Image problem solving, deep study sessions, analytics dashboard,
                and much more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You'll continue to have
                  access until the end of your billing period.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-sm text-muted-foreground">
                  We accept all major credit cards, UPI, net banking, and digital wallets
                  through Razorpay's secure payment gateway.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-sm text-muted-foreground">
                  Free users get 5 AI interactions per day. Pro users get access to
                  advanced features with unlimited usage.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">How does the AI tutoring work?</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI is trained specifically for JEE syllabus. It can explain concepts,
                  solve problems, create quizzes, and provide personalized guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Ready to Ace JEE?</h2>
            <p className="text-lg opacity-90">
              Join thousands of students who are already using Praxis AI to excel in their JEE preparation.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Start Your Journey Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;