// components/AppNavbar.tsx
import React from "react";
import { BookOpen, ClipboardList, Bell, User } from "lucide-react";
import NavButton from "./nav";

type AppNavbarProps = {
  role: "teacher" | "student";
};

export default function AppNavbar({ role }: AppNavbarProps) {
  return (
    <nav className="flex w-full justify-between gap-2 px-2 py-2 bg-white shadow rounded-lg max-w-7xl mx-auto">
      {/* Common for both */}
      <NavButton
        icon={<BookOpen className="h-6 w-6 text-blue-600" />}
        label="Diary"
        color="blue"
        activeColor="blue"
      />

      {/* Only Teacher gets Homework */}
      {role === "teacher" && (
        <NavButton
          icon={<ClipboardList className="h-6 w-6 text-green-600" />}
          label="Homework"
          color="green"
          activeColor="green"
        />
      )}

      {/* Only Student gets Profile */}
      {role === "student" && (
        <NavButton
          icon={<User className="h-6 w-6 text-purple-600" />}
          label="Profile"
          color="purple"
          activeColor="purple"
        />
      )}

      {/* Common Notice for both */}
      <NavButton
        icon={<Bell className="h-6 w-6 text-yellow-600" />}
        label="Notice"
        color="yellow"
        activeColor="yellow"
      />
    </nav>
  );
}
