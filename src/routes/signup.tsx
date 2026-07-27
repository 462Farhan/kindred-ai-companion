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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — PeerBridge" },
      { name: "description", content: "Sign up anonymously and connect with trained peer supporters in minutes." },
      { property: "og:title", content: "Create your account — PeerBridge" },
      { property: "og:description", content: "Sign up anonymously and connect with trained peer supporters." },
    ],
  }),
  component: SignupPage,
});

const schema = z
  .object({
    handle: z.string().min(3, "Choose at least 3 characters"),
    email: z.string().email("Enter a valid email address"),
    role: z.enum(["user", "peer"]),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
    consent: z.boolean().refine((v) => v, "Please accept the community guidelines"),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords do not match" });

function SignupPage() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { handle: "", email: "", role: "user", password: "", confirm: "", consent: false },
  });
  const errors = form.formState.errors;

  return (
    <AuthLayout
      title="Create your anonymous account"
      description="Pick a handle — it's the only name anyone will see."
      footer={
        <span>
          Already a member?{" "}
          <Link to="/login" className="font-medium text-primary underline underline-offset-4">
            Log in
          </Link>
        </span>
      }
    >
      <form
        noValidate
        className="space-y-5"
        onSubmit={form.handleSubmit(() => {
          toast.success("Account created", { description: "Demo mode — welcome to your dashboard." });
          navigate({ to: "/dashboard" });
        })}
      >
        <div className="space-y-2">
          <Label htmlFor="handle">Anonymous handle</Label>
          <Input id="handle" placeholder="quiet-harbor" {...form.register("handle")} />
          {errors.handle && <p className="text-sm text-destructive">{errors.handle.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email (private)</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...form.register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">I'm joining as</Label>
          <Select
            defaultValue="user"
            onValueChange={(v) => form.setValue("role", v as "user" | "peer", { shouldValidate: true })}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Someone seeking support</SelectItem>
              <SelectItem value="peer">Trained peer supporter</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="new-password" {...form.register("password")} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm</Label>
            <Input id="confirm" type="password" autoComplete="new-password" {...form.register("confirm")} />
            {errors.confirm && <p className="text-sm text-destructive">{errors.confirm.message}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <Checkbox
              id="consent"
              className="mt-0.5"
              onCheckedChange={(v) => form.setValue("consent", Boolean(v), { shouldValidate: true })}
            />
            <span>I agree to the community guidelines and understand this is not an emergency service.</span>
          </label>
          {errors.consent && <p className="text-sm text-destructive">{errors.consent.message}</p>}
        </div>
        <Button type="submit" className="w-full" size="lg">
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
