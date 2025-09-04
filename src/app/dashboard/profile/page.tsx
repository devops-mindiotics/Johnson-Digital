import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
            <p>This is where user profile details (personal, school, subscription) will be displayed and can be edited.</p>
        </CardContent>
    </Card>
  );
}
