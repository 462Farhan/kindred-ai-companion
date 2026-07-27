import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MailCheck } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — PeerBridge" },
      { name: "description", content: "Request a secure reset link for your PeerBridge account." },
      { property: "og:title", content: "Forgot password — PeerBridge" },
      { property: "og:description", content: "Request a secure reset link for your PeerBridge account." },
    ],
  }),
  component: ForgotPasswordPage,
});

const schema = z.object({ email: z.string().email("Enter a valid email address") });

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  return (
    <AuthLayout
      title="Reset your password"
      description="We'll email a secure link that expires in 30 minutes."
      footer={
        <span>
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-primary underline underline-offset-4">
            Back to log in
          </Link>
        </span>
      }
    >
      {sent ? (
        <div className="rounded-xl border bg-accent/40 p-6 text-center">
          <MailCheck className="mx-auto size-8 text-primary" aria-hidden="true" />
          <p className="mt-3 font-semibold">Check your inbox</p>
          <p className="mt-1 text-sm text-muted-foreground">
            If an account exists, a reset link is on its way. Demo mode:{" "}
            <Link to="/reset-password" className="text-primary underline underline-offset-4">
              open the reset page
            </Link>
            .
          </p>
        </div>
      ) : (
        <form noValidate className="space-y-5" onSubmit={form.handleSubmit(() => setSent(true))}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" size="lg">
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
