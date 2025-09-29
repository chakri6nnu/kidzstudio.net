import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Mail, 
  Save, 
  RotateCcw, 
  Send, 
  Server, 
  Eye, 
  EyeOff, 
  CheckCircle,
  AlertTriangle,
  Loader2
} from "lucide-react";

export default function EmailSettings() {
  const [formData, setFormData] = useState({
    host: "smtp.gmail.com",
    port: 587,
    username: "",
    password: "",
    encryption: "tls",
    from_address: "",
    from_name: "KidzStudio",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [testEmail, setTestEmail] = useState("");

  const encryptionOptions = [
    { value: "tls", label: "TLS (Recommended)" },
    { value: "ssl", label: "SSL" },
    { value: "none", label: "None (Not Recommended)" },
  ];

  const commonProviders = [
    { name: "Gmail", host: "smtp.gmail.com", port: 587, encryption: "tls" },
    { name: "Outlook", host: "smtp-mail.outlook.com", port: 587, encryption: "tls" },
    { name: "Yahoo", host: "smtp.mail.yahoo.com", port: 587, encryption: "tls" },
    { name: "SendGrid", host: "smtp.sendgrid.net", port: 587, encryption: "tls" },
    { name: "Mailgun", host: "smtp.mailgun.org", port: 587, encryption: "tls" },
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
      host: "smtp.gmail.com",
      port: 587,
      username: "",
      password: "",
      encryption: "tls",
      from_address: "",
      from_name: "KidzStudio",
    });
    setTestResult(null);
  };

  const handleTestEmail = async () => {
    setTesting(true);
    setTestResult(null);
    
    // Simulate test email
    setTimeout(() => {
      setTesting(false);
      // Randomly succeed or fail for demo
      setTestResult(Math.random() > 0.3 ? 'success' : 'error');
    }, 2000);
  };

  const useProvider = (provider: typeof commonProviders[0]) => {
    setFormData(prev => ({
      ...prev,
      host: provider.host,
      port: provider.port,
      encryption: provider.encryption,
    }));
  };

  const isConfigured = () => {
    return formData.host && formData.port && formData.username && 
           formData.password && formData.from_address && formData.from_name;
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent flex items-center">
            <Mail className="mr-3 h-8 w-8" />
            Email Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure SMTP settings for sending emails from your application
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
            Email settings saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SMTP Configuration */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="mr-2 h-5 w-5" />
              SMTP Configuration
            </CardTitle>
            <CardDescription>
              Configure your SMTP server settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Setup */}
            <div className="space-y-2">
              <Label>Quick Setup</Label>
              <div className="grid grid-cols-2 gap-2">
                {commonProviders.slice(0, 4).map(provider => (
                  <Button
                    key={provider.name}
                    variant="outline"
                    size="sm"
                    onClick={() => useProvider(provider)}
                    className="text-xs"
                  >
                    {provider.name}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="host">SMTP Host *</Label>
              <Input
                id="host"
                value={formData.host}
                onChange={(e) => setFormData(prev => ({ ...prev, host: e.target.value }))}
                placeholder="smtp.gmail.com"
                maxLength={250}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="port">Port *</Label>
                <Input
                  id="port"
                  type="number"
                  value={formData.port}
                  onChange={(e) => setFormData(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                  placeholder="587"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="encryption">Encryption</Label>
                <Select 
                  value={formData.encryption} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, encryption: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {encryptionOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="your-email@example.com"
                maxLength={1024}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Your SMTP password"
                  maxLength={1024}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                For Gmail, use an App Password instead of your regular password
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle>Email Configuration</CardTitle>
            <CardDescription>
              Configure how emails appear to recipients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="from_address">From Email Address *</Label>
              <Input
                id="from_address"
                type="email"
                value={formData.from_address}
                onChange={(e) => setFormData(prev => ({ ...prev, from_address: e.target.value }))}
                placeholder="noreply@yourcompany.com"
                maxLength={1024}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="from_name">From Name *</Label>
              <Input
                id="from_name"
                value={formData.from_name}
                onChange={(e) => setFormData(prev => ({ ...prev, from_name: e.target.value }))}
                placeholder="KidzStudio"
                maxLength={1024}
                required
              />
            </div>

            <Separator />

            {/* Configuration Status */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Configuration Status</Label>
                {isConfigured() ? (
                  <Badge className="bg-success text-success-foreground">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Complete
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Incomplete
                  </Badge>
                )}
              </div>

              {/* Email Preview */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium">Email Preview:</p>
                <div className="text-sm">
                  <p><strong>From:</strong> {formData.from_name || "Your App Name"} &lt;{formData.from_address || "your-email@domain.com"}&gt;</p>
                  <p><strong>Subject:</strong> Welcome to KidzStudio</p>
                  <p><strong>Server:</strong> {formData.host}:{formData.port} ({formData.encryption?.toUpperCase()})</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Email */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Send className="mr-2 h-5 w-5" />
            Test Email Configuration
          </CardTitle>
          <CardDescription>
            Send a test email to verify your SMTP settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="test_email">Test Email Address</Label>
              <Input
                id="test_email"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <Button 
              onClick={handleTestEmail}
              disabled={!isConfigured() || !testEmail || testing}
              className="mt-6"
            >
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Test
                </>
              )}
            </Button>
          </div>

          {testResult === 'success' && (
            <Alert className="border-success bg-success/10">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                Test email sent successfully! Check your inbox.
              </AlertDescription>
            </Alert>
          )}

          {testResult === 'error' && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Failed to send test email. Please check your SMTP configuration and try again.
              </AlertDescription>
            </Alert>
          )}

          {!isConfigured() && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please complete all required fields before testing email configuration.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Common SMTP Providers */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle>Common SMTP Providers</CardTitle>
          <CardDescription>
            Quick setup for popular email providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commonProviders.map(provider => (
              <div key={provider.name} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{provider.name}</h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => useProvider(provider)}
                  >
                    Use
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Host: {provider.host}</p>
                  <p>Port: {provider.port}</p>
                  <p>Encryption: {provider.encryption.toUpperCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}