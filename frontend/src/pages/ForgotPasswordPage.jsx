import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LoaderCircle, Mail } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import FormAlert from "@/components/FormAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      setSuccess("If an account exists for this email, password recovery instructions will be sent when recovery services are enabled.");
      setSubmitting(false);
    }, 500);
  };

  return (
    <AuthLayout eyebrow="Account recovery" title="Forgot your password?" description="Enter your account email to begin the secure recovery process.">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && <FormAlert>{error}</FormAlert>}
        {success && <FormAlert type="success">{success}</FormAlert>}
        <div>
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-3.5 size-5 text-slate-400" />
            <Input id="email" type="email" autoComplete="email" required placeholder="you@example.com" className="pl-11" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting && <LoaderCircle className="size-4 animate-spin" />}
          {submitting ? "Checking account..." : "Continue"}
        </Button>
      </form>
      <Link to="/login" className="mt-7 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-600">
        <ArrowLeft className="size-4" />Back to sign in
      </Link>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
