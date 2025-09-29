import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Users,
  Trophy,
  Target,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  BarChart3,
  Shield,
  Clock,
  Award,
  Zap,
  Globe,
  Smartphone,
  ChevronRight
} from "lucide-react";
import { Navigation } from "@/components/Navigation";

export default function LandingPage() {
  const features = [
    {
      icon: BookOpen,
      title: "Smart Question Bank",
      description: "Comprehensive library of questions across multiple subjects and difficulty levels",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Users,
      title: "User Management",
      description: "Efficiently manage students, teachers, and administrators with role-based access",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Detailed insights and performance analytics to track progress and identify improvements",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with reliable uptime and data protection",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      icon: Clock,
      title: "Real-time Monitoring",
      description: "Live exam monitoring with anti-cheating measures and instant notifications",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Responsive design that works perfectly on all devices and screen sizes",
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  const benefits = [
    "Create unlimited exams and quizzes",
    "Automated grading and instant results",
    "Customizable question types and formats",
    "Bulk import questions and users",
    "Detailed performance reports",
    "White-label branding options"
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Head of Education, Tech University",
      image: "/admin.png",
      quote: "QwikTest has revolutionized how we conduct assessments. The platform is intuitive, reliable, and has significantly improved our exam efficiency."
    },
    {
      name: "Michael Chen",
      role: "Training Manager, Global Corp",
      image: "/teacher.png", 
      quote: "The analytics and reporting features are outstanding. We can now track employee progress and identify training gaps more effectively."
    },
    {
      name: "Lisa Rodriguez",
      role: "Online Course Creator",
      image: "/student.png",
      quote: "As an educator, I love how easy it is to create engaging quizzes. My students enjoy the interactive experience and immediate feedback."
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small schools and individual educators",
      features: [
        "Up to 100 students",
        "5 exams per month",
        "Basic analytics",
        "Email support",
        "Question bank access"
      ],
      popular: false,
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month", 
      description: "Ideal for medium-sized institutions and companies",
      features: [
        "Up to 1,000 students",
        "Unlimited exams",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
        "Bulk import tools"
      ],
      popular: true,
      cta: "Get Started"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with specific requirements",
      features: [
        "Unlimited students",
        "Unlimited exams",
        "Custom integrations",
        "Dedicated support",
        "White-label solution",
        "API access",
        "Custom features"
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20" variant="outline">
              🚀 Now with AI-powered question generation
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              Modern Exam Platform for
              <span className="block">Educational Excellence</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create, manage, and analyze exams with our comprehensive platform. 
              From question banks to detailed analytics, everything you need in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-primary hover:bg-primary-hover shadow-primary text-lg px-8">
                <Play className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <BookOpen className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </div>
            
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-success" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-success" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-success" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20" variant="outline">
              Features
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything you need for successful assessments
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to streamline your examination process and enhance learning outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card hover:shadow-elegant transition-all duration-300 group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-success/10 text-success border-success/20" variant="outline">
                Benefits
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Why educators choose QwikTest
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of educators who have transformed their assessment process with our platform.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-success/10 p-1 rounded-full mr-4">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" className="mt-8 bg-gradient-primary hover:bg-primary-hover">
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-gradient-card">
                <CardHeader>
                  <Trophy className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-2xl">98%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Customer satisfaction rate</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card">
                <CardHeader>
                  <Users className="h-8 w-8 text-accent mb-2" />
                  <CardTitle className="text-2xl">50K+</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Active users worldwide</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card">
                <CardHeader>
                  <Target className="h-8 w-8 text-success mb-2" />
                  <CardTitle className="text-2xl">1M+</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Exams conducted</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card">
                <CardHeader>
                  <Award className="h-8 w-8 text-warning mb-2" />
                  <CardTitle className="text-2xl">99.9%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Platform uptime</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-warning/10 text-warning border-warning/20" variant="outline">
              Testimonials
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Trusted by educators worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our customers have to say about their experience with QwikTest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-card hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-warning fill-current" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20" variant="outline">
              Pricing
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Choose the perfect plan for your needs
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Flexible pricing options to suit organizations of all sizes. Start free and scale as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={cn(
                "relative bg-gradient-card hover:shadow-elegant transition-all duration-300",
                plan.popular ? "border-primary shadow-primary/20 scale-105" : ""
              )}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-success mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={cn(
                      "w-full",
                      plan.popular ? "bg-gradient-primary hover:bg-primary-hover" : ""
                    )}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <Card className="bg-gradient-primary text-primary-foreground">
            <CardContent className="py-16 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to transform your assessments?
              </h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Join thousands of educators who are already using QwikTest to create better learning experiences.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-white/20 hover:bg-white/10">
                  <Users className="mr-2 h-5 w-5" />
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  QwikTest
                </span>
              </Link>
              <p className="text-muted-foreground mb-4">
                The modern platform for creating, managing, and analyzing educational assessments.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Users className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <BookOpen className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/integrations" className="hover:text-foreground transition-colors">Integrations</Link></li>
                <li><Link to="/api" className="hover:text-foreground transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link to="/tutorials" className="hover:text-foreground transition-colors">Tutorials</Link></li>
                <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to="/support" className="hover:text-foreground transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
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