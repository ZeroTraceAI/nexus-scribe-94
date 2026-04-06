# Admin Panel - Advanced Features Documentation

## Overview

The CodeSec AI Admin Panel is a comprehensive management system built with React, TypeScript, and modern UI components. It provides administrators with full control over content, users, analytics, and site settings.

## Features

### 🔐 Authentication
- **Secure Login System**: Email/password authentication with session persistence
- **Protected Routes**: Automatic redirect to login for unauthorized access
- **Role-based Access**: Support for admin, editor, and viewer roles
- **Session Management**: LocalStorage-based session handling

### 📊 Dashboard
- **Real-time Statistics**: Live metrics for posts, tools, users, and traffic
- **Analytics Charts**: Interactive charts showing traffic trends
- **Recent Activity Feed**: Track all user actions across the platform
- **Quick Actions**: Fast access to common tasks

### 📝 Content Management
- **Posts Management**: Create, edit, delete, and publish blog posts
- **Tools Management**: Manage cybersecurity and AI tools
- **Status Filtering**: Filter by draft, published, or archived
- **Search Functionality**: Quick search across all content
- **Bulk Actions**: Support for multiple item operations

### 👥 User Management
- **User List**: View all registered users with details
- **Role Assignment**: Assign admin, editor, or viewer roles
- **User Status**: Activate/deactivate user accounts
- **Search & Filter**: Find users by name or email
- **Activity Tracking**: Monitor user login history

### 📈 Analytics
- **Traffic Overview**: Page views and unique visitors over time
- **Engagement Metrics**: Bounce rate and session duration
- **Time Range Selection**: 7, 14, 30, or 90-day ranges
- **Multiple Chart Types**: Area, bar, and line charts
- **Summary Cards**: Key metrics at a glance

### ⚙️ Settings
- **General Settings**: Site name, description, URL
- **SEO Configuration**: Meta tags and optimization settings
- **Social Media Links**: Connect social profiles
- **Feature Toggles**: Enable/disable comments, newsletter, analytics
- **Real-time Updates**: Save changes instantly

## File Structure

```
src/
├── context/
│   └── AdminContext.tsx          # Global admin state management
├── types/
│   └── admin.ts                   # TypeScript interfaces
├── hooks/
│   └── admin/
│       └── useDashboard.ts        # Data fetching hooks
├── components/
│   └── admin/
│       ├── AdminSidebar.tsx       # Navigation sidebar
│       ├── AdminLayout.tsx        # Main layout wrapper
│       ├── AdminLogin.tsx         # Login component
│       ├── StatsOverview.tsx      # Dashboard stats cards
│       ├── RecentActivity.tsx     # Activity feed
│       ├── ContentList.tsx        # Content table
│       └── SettingsForm.tsx       # Settings form
└── pages/
    └── admin/
        ├── Dashboard.tsx          # Main dashboard
        ├── LoginPage.tsx          # Login page
        ├── Posts.tsx              # Posts management
        ├── Tools.tsx              # Tools management
        ├── Users.tsx              # User management
        ├── Analytics.tsx          # Analytics page
        └── Settings.tsx           # Settings page
```

## Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/admin/login` | Admin login page | Public |
| `/admin` | Dashboard overview | Protected |
| `/admin/posts` | Manage blog posts | Protected |
| `/admin/tools` | Manage tools | Protected |
| `/admin/users` | User management | Protected |
| `/admin/analytics` | Analytics & reports | Protected |
| `/admin/settings` | Site settings | Protected |

## Usage

### Accessing the Admin Panel

1. Navigate to `/admin/login`
2. Enter credentials (demo: any email + 6+ char password)
3. Access the dashboard and manage your site

### Adding Admin Link to Navigation

Add this link to your main navigation component:

```tsx
<Link to="/admin" className="nav-link">
  Admin Panel
</Link>
```

### Customizing Components

All components are built with shadcn/ui and can be customized:

```tsx
// Example: Customizing the dashboard
import { StatsOverview } from '@/components/admin';

function CustomDashboard() {
  return (
    <div>
      <h1>My Custom Dashboard</h1>
      <StatsOverview />
      {/* Add your custom widgets */}
    </div>
  );
}
```

## Data Flow

1. **AdminContext**: Provides global state (user, settings, notifications)
2. **Custom Hooks**: `useDashboard`, `useContent`, `useUsers` fetch data
3. **Components**: Consume data from hooks and context
4. **Mock Data**: Currently using mock data (replace with API calls)

## Integration with Backend

To connect to a real backend:

1. Replace mock data in `hooks/admin/useDashboard.ts`
2. Update authentication in `context/AdminContext.tsx`
3. Add API service layer for CRUD operations
4. Implement proper error handling and loading states

Example API integration:

```typescript
// In useDashboard.ts
const loadStats = async () => {
  const response = await fetch('/api/admin/stats');
  const data = await response.json();
  setStats(data);
};
```

## Security Considerations

- ✅ Client-side route protection
- ✅ Session persistence with localStorage
- ⚠️ Add server-side authentication
- ⚠️ Implement JWT tokens
- ⚠️ Add CSRF protection
- ⚠️ Sanitize all user inputs

## Future Enhancements

- [ ] Real-time notifications with WebSocket
- [ ] Advanced role-based permissions
- [ ] Content versioning and history
- [ ] Scheduled publishing
- [ ] Media library management
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Audit logs export
- [ ] Multi-language support
- [ ] Dark mode toggle

## Testing

Run tests for admin components:

```bash
npm run test -- admin
```

## Performance

- Lazy loading for all admin routes
- Optimized re-renders with React.memo
- Efficient data fetching with caching
- Responsive design for all screen sizes

## Support

For issues or questions about the admin panel, refer to the main documentation or contact the development team.
