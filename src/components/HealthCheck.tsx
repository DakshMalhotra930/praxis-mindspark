import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw, Loader2, Server, Wifi, Database } from 'lucide-react';
import { ApiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface HealthStatus {
  api: 'checking' | 'healthy' | 'unhealthy';
  supabase: 'checking' | 'healthy' | 'unhealthy';
  overall: 'checking' | 'healthy' | 'unhealthy';
  lastChecked: Date | null;
  error?: string;
}

export const HealthCheck = () => {
  const { toast } = useToast();
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    api: 'checking',
    supabase: 'checking',
    overall: 'checking',
    lastChecked: null,
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkApiHealth = async (): Promise<boolean> => {
    try {
      const response = await ApiService.healthCheck();
      return response.success;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  };

  const checkSupabaseHealth = async (): Promise<boolean> => {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase.from('_health_check').select('*').limit(1);
      return !error;
    } catch (error) {
      console.error('Supabase health check failed:', error);
      return false;
    }
  };

  const performHealthCheck = async () => {
    setIsChecking(true);
    setHealthStatus(prev => ({
      ...prev,
      api: 'checking',
      supabase: 'checking',
      overall: 'checking',
    }));

    try {
      // Check API health
      const apiHealthy = await checkApiHealth();
      
      // Check Supabase health
      const supabaseHealthy = await checkSupabaseHealth();

      const overallHealthy = apiHealthy && supabaseHealthy;

      setHealthStatus({
        api: apiHealthy ? 'healthy' : 'unhealthy',
        supabase: supabaseHealthy ? 'healthy' : 'unhealthy',
        overall: overallHealthy ? 'healthy' : 'unhealthy',
        lastChecked: new Date(),
        error: overallHealthy ? undefined : 'One or more services are unavailable',
      });

      toast({
        title: overallHealthy ? "All Systems Healthy" : "Service Issues Detected",
        description: overallHealthy 
          ? "All backend services are running properly." 
          : "Some services may be experiencing issues.",
        variant: overallHealthy ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus(prev => ({
        ...prev,
        api: 'unhealthy',
        supabase: 'unhealthy',
        overall: 'unhealthy',
        lastChecked: new Date(),
        error: 'Health check failed',
      }));

      toast({
        title: "Health Check Failed",
        description: "Unable to verify service status.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    performHealthCheck();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'unhealthy':
        return <XCircle className="h-4 w-4 text-error" />;
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-success text-white">Healthy</Badge>;
      case 'unhealthy':
        return <Badge variant="destructive">Unhealthy</Badge>;
      default:
        return <Badge variant="outline">Checking...</Badge>;
    }
  };

  return (
    <Card className="academic-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Health
          </CardTitle>
          <Button
            onClick={performHealthCheck}
            disabled={isChecking}
            size="sm"
            variant="outline"
            className="hover-glow"
          >
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(healthStatus.overall)}
            <div>
              <div className="font-medium">Overall Status</div>
              <div className="text-sm text-muted-foreground">
                {healthStatus.overall === 'checking' && 'Checking services...'}
                {healthStatus.overall === 'healthy' && 'All systems operational'}
                {healthStatus.overall === 'unhealthy' && 'Service issues detected'}
              </div>
            </div>
          </div>
          {getStatusBadge(healthStatus.overall)}
        </div>

        {/* Individual Services */}
        <div className="space-y-3">
          {/* API Service */}
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <Wifi className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Fly.io API</div>
                <div className="text-sm text-muted-foreground">
                  Backend AI services
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(healthStatus.api)}
              {getStatusBadge(healthStatus.api)}
            </div>
          </div>

          {/* Supabase Service */}
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <Database className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Supabase</div>
                <div className="text-sm text-muted-foreground">
                  Authentication & Database
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(healthStatus.supabase)}
              {getStatusBadge(healthStatus.supabase)}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {healthStatus.error && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
            <div className="text-sm text-error font-medium">Error Details</div>
            <div className="text-xs text-error/80 mt-1">{healthStatus.error}</div>
          </div>
        )}

        {/* Last Checked */}
        {healthStatus.lastChecked && (
          <div className="text-xs text-muted-foreground text-center">
            Last checked: {healthStatus.lastChecked.toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
