'use client';

import Link from "next/link";
import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash2,
  View,
  School,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getAllSchools, updateSchool } from "@/lib/api/schoolApi";
import { useAuth } from "@/hooks/use-auth";

export default function SchoolsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [schools, setSchools] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [schoolToProcess, setSchoolToProcess] = useState<any | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [processedSchoolName, setProcessedSchoolName] = useState("");

  const fetchSchools = async (tenantId: string) => {
    try {
      console.log("Fetching schools for tenantId:", tenantId);
      const response = await getAllSchools(tenantId);
      setSchools(response || []);
    } catch (err: any) {
      setError(err.message || "Failed to load schools");
    }
  };

  useEffect(() => {
    console.log("User object from useAuth:", user);
    if (user?.tenantId) {
      fetchSchools(user.tenantId);
    } else {
        console.log("Tenant ID not found in user object");
    }
  }, [user]);

  const openDialog = (school: SetStateAction<any | null>) => {
    setSchoolToProcess(school);
  };

  const handleStatusChange = async () => {
    if (schoolToProcess && user?.tenantId) {
      const newStatus =
        schoolToProcess.status.toLowerCase() === "active" || schoolToProcess.status.toLowerCase() === "trial"
          ? "inactive"
          : "active";
      const updatedSchool = { ...schoolToProcess, status: newStatus };

      try {
        await updateSchool(user.tenantId, schoolToProcess.id, { data: updatedSchool });
        await fetchSchools(user.tenantId); // Refetch schools after update
        setProcessedSchoolName(schoolToProcess.schoolName);
        if (newStatus === "inactive") setSuccessDialogOpen(true);
      } catch (error) {
        console.error("Failed to update school:", error);
      } finally {
        setSchoolToProcess(null);
      }
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Schools Management</CardTitle>
              <CardDescription>
                Manage all the schools on the platform.
              </CardDescription>
            </div>

            <Link href="/homepage/schools/add">
              <Button
                size="icon"
                className="inline-flex md:hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white relative"
              >
                <School className="h-5 w-5" />
                <div className="absolute top-[-4px] right-[-4px] bg-green-500 rounded-full p-0.5">
                  <Plus className="h-3 w-3 text-white" />
                </div>
              </Button>
              <Button className="hidden md:inline-flex">
                <School className="mr-2 h-4 w-4" />
                Add School
              </Button>
            </Link>
          </div>

          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search schools..." className="pl-8" />
          </div>
        </CardHeader>

        <CardContent>
          {/* 🖥️ Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">School Name</TableHead>
                  <TableHead className="text-center">Johnson ID</TableHead>
                  <TableHead className="text-center">Board</TableHead>
                  <TableHead className="text-center">City, State</TableHead>
                  <TableHead className="text-center">Teachers</TableHead>
                  <TableHead className="text-center">Students</TableHead>
                  <TableHead className="text-center">Expiry Date</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {schools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell className="font-medium">
                      {school.schoolName}
                    </TableCell>
                    <TableCell>{school.schoolCode}</TableCell>
                    <TableCell>{school.board}</TableCell>
                    <TableCell>
                      {school.address?.city || "—"},{" "}
                      {school.address?.state || "—"}
                    </TableCell>

                    <TableCell className="text-center">
                      {school.totalTeachers ? school.totalTeachers : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {school.totalStudents ? school.totalStudents : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {school.expiryDate
                        ? new Date(school.expiryDate)
                            .toLocaleDateString("en-GB") // gives DD/MM/YYYY
                            .replace(/\//g, "-") // make it DD-MM-YYYY
                        : "—"}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant={
                          school.status.toLowerCase() === "active"
                            ? "default"
                            : school.status.toLowerCase() === "inactive"
                              ? "destructive"
                              : "secondary"
                        }
                        onClick={() => openDialog(school)}
                        className="cursor-pointer"
                      >
                        {school.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/homepage/schools/${school.id}`)
                            }
                          >
                            View/Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className={
                              school.status.toLowerCase() === "inactive"
                                ? ""
                                : "text-destructive"
                            }
                            onClick={() => openDialog(school)}
                          >
                            {school.status.toLowerCase() === "inactive"
                              ? "Activate"
                              : "Deactivate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 📱 Mobile View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {schools.map((school) => (
              <Card key={school.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold">
                        {school.schoolName}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {school.schoolCode} • {school.address?.city}, {school.address?.state}
                      </CardDescription>
                    </div>
                    <div className="flex items-center">
                      <Link href={`/homepage/schools/${school.id}`}>
                        <Button size="icon" variant="ghost">
                          <View className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={
                          school.status.toLowerCase() === "inactive" ? "" : "text-destructive"
                        }
                        onClick={() => openDialog(school)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm">
                    <Badge
                      variant={
                        school.status.toLowerCase() === "active"
                          ? "default"
                          : school.status.toLowerCase() === "inactive"
                            ? "destructive"
                            : "secondary"
                      }
                      onClick={() => openDialog(school)}
                      className="cursor-pointer"
                    >
                      {school.status}
                    </Badge>
                    <div className="text-muted-foreground">
                      Expires on{" "}
                      <span className="font-medium text-foreground">
                        {school.expiryDate ? new Date(school.expiryDate).toLocaleDateString('en-GB').replace(/\//g, '-') : '—'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ⚠️ Confirm Status Change */}
      <AlertDialog
        open={!!schoolToProcess}
        onOpenChange={() => setSchoolToProcess(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will change the status of{" "}
              <span className="font-semibold">"{schoolToProcess?.schoolName}"</span> to{" "}
              <span className="font-semibold">
                {schoolToProcess?.status.toLowerCase() === "active" ||
                schoolToProcess?.status.toLowerCase() === "trial"
                  ? "Inactive"
                  : "Active"}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSchoolToProcess(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>
              {schoolToProcess?.status.toLowerCase() === "active" ||
              schoolToProcess?.status.toLowerCase() === "trial"
                ? "Deactivate"
                : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ✅ Success Dialog */}
      <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success</AlertDialogTitle>
            <AlertDialogDescription>
              {processedSchoolName} is deactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setSuccessDialogOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
