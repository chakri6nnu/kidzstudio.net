import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  RotateCcw,
  Trash2,
  Link,
  Calendar,
  Wrench,
  Bug,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { maintenanceApi } from "@/lib/api";

export default function MaintenanceSettings() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appVersion, setAppVersion] = useState<string>("");
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Load maintenance status
  useEffect(() => {
    const loadStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await maintenanceApi.status();
        setAppVersion(response.appVersion);
        setDebugMode(response.debugMode);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load maintenance status"
        );
        toast.error("Failed to load maintenance status");
      } finally {
        setLoading(false);
      }
    };

    loadStatus();
  }, []);

  const handleDebugModeToggle = async (checked: boolean) => {
    setSaving(true);
    try {
      const response = await maintenanceApi.setDebugMode(checked);
      setDebugMode(response.debugMode);
      toast.success(response.message);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update debug mode"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAction = async (action: string, apiCall: () => Promise<any>) => {
    setActionLoading(action);
    try {
      const response = await apiCall();
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : `Failed to ${action.toLowerCase()}`
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleClearCache = () => {
    handleAction("Clear Cache", maintenanceApi.clearCache);
  };

  const handleFixStorageLinks = () => {
    handleAction("Fix Storage Links", maintenanceApi.fixStorageLinks);
  };

  const handleExpireSchedules = () => {
    handleAction("Expire Schedules", maintenanceApi.expireSchedules);
  };

  const handleFixUpdates = () => {
    handleAction("Fix Updates", maintenanceApi.fixUpdates);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent flex items-center">
            <Settings className="mr-3 h-8 w-8" />
            Maintenance Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage application maintenance tasks and system settings
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            v{appVersion}
          </Badge>
        </div>
      </div>

      {loading && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>Loading maintenance status...</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Information */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bug className="mr-2 h-5 w-5" />
              System Information
            </CardTitle>
            <CardDescription>
              Current system status and configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium">App Version</label>
                <p className="text-sm text-muted-foreground">
                  {appVersion || "Loading..."}
                </p>
              </div>
              <Badge variant="secondary">{appVersion}</Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium">Debug Mode</label>
                <p className="text-sm text-muted-foreground">
                  {debugMode ? "Enabled" : "Disabled"}
                </p>
              </div>
              <Switch
                checked={debugMode}
                onCheckedChange={handleDebugModeToggle}
                disabled={saving}
              />
            </div>

            {debugMode && (
              <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  Debug mode is enabled. This will expose sensitive data.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Maintenance Actions */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="mr-2 h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Perform common maintenance tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                onClick={handleClearCache}
                disabled={actionLoading === "Clear Cache"}
                variant="outline"
                className="w-full justify-start"
              >
                {actionLoading === "Clear Cache" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Clear Cache
              </Button>

              <Button
                onClick={handleFixStorageLinks}
                disabled={actionLoading === "Fix Storage Links"}
                variant="outline"
                className="w-full justify-start"
              >
                {actionLoading === "Fix Storage Links" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Link className="mr-2 h-4 w-4" />
                )}
                Fix Storage Links
              </Button>

              <Button
                onClick={handleExpireSchedules}
                disabled={actionLoading === "Expire Schedules"}
                variant="outline"
                className="w-full justify-start"
              >
                {actionLoading === "Expire Schedules" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Calendar className="mr-2 h-4 w-4" />
                )}
                Expire Schedules
              </Button>

              <Button
                onClick={handleFixUpdates}
                disabled={actionLoading === "Fix Updates"}
                variant="outline"
                className="w-full justify-start"
              >
                {actionLoading === "Fix Updates" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wrench className="mr-2 h-4 w-4" />
                )}
                Fix App Updates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Actions */}
      <div className="space-y-6">
        {/* Clear Cache */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-lg">Clear Cache</CardTitle>
            <CardDescription>
              If necessary, you may clear your application cache. This action
              may slow down application for a while.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Clears config, view, route, and permission caches
              </div>
              <Button
                onClick={handleClearCache}
                disabled={actionLoading === "Clear Cache"}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-gradient-primary hover:bg-primary-hover shadow-primary"
              >
                {actionLoading === "Clear Cache" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Clear Cache
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Expire Schedules */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-lg">Expire Schedules</CardTitle>
            <CardDescription>
              If you configure task schedule this action can takes place every
              six hours. If not, you can manually mark all the schedules that
              passed end date as expired in the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Marks completed exam and quiz schedules as expired
              </div>
              <Button
                onClick={handleExpireSchedules}
                disabled={actionLoading === "Expire Schedules"}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-gradient-primary hover:bg-primary-hover shadow-primary"
              >
                {actionLoading === "Expire Schedules" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Calendar className="mr-2 h-4 w-4" />
                )}
                Mark Completed Schedules as Expired
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fix Storage Links */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-lg">Fix Storage Links</CardTitle>
            <CardDescription>
              After installing/updating the application with latest files, you
              may need to update storage links. You can do that by using this
              option.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Creates symbolic links for storage directories
              </div>
              <Button
                onClick={handleFixStorageLinks}
                disabled={actionLoading === "Fix Storage Links"}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-gradient-primary hover:bg-primary-hover shadow-primary"
              >
                {actionLoading === "Fix Storage Links" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Link className="mr-2 h-4 w-4" />
                )}
                Fix Storage Links
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fix App Updates */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-lg">Fix App Updates</CardTitle>
            <CardDescription>
              After updating the application with latest files, we need to fix
              some settings. You can do that by using this option.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Updates app version and refreshes configuration
              </div>
              <Button
                onClick={handleFixUpdates}
                disabled={actionLoading === "Fix Updates"}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-gradient-primary hover:bg-primary-hover shadow-primary"
              >
                {actionLoading === "Fix Updates" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wrench className="mr-2 h-4 w-4" />
                )}
                Fix App Updates
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Debug Mode */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-lg">Debug Mode</CardTitle>
            <CardDescription>
              Enabling debug mode will expose sensitive data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">
                    Debug Mode ({debugMode ? "Enabled" : "Disabled"})
                  </label>
                  <Switch
                    checked={debugMode}
                    onCheckedChange={handleDebugModeToggle}
                    disabled={saving}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Toggle application debug mode
                </p>
              </div>
              <Button
                onClick={() => handleDebugModeToggle(!debugMode)}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-gradient-primary hover:bg-primary-hover shadow-primary"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Bug className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
