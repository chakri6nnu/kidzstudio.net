import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Table,
  Plus,
} from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function QuestionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");

  const [questionData, setQuestionData] = useState({
    skill: "",
    question: "",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
    settings: {
      skill: "Word usage, sentence construction, punctuation, spelling (Grammar & Vocabulary ← English / Verbal Reasoning)",
      topic: "",
      tags: "",
      difficultyLevel: "Very Easy",
      defaultMarks: 1,
      defaultTime: 60,
      active: true,
    }
  });

  const handleAddOption = () => {
    setQuestionData(prev => ({
      ...prev,
      options: [...prev.options, { text: "", isCorrect: false }]
    }));
  };

  const handleOptionChange = (index: number, text: string) => {
    setQuestionData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, text } : option
      )
    }));
  };

  const handleCorrectAnswerChange = (index: number, isCorrect: boolean) => {
    setQuestionData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, isCorrect } : option
      )
    }));
  };

  const ToolbarButton = ({ icon: Icon, ...props }: any) => (
    <Button variant="ghost" size="sm" {...props}>
      <Icon className="h-4 w-4" />
    </Button>
  );

  const RichTextToolbar = () => (
    <div className="flex items-center space-x-1 p-2 border-b">
      <ToolbarButton icon={Bold} />
      <ToolbarButton icon={Italic} />
      <ToolbarButton icon={Underline} />
      <div className="w-px h-6 bg-border mx-2" />
      <ToolbarButton icon={List} />
      <ToolbarButton icon={ListOrdered} />
      <div className="w-px h-6 bg-border mx-2" />
      <ToolbarButton icon={AlignLeft} />
      <ToolbarButton icon={AlignCenter} />
      <ToolbarButton icon={AlignRight} />
      <div className="w-px h-6 bg-border mx-2" />
      <ToolbarButton icon={Link} />
      <ToolbarButton icon={Image} />
      <ToolbarButton icon={Table} />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/questions">Questions</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Question Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin/questions")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Questions
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Question Details
            </h1>
            <p className="text-muted-foreground mt-1">
              Multiple Choice Single Answer Question
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details" className="flex items-center">
            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
            Details
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
            Settings
          </TabsTrigger>
          <TabsTrigger value="solution" className="flex items-center">
            <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
            Solution
          </TabsTrigger>
          <TabsTrigger value="attachment" className="flex items-center">
            <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">4</span>
            Attachment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="skill">Skill</Label>
                <Select value={questionData.skill} onValueChange={(value) => setQuestionData(prev => ({ ...prev, skill: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <div className="border rounded-md">
                  <RichTextToolbar />
                  <Textarea
                    id="question"
                    placeholder="Enter your question here..."
                    value={questionData.question}
                    onChange={(e) => setQuestionData(prev => ({ ...prev, question: e.target.value }))}
                    className="min-h-32 border-0 resize-none focus-visible:ring-0"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="space-y-4">
                {questionData.options.map((option, index) => (
                  <div key={index} className="space-y-2">
                    <Label>Option {index + 1}</Label>
                    <div className="border rounded-md bg-success/5">
                      <div className="flex items-center space-x-1 p-2 border-b bg-success/10">
                        <ToolbarButton icon={Bold} />
                        <ToolbarButton icon={Italic} />
                        <ToolbarButton icon={Underline} />
                      </div>
                      <Textarea
                        placeholder={`Enter option ${index + 1}...`}
                        value={option.text}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="border-0 resize-none focus-visible:ring-0 bg-transparent"
                      />
                      <div className="p-2 border-t">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`correct-${index}`}
                            checked={option.isCorrect}
                            onCheckedChange={(checked) => handleCorrectAnswerChange(index, checked as boolean)}
                          />
                          <Label htmlFor={`correct-${index}`}>Correct Answer</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={handleAddOption}
                  className="w-full border-dashed border-2 py-8 text-muted-foreground hover:text-primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Option
                </Button>
              </div>

              <div className="flex justify-end">
                <Button className="bg-gradient-primary hover:bg-primary-hover">
                  SAVE DETAILS
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="skillSetting">Skill</Label>
                <div className="p-3 bg-muted rounded-md text-sm">
                  {questionData.settings.skill}
                  <Button variant="ghost" size="sm" className="ml-2 h-6 w-6 p-0">
                    ×
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Select value={questionData.settings.topic} onValueChange={(value) => setQuestionData(prev => ({ ...prev, settings: { ...prev.settings, topic: value }}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="topic1">Topic 1</SelectItem>
                    <SelectItem value="topic2">Topic 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Select value={questionData.settings.tags} onValueChange={(value) => setQuestionData(prev => ({ ...prev, settings: { ...prev.settings, tags: value }}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tag1">Tag 1</SelectItem>
                    <SelectItem value="tag2">Tag 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <div className="p-3 bg-muted rounded-md text-sm flex items-center justify-between">
                  {questionData.settings.difficultyLevel}
                  <Button variant="ghost" size="sm" className="ml-2 h-6 w-6 p-0">
                    ×
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="marks">Default Marks/Grade Points</Label>
                <Input
                  id="marks"
                  type="number"
                  value={questionData.settings.defaultMarks}
                  onChange={(e) => setQuestionData(prev => ({ ...prev, settings: { ...prev.settings, defaultMarks: parseInt(e.target.value) }}))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Default Time To Solve (Seconds)</Label>
                <Input
                  id="time"
                  type="number"
                  value={questionData.settings.defaultTime}
                  onChange={(e) => setQuestionData(prev => ({ ...prev, settings: { ...prev.settings, defaultTime: parseInt(e.target.value) }}))}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="active">Active</Label>
                    <p className="text-sm text-muted-foreground">
                      Active (Shown Everywhere). In-active (Hidden Everywhere).
                    </p>
                  </div>
                  <Switch
                    id="active"
                    checked={questionData.settings.active}
                    onCheckedChange={(checked) => setQuestionData(prev => ({ ...prev, settings: { ...prev.settings, active: checked }}))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-primary text-primary-foreground">
                  Update Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="solution" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Solution tab content will be implemented here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachment" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Attachment tab content will be implemented here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}