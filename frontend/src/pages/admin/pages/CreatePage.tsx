import React from "react";
import { useNavigate } from "react-router-dom";
import { PageForm } from "@/components/forms/PageForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function CreatePage() {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    // Here you would typically send the data to your backend
    console.log("Creating page:", data);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Page created successfully!");
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
          <h1 className="text-3xl font-bold tracking-tight">Create New Page</h1>
          <p className="text-muted-foreground">Add a new page to your website</p>
        </div>
      </div>

      {/* Form */}
      <PageForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={false}
      />
    </div>
  );
}