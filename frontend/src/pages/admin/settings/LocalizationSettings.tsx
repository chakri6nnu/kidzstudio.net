import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Save, 
  RotateCcw, 
  Clock, 
  Languages,
  MapPin
} from "lucide-react";

export default function LocalizationSettings() {
  const [formData, setFormData] = useState({
    default_locale: "en",
    default_direction: "ltr",
    default_timezone: "UTC",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const locales = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "fr", name: "French", nativeName: "Français" },
    { code: "de", name: "German", nativeName: "Deutsch" },
    { code: "it", name: "Italian", nativeName: "Italiano" },
    { code: "pt", name: "Portuguese", nativeName: "Português" },
    { code: "ru", name: "Russian", nativeName: "Русский" },
    { code: "zh", name: "Chinese", nativeName: "中文" },
    { code: "ja", name: "Japanese", nativeName: "日本語" },
    { code: "ko", name: "Korean", nativeName: "한국어" },
    { code: "ar", name: "Arabic", nativeName: "العربية" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  ];

  const directions = [
    { value: "ltr", label: "Left to Right (LTR)", description: "Default for most languages" },
    { value: "rtl", label: "Right to Left (RTL)", description: "For Arabic, Hebrew, etc." },
  ];

  const timezones = [
    { value: "UTC", label: "UTC - Coordinated Universal Time", offset: "+00:00" },
    { value: "America/New_York", label: "Eastern Time", offset: "-05:00" },
    { value: "America/Chicago", label: "Central Time", offset: "-06:00" },
    { value: "America/Denver", label: "Mountain Time", offset: "-07:00" },
    { value: "America/Los_Angeles", label: "Pacific Time", offset: "-08:00" },
    { value: "Europe/London", label: "Greenwich Mean Time", offset: "+00:00" },
    { value: "Europe/Paris", label: "Central European Time", offset: "+01:00" },
    { value: "Europe/Moscow", label: "Moscow Time", offset: "+03:00" },
    { value: "Asia/Dubai", label: "Gulf Standard Time", offset: "+04:00" },
    { value: "Asia/Kolkata", label: "India Standard Time", offset: "+05:30" },
    { value: "Asia/Shanghai", label: "China Standard Time", offset: "+08:00" },
    { value: "Asia/Tokyo", label: "Japan Standard Time", offset: "+09:00" },
    { value: "Australia/Sydney", label: "Australian Eastern Time", offset: "+11:00" },
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
      default_locale: "en",
      default_direction: "ltr",
      default_timezone: "UTC",
    });
  };

  const getLocaleInfo = (code: string) => {
    return locales.find(locale => locale.code === code);
  };

  const getTimezoneInfo = (tz: string) => {
    return timezones.find(timezone => timezone.value === tz);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent flex items-center">
            <Globe className="mr-3 h-8 w-8" />
            Localization Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure language, region, and time settings for your application
          </p>
        </div>
        <div className="flex items-center space-x-2">
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
            Localization settings saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Settings */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Languages className="mr-2 h-5 w-5" />
              Language Settings
            </CardTitle>
            <CardDescription>
              Configure the default language and text direction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="default_locale">Default Language *</Label>
              <Select 
                value={formData.default_locale} 
                onValueChange={(value) => {
                  const locale = getLocaleInfo(value);
                  setFormData(prev => ({ 
                    ...prev, 
                    default_locale: value,
                    default_direction: ['ar', 'he', 'fa'].includes(value) ? 'rtl' : 'ltr'
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locales.map(locale => (
                    <SelectItem key={locale.code} value={locale.code}>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs bg-muted px-1 rounded">
                          {locale.code}
                        </span>
                        <span>{locale.name}</span>
                        <span className="text-muted-foreground">({locale.nativeName})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default_direction">Text Direction</Label>
              <Select 
                value={formData.default_direction} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, default_direction: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {directions.map(direction => (
                    <SelectItem key={direction.value} value={direction.value}>
                      <div className="space-y-1">
                        <div className="font-medium">{direction.label}</div>
                        <div className="text-xs text-muted-foreground">{direction.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Language Preview */}
            <div className="space-y-3">
              <Label>Language Preview</Label>
              <div 
                className="border rounded-lg p-4 bg-muted/50"
                dir={formData.default_direction}
              >
                <div className="space-y-2">
                  <h3 className="font-semibold">
                    {formData.default_direction === 'rtl' ? 'مرحبا بكم في منصة التعليم' : 'Welcome to the Learning Platform'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formData.default_direction === 'rtl' 
                      ? 'هذا مثال على كيفية ظهور النص باللغة العربية'
                      : 'This is how text will appear in your selected language direction'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  Language: {getLocaleInfo(formData.default_locale)?.name}
                </Badge>
                <Badge variant="outline">
                  Direction: {formData.default_direction.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timezone Settings */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Timezone Settings
            </CardTitle>
            <CardDescription>
              Configure the default timezone for your application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="default_timezone">Default Timezone *</Label>
              <Select 
                value={formData.default_timezone} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, default_timezone: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map(timezone => (
                    <SelectItem key={timezone.value} value={timezone.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{timezone.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {timezone.offset}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Timezone Preview */}
            <div className="space-y-3">
              <Label>Time Preview</Label>
              <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold">
                    {new Date().toLocaleTimeString('en-US', { 
                      timeZone: formData.default_timezone === 'UTC' ? 'UTC' : formData.default_timezone,
                      hour12: true 
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('en-US', { 
                      timeZone: formData.default_timezone === 'UTC' ? 'UTC' : formData.default_timezone,
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                
                <div className="text-center pt-2 border-t">
                  <Badge variant="outline" className="text-xs">
                    {getTimezoneInfo(formData.default_timezone)?.label}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Timezone Impact */}
            <div className="space-y-3">
              <Label>Timezone Impact</Label>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Exam Schedules:</span>
                  <span className="text-muted-foreground">Displayed in {formData.default_timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span>User Registration:</span>
                  <span className="text-muted-foreground">Timestamps in {formData.default_timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reports & Analytics:</span>
                  <span className="text-muted-foreground">Data in {formData.default_timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email Notifications:</span>
                  <span className="text-muted-foreground">Times in {formData.default_timezone}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Settings Summary */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Regional Settings Summary
          </CardTitle>
          <CardDescription>
            Overview of your localization configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold">
                {getLocaleInfo(formData.default_locale)?.nativeName}
              </div>
              <div className="text-sm text-muted-foreground">Default Language</div>
              <Badge variant="outline">
                {formData.default_locale.toUpperCase()}
              </Badge>
            </div>

            <div className="text-center space-y-2">
              <div className="text-2xl font-bold">
                {formData.default_direction.toUpperCase()}
              </div>
              <div className="text-sm text-muted-foreground">Text Direction</div>
              <Badge variant="outline">
                {formData.default_direction === 'ltr' ? 'Left to Right' : 'Right to Left'}
              </Badge>
            </div>

            <div className="text-center space-y-2">
              <div className="text-2xl font-bold">
                {getTimezoneInfo(formData.default_timezone)?.offset}
              </div>
              <div className="text-sm text-muted-foreground">Timezone Offset</div>
              <Badge variant="outline">
                {formData.default_timezone}
              </Badge>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="text-sm space-y-1">
              <p><strong>Note:</strong> These settings affect the default display for all users.</p>
              <p>Individual users can override these settings in their personal preferences.</p>
              <p>Changes will take effect after saving and may require users to refresh their browser.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}