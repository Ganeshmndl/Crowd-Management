import {
  ArrowRight,
  FileSearch,
  HandHeart,
  Plus,
  Siren,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "@/components/StatusBadge";
import UserModuleLayout from "@/components/UserModuleLayout";
import { Card, CardContent } from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";

const endpoints = [
  ["/missing-reports", "reports", "Missing report"],
  ["/found-reports", "reports", "Found report"],
  ["/family-members", "members", "Family member"],
  ["/sos-requests", "requests", "SOS request"],
];

function UserDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState([[], [], [], []]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      endpoints.map(([path, key]) =>
        apiRequest(path, { headers: { Authorization: `Bearer ${token}` } }).then(
          (response) => response[key],
        ),
      ),
    )
      .then(setData)
      .finally(() => setLoading(false));
  }, [token]);

  const [missing, found, family, sos] = data;
  const activeSOS = sos.filter((request) =>
    ["active", "responding"].includes(request.status),
  ).length;
  const activities = useMemo(
    () =>
      endpoints
        .flatMap(([, , label], index) =>
          data[index].map((item) => ({ ...item, label })),
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6),
    [data],
  );

  const cards = [
    ["Missing reports", missing.length, FileSearch, "text-amber-600", "bg-amber-50"],
    ["Found reports", found.length, HandHeart, "text-emerald-600", "bg-emerald-50"],
    ["Family members", family.length, UsersRound, "text-blue-600", "bg-blue-50"],
    ["Active SOS", activeSOS, Siren, "text-red-600", "bg-red-50"],
  ];

  return (
    <UserModuleLayout
      title="Overview"
      description="Manage safety reports and keep your family connected."
      actions={
        <Link
          to="/user/missing/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          <Plus className="size-4" />
          New report
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon, iconColor, iconBg]) => (
          <Card key={label} className="shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  {loading ? "..." : value}
                </p>
              </div>
              <span className={`grid size-11 place-items-center rounded-xl ${iconBg}`}>
                <Icon className={`size-5 ${iconColor}`} />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="font-bold text-slate-950">Recent activity</h2>
                <p className="mt-1 text-xs text-slate-500">Latest updates for this event</p>
              </div>
              <Link to="/user/reports" className="text-xs font-bold text-brand-600">
                View all
              </Link>
            </div>
            {activities.length ? (
              <div className="divide-y divide-slate-100">
                {activities.map((item) => (
                  <div key={`${item.label}-${item._id}`} className="flex items-center gap-4 px-6 py-4">
                    <span className="size-2 rounded-full bg-brand-500" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {item.name || item.location || item.helpDesk || item.label}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.label} · {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(item.createdAt))}
                      </p>
                    </div>
                    <StatusBadge status={item.label.includes("SOS") ? item.status : item.reviewStatus} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-6 py-14 text-center text-sm text-slate-500">
                Your recent activity will appear here.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h2 className="font-bold text-slate-950">Quick actions</h2>
            <div className="mt-5 space-y-3">
              {[
                ["/user/missing/new", "Report a missing person", FileSearch],
                ["/user/found/new", "Report a found person", HandHeart],
                ["/user/family", "Add family member", UsersRound],
                ["/user/sos", "Request emergency help", Siren],
              ].map(([to, label, Icon]) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50"
                >
                  <Icon className="size-4 text-brand-600" />
                  <span className="flex-1">{label}</span>
                  <ArrowRight className="size-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </UserModuleLayout>
  );
}

export default UserDashboard;
