"use client";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`relative h-10 w-32 ${className}`}>
      <div className="flex h-full items-center justify-center text-xl font-bold text-foreground">LOGO</div>
    </div>
  );
}
