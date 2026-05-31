import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import Header from "../components/Header";
import { useLang } from "../lib/LangContext";
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";


const STATUS_CONFIG = {
  pending: {
    icon: <AlertCircle className="h-4 w-4" />,
    color: "text-amber-500",
    bg: "bg-amber-50 border-amber-200",
    labelEs: "Pendiente",
    labelEn: "Pending"
  },
  confirmed: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "text-green-500",
    bg: "bg-green-50 border-green-200",
    labelEs: "Confirmada",
    labelEn: "Confirmed"
  },
  cancelled: {
    icon: <XCircle className="h-4 w-4" />,
    color: "text-destructive",
    bg: "bg-red-50 border-red-200",
    labelEs: "Cancelada",
    labelEn: "Cancelled"
  },
};


export default function MyReservations() {
  const { lang } = useLang();
  const lbl = (es, en) => lang === "es" ? es : en;
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const all = await base44.entities.Reservation.list("-created_date", 50);
    setReservations(all);
    setLoading(false);
  }

  async function cancelReservation(id) {
    await base44.entities.Reservation.update(id, { status: "cancelled" });
    await load();
  }

  const filtered = filter === "all" ? reservations : reservations.filter(r => r.status === filter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12 max-w-screen-md mx-auto px-4">
        <h1 className="text-2xl font-bold text-foreground mb-1 mt-6">{lbl("Mis Reservas", "My Reservations")}</h1>
        <p className="text-sm text-muted-foreground mb-6">{lbl("Gestiona el seguimiento de tus pre-reservas y reservas.", "Manage and track your pre-bookings and reservations.")}</p>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 w-fit mb-6">
          {["all", "pending", "confirmed", "cancelled"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {f === "all" ? lbl("Todas", "All")
                : f === "pending" ? lbl("Pendientes", "Pending")
                : f === "confirmed" ? lbl("Confirmadas", "Confirmed")
                : lbl("Canceladas", "Cancelled")}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{lbl("No hay reservas para mostrar.", "No reservations to show.")}</p>
            <Link to="/">
              <Button size="sm" className="mt-4 bg-primary text-primary-foreground">
                {lbl("Explorar prestatarios", "Explore providers")}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(r => {
              const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending;
              return (
                <div key={r.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{r.service}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{r.guest_name} · {r.email}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                      {cfg.icon}
                      {lbl(cfg.labelEs, cfg.labelEn)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{r.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{r.time_slot}</span>
                    {r.party_size && <span>{r.party_size} {lbl("pers.", "pax")}</span>}
                  </div>
                  {r.special_requests && (
                    <p className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2 mb-3 leading-relaxed">{r.special_requests}</p>
                  )}
                  {r.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cancelReservation(r.id)}
                      className="text-destructive border-destructive/30 hover:bg-destructive/5"
                    >
                      {lbl("Cancelar reserva", "Cancel reservation")}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
