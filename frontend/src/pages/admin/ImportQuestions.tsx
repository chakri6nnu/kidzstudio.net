import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { FiltersPanel } from "@/components/ui/filters-panel";
import { SideDrawer } from "@/components/ui/side-drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Upload,
  FileText,
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Database,
  History,
  Eye,
  Settings,
  RefreshCw
} from "lucide-react";

interface ImportRecord {
  id: string;
  filename: string;
  format: string;
  questionsCount: number;
  status: 'completed' | 'failed' | 'processing';
  imported: string;
  errors: number;
  warnings: number;
  duration: string;
}

export default function ImportQuestions() {
  const [importRecords, setImportRecords] = useState<ImportRecord[]>([
    {
      id: "imp_001",
      filename: "math_questions_batch1.xlsx",
      format: "Excel",
      questionsCount: 250,
      status: "completed",
      imported: "Sep 27, 2025 14:30",
      errors: 0,
      warnings: 3,
      duration: "2m 15s"
    },
    {
      id: "imp_002", 
      filename: "science_questions.csv",
      format: "CSV",
      questionsCount: 180,
      status: "failed",
      imported: "Sep 26, 2025 09:45",
      errors: 12,
      warnings: 0,
      duration: "1m 8s"
    },
    {
      id: "imp_003",
      filename: "history_quiz_set.json",
      format: "JSON",
      questionsCount: 95,
      status: "processing",
      imported: "Sep 27, 2025 16:12",
      errors: 0,
      warnings: 0,
      duration: "Processing..."
    }
  ]);

  const [selectedRecord, setSelectedRecord] = useState<ImportRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleViewDetails = (record: ImportRecord) => {
    setSelectedRecord(record);
    setIsDetailsOpen(true);
  };

  const handleFileUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      case 'processing': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'failed': return XCircle;
      case 'processing': return RefreshCw;
      default: return AlertCircle;
    }
  };

  const filteredRecords = importRecords.filter(record => {
    const matchesSearch = record.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesFormat = formatFilter === "all" || record.format.toLowerCase() === formatFilter;
    
    return matchesSearch && matchesStatus && matchesFormat;
  });

  const columns = [
    {
      key: 'filename' as keyof ImportRecord,
      header: 'File',
      sortable: true,
      render: (record: ImportRecord) => (
        <div className="flex items-center">
          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{record.filename}</div>
            <div className="text-sm text-muted-foreground">{record.format}</div>
          </div>
        </div>
      )
    },
    {
      key: 'questionsCount' as keyof ImportRecord,
      header: 'Questions',
      sortable: true,
      render: (record: ImportRecord) => (
        <div className="flex items-center">
          <Database className="mr-1 h-4 w-4 text-muted-foreground" />
          {record.questionsCount}
        </div>
      )
    },
    {
      key: 'status' as keyof ImportRecord,
      header: 'Status',
      sortable: true,
      render: (record: ImportRecord) => {
        const StatusIcon = getStatusIcon(record.status);
        return (
          <div className="flex items-center">
            <StatusIcon className="mr-2 h-4 w-4" />
            <Badge variant="outline" className={getStatusColor(record.status)}>
              {(record.status || '').charAt(0).toUpperCase() + (record.status || '').slice(1)}
            </Badge>
          </div>
        );
      }
    },
    {
      key: 'errors' as keyof ImportRecord,
      header: 'Issues',
      sortable: true,
      render: (record: ImportRecord) => (
        <div className="space-y-1">
          {record.errors > 0 && (
            <Badge variant="outline" className="bg-destructive text-destructive-foreground text-xs">
              {record.errors} errors
            </Badge>
          )}
          {record.warnings > 0 && (
            <Badge variant="outline" className="bg-warning text-warning-foreground text-xs">
              {record.warnings} warnings
            </Badge>
          )}
          {record.errors === 0 && record.warnings === 0 && (
            <Badge variant="outline" className="bg-success text-success-foreground text-xs">
              No issues
            </Badge>
          )}
        </div>
      )
    },
    {
      key: 'imported' as keyof ImportRecord,
      header: 'Imported',
      sortable: true,
      render: (record: ImportRecord) => (
        <div className="flex items-center text-sm text-muted-foreground">
          <History className="mr-1 h-4 w-4" />
          {record.imported}
        </div>
      )
    },
    {
      key: 'duration' as keyof ImportRecord,
      header: 'Duration',
      sortable: true
    }
  ];

  const actions = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (record: ImportRecord) => handleViewDetails(record),
      variant: "default" as const
    },
    {
      label: "Download Report", 
      icon: <Download className="h-4 w-4" />,
      onClick: (record: ImportRecord) => console.log("Download report for", record.id),
      variant: "default" as const
    }
  ];

  const filters = [
    { 
      key: 'search', 
      type: 'search' as const, 
      label: 'Search',
      placeholder: 'Search imports...', 
      value: searchTerm, 
      onChange: setSearchTerm 
    },
    { 
      key: 'status', 
      type: 'select' as const, 
      label: 'Status',
      placeholder: 'All Status', 
      value: statusFilter, 
      onChange: setStatusFilter,
      options: [
        { label: 'All Status', value: 'all' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
        { label: 'Processing', value: 'processing' }
      ]
    },
    { 
      key: 'format', 
      type: 'select' as const, 
      label: 'Format',
      placeholder: 'All Formats', 
      value: formatFilter, 
      onChange: setFormatFilter,
      options: [
        { label: 'All Formats', value: 'all' },
        { label: 'Excel', value: 'excel' },
        { label: 'CSV', value: 'csv' },
        { label: 'JSON', value: 'json' }
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Import Questions
          </h1>
          <p className="text-muted-foreground mt-2">
            Bulk import questions from various file formats
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
          <Button className="bg-gradient-primary hover:bg-primary-hover">
            <Upload className="mr-2 h-4 w-4" />
            Import Questions
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload & Import</TabsTrigger>
          <TabsTrigger value="history">Import History</TabsTrigger>
          <TabsTrigger value="templates">Templates & Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* Upload Section */}
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5 text-primary" />
                Upload Questions File
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Drag and drop your file here</p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse (Excel, CSV, JSON supported)
                  </p>
                </div>
                <Button className="mt-4" onClick={handleFileUpload}>
                  Choose File
                </Button>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              {/* Import Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Default Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Default Difficulty</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Imports</CardTitle>
                <FileSpreadsheet className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{importRecords.length}</div>
                <p className="text-xs text-muted-foreground">Import sessions</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Questions Imported</CardTitle>
                <Database className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {importRecords.reduce((sum, r) => sum + r.questionsCount, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Total questions</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(importRecords.filter(r => r.status === 'completed').length / importRecords.length * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">Successful imports</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                <History className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1m 34s</div>
                <p className="text-xs text-muted-foreground">Average time</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Filters */}
          <FiltersPanel filters={filters} onClearFilters={() => {
            setSearchTerm("");
            setStatusFilter("all");
            setFormatFilter("all");
          }} />

          {/* Import History Table */}
          <DataTable
            data={filteredRecords}
            columns={columns}
            actions={actions}
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Templates Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileSpreadsheet className="mr-2 h-5 w-5 text-success" />
                  Excel Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Pre-formatted Excel template with all required columns and sample data.
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Excel Template
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  CSV Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Simple CSV format template for basic question imports.
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV Template
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-accent" />
                  JSON Schema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Advanced JSON schema for complex question structures.
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download JSON Schema
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Import Guidelines */}
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle>Import Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">File Requirements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Maximum file size: 10MB</li>
                    <li>Supported formats: Excel (.xlsx), CSV (.csv), JSON (.json)</li>
                    <li>UTF-8 encoding recommended for special characters</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Required Fields:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Question text (required)</li>
                    <li>Correct answer (required)</li>
                    <li>Question type (multiple choice, true/false, etc.)</li>
                    <li>Category and subcategory</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Best Practices:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Validate your data before importing</li>
                    <li>Use consistent formatting across all entries</li>
                    <li>Include explanation text for better learning outcomes</li>
                    <li>Test with a small batch first</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Import Details Drawer */}
      <SideDrawer
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        title="Import Details"
        description="View detailed information about this import session"
      >
        {selectedRecord && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">File Name</Label>
              <p className="text-sm">{selectedRecord.filename}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Format</Label>
              <p className="text-sm">{selectedRecord.format}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Questions Imported</Label>
              <p className="text-sm">{selectedRecord.questionsCount}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
              <Badge variant="outline" className={getStatusColor(selectedRecord.status)}>
                {selectedRecord.status}
              </Badge>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Import Date</Label>
              <p className="text-sm">{selectedRecord.imported}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Duration</Label>
              <p className="text-sm">{selectedRecord.duration}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Issues</Label>
              <div className="space-y-1">
                {selectedRecord.errors > 0 && (
                  <Badge variant="outline" className="bg-destructive text-destructive-foreground text-xs">
                    {selectedRecord.errors} errors
                  </Badge>
                )}
                {selectedRecord.warnings > 0 && (
                  <Badge variant="outline" className="bg-warning text-warning-foreground text-xs">
                    {selectedRecord.warnings} warnings
                  </Badge>
                )}
                {selectedRecord.errors === 0 && selectedRecord.warnings === 0 && (
                  <Badge variant="outline" className="bg-success text-success-foreground text-xs">
                    No issues
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="pt-4">
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>
        )}
      </SideDrawer>
    </div>
  );
}