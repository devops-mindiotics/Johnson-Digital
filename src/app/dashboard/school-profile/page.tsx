import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SchoolProfilePage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>School Profile</CardTitle>
        </CardHeader>
        <CardContent>
            <p>This page is for School Admins to view and manage their school's details and license information.</p>
        </CardContent>
    </Card>
  );
}
