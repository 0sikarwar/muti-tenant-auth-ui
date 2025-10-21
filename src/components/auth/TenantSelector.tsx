'use client';

import { useTransition, useState } from 'react';
import { Globe } from 'lucide-react';

import { smartTenantSelection } from '@/ai/flows/smart-tenant-selection';
import { useTenant } from '@/hooks/useTenant';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function TenantSelector() {
  const { tenant, tenants, selectTenant } = useTenant();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSmartSelect = async () => {
    setError('');
    setReason('');
    startTransition(async () => {
      const availableTenants = tenants
        .map(t => `ID: ${t.id}, Name: ${t.name}, Description: ${t.description}`)
        .join('\n');
        
      try {
        const result = await smartTenantSelection({
          userDetails: 'A user trying to log in.',
          availableTenants,
          context: context,
        });

        if (result && result.tenantId && tenants.some(t => t.id === result.tenantId)) {
          selectTenant(result.tenantId);
          setReason(result.reason);
          toast({
            title: 'Tenant Selected',
            description: `We've selected "${tenants.find(t => t.id === result.tenantId)?.name}" for you.`,
          });
          setTimeout(() => setOpen(false), 2000); // Close dialog after a delay
        } else {
          setError(result.reason || 'Could not determine a suitable tenant. Please try a different description.');
        }
      } catch (e) {
        console.error(e);
        setError('An unexpected error occurred. Please try again.');
      }
    });
  };

  return (
    <div className="mb-4 space-y-2">
      <Label>Current Organization</Label>
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm">
          {tenant?.name || 'None Selected'}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" type="button" aria-label="Select Tenant">
              <Globe className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline">Find Your Organization</DialogTitle>
              <DialogDescription>
                Describe your organization or your role, and we&apos;ll find the right workspace for you.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="context">Description</Label>
                <Textarea
                  id="context"
                  placeholder="e.g., 'I work on advanced tech at Stark Industries' or 'I am the CEO of a multinational conglomerate.'"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              {reason && (
                <Alert variant="default">
                    <AlertTitle>Suggestion Found!</AlertTitle>
                    <AlertDescription>{reason}</AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive">
                    <AlertTitle>Suggestion Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleSmartSelect} disabled={isPending || !context}>
                {isPending ? 'Analyzing...' : 'Find Organization'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
