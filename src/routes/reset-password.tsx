import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — PeerBridge" },
      { name: "description", content: "Choose a new password to secure your anonymous PeerBridge account." },
      { property: "og:title", content: "Set a new password — PeerBridge" },
      { property: "og:description", content: "Choose a new password for your PeerBridge account." },
    ],
  }),
  component: ResetPasswordPage,
});

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords do not match" });

function ResetPasswordPage() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });

  return (
    <AuthLayout
      title="Set a new password"
      description="Use at least 8 characters, including a number or symbol."
      footer={
        <Link to="/login" className="font-medium text-primary underline underline-offset-4">
          Back to log in
        </Link>
      }
    >
      <form
        noValidate
        className="space-y-5"
        onSubmit={form.handleSubmit(() => {
          toast.success("Password updated", { description: "Demo mode — you can log in again." });
          navigate({ to: "/login" });
        })}
      >
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" autoComplete="new-password" {...form.register("password")} />
          {form.formState.errors.password && (
            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm new password</Label>
          <Input id="confirm" type="password" autoComplete="new-password" {...form.register("confirm")} />
          {form.formState.errors.confirm && (
            <p className="text-sm text-destructive">{form.formState.errors.confirm.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" size="lg">
          Update password
        </Button>
      </form>
    </AuthLayout>
  );
}
