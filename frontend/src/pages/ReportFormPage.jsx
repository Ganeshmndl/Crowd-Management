import { Camera, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormAlert from "@/components/FormAlert";
import UserModuleLayout from "@/components/UserModuleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";
import { generateFaceDescriptor, loadFaceModels } from "@/lib/faceUtils";
import {
  indianMobileErrorMessage,
  isValidIndianMobile,
  normalizeIndianMobile,
} from "@/lib/validators";

const phoneFields = new Set([
  "contactNumber",
  "secondaryContactNumber",
  "reporterMobile",
]);

const configs = {
  missing: {
    endpoint: "/missing-reports",
    title: "Missing person report",
    description: "Share accurate details to help event teams begin a search.",
    initial: {
      name: "",
      age: "",
      gender: "",
      contactNumber: "",
      secondaryContactNumber: "",
      lastSeenLocation: "",
      lastSeenDate: "",
      description: "",
      status: "open",
    },
    fields: [
      ["name", "Full name", "text", "Person's name"],
      ["age", "Age", "number", "Age"],
      ["contactNumber", "Contact mobile number", "tel", "98765 43210"],
      [
        "secondaryContactNumber",
        "Secondary mobile number (optional)",
        "tel",
        "98765 43210",
      ],
      [
        "lastSeenLocation",
        "Last seen location",
        "text",
        "Gate, stage, landmark...",
      ],
      ["lastSeenDate", "Last seen date and time", "datetime-local", ""],
    ],
  },
  found: {
    endpoint: "/found-reports",
    title: "Found person report",
    description: "Help reunite a person with their family or group.",
    initial: {
      foundPersonName: "",
      approxAge: "",
      gender: "",
      foundLocation: "",
      helpDesk: "",
      reporterMobile: "",
      description: "",
      status: "open",
    },
    fields: [
      [
        "foundPersonName",
        "Found Person Name (optional)",
        "text",
        "If known, enter the person's name",
      ],
      ["approxAge", "Approximate age", "number", "Estimated age"],
      [
        "foundLocation",
        "Found location",
        "text",
        "Where was the person found?",
      ],
      ["helpDesk", "Help desk", "text", "Current help desk or safe point"],
      ["reporterMobile", "Reporter Mobile (optional)", "tel", "98765 43210"],
    ],
  },
};

function ReportFormPage({ type }) {
  const config = configs[type];
  const { id } = useParams();
  const editing = Boolean(id);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(config.initial);
  const [photo, setPhoto] = useState(null);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState("");
  const [loading, setLoading] = useState(editing);
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFaceModels();
  }, []);

  useEffect(() => {
    if (!editing) return;
    apiRequest(`${config.endpoint}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => {
        const report = data.report;
        setForm(
          Object.fromEntries(
            Object.keys(config.initial).map((key) => [
              key,
              key === "lastSeenDate"
                ? new Date(report[key]).toISOString().slice(0, 16)
                : (report[key] ?? ""),
            ]),
          ),
        );
        setExistingPhoto(report.photo?.url || "");
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [config, editing, id, token]);

  const preview = useMemo(
    () => (photo ? URL.createObjectURL(photo) : existingPhoto),
    [existingPhoto, photo],
  );

  const handlePhotoChange = async (event) => {
    const selectedFile = event.target.files[0] || null;
    setPhoto(selectedFile);
    if (!selectedFile) {
      setFaceDescriptor(null);
      return;
    }

    setAnalyzing(true);
    try {
      const descriptor = await generateFaceDescriptor(selectedFile);
      setFaceDescriptor(descriptor);
    } catch (err) {
      setFaceDescriptor(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!editing && !photo) {
      setError("A clear photo is required");
      return;
    }

    for (const field of phoneFields) {
      if (form[field] && !isValidIndianMobile(form[field])) {
        setError(indianMobileErrorMessage);
        return;
      }
    }

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      payload.append(
        key,
        phoneFields.has(key) ? normalizeIndianMobile(value) : value,
      ),
    );
    if (photo) payload.append("photo", photo);
    if (faceDescriptor)
      payload.append("faceDescriptor", JSON.stringify(faceDescriptor));

    setSubmitting(true);
    try {
      await apiRequest(editing ? `${config.endpoint}/${id}` : config.endpoint, {
        method: editing ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });
      navigate("/user/reports", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <UserModuleLayout title={config.title}>
        <div className="grid min-h-72 place-items-center">
          <LoaderCircle className="size-7 animate-spin text-brand-600" />
        </div>
      </UserModuleLayout>
    );
  }

  return (
    <UserModuleLayout
      title={editing ? `Edit ${config.title.toLowerCase()}` : config.title}
      description={config.description}
    >
      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Label htmlFor="photo">
            Photo {editing ? "(optional replacement)" : ""}
          </Label>
          <label
            htmlFor="photo"
            className="mt-2 flex aspect-square max-h-80 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center hover:border-brand-300 hover:bg-brand-50"
          >
            {preview ? (
              <img
                src={preview}
                alt="Report preview"
                className="size-full object-cover"
              />
            ) : (
              <>
                <Camera className="size-8 text-slate-400" />
                <span className="mt-3 text-sm font-semibold text-slate-700">
                  Upload a clear photo
                </span>
                <span className="mt-1 text-xs text-slate-400">
                  JPG, PNG or WebP · max 5 MB
                </span>
              </>
            )}
          </label>
          <input
            id="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handlePhotoChange}
          />
          {analyzing && (
            <div className="mt-3 flex items-center justify-center text-sm text-slate-500">
              <LoaderCircle className="size-4 mr-2 animate-spin" />
              Analyzing photo...
            </div>
          )}
          {photo && !analyzing && faceDescriptor === null && (
            <div className="mt-3 rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
              No face detected in photo
            </div>
          )}
          {photo && !analyzing && faceDescriptor !== null && (
            <div className="mt-3 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
              Face detected successfully
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          {error && (
            <div className="mb-5">
              <FormAlert>{error}</FormAlert>
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            {config.fields.map(([name, label, inputType, placeholder]) => (
              <div
                key={name}
                className={name.includes("Location") ? "sm:col-span-2" : ""}
              >
                <Label htmlFor={name}>{label}</Label>
                <Input
                  id={name}
                  name={name}
                  type={inputType}
                  min={inputType === "number" ? "0" : undefined}
                  max={inputType === "number" ? "120" : undefined}
                  required={
                    !(
                      name === "reporterName" ||
                      name === "reporterMobile" ||
                      name === "secondaryContactNumber"
                    )
                  }
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [name]: event.target.value,
                    }))
                  }
                />
              </div>
            ))}
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                id="gender"
                required
                value={form.gender}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    gender: event.target.value,
                  }))
                }
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="unknown">Unknown</option>
              </Select>
            </div>
            {editing && (
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value,
                    }))
                  }
                >
                  {(type === "missing"
                    ? ["open", "found", "closed"]
                    : ["open", "reunited", "closed"]
                  ).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </div>
            )}
            <div className="sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Clothing, identifying details, condition, or other useful information"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/user/reports")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <LoaderCircle className="size-4 animate-spin" />}
              {submitting
                ? "Saving..."
                : editing
                  ? "Save changes"
                  : "Submit report"}
            </Button>
          </div>
        </div>
      </form>
    </UserModuleLayout>
  );
}

export default ReportFormPage;
