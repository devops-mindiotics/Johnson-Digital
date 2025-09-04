import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Users Management</CardTitle>
        </CardHeader>
        <CardContent>
            <p>This page is for Super Admins and School Admins to manage users. A list of users will be displayed here, with functionality for creation, editing, and bulk import.</p>
        </CardContent>
    </Card>
  );
}
