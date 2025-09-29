import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  ArrowRight,
  BookOpen,
  AlertCircle,
  Loader2,
  CheckCircle,
  X,
  Check
} from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (getPasswordStrength(formData.password) < 75) {
      setError("Please choose a stronger password");
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      console.log("Password reset successful");
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const getStrengthText = (strength: number) => {
    if (strength < 25) return "Very Weak";
    if (strength < 50) return "Weak";
    if (strength < 75) return "Good";
    return "Strong";
  };

  // If no token, show error
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
        <div className="w-full max-w-md space-y-6">
          <Card className="border-border shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                  <X className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Invalid Reset Link</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    This password reset link is invalid or has expired.
                  </p>
                </div>
                <Button asChild className="w-full">
                  <Link to="/auth/forgot-password">
                    Request New Reset Link
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          {/* Logo and Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Password Reset</h1>
            <p className="text-muted-foreground">Your password has been successfully updated</p>
          </div>

          {/* Success Card */}
          <Card className="border-border shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Password updated successfully!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your password has been reset. You can now sign in with your new password.
                  </p>
                </div>

                <Button asChild className="w-full">
                  <Link to="/auth/login">
                    Sign In to Your Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
          <p className="text-muted-foreground">Enter your new password below</p>
        </div>

        {/* Reset Password Form */}
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Create New Password</CardTitle>
            <CardDescription>
              Choose a strong password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="animate-scale-in">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Password Requirements */}
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="font-medium text-foreground mb-2">Password requirements:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${formData.password.length >= 8 ? 'bg-success' : 'bg-muted'}`} />
                    At least 8 characters
                  </li>
                  <li className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${/[A-Z]/.test(formData.password) ? 'bg-success' : 'bg-muted'}`} />
                    One uppercase letter
                  </li>
                  <li className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${/[a-z]/.test(formData.password) ? 'bg-success' : 'bg-muted'}`} />
                    One lowercase letter
                  </li>
                  <li className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${/[0-9]/.test(formData.password) ? 'bg-success' : 'bg-muted'}`} />
                    One number
                  </li>
                </ul>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Password strength:</span>
                      <span className={passwordStrength >= 75 ? "text-success" : passwordStrength >= 50 ? "text-warning" : "text-destructive"}>
                        {getStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <Progress 
                      value={passwordStrength} 
                      className="h-2"
                    />
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="flex items-center text-xs mt-1">
                    {formData.password === formData.confirmPassword ? (
                      <div className="flex items-center text-success">
                        <Check className="h-3 w-3 mr-1" />
                        Passwords match
                      </div>
                    ) : (
                      <div className="flex items-center text-destructive">
                        <X className="h-3 w-3 mr-1" />
                        Passwords do not match
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-11 font-medium" 
                disabled={isLoading || !formData.password || !formData.confirmPassword}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating password...
                  </>
                ) : (
                  <>
                    Update Password
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link 
                  to="/auth/login" 
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}