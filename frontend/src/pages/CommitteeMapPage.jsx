import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LoaderCircle, MapPin } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import CommitteeLayout from "../components/CommitteeLayout";
import useAuth from "../hooks/useAuth";
import { apiRequest } from "../lib/api";
import { Card, CardContent } from "../components/ui/card";
import L from "leaflet";

function MapBoundsController({ locations }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 0) return;

    if (locations.length === 1) {
      map.setView([locations[0].latitude, locations[0].longitude], 16);
    } else {
      const bounds = L.latLngBounds(
        locations.map((loc) => [loc.latitude, loc.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);

  return null;
}

function CommitteeMapPage() {
  const { token, selectedEvent } = useAuth();
  const [locations, setLocations] = useState([]);
  const [counts, setCounts] = useState({
    missing: 0,
    found: 0,
    sos: 0,
    matches: 0,
  });
  const [loading, setLoading] = useState(true);
  const markerRefs = useRef({});

  const getIconForType = (type) => {
    switch (type) {
      case "help_desk":
        return "🏪";
      case "volunteer_point":
        return "👥";
      case "sos_point":
        return "🆘";
      case "lost_found":
        return "📦";
      case "medical":
        return "🏥";
      default:
        return "📍";
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case "help_desk":
        return "Help Desk";
      case "volunteer_point":
        return "Volunteer Point";
      case "sos_point":
        return "SOS Point";
      case "lost_found":
        return "Lost & Found Center";
      case "medical":
        return "Medical Booth";
      default:
        return "Location";
    }
  };

  useEffect(() => {
    if (!selectedEvent?._id) return;
    Promise.all([
      apiRequest(`/map/event/${selectedEvent._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      apiRequest("/committee/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([locationsData, dashboardData]) => {
        setLocations(locationsData.locations);
        setCounts({
          missing: dashboardData.missingReports,
          found: dashboardData.foundReports,
          sos: dashboardData.sosRequests,
          matches: dashboardData.activeMatches,
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedEvent?._id, token]);

  const handleLocationClick = (location) => {
    const marker = markerRefs.current[location._id];
    if (marker) {
      const map = marker._map;
      map.flyTo([location.latitude, location.longitude], 17);
      marker.openPopup();
    }
  };

  if (loading) {
    return (
      <CommitteeLayout
        title="Event Map"
        description="View event infrastructure"
      >
        <div className="grid min-h-[500px] place-items-center">
          <LoaderCircle className="size-7 animate-spin text-brand-600" />
        </div>
      </CommitteeLayout>
    );
  }

  return (
    <CommitteeLayout title="Event Map" description="View event infrastructure">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-slate-500">
              Missing Reports
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {counts.missing}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-slate-500">
              Found Reports
            </p>
            <p className="text-2xl font-bold text-slate-900">{counts.found}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-slate-500">SOS Requests</p>
            <p className="text-2xl font-bold text-slate-900">{counts.sos}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-slate-500">
              Active Matches
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {counts.matches}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              <MapPin className="size-4 inline mr-2" />
              Locations
            </h3>
            <div className="space-y-2">
              {locations.map((loc) => (
                <button
                  key={loc._id}
                  onClick={() => handleLocationClick(loc)}
                  className="w-full text-left p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    {getIconForType(loc.type)} {loc.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {getTypeName(loc.type)}
                  </p>
                </button>
              ))}
              {locations.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">
                  No locations available
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="h-[600px] rounded-2xl overflow-hidden border border-slate-200">
            <MapContainer
              center={[27.7172, 85.324]} // Default to Kathmandu
              zoom={16}
              style={{ height: "100%", width: "100%" }}
            >
              <MapBoundsController locations={locations} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {locations.map((loc) => (
                <Marker
                  key={loc._id}
                  ref={(el) => (markerRefs.current[loc._id] = el)}
                  position={[loc.latitude, loc.longitude]}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold text-slate-900">
                        {getIconForType(loc.type)} {loc.name}
                      </p>
                      <p className="text-slate-600">{getTypeName(loc.type)}</p>
                      {loc.description && (
                        <p className="mt-2 text-slate-500">{loc.description}</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </CommitteeLayout>
  );
}

export default CommitteeMapPage;
