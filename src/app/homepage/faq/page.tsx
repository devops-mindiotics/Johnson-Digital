'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function FaqPage() {
  return (
    <div className="p-6 sm:p-12">
      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting and FAQ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>How do I reset my password?</AlertTitle>
            <AlertDescription>
              <p>You can reset your password by going to the 'Forgot Password' page. You will receive an email with instructions to reset your password.</p>
            </AlertDescription>
          </Alert>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>How do I add a new school?</AlertTitle>
            <AlertDescription>
              <p>You can add a new school from the 'Schools' section in the homepage. Click on 'Add New School' and fill in the required details.</p>
            </AlertDescription>
          </Alert>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Why can't I see the 'Parent School' dropdown?</AlertTitle>
            <AlertDescription>
              <p>The 'Parent School' dropdown only appears when you check the "Is this a Branch?" switch while adding or editing a school.</p>
            </AlertDescription>
          </Alert>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>What do the different user roles mean?</AlertTitle>
            <AlertDescription>
                <ul className="list-disc list-inside text-sm">
                    <li><strong>Super Admin:</strong> Has access to all features and settings across the entire platform.</li>
                    <li><strong>Admin:</strong> Manages a specific tenant or school, including users and school-level settings.</li>
                    <li><strong>Teacher:</strong> Can manage classes, students, and related activities.</li>
                </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
