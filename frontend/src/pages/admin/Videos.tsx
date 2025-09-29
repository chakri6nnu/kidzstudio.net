import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search, Play, Plus } from "lucide-react";

export default function Videos() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [filters, setFilters] = useState({
    code: "",
    topic: "",
    byTag: "",
    difficulty: {
      veryEasy: false,
      easy: false,
      medium: false,
      high: false,
      veryHigh: false,
    },
  });

  const handleDifficultyChange = (level: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      difficulty: {
        ...prev.difficulty,
        [level]: checked,
      },
    }));
  };

  const handleReset = () => {
    setFilters({
      code: "",
      topic: "",
      byTag: "",
      difficulty: {
        veryEasy: false,
        easy: false,
        medium: false,
        high: false,
        veryHigh: false,
      },
    });
  };

  const handleSearch = () => {
    console.log("Searching with filters:", filters);
  };

  const handleProceed = () => {
    setIsConfigured(true);
  };

  if (!isConfigured) {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Configure Videos
            </h1>
            <p className="text-muted-foreground mt-2">
              Add Videos to Learning
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
              Choose Skill
            </Button>
            <Button variant="outline" disabled>
              <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
              Add/Remove Videos
            </Button>
          </div>
        </div>

        {/* Configuration Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Choose Sub Category & Skill</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subCategory">Sub Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select sub category" />
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
              <Label htmlFor="skill">Skill <span className="text-destructive">*</span></Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleProceed}
                className="bg-gradient-primary hover:bg-primary-hover"
              >
                PROCEED
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Configure Videos
          </h1>
          <p className="text-muted-foreground mt-2">
            Mathematics / Numerical Reasoning Word usage, sentence construction, punctuation, spelling Videos
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
            Choose Skill
          </Button>
          <Button className="bg-primary text-primary-foreground">
            <span className="bg-primary-foreground text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
            Add/Remove Videos
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  placeholder="Code"
                  value={filters.code}
                  onChange={(e) => setFilters(prev => ({ ...prev, code: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="Topic"
                  value={filters.topic}
                  onChange={(e) => setFilters(prev => ({ ...prev, topic: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="byTag">By Tag</Label>
                <Select value={filters.byTag} onValueChange={(value) => setFilters(prev => ({ ...prev, byTag: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Difficulty Level</Label>
                <div className="space-y-2">
                  {[
                    { key: "veryEasy", label: "Very Easy" },
                    { key: "easy", label: "Easy" },
                    { key: "medium", label: "Medium" },
                    { key: "high", label: "High" },
                    { key: "veryHigh", label: "Very High" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={filters.difficulty[key as keyof typeof filters.difficulty]}
                        onCheckedChange={(checked) => handleDifficultyChange(key, checked as boolean)}
                      />
                      <Label htmlFor={key} className="text-sm font-normal">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="destructive"
                  onClick={handleReset}
                  className="flex-1"
                >
                  RESET
                </Button>
                <Button
                  onClick={handleSearch}
                  className="flex-1 bg-gradient-primary hover:bg-primary-hover"
                >
                  SEARCH
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Currently Viewing Videos</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    View Videos
                  </Button>
                  <Button variant="outline" size="sm">
                    Add Videos
                  </Button>
                </div>
              </div>
              <CardDescription>
                0 items found for the selected criteria.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Play className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Videos</h3>
                <p className="text-sm">No videos match your current filter criteria.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}