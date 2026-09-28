import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import FormAlert from "@/components/FormAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";
import { getPostAuthPath } from "@/lib/auth";

const initialForm = { name: "", email: "", password: "", confirmPassword: "" };

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Full name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Enter a valid email address";
    if (form.password.length < 6)
      return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const registeredUser = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setSuccess("Your account is ready. Redirecting...");
      window.setTimeout(
        () => navigate(getPostAuthPath(registeredUser), { replace: true }),
        500,
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    ["name", "Full name", "text", "Your full name", UserRound, "name"],
    ["email", "Email address", "email", "you@example.com", Mail, "email"],
    [
      "password",
      "Password",
      "password",
      "At least 6 characters",
      LockKeyhole,
      "new-password",
    ],
    [
      "confirmPassword",
      "Confirm password",
      "password",
      "Repeat your password",
      LockKeyhole,
      "new-password",
    ],
  ];

  return (
    <AuthLayout
      eyebrow="Create your account"
      title="Join the safety network"
      description="Register as a community user to report concerns and receive verified updates."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <FormAlert>{error}</FormAlert>}
        {success && <FormAlert type="success">{success}</FormAlert>}
        {fields.map(([name, label, type, placeholder, Icon, autoComplete]) => (
          <div key={name}>
            <Label htmlFor={name}>{label}</Label>
            <div className="relative">
              <Icon className="pointer-events-none absolute left-3.5 top-3.5 size-5 text-slate-400" />
              <Input
                id={name}
                name={name}
                type={type}
                autoComplete={autoComplete}
                required
                placeholder={placeholder}
                className="pl-11"
                value={form[name]}
                onChange={handleChange}
              />
            </div>
          </div>
        ))}
        <p className="text-xs leading-5 text-slate-500">
          By creating an account, you agree to use Yatra Saarthi responsibly and
          protect sensitive case information.
        </p>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={submitting}
        >
          {submitting && <LoaderCircle className="size-4 animate-spin" />}
          {submitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <p className="mt-7 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-bold text-brand-600 hover:text-brand-700"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default RegisterPage;
