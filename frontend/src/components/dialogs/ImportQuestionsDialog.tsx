import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Upload } from "lucide-react";

interface ImportQuestionsDialogProps {
  trigger: React.ReactNode;
  onImport: (data: any) => void;
}

export default function ImportQuestionsDialog({ trigger, onImport }: ImportQuestionsDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSkill, setSelectedSkill] = useState("");

  const questionTypes = [
    { name: "Multiple Choice Single Answer", code: "MSA" },
    { name: "Multiple Choice Multiple Answers", code: "MMA" },
    { name: "True or False", code: "TOF" },
    { name: "Short Answer", code: "SAQ" },
    { name: "Match the Following", code: "MTF" },
    { name: "Ordering/Sequence", code: "ORD" },
    { name: "Fill in the Blanks", code: "FIB" },
  ];

  const difficultyLevels = [
    { name: "Very Easy", code: "VERY EASY" },
    { name: "Easy", code: "EASY" },
    { name: "Medium", code: "MEDIUM" },
    { name: "High", code: "HIGH" },
    { name: "Very High", code: "VERYHIGH" },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile && selectedSkill) {
      onImport({
        file: selectedFile,
        skill: selectedSkill,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Questions</DialogTitle>
          <DialogDescription>
            Upload questions from Excel or CSV files
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Download Sample Excel */}
          <div className="flex justify-end">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Sample Excel
            </Button>
          </div>

          {/* Choose Skill */}
          <div className="space-y-2">
            <Label htmlFor="skill">Choose Skill <span className="text-destructive">*</span></Label>
            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger>
                <SelectValue placeholder="Search Skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Choose file</Label>
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || !selectedSkill}
                className="bg-gradient-primary hover:bg-primary-hover"
              >
                UPLOAD FILE
              </Button>
            </div>
          </div>

          {/* Question Types */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Question Types</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Acceptable Code</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questionTypes.map((type, index) => (
                    <TableRow key={index}>
                      <TableCell>{type.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{type.code}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Difficulty Levels */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Difficulty Levels</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Acceptable Code</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {difficultyLevels.map((level, index) => (
                    <TableRow key={index}>
                      <TableCell>{level.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{level.code}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}