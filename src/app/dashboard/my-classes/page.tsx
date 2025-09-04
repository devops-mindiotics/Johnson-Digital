import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyClassesPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>My Classes</CardTitle>
        </CardHeader>
        <CardContent>
            <p>This page is for Teachers to see their assigned classes and access subject materials.</p>
        </CardContent>
    </Card>
  );
}
