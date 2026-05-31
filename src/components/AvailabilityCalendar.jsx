import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, CheckCircle2 } from
"lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useLang } from "../lib/LangContext";


const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00",
"16:00", "17:00", "18:00", "19:00"];
const MONTHS =
["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembr e","Octubre","Noviembre","Diciembre"];
const MONTHS_EN =
["January","February","March","April","May","June","July","August","September ","October","November","December"];
const DAYS_ES = ["Lu","Ma","Mi","Ju","Vi","Sa","Do"];
const DAYS_EN = ["Mo","Tu","We","Th","Fr","Sa","Su"];


function seededNum(str, min, max) {
 let h = 0;
 for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) %
9973;
 return min + (h % (max - min));
}


// Some slots are "taken" based on seed
function isSlotTaken(providerId, dateStr, slot) {
 return seededNum(providerId + dateStr + slot, 0, 5) === 0;
}


export default function AvailabilityCalendar({ provider, onBooked }) {
 const { lang } = useLang();
 const lbl = (es, en) => lang === "es" ? es : en;

const today = new Date();
const [year, setYear] = useState(today.getFullYear());
const [month, setMonth] = useState(today.getMonth());
const [selectedDate, setSelectedDate] = useState(null);
const [selectedSlot, setSelectedSlot] = useState(null);
const [guestName, setGuestName] = useState("");
const [guestEmail, setGuestEmail] = useState("");
const [selectedService, setSelectedService] =
useState(provider.services?.[0]?.name || "");
const [step, setStep] = useState("calendar"); // calendar | confirm |
success
const [loading, setLoading] = useState(false);


const firstDay = new Date(year, month, 1).getDay(); // 0=Sunday
const daysInMonth = new Date(year, month + 1, 0).getDate();
// shift so week starts Monday
const startOffset = (firstDay + 6) % 7;


function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDate(null); setSelectedSlot(null);
}
function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDate(null); setSelectedSlot(null);
}


function isPast(day) {
    const d = new Date(year, month, day);
    d.setHours(0,0,0,0);
    const t = new Date(); t.setHours(0,0,0,0);
    return d < t;
}


const dateStr = selectedDate ?
`${year}-${String(month+1).padStart(2,'0')}-${String(selectedDate).padStart(2
,'0')}` : "";

async function handlePreBook() {
    setLoading(true);
    await base44.entities.Reservation.create({
     guest_name: guestName,
     email: guestEmail,
     date: dateStr,
     time_slot: selectedSlot,
     service: selectedService,
     party_size: 1,
     special_requests: `Prestataire: ${provider.full_name}`,
     status: "pending",
    });
    setLoading(false);
    setStep("success");
    onBooked?.();
}


if (step === "success") return (
    <div className="flex flex-col items-center py-8 text-center">
     <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
          <CheckCircle2 className="h-7 w-7 text-green-500" />
     </div>
     <h3 className="font-bold text-foreground text-base mb-1">{lbl("¡Pré-réservation confirmée!", "Pre-booking confirmed!")}</h3>
     <p className="text-sm text-muted-foreground">{dateStr} ·
{selectedSlot}</p>
     <p className="text-xs text-muted-foreground mt-1">{lbl("El prestatario confirmará pronto.", "The provider will confirm shortly.")}</p>
     <Button className="mt-5 bg-primary text-primary-foreground" size="sm"
onClick={() => { setStep("calendar"); setSelectedDate(null);
setSelectedSlot(null); }}>
          {lbl("Nueva reserva", "New booking")}
     </Button>
    </div>
);


return (
    <div>
     {step === "calendar" && (
          <>

        {/* Month nav */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-muted transition-colors"><ChevronLeft className="h-4 w-4"
/></button>
          <span className="text-sm font-semibold text-foreground">
              {lbl(MONTHS[month], MONTHS_EN[month])} {year}
          </span>
          <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-muted transition-colors"><ChevronRight className="h-4 w-4"
/></button>
        </div>


        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {(lang === "es" ? DAYS_ES : DAYS_EN).map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1">{d}</div>
          ))}
        </div>


        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-0.5 mb-4">
          {Array.from({ length: startOffset }).map((_, i) => <div
key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const past = isPast(day);
              const sel = selectedDate === day;
              return (
                <button
                 key={day}
                 disabled={past}
                 onClick={() => { setSelectedDate(day);
setSelectedSlot(null); }}
                 className={`aspect-square rounded-lg text-xs font-medium
transition-all flex items-center justify-center
                    ${past ? "text-muted-foreground/30 cursor-not-allowed" :
""}
                    ${sel ? "bg-primary text-primary-foreground shadow" :
!past ? "hover:bg-muted text-foreground" : ""}
                 `}

                >
                    {day}
                </button>
            );
          })}
        </div>


        {/* Time slots */}
        {selectedDate && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {lbl("Horarios disponibles",
"Available slots")}
            </p>
            <div className="grid grid-cols-5 gap-1.5 mb-4">
                {TIME_SLOTS.map(slot => {
                    const taken = isSlotTaken(provider.id, dateStr, slot);
                    const sel = selectedSlot === slot;
                    return (
                      <button
                          key={slot}
                          disabled={taken}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-1.5 rounded-lg text-[11px] font-medium
transition-all border
                            ${taken ? "opacity-30 cursor-not-allowed border-border text-muted-foreground" : ""}
                            ${sel ? "bg-primary text-primary-foreground border-primary" : !taken ? "border-border hover:border-primary/60 text-foreground" : ""}
                          `}
                      >
                          {slot}
                      </button>
                    );
                })}
            </div>
            <Button
                disabled={!selectedSlot}
                onClick={() => setStep("confirm")}

                    className="w-full bg-primary text-primary-foreground"
                    size="sm"
                >
                    {lbl("Continuar con", "Continue with")} {selectedSlot}
                </Button>
            </div>
         )}
      </>
    )}


    {step === "confirm" && (
      <div className="space-y-3">
         <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            {lbl("Confirmar pré-réservation", "Confirm pre-booking")} ·
{dateStr} · {selectedSlot}
         </p>
         <input
            required value={guestName} onChange={e =>
setGuestName(e.target.value)}
            placeholder={lbl("Tu nombre completo", "Your full name")}
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
         />
         <input
            required type="email" value={guestEmail} onChange={e =>
setGuestEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
         />
         {provider.services?.length > 0 && (
            <select
                value={selectedService} onChange={e =>
setSelectedService(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
                {provider.services.map((s, i) => (
                    <option key={i} value={s.name}>{s.name} — ${s.price}
{s.currency}</option>

                 ))}
             </select>
           )}
           <div className="flex gap-2 pt-1">
             <Button variant="outline" size="sm" onClick={() =>
setStep("calendar")} className="flex-1">
                 {lbl("Atrás", "Back")}
             </Button>
             <Button
                 size="sm"
                 disabled={loading || !guestName || !guestEmail}
                 onClick={handlePreBook}
                 className="flex-1 bg-primary text-primary-foreground"
             >
                 {loading
                   ? <span className="flex items-center gap-1"><div
className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{lbl("Enviando...", "Sending...")}</span>
                   : lbl("Pré-réserver", "Pre-book")}
             </Button>
           </div>
       </div>
      )}
    </div>
 );
}
