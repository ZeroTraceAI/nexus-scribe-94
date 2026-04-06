import { useDashboard, useActivities } from '@/hooks/admin/useDashboard';
import { StatsOverview } from '@/components/admin/StatsOverview';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { ContentList } from '@/components/admin/ContentList';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Play, Clock, FileText, Wrench, TrendingUp } from 'lucide-react';

interface AutomationStatus {
  lastRun: string | null;
  nextRun: string;
  totalGenerated: number;
  blogsCount: number;
  toolsCount: number;
}

export function AdminDashboard() {
  const { stats, analytics, isLoading: statsLoading } = useDashboard();
  const { activities, isLoading: activitiesLoading } = useActivities();
  
  // Mock automation status - in production, fetch from API
  const automationStatus: AutomationStatus = {
    lastRun: new Date(Date.now() - 3600000).toISOString(),
    nextRun: new Date(Math.ceil(Date.now() / 3600000) * 3600000).toISOString(),
    totalGenerated: 47,
    blogsCount: 35,
    toolsCount: 12,
  };

  if (statsLoading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your site today.
        </p>
      </div>

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Content Automation Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Content Automation
              </CardTitle>
              <CardDescription>
                Automated content generation from Twitter & Reddit trends
              </CardDescription>
            </div>
            <Button size="sm" variant="outline">
              <Play className="h-4 w-4 mr-2" />
              Run Now
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Next Run</p>
                <p className="font-semibold">{format(new Date(automationStatus.nextRun), 'HH:mm')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Blogs Generated</p>
                <p className="font-semibold">{automationStatus.blogsCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Wrench className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Tools Created</p>
                <p className="font-semibold">{automationStatus.toolsCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Content</p>
                <p className="font-semibold">{automationStatus.totalGenerated}</p>
              </div>
            </div>
          </div>
          {automationStatus.lastRun && (
            <p className="mt-4 text-xs text-muted-foreground">
              Last run: {format(new Date(automationStatus.lastRun), 'MMM d, yyyy HH:mm')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Analytics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), 'MMM d')}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => format(new Date(value), 'MMMM d, yyyy')}
                />
                <Line
                  type="monotone"
                  dataKey="pageViews"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Page Views"
                />
                <Line
                  type="monotone"
                  dataKey="uniqueVisitors"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Unique Visitors"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity and Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivity activities={activities} isLoading={activitiesLoading} />

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="content">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="mt-4">
                <ContentList content={[]} isLoading={false} />
              </TabsContent>
              <TabsContent value="tools" className="mt-4">
                <ContentList content={[]} isLoading={false} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
