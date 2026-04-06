import { SettingsForm } from '@/components/admin/SettingsForm';

export function AdminSettings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your website settings and preferences
        </p>
      </div>

      {/* Settings Form */}
      <SettingsForm />
    </div>
  );
}
