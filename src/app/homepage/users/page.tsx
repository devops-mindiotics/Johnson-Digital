'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Search, Upload, FileUp, User as UserIcon, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/use-auth';
import { getAllSchools } from '@/lib/api/schoolApi';
import { getUsersByTenant, getUsersBySchool } from '@/lib/api/userApi';
import { SUPERADMIN, TENANTADMIN } from '@/lib/utils/constants';
import { getRoles } from '@/lib/utils/getRole';
import './users.css';

export default function UsersPage() {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const userRole = getRoles();
  const [users, setUsers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [processedUserName, setProcessedUserName] = useState('');
  

  useEffect(() => {
    async function fetchData() {
      if (userRole === SUPERADMIN || userRole === TENANTADMIN) {
        try {
          const schoolData = await getAllSchools();
          if (schoolData && Array.isArray(schoolData)) {
            setSchools(schoolData);
          }
        } catch (error) {
          console.error("Failed to fetch schools:", error);
        }
      }
      try {
        let userData = [];
        if (selectedSchool === 'all') {
            userData = await getUsersByTenant();
        } else {
            userData = await getUsersBySchool(selectedSchool);
        }
        setUsers(userData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } 
    }
    fetchData();
  }, [authUser, userRole, selectedSchool]);

  const handleStatusChange = () => {
    if (userToUpdate) {
      const newStatus = userToUpdate.status === 'Active' ? 'Inactive' : 'Active';
      const updatedUsers = users.map((u) =>
        u.userId === userToUpdate.userId
          ? { ...u, status: newStatus }
          : u
      );
      setUsers(updatedUsers);
      if (newStatus === 'Inactive') {
        setProcessedUserName(userToUpdate.name || 'the user');
        setSuccessDialogOpen(true);
      }
      setUserToUpdate(null);
    }
  };

  const filteredUsers = searchTerm
    ? users.filter(u =>
        (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : users;

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
            <Button size="icon" className="md:hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white relative" onClick={() => router.push('/homepage/users/add')}>
                <UserIcon className="h-5 w-5" />
                <div className="absolute top-[-4px] right-[-4px] bg-green-500 rounded-full p-0.5">
                    <Plus className="h-3 w-3 text-white" />
                </div>
            </Button>
            <Button className="hidden md:flex" onClick={() => router.push('/homepage/users/add')}>
              <UserIcon className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {(userRole === SUPERADMIN || userRole === TENANTADMIN) && (
            <Select onValueChange={setSelectedSchool} defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Filter by school" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{school.schoolCode}</Badge>
                      <span className="font-medium">{school.schoolName}</span>
                    </div>
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
                {(userRole === SUPERADMIN || userRole === TENANTADMIN) && <TableHead>School</TableHead>}
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.userId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{u.name ? u.name.charAt(0) : 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">
                        <div>{u.name || 'Unnamed User'}</div>
                        <div className="text-sm text-muted-foreground">{u.mobile}</div>
                      </div>
                    </div>
                  </TableCell>
                  {(userRole === SUPERADMIN || userRole === TENANTADMIN) && <TableCell>{u.schoolName}</TableCell>}
                  <TableCell>{Array.isArray(u.roles) ? u.roles.join(', ') : ''}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        u.status === 'active' ? 'default' : 'destructive'
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
                        <DropdownMenuItem onClick={() => router.push(`/homepage/users/${u.userId}`)}>View/Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setUserToUpdate(u)}>{u.status === 'active' ? 'Deactivate' : 'Activate'}</DropdownMenuItem>
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
            <Card key={u.userId} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{u.name ? u.name.charAt(0) : 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">
                    <div>{u.name || 'Unnamed User'}</div>
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
                    <DropdownMenuItem onClick={() => router.push(`/homepage/users/${u.userId}`)}>View/Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUserToUpdate(u)}>{u.status === 'active' ? 'Deactivate' : 'Activate'}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                {(userRole === SUPERADMIN || userRole === TENANTADMIN) &&
                  <div>
                    <div className="font-semibold">School</div>
                    <div>{u.schoolName}</div>
                  </div>
                }
                <div>
                  <div className="font-semibold">Role</div>
                  <div>{Array.isArray(u.roles) ? u.roles.join(', ') : ''}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="font-semibold">Status</div>
                <Badge variant={u.status === 'active' ? 'default' : 'destructive'} onClick={() => setUserToUpdate(u)} className="cursor-pointer">
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
              This action will change the status of {userToUpdate?.name || 'the selected user'} to {userToUpdate?.status === 'active' ? 'inactive' : 'active'}.
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
