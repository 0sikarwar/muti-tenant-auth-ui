"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome, {user?.name}!</h1>
        <p className="text-muted-foreground">Here&apos;s a quick overview of your workspace.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
          <CardDescription>This is your current session information.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Role</p>
            <p className="font-medium">{user?.role}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
