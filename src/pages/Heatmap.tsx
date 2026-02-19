import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, X, ShieldAlert, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const filters = ["All", "Salary Issues", "Abuse", "Overwork", "Gender-based"];

const Heatmap = () => {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState("All");
  const [selected, setSelected] = useState<any | null>(null);
  const [searchCity, setSearchCity] = useState("");
  const [mapPosition, setMapPosition] = useState<[number, number]>([
    28.6139,
    77.209,
  ]);
  const [hotspots, setHotspots] = useState<any[]>([]);

  const generateHotspots = (lat: number, lng: number) => {
    const newSpots = Array.from({ length: 5 }).map((_, i) => {
      const salary = Math.floor(Math.random() * 10);
      const abuse = Math.floor(Math.random() * 5);
      const overwork = Math.floor(Math.random() * 6);
      const gender = Math.floor(Math.random() * 4);

      return {
        id: i + 1,
        name: `Zone ${i + 1}`,
        lat: lat + (Math.random() - 0.5) * 0.05,
        lng: lng + (Math.random() - 0.5) * 0.05,
        complaints: salary + abuse + overwork + gender,
        salaryDelays: salary,
        abuse,
        overwork,
        gender,
        trendIncrease: Math.floor(Math.random() * 30),
      };
    });

    setHotspots(newSpots);
  };

  const handleSearch = async () => {
    if (!searchCity) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${searchCity}`
    );
    const data = await res.json();

    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      setMapPosition([lat, lon]);
      generateHotspots(lat, lon);
    }
  };

  const calculateRiskScore = (spot: any) => {
    const weighted =
      spot.salaryDelays * 2 +
      spot.abuse * 3 +
      spot.overwork * 1.5 +
      spot.gender * 2.5;

    return Math.min(Math.round((weighted / 40) * 100), 100);
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return "high";
    if (score >= 40) return "medium";
    return "low";
  };

  const filteredHotspots = useMemo(() => {
    if (activeFilter === "All") return hotspots;

    return hotspots.filter((spot) => {
      if (activeFilter === "Salary Issues") return spot.salaryDelays > 0;
      if (activeFilter === "Abuse") return spot.abuse > 0;
      if (activeFilter === "Overwork") return spot.overwork > 0;
      if (activeFilter === "Gender-based") return spot.gender > 0;
      return true;
    });
  }, [activeFilter, hotspots]);

  const riskColorMap: any = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#22c55e",
  };

  const ChangeMapView = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    map.flyTo(center, 12);
    return null;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <h1 className="font-heading text-lg font-bold">
          Smart Exploitation Heatmap
        </h1>
      </div>

      {/* 🔎 SEARCH BAR FIXED UI */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-white shadow-sm px-3 py-2">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search city (Delhi, Mumbai...)"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-black placeholder-gray-400"
          />
          <button
            onClick={handleSearch}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto px-4 py-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs ${
              activeFilter === f
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="mx-4 h-[500px] overflow-hidden rounded-xl border border-border">
        <MapContainer
          center={mapPosition}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
        >
          <ChangeMapView center={mapPosition} />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredHotspots.map((spot) => {
            const score = calculateRiskScore(spot);
            const risk = getRiskLevel(score);

            return (
              <CircleMarker
                key={spot.id}
                center={[spot.lat, spot.lng]}
                radius={10 + spot.complaints}
                pathOptions={{
                  color: riskColorMap[risk],
                  fillColor: riskColorMap[risk],
                  fillOpacity: 0.5,
                }}
                eventHandlers={{
                  click: () =>
                    setSelected({
                      ...spot,
                      score,
                      risk,
                    }),
                }}
              >
                <Popup>
                  <strong>{spot.name}</strong>
                  <br />
                  Complaints: {spot.complaints}
                  <br />
                  Risk Score: {score}%
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Detail Card */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="glass-card mx-4 mt-3 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-sm font-bold">
                  {selected.name}
                </h3>
                <span className="text-xs">
                  Risk Level:{" "}
                  <span style={{ color: riskColorMap[selected.risk] }}>
                    {selected.risk.toUpperCase()}
                  </span>
                </span>
              </div>
              <button onClick={() => setSelected(null)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {selected.trendIncrease > 20 && (
              <div className="mb-3 flex items-center gap-2 rounded-md bg-red-500/10 p-2 text-xs text-red-500">
                <ShieldAlert className="h-4 w-4" />
                Emerging Crisis: Reports increased by{" "}
                {selected.trendIncrease}%
              </div>
            )}

            <div className="grid grid-cols-4 gap-2 text-center">
              <StatBox label="Complaints" value={selected.complaints} />
              <StatBox label="Abuse" value={selected.abuse} />
              <StatBox label="Salary" value={selected.salaryDelays} />
              <StatBox label="Score" value={`${selected.score}%`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

const StatBox = ({ label, value }: any) => (
  <div className="rounded-lg bg-secondary/50 p-2">
    <p className="text-sm font-bold">{value}</p>
    <p className="text-[9px] text-muted-foreground">{label}</p>
  </div>
);

export default Heatmap;
