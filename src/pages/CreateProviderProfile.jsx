import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Check, Upload, Youtube, DollarSign,
  Clock, Globe, Play, X, Film, Briefcase, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateProvider } from "@/hooks/useProviders";
import { useAuth } from "@/lib/AuthContext";
import { SUYUS } from "@/lib/data";
import { SERVICE_CATEGORIES } from "@/lib/serviceCategories";
import { useLang } from "@/lib/LangContext";
import Header from "@/components/Header";

const LANGUAGES_OPTIONS = ["Español", "English", "Français", "Quechua", "Português", "Deutsch"];
const MAX_FILE_SIZE_MB = 500;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Extract YouTube video ID for embed preview
function getYoutubeId(url) {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

// ─── Mode selector ─────────────────────────────────────────────────────────
function ModeSelector({ onSelect, lang }) {
  const lbl = (es, en) => lang === "es" ? es : en;
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          Qosqorico
        </div>
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          {lbl("¿Qué quieres hacer?", "What do you want to do?")}
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {lbl(
            "Elige cómo deseas participar en la plataforma. Puedes hacer ambas cosas.",
            "Choose how you want to participate. You can do both."
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Participate in a series */}
        <button
          onClick={() => onSelect("participate")}
          className="group relative p-6 rounded-3xl border-2 border-border bg-card text-left hover:border-violet-500 hover:shadow-lg transition-all duration-200 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/0 to-violet-100/0 group-hover:from-violet-50 group-hover:to-indigo-50/60 dark:group-hover:from-violet-950/20 dark:group-hover:to-background transition-all duration-300" />
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Film className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-extrabold text-foreground mb-2">
              {lbl("Participar en una serie", "Participate in a series")}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {lbl(
                "Comparte tu historia a través de una videoentrevista. Sube tu video o añade un enlace de YouTube.",
                "Share your story through a video interview. Upload your video or add a YouTube link."
              )}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400">
              {lbl("Contar mi historia", "Tell my story")}
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </button>

        {/* Offer a service */}
        <button
          onClick={() => onSelect("service")}
          className="group relative p-6 rounded-3xl border-2 border-border bg-card text-left hover:border-emerald-500 hover:shadow-lg transition-all duration-200 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-teal-100/0 group-hover:from-emerald-50 group-hover:to-teal-50/60 dark:group-hover:from-emerald-950/20 dark:group-hover:to-background transition-all duration-300" />
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Briefcase className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-extrabold text-foreground mb-2">
              {lbl("Ofrecer un servicio", "Offer a service")}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {lbl(
                "Monetiza tus conocimientos. Escoge una categoría y publica tu oferta en la plataforma.",
                "Monetize your knowledge. Choose a category and publish your offer on the platform."
              )}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {lbl("Publicar un servicio", "Publish a service")}
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── FLOW A: Participate in a Series ───────────────────────────────────────
const PARTICIPATE_STEPS = [
  { id: 1, es: "Temática", en: "Theme" },
  { id: 2, es: "Presentación", en: "Profile" },
  { id: 3, es: "Tu video", en: "Your video" },
  { id: 4, es: "Vista previa", en: "Preview" },
];

function ParticipateFlow({ lang, user, onBack }) {
  const navigate = useNavigate();
  const { mutateAsync: createProvider, isPending } = useCreateProvider();
  const lbl = (es, en) => lang === "es" ? es : en;
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    suyu_id: "",
    series_name: "",
    display_name: user?.user_metadata?.display_name || user?.email?.split("@")[0] || "",
    tagline: "",
    bio: "",
    poster_url: "",
    location: "Cusco, Perú",
    price_per_session: 0,
    duration_minutes: 60,
    languages: ["Español"],
    // video fields
    video_type: "", // "upload" | "youtube"
    youtube_url: "",
    video_file: null,
    video_file_name: "",
    video_file_size: 0,
  });

  const fileInputRef = useRef(null);
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const selectedSuyu = SUYUS.find(s => s.id === form.suyu_id);
  const availableSeries = selectedSuyu?.series.filter(s => !s.is_demo) || [];
  const youtubeId = form.youtube_url ? getYoutubeId(form.youtube_url) : null;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(lbl(
        `El archivo es demasiado grande (máx. ${MAX_FILE_SIZE_MB} MB).`,
        `File is too large (max. ${MAX_FILE_SIZE_MB} MB).`
      ));
      return;
    }
    setError(null);
    update("video_file", file);
    update("video_file_name", file.name);
    update("video_file_size", file.size);
  };

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
    if (step === 3) {
      if (form.video_type === "youtube") return !!youtubeId;
      if (form.video_type === "upload") return !!form.video_file;
      return false;
    }
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
        price_per_session: 0,
        duration_minutes: Number(form.duration_minutes),
        languages: form.languages,
        is_active: true,
        is_demo: false,
        video_youtube_url: form.video_type === "youtube" ? form.youtube_url.trim() : null,
        video_file_name: form.video_type === "upload" ? form.video_file_name : null,
        mode: "participate",
      });
      setSuccess(true);
      setTimeout(() => navigate(`/provider/${provider.id}`), 2000);
    } catch (err) {
      setError(err.message || lbl("Une erreur s'est produite.", "An error occurred."));
    }
  };

  return (
    <div>
      {/* Step progress */}
      <StepProgress steps={PARTICIPATE_STEPS} current={step} lang={lang} accentColor="violet" />

      {/* Step 1 – Theme */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-bold text-foreground mb-1">{lbl("¿Cuál es tu temática?", "What's your theme?")}</h2>
          <p className="text-sm text-muted-foreground mb-6">{lbl("Elige el Suyu y la serie que mejor representa tu historia.", "Choose the Suyu and series that best represents your story.")}</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {SUYUS.filter(s => s.id !== "demo").map(suyu => (
              <button
                key={suyu.id}
                onClick={() => { update("suyu_id", suyu.id); update("series_name", ""); }}
                className={`p-4 rounded-xl border-2 text-left transition-all ${form.suyu_id === suyu.id ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20" : "border-border hover:border-violet-300"}`}
              >
                <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: suyu.color }} />
                <p className="font-bold text-sm text-foreground">{suyu.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{suyu.subtitle}</p>
              </button>
            ))}
          </div>
          {selectedSuyu && (
            <div className="animate-in fade-in duration-200 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{lbl("Elige tu serie", "Choose your series")}</p>
              {availableSeries.map(series => (
                <button
                  key={series.name}
                  onClick={() => update("series_name", series.name)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${form.series_name === series.name ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20" : "border-border hover:border-violet-300"}`}
                >
                  <p className="font-semibold text-sm text-foreground">{series.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{series.synopsis}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2 – Profile */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-bold text-foreground mb-1">{lbl("Tu presentación", "Your profile")}</h2>
          <p className="text-sm text-muted-foreground mb-6">{lbl("Cuéntanos quién eres. Esta información será visible para todos.", "Tell us who you are. This will be visible to everyone.")}</p>
          <ProfileFormFields form={form} update={update} lang={lang} />
        </div>
      )}

      {/* Step 3 – Video */}
      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-bold text-foreground mb-1">{lbl("Tu video de presentación", "Your presentation video")}</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {lbl(
              `Sube un video (máx. ${MAX_FILE_SIZE_MB} MB) o añade el enlace de un video de YouTube ya publicado.`,
              `Upload a video (max. ${MAX_FILE_SIZE_MB} MB) or add the link to an already published YouTube video.`
            )}
          </p>

          {/* Toggle */}
          <div className="flex gap-2 p-1 bg-muted rounded-xl w-fit mb-6">
            {[
              { id: "upload", icon: Upload, es: "Subir archivo", en: "Upload file" },
              { id: "youtube", icon: Youtube, es: "Enlace YouTube", en: "YouTube link" },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => { update("video_type", opt.id); setError(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${form.video_type === opt.id ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <opt.icon className="h-3.5 w-3.5" />
                {lbl(opt.es, opt.en)}
              </button>
            ))}
          </div>

          {/* Upload zone */}
          {form.video_type === "upload" && (
            <div className="animate-in fade-in duration-200">
              <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleFileSelect} />
              {form.video_file ? (
                <div className="border-2 border-violet-500 bg-violet-50 dark:bg-violet-950/20 rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 flex items-center justify-center flex-shrink-0">
                      <Film className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground line-clamp-1">{form.video_file_name}</p>
                      <p className="text-xs text-muted-foreground">{(form.video_file_size / (1024 * 1024)).toFixed(1)} MB</p>
                    </div>
                  </div>
                  <button onClick={() => { update("video_file", null); update("video_file_name", ""); update("video_file_size", 0); }} className="text-muted-foreground hover:text-destructive transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-border hover:border-violet-400 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 transition-all hover:bg-violet-50/30 dark:hover:bg-violet-950/10 group"
                >
                  <div className="h-14 w-14 rounded-2xl bg-muted text-muted-foreground group-hover:bg-violet-100 group-hover:text-violet-600 dark:group-hover:bg-violet-900/40 dark:group-hover:text-violet-400 flex items-center justify-center transition-all">
                    <Upload className="h-7 w-7" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">{lbl("Haz clic para seleccionar tu video", "Click to select your video")}</p>
                    <p className="text-xs text-muted-foreground mt-1">{lbl(`MP4, MOV, AVI — máx. ${MAX_FILE_SIZE_MB} MB`, `MP4, MOV, AVI — max. ${MAX_FILE_SIZE_MB} MB`)}</p>
                  </div>
                </button>
              )}
            </div>
          )}

          {/* YouTube link */}
          {form.video_type === "youtube" && (
            <div className="animate-in fade-in duration-200 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                  {lbl("URL del video de YouTube", "YouTube video URL")}
                </label>
                <input
                  type="url"
                  value={form.youtube_url}
                  onChange={e => update("youtube_url", e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                />
                {form.youtube_url && !youtubeId && (
                  <p className="text-xs text-destructive mt-1">{lbl("URL de YouTube no válida.", "Invalid YouTube URL.")}</p>
                )}
              </div>
              {youtubeId && (
                <div className="rounded-2xl overflow-hidden border border-border aspect-video w-full animate-in fade-in">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title="YouTube preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          )}

          {form.video_type === "" && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {lbl("Elige cómo quieres compartir tu video arriba.", "Choose how you want to share your video above.")}
            </div>
          )}

          {/* Language picker (bonus here) */}
          <div className="mt-6 pt-4 border-t border-border">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
              <Globe className="h-3 w-3" /> {lbl("Idiomas en que puedes comunicarte", "Languages you speak")}
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {LANGUAGES_OPTIONS.map(l => (
                <button
                  key={l}
                  onClick={() => toggleLang(l)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${form.languages.includes(l) ? "bg-violet-600 text-white border-violet-600" : "border-border text-muted-foreground hover:border-violet-300"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4 – Preview */}
      {step === 4 && (
        <PreviewAndSubmit
          form={form}
          lang={lang}
          youtubeId={youtubeId}
          isPending={isPending}
          success={success}
          error={error}
          onSubmit={handleSubmit}
          mode="participate"
        />
      )}

      {/* Navigation */}
      <FormNav
        step={step}
        totalSteps={4}
        canNext={canNext()}
        isPending={isPending}
        success={success}
        lang={lang}
        onBack={() => step > 1 ? setStep(s => s - 1) : onBack()}
        onNext={() => setStep(s => s + 1)}
        onSubmit={handleSubmit}
        accentColor="violet"
      />
    </div>
  );
}

// ─── FLOW B: Offer a Service ────────────────────────────────────────────────
const SERVICE_STEPS = [
  { id: 1, es: "Categoría", en: "Category" },
  { id: 2, es: "Presentación", en: "Profile" },
  { id: 3, es: "Tarifa", en: "Pricing" },
  { id: 4, es: "Vista previa", en: "Preview" },
];

function ServiceFlow({ lang, user, onBack }) {
  const navigate = useNavigate();
  const { mutateAsync: createProvider, isPending } = useCreateProvider();
  const lbl = (es, en) => lang === "es" ? es : en;
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);
  const [form, setForm] = useState({
    category_id: null,
    subcategory_id: null,
    category_label: "",
    subcategory_label: "",
    display_name: user?.user_metadata?.display_name || user?.email?.split("@")[0] || "",
    tagline: "",
    bio: "",
    poster_url: "",
    location: "Cusco, Perú",
    price_per_session: 40,
    duration_minutes: 60,
    languages: ["Español"],
  });

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
    if (step === 1) return !!form.category_id && !!form.subcategory_id;
    if (step === 2) return !!form.display_name.trim() && !!form.tagline.trim() && !!form.bio.trim();
    if (step === 3) return form.price_per_session >= 0 && form.duration_minutes > 0 && form.languages.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      const provider = await createProvider({
        suyu_id: "services",
        series_name: form.subcategory_label,
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
        category_id: form.category_id,
        subcategory_id: form.subcategory_id,
        category_label: form.category_label,
        subcategory_label: form.subcategory_label,
        mode: "service",
      });
      setSuccess(true);
      setTimeout(() => navigate(`/provider/${provider.id}`), 2000);
    } catch (err) {
      setError(err.message || lbl("Une erreur s'est produite.", "An error occurred."));
    }
  };

  const selectedCat = SERVICE_CATEGORIES.find(c => c.id === form.category_id);

  return (
    <div>
      <StepProgress steps={SERVICE_STEPS} current={step} lang={lang} accentColor="emerald" />

      {/* Step 1 – Category */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-bold text-foreground mb-1">{lbl("¿Qué tipo de servicio ofreces?", "What type of service do you offer?")}</h2>
          <p className="text-sm text-muted-foreground mb-6">{lbl("Elige la categoría y subcategoría que mejor describe tu servicio.", "Choose the category and sub-category that best describes your service.")}</p>

          <div className="space-y-2">
            {SERVICE_CATEGORIES.map(cat => {
              const isExpanded = expandedCat === cat.id;
              const isSelected = form.category_id === cat.id;
              return (
                <div key={cat.id} className={`rounded-2xl border transition-all overflow-hidden ${isSelected ? "border-emerald-500" : "border-border"}`}>
                  <button
                    onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                    className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isExpanded ? "bg-emerald-50/50 dark:bg-emerald-950/10" : "hover:bg-muted/30"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{cat.emoji}</span>
                      <div>
                        <p className="font-bold text-sm text-foreground">{lbl(cat.es, cat.en)}</p>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? "border-emerald-500 bg-emerald-500" : "border-border"}`}>
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-3 pt-1 space-y-1.5 animate-in fade-in duration-150 bg-muted/20">
                      {cat.subcategories.map(sub => {
                        const isSubSelected = form.subcategory_id === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              update("category_id", cat.id);
                              update("category_label", lbl(cat.es, cat.en));
                              update("subcategory_id", sub.id);
                              update("subcategory_label", lbl(sub.es, sub.en));
                              setExpandedCat(null);
                            }}
                            className={`w-full text-left p-3 rounded-xl text-xs transition-all border ${isSubSelected ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-semibold" : "border-transparent hover:border-emerald-200 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/10 text-foreground"}`}
                          >
                            {lbl(sub.es, sub.en)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {form.category_id && form.subcategory_id && (
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center gap-2 animate-in fade-in">
              <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                {form.category_label} → {form.subcategory_label}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 2 – Profile */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-bold text-foreground mb-1">{lbl("Tu presentación", "Your profile")}</h2>
          <p className="text-sm text-muted-foreground mb-6">{lbl("Cuéntanos quién eres y qué te hace especial.", "Tell us who you are and what makes you special.")}</p>
          <ProfileFormFields form={form} update={update} lang={lang} />
        </div>
      )}

      {/* Step 3 – Pricing */}
      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-bold text-foreground mb-1">{lbl("Tarifa y disponibilidad", "Pricing & availability")}</h2>
          <p className="text-sm text-muted-foreground mb-6">{lbl("Define el precio y duración de tus sesiones.", "Set your session price and duration.")}</p>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> {lbl("Precio (USD)", "Price (USD)")} *
                </label>
                <input
                  type="number" min={0}
                  value={form.price_per_session}
                  onChange={e => update("price_per_session", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {lbl("Duración (min)", "Duration (min)")} *
                </label>
                <input
                  type="number" min={15} step={15}
                  value={form.duration_minutes}
                  onChange={e => update("duration_minutes", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
                <Globe className="h-3 w-3" /> {lbl("Idiomas", "Languages")} *
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {LANGUAGES_OPTIONS.map(l => (
                  <button
                    key={l} onClick={() => toggleLang(l)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${form.languages.includes(l) ? "bg-emerald-600 text-white border-emerald-600" : "border-border text-muted-foreground hover:border-emerald-300"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4 – Preview */}
      {step === 4 && (
        <PreviewAndSubmit
          form={form}
          lang={lang}
          isPending={isPending}
          success={success}
          error={error}
          onSubmit={handleSubmit}
          mode="service"
          selectedCat={selectedCat}
        />
      )}

      <FormNav
        step={step}
        totalSteps={4}
        canNext={canNext()}
        isPending={isPending}
        success={success}
        lang={lang}
        onBack={() => step > 1 ? setStep(s => s - 1) : onBack()}
        onNext={() => setStep(s => s + 1)}
        onSubmit={handleSubmit}
        accentColor="emerald"
      />
    </div>
  );
}

// ─── Shared sub-components ──────────────────────────────────────────────────

function StepProgress({ steps, current, lang, accentColor }) {
  const ringColor = accentColor === "violet" ? "ring-violet-500/20" : "ring-emerald-500/20";
  const activeColor = accentColor === "violet" ? "bg-violet-600" : "bg-emerald-600";
  const doneColor = accentColor === "violet" ? "bg-violet-500" : "bg-emerald-500";
  const lineColor = accentColor === "violet" ? "bg-violet-400" : "bg-emerald-400";
  return (
    <div className="flex items-center justify-center gap-2 mb-10 pt-4">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
            current > s.id ? `${doneColor} text-white` :
            current === s.id ? `${activeColor} text-white ring-4 ${ringColor}` :
            "bg-muted text-muted-foreground"
          }`}>
            {current > s.id ? <Check className="h-4 w-4" /> : s.id}
          </div>
          <span className={`text-xs hidden sm:block font-medium transition-colors ${current === s.id ? "text-foreground" : "text-muted-foreground"}`}>
            {lang === "es" ? s.es : s.en}
          </span>
          {i < steps.length - 1 && (
            <div className={`w-6 h-px mx-1 ${current > s.id ? lineColor : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function ProfileFormFields({ form, update, lang }) {
  const lbl = (es, en) => lang === "es" ? es : en;
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">{lbl("Nombre visible", "Display name")} *</label>
        <input type="text" value={form.display_name} onChange={e => update("display_name", e.target.value)}
          placeholder="María Mamani"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">{lbl("Tagline (una frase)", "Tagline (one sentence)")} *</label>
        <input type="text" value={form.tagline} onChange={e => update("tagline", e.target.value)}
          placeholder={lbl("Guardiana del hilo ancestral en Chinchero", "Guardian of ancestral weaving in Chinchero")}
          maxLength={80}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <p className="text-xs text-muted-foreground mt-1 text-right">{form.tagline.length}/80</p>
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">Bio *</label>
        <textarea value={form.bio} onChange={e => update("bio", e.target.value)}
          rows={5}
          placeholder={lbl("Cuéntanos tu historia, tu pasión y lo que haces único...", "Tell us your story, your passion and what makes you unique...")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">{lbl("URL de tu foto", "Photo URL")}</label>
        <input type="url" value={form.poster_url} onChange={e => update("poster_url", e.target.value)}
          placeholder="https://..."
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        {form.poster_url && (
          <img src={form.poster_url} alt="Preview" className="mt-2 w-16 h-16 rounded-full object-cover border border-border" onError={e => e.target.style.display = 'none'} />
        )}
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">{lbl("Ubicación", "Location")}</label>
        <input type="text" value={form.location} onChange={e => update("location", e.target.value)}
          placeholder="Cusco, Perú"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>
    </div>
  );
}

function PreviewAndSubmit({ form, lang, youtubeId, isPending, success, error, onSubmit, mode, selectedCat }) {
  const lbl = (es, en) => lang === "es" ? es : en;
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-2xl font-bold text-foreground mb-1">{lbl("Vista previa", "Preview")}</h2>
      <p className="text-sm text-muted-foreground mb-6">{lbl("Así verán tu perfil los exploradores.", "This is how explorers will see your profile.")}</p>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-md">
        {form.poster_url && (
          <img src={form.poster_url} alt={form.display_name} className="w-full h-48 object-cover" onError={e => e.target.style.display = 'none'} />
        )}
        {mode === "participate" && youtubeId && !form.poster_url && (
          <div className="relative w-full aspect-video">
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${youtubeId}`}
              title="Preview" frameBorder="0" allowFullScreen className="w-full h-full" />
          </div>
        )}
        <div className="p-5">
          {mode === "participate" && (
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-violet-600 text-white mb-3">
              {form.series_name}
            </div>
          )}
          {mode === "service" && selectedCat && (
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white mb-3"
              style={{ backgroundColor: selectedCat.color }}>
              {selectedCat.emoji} {form.subcategory_label}
            </div>
          )}
          <h3 className="text-xl font-bold text-foreground">{form.display_name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{form.tagline}</p>
          <p className="text-sm text-foreground mt-3 leading-relaxed line-clamp-3">{form.bio}</p>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            {mode === "service" && <span>${form.price_per_session} USD</span>}
            {mode === "service" && <span>·</span>}
            <span>{form.duration_minutes} min</span>
            <span>·</span>
            <span>{form.location}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {form.languages.map(l => (
              <span key={l} className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">{l}</span>
            ))}
          </div>
          {mode === "participate" && form.video_type === "upload" && form.video_file_name && (
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Film className="h-3.5 w-3.5" />
              <span>{form.video_file_name} ({(form.video_file_size / (1024 * 1024)).toFixed(1)} MB)</span>
            </div>
          )}
        </div>
      </div>

      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
          <p className="text-sm font-bold text-green-800">🎉 {lbl("¡Perfil publicado!", "Profile published!")}</p>
          <p className="text-xs text-green-700 mt-1">{lbl("Redirigiendo...", "Redirecting...")}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}

function FormNav({ step, totalSteps, canNext, isPending, success, lang, onBack, onNext, onSubmit, accentColor }) {
  const lbl = (es, en) => lang === "es" ? es : en;
  const btnColor = accentColor === "violet" ? "bg-violet-600 hover:bg-violet-700" : "bg-emerald-600 hover:bg-emerald-700";
  return (
    <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        {step === 1 ? lbl("Cancelar", "Cancel") : lbl("Anterior", "Back")}
      </Button>
      {step < totalSteps ? (
        <Button onClick={onNext} disabled={!canNext} className={`${btnColor} text-white gap-2`}>
          {lbl("Siguiente", "Next")} <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={onSubmit} disabled={isPending || success} className={`${btnColor} text-white gap-2`}>
          <Check className="h-4 w-4" />
          {isPending ? lbl("Publicando...", "Publishing...") : lbl("Publicar mi perfil", "Publish my profile")}
        </Button>
      )}
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────
export default function CreateProviderProfile() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [mode, setMode] = useState(null); // null | "participate" | "service"

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16 max-w-2xl mx-auto px-4">
        {mode === null && (
          <ModeSelector lang={lang} onSelect={setMode} />
        )}
        {mode === "participate" && (
          <ParticipateFlow lang={lang} user={user} onBack={() => setMode(null)} />
        )}
        {mode === "service" && (
          <ServiceFlow lang={lang} user={user} onBack={() => setMode(null)} />
        )}
      </main>
    </div>
  );
}
