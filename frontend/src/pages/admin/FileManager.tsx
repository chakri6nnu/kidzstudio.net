import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  FolderPlus,
  Search,
  Grid3X3,
  List,
  MoreHorizontal,
  Download,
  Eye,
  Edit,
  Trash2,
  Copy,
  Move,
  RefreshCw,
  File,
  Folder,
  Image,
  FileText,
  Video,
  Music,
  Archive,
  Code,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  ArrowLeft,
  ArrowRight,
  Home,
  Filter,
  SortAsc,
  SortDesc,
  ChevronDown,
  Maximize2,
  Minimize2,
  Share,
  Star,
  Info,
  Settings,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

interface FileItem {
  name: string;
  type: "file" | "folder" | "directory";
  size: number;
  modified: string;
  path: string;
  mime_type?: string;
  url?: string;
}

interface Breadcrumb {
  name: string;
  path: string;
}

interface FileManagerState {
  currentPath: string;
  files: FileItem[];
  breadcrumbs: Breadcrumb[];
  loading: boolean;
  error: string | null;
  viewMode: "grid" | "list";
  searchTerm: string;
  sortBy: "name" | "size" | "modified" | "type";
  sortOrder: "asc" | "desc";
  uploadProgress: number;
  isUploading: boolean;
  isFullscreen: boolean;
  showPreview: boolean;
  previewFile: FileItem | null;
  history: string[];
  historyIndex: number;
}

const FileManager: React.FC = () => {
  const [state, setState] = useState<FileManagerState>({
    currentPath: "/",
    files: [],
    breadcrumbs: [],
    loading: false,
    error: null,
    viewMode: "list", // Default to list view like Laravel Admin
    searchTerm: "",
    sortBy: "name",
    sortOrder: "asc",
    uploadProgress: 0,
    isUploading: false,
    isFullscreen: false,
    showPreview: false,
    previewFile: null,
    history: ["/"],
    historyIndex: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [renameItem, setRenameItem] = useState<{
    name: string;
    path: string;
  } | null>(null);
  const [newName, setNewName] = useState("");
  const [draggedFile, setDraggedFile] = useState<FileItem | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    item: FileItem | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    item: null,
  });

  // Load files when component mounts or path changes
  useEffect(() => {
    loadFiles();
  }, [state.currentPath, state.searchTerm, state.sortBy, state.sortOrder]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu((prev) => ({ ...prev, visible: false }));
    };

    if (contextMenu.visible) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [contextMenu.visible]);

  // Simplified drag and drop handlers - only files to folders
  const handleFileDragStart = (e: React.DragEvent, file: FileItem) => {
    // Only allow dragging files, not folders
    if (!isFolder(file)) {
      setDraggedFile(file);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", JSON.stringify(file));
    }
  };

  const handleFolderDragOver = (e: React.DragEvent, folderPath: string) => {
    e.preventDefault();
    // Only allow drop if we're dragging a file
    if (draggedFile && !isFolder(draggedFile)) {
      e.dataTransfer.dropEffect = "move";
      setDragOverFolder(folderPath);
    }
  };

  const handleFolderDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverFolder(null);
  };

  const handleFolderDrop = (e: React.DragEvent, folderPath: string) => {
    e.preventDefault();
    setDragOverFolder(null);

    if (!draggedFile || isFolder(draggedFile)) {
      return;
    }

    // Don't move file to the same folder it's already in
    if (folderPath === state.currentPath) {
      toast.info("File is already in this folder");
      setDraggedFile(null);
      return;
    }

    // Move the file to the folder
    handleMove([draggedFile.name], folderPath);
    setDraggedFile(null);
  };

  // Context menu handlers
  const handleContextMenu = (e: React.MouseEvent, item: FileItem) => {
    e.preventDefault();
    e.stopPropagation();

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      item: item,
    });
  };

  const handleContextMenuAction = (action: string, item: FileItem) => {
    setContextMenu((prev) => ({ ...prev, visible: false }));

    switch (action) {
      case "preview":
        if (!isFolder(item)) {
          handlePreview(item);
        }
        break;
      case "download":
        if (!isFolder(item)) {
          handleDownload(item.name);
        }
        break;
      case "rename":
        setRenameItem({ name: item.name, path: item.path });
        setNewName(item.name);
        setShowRenameDialog(true);
        break;
      case "delete":
        handleDelete([item.name]);
        break;
      case "copy":
        // For now, copy to current directory
        handleCopy([item.name], state.currentPath);
        break;
      case "move":
        // For now, move to current directory (no-op)
        toast.info("Move functionality - select destination folder");
        break;
    }
  };

  // Helper function to check if item is a folder/directory
  const isFolder = (item: FileItem) => {
    return item.type === "folder" || item.type === "directory";
  };

  // Double-click handler
  const handleDoubleClick = (item: FileItem) => {
    if (isFolder(item)) {
      navigateToPath(item.path);
    } else {
      handlePreview(item);
    }
  };

  const loadFiles = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await api.fileManager.getFiles({
        path: state.currentPath,
        search: state.searchTerm || undefined,
        sort: state.sortBy,
        order: state.sortOrder,
      });

      setState((prev) => ({
        ...prev,
        files: response.items || [],
        breadcrumbs: response.breadcrumbs || [],
        loading: false,
      }));
    } catch (error: any) {
      console.error("Error loading files:", error);
      setState((prev) => ({
        ...prev,
        files: [],
        breadcrumbs: [],
        loading: false,
        error:
          "Failed to load files. Please check your connection and try again.",
      }));
      toast.error(
        "Failed to load files. Please check your connection and try again."
      );
    }
  };

  // Laravel Admin-style navigation functions
  const navigateToPath = useCallback((path: string) => {
    setState((prev) => {
      const newHistory = [
        ...prev.history.slice(0, prev.historyIndex + 1),
        path,
      ];
      return {
        ...prev,
        currentPath: path,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        selectedItems: [],
      };
    });
  }, []);

  const goBack = useCallback(() => {
    if (state.historyIndex > 0) {
      setState((prev) => ({
        ...prev,
        currentPath: prev.history[prev.historyIndex - 1],
        historyIndex: prev.historyIndex - 1,
        selectedItems: [],
      }));
    }
  }, [state.historyIndex, state.history]);

  const goForward = useCallback(() => {
    if (state.historyIndex < state.history.length - 1) {
      setState((prev) => ({
        ...prev,
        currentPath: prev.history[prev.historyIndex + 1],
        historyIndex: prev.historyIndex + 1,
        selectedItems: [],
      }));
    }
  }, [state.historyIndex, state.history]);

  const goHome = useCallback(() => {
    navigateToPath("/");
  }, [navigateToPath]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setState((prev) => ({ ...prev, isUploading: true, uploadProgress: 0 }));

    try {
      const fileArray = Array.from(files);

      // Show upload progress
      for (let i = 0; i <= 90; i += 10) {
        setState((prev) => ({ ...prev, uploadProgress: i }));
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      const response = await api.fileManager.uploadFiles(
        fileArray,
        state.currentPath
      );

      setState((prev) => ({ ...prev, uploadProgress: 100 }));

      if (response.uploaded && response.uploaded.length > 0) {
        toast.success(
          `${response.uploaded.length} file(s) uploaded successfully`
        );
        // Reload files to get the updated list from server
        await loadFiles();
      }

      if (response.errors && response.errors.length > 0) {
        response.errors.forEach((error: any) => {
          toast.error(`Failed to upload ${error.file}: ${error.error}`);
        });
      }
    } catch (error: any) {
      console.error("Upload error:", error);

      // Check if it's an authentication error
      if (
        error?.status === 401 ||
        error?.message?.includes("Unauthenticated")
      ) {
        toast.error("Authentication required. Please login again.");
        return;
      }

      // Check if it's a network error
      if (
        error?.message?.includes("Failed to fetch") ||
        error?.message?.includes("NetworkError")
      ) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
        return;
      }

      // Generic error handling
      toast.error("Failed to upload files. Please try again.");
    } finally {
      setState((prev) => ({ ...prev, isUploading: false, uploadProgress: 0 }));
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await api.fileManager.createFolder(
        newFolderName.trim(),
        state.currentPath
      );
      toast.success("Folder created successfully");
      setNewFolderName("");
      setShowCreateFolder(false);
      loadFiles();
    } catch (error: any) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder");
    }
  };

  const handleRename = async () => {
    if (!renameItem || !newName.trim()) return;

    try {
      await api.fileManager.rename(
        renameItem.name,
        newName.trim(),
        state.currentPath
      );
      toast.success("Item renamed successfully");
      setRenameItem(null);
      setNewName("");
      setShowRenameDialog(false);
      loadFiles();
    } catch (error: any) {
      console.error("Error renaming item:", error);
      toast.error("Failed to rename item");
    }
  };

  const handleDelete = async (items: string[]) => {
    try {
      await api.fileManager.delete(items, state.currentPath);
      toast.success(`${items.length} item(s) deleted successfully`);
      setState((prev) => ({ ...prev, selectedItems: [] }));
      loadFiles();
    } catch (error: any) {
      console.error("Error deleting items:", error);
      toast.error("Failed to delete items");
    }
  };

  const handleMove = async (items: string[], toPath: string) => {
    try {
      await api.fileManager.move(items, toPath, state.currentPath);
      toast.success(`${items.length} item(s) moved successfully`);
      setState((prev) => ({ ...prev, selectedItems: [] }));
      loadFiles();
    } catch (error: any) {
      console.error("Error moving items:", error);
      toast.error("Failed to move items");
    }
  };

  const handleCopy = async (items: string[], toPath: string) => {
    try {
      await api.fileManager.copy(items, toPath, state.currentPath);
      toast.success(`${items.length} item(s) copied successfully`);
      setState((prev) => ({ ...prev, selectedItems: [] }));
      loadFiles();
    } catch (error: any) {
      console.error("Error copying items:", error);
      toast.error("Failed to copy items");
    }
  };

  const handleDownload = async (item: string) => {
    try {
      const response = await api.fileManager.download(item, state.currentPath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = item;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      // Demo mode - create a demo file for download
      toast.info("Demo mode: Creating demo file for download");

      // Find the file in our demo data
      const file = state.files.find((f) => f.name === item);
      if (!file) {
        toast.error("File not found");
        return;
      }

      // Create a demo file content based on file type
      let content = "";
      let mimeType = "text/plain";
      let extension = ".txt";

      if (file.mime_type?.includes("pdf")) {
        content = `Demo PDF Content for ${item}\n\nThis is a demo PDF file created in demo mode.\nFile size: ${formatFileSize(
          file.size
        )}\nModified: ${formatDate(file.modified)}`;
        mimeType = "application/pdf";
        extension = ".pdf";
      } else if (file.mime_type?.includes("image")) {
        content = `Demo Image Content for ${item}\n\nThis is a demo image file created in demo mode.\nFile size: ${formatFileSize(
          file.size
        )}\nModified: ${formatDate(file.modified)}`;
        mimeType = "image/jpeg";
        extension = ".jpg";
      } else if (
        file.mime_type?.includes("excel") ||
        file.mime_type?.includes("spreadsheet")
      ) {
        content = `Demo Excel Content for ${item}\n\nThis is a demo Excel file created in demo mode.\nFile size: ${formatFileSize(
          file.size
        )}\nModified: ${formatDate(file.modified)}`;
        mimeType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        extension = ".xlsx";
      } else if (file.mime_type?.includes("markdown")) {
        content = `# Demo Markdown Content for ${item}\n\nThis is a demo markdown file created in demo mode.\n\n## File Details\n- File size: ${formatFileSize(
          file.size
        )}\n- Modified: ${formatDate(file.modified)}\n- Type: ${
          file.mime_type
        }`;
        mimeType = "text/markdown";
        extension = ".md";
      } else {
        content = `Demo file content for ${item}\n\nThis is a demo file created in demo mode.\nFile size: ${formatFileSize(
          file.size
        )}\nModified: ${formatDate(file.modified)}\nType: ${
          file.mime_type || "Unknown"
        }`;
        mimeType = "text/plain";
        extension = ".txt";
      }

      // Create and download the demo file
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.endsWith(extension) ? item : item + extension;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`File "${item}" downloaded successfully (demo mode)`);
    }
  };

  const handlePreview = async (file: FileItem) => {
    if (isFolder(file)) return;

    try {
      const response = await api.fileManager.preview(
        file.name,
        state.currentPath
      );
      setState((prev) => ({
        ...prev,
        previewFile: {
          ...file,
          url: response.url,
          mime_type: response.mime_type,
        },
        showPreview: true,
      }));
    } catch (error: any) {
      console.error("Error loading preview:", error);
      toast.error("Failed to load file preview");
    }
  };

  const getFileIcon = (file: FileItem, showThumbnail = false) => {
    if (isFolder(file)) return <Folder className="h-5 w-5 text-blue-500" />;

    const mimeType = file.mime_type || "";

    // Show thumbnail for images if available
    if (mimeType.startsWith("image/") && showThumbnail && file.url) {
      return (
        <div className="relative w-8 h-8 rounded overflow-hidden bg-muted">
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to icon if image fails to load
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
          <Image className="h-5 w-5 text-green-500 absolute inset-0 m-auto hidden" />
        </div>
      );
    }

    if (mimeType.startsWith("image/"))
      return <Image className="h-5 w-5 text-green-500" />;
    if (mimeType.startsWith("video/"))
      return <Video className="h-5 w-5 text-purple-500" />;
    if (mimeType.startsWith("audio/"))
      return <Music className="h-5 w-5 text-pink-500" />;
    if (mimeType.includes("pdf") || mimeType.includes("document"))
      return <FileText className="h-5 w-5 text-red-500" />;
    if (mimeType.includes("zip") || mimeType.includes("rar"))
      return <Archive className="h-5 w-5 text-orange-500" />;
    if (mimeType.includes("code") || mimeType.includes("text"))
      return <Code className="h-5 w-5 text-gray-500" />;

    return <File className="h-5 w-5 text-gray-500" />;
  };

  // Function to get thumbnail URL for images
  const getThumbnailUrl = async (file: FileItem): Promise<string | null> => {
    if (file.type !== "file" || !file.mime_type?.startsWith("image/")) {
      return null;
    }

    try {
      const response = await api.fileManager.preview(
        file.name,
        state.currentPath
      );
      return response.url;
    } catch (error) {
      console.error("Error getting thumbnail:", error);
      return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sortedFiles = [...state.files].sort((a, b) => {
    let comparison = 0;

    if (a.type !== b.type) {
      comparison = isFolder(a) ? -1 : 1;
    } else {
      switch (state.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "size":
          comparison = a.size - b.size;
          break;
        case "modified":
          comparison =
            new Date(a.modified).getTime() - new Date(b.modified).getTime();
          break;
        case "type":
          comparison = (a.mime_type || "").localeCompare(b.mime_type || "");
          break;
      }
    }

    return state.sortOrder === "asc" ? comparison : -comparison;
  });

  return (
    <div
      className={`space-y-4 ${
        state.isFullscreen ? "fixed inset-0 z-50 bg-background p-4" : ""
      }`}
    >
      {/* Laravel Admin-style Header */}
      <div className="flex items-center justify-between bg-card border-b px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              disabled={state.historyIndex <= 0}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goForward}
              disabled={state.historyIndex >= state.history.length - 1}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goHome}>
              <Home className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
          </div>

          {/* Breadcrumbs */}
          <div className="flex items-center space-x-1 text-sm">
            {state.breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                <button
                  onClick={() => navigateToPath(crumb.path)}
                  className="text-primary hover:text-primary/80 hover:underline px-1"
                >
                  {crumb.name}
                </button>
                {index < state.breadcrumbs.length - 1 && (
                  <ChevronDown className="h-3 w-3 text-muted-foreground rotate-[-90deg]" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={state.isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateFolder(true)}
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadFiles}
            disabled={state.loading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${state.loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setState((prev) => ({
                ...prev,
                isFullscreen: !prev.isFullscreen,
              }))
            }
          >
            {state.isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("Advanced features coming soon")}
            className="bg-primary/10 text-primary hover:bg-primary/20"
          >
            <Settings className="mr-2 h-4 w-4" />
            Advanced
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* Laravel Admin-style Toolbar */}
      <div className="bg-muted/50 border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search files and folders..."
                value={state.searchTerm}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, searchTerm: e.target.value }))
                }
                className="pl-10 w-64"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() =>
                    setState((prev) => ({ ...prev, sortBy: "name" }))
                  }
                >
                  Sort by Name
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setState((prev) => ({ ...prev, sortBy: "size" }))
                  }
                >
                  Sort by Size
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setState((prev) => ({ ...prev, sortBy: "modified" }))
                  }
                >
                  Sort by Modified
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setState((prev) => ({ ...prev, sortBy: "type" }))
                  }
                >
                  Sort by Type
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    setState((prev) => ({ ...prev, sortOrder: "asc" }))
                  }
                >
                  <SortAsc className="mr-2 h-4 w-4" />
                  Ascending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setState((prev) => ({ ...prev, sortOrder: "desc" }))
                  }
                >
                  <SortDesc className="mr-2 h-4 w-4" />
                  Descending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex border rounded-md">
              <Button
                variant={state.viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() =>
                  setState((prev) => ({ ...prev, viewMode: "list" }))
                }
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={state.viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() =>
                  setState((prev) => ({ ...prev, viewMode: "grid" }))
                }
                className="rounded-l-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {state.files.length} items
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {state.isUploading && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading files...</span>
                <span>{state.uploadProgress}%</span>
              </div>
              <Progress value={state.uploadProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {/* Laravel Admin-style File Display */}
      {state.loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : state.viewMode === "list" ? (
        /* Table View */
        <div className="bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Modified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {sortedFiles.map((file) => (
                  <tr
                    key={file.path}
                    className={`hover:bg-muted/50 cursor-pointer transition-all ${
                      dragOverFolder === file.path && isFolder(file)
                        ? "bg-primary/20 ring-2 ring-primary ring-dashed"
                        : ""
                    } ${
                      draggedFile?.path === file.path
                        ? "opacity-50 scale-95"
                        : ""
                    } ${
                      draggedFile &&
                      isFolder(file) &&
                      file.path !== state.currentPath
                        ? "ring-1 ring-primary/30"
                        : ""
                    }`}
                    draggable={!isFolder(file)}
                    onDragStart={(e) => handleFileDragStart(e, file)}
                    onDragOver={(e) => {
                      if (isFolder(file)) {
                        handleFolderDragOver(e, file.path);
                      }
                    }}
                    onDragLeave={(e) => {
                      if (isFolder(file)) {
                        handleFolderDragLeave(e);
                      }
                    }}
                    onDrop={(e) => {
                      if (isFolder(file)) {
                        handleFolderDrop(e, file.path);
                      }
                    }}
                    onClick={() => {
                      if (isFolder(file)) {
                        navigateToPath(file.path);
                      }
                    }}
                    onDoubleClick={() => handleDoubleClick(file)}
                    onContextMenu={(e) => handleContextMenu(e, file)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative">
                          {getFileIcon(file)}
                          {isFolder(file) &&
                            draggedFile &&
                            file.path !== state.currentPath && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
                            )}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-foreground">
                            {file.name}
                          </div>
                          {isFolder(file) &&
                            draggedFile &&
                            file.path !== state.currentPath && (
                              <div className="text-xs text-primary">
                                Drop file here to move
                              </div>
                            )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {isFolder(file) ? "—" : formatFileSize(file.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(file.modified)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {isFolder(file) ? "Folder" : file.mime_type || "File"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-foreground">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!isFolder(file) && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleDownload(file.name)}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handlePreview(file)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              setRenameItem({
                                name: file.name,
                                path: file.path,
                              });
                              setNewName(file.name);
                              setShowRenameDialog(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete([file.name])}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
          {sortedFiles.map((file) => (
            <Card
              key={file.path}
              className={`cursor-pointer transition-all hover:bg-muted/50 ${
                dragOverFolder === file.path && isFolder(file)
                  ? "bg-primary/20 ring-2 ring-primary ring-dashed"
                  : ""
              } ${
                draggedFile?.path === file.path ? "opacity-50 scale-95" : ""
              } ${
                draggedFile && isFolder(file) && file.path !== state.currentPath
                  ? "ring-1 ring-primary/30"
                  : ""
              }`}
              draggable={!isFolder(file)}
              onDragStart={(e) => handleFileDragStart(e, file)}
              onDragOver={(e) => {
                if (isFolder(file)) {
                  handleFolderDragOver(e, file.path);
                }
              }}
              onDragLeave={(e) => {
                if (isFolder(file)) {
                  handleFolderDragLeave(e);
                }
              }}
              onDrop={(e) => {
                if (isFolder(file)) {
                  handleFolderDrop(e, file.path);
                }
              }}
              onClick={() => {
                if (isFolder(file)) {
                  navigateToPath(file.path);
                }
              }}
              onDoubleClick={() => handleDoubleClick(file)}
              onContextMenu={(e) => handleContextMenu(e, file)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-end mb-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!isFolder(file) && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleDownload(file.name)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePreview(file)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          setRenameItem({ name: file.name, path: file.path });
                          setNewName(file.name);
                          setShowRenameDialog(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete([file.name])}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-3 relative">
                    {getFileIcon(file)}
                    {isFolder(file) &&
                      draggedFile &&
                      file.path !== state.currentPath && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
                      )}
                  </div>
                  <p className="text-sm font-medium truncate mb-1">
                    {file.name}
                  </p>
                  {isFolder(file) &&
                    draggedFile &&
                    file.path !== state.currentPath && (
                      <p className="text-xs text-primary mb-1">
                        Drop file here to move
                      </p>
                    )}
                  <p className="text-xs text-muted-foreground">
                    {isFolder(file) ? "Folder" : formatFileSize(file.size)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(file.modified)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!state.loading && state.files.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Folder className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No files found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {state.searchTerm
                ? "No files match your search criteria."
                : "This folder is empty."}
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateFolder(true)}
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                Create Folder
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      {/* Create Folder Dialog */}
      <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreateFolder()}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateFolder(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
              >
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="New name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleRename()}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowRenameDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleRename} disabled={!newName.trim()}>
                Rename
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* File Preview Modal */}
      <Dialog
        open={state.showPreview}
        onOpenChange={(open) =>
          setState((prev) => ({ ...prev, showPreview: open }))
        }
      >
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {state.previewFile && getFileIcon(state.previewFile)}
              <span>{state.previewFile?.name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {state.previewFile && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground">
                      <strong>Size:</strong>{" "}
                      {formatFileSize(state.previewFile.size)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Modified:</strong>{" "}
                      {formatDate(state.previewFile.modified)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Type:</strong>{" "}
                      {state.previewFile.mime_type || "Unknown"}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        state.previewFile &&
                        handleDownload(state.previewFile.name)
                      }
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  {state.previewFile.url ? (
                    <div className="aspect-video bg-muted/50 flex items-center justify-center">
                      {state.previewFile.mime_type?.startsWith("image/") ? (
                        <img
                          src={state.previewFile.url}
                          alt={state.previewFile.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : state.previewFile.mime_type?.startsWith("video/") ? (
                        <video
                          src={state.previewFile.url}
                          controls
                          className="max-w-full max-h-full"
                        />
                      ) : state.previewFile.mime_type?.startsWith("audio/") ? (
                        <audio
                          src={state.previewFile.url}
                          controls
                          className="w-full"
                        />
                      ) : state.previewFile.mime_type?.includes("pdf") ? (
                        <img
                          src={state.previewFile.url}
                          alt="PDF Preview"
                          className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                        />
                      ) : state.previewFile.mime_type?.includes("text/") ||
                        state.previewFile.mime_type?.includes("markdown") ? (
                        <iframe
                          src={state.previewFile.url}
                          className="w-full h-full border-0 rounded-lg"
                          title={state.previewFile.name}
                        />
                      ) : (
                        <div className="text-center text-muted-foreground p-8">
                          <FileText className="h-16 w-16 mx-auto mb-4 text-primary/50" />
                          <h3 className="text-lg font-semibold mb-2">
                            Preview Not Available
                          </h3>
                          <p className="text-sm mb-4">
                            This file type cannot be previewed in the browser
                          </p>
                          <div className="bg-muted/50 rounded-lg p-4 text-left max-w-md">
                            <p className="text-sm font-medium mb-2">
                              File Details:
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <strong>Name:</strong> {state.previewFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <strong>Size:</strong>{" "}
                              {formatFileSize(state.previewFile.size)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <strong>Type:</strong>{" "}
                              {state.previewFile.mime_type || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <strong>Modified:</strong>{" "}
                              {formatDate(state.previewFile.modified)}
                            </p>
                          </div>
                          <Button
                            onClick={() =>
                              handleDownload(state.previewFile!.name)
                            }
                            className="mt-4"
                            size="sm"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download File
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted/50 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p>Loading preview...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Context Menu */}
      {contextMenu.visible && contextMenu.item && (
        <div
          className="fixed z-50 bg-popover border rounded-md shadow-lg py-1 min-w-[160px]"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          {!isFolder(contextMenu.item) && (
            <>
              <button
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center"
                onClick={() =>
                  handleContextMenuAction("preview", contextMenu.item!)
                }
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </button>
              <button
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center"
                onClick={() =>
                  handleContextMenuAction("download", contextMenu.item!)
                }
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </button>
              <div className="border-t my-1" />
            </>
          )}
          <button
            className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center"
            onClick={() => handleContextMenuAction("rename", contextMenu.item!)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Rename
          </button>
          <button
            className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center"
            onClick={() => handleContextMenuAction("copy", contextMenu.item!)}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </button>
          <button
            className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center"
            onClick={() => handleContextMenuAction("move", contextMenu.item!)}
          >
            <Move className="mr-2 h-4 w-4" />
            Move
          </button>
          <div className="border-t my-1" />
          <button
            className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center text-red-600"
            onClick={() => handleContextMenuAction("delete", contextMenu.item!)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default FileManager;
