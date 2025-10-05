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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
  CreditCard,
  DollarSign,
  Settings,
  Save,
  RotateCcw,
  Loader2,
  AlertCircle,
  CheckCircle,
  Shield,
  Building2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { paymentApi } from "@/lib/api";

export default function PaymentSettings() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  // General payment settings
  const [paymentData, setPaymentData] = useState({
    default_payment_processor: "stripe",
    default_currency: "USD",
    currency_symbol: "$",
    currency_symbol_position: "before",
    enable_bank: false,
    enable_paypal: false,
    enable_stripe: false,
    enable_razorpay: false,
  });

  // Stripe settings
  const [stripeData, setStripeData] = useState({
    api_key: "",
    secret_key: "",
    webhook_url: "",
    webhook_secret: "",
  });

  // Razorpay settings
  const [razorpayData, setRazorpayData] = useState({
    key_id: "",
    key_secret: "",
    webhook_url: "",
    webhook_secret: "",
  });

  // PayPal settings
  const [paypalData, setPaypalData] = useState({
    client_id: "",
    secret: "",
    webhook_url: "",
  });

  // Bank settings
  const [bankData, setBankData] = useState({
    bank_name: "",
    account_owner: "",
    account_number: "",
    iban: "",
    routing_number: "",
    bic_swift: "",
    other_details: "",
  });

  // Available options
  const [currencies, setCurrencies] = useState<
    Array<{ code: string; name: string; symbol: string }>
  >([]);
  const [paymentProcessors, setPaymentProcessors] = useState<
    Array<{ value: string; label: string }>
  >([]);

  // Load payment settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await paymentApi.getSettings();

        setPaymentData(response.payment);
        setStripeData(response.stripe);
        setRazorpayData(response.razorpay);
        setPaypalData(response.paypal);
        setBankData(response.bank);
        setCurrencies(response.currencies);
        setPaymentProcessors(response.payment_processors);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load payment settings"
        );
        toast.error("Failed to load payment settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleGeneralSave = async () => {
    setSaving("general");
    try {
      await paymentApi.updateGeneral(paymentData);
      setSaved("general");
      toast.success("Payment settings updated successfully!");
      setTimeout(() => setSaved(null), 3000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update payment settings"
      );
    } finally {
      setSaving(null);
    }
  };

  const handleStripeSave = async () => {
    setSaving("stripe");
    try {
      await paymentApi.updateStripe(stripeData);
      setSaved("stripe");
      toast.success("Stripe settings updated successfully!");
      setTimeout(() => setSaved(null), 3000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update Stripe settings"
      );
    } finally {
      setSaving(null);
    }
  };

  const handleRazorpaySave = async () => {
    setSaving("razorpay");
    try {
      await paymentApi.updateRazorpay(razorpayData);
      setSaved("razorpay");
      toast.success("Razorpay settings updated successfully!");
      setTimeout(() => setSaved(null), 3000);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update Razorpay settings"
      );
    } finally {
      setSaving(null);
    }
  };

  const handlePayPalSave = async () => {
    setSaving("paypal");
    try {
      await paymentApi.updatePayPal(paypalData);
      setSaved("paypal");
      toast.success("PayPal settings updated successfully!");
      setTimeout(() => setSaved(null), 3000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update PayPal settings"
      );
    } finally {
      setSaving(null);
    }
  };

  const handleBankSave = async () => {
    setSaving("bank");
    try {
      await paymentApi.updateBank(bankData);
      setSaved("bank");
      toast.success("Bank settings updated successfully!");
      setTimeout(() => setSaved(null), 3000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update Bank settings"
      );
    } finally {
      setSaving(null);
    }
  };

  const handleGeneralReset = () => {
    setPaymentData({
      default_payment_processor: "stripe",
      default_currency: "USD",
      currency_symbol: "$",
      currency_symbol_position: "before",
      enable_bank: false,
      enable_paypal: false,
      enable_stripe: false,
      enable_razorpay: false,
    });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent flex items-center">
            <CreditCard className="mr-3 h-8 w-8" />
            Payment Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure payment gateways and processing settings
          </p>
        </div>
      </div>

      {error && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Payment Settings */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>
              Configure default payment processor and currency settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="default_payment_processor">
                Default Payment Processor
              </Label>
              <Select
                value={paymentData.default_payment_processor}
                onValueChange={(value) =>
                  setPaymentData((prev) => ({
                    ...prev,
                    default_payment_processor: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select processor" />
                </SelectTrigger>
                <SelectContent>
                  {paymentProcessors.map((processor) => (
                    <SelectItem key={processor.value} value={processor.value}>
                      {processor.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default_currency">Default Currency</Label>
                <Select
                  value={paymentData.default_currency}
                  onValueChange={(value) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      default_currency: value,
                      currency_symbol:
                        currencies.find((c) => c.code === value)?.symbol || "$",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency_symbol">Currency Symbol</Label>
                <Input
                  id="currency_symbol"
                  value={paymentData.currency_symbol}
                  onChange={(e) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      currency_symbol: e.target.value,
                    }))
                  }
                  placeholder="e.g., $"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency_symbol_position">Symbol Position</Label>
              <Select
                value={paymentData.currency_symbol_position}
                onValueChange={(value) =>
                  setPaymentData((prev) => ({
                    ...prev,
                    currency_symbol_position: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="before">Before amount ($100)</SelectItem>
                  <SelectItem value="after">After amount (100$)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Enable Payment Methods</h4>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="enable_stripe">Stripe</Label>
                  <p className="text-sm text-muted-foreground">
                    Credit card payments via Stripe
                  </p>
                </div>
                <Switch
                  id="enable_stripe"
                  checked={paymentData.enable_stripe}
                  onCheckedChange={(checked) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      enable_stripe: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="enable_razorpay">Razorpay</Label>
                  <p className="text-sm text-muted-foreground">
                    Payment gateway for India
                  </p>
                </div>
                <Switch
                  id="enable_razorpay"
                  checked={paymentData.enable_razorpay}
                  onCheckedChange={(checked) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      enable_razorpay: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="enable_paypal">PayPal</Label>
                  <p className="text-sm text-muted-foreground">
                    PayPal payment integration
                  </p>
                </div>
                <Switch
                  id="enable_paypal"
                  checked={paymentData.enable_paypal}
                  onCheckedChange={(checked) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      enable_paypal: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="enable_bank">Bank Transfer</Label>
                  <p className="text-sm text-muted-foreground">
                    Manual bank transfer payments
                  </p>
                </div>
                <Switch
                  id="enable_bank"
                  checked={paymentData.enable_bank}
                  onCheckedChange={(checked) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      enable_bank: checked,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <Button variant="outline" onClick={handleGeneralReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                onClick={handleGeneralSave}
                disabled={saving === "general"}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-gradient-primary hover:bg-primary-hover shadow-primary"
              >
                {saving === "general" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save General Settings
              </Button>
            </div>

            {saved === "general" && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  General settings saved successfully!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Stripe Settings */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5" />
              Stripe Settings
            </CardTitle>
            <CardDescription>
              Configure Stripe payment gateway credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stripe_api_key">API Key</Label>
              <Input
                id="stripe_api_key"
                type="password"
                value={stripeData.api_key}
                onChange={(e) =>
                  setStripeData((prev) => ({
                    ...prev,
                    api_key: e.target.value,
                  }))
                }
                placeholder="pk_test_..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripe_secret_key">Secret Key</Label>
              <Input
                id="stripe_secret_key"
                type="password"
                value={stripeData.secret_key}
                onChange={(e) =>
                  setStripeData((prev) => ({
                    ...prev,
                    secret_key: e.target.value,
                  }))
                }
                placeholder="sk_test_..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripe_webhook_url">Webhook URL</Label>
              <Input
                id="stripe_webhook_url"
                value={stripeData.webhook_url}
                onChange={(e) =>
                  setStripeData((prev) => ({
                    ...prev,
                    webhook_url: e.target.value,
                  }))
                }
                placeholder="https://yourdomain.com/webhook/stripe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripe_webhook_secret">Webhook Secret</Label>
              <Input
                id="stripe_webhook_secret"
                type="password"
                value={stripeData.webhook_secret}
                onChange={(e) =>
                  setStripeData((prev) => ({
                    ...prev,
                    webhook_secret: e.target.value,
                  }))
                }
                placeholder="whsec_..."
              />
            </div>

            <Button
              onClick={handleStripeSave}
              disabled={saving === "stripe"}
              className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-gradient-primary hover:bg-primary-hover shadow-primary"
            >
              {saving === "stripe" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Stripe Settings
            </Button>

            {saved === "stripe" && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Stripe settings saved successfully!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Razorpay Settings */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Razorpay Settings
            </CardTitle>
            <CardDescription>
              Configure Razorpay payment gateway credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="razorpay_key_id">Key ID</Label>
              <Input
                id="razorpay_key_id"
                value={razorpayData.key_id}
                onChange={(e) =>
                  setRazorpayData((prev) => ({
                    ...prev,
                    key_id: e.target.value,
                  }))
                }
                placeholder="rzp_test_..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="razorpay_key_secret">Key Secret</Label>
              <Input
                id="razorpay_key_secret"
                type="password"
                value={razorpayData.key_secret}
                onChange={(e) =>
                  setRazorpayData((prev) => ({
                    ...prev,
                    key_secret: e.target.value,
                  }))
                }
                placeholder="Enter key secret"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="razorpay_webhook_url">Webhook URL</Label>
              <Input
                id="razorpay_webhook_url"
                value={razorpayData.webhook_url}
                onChange={(e) =>
                  setRazorpayData((prev) => ({
                    ...prev,
                    webhook_url: e.target.value,
                  }))
                }
                placeholder="https://yourdomain.com/webhook/razorpay"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="razorpay_webhook_secret">Webhook Secret</Label>
              <Input
                id="razorpay_webhook_secret"
                type="password"
                value={razorpayData.webhook_secret}
                onChange={(e) =>
                  setRazorpayData((prev) => ({
                    ...prev,
                    webhook_secret: e.target.value,
                  }))
                }
                placeholder="Enter webhook secret"
              />
            </div>

            <Button
              onClick={handleRazorpaySave}
              disabled={saving === "razorpay"}
              className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-gradient-primary hover:bg-primary-hover shadow-primary"
            >
              {saving === "razorpay" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Razorpay Settings
            </Button>

            {saved === "razorpay" && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Razorpay settings saved successfully!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* PayPal Settings */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              PayPal Settings
            </CardTitle>
            <CardDescription>
              Configure PayPal payment gateway credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paypal_client_id">Client ID</Label>
              <Input
                id="paypal_client_id"
                value={paypalData.client_id}
                onChange={(e) =>
                  setPaypalData((prev) => ({
                    ...prev,
                    client_id: e.target.value,
                  }))
                }
                placeholder="Enter PayPal Client ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paypal_secret">Secret</Label>
              <Input
                id="paypal_secret"
                type="password"
                value={paypalData.secret}
                onChange={(e) =>
                  setPaypalData((prev) => ({
                    ...prev,
                    secret: e.target.value,
                  }))
                }
                placeholder="Enter PayPal Secret"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paypal_webhook_url">Webhook URL</Label>
              <Input
                id="paypal_webhook_url"
                value={paypalData.webhook_url}
                onChange={(e) =>
                  setPaypalData((prev) => ({
                    ...prev,
                    webhook_url: e.target.value,
                  }))
                }
                placeholder="https://yourdomain.com/webhook/paypal"
              />
            </div>

            <Button
              onClick={handlePayPalSave}
              disabled={saving === "paypal"}
              className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-gradient-primary hover:bg-primary-hover shadow-primary"
            >
              {saving === "paypal" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save PayPal Settings
            </Button>

            {saved === "paypal" && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  PayPal settings saved successfully!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bank Transfer Settings */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="mr-2 h-5 w-5" />
            Bank Transfer Settings
          </CardTitle>
          <CardDescription>
            Configure bank account details for manual transfers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input
                id="bank_name"
                value={bankData.bank_name}
                onChange={(e) =>
                  setBankData((prev) => ({
                    ...prev,
                    bank_name: e.target.value,
                  }))
                }
                placeholder="e.g., Chase Bank"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_owner">Account Owner</Label>
              <Input
                id="account_owner"
                value={bankData.account_owner}
                onChange={(e) =>
                  setBankData((prev) => ({
                    ...prev,
                    account_owner: e.target.value,
                  }))
                }
                placeholder="Account holder name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_number">Account Number</Label>
              <Input
                id="account_number"
                value={bankData.account_number}
                onChange={(e) =>
                  setBankData((prev) => ({
                    ...prev,
                    account_number: e.target.value,
                  }))
                }
                placeholder="Account number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                value={bankData.iban}
                onChange={(e) =>
                  setBankData((prev) => ({
                    ...prev,
                    iban: e.target.value,
                  }))
                }
                placeholder="International Bank Account Number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="routing_number">Routing Number</Label>
              <Input
                id="routing_number"
                value={bankData.routing_number}
                onChange={(e) =>
                  setBankData((prev) => ({
                    ...prev,
                    routing_number: e.target.value,
                  }))
                }
                placeholder="Bank routing number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bic_swift">BIC/SWIFT Code</Label>
              <Input
                id="bic_swift"
                value={bankData.bic_swift}
                onChange={(e) =>
                  setBankData((prev) => ({
                    ...prev,
                    bic_swift: e.target.value,
                  }))
                }
                placeholder="Bank identifier code"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="other_details">Other Details</Label>
            <Textarea
              id="other_details"
              value={bankData.other_details}
              onChange={(e) =>
                setBankData((prev) => ({
                  ...prev,
                  other_details: e.target.value,
                }))
              }
              placeholder="Additional bank transfer instructions or details"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-end">
            <Button
              onClick={handleBankSave}
              disabled={saving === "bank"}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-gradient-primary hover:bg-primary-hover shadow-primary"
            >
              {saving === "bank" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Bank Settings
            </Button>
          </div>

          {saved === "bank" && (
            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Bank settings saved successfully!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
