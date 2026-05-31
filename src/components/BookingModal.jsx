import { useState } from "react";
import { X, Calendar, CheckCircle2, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "../lib/LangContext";
import { base44 } from "@/api/base44Client";


const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00",
"16:00", "17:00", "18:00", "19:00", "20:00"];


export default function BookingModal({ provider, open, onClose }) {
 const { lang } = useLang();
 const [step, setStep] = useState("form"); // form | success

const [loading, setLoading] = useState(false);
const [form, setForm] = useState({
  name: "",
  email: "",
  date: "",
  time_slot: "",
  group_size: 1,
  service: "",
  notes: ""
});


if (!open) return null;


const services = provider?.services || [];
const label = (es, en) => lang === "es" ? es : en;
const today = new Date().toISOString().split("T")[0];


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  await base44.entities.Reservation.create({
      guest_name: form.name,
      email: form.email,
      date: form.date,
      time_slot: form.time_slot,
      service: form.service || (services[0]?.name || "Session"),
      party_size: form.group_size,
      special_requests: form.notes,
      status: "confirmed"
  });
  // Send confirmation email
  await base44.integrations.Core.SendEmail({
      to: form.email,
      from_name: "Qosqorico",
      subject: label(
        `Reserva confirmada con ${provider?.full_name}`,
        `Booking confirmed with ${provider?.full_name}`
      ),
      body: label(
        `Hola ${form.name},\n\nTu reserva con ${provider?.full_name} ha sido
confirmada.\n\nServicio: ${form.service}\nFecha: ${form.date}\nHora:

${form.time_slot}\nPersonas: ${form.group_size}\n${form.notes ? `Notas:
${form.notes}` : ""}\n\nHasta pronto,\nEl equipo de Qosqorico`,
         `Hi ${form.name},\n\nYour booking with ${provider?.full_name} is
confirmed.\n\nService: ${form.service}\nDate: ${form.date}\nTime:
${form.time_slot}\nGroup size: ${form.group_size}\n${form.notes ? `Notes:
${form.notes}` : ""}\n\nSee you soon,\nThe Qosqorico Team`
     )
  });
  setLoading(false);
  setStep("success");
};


const handleClose = () => {
  setStep("form");
  setForm({ name: "", email: "", date: "", time_slot: "", group_size: 1,
service: "", notes: "" });
  onClose();
};


return (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleClose}>
     <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
     <div
         className="relative w-full max-w-md bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto"
         onClick={(e) => e.stopPropagation()}
         style={{ animation: "slideUp 0.3s ease" }}
     >
         {/* Header */}
         <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div>
            <h2 className="font-bold text-foreground text-base">
              {label("Reservar Sesión", "Book a Session")}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">{provider?.full_name}</p>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-muted transition-colors">

          <X className="h-5 w-5 text-muted-foreground" />
        </button>
       </div>


       <div className="p-5">
        {step === "success" ? (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-1">
                {label("¡Reserva confirmada!", "Booking confirmed!")}
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
                {label(
                 `${provider?.name} recibirá tu solicitud pronto.`,
                 `${provider?.name} will be in touch shortly.`
                )}
            </p>
            <p className="text-xs text-muted-foreground">
                {form.date} · {form.time_slot} · {form.group_size}
{label("persona(s)", "person(s)")}
            </p>
            <Button className="mt-6" onClick={handleClose}>
                {label("Cerrar", "Close")}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
                 {label("Nombre completo", "Full name")} *
                </label>
                <input
                 required
                 value={form.name}
                 onChange={(e) => setForm(f => ({ ...f, name: e.target.value
}))}

                   className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                   placeholder={label("Tu nombre", "Your name")}
              />
            </div>


            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">Email *</label>
              <input
                   required
                   type="email"
                   value={form.email}
                   onChange={(e) => setForm(f => ({ ...f, email: e.target.value
}))}
                   className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                   placeholder="you@example.com"
              />
            </div>


            {/* Service */}
            {services.length > 0 && (
              <div>
                   <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
                       {label("Servicio", "Service")} *
                   </label>
                   <select
                       required
                       value={form.service}
                       onChange={(e) => setForm(f => ({ ...f, service:
e.target.value }))}
                       className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                   >

                     <option value="">{label("Selecciona un servicio", "Select a service")}</option>
                     {services.map((s, i) => (
                      <option key={i} value={s.name}>{s.name} — ${s.price}
{s.currency}</option>
                     ))}
                   </select>
              </div>
            )}


            {/* Date */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
                   <Calendar className="inline h-3 w-3 mr-1" />
                   {label("Fecha", "Date")} *
              </label>
              <input
                   required
                   type="date"
                   value={form.date}
                   onChange={(e) => setForm(f => ({ ...f, date: e.target.value,
time_slot: "" }))}
                   className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                   min={today}
              />
            </div>


            {/* Time slots */}
            {form.date && (
              <div>
                   <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                     <Clock className="inline h-3 w-3 mr-1" />
                     {label("Horario", "Time slot")} *
                   </label>
                   <div className="grid grid-cols-4 gap-1.5">
                     {TIME_SLOTS.map(slot => (
                      <button

                          key={slot}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, time_slot: slot
}))}
                          className={`py-2 px-1 rounded-lg text-xs font-medium
transition-all border ${
                           form.time_slot === slot
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-background border-border text-foreground hover:border-primary/60"
                          }`}
                     >
                          {slot}
                     </button>
                    ))}
                 </div>
              </div>
            )}


            {/* Group size */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                 <Users className="inline h-3 w-3 mr-1" />
                 {label("Número de personas", "Group size")}
              </label>
              <div className="flex items-center gap-3">
                 <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, group_size:
Math.max(1, f.group_size - 1) }))}
                    className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/70 flex items-center justify-center text-lg font-bold transition-colors"
                 >–</button>
                 <span className="font-bold text-foreground text-lg w-8 text-center">{form.group_size}</span>
                 <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, group_size:
Math.min(30, f.group_size + 1) }))}

                      className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/70 flex items-center justify-center text-lg font-bold transition-colors"
                  >+</button>
                  {form.group_size >= 8 && (
                      <span className="text-xs text-accent font-medium ml-1">
                       {label("Grupo — contacto especial", "Group — special contact")}
                      </span>
                  )}
                 </div>
             </div>


             {/* Notes */}
             <div>
                 <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
                  {label("Notas (opcional)", "Notes (optional)")}
                 </label>
                 <textarea
                  value={form.notes}
                  onChange={(e) => setForm(f => ({ ...f, notes: e.target.value
}))}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder={label("Peticiones especiales, necesidades del grupo...", "Special requests, group needs...")}
                 />
             </div>


             <Button
                 type="submit"
                 disabled={loading || !form.time_slot}
                 className="w-full h-11 font-semibold bg-primary text-primary-foreground"
             >
                 {loading ? (
                  <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                           {label("Confirmando...", "Confirming...")}
                        </span>
                      ) : (
                        <>
                           <Calendar className="h-4 w-4 mr-2" />
                           {label("Confirmar Reserva", "Confirm Booking")}
                        </>
                      )}
                     </Button>
                </form>
             )}
          </div>
       </div>
       <style>{`@keyframes slideUp { from { transform: translateY(40px);
opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
     </div>
 );
}
