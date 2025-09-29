import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  X,
  FileSpreadsheet,
  Database,
} from "lucide-react";
import { toast } from "sonner";
import { getAuthToken } from "@/lib/utils";

interface ImportDialogProps {
  title: string;
  description: string;
  acceptedFormats: string[];
  onImport: (data: any) => void;
  trigger?: React.ReactNode;
  sampleData?: any[];
  importType?: "users" | "questions" | "default";
}

export default function ImportDialog({
  title,
  description,
  acceptedFormats,
  onImport,
  trigger,
  sampleData,
  importType = "default",
}: ImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [importMethod, setImportMethod] = useState("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [csvData, setCsvData] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedRole, setSelectedRole] = useState("student");
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (importType === "users") {
      await handleUsersImport();
    } else {
      await handleDefaultImport();
    }
  };

  const handleUsersImport = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to import");
      return;
    }

    setImporting(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (selectedGroup) formData.append("group_id", selectedGroup);
      formData.append("role", selectedRole);
      formData.append("send_welcome_email", sendWelcomeEmail.toString());

      const token = getAuthToken();
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"
        }/users/import`,
        {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Import failed");
      }

      const result = await response.json();

      setImporting(false);
      setProgress(100);
      setResults({
        total: result.data.imported_count + result.data.skipped_count,
        successful: result.data.imported_count,
        failed: result.data.skipped_count,
        errors: result.data.errors || [],
      });

      toast.success(
        `Import completed! ${result.data.imported_count} users imported successfully.`
      );

      onImport({
        method: importMethod,
        file: selectedFile,
        results: result.data,
      });
    } catch (error: any) {
      setImporting(false);
      toast.error(error?.message || "Import failed");
    }
  };

  const handleDefaultImport = async () => {
    setImporting(true);
    setProgress(0);

    // Simulate import progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate processing delay
    setTimeout(() => {
      setImporting(false);
      setResults({
        total: 150,
        successful: 142,
        failed: 8,
        errors: [
          "Row 15: Missing required field 'email'",
          "Row 23: Invalid phone number format",
          "Row 45: Duplicate entry found",
        ],
      });

      // Call the actual import function
      onImport({
        method: importMethod,
        file: selectedFile,
        data: csvData,
        results: {
          total: 150,
          successful: 142,
          failed: 8,
        },
      });
    }, 2000);
  };

  const resetDialog = () => {
    setSelectedFile(null);
    setCsvData("");
    setImporting(false);
    setProgress(0);
    setResults(null);
  };

  const closeDialog = () => {
    setOpen(false);
    setTimeout(resetDialog, 300); // Reset after dialog closes
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {!results ? (
          <Tabs
            value={importMethod}
            onValueChange={setImportMethod}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">File Upload</TabsTrigger>
              <TabsTrigger value="paste">Paste Data</TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upload File</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {importType === "users" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="userGroup">User Group</Label>
                        <Select
                          value={selectedGroup}
                          onValueChange={setSelectedGroup}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select group (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No Group</SelectItem>
                            <SelectItem value="1">Default Group</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userRole">Default Role</Label>
                        <Select
                          value={selectedRole}
                          onValueChange={setSelectedRole}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="instructor">
                              Instructor
                            </SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Drop your file here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supported formats: {acceptedFormats.join(", ")}
                      </p>
                      <Input
                        type="file"
                        accept={acceptedFormats.map((f) => `.${f}`).join(",")}
                        onChange={handleFileSelect}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {selectedFile && (
                    <Alert>
                      <FileText className="h-4 w-4" />
                      <AlertDescription className="flex items-center justify-between">
                        <span>Selected: {selectedFile.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}

                  {sampleData && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center justify-between">
                          Sample Format
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download Template
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto">
                          <div className="whitespace-nowrap">
                            {Object.keys(sampleData[0] || {}).join(", ")}
                          </div>
                          {sampleData.slice(0, 2).map((row, index) => (
                            <div
                              key={index}
                              className="whitespace-nowrap text-muted-foreground"
                            >
                              {Object.values(row).join(", ")}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="paste" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Paste CSV Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="csvData">CSV Data</Label>
                    <textarea
                      id="csvData"
                      className="w-full h-40 p-3 border rounded-md font-mono text-sm"
                      placeholder="Paste your CSV data here..."
                      value={csvData}
                      onChange={(e) => setCsvData(e.target.value)}
                    />
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Expected format: header1,header2,header3
                    <br />
                    value1,value2,value3
                    <br />
                    value4,value5,value6
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-success" />
                Import Complete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{results.total}</div>
                  <div className="text-sm text-muted-foreground">
                    Total Records
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {results.successful}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Successful
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">
                    {results.failed}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
              </div>

              {results.errors.length > 0 && (
                <div className="space-y-2">
                  <Label>Import Errors:</Label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {results.errors.map((error: string, index: number) => (
                      <Alert key={index} variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {error}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-success">
                  Success Rate:{" "}
                  {Math.round((results.successful / results.total) * 100)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {importing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Importing data...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>
            {results ? "Close" : "Cancel"}
          </Button>
          {!results && (
            <Button
              onClick={handleImport}
              disabled={(!selectedFile && !csvData.trim()) || importing}
              className="bg-gradient-primary"
            >
              {importing ? "Importing..." : "Start Import"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
