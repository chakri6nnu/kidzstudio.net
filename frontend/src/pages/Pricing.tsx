import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Star,
  Zap,
  Crown,
  Users,
  Globe,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";

const pricingPlans = [
  {
    id: "basic",
    name: "Basic Practice",
    price: 19.99,
    period: "month",
    description: "Perfect for getting started with 11+ practice",
    icon: Check,
    features: [
      "Access to 500+ practice questions",
      "5 mock exams per month",
      "Basic progress tracking",
      "Email support",
      "Mobile app access",
    ],
    popular: false,
    cta: "Start Free Trial",
  },
  {
    id: "premium",
    name: "Premium Package",
    price: 39.99,
    period: "month",
    description: "Most popular choice for serious preparation",
    icon: Star,
    features: [
      "Access to 2000+ practice questions",
      "Unlimited mock exams",
      "Advanced analytics & progress tracking",
      "Subject-specific practice tests",
      "Video explanations for all questions",
      "Priority email support",
      "Mobile app access",
      "Downloadable worksheets",
    ],
    popular: true,
    cta: "Get Started",
  },
  {
    id: "intensive",
    name: "Intensive Prep",
    price: 79.99,
    period: "month",
    description: "Complete preparation package with tutoring",
    icon: Crown,
    features: [
      "Everything in Premium",
      "Access to 5000+ practice questions",
      "1-on-1 online tutoring sessions (4 hours/month)",
      "Personalized study plans",
      "School-specific practice papers",
      "Parent progress reports",
      "Live group classes",
      "24/7 chat support",
      "Exam day preparation guide",
    ],
    popular: false,
    cta: "Contact Sales",
  },
];

const annualDiscounts = {
  basic: { original: 239.88, discounted: 179.99, savings: 59.89 },
  premium: { original: 479.88, discounted: 359.99, savings: 119.89 },
  intensive: { original: 959.88, discounted: 719.99, savings: 239.89 },
};

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = React.useState<
    "monthly" | "annual"
  >("monthly");

  const handleCheckout = (planId: string) => {
    // This would integrate with your payment provider
    console.log(
      `Proceeding to checkout for plan: ${planId}, billing: ${billingPeriod}`
    );
    // For now, we'll just alert - replace with actual checkout logic
    alert(
      `Redirecting to checkout for ${planId} plan (${billingPeriod} billing)`
    );
  };

  const getPrice = (plan: any) => {
    if (billingPeriod === "annual") {
      const annualData =
        annualDiscounts[plan.id as keyof typeof annualDiscounts];
      return annualData.discounted;
    }
    return plan.price;
  };

  const getOriginalPrice = (plan: any) => {
    if (billingPeriod === "annual") {
      const annualData =
        annualDiscounts[plan.id as keyof typeof annualDiscounts];
      return annualData.original;
    }
    return null;
  };

  const getSavings = (plan: any) => {
    if (billingPeriod === "annual") {
      const annualData =
        annualDiscounts[plan.id as keyof typeof annualDiscounts];
      return annualData.savings;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge
            className="mb-6 bg-primary/10 text-primary border-primary/20"
            variant="outline"
          >
            🚀 Flexible Pricing Plans
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Choose Your Success Plan
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Get ready for educational excellence with our comprehensive practice
            platform. From question banks to detailed analytics, everything you
            need in one place.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span
              className={`text-lg ${
                billingPeriod === "monthly" ? "text-white" : "text-white/70"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingPeriod(
                  billingPeriod === "monthly" ? "annual" : "monthly"
                )
              }
              className={`relative inline-flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                billingPeriod === "annual" ? "bg-white" : "bg-white/30"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-primary transition-transform ${
                  billingPeriod === "annual"
                    ? "translate-x-3"
                    : "-translate-x-3"
                }`}
              />
            </button>
            <span
              className={`text-lg ${
                billingPeriod === "annual" ? "text-white" : "text-white/70"
              }`}
            >
              Annual
            </span>
            {billingPeriod === "annual" && (
              <Badge variant="secondary" className="ml-2">
                Save up to 30%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 -mt-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => {
              const Icon = plan.icon;
              const price = getPrice(plan);
              const originalPrice = getOriginalPrice(plan);
              const savings = getSavings(plan);

              return (
                <Card
                  key={plan.id}
                  className={`relative ${
                    plan.popular
                      ? "border-primary shadow-primary scale-105 bg-gradient-card"
                      : "border-border hover:border-primary/50"
                  } transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-6 py-2">
                        <Star className="w-4 h-4 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-2">
                    <div
                      className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                        plan.popular
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="text-center pb-2">
                    <div className="mb-6">
                      {originalPrice && (
                        <div className="text-muted-foreground line-through text-lg mb-1">
                          £{originalPrice}
                        </div>
                      )}
                      <div className="text-4xl font-bold text-foreground">
                        £{price}
                      </div>
                      <div className="text-muted-foreground">
                        per {billingPeriod === "annual" ? "year" : "month"}
                      </div>
                      {savings && (
                        <div className="text-success font-semibold mt-2">
                          Save £{savings}
                        </div>
                      )}
                    </div>

                    <ul className="space-y-3 text-left">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      asChild
                      className={`w-full ${
                        plan.popular
                          ? "bg-primary hover:bg-primary-hover shadow-primary"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                      size="lg"
                    >
                      <Link
                        to={
                          plan.id === "intensive" ? "/contact" : "/auth/signup"
                        }
                      >
                        {plan.popular && <Zap className="w-4 h-4 mr-2" />}
                        {plan.cta}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge
              className="mb-4 bg-accent/10 text-accent border-accent/20"
              variant="outline"
            >
              Features
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trusted by thousands of educators worldwide to create better
              learning experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
              <p className="text-muted-foreground">
                95% of our users improve their performance within 3 months of
                practice
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Content</h3>
              <p className="text-muted-foreground">
                Questions created by qualified teachers and educational
                specialists
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive</h3>
              <p className="text-muted-foreground">
                Complete assessment solution with analytics, reporting, and
                management tools
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge
              className="mb-4 bg-warning/10 text-warning border-warning/20"
              variant="outline"
            >
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our platform and pricing
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.",
              },
              {
                q: "Are the practice questions similar to real exams?",
                a: "Absolutely! Our questions are created by qualified teachers and are designed to match the format and difficulty of actual educational assessments.",
              },
              {
                q: "Is there a free trial available?",
                a: "Yes, we offer a 7-day free trial for all new users. You can explore our platform and practice questions before committing to a subscription.",
              },
              {
                q: "What subjects are covered in the platform?",
                a: "We cover all core subjects: Mathematics, English, Science, and more. Plus additional subjects depending on your educational needs and target requirements.",
              },
              {
                q: "Do you offer institutional pricing?",
                a: "Yes, we offer special pricing for schools, universities, and organizations. Contact our sales team for custom pricing options.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers. Enterprise customers can also pay via invoice.",
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className="bg-gradient-card hover:shadow-elegant transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Educational Experience?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of educators who are already using QwikTest to create
            better learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/auth/signup">
                <Zap className="mr-2 h-5 w-5" />
                Start Free Trial
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              <Link to="/contact">
                <Users className="mr-2 h-5 w-5" />
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">QwikTest</h3>
              <p className="text-muted-foreground mb-4">
                The modern platform for creating, managing, and analyzing
                educational assessments.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/">
                    <Globe className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/contact">
                    <Mail className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/contact">
                    <Phone className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    to="/features"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/integrations"
                    className="hover:text-foreground transition-colors"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    to="/api"
                    className="hover:text-foreground transition-colors"
                  >
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    to="/docs"
                    className="hover:text-foreground transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tutorials"
                    className="hover:text-foreground transition-colors"
                  >
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/support"
                    className="hover:text-foreground transition-colors"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 QwikTest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
