// 
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
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
  Pencil,
  Trash2,
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
import { useToast } from '@/hooks/use-toast';
import { DashboardSkeleton } from '@/components/ui/loader';

const mockSchools = [
  {
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
  const [isLoading, setIsLoading] = useState(true);
  const [schools, setSchools] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [schoolToDeactivate, setSchoolToDeactivate] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSchools(mockSchools);
      setIsLoading(false);
    }, 2000);
  }, []);

  const openDialog = (school) => {
    setSchoolToDeactivate(school);
    setDialogOpen(true);
  };

  const handleDeactivate = () => {
    if (schoolToDeactivate) {
      toast({
        title: 'Success',
        description: `${schoolToDeactivate.name} has been deactivated.`,
      });
      setDialogOpen(false);
      setSchoolToDeactivate(null);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
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
            <Link href="/dashboard/schools/add">
              <Button size="icon" className="inline-flex md:hidden">
                <PlusCircle className="h-4 w-4" />
                <span className="sr-only">Add School</span>
              </Button>
              <Button className="hidden md:inline-flex">
                <PlusCircle className="mr-2 h-4 w-4" />
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
                  <TableRow key={school.name}>
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
                          <Link href="/dashboard/schools/view">
                            <DropdownMenuItem>View/Edit</DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => openDialog(school)}
                          >
                            Deactivate
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
              <Card key={school.name}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold">{school.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {school.johnsonId} &bull; {school.city}, {school.state}
                      </CardDescription>
                    </div>
                    <div className="flex items-center">
                      <Link href="/dashboard/schools/view">
                        <Button size="icon" variant="ghost">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">View/Edit</span>
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => openDialog(school)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Deactivate</span>
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

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to deactivate {schoolToDeactivate?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the school as inactive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivate}>
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}