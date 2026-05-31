import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Smartphone, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "../components/Header";
import { useLang, T } from "../lib/LangContext";


export default function Payment() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = T[lang];

  const params = new URLSearchParams(window.location.search);
  const serviceName = params.get("service") || "Servicio";
  const price = params.get("price") || "0";
  const currency = params.get("currency") || "USD";
  const providerName = params.get("provider") || "";

  const [method, setMethod] = useState("card");
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ cardNumber: "", cardName: "", expiry: "", cvv: "", phone: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">
            {lang === "es" ? "¡Reserva confirmada!" : "Booking confirmed!"}
          </h2>
          <p className="text-sm text-muted-foreground mb-2">{serviceName}</p>
          {providerName && <p className="text-xs text-muted-foreground">{lang === "es" ? "con" : "with"} {providerName}</p>}
          <p className="text-2xl font-bold text-primary mt-4">${price} {currency}</p>
          <Button
            className="w-full mt-6 bg-primary text-primary-foreground"
            onClick={() => navigate(-2)}
          >
            {lang === "es" ? "Volver al perfil" : "Back to profile"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-14 pb-12">
        <div className="max-w-lg mx-auto px-4 py-8">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> {t.back}
          </button>

          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-4 w-4 text-primary" />
            <h1 className="text-xl font-bold text-foreground">{t.payment}</h1>
          </div>

          {/* Order summary */}
          <div className="bg-card rounded-2xl border border-border p-4 mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-3">{t.totalToPay}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground text-sm">{serviceName}</p>
                {providerName && <p className="text-xs text-muted-foreground mt-0.5">{lang === "es" ? "con" : "with"} {providerName}</p>}
              </div>
              <p className="text-2xl font-bold text-primary">${price} <span className="text-sm font-normal text-muted-foreground">{currency}</span></p>
            </div>
          </div>

          {/* Method selector */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setMethod("card")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${method === "card" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-foreground/30"}`}
            >
              <CreditCard className="h-4 w-4" /> {t.payCard}
            </button>
            <button
              onClick={() => setMethod("yape")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${method === "yape" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-foreground/30"}`}
            >
              <Smartphone className="h-4 w-4" /> {t.payYape}
            </button>
          </div>

          {/* Card form */}
          {method === "card" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{t.cardNumber}</label>
                <input
                  type="text"
                  maxLength={19}
                  placeholder="0000 0000 0000 0000"
                  value={form.cardNumber}
                  onChange={(e) => setForm({ ...form, cardNumber: e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim() })}
                  className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{t.cardName}</label>
                <input
                  type="text"
                  placeholder="NOMBRE APELLIDO"
                  value={form.cardName}
                  onChange={(e) => setForm({ ...form, cardName: e.target.value })}
                  className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring uppercase"
                  required
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{t.expiry}</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    maxLength={5}
                    value={form.expiry}
                    onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                    className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{t.cvv}</label>
                  <input
                    type="text"
                    placeholder="000"
                    maxLength={4}
                    value={form.cvv}
                    onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                    className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-12 text-base mt-2">
                {t.confirmPay} — ${price} {currency}
              </Button>
            </form>
          )}

          {/* Yape form */}
          {method === "yape" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-card border border-border rounded-2xl p-5 text-center">
                <div className="w-16 h-16 bg-[#6C1EB7] rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <p className="font-bold text-foreground text-lg">Yape</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {lang === "es" ? "Pago instantáneo y seguro" : "Instant and secure payment"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{t.yapePhone}</label>
                <input
                  type="tel"
                  placeholder="+51 999 999 999"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <Button type="submit" className="w-full font-semibold h-12 text-base mt-2" style={{ backgroundColor: "#6C1EB7", color: "white" }}>
                {t.yapeConfirm} — ${price} {currency}
              </Button>
            </form>
          )}

          <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
            <Lock className="h-3 w-3" />
            {lang === "es" ? "Pago 100% seguro y encriptado" : "100% secure and encrypted payment"}
          </p>
        </div>
      </main>
    </div>
  );
}
