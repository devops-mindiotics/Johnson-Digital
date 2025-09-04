import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RolesPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Roles, Menus and Capability Management</CardTitle>
        </CardHeader>
        <CardContent>
            <p>This page is for Super Admins to define roles, attach menus, and set capabilities (Create, Read, Edit, Delete).</p>
        </CardContent>
    </Card>
  );
}
