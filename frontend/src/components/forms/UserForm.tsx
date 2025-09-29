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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Upload, Camera, Mail, Phone, Shield, User } from "lucide-react";

interface UserFormProps {
  user?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  trigger?: React.ReactNode;
}

export default function UserForm({ user, onSave, onCancel, trigger }: UserFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "Student",
    status: user?.status || "Active",
    avatar: user?.avatar || "",
    group: user?.group || "",
    subscriptionPlan: user?.subscriptionPlan || "Basic",
    bio: user?.bio || "",
    address: user?.address || "",
    dateOfBirth: user?.dateOfBirth || "",
    emergencyContact: user?.emergencyContact || "",
    permissions: user?.permissions || [],
    emailVerified: user?.emailVerified || false,
    twoFactorEnabled: user?.twoFactorEnabled || false,
    sendWelcomeEmail: !user, // Only for new users
  });

  const roles = ["Student", "Instructor", "Admin"];
  const statuses = ["Active", "Inactive", "Suspended"];
  const subscriptionPlans = ["Free Trial", "Basic", "Professional", "Enterprise"];
  const userGroups = [
    "Engineering Batch 2024",
    "Computer Science Faculty", 
    "Mathematics Group A",
    "Physics Advanced",
    "System Administrators"
  ];

  const handleSave = () => {
    onSave(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Add User</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Create New User"}</DialogTitle>
          <DialogDescription>
            {user ? "Update user information and settings" : "Add a new user to the system"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Profile Picture */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.avatar} alt={formData.name} />
                  <AvatarFallback className="text-xl">
                    {formData.name.split(' ').map(n => n[0]).join('').toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                  <Button variant="outline" size="sm">
                    <Camera className="mr-2 h-4 w-4" />
                    Take Photo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            {role}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">User Group</Label>
                <Select value={formData.group} onValueChange={(value) => setFormData(prev => ({ ...prev, group: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user group" />
                  </SelectTrigger>
                  <SelectContent>
                    {userGroups.map(group => (
                      <SelectItem key={group} value={group}>{group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan">Subscription Plan</Label>
                <Select value={formData.subscriptionPlan} onValueChange={(value) => setFormData(prev => ({ ...prev, subscriptionPlan: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptionPlans.map(plan => (
                      <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Additional Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio/Description</Label>
                <Textarea
                  id="bio"
                  placeholder="Brief description about the user..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter full address..."
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="min-h-[60px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  placeholder="Emergency contact number"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                />
              </div>
            </div>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailVerified">Email Verified</Label>
                    <p className="text-sm text-muted-foreground">User's email is verified</p>
                  </div>
                  <Switch
                    id="emailVerified"
                    checked={formData.emailVerified}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emailVerified: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Enable 2FA for account security</p>
                  </div>
                  <Switch
                    id="twoFactor"
                    checked={formData.twoFactorEnabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, twoFactorEnabled: checked }))}
                  />
                </div>

                {!user && (
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="welcomeEmail">Send Welcome Email</Label>
                      <p className="text-sm text-muted-foreground">Send welcome email to new user</p>
                    </div>
                    <Switch
                      id="welcomeEmail"
                      checked={formData.sendWelcomeEmail}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendWelcomeEmail: checked }))}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Welcome Email
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="mr-2 h-4 w-4" />
                  Send SMS Invite
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Shield className="mr-2 h-4 w-4" />
                  Reset Password
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary">
            {user ? "Update User" : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}