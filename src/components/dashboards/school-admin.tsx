import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { User } from '@/contexts/auth-context';

export default function SchoolAdminDashboard({ user }: { user: User }) {
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>School Admin Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Welcome, {user.name}. Your dashboard is under construction.</p>
                <p className="text-muted-foreground">Statistics, student enrollment graphs, and quick access menus will be available here soon.</p>
            </CardContent>
        </Card>
    </div>
  );
}
