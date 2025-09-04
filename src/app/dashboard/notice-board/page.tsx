import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NoticeBoardPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Notice Board</CardTitle>
        </CardHeader>
        <CardContent>
            <p>Important announcements and notices will be displayed here for all users.</p>
        </CardContent>
    </Card>
  );
}
