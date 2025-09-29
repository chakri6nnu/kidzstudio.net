import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface Section {
  id: string;
  display_name: string;
  section: string;
  section_order: number;
  total_questions: number;
  total_duration: number;
  total_marks: number;
}

interface ExamSectionsTabProps {
  examData?: any;
  onSave: (sections: Section[]) => void;
}

export default function ExamSectionsTab({ examData, onSave }: ExamSectionsTabProps) {
  const [sections, setSections] = useState<Section[]>(examData?.sections || [
    {
      id: "1",
      display_name: "Main",
      section: "Number & Arithmetic ← Mathematics / Numerical Reasoning",
      section_order: 1,
      total_questions: 20,
      total_duration: 20,
      total_marks: 20
    }
  ]);

  const [showNewSectionDialog, setShowNewSectionDialog] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [newSection, setNewSection] = useState({
    display_name: "",
    section: "",
    section_order: sections.length + 1
  });

  // Mock sections data - replace with actual API data
  const availableSections = [
    { id: "1", name: "Number & Arithmetic ← Mathematics / Numerical Reasoning" },
    { id: "2", name: "Algebra ← Mathematics / Advanced Mathematics" },
    { id: "3", name: "Geometry ← Mathematics / Spatial Reasoning" },
    { id: "4", name: "Statistics ← Mathematics / Data Analysis" },
    { id: "5", name: "English Grammar ← English / Language Arts" },
  ];

  const handleAddSection = () => {
    if (!newSection.display_name || !newSection.section) {
      toast.error("Please fill in all required fields");
      return;
    }

    const section: Section = {
      id: Date.now().toString(),
      display_name: newSection.display_name,
      section: availableSections.find(s => s.id === newSection.section)?.name || newSection.section,
      section_order: newSection.section_order,
      total_questions: 0,
      total_duration: 0,
      total_marks: 0
    };

    const updatedSections = [...sections, section];
    setSections(updatedSections);
    onSave(updatedSections);
    
    setNewSection({
      display_name: "",
      section: "",
      section_order: updatedSections.length + 1
    });
    setShowNewSectionDialog(false);
    toast.success("Section added successfully");
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setNewSection({
      display_name: section.display_name,
      section: section.section,
      section_order: section.section_order
    });
    setShowNewSectionDialog(true);
  };

  const handleUpdateSection = () => {
    if (!editingSection) return;

    const updatedSections = sections.map(section => 
      section.id === editingSection.id 
        ? {
            ...section,
            display_name: newSection.display_name,
            section: availableSections.find(s => s.id === newSection.section)?.name || newSection.section,
            section_order: newSection.section_order
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
    const updatedSections = sections.filter(section => section.id !== sectionId);
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
          <Dialog open={showNewSectionDialog} onOpenChange={setShowNewSectionDialog}>
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
                  {editingSection ? "Update section details" : "Add a new section to the exam"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name *</Label>
                  <Input
                    id="display_name"
                    placeholder="Enter Name"
                    value={newSection.display_name}
                    onChange={(e) => setNewSection(prev => ({ ...prev, display_name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Select 
                    value={newSection.section} 
                    onValueChange={(value) => setNewSection(prev => ({ ...prev, section: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section_order">Section Order *</Label>
                  <Input
                    id="section_order"
                    type="number"
                    min="1"
                    placeholder="Enter Order"
                    value={newSection.section_order}
                    onChange={(e) => setNewSection(prev => ({ ...prev, section_order: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewSectionDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={editingSection ? handleUpdateSection : handleAddSection}
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
                <TableHead className="text-center">Total Questions</TableHead>
                <TableHead className="text-center">Total Duration</TableHead>
                <TableHead className="text-center">Total Marks</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section, index) => (
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
              ))}
            </TableBody>
          </Table>

          {sections.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="mb-2">No sections added yet</div>
              <div className="text-sm">Click "Add Section" to get started</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}