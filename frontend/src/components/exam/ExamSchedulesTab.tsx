import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Schedule {
  id: string;
  code: string;
  type: "Fixed" | "Flexible";
  starts_at: string;
  ends_at: string;
  status: "Active" | "Inactive";
}

interface ExamSchedulesTabProps {
  examData?: any;
  onSave: (schedules: Schedule[]) => void;
}

export default function ExamSchedulesTab({ examData, onSave }: ExamSchedulesTabProps) {
  const [schedules, setSchedules] = useState<Schedule[]>(examData?.schedules || [
    {
      id: "1",
      code: "esd_6ENKIQLHKZ1",
      type: "Flexible",
      starts_at: "Sat, Sep 27, 2025 12:00 AM",
      ends_at: "Wed, Nov 26, 2025 12:10 AM",
      status: "Active"
    }
  ]);

  const [showNewScheduleDialog, setShowNewScheduleDialog] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    schedule_type: "Fixed",
    start_date: undefined as Date | undefined,
    start_time: "",
    end_date: undefined as Date | undefined,
    end_time: "", 
    grace_period: 5,
    user_groups: ""
  });

  const [searchCode, setSearchCode] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  // Mock user groups
  const userGroups = [
    { id: "1", name: "All Students" },
    { id: "2", name: "Grade 10" },
    { id: "3", name: "Grade 11" },
    { id: "4", name: "Advanced Mathematics" },
  ];

  const handleCreateSchedule = () => {
    if (!newSchedule.start_date || !newSchedule.start_time) {
      toast.error("Please fill in all required fields");
      return;
    }

    const schedule: Schedule = {
      id: Date.now().toString(),
      code: `esd_${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      type: newSchedule.schedule_type as "Fixed" | "Flexible",
      starts_at: `${format(newSchedule.start_date, "EEE, MMM dd, yyyy")} ${newSchedule.start_time}`,
      ends_at: newSchedule.end_date && newSchedule.end_time 
        ? `${format(newSchedule.end_date, "EEE, MMM dd, yyyy")} ${newSchedule.end_time}`
        : `${format(newSchedule.start_date, "EEE, MMM dd, yyyy")} ${newSchedule.start_time}`,
      status: "Active"
    };

    const updatedSchedules = [...schedules, schedule];
    setSchedules(updatedSchedules);
    onSave(updatedSchedules);
    
    // Reset form
    setNewSchedule({
      schedule_type: "Fixed",
      start_date: undefined,
      start_time: "",
      end_date: undefined,
      end_time: "",
      grace_period: 5,
      user_groups: ""
    });
    setShowNewScheduleDialog(false);
    toast.success("Schedule created successfully");
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesCode = !searchCode || schedule.code.toLowerCase().includes(searchCode.toLowerCase());
    const matchesStatus = !searchStatus || schedule.status === searchStatus;
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
          <Sheet open={showNewScheduleDialog} onOpenChange={setShowNewScheduleDialog}>
            <SheetTrigger asChild>
              <Button className="bg-success hover:bg-success/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                NEW SCHEDULE
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[30%] min-w-[400px]">
              <SheetHeader>
                <SheetTitle>New Schedule</SheetTitle>
                <SheetDescription>
                  Create a new exam schedule
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-4 py-4">
                {/* Schedule Type */}
                <div className="space-y-3">
                  <Label>Schedule Type</Label>
                  <RadioGroup 
                    value={newSchedule.schedule_type} 
                    onValueChange={(value) => setNewSchedule(prev => ({ ...prev, schedule_type: value }))}
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
                          {newSchedule.start_date ? format(newSchedule.start_date, "MMM dd, yyyy") : "Select Start Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newSchedule.start_date}
                          onSelect={(date) => setNewSchedule(prev => ({ ...prev, start_date: date }))}
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
                      onChange={(e) => setNewSchedule(prev => ({ ...prev, start_time: e.target.value }))}
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
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, grace_period: parseInt(e.target.value) }))}
                  />
                </div>

                {/* User Groups */}
                <div className="space-y-2">
                  <Label>Schedule to User Groups</Label>
                  <Select 
                    value={newSchedule.user_groups} 
                    onValueChange={(value) => setNewSchedule(prev => ({ ...prev, user_groups: value }))}
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
                            {newSchedule.end_date ? format(newSchedule.end_date, "MMM dd, yyyy") : "Select End Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newSchedule.end_date}
                            onSelect={(date) => setNewSchedule(prev => ({ ...prev, end_date: date }))}
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
                        onChange={(e) => setNewSchedule(prev => ({ ...prev, end_time: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
              </div>

              <SheetFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowNewScheduleDialog(false)}>
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
            <Input
              placeholder="Search Status"
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
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
                      variant={schedule.status === "Active" ? "default" : "secondary"}
                      className={schedule.status === "Active" ? "bg-success text-white" : ""}
                    >
                      {schedule.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="sm">
                      Actions
                      <MoreVertical className="h-4 w-4 ml-2" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSchedules.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="mb-2">No schedules found</div>
              <div className="text-sm">Create a new schedule to get started</div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">ROWS PER PAGE:</span>
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
    </Card>
  );
}