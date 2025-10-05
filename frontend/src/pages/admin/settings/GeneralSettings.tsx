import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Globe,
  Users,
  Save,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Building,
  MapPin,
  Clock,
  Languages,
  Upload,
  Image,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { generalSettingsApi } from "@/lib/api";

export default function GeneralSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Site settings state
  const [siteSettings, setSiteSettings] = useState({
    app_name: "",
    tag_line: "",
    seo_description: "",
    can_register: false,
    logo_path: "",
    white_logo_path: "",
    favicon_path: "",
  });

  // Localization settings state
  const [localizationSettings, setLocalizationSettings] = useState({
    default_locale: "",
    default_direction: "ltr",
    default_timezone: "",
  });

  // File upload states
  const [uploading, setUploading] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const whiteLogoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  // Options
  const [timezones, setTimezones] = useState<string[]>([]);
  const [languages, setLanguages] = useState<
    Array<{ code: string; name: string }>
  >([]);

  const directionOptions = [
    { value: "ltr", label: "Left to Right (LTR)" },
    { value: "rtl", label: "Right to Left (RTL)" },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await generalSettingsApi.getSettings();

      setSiteSettings({
        app_name: response.site.app_name || "",
        tag_line: response.site.tag_line || "",
        seo_description: response.site.seo_description || "",
        can_register: response.site.can_register || false,
        logo_path: response.site.logo_path || "",
        white_logo_path: response.site.white_logo_path || "",
        favicon_path: response.site.favicon_path || "",
      });

      setLocalizationSettings({
        default_locale: response.localization.default_locale || "",
        default_direction: response.localization.default_direction || "ltr",
        default_timezone: response.localization.default_timezone || "",
      });

      setTimezones(response.timezones || []);
      setLanguages(response.languages || []);
    } catch (err) {
      console.error("Failed to load settings:", err);
      setError("Failed to load settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSiteSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSaved(false);

      const response = await generalSettingsApi.updateSite(siteSettings);

      if (response.success) {
        setSaved(true);
        toast.success("Site settings updated successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(response.message || "Failed to update site settings");
      }
    } catch (err) {
      console.error("Failed to update site settings:", err);
      setError("Failed to update site settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLocalizationSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSaved(false);

      const response = await generalSettingsApi.updateLocalization(
        localizationSettings
      );

      if (response.success) {
        setSaved(true);
        toast.success("Localization settings updated successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(response.message || "Failed to update localization settings");
      }
    } catch (err) {
      console.error("Failed to update localization settings:", err);
      setError("Failed to update localization settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (
    file: File,
    type: "logo" | "white_logo" | "favicon"
  ) => {
    try {
      setUploading(type);
      setError(null);

      let response;
      if (type === "logo") {
        response = await generalSettingsApi.updateLogo(file);
      } else if (type === "white_logo") {
        response = await generalSettingsApi.updateWhiteLogo(file);
      } else {
        response = await generalSettingsApi.updateFavicon(file);
      }

      if (response.success) {
        setSiteSettings((prev) => ({
          ...prev,
          [`${type}_path`]: response.data[`${type}_path`],
        }));
        toast.success(
          `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } updated successfully!`
        );
      } else {
        setError(response.message || `Failed to update ${type}`);
      }
    } catch (err) {
      console.error(`Failed to update ${type}:`, err);
      setError(`Failed to update ${type}. Please try again.`);
    } finally {
      setUploading(null);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "white_logo" | "favicon"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, type);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent flex items-center">
            <Settings className="mr-3 h-8 w-8" />
            General Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your application's general settings and localization
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Badge>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {saved && (
        <Alert className="border-success bg-success/10">
          <CheckCircle className="h-4 w-4 text-success" />
          <AlertDescription className="text-success">
            Settings saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {/* Site Settings */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Site Settings
            </CardTitle>
            <CardDescription>
              Configure your application's basic information and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="app_name">Application Name *</Label>
              <Input
                id="app_name"
                value={siteSettings.app_name}
                onChange={(e) =>
                  setSiteSettings((prev) => ({
                    ...prev,
                    app_name: e.target.value,
                  }))
                }
                placeholder="Your Application Name"
                maxLength={255}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag_line">Tag Line *</Label>
              <Input
                id="tag_line"
                value={siteSettings.tag_line}
                onChange={(e) =>
                  setSiteSettings((prev) => ({
                    ...prev,
                    tag_line: e.target.value,
                  }))
                }
                placeholder="Your application tagline"
                maxLength={255}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo_description">SEO Description *</Label>
              <Textarea
                id="seo_description"
                value={siteSettings.seo_description}
                onChange={(e) =>
                  setSiteSettings((prev) => ({
                    ...prev,
                    seo_description: e.target.value,
                  }))
                }
                placeholder="Description for search engines"
                maxLength={255}
                rows={3}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="can_register">Allow User Registration</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable new user registration
                </p>
              </div>
              <Switch
                id="can_register"
                checked={siteSettings.can_register}
                onCheckedChange={(checked) =>
                  setSiteSettings((prev) => ({
                    ...prev,
                    can_register: checked,
                  }))
                }
              />
            </div>

            <Separator />

            <Button
              onClick={handleSiteSave}
              disabled={
                saving ||
                !siteSettings.app_name ||
                !siteSettings.tag_line ||
                !siteSettings.seo_description
              }
              className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-gradient-primary hover:bg-primary-hover shadow-primary min-w-0"
            >
              <Save className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {saving ? "Saving..." : "Save Site Settings"}
              </span>
            </Button>
          </CardContent>
        </Card>

        {/* Branding Settings */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Image className="mr-2 h-5 w-5" />
              Branding Settings
            </CardTitle>
            <CardDescription>
              Upload your application's logo and favicon
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Application Logo</Label>
                <div className="flex items-center space-x-4">
                  {siteSettings.logo_path && (
                    <div className="relative">
                      <img
                        src={`/storage/${siteSettings.logo_path}`}
                        alt="Current logo"
                        className="h-16 w-auto object-contain border rounded"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      ref={logoRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(e) => handleFileChange(e, "logo")}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => logoRef.current?.click()}
                      disabled={uploading === "logo"}
                    >
                      {uploading === "logo" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      {siteSettings.logo_path ? "Change Logo" : "Upload Logo"}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG or PNG, max 512KB
                    </p>
                  </div>
                </div>
              </div>

              {/* White Logo Upload */}
              <div className="space-y-2">
                <Label>White Logo (for dark backgrounds)</Label>
                <div className="flex items-center space-x-4">
                  {siteSettings.white_logo_path && (
                    <div className="relative">
                      <img
                        src={`/storage/${siteSettings.white_logo_path}`}
                        alt="Current white logo"
                        className="h-16 w-auto object-contain border rounded bg-gray-100"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      ref={whiteLogoRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(e) => handleFileChange(e, "white_logo")}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => whiteLogoRef.current?.click()}
                      disabled={uploading === "white_logo"}
                    >
                      {uploading === "white_logo" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      {siteSettings.white_logo_path
                        ? "Change White Logo"
                        : "Upload White Logo"}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG or PNG, max 512KB
                    </p>
                  </div>
                </div>
              </div>

              {/* Favicon Upload */}
              <div className="space-y-2">
                <Label>Favicon</Label>
                <div className="flex items-center space-x-4">
                  {siteSettings.favicon_path && (
                    <div className="relative">
                      <img
                        src={`/storage/${siteSettings.favicon_path}`}
                        alt="Current favicon"
                        className="h-8 w-8 object-contain border rounded"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      ref={faviconRef}
                      type="file"
                      accept="image/png"
                      onChange={(e) => handleFileChange(e, "favicon")}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => faviconRef.current?.click()}
                      disabled={uploading === "favicon"}
                    >
                      {uploading === "favicon" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      {siteSettings.favicon_path
                        ? "Change Favicon"
                        : "Upload Favicon"}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG only, max 512KB, 32x32px recommended
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Localization Settings */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Localization Settings
            </CardTitle>
            <CardDescription>
              Configure language, direction, and timezone settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default_locale">Default Language *</Label>
              <Select
                value={localizationSettings.default_locale}
                onValueChange={(value) =>
                  setLocalizationSettings((prev) => ({
                    ...prev,
                    default_locale: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang, index) => (
                    <SelectItem
                      key={`lang-${lang.code}-${index}`}
                      value={lang.code}
                    >
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default_direction">Text Direction *</Label>
              <Select
                value={localizationSettings.default_direction}
                onValueChange={(value) =>
                  setLocalizationSettings((prev) => ({
                    ...prev,
                    default_direction: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  {directionOptions.map((option, index) => (
                    <SelectItem
                      key={`direction-${option.value}-${index}`}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default_timezone">Default Timezone *</Label>
              <Select
                value={localizationSettings.default_timezone}
                onValueChange={(value) =>
                  setLocalizationSettings((prev) => ({
                    ...prev,
                    default_timezone: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {timezones.map((tz, index) => (
                    <SelectItem key={`timezone-${tz}-${index}`} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <Button
              onClick={handleLocalizationSave}
              disabled={
                saving ||
                !localizationSettings.default_locale ||
                !localizationSettings.default_timezone
              }
              className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-gradient-primary hover:bg-primary-hover shadow-primary min-w-0"
            >
              <Save className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {saving ? "Saving..." : "Save Localization"}
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card className="bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">User Registration</p>
                <p className="text-xs text-muted-foreground">
                  {siteSettings.can_register ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Languages className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Language</p>
                <p className="text-xs text-muted-foreground">
                  {localizationSettings.default_locale || "Not set"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Timezone</p>
                <p className="text-xs text-muted-foreground">
                  {localizationSettings.default_timezone || "Not set"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Image className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Branding</p>
                <p className="text-xs text-muted-foreground">
                  {siteSettings.logo_path ? "Configured" : "Not set"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
