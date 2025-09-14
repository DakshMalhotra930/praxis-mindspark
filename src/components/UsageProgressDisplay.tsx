import { Crown, Clock, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface UsageProgressDisplayProps {
  className?: string;
  showUpgrade?: boolean;
}

export const UsageProgressDisplay = ({ className = "", showUpgrade = false }: UsageProgressDisplayProps) => {
  const { usageStatus, loading, refreshUsageStatus } = useUsageTracking();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshUsageStatus();
    setRefreshing(false);
  };

  if (loading || !usageStatus) {
    return (
      <Card className={`academic-card ${className}`}>
        <CardContent className="p-4">
          <div className="loading-shimmer h-6 w-full rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const getTimeUntilReset = () => {
    if (!usageStatus.resetTime) return null;
    
    const resetTime = new Date(usageStatus.resetTime);
    const now = new Date();
    const diff = resetTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Now';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (usageStatus.isPremium) {
    return (
      <Card className={`academic-card border-primary/20 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5 text-warning" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Praxis AI Pro</span>
                  <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
                    PRO
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Unlimited access • Premium features
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="hover-glow"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = (usageStatus.usageCount / usageStatus.usageLimit) * 100;
  const isLimitReached = usageStatus.usageCount >= usageStatus.usageLimit;
  const resetTime = getTimeUntilReset();

  return (
    <Card className={`academic-card ${isLimitReached ? 'border-warning/30' : ''} ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Free Plan</span>
                {showUpgrade && (
                  <Link to="/pricing">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2 hover-glow border-primary/20 hover:border-primary/40"
                    >
                      Upgrade to Pro
                    </Button>
                  </Link>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Daily usage: {usageStatus.usageCount} of {usageStatus.usageLimit} uses
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="hover-glow"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="progress-bar h-2">
              <div 
                className={`progress-fill h-full transition-all duration-500 ${
                  isLimitReached ? 'bg-gradient-to-r from-warning to-error' : ''
                }`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            
            {isLimitReached && resetTime && (
              <div className="flex items-center gap-1 text-xs text-warning">
                <Clock className="h-3 w-3" />
                <span>Resets in {resetTime}</span>
              </div>
            )}
          </div>

          {isLimitReached && (
            <div className="text-xs text-center p-2 bg-warning/10 rounded-lg border border-warning/20">
              <p className="text-warning font-medium">Daily limit reached</p>
              <p className="text-muted-foreground">
                <Link to="/pricing" className="hover:text-foreground transition-colors">
                  Upgrade to Pro for unlimited access
                </Link>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};