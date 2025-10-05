import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getExamOverallAnalyticsApi } from "@/lib/utils";

export default function ExamAnalyticsOverall() {
  const { id } = useParams();
  const examId = Number(id);
  const [searchParams] = useSearchParams();
  const schedule = searchParams.get("schedule") || undefined;
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      const res = await getExamOverallAnalyticsApi(examId, { schedule });
      setData(res.data);
    })();
  }, [examId, schedule]);

  if (!data) return null;

  const tiles = [
    { label: "Total Attempts", value: data.total_attempts },
    { label: "Pass Attempts", value: data.pass_count },
    { label: "Fail Attempts", value: data.failed_count },
    { label: "Unique Test Takers", value: data.unique_test_takers },
    { label: "Avg. Time Spent", value: `${data.avg_time} Sec` },
    { label: "Avg. Score", value: data.avg_score },
    { label: "High Score", value: data.high_score },
    { label: "Low Score", value: data.low_score },
    { label: "Avg. Percentage", value: `${data.avg_percentage}%` },
    { label: "Avg. Accuracy", value: `${data.avg_accuracy}%` },
    { label: "Avg. Speed", value: `${data.avg_speed} que/hr` },
    {
      label: "Avg. Questions Answered",
      value: `${data.avg_questions_answered}%`,
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Schedule Overall Report</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link
              to={`/admin/exams/${examId}/analytics/detailed${
                schedule ? `?schedule=${encodeURIComponent(schedule)}` : ""
              }`}
            >
              Detailed Report
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            Schedule ID:{" "}
            {schedule ? <Badge variant="outline">{schedule}</Badge> : "All"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {tiles.map((t) => (
              <div key={t.label} className="border rounded-lg p-6 text-center">
                <div className="text-sm text-muted-foreground mb-2">
                  {t.label}
                </div>
                <div className="text-2xl font-semibold">{t.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
