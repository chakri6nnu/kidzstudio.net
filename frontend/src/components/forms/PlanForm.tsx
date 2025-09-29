import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Crown, Star, Zap, Infinity, Plus, X } from "lucide-react";

interface PlanFormProps {
  plan?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  trigger?: React.ReactNode;
}

export default function PlanForm({ plan, onSave, onCancel, trigger }: PlanFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: plan?.name || "",
    description: plan?.description || "",
    price: plan?.price || 0,
    currency: plan?.currency || "USD",
    billing: plan?.billing || "monthly",
    status: plan?.status || "Active",
    
    // Features
    features: {
      exams: plan?.features?.exams || 10,
      questions: plan?.features?.questions || 500,
      users: plan?.features?.users || 1,
      storage: plan?.features?.storage || "1GB",
      support: plan?.features?.support || "Basic",
      analytics: plan?.features?.analytics || false,
      customBranding: plan?.features?.customBranding || false,
      api: plan?.features?.api || false,
      liveProctoring: plan?.features?.liveProctoring || false,
      certificateGeneration: plan?.features?.certificateGeneration || false,
      whiteLabeling: plan?.features?.whiteLabeling || false,
      prioritySupport: plan?.features?.prioritySupport || false,
    },
    
    // Limits
    limits: {
      maxExams: plan?.limits?.maxExams || 10,
      maxUsers: plan?.limits?.maxUsers || 1,
      maxQuestions: plan?.limits?.maxQuestions || 500,
      maxStorage: plan?.limits?.maxStorage || 1,
      maxConcurrentExams: plan?.limits?.maxConcurrentExams || 1,
    },
    
    // Pricing
    trialDays: plan?.trialDays || 0,
    setupFee: plan?.setupFee || 0,
    discount: plan?.discount || 0,
    
    // Marketing
    popular: plan?.popular || false,
    featured: plan?.featured || false,
    ribbon: plan?.ribbon || "",
    
    // Custom features
    customFeatures: plan?.customFeatures || [],
  });

  const [newCustomFeature, setNewCustomFeature] = useState("");

  const billingOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
    { value: "lifetime", label: "Lifetime" },
    { value: "trial", label: "Trial" }
  ];

  const supportLevels = ["Basic", "Standard", "Priority", "24/7 Premium"];
  const storageOptions = ["500MB", "1GB", "5GB", "10GB", "25GB", "50GB", "100GB", "Unlimited"];

  const handleSave = () => {
    onSave(formData);
    setOpen(false);
  };

  const addCustomFeature = () => {
    if (newCustomFeature.trim() && !formData.customFeatures.includes(newCustomFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        customFeatures: [...prev.customFeatures, newCustomFeature.trim()]
      }));
      setNewCustomFeature("");
    }
  };

  const removeCustomFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      customFeatures: prev.customFeatures.filter(f => f !== feature)
    }));
  };

  const getPlanIcon = () => {
    const name = formData.name.toLowerCase();
    if (name.includes("free") || name.includes("trial")) return <Star className="h-5 w-5" />;
    if (name.includes("basic")) return <Zap className="h-5 w-5" />;
    if (name.includes("pro")) return <Crown className="h-5 w-5" />;
    if (name.includes("enterprise")) return <Infinity className="h-5 w-5" />;
    return <DollarSign className="h-5 w-5" />;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Create Plan</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{plan ? "Edit Plan" : "Create New Plan"}</DialogTitle>
          <DialogDescription>
            {plan ? "Update subscription plan details" : "Create a new subscription plan with features and pricing"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="limits">Limits</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter plan name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the plan benefits..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing">Billing Cycle</Label>
                  <Select value={formData.billing} onValueChange={(value) => setFormData(prev => ({ ...prev, billing: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {billingOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {getPlanIcon()}
                      <span className="ml-2">Plan Preview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-bold">{formData.name || "Plan Name"}</h3>
                      <p className="text-sm text-muted-foreground">{formData.description || "Plan description"}</p>
                      <div className="text-3xl font-bold">
                        {formData.price === 0 ? "Free" : `$${formData.price}`}
                        {formData.price > 0 && (
                          <span className="text-sm font-normal">/{formData.billing}</span>
                        )}
                      </div>
                      {formData.popular && (
                        <Badge className="bg-accent text-accent-foreground">Most Popular</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trialDays">Trial Days</Label>
                    <Input
                      id="trialDays"
                      type="number"
                      min="0"
                      value={formData.trialDays}
                      onChange={(e) => setFormData(prev => ({ ...prev, trialDays: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="setupFee">Setup Fee</Label>
                    <Input
                      id="setupFee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.setupFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, setupFee: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Core Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Exams</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.features.exams === "Unlimited" ? -1 : formData.features.exams}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setFormData(prev => ({
                            ...prev,
                            features: { ...prev.features, exams: value === -1 ? "Unlimited" : value }
                          }));
                        }}
                        placeholder="Number or -1 for unlimited"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Questions</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.features.questions === "Unlimited" ? -1 : formData.features.questions}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setFormData(prev => ({
                            ...prev,
                            features: { ...prev.features, questions: value === -1 ? "Unlimited" : value }
                          }));
                        }}
                        placeholder="Number or -1 for unlimited"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Users</Label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.features.users === "Unlimited" ? -1 : formData.features.users}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setFormData(prev => ({
                            ...prev,
                            features: { ...prev.features, users: value === -1 ? "Unlimited" : value }
                          }));
                        }}
                        placeholder="Number or -1 for unlimited"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Storage</Label>
                      <Select 
                        value={formData.features.storage} 
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          features: { ...prev.features, storage: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {storageOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Support Level</Label>
                    <Select 
                      value={formData.features.support} 
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        features: { ...prev.features, support: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {supportLevels.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Analytics Dashboard</Label>
                    <Switch
                      checked={formData.features.analytics}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        features: { ...prev.features, analytics: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>API Access</Label>
                    <Switch
                      checked={formData.features.api}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        features: { ...prev.features, api: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Custom Branding</Label>
                    <Switch
                      checked={formData.features.customBranding}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        features: { ...prev.features, customBranding: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Live Proctoring</Label>
                    <Switch
                      checked={formData.features.liveProctoring}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        features: { ...prev.features, liveProctoring: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Certificate Generation</Label>
                    <Switch
                      checked={formData.features.certificateGeneration}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        features: { ...prev.features, certificateGeneration: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>White Labeling</Label>
                    <Switch
                      checked={formData.features.whiteLabeling}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        features: { ...prev.features, whiteLabeling: checked }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Custom Features */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.customFeatures.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="animate-fade-in">
                      {feature}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 p-0 h-auto"
                        onClick={() => removeCustomFeature(feature)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom feature..."
                    value={newCustomFeature}
                    onChange={(e) => setNewCustomFeature(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addCustomFeature()}
                  />
                  <Button type="button" variant="outline" onClick={addCustomFeature}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="limits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Usage Limits</CardTitle>
                <p className="text-sm text-muted-foreground">Set maximum usage limits for this plan</p>
              </CardHeader>
              <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Max Exams</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.limits.maxExams}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        limits: { ...prev.limits, maxExams: parseInt(e.target.value) }
                      }))}
                      placeholder="-1 for unlimited"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Users</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.limits.maxUsers}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        limits: { ...prev.limits, maxUsers: parseInt(e.target.value) }
                      }))}
                      placeholder="-1 for unlimited"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Questions</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.limits.maxQuestions}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        limits: { ...prev.limits, maxQuestions: parseInt(e.target.value) }
                      }))}
                      placeholder="-1 for unlimited"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Max Storage (GB)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.limits.maxStorage}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        limits: { ...prev.limits, maxStorage: parseInt(e.target.value) }
                      }))}
                      placeholder="-1 for unlimited"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Concurrent Exams</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.limits.maxConcurrentExams}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        limits: { ...prev.limits, maxConcurrentExams: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Marketing Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Popular Plan</Label>
                      <p className="text-sm text-muted-foreground">Mark as most popular</p>
                    </div>
                    <Switch
                      checked={formData.popular}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, popular: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Featured Plan</Label>
                      <p className="text-sm text-muted-foreground">Featured on pricing page</p>
                    </div>
                    <Switch
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ribbon">Ribbon Text</Label>
                    <Input
                      id="ribbon"
                      placeholder="e.g. Best Value, Limited Time"
                      value={formData.ribbon}
                      onChange={(e) => setFormData(prev => ({ ...prev, ribbon: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount: parseInt(e.target.value) }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plan Positioning</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Plan positioning and comparison tools will be available here.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary">
            {plan ? "Update Plan" : "Create Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}