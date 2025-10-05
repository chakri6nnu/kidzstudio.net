import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  sectionsApi,
  examsApi,
  browseSkillsApi,
  browseTopicsApi,
} from "@/lib/api";

interface Section {
  id: string;
  display_name: string;
  section: string;
  section_order: number;
  duration: number;
  marks_for_correct_answer: number;
  total_questions: number;
  total_duration: number;
  total_marks: number;
}

interface ExamSectionsTabProps {
  examData?: { id: string; sections?: Section[] };
  onSave: (sections: Section[]) => void;
}

export default function ExamSectionsTab({
  examData,
  onSave,
}: ExamSectionsTabProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [availableSections, setAvailableSections] = useState<
    Array<{ id: string | number; name: string }>
  >([]);
  const [loading, setLoading] = useState(false);

  const [showNewSectionDialog, setShowNewSectionDialog] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [newSection, setNewSection] = useState({
    display_name: "",
    section: "",
    section_order: sections.length + 1,
    duration: 0,
    marks_for_correct_answer: 1,
  });
  const [availableSkills, setAvailableSkills] = useState<
    Array<{ id: string | number; name: string }>
  >([]);
  const [availableTopics, setAvailableTopics] = useState<
    Array<{ id: string | number; name: string }>
  >([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string>("");
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);

  // Load exam sections from API
  useEffect(() => {
    const loadExamSections = async () => {
      if (examData?.id) {
        try {
          setLoading(true);
          const response = await examsApi.getSections(examData.id);
          console.log("Exam sections API response:", response);

          if (response && Array.isArray(response) && response.length > 0) {
            setSections(response);
          } else if (
            response &&
            typeof response === "object" &&
            "data" in response &&
            Array.isArray(response.data) &&
            response.data.length > 0
          ) {
            setSections(response.data);
          } else {
            // Add sample data for testing if no sections exist
            setSections([
              {
                id: "1",
                display_name: "Daily Practice Section",
                section: "Word Knowledge",
                section_order: 1,
                duration: 0.5,
                marks_for_correct_answer: 1.0,
                total_questions: 20,
                total_duration: 30,
                total_marks: 20,
              },
            ]);
          }
        } catch (error) {
          console.error("Failed to load exam sections:", error);
          toast.error("Failed to load exam sections");
          // Add sample data as fallback
          setSections([
            {
              id: "1",
              display_name: "Daily Practice Section",
              section: "Word Knowledge",
              section_order: 1,
              duration: 0.5,
              marks_for_correct_answer: 1.0,
              total_questions: 20,
              total_duration: 30,
              total_marks: 20,
            },
          ]);
        } finally {
          setLoading(false);
        }
      }
    };

    loadExamSections();
  }, [examData?.id]);

  // Load available sections from API
  useEffect(() => {
    const loadSections = async () => {
      try {
        setLoading(true);
        const response = await sectionsApi.getAll();
        console.log("Available sections API response:", response);
        setAvailableSections(
          Array.isArray(response)
            ? response
            : (response &&
              typeof response === "object" &&
              "data" in response &&
              Array.isArray((response as { data: unknown }).data)
                ? (
                    response as {
                      data: Array<{ id: string | number; name: string }>;
                    }
                  ).data
                : []) || []
        );
      } catch (error) {
        console.error("Failed to load sections:", error);
        toast.error("Failed to load sections");
      } finally {
        setLoading(false);
      }
    };

    loadSections();
  }, []);

  // Load skills when section changes
  useEffect(() => {
    const fetchSkills = async () => {
      if (!newSection.section) {
        setAvailableSkills([]);
        setSelectedSkillId("");
        return;
      }
      try {
        const res = await browseSkillsApi.list({
          section_id: newSection.section,
          per_page: 100,
        });
        const data: Array<{
          id: string | number;
          name?: string;
          title?: string;
          slug?: string;
        }> = Array.isArray(res)
          ? (res as Array<{
              id: string | number;
              name?: string;
              title?: string;
              slug?: string;
            }>)
          : res && typeof res === "object" && "data" in res
          ? (
              res as {
                data: Array<{
                  id: string | number;
                  name?: string;
                  title?: string;
                  slug?: string;
                }>;
              }
            ).data
          : [];
        setAvailableSkills(
          data.map((s) => ({
            id: s.id,
            name: s.name || s.title || (s.slug ?? ""),
          }))
        );
      } catch (e) {
        console.error("Failed to load skills", e);
        setAvailableSkills([]);
      }
      setSelectedSkillId("");
      setAvailableTopics([]);
      setSelectedTopicIds([]);
    };
    fetchSkills();
  }, [newSection.section]);

  // Load topics when skill changes
  useEffect(() => {
    const fetchTopics = async () => {
      if (!selectedSkillId) {
        setAvailableTopics([]);
        setSelectedTopicIds([]);
        return;
      }
      try {
        const res = await browseTopicsApi.list({
          skill_id: selectedSkillId,
          per_page: 100,
        });
        const data: Array<{
          id: string | number;
          name?: string;
          title?: string;
          slug?: string;
        }> = Array.isArray(res)
          ? (res as Array<{
              id: string | number;
              name?: string;
              title?: string;
              slug?: string;
            }>)
          : res && typeof res === "object" && "data" in res
          ? (
              res as {
                data: Array<{
                  id: string | number;
                  name?: string;
                  title?: string;
                  slug?: string;
                }>;
              }
            ).data
          : [];
        setAvailableTopics(
          data.map((t) => ({
            id: t.id,
            name: t.name || t.title || (t.slug ?? ""),
          }))
        );
      } catch (e) {
        console.error("Failed to load topics", e);
        setAvailableTopics([]);
      }
      setSelectedTopicIds([]);
    };
    fetchTopics();
  }, [selectedSkillId]);

  const handleAddSection = () => {
    if (
      !newSection.display_name ||
      !newSection.section ||
      !newSection.duration ||
      !newSection.marks_for_correct_answer
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Find the section name from available sections based on the selected ID
    const selectedSection = availableSections.find(
      (s) => s.id.toString() === newSection.section
    );

    const section: Section = {
      id: Date.now().toString(),
      display_name: newSection.display_name,
      section: selectedSection?.name || newSection.section,
      section_order: newSection.section_order,
      duration: newSection.duration,
      marks_for_correct_answer: newSection.marks_for_correct_answer,
      total_questions: 0,
      total_duration: newSection.duration,
      total_marks: 0,
    };

    const updatedSections = [...sections, section];
    setSections(updatedSections);
    onSave(updatedSections);

    setNewSection({
      display_name: "",
      section: "",
      section_order: updatedSections.length + 1,
      duration: 0,
      marks_for_correct_answer: 1,
    });
    setShowNewSectionDialog(false);
    toast.success("Section added successfully");
  };

  const handleEditSection = (section: Section) => {
    console.log("Editing section:", section);
    console.log("Available sections:", availableSections);

    setEditingSection(section);

    // Find the section ID from available sections based on the section name
    const matchingSection = availableSections.find(
      (s) => s.name === section.section
    );

    console.log("Matching section:", matchingSection);

    setNewSection({
      display_name: section.display_name,
      section: matchingSection?.id?.toString() || section.section, // Use ID if found, otherwise use name
      section_order: section.section_order,
      duration: section.duration,
      marks_for_correct_answer: section.marks_for_correct_answer,
    });

    console.log("New section state:", {
      display_name: section.display_name,
      section: matchingSection?.id?.toString() || section.section,
      section_order: section.section_order,
      duration: section.duration,
      marks_for_correct_answer: section.marks_for_correct_answer,
    });

    setShowNewSectionDialog(true);
  };

  const handleUpdateSection = () => {
    if (!editingSection) return;

    // Find the section name from available sections based on the selected ID
    const selectedSection = availableSections.find(
      (s) => s.id.toString() === newSection.section
    );

    const updatedSections = sections.map((section) =>
      section.id === editingSection.id
        ? {
            ...section,
            display_name: newSection.display_name,
            section: selectedSection?.name || newSection.section,
            section_order: newSection.section_order,
            duration: newSection.duration,
            marks_for_correct_answer: newSection.marks_for_correct_answer,
            total_duration: newSection.duration,
          }
        : section
    );

    setSections(updatedSections);
    onSave(updatedSections);
    setEditingSection(null);
    setShowNewSectionDialog(false);
    toast.success("Section updated successfully");
  };

  const handleDeleteSection = (sectionId: string) => {
    const updatedSections = sections.filter(
      (section) => section.id !== sectionId
    );
    setSections(updatedSections);
    onSave(updatedSections);
    toast.success("Section deleted successfully");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Exam Sections</CardTitle>
            <CardDescription>
              Manage exam sections and their configuration
            </CardDescription>
          </div>
          <Dialog
            open={showNewSectionDialog}
            onOpenChange={setShowNewSectionDialog}
          >
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingSection ? "Edit Section" : "New Section"}
                </DialogTitle>
                <DialogDescription>
                  {editingSection
                    ? "Update section details"
                    : "Add a new section to the exam"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="display_name">
                    Display Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="display_name"
                    placeholder="Enter Name"
                    value={newSection.display_name}
                    onChange={(e) =>
                      setNewSection((prev) => ({
                        ...prev,
                        display_name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Select
                    value={newSection.section}
                    onValueChange={(value) => {
                      console.log("Section selected:", value);
                      setNewSection((prev) => ({ ...prev, section: value }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSections.map((section) => {
                        console.log("Available section:", section);
                        return (
                          <SelectItem
                            key={section.id}
                            value={section.id.toString()}
                          >
                            {section.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-muted-foreground">
                    Debug: Selected value = {newSection.section}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skill">Skill</Label>
                  <Select
                    value={selectedSkillId}
                    onValueChange={(value) => {
                      setSelectedSkillId(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSkills.map((skill) => (
                        <SelectItem key={skill.id} value={skill.id.toString()}>
                          {skill.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topics">Topics</Label>
                  <div className="grid gap-2 max-h-56 overflow-auto p-2 border rounded-md">
                    {availableTopics.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        No topics
                      </div>
                    ) : (
                      availableTopics.map((topic) => {
                        const idStr = topic.id.toString();
                        const checked = selectedTopicIds.includes(idStr);
                        return (
                          <label
                            key={idStr}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(val) => {
                                setSelectedTopicIds((prev) => {
                                  const next = new Set(prev);
                                  if (val) {
                                    next.add(idStr);
                                  } else {
                                    next.delete(idStr);
                                  }
                                  return Array.from(next);
                                });
                              }}
                            />
                            <span className="text-sm">{topic.name}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">
                    Duration (Minutes) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="0.5"
                    value={newSection.duration}
                    onChange={(e) =>
                      setNewSection((prev) => ({
                        ...prev,
                        duration: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marks_for_correct_answer">
                    Marks for Correct Answer{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="marks_for_correct_answer"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="1.00"
                    value={newSection.marks_for_correct_answer}
                    onChange={(e) =>
                      setNewSection((prev) => ({
                        ...prev,
                        marks_for_correct_answer:
                          parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section_order">
                    Section Order <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="section_order"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={newSection.section_order}
                    onChange={(e) =>
                      setNewSection((prev) => ({
                        ...prev,
                        section_order: parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowNewSectionDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={
                    editingSection ? handleUpdateSection : handleAddSection
                  }
                  className="bg-primary hover:bg-primary/90"
                >
                  {editingSection ? "Update" : "Add"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">#</TableHead>
                <TableHead>Display Name</TableHead>
                <TableHead>Section</TableHead>
                <TableHead className="text-center">Duration (Min)</TableHead>
                <TableHead className="text-center">Marks/Answer</TableHead>
                <TableHead className="text-center">Total Questions</TableHead>
                <TableHead className="text-center">Total Duration</TableHead>
                <TableHead className="text-center">Total Marks</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading sections...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : sections.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <div className="mb-2">No sections added yet</div>
                    <div className="text-sm">
                      Click "Add Section" to get started
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sections.map((section, index) => (
                  <TableRow key={section.id}>
                    <TableCell className="font-medium">
                      {section.section_order}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{section.display_name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-primary">
                        {section.section}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">
                        {section.duration > 0 ? `${section.duration} Min` : "-"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">
                        {section.marks_for_correct_answer > 0
                          ? section.marks_for_correct_answer
                          : "-"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {section.total_questions} Q
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {section.total_duration} Minutes
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {section.total_marks} Marks
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSection(section)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSection(section.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
