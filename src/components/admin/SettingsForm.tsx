import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAdmin } from '@/context/AdminContext';
import type { Settings } from '@/types/admin';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

export function SettingsForm() {
  const { settings, updateSettings, isLoading } = useAdmin();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!settings) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const updatedSettings: Partial<Settings> = {
        siteName: formData.get('siteName') as string,
        siteDescription: formData.get('siteDescription') as string,
        siteUrl: formData.get('siteUrl') as string,
        postsPerPage: parseInt(formData.get('postsPerPage') as string, 10),
        enableComments: formData.get('enableComments') === 'on',
        enableNewsletter: formData.get('enableNewsletter') === 'on',
        enableAnalytics: formData.get('enableAnalytics') === 'on',
        analyticsId: formData.get('analyticsId') as string,
        enableSEO: formData.get('enableSEO') === 'on',
        defaultMetaTitle: formData.get('defaultMetaTitle') as string,
        defaultMetaDescription: formData.get('defaultMetaDescription') as string,
        socialLinks: {
          twitter: formData.get('twitter') as string,
          github: formData.get('github') as string,
          linkedin: formData.get('linkedin') as string,
          facebook: formData.get('facebook') as string,
        },
      };

      await updateSettings(updatedSettings);

      toast({
        title: 'Settings saved',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic information about your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  defaultValue={settings.siteName}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  defaultValue={settings.siteDescription}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input
                  id="siteUrl"
                  name="siteUrl"
                  type="url"
                  defaultValue={settings.siteUrl}
                  placeholder="https://example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postsPerPage">Posts Per Page</Label>
                <Input
                  id="postsPerPage"
                  name="postsPerPage"
                  type="number"
                  min={1}
                  max={50}
                  defaultValue={settings.postsPerPage}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Configure search engine optimization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableSEO">Enable SEO</Label>
                  <p className="text-sm text-muted-foreground">
                    Add meta tags and structured data to pages
                  </p>
                </div>
                <Switch
                  id="enableSEO"
                  name="enableSEO"
                  defaultChecked={settings.enableSEO}
                />
              </div>
              <Separator />
              <div className="grid gap-2">
                <Label htmlFor="defaultMetaTitle">Default Meta Title</Label>
                <Input
                  id="defaultMetaTitle"
                  name="defaultMetaTitle"
                  defaultValue={settings.defaultMetaTitle}
                  placeholder="My Awesome Site"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="defaultMetaDescription">Default Meta Description</Label>
                <Textarea
                  id="defaultMetaDescription"
                  name="defaultMetaDescription"
                  defaultValue={settings.defaultMetaDescription}
                  rows={3}
                  placeholder="A brief description of your site..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Settings */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Add your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="twitter">Twitter/X URL</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  type="url"
                  defaultValue={settings.socialLinks.twitter}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="github">GitHub URL</Label>
                <Input
                  id="github"
                  name="github"
                  type="url"
                  defaultValue={settings.socialLinks.github}
                  placeholder="https://github.com/yourorg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  defaultValue={settings.socialLinks.linkedin}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input
                  id="facebook"
                  name="facebook"
                  type="url"
                  defaultValue={settings.socialLinks.facebook}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Settings */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>Enable or disable site features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableComments">Comments</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to comment on posts
                  </p>
                </div>
                <Switch
                  id="enableComments"
                  name="enableComments"
                  defaultChecked={settings.enableComments}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableNewsletter">Newsletter</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable newsletter subscription
                  </p>
                </div>
                <Switch
                  id="enableNewsletter"
                  name="enableNewsletter"
                  defaultChecked={settings.enableNewsletter}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableAnalytics">Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Track user behavior with analytics
                  </p>
                </div>
                <Switch
                  id="enableAnalytics"
                  name="enableAnalytics"
                  defaultChecked={settings.enableAnalytics}
                />
              </div>
              {settings.enableAnalytics && (
                <>
                  <Separator />
                  <div className="grid gap-2">
                    <Label htmlFor="analyticsId">Analytics ID</Label>
                    <Input
                      id="analyticsId"
                      name="analyticsId"
                      defaultValue={settings.analyticsId}
                      placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || isLoading}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Tabs>
    </form>
  );
}
