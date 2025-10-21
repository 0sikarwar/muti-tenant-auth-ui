import { RegisterForm } from '@/components/auth/RegisterForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create an account</CardTitle>
        <CardDescription>Enter your details below to register.</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
