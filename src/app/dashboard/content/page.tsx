import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContentPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Content Management</CardTitle>
        </CardHeader>
        <CardContent>
            <p>This page is for Super Admins to create and manage subjects, lessons, and content (videos, PDFs, PPTs).</p>
        </CardContent>
    </Card>
  );
}
