import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";

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
  },
];

const annualDiscounts = {
  basic: { original: 239.88, discounted: 179.99, savings: 59.89 },
  premium: { original: 479.88, discounted: 359.99, savings: 119.89 },
  intensive: { original: 959.88, discounted: 719.99, savings: 239.89 },
};

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = React.useState<"monthly" | "annual">("monthly");

  const handleCheckout = (planId: string) => {
    // This would integrate with your payment provider
    console.log(`Proceeding to checkout for plan: ${planId}, billing: ${billingPeriod}`);
    // For now, we'll just alert - replace with actual checkout logic
    alert(`Redirecting to checkout for ${planId} plan (${billingPeriod} billing)`);
  };

  const getPrice = (plan: any) => {
    if (billingPeriod === "annual") {
      const annualData = annualDiscounts[plan.id as keyof typeof annualDiscounts];
      return annualData.discounted;
    }
    return plan.price;
  };

  const getOriginalPrice = (plan: any) => {
    if (billingPeriod === "annual") {
      const annualData = annualDiscounts[plan.id as keyof typeof annualDiscounts];
      return annualData.original;
    }
    return null;
  };

  const getSavings = (plan: any) => {
    if (billingPeriod === "annual") {
      const annualData = annualDiscounts[plan.id as keyof typeof annualDiscounts];
      return annualData.savings;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Choose Your 11+ Success Plan
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Get your child ready for grammar school entrance exams with our comprehensive practice platform
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-lg ${billingPeriod === 'monthly' ? 'text-white' : 'text-white/70'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className={`relative inline-flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                billingPeriod === 'annual' ? 'bg-white' : 'bg-white/30'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-primary transition-transform ${
                  billingPeriod === 'annual' ? 'translate-x-3' : '-translate-x-3'
                }`}
              />
            </button>
            <span className={`text-lg ${billingPeriod === 'annual' ? 'text-white' : 'text-white/70'}`}>
              Annual
            </span>
            {billingPeriod === 'annual' && (
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
                      ? 'border-primary shadow-primary scale-105 bg-gradient-card'
                      : 'border-border hover:border-primary/50'
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
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      plan.popular ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
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
                        per {billingPeriod === 'annual' ? 'year' : 'month'}
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
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <CardFooter>
                    <Button
                      onClick={() => handleCheckout(plan.id)}
                      className={`w-full ${
                        plan.popular
                          ? 'bg-primary hover:bg-primary-hover shadow-primary'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                      size="lg"
                    >
                      {plan.popular && <Zap className="w-4 h-4 mr-2" />}
                      Start {billingPeriod === 'annual' ? 'Annual' : 'Monthly'} Plan
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
            <h2 className="text-3xl font-bold mb-4">Why Choose Our 11+ Practice Platform?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trusted by thousands of families across the UK to help children succeed in grammar school entrance exams
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
              <p className="text-muted-foreground">
                95% of our students improve their scores within 3 months of practice
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Content</h3>
              <p className="text-muted-foreground">
                Questions created by qualified teachers and 11+ specialists
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-2">School-Specific</h3>
              <p className="text-muted-foreground">
                Practice papers tailored to specific grammar schools and regions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period."
              },
              {
                q: "Are the practice questions similar to real 11+ exams?",
                a: "Absolutely! Our questions are created by qualified teachers and are designed to match the format and difficulty of actual 11+ entrance exams."
              },
              {
                q: "Is there a free trial available?",
                a: "Yes, we offer a 7-day free trial for all new users. You can explore our platform and practice questions before committing to a subscription."
              },
              {
                q: "What subjects are covered in the 11+ practice?",
                a: "We cover all core 11+ subjects: English, Mathematics, Verbal Reasoning, and Non-Verbal Reasoning, plus additional subjects depending on your target school."
              }
            ].map((faq, index) => (
              <Card key={index}>
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
            Ready to Start Your 11+ Journey?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of successful families and give your child the best preparation for grammar school entrance exams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => handleCheckout('premium')}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              View Sample Questions
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}