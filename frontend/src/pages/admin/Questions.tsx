import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import ImportQuestionsDialog from "@/components/dialogs/ImportQuestionsDialog";

export default function Questions() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("all");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Questions
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Upload className="mr-2 h-4 w-4" />
            IMPORT QUESTIONS
          </Button>
          <ImportQuestionsDialog
            onImport={(data) => console.log("Import:", data)}
            trigger={
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import Questions
              </Button>
            }
          />
          <Button 
            className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
            onClick={() => navigate('/admin/questions/create')}
          >
            <Plus className="mr-2 h-4 w-4" />
            NEW QUESTION
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search Code"
                    className="pl-10 w-32"
                  />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search Question"
                    className="pl-10 w-40"
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Search Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Multiple Choice Single Answer">Multiple Choice Single Answer</SelectItem>
                    <SelectItem value="Multiple Choice Multiple Answers">Multiple Choice Multiple Answers</SelectItem>
                    <SelectItem value="True or False">True or False</SelectItem>
                    <SelectItem value="Short Answer">Short Answer</SelectItem>
                    <SelectItem value="Match the Following">Match the Following</SelectItem>
                    <SelectItem value="Ordering/Sequence">Ordering/Sequence</SelectItem>
                    <SelectItem value="Fill in the Blanks">Fill in the Blanks</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search Section"
                    className="pl-10 w-36"
                  />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search Skill"
                    className="pl-10 w-32"
                  />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search Topic"
                    className="pl-10 w-32"
                  />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search Status"
                    className="pl-10 w-32"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CODE</TableHead>
                  <TableHead>QUESTION</TableHead>
                  <TableHead>TYPE</TableHead>
                  <TableHead>SECTION</TableHead>
                  <TableHead>SKILL</TableHead>
                  <TableHead>TOPIC</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    code: "que_SBNJKTMBHCtJ",
                    question: "What is 336 + 14?",
                    type: "Short Answer",
                    section: "Number & Arithmetic ← Mathematics / Numerical Reasoning",
                    skill: "Calculation, place value, operations",
                    topic: "--",
                    status: "Active"
                  },
                  {
                    code: "que_JOBvrYQSmsFl",
                    question: "What is 19 × 13?",
                    type: "Multiple Choice Single Answer",
                    section: "Number & Arithmetic ← Mathematics / Numerical Reasoning",
                    skill: "Calculation, place value, operations",
                    topic: "--",
                    status: "Active"
                  },
                  {
                    code: "que_qZhvxnJegK",
                    question: "Calculate: 8,000 - 4,567",
                    type: "Short Answer",
                    section: "Number & Arithmetic ← Mathematics / Numerical Reasoning",
                    skill: "Calculation, place value, operations",
                    topic: "--",
                    status: "Active"
                  },
                  {
                    code: "que_BlArSRnHrZq",
                    question: "What is 1,234 + 5,678?",
                    type: "Multiple Choice Single Answer",
                    section: "Number & Arithmetic ← Mathematics / Numerical Reasoning",
                    skill: "Calculation, place value, operations",
                    topic: "--",
                    status: "Active"
                  },
                  {
                    code: "que_BnIZqLiTTZF",
                    question: "What is 288 + 12?",
                    type: "Short Answer",
                    section: "Number & Arithmetic ← Mathematics / Numerical Reasoning",
                    skill: "Calculation, place value, operations",
                    topic: "--",
                    status: "Active"
                  },
                  {
                    code: "que_DUlSeldKryPsm",
                    question: "What is 24 × 15?",
                    type: "Multiple Choice Single Answer",
                    section: "Number & Arithmetic ← Mathematics / Numerical Reasoning",
                    skill: "Calculation, place value, operations",
                    topic: "--",
                    status: "Active"
                  },
                  {
                    code: "que_pnCJvNMlnEVn",
                    question: "Calculate: 5,000 - 3,247",
                    type: "Short Answer",
                    section: "Number & Arithmetic ← Mathematics / Numerical Reasoning",
                    skill: "Calculation, place value, operations",
                    topic: "--",
                    status: "Active"
                  },
                  {
                    code: "que_MFCQuKUesuvl",
                    question: "What is 3,456 + 2,789?",
                    type: "Multiple Choice Single Answer",
                    section: "Number & Arithmetic ← Mathematics / Numerical Reasoning",
                    skill: "Calculation, place value, operations",
                    topic: "--",
                    status: "Active"
                  },
                  {
                    code: "que_mWAYTEncAFI",
                    question: "What is 168 + 8?",
                    type: "Short Answer",
                    section: "Number & Arithmetic ← Mathematics / Numerical Reasoning",
                    skill: "Calculation, place value, operations",
                    topic: "--",
                    status: "Active"
                  },
                  {
                    code: "que_356CFWoQLN",
                    question: "What is 17 × 6?",
                    type: "Multiple Choice Single Answer",
                    section: "Number & Arithmetic ← Mathematics / Numerical Reasoning",
                    skill: "Calculation, place value, operations",
                    topic: "--",
                    status: "Active"
                  }
                ].map((question, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell>
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
                        {question.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate">{question.question}</div>
                    </TableCell>
                    <TableCell>{question.type}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm">{question.section}</div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm">{question.skill}</div>
                    </TableCell>
                    <TableCell>{question.topic}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-success text-success-foreground">
                        {question.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/admin/questions/${index + 1}/details`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/questions/${index + 1}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Question
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">ROWS PER PAGE:</span>
              <Select defaultValue="10">
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">PAGE</span>
              <Button variant="outline" size="sm">1</Button>
              <span className="text-sm text-muted-foreground">OF 2</span>
              <Button variant="outline" size="sm">NEXT →</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}