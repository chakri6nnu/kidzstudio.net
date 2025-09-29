import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Mail, 
  ArrowLeft,
  BookOpen,
  AlertCircle,
  Loader2,
  CheckCircle,
  Send
} from "lucide-react";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
      console.log("Password reset email sent to:", email);
    }, 1000);
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log("Password reset email resent to:", email);
    }, 1000);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          {/* Logo and Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Check Your Email</h1>
            <p className="text-muted-foreground">We've sent you a password reset link</p>
          </div>

          {/* Success Card */}
          <Card className="border-border shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Email sent successfully!</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a password reset link to:
                  </p>
                  <p className="font-medium text-foreground">{email}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                  <p className="mb-2">
                    Click the link in your email to reset your password. The link will expire in 24 hours.
                  </p>
                  <p>
                    Don't see the email? Check your spam folder.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <Button 
                    onClick={handleResendEmail}
                    variant="outline" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Resend Email
                      </>
                    )}
                  </Button>

                  <Button asChild variant="ghost" className="w-full">
                    <Link to="/auth/login">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Sign In
                    </Link>
                  </Button>
                </div>
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
          <h1 className="text-3xl font-bold text-foreground">Forgot Password?</h1>
          <p className="text-muted-foreground">No worries, we'll send you reset instructions</p>
        </div>

        {/* Forgot Password Form */}
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Reset Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password
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

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-11 font-medium" 
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Reset Link
                  </>
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="text-center mt-6">
              <Button asChild variant="ghost" className="text-sm">
                <Link to="/auth/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center">
          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="text-muted-foreground mb-2">
              <strong>Still having trouble?</strong>
            </p>
            <p className="text-muted-foreground">
              Contact our support team at{" "}
              <a href="mailto:support@11prep.com" className="text-primary hover:underline">
                support@11prep.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}