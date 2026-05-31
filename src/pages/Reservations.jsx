import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Users, ArrowLeft, ArrowRight, Loader2, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import MiniCalendar from "../components/reservation/MiniCalendar";
import TimeSlotPicker from "../components/reservation/TimeSlotPicker";
import ServiceCard from "../components/reservation/ServiceCard";
import { SERVICES, TIME_SLOTS, getAvailableSlots } from "../lib/reservationData";


const STEPS = ["Service", "Date & Time", "Details", "Confirm"];


export default function Reservations() {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    service: "",
    date: null,
    time_slot: "",
    party_size: 2,
    guest_name: "",
    email: "",
    phone: "",
    special_requests: ""
  });

  useEffect(() => {
    base44.entities.Reservation.list("-created_date", 200).then(setReservations).catch(() => {});
  }, []);

  const availableSlots = form.date ? getAvailableSlots(form.date, reservations) : TIME_SLOTS;

  const canNext = () => {
    if (step === 0) return !!form.service;
    if (step === 1) return !!form.date && !!form.time_slot;
    if (step === 2) return !!form.guest_name && !!form.email && form.party_size >= 1;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const dateStr = form.date.toISOString().split("T")[0];
    const data = {
      guest_name: form.guest_name,
      email: form.email,
      phone: form.phone,
      date: dateStr,
      time_slot: form.time_slot,
      service: form.service,
      party_size: form.party_size,
      special_requests: form.special_requests,
      status: "confirmed"
    };

    await base44.entities.Reservation.create(data);

    // Send confirmation email
    await base44.integrations.Core.SendEmail({
      to: form.email,
      from_name: "Qosqorico",
      subject: `Reservation Confirmed – ${form.service} on ${dateStr}`,
      body: `Dear ${form.guest_name},\n\nYour reservation at Qosqorico has been confirmed!\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\nExperience: ${form.service}\nDate: ${dateStr}\nTime: ${form.time_slot}\nParty size: ${form.party_size} guest${form.party_size > 1 ? "s" : ""}\n${form.special_requests ? `Notes: ${form.special_requests}` : ""}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nWe look forward to welcoming you. If you need to modify or cancel your reservation, please contact us at reservations@qosqorico.com at least 24 hours in advance.\n\nCon cariño,\nThe Qosqorico Team`
    });

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Reservation Confirmed</h2>
          <p className="text-muted-foreground mb-2">
            We've sent a confirmation to <span className="text-foreground font-medium">{form.email}</span>.
          </p>
          <p className="text-muted-foreground mb-8 text-sm">
            {form.service} · {form.date?.toISOString().split("T")[0]} · {form.time_slot} · {form.party_size} guest{form.party_size > 1 ? "s" : ""}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
            <Button onClick={() => {
              setSubmitted(false);
              setStep(0);
              setForm({ service: "", date: null, time_slot: "", party_size: 2, guest_name: "", email: "", phone: "", special_requests: "" });
            }}>
              New Reservation
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground text-sm">Qosqorico</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Title */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Reserve a Table</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Book Your Experience</h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">
            Every seat is a story. Reserve yours at Qosqorico.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 ${i <= step ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step ? "bg-primary text-primary-foreground" :
                  i === step ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 rounded-full transition-all ${i < step ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 0: Service */}
            {step === 0 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Choose Your Experience</h2>
                <p className="text-sm text-muted-foreground mb-6">Select the type of dining experience you'd like.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICES.map(s => (
                    <ServiceCard
                      key={s.id}
                      service={s}
                      selected={form.service === s.id}
                      onSelect={(id) => setForm(f => ({ ...f, service: id }))}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Date & Time */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">Select a Date</h2>
                  <p className="text-sm text-muted-foreground mb-4">Choose from available dates below.</p>
                  <MiniCalendar
                    selected={form.date}
                    onSelect={(d) => setForm(f => ({ ...f, date: d, time_slot: "" }))}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">Select a Time</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {form.date
                      ? `Available slots for ${form.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`
                      : "Please select a date first"}
                  </p>
                  {form.date && (
                    <TimeSlotPicker
                      slots={availableSlots}
                      allSlots={TIME_SLOTS}
                      selected={form.time_slot}
                      onSelect={(t) => setForm(f => ({ ...f, time_slot: t }))}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Your Details</h2>
                <p className="text-sm text-muted-foreground mb-6">We'll send your confirmation here.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1.5">Full Name *</label>
                    <Input
                      value={form.guest_name}
                      onChange={e => setForm(f => ({ ...f, guest_name: e.target.value }))}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1.5">Email *</label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1.5">Phone</label>
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1.5">Party Size *</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setForm(f => ({ ...f, party_size: Math.max(1, f.party_size - 1) }))}
                        className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/70 flex items-center justify-center text-lg font-bold transition-colors"
                      >–</button>
                      <div className="flex items-center gap-1.5 min-w-[60px] justify-center">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="font-bold text-foreground text-lg">{form.party_size}</span>
                      </div>
                      <button
                        onClick={() => setForm(f => ({ ...f, party_size: Math.min(20, f.party_size + 1) }))}
                        className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/70 flex items-center justify-center text-lg font-bold transition-colors"
                      >+</button>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1.5">Special Requests</label>
                    <Textarea
                      value={form.special_requests}
                      onChange={e => setForm(f => ({ ...f, special_requests: e.target.value }))}
                      placeholder="Allergies, dietary restrictions, celebrations, seating preferences..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Review Your Booking</h2>
                <p className="text-sm text-muted-foreground mb-6">Please review and confirm your reservation.</p>
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="bg-primary/5 border-b border-border px-6 py-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-accent">Reservation Summary</p>
                  </div>
                  <div className="p-6 space-y-4">
                    {[
                      { label: "Experience", value: form.service },
                      { label: "Date", value: form.date?.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
                      { label: "Time", value: form.time_slot },
                      { label: "Party Size", value: `${form.party_size} guest${form.party_size > 1 ? "s" : ""}` },
                      { label: "Name", value: form.guest_name },
                      { label: "Email", value: form.email },
                      form.phone && { label: "Phone", value: form.phone },
                      form.special_requests && { label: "Notes", value: form.special_requests }
                    ].filter(Boolean).map(({ label, value }) => (
                      <div key={label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground w-24 flex-shrink-0">{label}</span>
                        <span className="text-foreground text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  A confirmation email will be sent to {form.email}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className="gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading || !canNext()}
              className="gap-2 min-w-[160px]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {loading ? "Confirming..." : "Confirm Reservation"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
