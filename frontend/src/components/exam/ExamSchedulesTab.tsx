import { useEffect, useState } from "react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  getExamSchedulesApi,
  createExamScheduleApi,
  updateExamScheduleApi,
  deleteExamScheduleApi,
  ExamScheduleDto,
} from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";

interface ScheduleRow {
  id: number;
  code: string;
  type: "Fixed" | "Flexible";
  starts_at: string;
  ends_at: string;
  status: "Active" | "Inactive" | "Expired" | "Cancelled";
}

interface ExamSchedulesTabProps {
  examData?: any;
  onSave: (schedules: ScheduleRow[]) => void;
}

export default function ExamSchedulesTab({
  examData,
  onSave,
}: ExamSchedulesTabProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const examId = Number(id);
  const [schedules, setSchedules] = useState<ScheduleRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<{
    open: boolean;
    scheduleId?: number;
  }>({ open: false });

  const [showNewScheduleDialog, setShowNewScheduleDialog] = useState(false);
  const [showEditScheduleDialog, setShowEditScheduleDialog] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    schedule_type: "Fixed",
    start_date: undefined as Date | undefined,
    start_time: "",
    end_date: undefined as Date | undefined,
    end_time: "",
    grace_period: 5,
    user_groups: "",
  });

  const [searchCode, setSearchCode] = useState("");
  const [searchStatus, setSearchStatus] = useState("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  useEffect(() => {
    if (!examId) return;
    (async () => {
      try {
        setLoading(true);
        const res = await getExamSchedulesApi(examId, {
          status:
            searchStatus && searchStatus !== "all"
              ? searchStatus.toLowerCase()
              : undefined,
          schedule_type:
            filterType && filterType !== "all"
              ? filterType.toLowerCase()
              : undefined,
          date_from: dateFrom || undefined,
          date_to: dateTo || undefined,
          per_page: 50,
        });
        const rows: ScheduleRow[] = res.data.map((s: ExamScheduleDto) => ({
          id: s.id,
          code: s.code,
          type: s.schedule_type === "fixed" ? "Fixed" : "Flexible",
          starts_at: `${s.start_date} ${s.start_time}`,
          ends_at: `${s.end_date ?? ""} ${s.end_time ?? ""}`.trim(),
          status: (s.status.charAt(0).toUpperCase() +
            s.status.slice(1)) as ScheduleRow["status"],
        }));
        setSchedules(rows);
      } catch (e: any) {
        toast.error(e?.message || "Failed to load schedules");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, searchStatus, filterType, dateFrom, dateTo]);

  // Mock user groups
  const userGroups = [
    { id: "1", name: "All Students" },
    { id: "2", name: "Grade 10" },
    { id: "3", name: "Grade 11" },
    { id: "4", name: "Advanced Mathematics" },
  ];

  const handleCreateSchedule = async () => {
    if (!newSchedule.start_date || !newSchedule.start_time) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      const payload: any = {
        schedule_type: newSchedule.schedule_type.toLowerCase(),
        start_date: format(newSchedule.start_date, "yyyy-MM-dd"),
        start_time:
          newSchedule.start_time.length === 5
            ? `${newSchedule.start_time}:00`
            : newSchedule.start_time,
        grace_period: Number(newSchedule.grace_period) || 5,
        status: "active",
      };
      if (newSchedule.schedule_type === "Flexible") {
        if (!newSchedule.end_date || !newSchedule.end_time) {
          toast.error("End date and time are required for Flexible schedule");
          return;
        }
        payload.end_date = format(newSchedule.end_date, "yyyy-MM-dd");
        payload.end_time =
          newSchedule.end_time.length === 5
            ? `${newSchedule.end_time}:00`
            : newSchedule.end_time;
      }
      const res = await createExamScheduleApi(examId, payload);
      toast.success("Schedule created successfully");
      setShowNewScheduleDialog(false);
      // refresh list
      setSearchStatus(searchStatus); // trigger useEffect
    } catch (e: any) {
      toast.error(e?.message || "Failed to create schedule");
    }
  };

  const [editState, setEditState] = useState({
    schedule_type: "Fixed",
    start_date: undefined as Date | undefined,
    start_time: "",
    end_date: undefined as Date | undefined,
    end_time: "",
    grace_period: 5,
    status: "Active" as ScheduleRow["status"],
  });

  const openEdit = (row: ScheduleRow) => {
    setEditState({
      schedule_type: row.type,
      start_date: row.starts_at
        ? new Date(row.starts_at.replace(" ", "T"))
        : undefined,
      start_time: row.starts_at ? row.starts_at.split(" ")[1] || "" : "",
      end_date: row.ends_at
        ? new Date(row.ends_at.replace(" ", "T"))
        : undefined,
      end_time: row.ends_at ? row.ends_at.split(" ")[1] || "" : "",
      grace_period: 5,
      status: row.status,
    });
    setEditing({ open: true, scheduleId: row.id });
    setShowEditScheduleDialog(true);
  };

  const handleUpdateSchedule = async () => {
    if (!editing.scheduleId) return;
    if (!editState.start_date || !editState.start_time) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      const payload: any = {
        schedule_type: editState.schedule_type.toLowerCase(),
        start_date: format(editState.start_date, "yyyy-MM-dd"),
        start_time:
          editState.start_time.length === 5
            ? `${editState.start_time}:00`
            : editState.start_time,
        grace_period: Number(editState.grace_period) || 5,
        status: editState.status.toLowerCase(),
      };
      if (editState.schedule_type === "Flexible") {
        if (!editState.end_date || !editState.end_time) {
          toast.error("End date and time are required for Flexible schedule");
          return;
        }
        payload.end_date = format(editState.end_date, "yyyy-MM-dd");
        payload.end_time =
          editState.end_time.length === 5
            ? `${editState.end_time}:00`
            : editState.end_time;
      }
      await updateExamScheduleApi(examId, editing.scheduleId, payload);
      toast.success("Schedule updated");
      setShowEditScheduleDialog(false);
      setEditing({ open: false });
      setSearchStatus(searchStatus); // refresh
    } catch (e: any) {
      toast.error(e?.message || "Failed to update schedule");
    }
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesCode =
      !searchCode ||
      schedule.code.toLowerCase().includes(searchCode.toLowerCase());
    const matchesStatus =
      searchStatus === "all" ||
      !searchStatus ||
      schedule.status === searchStatus;
    return matchesCode && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Exam Schedules</CardTitle>
            <CardDescription>
              Create and manage exam schedules for different user groups
            </CardDescription>
          </div>
          <Sheet
            open={showNewScheduleDialog}
            onOpenChange={setShowNewScheduleDialog}
          >
            <SheetTrigger asChild>
              <Button className="bg-success hover:bg-success/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                NEW SCHEDULE
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[30%] min-w-[400px]">
              <SheetHeader>
                <SheetTitle>New Schedule</SheetTitle>
                <SheetDescription>Create a new exam schedule</SheetDescription>
              </SheetHeader>

              <div className="space-y-4 py-4">
                {/* Schedule Type */}
                <div className="space-y-3">
                  <Label>Schedule Type</Label>
                  <RadioGroup
                    value={newSchedule.schedule_type}
                    onValueChange={(value) =>
                      setNewSchedule((prev) => ({
                        ...prev,
                        schedule_type: value,
                      }))
                    }
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Fixed" id="fixed" />
                      <Label htmlFor="fixed">Fixed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Flexible" id="flexible" />
                      <Label htmlFor="flexible">Flexible</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Start Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newSchedule.start_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newSchedule.start_date
                            ? format(newSchedule.start_date, "MMM dd, yyyy")
                            : "Select Start Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newSchedule.start_date}
                          onSelect={(date) =>
                            setNewSchedule((prev) => ({
                              ...prev,
                              start_date: date,
                            }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={newSchedule.start_time}
                      onChange={(e) =>
                        setNewSchedule((prev) => ({
                          ...prev,
                          start_time: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Grace Period */}
                <div className="space-y-2">
                  <Label>Grace Period to Join (Minutes)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newSchedule.grace_period}
                    onChange={(e) =>
                      setNewSchedule((prev) => ({
                        ...prev,
                        grace_period: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>

                {/* User Groups */}
                <div className="space-y-2">
                  <Label>Schedule to User Groups</Label>
                  <Select
                    value={newSchedule.user_groups}
                    onValueChange={(value) =>
                      setNewSchedule((prev) => ({
                        ...prev,
                        user_groups: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user groups" />
                    </SelectTrigger>
                    <SelectContent>
                      {userGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Flexible End Date/Time */}
                {newSchedule.schedule_type === "Flexible" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newSchedule.end_date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newSchedule.end_date
                              ? format(newSchedule.end_date, "MMM dd, yyyy")
                              : "Select End Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newSchedule.end_date}
                            onSelect={(date) =>
                              setNewSchedule((prev) => ({
                                ...prev,
                                end_date: date,
                              }))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={newSchedule.end_time}
                        onChange={(e) =>
                          setNewSchedule((prev) => ({
                            ...prev,
                            end_time: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              <SheetFooter className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowNewScheduleDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateSchedule}
                  className="bg-primary hover:bg-primary/90"
                >
                  Create
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search Code"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
            />
          </div>
          <div className="w-40">
            <Select value={searchStatus} onValueChange={setSearchStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-40">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Fixed">Fixed</SelectItem>
                <SelectItem value="Flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-40">
            <Input
              type="date"
              placeholder="From"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="w-40">
            <Input
              type="date"
              placeholder="To"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>

        {/* Schedules Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>CODE</TableHead>
                <TableHead>TYPE</TableHead>
                <TableHead>STARTS AT</TableHead>
                <TableHead>ENDS AT</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="text-center">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <Badge variant="outline" className="text-primary">
                      {schedule.code}
                    </Badge>
                  </TableCell>
                  <TableCell>{schedule.type}</TableCell>
                  <TableCell>{schedule.starts_at}</TableCell>
                  <TableCell>{schedule.ends_at}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        schedule.status === "Active" ? "default" : "secondary"
                      }
                      className={
                        schedule.status === "Active"
                          ? "bg-success text-white"
                          : ""
                      }
                    >
                      {schedule.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="py-1 inline-flex gap-2">
                      <Button
                        className="action-item"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const scheduleCode = schedule.code;
                          navigate(
                            `/admin/exams/${examId}/analytics/overall?schedule=${encodeURIComponent(
                              scheduleCode
                            )}`
                          );
                        }}
                      >
                        Analytics
                      </Button>
                      <Button
                        className="action-item"
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(schedule)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="action-item"
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          try {
                            await deleteExamScheduleApi(examId, schedule.id);
                            toast.success("Schedule deleted");
                            setSchedules((prev) =>
                              prev.filter((s) => s.id !== schedule.id)
                            );
                          } catch (e: any) {
                            toast.error(e?.message || "Failed to delete");
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSchedules.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="mb-2">No schedules found</div>
              <div className="text-sm">
                Create a new schedule to get started
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              ROWS PER PAGE:
            </span>
            <Select defaultValue="10">
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>PAGE</span>
            <Badge variant="outline">1</Badge>
            <span>OF 1</span>
          </div>
        </div>
      </CardContent>
      {/* Edit Schedule Sheet */}
      <Sheet
        open={showEditScheduleDialog}
        onOpenChange={setShowEditScheduleDialog}
      >
        <SheetContent className="w-[30%] min-w-[400px]">
          <SheetHeader>
            <SheetTitle>Edit Schedule</SheetTitle>
            <SheetDescription>Update this exam schedule</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label>Schedule Type</Label>
              <RadioGroup
                value={editState.schedule_type}
                onValueChange={(value) =>
                  setEditState((prev) => ({
                    ...prev,
                    schedule_type: value as any,
                  }))
                }
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Fixed" id="edit-fixed" />
                  <Label htmlFor="edit-fixed">Fixed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Flexible" id="edit-flexible" />
                  <Label htmlFor="edit-flexible">Flexible</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !editState.start_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editState.start_date
                        ? format(editState.start_date, "MMM dd, yyyy")
                        : "Select Start Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editState.start_date}
                      onSelect={(date) =>
                        setEditState((prev) => ({
                          ...prev,
                          start_date: date || undefined,
                        }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={editState.start_time}
                  onChange={(e) =>
                    setEditState((prev) => ({
                      ...prev,
                      start_time: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            {editState.schedule_type === "Flexible" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !editState.end_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editState.end_date
                          ? format(editState.end_date, "MMM dd, yyyy")
                          : "Select End Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editState.end_date}
                        onSelect={(date) =>
                          setEditState((prev) => ({
                            ...prev,
                            end_date: date || undefined,
                          }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={editState.end_time}
                    onChange={(e) =>
                      setEditState((prev) => ({
                        ...prev,
                        end_time: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={editState.status}
                onValueChange={(v) =>
                  setEditState((p) => ({ ...p, status: v as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowEditScheduleDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSchedule}
              className="bg-primary hover:bg-primary/90"
            >
              Save
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Card>
  );
}
