'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash2,
  View,
  School,
  Plus,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const initialSchools = [
  {
    id: 'sch_1',
    name: 'Greenwood High',
    johnsonId: 'JSN-123',
    board: 'CBSE',
    status: 'Active',
    expiry: '2025-12-31',
    date: '2023-01-15',
    city: 'Metropolis',
    state: 'California',
  },
  {
    id: 'sch_2',
    name: 'Oakridge International',
    johnsonId: 'JSN-456',
    board: 'ICSE',
    status: 'Active',
    expiry: '2026-06-30',
    date: '2022-11-20',
    city: 'Gotham',
    state: 'New York',
  },
  {
    id: 'sch_3',
    name: 'Northwood Academy',
    johnsonId: 'JSN-789',
    board: 'State Board',
    status: 'Inactive',
    expiry: '2024-03-15',
    date: '2023-05-10',
    city: 'Star City',
    state: 'Washington',
  },
  {
    id: 'sch_4',
    name: 'Sunflower Prep',
    johnsonId: 'JSN-101',
    board: 'CBSE',
    status: 'Active',
    expiry: '2027-08-21',
    date: '2021-09-01',
    city: 'Central City',
    state: 'Missouri',
  },
  {
    id: 'sch_5',
    name: 'Riverdale Public School',
    johnsonId: 'JSN-212',
    board: 'ICSE',
    status: 'Trial',
    expiry: '2024-12-31',
    date: '2023-08-30',
    city: 'Riverdale',
    state: 'Georgia',
  },
];

export default function SchoolsPage() {
  const router = useRouter();
  const [schools, setSchools] = useState(initialSchools);
  const [schoolToProcess, setSchoolToProcess] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [processedSchoolName, setProcessedSchoolName] = useState('');

  const openDialog = (school) => {
    setSchoolToProcess(school);
  };

  const handleStatusChange = () => {
    if (schoolToProcess) {
      const newStatus =
        schoolToProcess.status === 'Active' || schoolToProcess.status === 'Trial'
          ? 'Inactive'
          : 'Active';
      const updatedSchools = schools.map((s) =>
        s.id === schoolToProcess.id ? { ...s, status: newStatus } : s
      );
      setSchools(updatedSchools);

      if (newStatus === 'Inactive') {
        setProcessedSchoolName(schoolToProcess.name);
        setSuccessDialogOpen(true);
      }
      setSchoolToProcess(null);
    }
  };

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
            <Link href="/dashboard/schools/add">
            <Button size="icon" className="inline-flex md:hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white relative">
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
          {/* Desktop View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School Name</TableHead>
                  <TableHead>Johnson ID</TableHead>
                  <TableHead>Board</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell>{school.johnsonId}</TableCell>
                    <TableCell>{school.board}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          school.status === 'Active'
                            ? 'default'
                            : school.status === 'Inactive'
                            ? 'destructive'
                            : 'secondary'
                        }
                        onClick={() => openDialog(school)}
                        className="cursor-pointer"
                      >
                        {school.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{school.expiry}</TableCell>
                    <TableCell>{school.date}</TableCell>
                    <TableCell>{school.city}</TableCell>
                    <TableCell>{school.state}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/schools/${school.id}`)}>
                            <View className="mr-2 h-4 w-4" />
                            View/Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className={school.status === 'Inactive' ? '' : 'text-destructive'}
                            onClick={() => openDialog(school)}
                          >
                            {school.status === 'Inactive' ? 'Activate' : 'Deactivate'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {schools.map((school) => (
              <Card key={school.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold">{school.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {school.johnsonId} &bull; {school.city}, {school.state}
                      </CardDescription>
                    </div>
                    <div className="flex items-center">
                      <Link href={`/dashboard/schools/${school.id}`}>
                        <Button size="icon" variant="ghost">
                          <View className="h-4 w-4" />
                          <span className="sr-only">View/Edit</span>
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={school.status === 'Inactive' ? '' : 'text-destructive'}
                        onClick={() => openDialog(school)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">{school.status === 'Inactive' ? 'Activate' : 'Deactivate'}</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm">
                    <Badge
                      variant={
                        school.status === 'Active'
                          ? 'default'
                          : school.status === 'Inactive'
                          ? 'destructive'
                          : 'secondary'
                      }
                      onClick={() => openDialog(school)}
                      className="cursor-pointer"
                    >
                      {school.status}
                    </Badge>
                    <div className="text-muted-foreground">
                      Expires on <span className="font-medium text-foreground">{school.expiry}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!schoolToProcess} onOpenChange={() => setSchoolToProcess(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will change the status of {schoolToProcess?.name} to{' '}
              {schoolToProcess?.status === 'Active' || schoolToProcess?.status === 'Trial'
                ? 'Inactive'
                : 'Active'}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
