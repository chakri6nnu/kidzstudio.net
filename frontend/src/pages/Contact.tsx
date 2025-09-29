import React, { useState } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  HeadphonesIcon,
  Users,
  Building,
  Send,
  CheckCircle
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    inquiryType: ""
  });

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      contact: "support@qwiktest.com",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with our team Monday-Friday",
      contact: "+1 (555) 123-4567",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with us in real-time",
      contact: "Available 9AM-6PM EST",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      icon: HeadphonesIcon,
      title: "Premium Support",
      description: "Priority support for enterprise customers",
      contact: "enterprise@qwiktest.com",
      color: "text-warning",
      bgColor: "bg-warning/10"
    }
  ];

  const offices = [
    {
      city: "New York",
      address: "123 Education Ave, Suite 400",
      zipCode: "New York, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "ny@qwiktest.com"
    },
    {
      city: "San Francisco",
      address: "456 Tech Boulevard, Floor 15",
      zipCode: "San Francisco, CA 94105",
      phone: "+1 (555) 987-6543",
      email: "sf@qwiktest.com"
    },
    {
      city: "Austin",
      address: "789 Innovation Drive, Building C",
      zipCode: "Austin, TX 78701",
      phone: "+1 (555) 456-7890",
      email: "austin@qwiktest.com"
    }
  ];

  const faqs = [
    {
      question: "How quickly will I receive a response?",
      answer: "We typically respond to inquiries within 24 hours during business days. For urgent matters, please use our live chat or phone support."
    },
    {
      question: "Do you offer demo sessions?",
      answer: "Yes! We offer personalized demo sessions to show you how QwikTest can meet your specific needs. You can schedule one through our contact form."
    },
    {
      question: "What support is available for new users?",
      answer: "New users receive comprehensive onboarding support, including training sessions, documentation, and dedicated customer success manager for enterprise accounts."
    },
    {
      question: "Can I integrate QwikTest with my existing systems?",
      answer: "Absolutely! We offer various integration options including LMS integration, SSO, and API access. Our technical team can help with implementation."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    // Show success message or handle submission
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PublicLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 lg:py-32 bg-gradient-subtle">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20" variant="outline">
                Contact Us
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
                Get in Touch with
                <span className="block">Our Expert Team</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Whether you have questions about our platform, need technical support, or want to discuss 
                enterprise solutions, we're here to help. Reach out to us through any of the channels below.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <Card key={index} className="bg-gradient-card hover:shadow-elegant transition-all duration-300 group text-center">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${method.bgColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <method.icon className={`h-6 w-6 ${method.color}`} />
                    </div>
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-2">{method.description}</p>
                    <p className="font-medium">{method.contact}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div>
                <Badge className="mb-4 bg-accent/10 text-accent border-accent/20" variant="outline">
                  Send us a message
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Let's start a conversation
                </h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and we'll get back to you as soon as possible. 
                  For urgent matters, please use our live chat or phone support.
                </p>

                <Card className="bg-background">
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company">Company/Organization</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => handleChange("company", e.target.value)}
                            placeholder="Enter company name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="inquiryType">Inquiry Type</Label>
                          <Select value={formData.inquiryType} onValueChange={(value) => handleChange("inquiryType", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select inquiry type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Inquiry</SelectItem>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="support">Technical Support</SelectItem>
                              <SelectItem value="partnership">Partnership</SelectItem>
                              <SelectItem value="demo">Schedule Demo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleChange("subject", e.target.value)}
                          placeholder="What's this about?"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleChange("message", e.target.value)}
                          placeholder="Tell us more about your inquiry..."
                          className="min-h-[120px]"
                          required
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full bg-gradient-primary hover:bg-primary-hover">
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div>
                <Badge className="mb-4 bg-success/10 text-success border-success/20" variant="outline">
                  Get in touch
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  We're here to help
                </h2>
                <p className="text-muted-foreground mb-8">
                  Our team is distributed across multiple time zones to provide you with the best support possible.
                </p>

                {/* Office Locations */}
                <div className="space-y-6 mb-8">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Building className="mr-2 h-5 w-5" />
                    Our Offices
                  </h3>
                  {offices.map((office, index) => (
                    <Card key={index} className="bg-gradient-card">
                      <CardHeader>
                        <CardTitle className="text-lg">{office.city}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-1 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm">{office.address}</p>
                            <p className="text-sm text-muted-foreground">{office.zipCode}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                          <p className="text-sm">{office.phone}</p>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                          <p className="text-sm">{office.email}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Business Hours */}
                <Card className="bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Business Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium">10:00 AM - 4:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="text-muted-foreground">Closed</span>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Emergency support available 24/7 for enterprise customers
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-warning/10 text-warning border-warning/20" variant="outline">
                FAQ
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Quick answers to common questions. Can't find what you're looking for? 
                Contact us and we'll be happy to help.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground pl-8">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Don't wait to transform your assessment process. Start your free trial today 
              or schedule a personalized demo with our team.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}