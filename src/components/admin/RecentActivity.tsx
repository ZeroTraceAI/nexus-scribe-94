import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { ActivityLog } from '@/types/admin';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  activities: ActivityLog[];
  isLoading?: boolean;
}

const actionColors: Record<ActivityLog['action'], string> = {
  create: 'bg-green-100 text-green-800',
  update: 'bg-blue-100 text-blue-800',
  delete: 'bg-red-100 text-red-800',
  publish: 'bg-purple-100 text-purple-800',
  login: 'bg-gray-100 text-gray-800',
  logout: 'bg-gray-100 text-gray-800',
};

const entityIcons: Record<ActivityLog['entityType'], string> = {
  post: '📝',
  tool: '🔧',
  user: '👤',
  settings: '⚙️',
};

export function RecentActivity({ activities, isLoading = false }: RecentActivityProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No recent activity
                </TableCell>
              </TableRow>
            ) : (
              activities.slice(0, 10).map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <Badge variant="secondary" className={actionColors[activity.action]}>
                      {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{activity.userName}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{entityIcons[activity.entityType]}</span>
                      <span>{activity.entityTitle || activity.entityId}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
