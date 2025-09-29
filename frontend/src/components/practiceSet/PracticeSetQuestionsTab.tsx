import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, Search } from "lucide-react";

interface PracticeSetQuestionsTabProps {
  practiceSetData?: any;
  onSave: (data: any) => void;
}

export default function PracticeSetQuestionsTab({ practiceSetData, onSave }: PracticeSetQuestionsTabProps) {
  const [filters, setFilters] = useState({
    code: "",
    type: [],
    topic: "",
    byTag: "",
    difficulty: []
  });

  const questionTypes = [
    { id: "mcsa", label: "Multiple Choice Single Answer" },
    { id: "mcma", label: "Multiple Choice Multiple Answers" },
    { id: "tf", label: "True or False" },
    { id: "sa", label: "Short Answer" },
    { id: "mtf", label: "Match the Following" },
    { id: "os", label: "Ordering/Sequence" },
    { id: "fitb", label: "Fill in the Blanks" }
  ];

  const difficultyLevels = [
    { id: "very-easy", label: "Very Easy" },
    { id: "easy", label: "Easy" },
    { id: "medium", label: "Medium" },
    { id: "hard", label: "Hard" },
    { id: "very-hard", label: "Very High" }
  ];

  const handleTypeChange = (typeId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      type: checked 
        ? [...prev.type, typeId]
        : prev.type.filter(id => id !== typeId)
    }));
  };

  const handleDifficultyChange = (difficultyId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      difficulty: checked 
        ? [...prev.difficulty, difficultyId]
        : prev.difficulty.filter(id => id !== difficultyId)
    }));
  };

  const handleReset = () => {
    setFilters({
      code: "",
      type: [],
      topic: "",
      byTag: "",
      difficulty: []
    });
  };

  const handleSearch = () => {
    onSave({ filters, selectedQuestions: [] });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Practice Set Questions</CardTitle>
          <CardDescription>
            Select and filter questions for this practice set
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Panel */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Filter className="h-4 w-4" />
                Filters
              </div>

              {/* Code Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Code</Label>
                <Input
                  placeholder="Code"
                  value={filters.code}
                  onChange={(e) => setFilters(prev => ({ ...prev, code: e.target.value }))}
                />
              </div>

              {/* Question Type Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Type</Label>
                <div className="space-y-2">
                  {questionTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.id}
                        checked={filters.type.includes(type.id)}
                        onCheckedChange={(checked) => handleTypeChange(type.id, checked as boolean)}
                      />
                      <Label htmlFor={type.id} className="text-sm text-primary cursor-pointer">
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topic Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Topic</Label>
                <Input
                  placeholder="Topic"
                  value={filters.topic}
                  onChange={(e) => setFilters(prev => ({ ...prev, topic: e.target.value }))}
                />
              </div>

              {/* By Tag Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">By Tag</Label>
                <Select value={filters.byTag} onValueChange={(value) => setFilters(prev => ({ ...prev, byTag: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty Level Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Difficulty Level</Label>
                <div className="space-y-2">
                  {difficultyLevels.map((level) => (
                    <div key={level.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={level.id}
                        checked={filters.difficulty.includes(level.id)}
                        onCheckedChange={(checked) => handleDifficultyChange(level.id, checked as boolean)}
                      />
                      <Label htmlFor={level.id} className="text-sm cursor-pointer">
                        {level.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  RESET
                </Button>
                <Button 
                  onClick={handleSearch}
                  className="w-full bg-success hover:bg-success/90 text-white"
                >
                  <Search className="h-4 w-4 mr-2" />
                  SEARCH
                </Button>
              </div>
            </div>

            {/* Questions Display Panel */}
            <div className="lg:col-span-3 space-y-4">
              {/* Current Selection Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-800">Currently Viewing Questions</h4>
                  <div className="flex gap-2">
                    <Button variant="link" size="sm" className="text-green-600 p-0 h-auto">
                      View Questions
                    </Button>
                    <span className="text-green-600">|</span>
                    <Button variant="link" size="sm" className="text-green-600 p-0 h-auto">
                      Add Questions
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-green-700">
                  0 items found for the selected criteria.
                </p>
              </div>

              {/* No Questions Message */}
              <div className="text-center py-12">
                <div className="text-muted-foreground text-lg font-medium">No Questions</div>
                <p className="text-sm text-muted-foreground mt-2">
                  No questions match your current filter criteria. Try adjusting your filters or add new questions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}