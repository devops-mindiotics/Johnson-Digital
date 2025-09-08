import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <Card>
         <CardHeader>
            <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
            <p>Application settings and preferences will be configured here.</p>
        </CardContent> 
    </Card>
  );
}
