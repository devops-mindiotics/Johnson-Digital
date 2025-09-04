
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
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const schools = [
  {
    name: 'Greenwood High',
    admin: 'Mr. Robert Fox',
    status: 'Active',
    plan: 'Premium Plan',
    users: 1200,
  },
  {
    name: 'Oakridge International',
    admin: 'Ms. Emily White',
    status: 'Active',
    plan: 'Standard Plan',
    users: 850,
  },
  {
    name: 'Northwood Academy',
    admin: 'Mr. David Green',
    status: 'Inactive',
    plan: 'Free Plan',
    users: 300,
  },
  {
    name: 'Sunflower Prep',
    admin: 'Mrs. Jessica Blue',
    status: 'Active',
    plan: 'Premium Plan',
    users: 1500,
  },
  {
    name: 'Riverdale Public School',
    admin: 'Mr. Michael Black',
    status: 'Trial',
    plan: 'Standard Plan',
    users: 600,
  },
];

export default function SchoolsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Schools Management</CardTitle>
            <CardDescription>
              Manage all the schools on the platform.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2" />
            Add School
          </Button>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search schools..." className="pl-8" />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School Name</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.map((school) => (
              <TableRow key={school.name}>
                <TableCell className="font-medium">{school.name}</TableCell>
                <TableCell>{school.admin}</TableCell>
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
                <TableCell>{school.plan}</TableCell>
                <TableCell>{school.users}</TableCell>
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
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
