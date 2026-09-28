import {
  Camera,
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import FormAlert from "@/components/FormAlert";
import UserModuleLayout from "@/components/UserModuleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";
import {
  indianMobileErrorMessage,
  isValidIndianMobile,
  normalizeIndianMobile,
} from "@/lib/validators";

const initialForm = {
  name: "",
  relation: "",
  age: "",
  phone: "",
  medicalNotes: "",
};

function FamilyPage() {
  const { token } = useAuth();
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadMembers = useCallback(async () => {
    const data = await apiRequest("/family-members", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMembers(data.members);
  }, [token]);

  useEffect(() => {
    loadMembers()
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [loadMembers]);

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setPhoto(null);
    setShowForm(true);
  };

  const openEdit = (member) => {
    setEditing(member);
    setForm(
      Object.fromEntries(
        Object.keys(initialForm).map((key) => [key, member[key] ?? ""]),
      ),
    );
    setPhoto(null);
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.phone && !isValidIndianMobile(form.phone)) {
      setError(indianMobileErrorMessage);
      return;
    }
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      payload.append(
        key,
        key === "phone" ? normalizeIndianMobile(value) : value,
      ),
    );
    if (photo) payload.append("photo", photo);

    setSubmitting(true);
    try {
      await apiRequest(
        editing ? `/family-members/${editing._id}` : "/family-members",
        {
          method: editing ? "PUT" : "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
        },
      );
      await loadMembers();
      setShowForm(false);
      setForm(initialForm);
      setEditing(null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`Remove ${member.name} from your family list?`)) return;
    try {
      await apiRequest(`/family-members/${member._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers((current) =>
        current.filter((item) => item._id !== member._id),
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <UserModuleLayout
      title="Family"
      description="Keep essential details available during crowded events."
      actions={
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Add member
        </Button>
      }
    >
      {error && (
        <div className="mb-5">
          <FormAlert>{error}</FormAlert>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-950">
              {editing ? "Edit family member" : "Add family member"}
            </h2>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowForm(false)}
            >
              Close
            </Button>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label htmlFor="member-name">Name</Label>
              <Input
                id="member-name"
                required
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="relation">Relation</Label>
              <Input
                id="relation"
                required
                placeholder="Parent, child, spouse..."
                value={form.relation}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    relation: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="member-age">Age</Label>
              <Input
                id="member-age"
                type="number"
                min="0"
                max="120"
                value={form.age}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    age: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="member-photo">Photo</Label>
              <label
                htmlFor="member-photo"
                className="flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3.5 text-sm text-slate-500 shadow-sm"
              >
                <Camera className="size-4" />
                {photo?.name || "Choose image"}
              </label>
              <input
                id="member-photo"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => setPhoto(event.target.files[0] || null)}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <Label htmlFor="medical-notes">Medical notes</Label>
              <Textarea
                id="medical-notes"
                placeholder="Allergies, medication, accessibility needs, or emergency notes"
                value={form.medicalNotes}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    medicalNotes: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting && <LoaderCircle className="size-4 animate-spin" />}
              {submitting ? "Saving..." : "Save member"}
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="grid min-h-64 place-items-center">
          <LoaderCircle className="size-7 animate-spin text-brand-600" />
        </div>
      ) : members.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <article
              key={member._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                {member.photo?.url ? (
                  <img
                    src={member.photo.url}
                    alt={member.name}
                    className="size-14 rounded-xl object-cover"
                  />
                ) : (
                  <span className="grid size-14 place-items-center rounded-xl bg-slate-100 text-slate-400">
                    <UserRound />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-bold text-slate-950">
                    {member.name}
                  </h2>
                  <p className="mt-1 text-sm capitalize text-slate-500">
                    {member.relation}
                    {member.age !== null ? ` · Age ${member.age}` : ""}
                  </p>
                </div>
              </div>
              {member.medicalNotes && (
                <p className="mt-4 line-clamp-3 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                  {member.medicalNotes}
                </p>
              )}
              <div className="mt-5 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => openEdit(member)}
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600"
                  onClick={() => handleDelete(member)}
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <UsersRound className="mx-auto size-9 text-slate-300" />
          <p className="mt-4 font-semibold text-slate-800">
            No family members added
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Add the people attending with you.
          </p>
        </div>
      )}
    </UserModuleLayout>
  );
}

export default FamilyPage;
