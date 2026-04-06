import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Wrench, Users, Eye, TrendingUp, Clock } from 'lucide-react';
import type { DashboardStats } from '@/types/admin';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  description?: string;
}

function StatCard({ title, value, change, icon: Icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className={`text-xs mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}% from last period
          </p>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

interface StatsOverviewProps {
  stats: DashboardStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Posts"
        value={stats.totalPosts}
        change={12}
        icon={FileText}
        description={`${stats.publishedPosts} published`}
      />
      <StatCard
        title="Active Tools"
        value={stats.activeTools}
        change={8}
        icon={Wrench}
        description={`${stats.totalTools} total tools`}
      />
      <StatCard
        title="Total Users"
        value={stats.totalUsers.toLocaleString()}
        change={15}
        icon={Users}
        description={`${stats.activeUsers} active users`}
      />
      <StatCard
        title="Page Views"
        value={stats.pageViews.toLocaleString()}
        change={23}
        icon={Eye}
        description="Last 30 days"
      />
      <StatCard
        title="Conversion Rate"
        value={`${stats.conversionRate}%`}
        change={5}
        icon={TrendingUp}
        description="Goal: 5%"
      />
      <StatCard
        title="Avg. Session"
        value={stats.avgSessionDuration}
        change={-2}
        icon={Clock}
        description={`Bounce rate: ${stats.bounceRate}%`}
      />
    </div>
  );
}
