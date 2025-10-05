import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getExamDetailedAnalyticsApi } from "@/lib/utils";

export default function ExamAnalyticsDetailed() {
  const { id } = useParams();
  const examId = Number(id);
  const [searchParams] = useSearchParams();
  const schedule = searchParams.get("schedule") || undefined;
  const [rows, setRows] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await getExamDetailedAnalyticsApi(examId, {
        schedule,
        per_page: 20,
      });
      setRows(res.data);
      setMeta(res.meta);
    })();
  }, [examId, schedule]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Schedule Detailed Report</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link
              to={`/admin/exams/${examId}/analytics/overall${
                schedule ? `?schedule=${encodeURIComponent(schedule)}` : ""
              }`}
            >
              Overall Report
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>TEST TAKER</TableHead>
                  <TableHead>COMPLETED ON</TableHead>
                  <TableHead>PERCENTAGE</TableHead>
                  <TableHead>SCORE</TableHead>
                  <TableHead>ACCURACY</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-10"
                    >
                      No Records Found
                    </TableCell>
                  </TableRow>
                )}
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.user}</TableCell>
                    <TableCell>{r.completed_on || "-"}</TableCell>
                    <TableCell>{r.percentage ?? "-"}</TableCell>
                    <TableCell>{r.score}</TableCell>
                    <TableCell>{r.accuracy ?? "-"}</TableCell>
                    <TableCell>{r.ip ?? "-"}</TableCell>
                    <TableCell>{r.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
