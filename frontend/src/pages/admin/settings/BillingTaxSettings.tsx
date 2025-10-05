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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Receipt,
  Save,
  RotateCcw,
  AlertCircle,
  Loader2,
  Building2,
  MapPin,
  Phone,
  FileText,
  Calculator,
} from "lucide-react";
import { toast } from "sonner";
import { billingTaxApi } from "@/lib/api";

interface BillingData {
  vendor_name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone_number: string;
  vat_number: string;
  enable_invoicing: boolean;
  invoice_prefix: string;
}

interface TaxData {
  enable_tax: boolean;
  tax_name: string;
  tax_type: string;
  tax_amount_type: string;
  tax_amount: number;
  enable_additional_tax: boolean;
  additional_tax_name: string;
  additional_tax_type: string;
  additional_tax_amount_type: string;
  additional_tax_amount: number;
}

export default function BillingTaxSettings() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [countries, setCountries] = useState<
    Array<{ code: string; name: string }>
  >([]);

  const [billingData, setBillingData] = useState<BillingData>({
    vendor_name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    phone_number: "",
    vat_number: "",
    enable_invoicing: false,
    invoice_prefix: "",
  });

  const [taxData, setTaxData] = useState<TaxData>({
    enable_tax: false,
    tax_name: "",
    tax_type: "exclusive",
    tax_amount_type: "percentage",
    tax_amount: 0,
    enable_additional_tax: false,
    additional_tax_name: "",
    additional_tax_type: "exclusive",
    additional_tax_amount_type: "fixed",
    additional_tax_amount: 0,
  });

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await billingTaxApi.getSettings();
        setBillingData(response.billing);
        setTaxData(response.tax);
        setCountries(response.countries);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load settings"
        );
        toast.error("Failed to load billing and tax settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleBillingSave = async () => {
    setSaving("billing");
    try {
      const response = await billingTaxApi.updateBilling(billingData);
      if (response.success) {
        setSaved("billing");
        toast.success(response.message);
        setTimeout(() => setSaved(null), 3000);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save billing settings"
      );
    } finally {
      setSaving(null);
    }
  };

  const handleTaxSave = async () => {
    setSaving("tax");
    try {
      const response = await billingTaxApi.updateTax(taxData);
      if (response.success) {
        setSaved("tax");
        toast.success(response.message);
        setTimeout(() => setSaved(null), 3000);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save tax settings"
      );
    } finally {
      setSaving(null);
    }
  };

  const handleBillingReset = () => {
    setBillingData({
      vendor_name: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zip: "",
      phone_number: "",
      vat_number: "",
      enable_invoicing: false,
      invoice_prefix: "",
    });
  };

  const handleTaxReset = () => {
    setTaxData({
      enable_tax: false,
      tax_name: "",
      tax_type: "exclusive",
      tax_amount_type: "percentage",
      tax_amount: 0,
      enable_additional_tax: false,
      additional_tax_name: "",
      additional_tax_type: "exclusive",
      additional_tax_amount_type: "fixed",
      additional_tax_amount: 0,
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent flex items-center">
            <CreditCard className="mr-3 h-8 w-8" />
            Billing & Tax Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure billing information and tax settings for your application
          </p>
        </div>
      </div>

      {loading && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>Loading settings...</AlertDescription>
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

      <div className="space-y-8">
        {/* Billing Settings */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Billing Settings
            </CardTitle>
            <CardDescription>
              Configure your company billing information and invoicing settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200 font-mono">
                Enter - (hyphen) to hide a field.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vendor_name">Vendor Name *</Label>
                <Input
                  id="vendor_name"
                  value={billingData.vendor_name}
                  onChange={(e) =>
                    setBillingData((prev) => ({
                      ...prev,
                      vendor_name: e.target.value,
                    }))
                  }
                  placeholder="Enter vendor name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number *</Label>
                <Input
                  id="phone_number"
                  value={billingData.phone_number}
                  onChange={(e) =>
                    setBillingData((prev) => ({
                      ...prev,
                      phone_number: e.target.value,
                    }))
                  }
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vat_number">VAT Number</Label>
                <Input
                  id="vat_number"
                  value={billingData.vat_number}
                  onChange={(e) =>
                    setBillingData((prev) => ({
                      ...prev,
                      vat_number: e.target.value,
                    }))
                  }
                  placeholder="Enter VAT number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoice_prefix">Invoice Prefix *</Label>
                <Input
                  id="invoice_prefix"
                  value={billingData.invoice_prefix}
                  onChange={(e) =>
                    setBillingData((prev) => ({
                      ...prev,
                      invoice_prefix: e.target.value,
                    }))
                  }
                  placeholder="e.g., INV"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={billingData.address}
                onChange={(e) =>
                  setBillingData((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                placeholder="Enter complete address"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={billingData.city}
                  onChange={(e) =>
                    setBillingData((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  placeholder="Enter city"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={billingData.state}
                  onChange={(e) =>
                    setBillingData((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                  placeholder="Enter state"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code *</Label>
                <Input
                  id="zip"
                  value={billingData.zip}
                  onChange={(e) =>
                    setBillingData((prev) => ({
                      ...prev,
                      zip: e.target.value,
                    }))
                  }
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select
                value={billingData.country}
                onValueChange={(value) =>
                  setBillingData((prev) => ({
                    ...prev,
                    country: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="enable_invoicing">Enable Invoicing</Label>
                <p className="text-sm text-muted-foreground">
                  Enable invoice generation for payments
                </p>
              </div>
              <Switch
                id="enable_invoicing"
                checked={billingData.enable_invoicing}
                onCheckedChange={(checked) =>
                  setBillingData((prev) => ({
                    ...prev,
                    enable_invoicing: checked,
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-end space-x-2">
              <Button variant="outline" onClick={handleBillingReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                onClick={handleBillingSave}
                disabled={saving === "billing"}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-gradient-primary hover:bg-primary-hover shadow-primary"
              >
                {saving === "billing" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Billing Settings
              </Button>
            </div>

            {saved === "billing" && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Billing settings saved successfully!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Tax Settings */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2 h-5 w-5" />
              Tax Settings
            </CardTitle>
            <CardDescription>
              Configure tax calculations and additional tax settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="enable_tax">Enable Tax</Label>
                <p className="text-sm text-muted-foreground">
                  Enable tax calculation for payments
                </p>
              </div>
              <Switch
                id="enable_tax"
                checked={taxData.enable_tax}
                onCheckedChange={(checked) =>
                  setTaxData((prev) => ({
                    ...prev,
                    enable_tax: checked,
                  }))
                }
              />
            </div>

            {taxData.enable_tax && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tax_name">Tax Name *</Label>
                    <Input
                      id="tax_name"
                      value={taxData.tax_name}
                      onChange={(e) =>
                        setTaxData((prev) => ({
                          ...prev,
                          tax_name: e.target.value,
                        }))
                      }
                      placeholder="e.g., VAT, GST"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax_amount">Tax Amount *</Label>
                    <Input
                      id="tax_amount"
                      type="number"
                      step="0.01"
                      value={taxData.tax_amount}
                      onChange={(e) =>
                        setTaxData((prev) => ({
                          ...prev,
                          tax_amount: parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="Enter tax amount"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax_amount_type">Tax Amount Type *</Label>
                    <Select
                      value={taxData.tax_amount_type}
                      onValueChange={(value) =>
                        setTaxData((prev) => ({
                          ...prev,
                          tax_amount_type: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax_type">Tax Type *</Label>
                    <Select
                      value={taxData.tax_type}
                      onValueChange={(value) =>
                        setTaxData((prev) => ({
                          ...prev,
                          tax_type: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exclusive">Exclusive</SelectItem>
                        <SelectItem value="inclusive">Inclusive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="enable_additional_tax">
                      Enable Additional Tax
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enable additional tax calculation
                    </p>
                  </div>
                  <Switch
                    id="enable_additional_tax"
                    checked={taxData.enable_additional_tax}
                    onCheckedChange={(checked) =>
                      setTaxData((prev) => ({
                        ...prev,
                        enable_additional_tax: checked,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional_tax_name">
                    Additional Tax Name
                  </Label>
                  <Input
                    id="additional_tax_name"
                    value={taxData.additional_tax_name}
                    onChange={(e) =>
                      setTaxData((prev) => ({
                        ...prev,
                        additional_tax_name: e.target.value,
                      }))
                    }
                    placeholder="e.g., Service Tax"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional_tax_amount_type">
                    Additional Tax Amount Type
                  </Label>
                  <Select
                    value={taxData.additional_tax_amount_type}
                    onValueChange={(value) =>
                      setTaxData((prev) => ({
                        ...prev,
                        additional_tax_amount_type: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional_tax_amount">
                    Additional Tax Amount
                  </Label>
                  <Input
                    id="additional_tax_amount"
                    type="number"
                    step="0.01"
                    value={taxData.additional_tax_amount}
                    onChange={(e) =>
                      setTaxData((prev) => ({
                        ...prev,
                        additional_tax_amount: parseFloat(e.target.value) || 0,
                      }))
                    }
                    placeholder="Enter additional tax amount"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional_tax_type">
                    Additional Tax Type
                  </Label>
                  <Select
                    value={taxData.additional_tax_type}
                    onValueChange={(value) =>
                      setTaxData((prev) => ({
                        ...prev,
                        additional_tax_type: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exclusive">Exclusive</SelectItem>
                      <SelectItem value="inclusive">Inclusive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-2">
              <Button variant="outline" onClick={handleTaxReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                onClick={handleTaxSave}
                disabled={saving === "tax"}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-gradient-primary hover:bg-primary-hover shadow-primary"
              >
                {saving === "tax" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Tax Settings
              </Button>
            </div>

            {saved === "tax" && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Tax settings saved successfully!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
