import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SideDrawer } from "@/components/ui/side-drawer";
import { ConfirmDrawer } from "@/components/ui/confirm-drawer";
import { FiltersPanel } from "@/components/ui/filters-panel";
import { DataTable } from "@/components/ui/data-table";
import Editor from "@/components/ui/editor";
import { 
  Plus,
  Play,
  Edit,
  Trash2,
  Eye,
  Clock,
  Download,
  Upload,
  Video,
  FileVideo,
  Users,
  TrendingUp,
  HardDrive,
} from "lucide-react";
import { toast } from "sonner";

interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  tags: string[];
  duration: string;
  size: string;
  format: string;
  quality: string;
  status: "Published" | "Processing" | "Draft" | "Failed";
  views: number;
  thumbnail: string;
  videoUrl: string;
  createdAt: string;
  uploadedBy: string;
  isActive: boolean;
}

export default function VideoBank() {
  const [videos, setVideos] = useState<Video[]>([
    {
      id: "1",
      title: "Introduction to Calculus",
      description: "A comprehensive introduction to basic calculus concepts including limits, derivatives, and integrals.",
      category: "Mathematics",
      subCategory: "Calculus",
      tags: ["calculus", "mathematics", "derivatives", "integrals"],
      duration: "12:45",
      size: "45.2 MB",
      format: "MP4",
      quality: "1080p",
      status: "Published",
      views: 2548,
      thumbnail: "/placeholder.svg",
      videoUrl: "/videos/calculus-intro.mp4",
      createdAt: "2024-01-15",
      uploadedBy: "Dr. Smith",
      isActive: true,
    },
    {
      id: "2",
      title: "Cell Division Process",
      description: "Detailed explanation of mitosis and meiosis in cell biology.",
      category: "Biology",
      subCategory: "Cell Biology",
      tags: ["biology", "cells", "mitosis", "meiosis"],
      duration: "8:32",
      size: "32.1 MB",
      format: "MP4",
      quality: "720p",
      status: "Processing",
      views: 1234,
      thumbnail: "/placeholder.svg",
      videoUrl: "/videos/cell-division.mp4",
      createdAt: "2024-01-14",
      uploadedBy: "Prof. Johnson",
      isActive: true,
    },
    {
      id: "3",
      title: "World War II Timeline",
      description: "Complete timeline of major events during World War II from 1939 to 1945.",
      category: "History",
      subCategory: "Modern History",
      tags: ["history", "world war", "timeline", "events"],
      duration: "18:22",
      size: "67.8 MB",
      format: "MP4",
      quality: "1080p",
      status: "Published",
      views: 987,
      thumbnail: "/placeholder.svg",
      videoUrl: "/videos/ww2-timeline.mp4",
      createdAt: "2024-01-13",
      uploadedBy: "Ms. Davis",
      isActive: true,
    },
    {
      id: "4",
      title: "English Pronunciation Guide",
      description: "Learn proper English pronunciation with phonetic examples and practice exercises.",
      category: "English",
      subCategory: "Speaking",
      tags: ["english", "pronunciation", "speaking", "phonetics"],
      duration: "15:15",
      size: "54.3 MB",
      format: "MP4",
      quality: "1080p",
      status: "Draft",
      views: 0,
      thumbnail: "/placeholder.svg",
      videoUrl: "/videos/english-pronunciation.mp4",
      createdAt: "2024-01-12",
      uploadedBy: "Mr. Wilson",
      isActive: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedQuality, setSelectedQuality] = useState("all");
  
  // Drawer states
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    tags: "",
    quality: "1080p",
    status: "Draft" as Video["status"],
    isActive: true,
    videoFile: null as File | null,
    thumbnailFile: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter and search logic
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || video.status === selectedStatus;
    const matchesQuality = selectedQuality === "all" || video.quality === selectedQuality;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesQuality;
  });

  // Filter options
  const filters = [
    {
      key: "category",
      type: "select" as const,
      label: "Category",
      value: selectedCategory,
      onChange: (value: string) => setSelectedCategory(value),
      options: [
        { value: "all", label: "All Categories" },
        { value: "Mathematics", label: "Mathematics" },
        { value: "Biology", label: "Biology" },
        { value: "History", label: "History" },
        { value: "English", label: "English" },
        { value: "Physics", label: "Physics" },
        { value: "Chemistry", label: "Chemistry" }
      ]
    },
    {
      key: "status",
      type: "select" as const,
      label: "Status",
      value: selectedStatus,
      onChange: (value: string) => setSelectedStatus(value),
      options: [
        { value: "all", label: "All Status" },
        { value: "Published", label: "Published" },
        { value: "Processing", label: "Processing" },  
        { value: "Draft", label: "Draft" },
        { value: "Failed", label: "Failed" }
      ]
    },
    {
      key: "quality",
      type: "select" as const,
      label: "Quality",
      value: selectedQuality,
      onChange: (value: string) => setSelectedQuality(value),
      options: [
        { value: "all", label: "All Quality" },
        { value: "1080p", label: "1080p HD" },
        { value: "720p", label: "720p HD" },
        { value: "480p", label: "480p SD" }
      ]
    }
  ];

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-success text-success-foreground";
      case "Processing":
        return "bg-warning text-warning-foreground";
      case "Draft":
        return "bg-secondary text-secondary-foreground";
      case "Failed":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "1080p":
        return "bg-primary/10 text-primary";
      case "720p":
        return "bg-success/10 text-success";
      case "480p":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // CRUD operations
  const handleFilterChange = (filterId: string, value: string) => {
    const filter = filters.find(f => f.key === filterId);
    if (filter) {
      filter.onChange(value);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSelectedQuality("all");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      subCategory: "",
      tags: "",
      quality: "1080p",
      status: "Draft",
      isActive: true,
      videoFile: null,
      thumbnailFile: null,
    });
  };

  const handleAdd = () => {
    resetForm();
    setSelectedVideo(null);
    setIsAddDrawerOpen(true);
  };

  const handleEdit = (video: Video) => {
    setSelectedVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      category: video.category,
      subCategory: video.subCategory,
      tags: video.tags.join(", "),
      quality: video.quality,
      status: video.status,
      isActive: video.isActive,
      videoFile: null,
      thumbnailFile: null,
    });
    setIsEditDrawerOpen(true);
  };

  const handleDelete = (video: Video) => {
    setSelectedVideo(video);
    setIsDeleteDrawerOpen(true);
  };

  const handleAddSubmit = async () => {
    if (!formData.title || !formData.category || !formData.videoFile) {
      toast.error("Please fill in all required fields and select a video file");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newVideo: Video = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subCategory: formData.subCategory,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        duration: "0:00", // Would be determined after upload
        size: "0 MB", // Would be determined after upload
        format: "MP4",
        quality: formData.quality,
        status: formData.status,
        views: 0,
        thumbnail: "/placeholder.svg",
        videoUrl: `/videos/${formData.title.toLowerCase().replace(/\s+/g, '-')}.mp4`,
        createdAt: new Date().toISOString().split('T')[0],
        uploadedBy: "Current User",
        isActive: formData.isActive,
      };

      setVideos(prev => [newVideo, ...prev]);
      setIsAddDrawerOpen(false);
      resetForm();
      toast.success("Video uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload video");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedVideo || !formData.title || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setVideos(prev => prev.map(video => 
        video.id === selectedVideo.id 
          ? {
              ...video,
              title: formData.title,
              description: formData.description,
              category: formData.category,
              subCategory: formData.subCategory,
              tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
              quality: formData.quality,
              status: formData.status,
              isActive: formData.isActive,
            }
          : video
      ));

      setIsEditDrawerOpen(false);
      setSelectedVideo(null);
      resetForm();
      toast.success("Video updated successfully!");
    } catch (error) {
      toast.error("Failed to update video");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVideo) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setVideos(prev => prev.filter(video => video.id !== selectedVideo.id));
      setIsDeleteDrawerOpen(false);
      setSelectedVideo(null);
      toast.success("Video deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete video");
    }
  };

  // Table columns
  const columns = [
    {
      key: "title" as keyof Video,
      header: "Video",
      sortable: true,
      render: (video: Video) => (
        <div className="flex items-center space-x-3">
          <div className="w-16 h-10 bg-muted rounded overflow-hidden">
            <img 
              src={video.thumbnail} 
              alt={video.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-semibold">{video.title}</div>
            <div className="text-sm text-muted-foreground">
              {video.category} • {video.subCategory}
            </div>
          </div>
        </div>
      )
    },
    {
      key: "duration" as keyof Video,
      header: "Duration",
      render: (video: Video) => (
        <div className="flex items-center">
          <Clock className="mr-1 h-3 w-3" />
          {video.duration}
        </div>
      )
    },
    {
      key: "quality" as keyof Video,
      header: "Quality",
      render: (video: Video) => (
        <Badge variant="outline" className={getQualityColor(video.quality)}>
          {video.quality}
        </Badge>
      )
    },
    {
      key: "size" as keyof Video,
      header: "Size",
      render: (video: Video) => video.size
    },
    {
      key: "views" as keyof Video,
      header: "Views",
      sortable: true,
      render: (video: Video) => (
        <div className="flex items-center">
          <Eye className="mr-1 h-3 w-3" />
          {(video.views || 0).toLocaleString()}
        </div>
      )
    },
    {
      key: "status" as keyof Video,
      header: "Status",
      render: (video: Video) => (
        <Badge variant="secondary" className={getStatusColor(video.status)}>
          {video.status}
        </Badge>
      )
    },
    {
      key: "createdAt" as keyof Video,
      header: "Created",
      sortable: true,
      render: (video: Video) => video.createdAt
    }
  ];

  // Table actions
  const actions = [
    {
      label: "Play",
      icon: <Play className="h-4 w-4" />,
      onClick: (video: Video) => {
        window.open(video.videoUrl, '_blank');
      }
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit
    },
    {
      label: "Download",
      icon: <Download className="h-4 w-4" />,
      onClick: (video: Video) => {
        // Simulate download
        toast.success("Download started");
      }
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: "destructive" as const
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Video Bank
          </h1>
          <p className="text-muted-foreground mt-2">
            Repository of educational videos and multimedia content
          </p>
        </div>
        <Button 
          onClick={handleAdd}
          className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Upload Video
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{videos.length}</div>
            <p className="text-xs text-success">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Play className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {videos.filter(v => v.status === "Published").length}
            </div>
            <p className="text-xs text-success">Ready for viewing</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {videos.reduce((sum, v) => sum + (v.views || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-success">+18% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 GB</div>
            <p className="text-xs text-muted-foreground">Of 10 GB available</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <FiltersPanel
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onExport={() => toast.success("Export started")}
            searchPlaceholder="Search videos, categories, descriptions..."
          />
        </CardHeader>

        <CardContent>
          <DataTable
            data={filteredVideos}
            columns={columns}
            actions={actions}
            emptyMessage="No videos found"
            onAdd={handleAdd}
          />
        </CardContent>
      </Card>

      {/* Add Video Drawer */}
      <SideDrawer
        open={isAddDrawerOpen}
        onOpenChange={setIsAddDrawerOpen}
        title="Upload New Video"
        description="Upload and configure a new educational video"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Video Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter video title"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <div className="mt-1">
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter video description..."
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-sm font-medium">
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subCategory" className="text-sm font-medium">
                  Sub Category
                </Label>
                <Input
                  id="subCategory"
                  value={formData.subCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
                  placeholder="Enter sub category"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tags" className="text-sm font-medium">
                Tags
              </Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Enter tags separated by commas"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quality" className="text-sm font-medium">
                  Quality
                </Label>
                <Select
                  value={formData.quality}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, quality: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1080p">1080p HD</SelectItem>
                    <SelectItem value="720p">720p HD</SelectItem>
                    <SelectItem value="480p">480p SD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Video["status"] }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="videoFile" className="text-sm font-medium">
                Video File *
              </Label>
              <Input
                id="videoFile"
                type="file"
                accept="video/*"
                onChange={(e) => setFormData(prev => ({ ...prev, videoFile: e.target.files?.[0] || null }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="thumbnailFile" className="text-sm font-medium">
                Thumbnail Image
              </Label>
              <Input
                id="thumbnailFile"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData(prev => ({ ...prev, thumbnailFile: e.target.files?.[0] || null }))}
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-base">Active</Label>
                <div className="text-sm text-muted-foreground">
                  Video will be available for use in courses and lessons
                </div>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsAddDrawerOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddSubmit} 
              disabled={isSubmitting}
              className="bg-gradient-primary hover:bg-primary-hover"
            >
              {isSubmitting ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Video
                </>
              )}
            </Button>
          </div>
        </div>
      </SideDrawer>

      {/* Edit Video Drawer */}
      <SideDrawer
        open={isEditDrawerOpen}
        onOpenChange={setIsEditDrawerOpen}
        title="Edit Video"
        description="Update video information and settings"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title" className="text-sm font-medium">
                Video Title *
              </Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter video title"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edit-description" className="text-sm font-medium">
                Description
              </Label>
              <div className="mt-1">
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter video description..."
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category" className="text-sm font-medium">
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-subCategory" className="text-sm font-medium">
                  Sub Category
                </Label>
                <Input
                  id="edit-subCategory"
                  value={formData.subCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
                  placeholder="Enter sub category"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-tags" className="text-sm font-medium">
                Tags
              </Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Enter tags separated by commas"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-quality" className="text-sm font-medium">
                  Quality
                </Label>
                <Select
                  value={formData.quality}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, quality: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1080p">1080p HD</SelectItem>
                    <SelectItem value="720p">720p HD</SelectItem>
                    <SelectItem value="480p">480p SD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-status" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Video["status"] }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-base">Active</Label>
                <div className="text-sm text-muted-foreground">
                  Video will be available for use in courses and lessons
                </div>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsEditDrawerOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditSubmit} 
              disabled={isSubmitting}
              className="bg-gradient-primary hover:bg-primary-hover"
            >
              {isSubmitting ? "Updating..." : "Update Video"}
            </Button>
          </div>
        </div>
      </SideDrawer>

      {/* Delete Confirmation Drawer */}
      <ConfirmDrawer
        open={isDeleteDrawerOpen}
        onOpenChange={setIsDeleteDrawerOpen}
        title="Delete Video"
        description={`Are you sure you want to delete "${selectedVideo?.title}"? This action cannot be undone and will permanently remove the video file and all associated data.`}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete Video"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}