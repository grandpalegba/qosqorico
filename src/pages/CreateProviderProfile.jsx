import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Upload, Camera, DollarSign, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateProvider } from "@/hooks/useProviders";
import { useAuth } from "@/lib/AuthContext";
import { SUYUS } from "@/lib/data";
import { useLang } from "@/lib/LangContext";
import Header from "@/components/Header";

const STEPS = [
  { id: 1, label: "Thématique", labelEn: "Theme" },
  { id: 2, label: "Présentation", labelEn: "Profile" },
  { id: 3, label: "Tarifs", labelEn: "Pricing" },
  { id: 4, label: "Aperçu", labelEn: "Preview" },
];

const LANGUAGES_OPTIONS = ["Español", "English", "Français", "Quechua", "Português", "Deutsch"];

export default function CreateProviderProfile() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { mutateAsync: createProvider, isPending } = useCreateProvider();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    suyu_id: "",
    series_name: "",
    display_name: user?.user_metadata?.full_name || user?.email?.split("@")[0] || "",
    tagline: "",
    bio: "",
    poster_url: "",
    location: "Cusco, Perú",
    price_per_session: 40,
    duration_minutes: 60,
    languages: ["Español"],
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const selectedSuyu = SUYUS.find(s => s.id === form.suyu_id);
  const availableSeries = selectedSuyu?.series.filter(s => !s.is_demo) || [];

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const toggleLang = (l) => {
    setForm(prev => ({
      ...prev,
      languages: prev.languages.includes(l)
        ? prev.languages.filter(x => x !== l)
        : [...prev.languages, l],
    }));
  };

  const canNext = () => {
    if (step === 1) return !!form.suyu_id && !!form.series_name;
    if (step === 2) return !!form.display_name.trim() && !!form.tagline.trim() && !!form.bio.trim();
    if (step === 3) return form.price_per_session > 0 && form.duration_minutes > 0 && form.languages.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      const provider = await createProvider({
        suyu_id: form.suyu_id,
        series_name: form.series_name,
        display_name: form.display_name.trim(),
        tagline: form.tagline.trim(),
        bio: form.bio.trim(),
        poster_url: form.poster_url.trim() || null,
        location: form.location.trim(),
        price_per_session: Number(form.price_per_session),
        duration_minutes: Number(form.duration_minutes),
        languages: form.languages,
        is_active: true,
        is_demo: false,
      });
      setSuccess(true);
      setTimeout(() => navigate(`/provider/${provider.id}`), 2000);
    } catch (err) {
      setError(err.message || "Une erreur s'est produite.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16 max-w-2xl mx-auto px-4">

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10 pt-4">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                step > s.id ? "bg-primary text-primary-foreground" :
                step === s.id ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                "bg-muted text-muted-foreground"
              }`}>
                {step > s.id ? <Check className="h-4 w-4" /> : s.id}
              </div>
              <span className={`text-xs hidden sm:block font-medium transition-colors ${step === s.id ? "text-foreground" : "text-muted-foreground"}`}>
                {lang === "es" ? s.label : s.labelEn}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`w-6 h-px mx-1 ${step > s.id ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Choose theme ───────────────────────────────────── */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {lang === "es" ? "¿Cuál es tu temática?" : "What's your theme?"}
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {lang === "es"
                ? "Elige el Suyu y la serie que mejor representa tu experiencia."
                : "Choose the Suyu and series that best represents your experience."}
            </p>

            {/* Suyu selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {SUYUS.filter(s => s.id !== "demo").map(suyu => (
                <button
                  key={suyu.id}
                  onClick={() => { update("suyu_id", suyu.id); update("series_name", ""); }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    form.suyu_id === suyu.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: suyu.color }} />
                  <p className="font-bold text-sm text-foreground">{suyu.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{suyu.subtitle}</p>
                </button>
              ))}
            </div>

            {/* Series selection */}
            {selectedSuyu && (
              <div className="animate-in fade-in duration-200">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  {lang === "es" ? "Elige tu serie" : "Choose your series"}
                </p>
                <div className="space-y-2">
                  {availableSeries.map(series => (
                    <button
                      key={series.name}
                      onClick={() => update("series_name", series.name)}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        form.series_name === series.name
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <p className="font-semibold text-sm text-foreground">{series.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{series.synopsis}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Profile info ──────────────────────────────────── */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {lang === "es" ? "Tu presentación" : "Your profile"}
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {lang === "es"
                ? "Cuéntanos quién eres. Esta información será visible para todos."
                : "Tell us who you are. This will be visible to everyone."}
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                  {lang === "es" ? "Nombre visible" : "Display name"} *
                </label>
                <input
                  type="text"
                  value={form.display_name}
                  onChange={e => update("display_name", e.target.value)}
                  placeholder="María Mamani"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                  {lang === "es" ? "Tagline (una frase)" : "Tagline (one sentence)"} *
                </label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={e => update("tagline", e.target.value)}
                  placeholder={lang === "es" ? "Guardiana del hilo ancestral en Chinchero" : "Guardian of ancestral weaving in Chinchero"}
                  maxLength={80}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">{form.tagline.length}/80</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                  Bio *
                </label>
                <textarea
                  value={form.bio}
                  onChange={e => update("bio", e.target.value)}
                  rows={5}
                  placeholder={lang === "es" ? "Cuéntanos tu historia, tu pasión y lo que haces único..." : "Tell us your story, your passion and what makes you unique..."}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                  {lang === "es" ? "URL de tu foto" : "Photo URL"}
                </label>
                <input
                  type="url"
                  value={form.poster_url}
                  onChange={e => update("poster_url", e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {form.poster_url && (
                  <img src={form.poster_url} alt="Preview" className="mt-2 w-16 h-16 rounded-full object-cover border border-border" onError={e => e.target.style.display='none'} />
                )}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                  {lang === "es" ? "Ubicación" : "Location"}
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => update("location", e.target.value)}
                  placeholder="Cusco, Perú"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Pricing & languages ──────────────────────────── */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {lang === "es" ? "Tarifs et langues" : "Pricing & languages"}
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {lang === "es"
                ? "Define el precio y duración de tus sesiones."
                : "Set your session price and duration."}
            </p>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> {lang === "es" ? "Precio (USD)" : "Price (USD)"} *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.price_per_session}
                    onChange={e => update("price_per_session", e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {lang === "es" ? "Duración (min)" : "Duration (min)"} *
                  </label>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={form.duration_minutes}
                    onChange={e => update("duration_minutes", e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
                  <Globe className="h-3 w-3" /> {lang === "es" ? "Idiomas" : "Languages"} *
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES_OPTIONS.map(l => (
                    <button
                      key={l}
                      onClick={() => toggleLang(l)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        form.languages.includes(l)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Preview & submit ──────────────────────────────── */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {lang === "es" ? "Vista previa" : "Preview"}
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {lang === "es"
                ? "Así verán tu perfil los exploradores."
                : "This is how explorers will see your profile."}
            </p>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-md">
              {form.poster_url && (
                <img src={form.poster_url} alt={form.display_name} className="w-full h-48 object-cover" onError={e => e.target.style.display='none'} />
              )}
              <div className="p-5">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white mb-3" style={{ backgroundColor: SUYUS.find(s => s.id === form.suyu_id)?.color || "#6D28D9" }}>
                  {form.series_name}
                </div>
                <h3 className="text-xl font-bold text-foreground">{form.display_name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{form.tagline}</p>
                <p className="text-sm text-foreground mt-3 leading-relaxed line-clamp-3">{form.bio}</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>${form.price_per_session} USD</span>
                  <span>·</span>
                  <span>{form.duration_minutes} min</span>
                  <span>·</span>
                  <span>{form.location}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {form.languages.map(l => (
                    <span key={l} className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">{l}</span>
                  ))}
                </div>
              </div>
            </div>

            {success && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                <p className="text-sm font-bold text-green-800">🎉 {lang === "es" ? "¡Perfil publicado!" : "Profile published!"}</p>
                <p className="text-xs text-green-700 mt-1">{lang === "es" ? "Redirigiendo..." : "Redirecting..."}</p>
              </div>
            )}
            {error && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {step === 1 ? (lang === "es" ? "Cancelar" : "Cancel") : (lang === "es" ? "Anterior" : "Back")}
          </Button>

          {step < 4 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              {lang === "es" ? "Siguiente" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isPending || success}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <Check className="h-4 w-4" />
              {isPending
                ? (lang === "es" ? "Publicando..." : "Publishing...")
                : (lang === "es" ? "Publicar mi perfil" : "Publish my profile")}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
