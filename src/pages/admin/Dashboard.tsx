import { useDashboard, useActivities } from '@/hooks/admin/useDashboard';
import { StatsOverview } from '@/components/admin/StatsOverview';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { ContentList } from '@/components/admin/ContentList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export function AdminDashboard() {
  const { stats, analytics, isLoading: statsLoading } = useDashboard();
  const { activities, isLoading: activitiesLoading } = useActivities();

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
