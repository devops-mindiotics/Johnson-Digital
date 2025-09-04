
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
  Upload,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const users = [
  {
    name: 'Liam Johnson',
    email: 'liam@example.com',
    role: 'Teacher',
    school: 'Greenwood High',
    status: 'Active',
    avatar: 'https://picsum.photos/100/100?q=11',
  },
  {
    name: 'Olivia Smith',
    email: 'olivia@example.com',
    role: 'Student',
    school: 'Oakridge International',
    status: 'Active',
    avatar: 'https://picsum.photos/100/100?q=12',
  },
  {
    name: 'Noah Williams',
    email: 'noah@example.com',
    role: 'School Admin',
    school: 'Northwood Academy',
    status: 'Inactive',
    avatar: 'https://picsum.photos/100/100?q=13',
  },
  {
    name: 'Emma Brown',
    email: 'emma@example.com',
    role: 'Teacher',
    school: 'Sunflower Prep',
    status: 'Active',
    avatar: 'https://picsum.photos/100/100?q=14',
  },
  {
    name: 'Oliver Jones',
    email: 'oliver@example.com',
    role: 'Student',
    school: 'Riverdale Public School',
    status: 'Active',
    avatar: 'https://picsum.photos/100/100?q=15',
  },
];

export default function UsersPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Users Management</CardTitle>
            <CardDescription>
              Create, edit, and manage all users on the platform.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="mr-2" />
              Bulk Import
            </Button>
            <Button>
              <PlusCircle className="mr-2" />
              Add User
            </Button>
          </div>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users by name or email..." className="pl-8" />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person avatar" />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">
                      <div>{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.school}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.status === 'Active' ? 'default' : 'destructive'
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
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
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Deactivate User
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
