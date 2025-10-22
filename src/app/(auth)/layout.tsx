"use client";

import { Logo } from "@/components/shared/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Logo />
          <h1 className="mt-4 font-headline text-3xl font-bold tracking-tight text-foreground"></h1>
          <p className="text-muted-foreground">Welcome to TenantVerse</p>
        </div>
        {children}
      </div>
    </main>
  );
}
