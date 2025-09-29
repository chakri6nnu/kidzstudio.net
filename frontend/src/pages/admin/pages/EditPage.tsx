import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageForm } from "@/components/forms/PageForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// Mock data - in real app, this would come from API
const mockPageData = {
  title: "About Us",
  slug: "about-us",
  content: {
    time: Date.now(),
    blocks: [
      {
        id: "1",
        type: "header",
        data: {
          text: "About Our Company",
          level: 1
        }
      },
      {
        id: "2",
        type: "paragraph",
        data: {
          text: "We are a leading company in our industry, dedicated to providing exceptional services and innovative solutions to our clients."
        }
      }
    ],
    version: "2.28.2"
  },
  excerpt: "Learn more about our company, mission, and values.",
  status: "published" as const,
  type: "page" as const,
  featured: false,
  allowComments: true,
  seoTitle: "About Us - Your Company Name",
  seoDescription: "Learn more about our company history, mission, values, and team.",
  tags: "company, about, mission",
  category: "general",
  author: "John Doe",
  template: "default",
};

export default function EditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSubmit = (data: any) => {
    // Here you would typically send the data to your backend
    console.log("Updating page:", { id, ...data });
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Page updated successfully!");
      navigate("/admin/pages");
    }, 1000);
  };

  const handleCancel = () => {
    navigate("/admin/pages");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/pages")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pages
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Page</h1>
          <p className="text-muted-foreground">Update page content and settings</p>
        </div>
      </div>

      {/* Form */}
      <PageForm 
        initialData={mockPageData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={false}
      />
    </div>
  );
}