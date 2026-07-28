import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppState, sendWelcomeEmail } from "@/lib/app-state";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — PeerBridge" },
      { name: "description", content: "Log in to your anonymous PeerBridge account to continue your conversations." },
      { property: "og:title", content: "Log in — PeerBridge" },
      { property: "og:description", content: "Log in to your anonymous PeerBridge account." },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function LoginPage() {
  const navigate = useNavigate();
  const { profile, setIsLoggedIn } = useAppState();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <AuthLayout
      title="Welcome back"
      description="Your handle stays anonymous in every conversation."
      footer={
        <span>
          New here?{" "}
          <Link to="/signup" className="font-medium text-primary underline underline-offset-4">
            Create an account
          </Link>
        </span>
      }
    >
      <form
        noValidate
        className="space-y-5"
        onSubmit={form.handleSubmit((data) => {
          setIsLoggedIn(true);

          // Send welcome email on first login (if not already sent)
          const emailSent = sendWelcomeEmail(data.email, profile.handle);

          if (emailSent) {
            toast.success("Signed in", {
              description: `Welcome email sent to ${data.email}. Check your inbox for getting-started tips!`,
            });
          } else {
            toast.success("Signed in", { description: `Welcome back, @${profile.handle}!` });
          }

          navigate({ to: "/dashboard" });
        })}
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" {...form.register("password")} />
          {form.formState.errors.password && (
            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox id="remember" /> Remember me
          </label>
          <Link to="/forgot-password" className="text-sm text-primary underline underline-offset-4">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" size="lg">
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
}