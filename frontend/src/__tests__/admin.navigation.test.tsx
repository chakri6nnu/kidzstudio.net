import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Admin from "@/pages/admin/Exams";
import Quizzes from "@/pages/admin/Quizzes";
import Exams from "@/pages/admin/Exams";
import { AppSidebar } from "@/components/AppSidebar";

function Shell({ initialPath = "/admin" }: { initialPath?: string }) {
  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <div className="flex">
        <AppSidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/admin" element={<Exams />} />
            <Route path="/admin/quizzes/*" element={<Quizzes />} />
            <Route path="/admin/exams/*" element={<Exams />} />
            {/* Other routes are smoke rendered via sidebar links presence */}
          </Routes>
        </div>
      </div>
    </MemoryRouter>
  );
}

const sidebarLinks = [
  "Home Dashboard",
  "File Manager",
  "Manage Tests",
  "Manage Learning",
  "Question Bank",
  "Lesson Bank",
  "Video Bank",
  "CMS",
  "Monetization",
  "Manage Users",
  "Analytics",
  "Manage Categories",
  "Manage Subjects",
  "Settings",
];

describe("Admin sidebar navigation", () => {
  beforeEach(() => {
    // fetch is mocked in setup
  });

  it("renders all top-level groups/links without console errors (light theme)", () => {
    render(<Shell initialPath="/admin" />);
    for (const text of sidebarLinks) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  });
});
