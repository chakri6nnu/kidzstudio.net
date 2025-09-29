import { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Upload, Save, RotateCcw, Settings, Globe, Image } from "lucide-react";
import { toast } from "sonner";
import {
  getSettingsApi,
  createSettingApi,
  updateSettingApi,
  deleteSettingApi,
  type Setting as ApiSetting,
} from "@/lib/utils";

type Setting = ApiSetting;

interface ApiResponse {
  data: Setting[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function GeneralSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    app_name: "KidzStudio",
    tag_line: "Next Generation Online Exam Platform",
    seo_description:
      "KidzStudio is a comprehensive online examination platform for educational institutions and corporate training programs.",
    can_register: true,
    logo_path: "",
    white_logo_path: "",
    favicon_path: "",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getSettingsApi({
          category: "general",
          per_page: 100,
        });
        const settingsData = (response as ApiResponse).data;
        setSettings(settingsData);

        // Map settings to form data
        const mappedData = {
          app_name:
            settingsData.find((s) => s.key === "app_name")?.value ||
            "KidzStudio",
          tag_line:
            settingsData.find((s) => s.key === "tag_line")?.value ||
            "Next Generation Online Exam Platform",
          seo_description:
            settingsData.find((s) => s.key === "seo_description")?.value || "",
          can_register:
            settingsData.find((s) => s.key === "can_register")?.value ===
            "true",
          logo_path:
            settingsData.find((s) => s.key === "logo_path")?.value || "",
          white_logo_path:
            settingsData.find((s) => s.key === "white_logo_path")?.value || "",
          favicon_path:
            settingsData.find((s) => s.key === "favicon_path")?.value || "",
        };
        setFormData(mappedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load settings"
        );
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update or create each setting
      const settingsToUpdate = [
        {
          key: "app_name",
          value: formData.app_name,
          type: "string",
          category: "general",
        },
        {
          key: "tag_line",
          value: formData.tag_line,
          type: "string",
          category: "general",
        },
        {
          key: "seo_description",
          value: formData.seo_description,
          type: "text",
          category: "general",
        },
        {
          key: "can_register",
          value: formData.can_register.toString(),
          type: "boolean",
          category: "general",
        },
        {
          key: "logo_path",
          value: formData.logo_path,
          type: "string",
          category: "general",
        },
        {
          key: "white_logo_path",
          value: formData.white_logo_path,
          type: "string",
          category: "general",
        },
        {
          key: "favicon_path",
          value: formData.favicon_path,
          type: "string",
          category: "general",
        },
      ];

      for (const setting of settingsToUpdate) {
        const existingSetting = settings.find((s) => s.key === setting.key);
        if (existingSetting) {
          await updateSettingApi(existingSetting.id, setting);
        } else {
          await createSettingApi(setting);
        }
      }

      setSaving(false);
      setSaved(true);
      toast.success("Settings saved successfully");
      setTimeout(() => setSaved(false), 3000);

      // Reload settings
      const response = await getSettingsApi({
        category: "general",
        per_page: 100,
      });
      const settingsData = (response as ApiResponse).data;
      setSettings(settingsData);
    } catch (err) {
      setSaving(false);
      toast.error("Failed to save settings");
    }
  };

  const handleReset = () => {
    setFormData({
      app_name: "KidzStudio",
      tag_line: "Next Generation Online Exam Platform",
      seo_description:
        "KidzStudio is a comprehensive online examination platform for educational institutions and corporate training programs.",
      can_register: true,
      logo_path: "",
      white_logo_path: "",
      favicon_path: "",
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent flex items-center">
            <Settings className="mr-3 h-8 w-8" />
            General Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure your application's basic information and branding
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-primary"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      {loading && (
        <Alert>
          <AlertDescription>Loading settings...</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {saved && (
        <Alert className="border-success bg-success/10">
          <AlertDescription className="text-success">
            Settings saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Information */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Application Information
            </CardTitle>
            <CardDescription>
              Basic information about your application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="app_name">Application Name *</Label>
              <Input
                id="app_name"
                value={formData.app_name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, app_name: e.target.value }))
                }
                placeholder="Enter application name"
                maxLength={160}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.app_name.length}/160 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag_line">Tag Line *</Label>
              <Input
                id="tag_line"
                value={formData.tag_line}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tag_line: e.target.value }))
                }
                placeholder="Enter application tag line"
                maxLength={160}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.tag_line.length}/160 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo_description">SEO Description *</Label>
              <Textarea
                id="seo_description"
                value={formData.seo_description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo_description: e.target.value,
                  }))
                }
                placeholder="Enter SEO meta description"
                className="min-h-[80px]"
                maxLength={255}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.seo_description.length}/255 characters
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="can_register">User Registration</Label>
                <p className="text-sm text-muted-foreground">
                  Allow new users to register on the platform
                </p>
              </div>
              <Switch
                id="can_register"
                checked={formData.can_register}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, can_register: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Branding & Assets */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Image className="mr-2 h-5 w-5" />
              Branding & Assets
            </CardTitle>
            <CardDescription>
              Upload your brand assets and visual identity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Site Logo */}
            <div className="space-y-3">
              <Label>Site Logo</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                <div className="text-center space-y-2">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <div>
                    <p className="text-sm font-medium">Upload Site Logo</p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG • Max 512KB • Recommended: 200x50px
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>
            </div>

            {/* White Logo */}
            <div className="space-y-3">
              <Label>White Logo (Dark Backgrounds)</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                <div className="text-center space-y-2">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <div>
                    <p className="text-sm font-medium">Upload White Logo</p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG • Max 512KB • Recommended: 200x50px
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>
            </div>

            {/* Favicon */}
            <div className="space-y-3">
              <Label>Favicon</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                <div className="text-center space-y-2">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <div>
                    <p className="text-sm font-medium">Upload Favicon</p>
                    <p className="text-xs text-muted-foreground">
                      PNG • Max 512KB • Recommended: 32x32px
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Settings Preview */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle>Settings Preview</CardTitle>
          <CardDescription>
            Preview how your settings will appear to users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-6 rounded-lg">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{formData.app_name}</h3>
              <p className="text-muted-foreground">{formData.tag_line}</p>
              <p className="text-sm text-muted-foreground mt-4">
                SEO Description: "{formData.seo_description}"
              </p>
              <div className="flex items-center space-x-2 mt-4">
                <span className="text-sm">Registration:</span>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    formData.can_register
                      ? "bg-success/20 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {formData.can_register ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
