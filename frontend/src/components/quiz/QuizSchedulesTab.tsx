import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MoreHorizontal, Plus, Eye, Edit, Trash, Play, Pause } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const scheduleSchema = z.object({
  code: z.string().min(1, "Code is required"),
  type: z.enum(["flexible", "fixed"]),
  starts_at: z.string().min(1, "Start date is required"),
  ends_at: z.string().min(1, "End date is required"),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface QuizSchedulesTabProps {
  quizData?: any;
  onSave: (data: any) => void;
}

export default function QuizSchedulesTab({ quizData, onSave }: QuizSchedulesTabProps) {
  const [schedules, setSchedules] = useState([
    {
      id: "1",
      code: "qsb_6ENKIQLHKZ1",
      type: "Flexible",
      starts_at: "Sat, Sep 27, 2025 12:00 AM",
      ends_at: "Wed, Nov 26, 2025 12:10 AM",
      status: "Active"
    }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      code: "",
      type: "flexible",
      starts_at: "",
      ends_at: "",
    }
  });

  const handleSubmit = (data: ScheduleFormData) => {
    if (editingSchedule) {
      setSchedules(prev => prev.map(schedule => 
        schedule.id === editingSchedule.id 
          ? { 
              ...schedule, 
              code: data.code,
              type: data.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1) : "Active",
              starts_at: data.starts_at,
              ends_at: data.ends_at,
              status: "Active" 
            }
          : schedule
      ));
    } else {
      const newSchedule = {
        id: Date.now().toString(),
        code: data.code,
        type: data.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1) : "Active",
        starts_at: data.starts_at,
        ends_at: data.ends_at,
        status: "Active"
      };
      setSchedules(prev => [...prev, newSchedule]);
    }
    
    setIsDialogOpen(false);
    setEditingSchedule(null);
    form.reset();
    onSave({ schedules });
  };

  const handleEdit = (schedule: any) => {
    setEditingSchedule(schedule);
    form.reset({
      code: schedule.code,
      type: schedule.type.toLowerCase(),
      starts_at: schedule.starts_at,
      ends_at: schedule.ends_at,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    onSave({ schedules: schedules.filter(schedule => schedule.id !== id) });
  };

  const toggleStatus = (id: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === id 
        ? { ...schedule, status: schedule.status === "Active" ? "Inactive" : "Active" }
        : schedule
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quiz Schedules</CardTitle>
              <CardDescription>
                Manage quiz scheduling and availability periods
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingSchedule(null); form.reset(); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Schedule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingSchedule ? "Edit Schedule" : "Create New Schedule"}
                  </DialogTitle>
                  <DialogDescription>
                    Set up quiz availability period and access settings
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Schedule Code</FormLabel>
                          <FormControl>
                            <Input placeholder="qsb_6ENKIQLHKZ1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Schedule Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select schedule type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="flexible">Flexible</SelectItem>
                              <SelectItem value="fixed">Fixed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="starts_at"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date & Time</FormLabel>
                          <FormControl>
                            <Input 
                              type="datetime-local" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ends_at"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date & Time</FormLabel>
                          <FormControl>
                            <Input 
                              type="datetime-local" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-success hover:bg-success/90 text-white">
                        {editingSchedule ? "Update Schedule" : "Create Schedule"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Schedules Created</h3>
              <p className="text-muted-foreground mb-4">
                Create your first schedule to make this quiz available to students.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Schedule
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Starts At</TableHead>
                  <TableHead>Ends At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">{schedule.code}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{schedule.type}</Badge>
                    </TableCell>
                    <TableCell>{schedule.starts_at}</TableCell>
                    <TableCell>{schedule.ends_at}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(schedule.status)}>
                        {schedule.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {}}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(schedule)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStatus(schedule.id)}>
                            {schedule.status === "Active" ? (
                              <>
                                <Pause className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(schedule.id)}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}