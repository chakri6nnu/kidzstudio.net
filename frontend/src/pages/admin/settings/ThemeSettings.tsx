import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Palette, 
  Save, 
  RotateCcw, 
  Type, 
  Eye,
  Download,
  Upload
} from "lucide-react";

export default function ThemeSettings() {
  const [formData, setFormData] = useState({
    primary_color: "#3b82f6",
    secondary_color: "#64748b",
    default_font: "Inter",
    default_font_url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const presetColors = [
    { name: "Blue", primary: "#3b82f6", secondary: "#64748b" },
    { name: "Purple", primary: "#8b5cf6", secondary: "#6b7280" },
    { name: "Green", primary: "#10b981", secondary: "#6b7280" },
    { name: "Red", primary: "#ef4444", secondary: "#6b7280" },
    { name: "Orange", primary: "#f97316", secondary: "#6b7280" },
    { name: "Pink", primary: "#ec4899", secondary: "#6b7280" },
  ];

  const googleFonts = [
    { name: "Inter", url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
    { name: "Roboto", url: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" },
    { name: "Open Sans", url: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" },
    { name: "Lato", url: "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" },
    { name: "Montserrat", url: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" },
    { name: "Poppins", url: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" },
  ];

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const handleReset = () => {
    setFormData({
      primary_color: "#3b82f6",
      secondary_color: "#64748b",
      default_font: "Inter",
      default_font_url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    });
  };

  const applyPreset = (preset: typeof presetColors[0]) => {
    setFormData(prev => ({
      ...prev,
      primary_color: preset.primary,
      secondary_color: preset.secondary,
    }));
  };

  const applyFont = (font: typeof googleFonts[0]) => {
    setFormData(prev => ({
      ...prev,
      default_font: font.name,
      default_font_url: font.url,
    }));
  };

  const exportTheme = () => {
    const theme = {
      colors: {
        primary: formData.primary_color,
        secondary: formData.secondary_color,
      },
      typography: {
        fontFamily: formData.default_font,
        fontUrl: formData.default_font_url,
      },
    };
    
    const dataStr = JSON.stringify(theme, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "theme-config.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent flex items-center">
            <Palette className="mr-3 h-8 w-8" />
            Theme Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Customize your application's visual appearance and branding
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportTheme}>
            <Download className="mr-2 h-4 w-4" />
            Export Theme
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-gradient-primary">
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      {saved && (
        <Alert className="border-success bg-success/10">
          <AlertDescription className="text-success">
            Theme settings saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Settings */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="mr-2 h-5 w-5" />
              Color Palette
            </CardTitle>
            <CardDescription>
              Define your brand colors and theme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Custom Colors */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Color *</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="primary_color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                      className="w-12 h-10 rounded border border-input cursor-pointer"
                    />
                    <Input
                      value={formData.primary_color}
                      onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                      placeholder="#3b82f6"
                      maxLength={60}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary_color">Secondary Color *</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="secondary_color"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                      className="w-12 h-10 rounded border border-input cursor-pointer"
                    />
                    <Input
                      value={formData.secondary_color}
                      onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                      placeholder="#64748b"
                      maxLength={60}
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Color Presets */}
              <div className="space-y-3">
                <Label>Color Presets</Label>
                <div className="grid grid-cols-3 gap-2">
                  {presetColors.map(preset => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      className="flex items-center space-x-2 p-3"
                    >
                      <div className="flex space-x-1">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: preset.primary }}
                        ></div>
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: preset.secondary }}
                        ></div>
                      </div>
                      <span className="text-xs">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Color Preview */}
              <div className="space-y-3">
                <Label>Color Preview</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div 
                      className="h-16 rounded-lg flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: formData.primary_color }}
                    >
                      Primary
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      {formData.primary_color}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div 
                      className="h-16 rounded-lg flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: formData.secondary_color }}
                    >
                      Secondary
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      {formData.secondary_color}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography Settings */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Type className="mr-2 h-5 w-5" />
              Typography
            </CardTitle>
            <CardDescription>
              Configure fonts and text styling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default_font">Font Family *</Label>
                <Input
                  id="default_font"
                  value={formData.default_font}
                  onChange={(e) => setFormData(prev => ({ ...prev, default_font: e.target.value }))}
                  placeholder="Inter"
                  maxLength={100}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default_font_url">Font URL *</Label>
                <Input
                  id="default_font_url"
                  value={formData.default_font_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, default_font_url: e.target.value }))}
                  placeholder="https://fonts.googleapis.com/css2?family=Inter..."
                  maxLength={1000}
                  required
                />
              </div>

              <Separator />

              {/* Google Fonts Presets */}
              <div className="space-y-3">
                <Label>Google Fonts</Label>
                <div className="grid grid-cols-2 gap-2">
                  {googleFonts.map(font => (
                    <Button
                      key={font.name}
                      variant="outline"
                      size="sm"
                      onClick={() => applyFont(font)}
                      className="text-xs"
                      style={{ fontFamily: font.name }}
                    >
                      {font.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Font Preview */}
              <div className="space-y-3">
                <Label>Font Preview</Label>
                <div 
                  className="border rounded-lg p-4 space-y-2"
                  style={{ fontFamily: formData.default_font }}
                >
                  <h3 className="text-2xl font-bold">Heading Example</h3>
                  <p className="text-base">
                    This is how your regular text will appear with the selected font family.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Small text and descriptions will look like this.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Preview */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="mr-2 h-5 w-5" />
            Live Preview
          </CardTitle>
          <CardDescription>
            See how your theme changes will appear in the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="border rounded-lg p-6 space-y-4"
            style={{ fontFamily: formData.default_font }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b">
              <h2 className="text-xl font-bold">KidzStudio Dashboard</h2>
              <Button 
                size="sm"
                style={{ backgroundColor: formData.primary_color, color: 'white' }}
              >
                Primary Button
              </Button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className="p-4 rounded-lg text-white"
                style={{ backgroundColor: formData.primary_color }}
              >
                <h3 className="font-semibold mb-2">Primary Card</h3>
                <p className="text-sm opacity-90">
                  This card uses your primary color scheme
                </p>
              </div>

              <div 
                className="p-4 rounded-lg text-white"
                style={{ backgroundColor: formData.secondary_color }}
              >
                <h3 className="font-semibold mb-2">Secondary Card</h3>
                <p className="text-sm opacity-90">
                  This card uses your secondary color scheme
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Content Card</h3>
                <p className="text-sm text-muted-foreground">
                  Regular content with your selected typography
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  style={{ borderColor: formData.primary_color, color: formData.primary_color }}
                >
                  Outline Button
                </Button>
              </div>
            </div>

            {/* Typography Samples */}
            <div className="space-y-2 pt-4 border-t">
              <h1 className="text-3xl font-bold">Heading 1 - Typography Sample</h1>
              <h2 className="text-2xl font-semibold">Heading 2 - Subtitle Example</h2>
              <p className="text-base">
                Regular paragraph text demonstrating the font family you've selected. 
                This shows how body text will appear throughout your application.
              </p>
              <p className="text-sm text-muted-foreground">
                Small text and captions will use this styling for secondary information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import/Export */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle>Theme Management</CardTitle>
          <CardDescription>
            Import and export theme configurations
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Theme
          </Button>
          <Button variant="outline" onClick={exportTheme}>
            <Download className="mr-2 h-4 w-4" />
            Export Theme
          </Button>
          <div className="text-sm text-muted-foreground">
            Save and share your custom theme configurations
          </div>
        </CardContent>
      </Card>
    </div>
  );
}