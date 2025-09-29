import React, { useState } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Calculator,
  Globe,
  Microscope,
  Palette,
  Code,
  Users,
  Clock,
  Star,
  Search,
  Filter,
  Play,
  Award,
  TrendingUp,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Courses", icon: BookOpen },
    { id: "mathematics", name: "Mathematics", icon: Calculator },
    { id: "science", name: "Science", icon: Microscope },
    { id: "language", name: "Language Arts", icon: Globe },
    { id: "arts", name: "Creative Arts", icon: Palette },
    { id: "technology", name: "Technology", icon: Code }
  ];

  const courses = [
    {
      id: 1,
      title: "Advanced Mathematics",
      category: "mathematics",
      description: "Comprehensive math course covering algebra, geometry, and calculus concepts.",
      instructor: "Dr. Sarah Johnson",
      duration: "12 weeks",
      students: 1234,
      rating: 4.8,
      level: "Advanced",
      price: "Free",
      image: "/admin.png",
      topics: ["Algebra", "Geometry", "Calculus", "Statistics"],
      featured: true
    },
    {
      id: 2,
      title: "Physics Fundamentals",
      category: "science",
      description: "Explore the fundamental laws of physics through interactive experiments and simulations.",
      instructor: "Prof. Michael Chen",
      duration: "10 weeks",
      students: 987,
      rating: 4.7,
      level: "Intermediate",
      price: "Free",
      image: "/teacher.png",
      topics: ["Mechanics", "Thermodynamics", "Optics", "Electricity"],
      featured: false
    },
    {
      id: 3,
      title: "Chemistry Laboratory",
      category: "science",
      description: "Hands-on chemistry experiments and theoretical concepts for better understanding.",
      instructor: "Dr. Lisa Rodriguez",
      duration: "8 weeks",
      students: 756,
      rating: 4.9,
      level: "Beginner",
      price: "Free",
      image: "/student.png",
      topics: ["Organic Chemistry", "Inorganic Chemistry", "Lab Techniques"],
      featured: true
    },
    {
      id: 4,
      title: "English Literature",
      category: "language",
      description: "Explore classic and contemporary literature with critical analysis and discussion.",
      instructor: "Prof. James Wilson",
      duration: "14 weeks",
      students: 892,
      rating: 4.6,
      level: "Intermediate",
      price: "Free",
      image: "/admin.png",
      topics: ["Poetry", "Drama", "Novels", "Critical Analysis"],
      featured: false
    },
    {
      id: 5,
      title: "Creative Writing",
      category: "language",
      description: "Develop your writing skills through creative exercises and peer feedback.",
      instructor: "Sarah Thompson",
      duration: "6 weeks",
      students: 534,
      rating: 4.7,
      level: "Beginner",
      price: "Free",
      image: "/teacher.png",
      topics: ["Fiction Writing", "Poetry", "Essay Writing", "Editing"],
      featured: false
    },
    {
      id: 6,
      title: "Digital Art & Design",
      category: "arts",
      description: "Learn digital art techniques and design principles using modern tools.",
      instructor: "Alex Martinez",
      duration: "10 weeks",
      students: 678,
      rating: 4.8,
      level: "Intermediate",
      price: "Free",
      image: "/student.png",
      topics: ["Digital Painting", "Graphic Design", "UI/UX", "Animation"],
      featured: true
    },
    {
      id: 7,
      title: "Programming Basics",
      category: "technology",
      description: "Introduction to programming concepts using Python and JavaScript.",
      instructor: "Dr. Ryan Kim",
      duration: "12 weeks",
      students: 1456,
      rating: 4.9,
      level: "Beginner",
      price: "Free",
      image: "/admin.png",
      topics: ["Python", "JavaScript", "Web Development", "Algorithms"],
      featured: true
    },
    {
      id: 8,
      title: "Web Development",
      category: "technology",
      description: "Build modern web applications using HTML, CSS, JavaScript, and React.",
      instructor: "Jennifer Park",
      duration: "16 weeks",
      students: 1123,
      rating: 4.8,
      level: "Advanced",
      price: "Free",
      image: "/teacher.png",
      topics: ["HTML/CSS", "JavaScript", "React", "Node.js"],
      featured: false
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = [
    { number: "50+", label: "Courses Available", icon: BookOpen },
    { number: "10K+", label: "Students Enrolled", icon: Users },
    { number: "4.8", label: "Average Rating", icon: Star },
    { number: "95%", label: "Completion Rate", icon: Award }
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
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20" variant="outline">
                Course Catalog
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
                Discover Your Next
                <span className="block">Learning Adventure</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Explore our comprehensive collection of courses designed by expert educators. 
                From mathematics to creative arts, find the perfect course to advance your knowledge and skills.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search courses, instructors, or topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 text-lg"
                  />
                </div>
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

        {/* Categories & Courses */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container">
            {/* Category Filter */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <Filter className="h-5 w-5 text-muted-foreground mr-2" />
                <h3 className="text-lg font-semibold">Filter by Category</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center"
                  >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Featured Courses */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <Star className="h-6 w-6 text-warning mr-2" />
                <h2 className="text-2xl font-bold">Featured Courses</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.filter(course => course.featured).map((course) => (
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
                        <Badge variant="outline" className="text-xs">
                          {categories.find(c => c.id === course.category)?.name}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-warning fill-current mr-1" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
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
                          {course.topics.slice(0, 3).map((topic, topicIndex) => (
                            <Badge key={topicIndex} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {course.topics.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{course.topics.length - 3} more
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
                            Start Course
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* All Courses */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">All Courses</h2>
                <p className="text-muted-foreground">
                  Showing {filteredCourses.length} of {courses.length} courses
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="bg-gradient-card hover:shadow-elegant transition-all duration-300 group">
                    <div className="relative">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {course.featured && (
                        <Badge className="absolute top-4 left-4 bg-warning text-warning-foreground">
                          Featured
                        </Badge>
                      )}
                      <Badge 
                        variant="outline" 
                        className={`absolute top-4 right-4 ${getLevelColor(course.level)}`}
                      >
                        {course.level}
                      </Badge>
                    </div>
                    
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {categories.find(c => c.id === course.category)?.name}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-warning fill-current mr-1" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
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
                          {course.topics.slice(0, 3).map((topic, topicIndex) => (
                            <Badge key={topicIndex} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {course.topics.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{course.topics.length - 3} more
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
                            Start Course
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria to find more courses.
                </p>
                <Button variant="outline" onClick={() => {setSearchTerm(""); setSelectedCategory("all");}}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-success/10 text-success border-success/20" variant="outline">
                Why Choose Our Courses
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Learn with confidence and flexibility
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our courses are designed to provide you with the best learning experience possible.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: CheckCircle,
                  title: "Expert Instructors",
                  description: "Learn from industry professionals and experienced educators with proven track records."
                },
                {
                  icon: Clock,
                  title: "Flexible Learning",
                  description: "Study at your own pace with lifetime access to course materials and resources."
                },
                {
                  icon: Award,
                  title: "Certificates",
                  description: "Earn certificates upon completion to showcase your new skills to employers."
                },
                {
                  icon: Users,
                  title: "Community Support",
                  description: "Join a community of learners and get help from peers and instructors."
                },
                {
                  icon: TrendingUp,
                  title: "Skill Assessment",
                  description: "Regular quizzes and projects to track your progress and reinforce learning."
                },
                {
                  icon: BookOpen,
                  title: "Comprehensive Content",
                  description: "In-depth curriculum covering theory, practical applications, and real-world examples."
                }
              ].map((benefit, index) => (
                <Card key={index} className="bg-gradient-card hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <benefit.icon className="h-8 w-8 text-primary mb-4" />
                    <CardTitle>{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {benefit.description}
                    </CardDescription>
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
              Ready to start learning?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already advancing their skills with our comprehensive courses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Browse All Courses
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
                <Link to="/contact">Contact Advisor</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}