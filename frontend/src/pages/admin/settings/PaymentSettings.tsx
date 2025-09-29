import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Save, 
  RotateCcw, 
  DollarSign, 
  Building, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function PaymentSettings() {
  const [formData, setFormData] = useState({
    // Main Payment Settings
    default_payment_processor: "stripe",
    default_currency: "USD",
    currency_symbol: "$",
    currency_symbol_position: "before",
    
    // Gateway Toggles
    enable_bank: true,
    enable_paypal: true,
    enable_stripe: true,
    enable_razorpay: false,
    
    // Bank Transfer Settings
    bank_name: "",
    account_owner: "",
    account_number: "",
    iban: "",
    routing_number: "",
    bic_swift: "",
    other_details: "",
    
    // Razorpay Settings
    razorpay_key_id: "",
    razorpay_key_secret: "",
    razorpay_webhook_secret: "",
    
    // PayPal Settings
    paypal_client_id: "",
    paypal_secret: "",
    
    // Stripe Settings
    stripe_api_key: "",
    stripe_secret_key: "",
    stripe_webhook_secret: "",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSecrets, setShowSecrets] = useState({
    razorpay_secret: false,
    razorpay_webhook: false,
    paypal_secret: false,
    stripe_secret: false,
    stripe_webhook: false,
  });

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  ];

  const processors = [
    { id: "stripe", name: "Stripe", popular: true },
    { id: "paypal", name: "PayPal", popular: true },
    { id: "razorpay", name: "Razorpay", popular: false },
    { id: "bank", name: "Bank Transfer", popular: false },
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
      default_payment_processor: "stripe",
      default_currency: "USD",
      currency_symbol: "$",
      currency_symbol_position: "before",
      enable_bank: true,
      enable_paypal: true,
      enable_stripe: true,
      enable_razorpay: false,
      bank_name: "",
      account_owner: "",
      account_number: "",
      iban: "",
      routing_number: "",
      bic_swift: "",
      other_details: "",
      razorpay_key_id: "",
      razorpay_key_secret: "",
      razorpay_webhook_secret: "",
      paypal_client_id: "",
      paypal_secret: "",
      stripe_api_key: "",
      stripe_secret_key: "",
      stripe_webhook_secret: "",
    });
  };

  const toggleSecretVisibility = (field: string) => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getGatewayStatus = (gateway: string) => {
    switch (gateway) {
      case 'stripe':
        return formData.enable_stripe && formData.stripe_api_key && formData.stripe_secret_key;
      case 'paypal':
        return formData.enable_paypal && formData.paypal_client_id && formData.paypal_secret;
      case 'razorpay':
        return formData.enable_razorpay && formData.razorpay_key_id && formData.razorpay_key_secret;
      case 'bank':
        return formData.enable_bank && formData.bank_name && formData.account_number;
      default:
        return false;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent flex items-center">
            <CreditCard className="mr-3 h-8 w-8" />
            Payment Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure payment gateways and billing preferences
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
            Payment settings saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="paypal">PayPal</TabsTrigger>
          <TabsTrigger value="razorpay">Razorpay</TabsTrigger>
          <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Currency Settings */}
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Currency Settings
                </CardTitle>
                <CardDescription>
                  Configure your default currency and display preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default_currency">Default Currency *</Label>
                  <Select 
                    value={formData.default_currency} 
                    onValueChange={(value) => {
                      const currency = currencies.find(c => c.code === value);
                      setFormData(prev => ({ 
                        ...prev, 
                        default_currency: value,
                        currency_symbol: currency?.symbol || "$"
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(currency => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency_symbol">Currency Symbol *</Label>
                  <Input
                    id="currency_symbol"
                    value={formData.currency_symbol}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency_symbol: e.target.value }))}
                    placeholder="$"
                    maxLength={10}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency_symbol_position">Symbol Position</Label>
                  <Select 
                    value={formData.currency_symbol_position} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, currency_symbol_position: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="before">Before Amount ($100)</SelectItem>
                      <SelectItem value="after">After Amount (100$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Preview:</p>
                  <p className="text-lg">
                    {formData.currency_symbol_position === 'before' 
                      ? `${formData.currency_symbol}99.99`
                      : `99.99${formData.currency_symbol}`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Processor Settings */}
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle>Payment Processors</CardTitle>
                <CardDescription>
                  Select default processor and enable/disable gateways
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default_processor">Default Processor *</Label>
                  <Select 
                    value={formData.default_payment_processor} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, default_payment_processor: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {processors.map(processor => (
                        <SelectItem key={processor.id} value={processor.id}>
                          <div className="flex items-center space-x-2">
                            <span>{processor.name}</span>
                            {processor.popular && (
                              <Badge variant="secondary" className="text-xs">Popular</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Enabled Gateways</Label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="enable_stripe">Stripe</Label>
                        {getGatewayStatus('stripe') && (
                          <CheckCircle className="h-4 w-4 text-success" />
                        )}
                      </div>
                      <Switch
                        id="enable_stripe"
                        checked={formData.enable_stripe}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_stripe: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="enable_paypal">PayPal</Label>
                        {getGatewayStatus('paypal') && (
                          <CheckCircle className="h-4 w-4 text-success" />
                        )}
                      </div>
                      <Switch
                        id="enable_paypal"
                        checked={formData.enable_paypal}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_paypal: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="enable_razorpay">Razorpay</Label>
                        {getGatewayStatus('razorpay') && (
                          <CheckCircle className="h-4 w-4 text-success" />
                        )}
                      </div>
                      <Switch
                        id="enable_razorpay"
                        checked={formData.enable_razorpay}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_razorpay: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="enable_bank">Bank Transfer</Label>
                        {getGatewayStatus('bank') && (
                          <CheckCircle className="h-4 w-4 text-success" />
                        )}
                      </div>
                      <Switch
                        id="enable_bank"
                        checked={formData.enable_bank}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_bank: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stripe" className="space-y-6">
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle>Stripe Configuration</CardTitle>
              <CardDescription>
                Configure your Stripe payment gateway settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Label>Stripe Gateway</Label>
                <Switch
                  checked={formData.enable_stripe}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_stripe: checked }))}
                />
              </div>

              {formData.enable_stripe && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stripe_api_key">Publishable Key *</Label>
                    <Input
                      id="stripe_api_key"
                      value={formData.stripe_api_key}
                      onChange={(e) => setFormData(prev => ({ ...prev, stripe_api_key: e.target.value }))}
                      placeholder="pk_test_..."
                      maxLength={5000}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stripe_secret_key">Secret Key *</Label>
                    <div className="relative">
                      <Input
                        id="stripe_secret_key"
                        type={showSecrets.stripe_secret ? "text" : "password"}
                        value={formData.stripe_secret_key}
                        onChange={(e) => setFormData(prev => ({ ...prev, stripe_secret_key: e.target.value }))}
                        placeholder="sk_test_..."
                        maxLength={5000}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleSecretVisibility('stripe_secret')}
                      >
                        {showSecrets.stripe_secret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stripe_webhook_secret">Webhook Secret</Label>
                    <div className="relative">
                      <Input
                        id="stripe_webhook_secret"
                        type={showSecrets.stripe_webhook ? "text" : "password"}
                        value={formData.stripe_webhook_secret}
                        onChange={(e) => setFormData(prev => ({ ...prev, stripe_webhook_secret: e.target.value }))}
                        placeholder="whsec_..."
                        maxLength={5000}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleSecretVisibility('stripe_webhook')}
                      >
                        {showSecrets.stripe_webhook ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Keep your secret keys secure and never share them publicly. Use test keys for development.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paypal" className="space-y-6">
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle>PayPal Configuration</CardTitle>
              <CardDescription>
                Configure your PayPal payment gateway settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Label>PayPal Gateway</Label>
                <Switch
                  checked={formData.enable_paypal}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_paypal: checked }))}
                />
              </div>

              {formData.enable_paypal && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="paypal_client_id">Client ID *</Label>
                    <Input
                      id="paypal_client_id"
                      value={formData.paypal_client_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, paypal_client_id: e.target.value }))}
                      placeholder="PayPal Client ID"
                      maxLength={5000}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paypal_secret">Client Secret *</Label>
                    <div className="relative">
                      <Input
                        id="paypal_secret"
                        type={showSecrets.paypal_secret ? "text" : "password"}
                        value={formData.paypal_secret}
                        onChange={(e) => setFormData(prev => ({ ...prev, paypal_secret: e.target.value }))}
                        placeholder="PayPal Client Secret"
                        maxLength={5000}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleSecretVisibility('paypal_secret')}
                      >
                        {showSecrets.paypal_secret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="razorpay" className="space-y-6">
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle>Razorpay Configuration</CardTitle>
              <CardDescription>
                Configure your Razorpay payment gateway settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Label>Razorpay Gateway</Label>
                <Switch
                  checked={formData.enable_razorpay}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_razorpay: checked }))}
                />
              </div>

              {formData.enable_razorpay && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="razorpay_key_id">Key ID *</Label>
                    <Input
                      id="razorpay_key_id"
                      value={formData.razorpay_key_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, razorpay_key_id: e.target.value }))}
                      placeholder="rzp_test_..."
                      maxLength={1000}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="razorpay_key_secret">Key Secret *</Label>
                    <div className="relative">
                      <Input
                        id="razorpay_key_secret"
                        type={showSecrets.razorpay_secret ? "text" : "password"}
                        value={formData.razorpay_key_secret}
                        onChange={(e) => setFormData(prev => ({ ...prev, razorpay_key_secret: e.target.value }))}
                        placeholder="Razorpay Key Secret"
                        maxLength={1000}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleSecretVisibility('razorpay_secret')}
                      >
                        {showSecrets.razorpay_secret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="razorpay_webhook_secret">Webhook Secret *</Label>
                    <div className="relative">
                      <Input
                        id="razorpay_webhook_secret"
                        type={showSecrets.razorpay_webhook ? "text" : "password"}
                        value={formData.razorpay_webhook_secret}
                        onChange={(e) => setFormData(prev => ({ ...prev, razorpay_webhook_secret: e.target.value }))}
                        placeholder="Webhook Secret"
                        maxLength={1000}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleSecretVisibility('razorpay_webhook')}
                      >
                        {showSecrets.razorpay_webhook ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank" className="space-y-6">
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Bank Transfer Configuration
              </CardTitle>
              <CardDescription>
                Configure bank transfer details for manual payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Label>Bank Transfer</Label>
                <Switch
                  checked={formData.enable_bank}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_bank: checked }))}
                />
              </div>

              {formData.enable_bank && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank_name">Bank Name *</Label>
                    <Input
                      id="bank_name"
                      value={formData.bank_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, bank_name: e.target.value }))}
                      placeholder="Enter bank name"
                      maxLength={255}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account_owner">Account Owner *</Label>
                    <Input
                      id="account_owner"
                      value={formData.account_owner}
                      onChange={(e) => setFormData(prev => ({ ...prev, account_owner: e.target.value }))}
                      placeholder="Account holder name"
                      maxLength={255}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account_number">Account Number *</Label>
                    <Input
                      id="account_number"
                      value={formData.account_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, account_number: e.target.value }))}
                      placeholder="Account number"
                      maxLength={255}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="iban">IBAN *</Label>
                    <Input
                      id="iban"
                      value={formData.iban}
                      onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value }))}
                      placeholder="International Bank Account Number"
                      maxLength={255}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="routing_number">Routing Number *</Label>
                    <Input
                      id="routing_number"
                      value={formData.routing_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, routing_number: e.target.value }))}
                      placeholder="Routing/Sort code"
                      maxLength={255}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bic_swift">BIC/SWIFT Code *</Label>
                    <Input
                      id="bic_swift"
                      value={formData.bic_swift}
                      onChange={(e) => setFormData(prev => ({ ...prev, bic_swift: e.target.value }))}
                      placeholder="BIC/SWIFT code"
                      maxLength={255}
                      required
                    />
                  </div>

                  <div className="lg:col-span-2 space-y-2">
                    <Label htmlFor="other_details">Additional Details *</Label>
                    <Textarea
                      id="other_details"
                      value={formData.other_details}
                      onChange={(e) => setFormData(prev => ({ ...prev, other_details: e.target.value }))}
                      placeholder="Any additional instructions for bank transfers..."
                      className="min-h-[100px]"
                      maxLength={1000}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.other_details.length}/1000 characters
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {processors.map(processor => (
              <Card key={processor.id} className="bg-gradient-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      {processor.name}
                      {processor.popular && (
                        <Badge variant="secondary" className="ml-2">Popular</Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      {getGatewayStatus(processor.id) ? (
                        <Badge className="bg-success text-success-foreground">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Configured
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Not Configured
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <span className={formData[`enable_${processor.id}` as keyof typeof formData] ? 'text-success' : 'text-muted-foreground'}>
                        {formData[`enable_${processor.id}` as keyof typeof formData] ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Default:</span>
                      <span className={formData.default_payment_processor === processor.id ? 'text-primary' : 'text-muted-foreground'}>
                        {formData.default_payment_processor === processor.id ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}