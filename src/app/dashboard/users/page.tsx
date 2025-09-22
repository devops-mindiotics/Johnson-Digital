'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle, Search, Upload, FileUp, User, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardSkeleton } from '@/components/ui/loader';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/use-auth';
import './users.css';

const mockUsers = [
  {
    id: 'usr_5e88488a7558f62f3e36f4d7',
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    mobile: '+91-9876543210',
    role: 'Teacher',
    school: 'Greenwood High',
    schoolId: 'JSN-123',
    class: '10',
    section: 'A',
    experience: '5 years',
    status: 'Active',
    expiresOn: '2025-06-30',
    avatar: 'https://picsum.photos/100/100?q=11',
  },
  {
    id: 'usr_5e88488a7558f62f3e36f4d8',
    name: 'Diya Patel',
    email: 'diya@example.com',
    mobile: '+91-9876543211',
    role: 'Student',
    school: 'Oakridge International',
    schoolId: 'JSN-456',
    class: '9',
    section: 'B',
    status: 'Active',
    expiresOn: '2026-03-15',
    avatar: 'https://picsum.photos/100/100?q=12',
  },
  {
    id: 'usr_5e88488a7558f62f3e36f4d9',
    name: 'Rohan Gupta',
    email: 'rohan@example.com',
    mobile: '+91-9876543212',
    role: 'School Admin',
    school: 'Northwood Academy',
    schoolId: 'JSN-789',
    status: 'Inactive',
    expiresOn: 'N/A',
    avatar: 'https://picsum.photos/100/100?q=13',
  },
  {
    id: 'usr_5e88488a7558f62f3e36f4da',
    name: 'Priya Singh',
    email: 'priya@example.com',
    mobile: '+91-9876543213',
    role: 'Teacher',
    school: 'Sunflower Prep',
    schoolId: 'JSN-101',
    class: '12',
    section: 'C',
    experience: '8 years',
    status: 'Active',
    expiresOn: '2024-11-20',
    avatar: 'https://picsum.photos/100/100?q=14',
  },
  {
    id: 'usr_5e88488a7558f62f3e36f4db',
    name: 'Arjun Kumar',
    email: 'arjun@example.com',
    mobile: '+91-9876543214',
    role: 'Student',
    school: 'Riverdale Public School',
    schoolId: 'JSN-212',
    class: '8',
    section: 'A',
    status: 'Active',
    expiresOn: '2025-09-01',
    avatar: 'https://picsum.photos/100/100?q=15',
  },
  {
    id: 'usr_5e88488a7558f62f3e36f4dc',
    name: 'Sneha Reddy',
    email: 'sneha@example.com',
    mobile: '+91-9876543215',
    role: 'Teacher',
    school: 'Greenwood High',
    schoolId: 'JSN-123',
    class: '11',
    section: 'B',
    experience: '3 years',
    status: 'Active',
    expiresOn: '2025-06-30',
    avatar: 'https://picsum.photos/100/100?q=16',
  },
];

const mockSchools = [
  { name: 'Greenwood High', id: 'JSN-123' },
  { name: 'Oakridge International', id: 'JSN-456' },
  { name: 'Northwood Academy', id: 'JSN-789' },
  { name: 'Sunflower Prep', id: 'JSN-101' },
  { name: 'Riverdale Public School', id: 'JSN-212' },
  { name: 'Greenwood High', id: 'JSN-123' },
];

export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [processedUserName, setProcessedUserName] = useState('');

  useEffect(() => {
    setTimeout(() => {
      let displayUsers = mockUsers;
      if (user && user.role !== 'Super Admin') {
        displayUsers = mockUsers.filter(u => u.school === user.school);
      }
      setUsers(displayUsers);
      setIsLoading(false);
    }, 2000);
  }, [user]);

  const handleStatusChange = () => {
    if (userToUpdate) {
      const newStatus = userToUpdate.status === 'Active' ? 'Inactive' : 'Active';
      const updatedUsers = users.map((u) =>
        u.id === userToUpdate.id
          ? { ...u, status: newStatus }
          : u
      );
      setUsers(updatedUsers);
      if (newStatus === 'Inactive') {
        setProcessedUserName(userToUpdate.name);
        setSuccessDialogOpen(true);
      }
      setUserToUpdate(null);
    }
  };

  const filteredBySchool = selectedSchool === 'all' || user.role !== 'Super Admin'
    ? users
    : users.filter((user) => user.school === selectedSchool);

  const filteredUsers = searchTerm
    ? filteredBySchool.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredBySchool;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

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
            <Button size="icon" variant="outline" className="md:hidden" onClick={() => setIsImporting(true)}>
              <Upload className="h-4 w-4" />
              <span className="sr-only">Bulk Import</span>
            </Button>
            <Button variant="outline" className="hidden md:flex" onClick={() => setIsImporting(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Bulk Import
            </Button>
            <Button size="icon" className="md:hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white relative" onClick={() => router.push('/dashboard/users/add')}>
                <User className="h-5 w-5" />
                <div className="absolute top-[-4px] right-[-4px] bg-green-500 rounded-full p-0.5">
                    <Plus className="h-3 w-3 text-white" />
                </div>
            </Button>
            <Button className="hidden md:flex" onClick={() => router.push('/dashboard/users/add')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {user && user.role === 'Super Admin' && (
            <Select onValueChange={setSelectedSchool} defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Filter by school" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                {mockSchools.map((school, index) => (
                  <SelectItem key={index} value={school.name}>
                    {school.id} - {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                {user && user.role === 'Super Admin' && <TableHead>School</TableHead>}
                <TableHead>Role</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Expires on</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={u.avatar} alt={u.name} data-ai-hint="person avatar" />
                        <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">
                        <div>{u.name}</div>
                        <div className="text-sm text-muted-foreground">{u.mobile}</div>
                      </div>
                    </div>
                  </TableCell>
                  {user && user.role === 'Super Admin' && <TableCell>{u.schoolId} - {u.school}</TableCell>}
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    {u.role === 'Student' && `Class: ${u.class}-${u.section}`}
                    {u.role === 'Teacher' && `Experience: ${u.experience}`}
                    {(u.role === 'School Admin') && 'N/A'}
                  </TableCell>
                  <TableCell>{u.expiresOn}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        u.status === 'Active' ? 'default' : 'destructive'
                      }
                      onClick={() => setUserToUpdate(u)}
                      className="cursor-pointer"
                    >
                      {u.status}
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
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${u.id}`)}>View/Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setUserToUpdate(u)}>{u.status === 'Active' ? 'Deactivate' : 'Activate'}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredUsers.map((u) => (
            <Card key={u.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={u.avatar} alt={u.name} />
                    <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">
                    <div>{u.name}</div>
                    <div className="text-sm text-muted-foreground">{u.mobile}</div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${u.id}`)}>View/Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUserToUpdate(u)}>{u.status === 'Active' ? 'Deactivate' : 'Activate'}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                {user && user.role === 'Super Admin' &&
                  <div>
                    <div className="font-semibold">School</div>
                    <div>{u.schoolId} - {u.school}</div>
                  </div>
                }
                <div>
                  <div className="font-semibold">Role</div>
                  <div>{u.role}</div>
                </div>
                <div>
                  <div className="font-semibold">Details</div>
                  <div>
                    {u.role === 'Student' && `Class: ${u.class}-${u.section}`}
                    {u.role === 'Teacher' && `Experience: ${u.experience}`}
                    {(u.role === 'School Admin') && 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Expires on</div>
                  <div>{u.expiresOn}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="font-semibold">Status</div>
                <Badge variant={u.status === 'Active' ? 'default' : 'destructive'} onClick={() => setUserToUpdate(u)} className="cursor-pointer">
                  {u.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
      <AlertDialog open={!!userToUpdate} onOpenChange={() => setUserToUpdate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will change the status of {userToUpdate?.name} to {userToUpdate?.status === 'Active' ? 'Inactive' : 'Active'}.
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
              {processedUserName} is deactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setSuccessDialogOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={isImporting} onOpenChange={setIsImporting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bulk Import Users</AlertDialogTitle>
            <AlertDialogDescription>
              Select a CSV file to upload. The file should contain the following columns: Name, Email, Mobile, Role, School, Class, and Expires on.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div
            className="file-upload-area"
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              accept=".csv"
            />
            {selectedFile ? (
              <p>Selected file: {selectedFile.name}</p>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <FileUp className="h-8 w-8" />
                <p>Click to browse or drag and drop a CSV file here.</p>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedFile(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={!selectedFile} onClick={() => console.log('Upload file', selectedFile)}>
                Upload
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
