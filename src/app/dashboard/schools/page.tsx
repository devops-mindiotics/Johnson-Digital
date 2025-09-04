import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SchoolsPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Schools Management</CardTitle>
        </CardHeader>
        <CardContent>
            <p>This page is for Super Admins to manage schools. A list of schools will be displayed in a table here, with options to add, edit, and search.</p>
        </CardContent>
    </Card>
  );
}
