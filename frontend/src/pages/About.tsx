import React from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  Target,
  Award,
  Globe,
  Heart,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
  Mail,
  Linkedin,
  Twitter
} from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Innovation",
      description: "We continuously innovate to provide cutting-edge assessment solutions that meet evolving educational needs.",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Heart,
      title: "Accessibility",
      description: "Education should be accessible to everyone. We design our platform to be inclusive and user-friendly.",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: Shield,
      title: "Integrity",
      description: "We maintain the highest standards of security and reliability to protect your educational data.",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      icon: Users,
      title: "Community",
      description: "We believe in building strong educational communities through collaboration and support.",
      color: "text-warning",
      bgColor: "bg-warning/10"
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "CEO & Founder",
      image: "/admin.png",
      bio: "Former education director with 15+ years in EdTech innovation",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/teacher.png",
      bio: "Tech veteran with expertise in scalable educational platforms",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Lisa Rodriguez",
      role: "Head of Product",
      image: "/student.png",
      bio: "UX expert passionate about creating intuitive learning experiences",
      social: { linkedin: "#", twitter: "#" }
    }
  ];

  const milestones = [
    { year: "2020", event: "QwikTest founded with vision to transform digital assessments" },
    { year: "2021", event: "Launched first MVP and onboarded 100+ educational institutions" },
    { year: "2022", event: "Reached 10,000+ active users and introduced AI-powered features" },
    { year: "2023", event: "Expanded globally with multi-language support and enterprise features" },
    { year: "2024", event: "Achieved 50,000+ users and launched mobile applications" },
    { year: "2025", event: "Leading platform with 100,000+ users across 50+ countries" }
  ];

  const stats = [
    { number: "100K+", label: "Active Users", icon: Users },
    { number: "50+", label: "Countries", icon: Globe },
    { number: "1M+", label: "Assessments", icon: BookOpen },
    { number: "99.9%", label: "Uptime", icon: TrendingUp }
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 lg:py-32 bg-gradient-subtle">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20" variant="outline">
                About QwikTest
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
                Transforming Education Through
                <span className="block">Smart Assessment Technology</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Founded in 2020, QwikTest has become the leading platform for creating, managing, and analyzing 
                educational assessments. We're passionate about empowering educators and enhancing learning outcomes 
                through innovative technology.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-primary hover:bg-primary-hover">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Us
                </Button>
                <Button size="lg" variant="outline">
                  <BookOpen className="mr-2 h-5 w-5" />
                  View Case Studies
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center bg-gradient-card">
                  <CardHeader>
                    <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold">{stat.number}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge className="mb-4 bg-accent/10 text-accent border-accent/20" variant="outline">
                  Our Mission
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Empowering educators to create better learning experiences
                </h2>
                <p className="text-xl text-muted-foreground mb-6">
                  We believe that effective assessment is the cornerstone of quality education. Our platform 
                  provides educators with the tools they need to create meaningful assessments that truly 
                  measure learning outcomes.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  From small classrooms to large institutions, we're committed to making assessment creation 
                  intuitive, analysis insightful, and results actionable.
                </p>
                
                <div className="space-y-4">
                  {[
                    "Democratize access to quality assessment tools",
                    "Support educators with data-driven insights",
                    "Enhance student learning through better feedback",
                    "Build inclusive and accessible educational technology"
                  ].map((point, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success mr-3" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-gradient-card">
                  <CardHeader>
                    <Award className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Award Winning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Recognized as the Best EdTech Platform 2024
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-card">
                  <CardHeader>
                    <Zap className="h-8 w-8 text-accent mb-2" />
                    <CardTitle>Lightning Fast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Average response time under 200ms globally
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-card">
                  <CardHeader>
                    <Shield className="h-8 w-8 text-success mb-2" />
                    <CardTitle>Enterprise Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      SOC2 compliant with bank-level encryption
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-card">
                  <CardHeader>
                    <Globe className="h-8 w-8 text-warning mb-2" />
                    <CardTitle>Global Reach</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Supporting education in 50+ countries
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-success/10 text-success border-success/20" variant="outline">
                Our Values
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                The principles that guide everything we do
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our core values shape our culture, drive our decisions, and define our commitment to the education community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="bg-gradient-card hover:shadow-elegant transition-all duration-300 group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${value.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <value.icon className={`h-6 w-6 ${value.color}`} />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-warning/10 text-warning border-warning/20" variant="outline">
                Our Team
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Meet the minds behind QwikTest
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our diverse team of educators, technologists, and innovators work together to create the future of educational assessment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {teamMembers.map((member, index) => (
                <Card key={index} className="bg-gradient-card hover:shadow-elegant transition-all duration-300 text-center">
                  <CardHeader>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4"
                    />
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <CardDescription className="text-primary font-medium">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{member.bio}</p>
                    <div className="flex justify-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20" variant="outline">
                Our Journey
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Five years of innovation and growth
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From a small startup to a global platform, here's how we've evolved to serve the education community.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-gradient-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center font-bold mr-6 flex-shrink-0">
                      {milestone.year}
                    </div>
                    <div className="flex-1">
                      <Card className="bg-gradient-card">
                        <CardContent className="pt-6">
                          <p className="text-lg">{milestone.event}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to join our mission?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Whether you're an educator, student, or institution, we'd love to help you achieve your educational goals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}