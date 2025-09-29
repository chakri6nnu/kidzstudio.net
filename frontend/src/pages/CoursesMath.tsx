import React from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  Users,
  Clock,
  Star,
  Play,
  BookOpen,
  TrendingUp,
  Target,
  Award,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

export default function CoursesMath() {
  const mathCourses = [
    {
      id: 1,
      title: "Algebra Fundamentals",
      description: "Master the basics of algebra including equations, inequalities, and graphing.",
      instructor: "Dr. Sarah Johnson",
      duration: "8 weeks",
      students: 2456,
      rating: 4.9,
      level: "Beginner",
      modules: 12,
      price: "Free",
      image: "/admin.png",
      topics: ["Linear Equations", "Quadratic Functions", "Polynomials", "Factoring"],
      featured: true
    },
    {
      id: 2,
      title: "Geometry & Trigonometry",
      description: "Explore shapes, angles, and spatial relationships with practical applications.",
      instructor: "Prof. Michael Chen",
      duration: "10 weeks",
      students: 1834,
      rating: 4.8,
      level: "Intermediate",
      modules: 15,
      price: "Free",
      image: "/teacher.png",
      topics: ["Plane Geometry", "Solid Geometry", "Trigonometric Functions", "Proofs"],
      featured: true
    },
    {
      id: 3,
      title: "Calculus I",
      description: "Introduction to limits, derivatives, and their applications in real-world problems.",
      instructor: "Dr. Lisa Rodriguez",
      duration: "12 weeks",
      students: 1267,
      rating: 4.7,
      level: "Advanced",
      modules: 18,
      price: "Free",
      image: "/student.png",
      topics: ["Limits", "Derivatives", "Chain Rule", "Optimization"],
      featured: true
    },
    {
      id: 4,
      title: "Statistics & Probability",
      description: "Learn data analysis, probability theory, and statistical inference methods.",
      instructor: "Prof. James Wilson",
      duration: "9 weeks",
      students: 1956,
      rating: 4.8,
      level: "Intermediate",
      modules: 14,
      price: "Free",
      image: "/admin.png",
      topics: ["Descriptive Statistics", "Probability", "Hypothesis Testing", "Regression"],
      featured: false
    },
    {
      id: 5,
      title: "Linear Algebra",
      description: "Vector spaces, matrices, eigenvalues, and their applications in various fields.",
      instructor: "Dr. Emily Park",
      duration: "11 weeks",
      students: 892,
      rating: 4.6,
      level: "Advanced",
      modules: 16,
      price: "Free",
      image: "/teacher.png",
      topics: ["Vectors", "Matrices", "Eigenvalues", "Linear Transformations"],
      featured: false
    },
    {
      id: 6,
      title: "Discrete Mathematics",
      description: "Logic, sets, combinatorics, and graph theory for computer science applications.",
      instructor: "Prof. Ryan Kim",
      duration: "10 weeks",
      students: 723,
      rating: 4.7,
      level: "Advanced",
      modules: 13,
      price: "Free",
      image: "/student.png",
      topics: ["Logic", "Set Theory", "Combinatorics", "Graph Theory"],
      featured: false
    }
  ];

  const skills = [
    {
      icon: Calculator,
      title: "Problem Solving",
      description: "Develop analytical thinking and systematic problem-solving approaches"
    },
    {
      icon: BarChart3,
      title: "Data Analysis",
      description: "Learn to interpret and analyze mathematical data and patterns"
    },
    {
      icon: Target,
      title: "Logical Reasoning",
      description: "Strengthen logical thinking and mathematical reasoning skills"
    },
    {
      icon: PieChart,
      title: "Statistical Thinking",
      description: "Understand probability and statistical concepts for real-world applications"
    }
  ];

  const benefits = [
    "Interactive problem-solving exercises",
    "Step-by-step solution explanations",
    "Real-world application examples",
    "Practice tests and assessments",
    "Visual learning with graphs and diagrams",
    "Progress tracking and analytics"
  ];

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner": return "bg-success/10 text-success border-success/20";
      case "intermediate": return "bg-warning/10 text-warning border-warning/20";
      case "advanced": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 lg:py-32 bg-gradient-subtle">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge className="mb-6 bg-primary/10 text-primary border-primary/20" variant="outline">
                  Mathematics Courses
                </Badge>
                
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
                  Master Mathematics
                  <span className="block">From Basics to Advanced</span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8">
                  Comprehensive mathematics courses designed to build strong foundations and advanced skills. 
                  From algebra to calculus, our expert instructors guide you through every concept with 
                  clear explanations and practical applications.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-gradient-primary hover:bg-primary-hover">
                    <Play className="mr-2 h-5 w-5" />
                    Start Learning
                  </Button>
                  <Button size="lg" variant="outline">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Course Catalog
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-gradient-card">
                  <CardHeader>
                    <Calculator className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-2xl">6</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Mathematics Courses</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card">
                  <CardHeader>
                    <Users className="h-8 w-8 text-accent mb-2" />
                    <CardTitle className="text-2xl">8K+</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Students Enrolled</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card">
                  <CardHeader>
                    <Star className="h-8 w-8 text-warning mb-2" />
                    <CardTitle className="text-2xl">4.8</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Average Rating</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card">
                  <CardHeader>
                    <Award className="h-8 w-8 text-success mb-2" />
                    <CardTitle className="text-2xl">94%</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Success Rate</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/20" variant="outline">
                Skills You'll Gain
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Essential mathematical skills for academic and career success
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our mathematics courses are designed to develop critical thinking and problem-solving abilities 
                that are valuable in any field.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {skills.map((skill, index) => (
                <Card key={index} className="bg-gradient-card hover:shadow-elegant transition-all duration-300 text-center">
                  <CardHeader>
                    <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                      <skill.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{skill.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {skill.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-success/10 text-success border-success/20" variant="outline">
                Featured Courses
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Popular Mathematics Courses
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Start your mathematical journey with our most popular and highly-rated courses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mathCourses.filter(course => course.featured).map((course) => (
                <Card key={course.id} className="bg-gradient-card hover:shadow-elegant transition-all duration-300 group">
                  <div className="relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-4 left-4 bg-warning text-warning-foreground">
                      Featured
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`absolute top-4 right-4 ${getLevelColor(course.level)}`}
                    >
                      {course.level}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-warning fill-current mr-1" />
                        <span className="text-sm font-medium">{course.rating}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {course.modules} modules
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="mr-4">{course.students.toLocaleString()} students</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {course.topics.slice(0, 2).map((topic, topicIndex) => (
                          <Badge key={topicIndex} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {course.topics.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{course.topics.length - 2} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                          <p className="font-semibold text-lg">{course.price}</p>
                        </div>
                        <Button className="bg-gradient-primary hover:bg-primary-hover">
                          <Play className="mr-2 h-4 w-4" />
                          Enroll Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* All Courses */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Complete Mathematics Curriculum
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From foundational concepts to advanced topics, our comprehensive curriculum 
                covers all areas of mathematics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mathCourses.map((course) => (
                <Card key={course.id} className="bg-gradient-card hover:shadow-elegant transition-all duration-300 group">
                  <div className="flex">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-32 h-32 object-cover rounded-l-lg flex-shrink-0"
                    />
                    <div className="flex-1 p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getLevelColor(course.level)}`}
                        >
                          {course.level}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-warning fill-current mr-1" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="mr-4">{course.students.toLocaleString()}</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="mr-4">{course.duration}</span>
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{course.modules} modules</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">by {course.instructor}</p>
                          <p className="font-semibold">{course.price}</p>
                        </div>
                        <Button size="sm" className="bg-gradient-primary hover:bg-primary-hover">
                          <Play className="mr-1 h-3 w-3" />
                          Enroll
                        </Button>
                      </div>
                    </div>
                  </div>
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
                <Badge className="mb-4 bg-warning/10 text-warning border-warning/20" variant="outline">
                  Learning Benefits
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Why choose our mathematics courses?
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Our mathematics courses are designed with proven pedagogical methods to ensure 
                  effective learning and skill development.
                </p>

                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="mt-8 bg-gradient-primary hover:bg-primary-hover">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  View Course Syllabus
                </Button>
              </div>

              <div className="space-y-6">
                <Card className="bg-gradient-card">
                  <CardHeader>
                    <div className="flex items-center">
                      <Activity className="h-6 w-6 text-primary mr-3" />
                      <CardTitle>Interactive Learning</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Engage with interactive problem-solving tools and visual demonstrations 
                      that make complex concepts easier to understand.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card">
                  <CardHeader>
                    <div className="flex items-center">
                      <Target className="h-6 w-6 text-accent mr-3" />
                      <CardTitle>Personalized Progress</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Track your progress with detailed analytics and receive personalized 
                      recommendations for areas that need improvement.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card">
                  <CardHeader>
                    <div className="flex items-center">
                      <Award className="h-6 w-6 text-success mr-3" />
                      <CardTitle>Expert Support</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Get help from experienced mathematics educators and connect with 
                      a community of fellow learners.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to master mathematics?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have improved their mathematical skills with our comprehensive courses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Start Free Course
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
                <Link to="/courses">View All Courses</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}