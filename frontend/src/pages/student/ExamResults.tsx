import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Download, 
  CheckCircle2, 
  X, 
  Clock,
  Target,
  TrendingUp,
  Award
} from "lucide-react";

interface ExamResult {
  id: string;
  title: string;
  answered: number;
  total: number;
  percentage: number;
  score: number;
  totalMarks: number;
  status: "PASSED" | "FAILED";
  passPercentage: number;
  timeSpent: string;
  sections: Array<{
    name: string;
    score: number;
    total: number;
    attempted: number;
    accuracy: number;
    timeSpent: string;
  }>;
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    userAnswer?: number;
    timeSpent: number;
    category: string;
    solution: string;
    status: "correct" | "wrong" | "unanswered";
  }>;
  leaderboard: Array<{
    rank: number;
    name: string;
    score: number;
    isCurrentUser?: boolean;
  }>;
}

const mockExamResult: ExamResult = {
  id: "arithmetic-test",
  title: "#1 Addition, subtraction, multiplication, division / Number & Arithmetic",
  answered: 1,
  total: 20,
  percentage: 0,
  score: 0,
  totalMarks: 20,
  status: "FAILED",
  passPercentage: 60,
  timeSpent: "3 Min 48 Sec",
  sections: [
    {
      name: "Main",
      score: 0,
      total: 20,
      attempted: 1,
      accuracy: 0,
      timeSpent: "3 Min 47 Sec"
    }
  ],
  questions: [
    {
      id: 1,
      question: "What is 247 + 186?",
      options: ["433", "423", "443", "423"],
      correctAnswer: 0,
      userAnswer: undefined,
      timeSpent: 131,
      category: "CALCULATION, PLACE VALUE, OPERATIONS",
      solution: "247 + 186 = 433. Add the ones: 7+6=13, write 3 carry 1. Add tens: 4+8+1=13, write 3 carry 1. Add hundreds: 2+1+1=4",
      status: "unanswered"
    },
    // Add more questions...
    ...Array.from({ length: 19 }, (_, i) => ({
      id: i + 2,
      question: `Sample question ${i + 2}`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0,
      userAnswer: undefined,
      timeSpent: 0,
      category: "CALCULATION, PLACE VALUE, OPERATIONS",
      solution: `Solution for question ${i + 2}`,
      status: "unanswered" as const
    }))
  ],
  leaderboard: [
    { rank: 1, name: "Jithin Sriram Chennu", score: 0, isCurrentUser: true }
  ]
};

export default function ExamResults() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [result] = useState<ExamResult>(mockExamResult);
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  const correctAnswers = result.questions.filter(q => q.status === "correct").length;
  const wrongAnswers = result.questions.filter(q => q.status === "wrong").length;
  const unansweredQuestions = result.questions.filter(q => q.status === "unanswered").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/student/progress')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {result.title}
            </Button>
          </div>
          
          <Button className="gap-2 bg-success hover:bg-success/90">
            <Download className="h-4 w-4" />
            DOWNLOAD SCORE REPORT
          </Button>
        </div>
      </header>

      {/* Result Summary */}
      <div className="p-6">
        <Card className={`border-2 mb-6 ${
          result.status === "PASSED" 
            ? "border-success bg-success/5" 
            : "border-destructive bg-destructive/5"
        }`}>
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">
                {result.status === "PASSED" ? "Congratulations!" : "Time's up!"} Thank You for attempting {result.title}
              </h1>
            </div>
            
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Answered</div>
                <div className="text-2xl font-bold">{result.answered}/{result.total}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Percentage</div>
                <div className="text-2xl font-bold">{result.percentage}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Score</div>
                <div className="text-2xl font-bold">{result.score}/{result.totalMarks}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Pass/Fail</div>
                <Badge 
                  className={result.status === "PASSED" ? "bg-success" : "bg-destructive"}
                >
                  {result.status === "PASSED" ? "Passed" : "Failed"}
                </Badge>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Pass Percentage {result.passPercentage}%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis Tabs */}
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="solutions">Solutions</TabsTrigger>
            <TabsTrigger value="leaderboard">Top Scorers</TabsTrigger>
          </TabsList>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="border-border">
                <CardContent className="p-6 text-center">
                  <div className="text-destructive">
                    <div className="text-2xl font-bold">{result.percentage}%</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                    <div className="text-xs text-muted-foreground mt-1">Min. {result.passPercentage}%</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border">
                <CardContent className="p-6 text-center">
                  <div className="text-primary">
                    <div className="text-2xl font-bold">{result.score}</div>
                    <div className="text-sm text-muted-foreground">Score</div>
                    <div className="text-xs text-muted-foreground mt-1">Marks {result.totalMarks}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border">
                <CardContent className="p-6 text-center">
                  <div className="text-success">
                    <div className="text-2xl font-bold">{result.percentage}%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border">
                <CardContent className="p-6 text-center">
                  <div className="text-warning">
                    <div className="text-2xl font-bold">16</div>
                    <div className="text-sm text-muted-foreground">Speed</div>
                    <div className="text-xs text-muted-foreground mt-1">Que/Hour</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-3 gap-6">
              {/* Questions Stats */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-center">Total {result.total} Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="w-full h-full rounded-full border-8 border-muted relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold">{result.answered}/{result.total}</div>
                          <div className="text-xs text-muted-foreground">Answered</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success"></div>
                      <span className="text-sm">{correctAnswers} Correct</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                      <span className="text-sm">{wrongAnswers} Wrong</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-muted"></div>
                      <span className="text-sm">{unansweredQuestions} Unanswered</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Time Stats */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-center">Total 20 Minutes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="w-full h-full rounded-full border-8 border-muted relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold">{result.timeSpent.split(' ')[0]} {result.timeSpent.split(' ')[1]} {result.timeSpent.split(' ')[2]} {result.timeSpent.split(' ')[3]}</div>
                          <div className="text-xs text-muted-foreground">Spent</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success"></div>
                      <span className="text-sm">0 Sec Correct</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                      <span className="text-sm">6 Sec Wrong</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-warning"></div>
                      <span className="text-sm">3 Min 42 Sec Other</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Marks Stats */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-center">Total Scored Marks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Marks Earned</span>
                      <span className="font-bold">{result.score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Negative Marks</span>
                      <span className="font-bold">-0</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-bold">Total Marks</span>
                      <span className="font-bold">{result.score}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sectional Summary */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Sectional Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">#</th>
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Score</th>
                        <th className="text-left p-3">Attempted</th>
                        <th className="text-left p-3">Accuracy</th>
                        <th className="text-left p-3">Time Spent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.sections.map((section, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3">{index + 1}</td>
                          <td className="p-3">{section.name}</td>
                          <td className="p-3">{section.score}/{section.total}</td>
                          <td className="p-3">{section.attempted}/{section.total}</td>
                          <td className="p-3">{section.accuracy}%</td>
                          <td className="p-3">{section.timeSpent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Solutions Tab */}
          <TabsContent value="solutions" className="space-y-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Question Navigation */}
              <div className="col-span-4">
                <Card className="border-border">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        i
                      </div>
                      <span className="font-semibold">Main</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-6 gap-2">
                      {result.questions.map((question, index) => (
                        <button
                          key={question.id}
                          onClick={() => setSelectedQuestion(index)}
                          className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
                            selectedQuestion === index
                              ? 'bg-primary text-primary-foreground'
                              : question.status === "correct"
                              ? 'bg-success text-success-foreground'
                              : question.status === "wrong"
                              ? 'bg-destructive text-destructive-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Question Detail */}
              <div className="col-span-8">
                {result.questions[selectedQuestion] && (
                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <Badge className="bg-info text-info-foreground mb-2">
                          Time Spent: 2 Min 11 Sec
                        </Badge>
                        <Badge variant="outline" className="ml-2">
                          Not Answered
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">
                            Q{selectedQuestion + 1} of {result.total} | {result.questions[selectedQuestion].category}
                          </h3>
                          <p className="text-lg mb-4">{result.questions[selectedQuestion].question}</p>
                        </div>
                        
                        <div className="space-y-2">
                          {result.questions[selectedQuestion].options.map((option, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded border ${
                                index === result.questions[selectedQuestion].correctAnswer
                                  ? 'border-success bg-success/10'
                                  : 'border-border'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{index + 1}</span>
                                <span>{option}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="p-3 bg-success/10 rounded border border-success">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            <span className="text-success font-medium">
                              Correct answer is Option {String.fromCharCode(65 + result.questions[selectedQuestion].correctAnswer)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-warning/10 rounded border border-warning">
                          <h4 className="font-semibold mb-2">SOLUTION</h4>
                          <p className="text-sm">{result.questions[selectedQuestion].solution}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>{result.title} Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">#</th>
                        <th className="text-left p-3">Test Taker</th>
                        <th className="text-left p-3">High Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.leaderboard.map((entry) => (
                        <tr key={entry.rank} className="border-b">
                          <td className="p-3">{entry.rank}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {entry.name}
                              {entry.isCurrentUser && (
                                <Badge className="bg-success text-success-foreground">You</Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-3">{entry.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}