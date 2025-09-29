import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import QuestionForm from "@/components/forms/QuestionForm";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditQuestion() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock categories data - replace with actual data from API
  const categories = [
    { id: "1", name: "Mathematics" },
    { id: "2", name: "Science" },
    { id: "3", name: "History" },
    { id: "4", name: "Literature" },
    { id: "5", name: "Computer Science" },
  ];

  // Mock question data - replace with actual API call
  const mockQuestion = {
    id: id,
    title: "What is the capital of France?",
    type: "multiple_choice",
    category_id: "3",
    difficulty: "easy",
    points: 10,
    explanation: "Paris has been the capital of France since the 12th century.",
    options: [
      { text: "London", is_correct: false },
      { text: "Berlin", is_correct: false },
      { text: "Paris", is_correct: true },
      { text: "Madrid", is_correct: false },
    ],
    tags: ["geography", "capitals", "europe"]
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setQuestion(mockQuestion);
      } catch (error) {
        toast.error("Failed to load question");
        navigate("/admin/questions");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuestion();
    }
  }, [id, navigate]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Question updated successfully!");
      navigate("/admin/questions");
    } catch (error) {
      toast.error("Failed to update question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/questions");
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-full max-w-md" />
        <Skeleton className="h-12 w-full max-w-lg" />
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Question Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The question you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => navigate("/admin/questions")}>
          Back to Questions
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/questions">Questions</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Question #{id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button variant="outline" onClick={() => navigate("/admin/questions")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Questions
        </Button>
      </div>

      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Edit className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Edit Question</h1>
          <p className="text-muted-foreground">
            Update question details and settings
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Question Details</CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionForm
            question={question}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
}