import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import FormAlert from "@/components/FormAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";
import { getPostAuthPath } from "@/lib/auth";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const authenticatedUser = await login(form);
      setSuccess("Signed in successfully. Redirecting...");
      window.setTimeout(
        () => navigate(getPostAuthPath(authenticatedUser), { replace: true }),
        500,
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout eyebrow="Welcome back" title="Sign in to CrowdCare" description="Access your reports, updates, and event safety network.">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && <FormAlert>{error}</FormAlert>}
        {success && <FormAlert type="success">{success}</FormAlert>}
        <div>
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-3.5 size-5 text-slate-400" />
            <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="pl-11" value={form.email} onChange={handleChange} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="mb-2 text-xs font-semibold text-brand-600 hover:text-brand-700">Forgot password?</Link>
          </div>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-3.5 size-5 text-slate-400" />
            <Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="Enter your password" className="pl-11" value={form.password} onChange={handleChange} />
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting && <LoaderCircle className="size-4 animate-spin" />}
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="mt-7 text-center text-sm text-slate-500">
        New to CrowdCare?{" "}
        <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">Create an account</Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
