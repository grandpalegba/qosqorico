import { useState } from "react";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import BookingModal from "../components/BookingModal";
import ProviderDashboard from "../components/ProviderDashboard";
import FavoriteButton from "../components/FavoriteButton";
import MessagingModal from "../components/MessagingModal";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, MapPin, Globe, Clock, X, Eye, BarChart2, MessageCircle } from "lucide-react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProviderById } from "../lib/providers";
import { useLang, T } from "../lib/LangContext";
import Header from "../components/Header";


const CRITERIA = [
  { key: "authenticity", labelEs: "Autenticidad", labelEn: "Authenticity", color: "#AD281F" },
  { key: "originality", labelEs: "Originalidad", labelEn: "Originality", color: "#C38322" },
  { key: "impact", labelEs: "Impacto", labelEn: "Impact", color: "#2A7A5A" },
];


function seededNum(str, min, max) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 9973;
  return min + (h % (max - min));
}


function getProviderStats(provider) {
  const views = seededNum(provider.id + "views", 800, 12000);
  const ratings = seededNum(provider.id + "ratings", 20, 400);
  const avgScores = CRITERIA.map(c => ({
    ...c,
    avg: seededNum(provider.id + c.key, 62, 97)
  }));
  return { views, ratings, avgScores };
}


function EpisodeCard({ episode, index, isActive, onClick }) {
  return (
    <button
      onClick={() => onClick(index)}
      className={`w-full transition-all duration-300 ${isActive ? "opacity-100 scale-[1.02]" : "opacity-55 hover:opacity-75"}`}
    >
      <div className="relative rounded-2xl overflow-hidden shadow-lg w-full" style={{ aspectRatio: "9/16", maxHeight: "300px" }}>
        <img
          src={episode.thumbnail_url}
          alt={episode.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&h=700&fit=crop"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />
        <div className="absolute top-3 left-0 right-0 flex justify-center">
          <span className="text-white/60 text-[10px] font-medium">{episode.subtitle}</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
            <Play className="h-4 w-4 text-white fill-white ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white font-semibold text-xs leading-tight">{episode.title}</p>
          <p className="text-white/50 text-[10px] mt-0.5">{episode.duration}</p>
        </div>
      </div>
    </button>
  );
}


function ServicePanel({ provider, open, onClose, t, navigate }) {
  const handleBook = (service) => {
    onClose();
    navigate(`/payment?service=${encodeURIComponent(service.name)}&price=${service.price}&currency=${service.currency}&provider=${encodeURIComponent(provider.full_name)}`);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-card flex flex-col shadow-2xl"
        style={{ animation: "slideInRight 0.3s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 bg-card border-b border-border flex items-center justify-between px-5 py-4">
          <div>
            <h2 className="font-bold text-foreground text-base">{t.servicesPanel}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{provider.full_name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted transition-colors ml-4">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">{provider.bio}</p>
            <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{provider.location}</span>
              <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{provider.languages.join(", ")}</span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {provider.services.map((s, i) => (
              <div key={i} className="bg-background rounded-xl p-4 border border-border">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground leading-tight">{s.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 flex-shrink-0" /><span>{s.duration}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-primary">${s.price}</p>
                    <p className="text-[10px] text-muted-foreground">{s.currency}</p>
                  </div>
                </div>
                <Button className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90" size="sm" onClick={() => handleBook(s)}>
                  {t.book}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>
  );
}


export default function Profile() {
  const { providerId } = useParams();
  const navigate = useNavigate();

  const { lang } = useLang();
  const t = T[lang];
  const provider = getProviderById(providerId);
  const [activeEp, setActiveEp] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);


  if (!provider) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Proveedor no encontrado.</p></div>;
  }


  const { views, ratings: ratingsCount, avgScores } = getProviderStats(provider);
  const criteriaLabel = (c) => lang === "en" ? c.labelEn : c.labelEs;


  const handleEpisodeClick = (index) => {
    setActiveEp(index);
    navigate(`/watch/${providerId}/${index}`);
  };


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-14 pb-12">
        <div className="max-w-screen-lg mx-auto px-4 md:px-6">


          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mt-4 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> {t.back}
          </button>


          {/* Profile hero — large photo + info */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            {/* Large profile photo */}
            <div className="flex-shrink-0 w-36 sm:w-44 rounded-2xl overflow-hidden shadow-xl border border-border relative" style={{ aspectRatio: "3/4" }}>
              <img
                src={provider.poster_url}
                alt={provider.full_name}
                className="absolute inset-0 w-full h-full object-cover object-top"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=900&fit=crop"; }}
              />
              {/* Score overlay at bottom */}
              <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1">
                {avgScores.map((c) => (
                  <span key={c.key} className="text-xl font-black leading-none" style={{ color: c.color, textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                    {c.avg}
                  </span>
                ))}
              </div>
            </div>


            {/* Info column */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{provider.full_name}</h1>
                  <FavoriteButton provider={provider} />
                </div>
                <Button onClick={() => setPanelOpen(true)} className="flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5" size="sm">
                  <ShoppingBag className="h-4 w-4" />
                  <span>{t.services}</span>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-1">{provider.tagline}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{provider.location}</span>
                <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{provider.languages.join(", ")}</span>
              </div>


              {/* Mini dashboard */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1 bg-card border border-border rounded-xl p-3 text-center">
                  <Eye className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{views.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{lang === "es" ? "Vistas" : "Views"}</p>
                </div>
                <div className="flex-1 bg-card border border-border rounded-xl p-3 text-center">
                  <BarChart2 className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{ratingsCount}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{lang === "es" ? "Evaluaciones" : "Ratings"}</p>
                </div>
                <div className="flex-1 bg-card border border-border rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{Math.round(avgScores.reduce((a, c) => a + c.avg, 0) / 3)}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Score</p>
                </div>
              </div>


              {/* 3 colored rating bars */}
              <div className="space-y-2.5">
                {avgScores.map((c) => (
                  <div key={c.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-muted-foreground">{criteriaLabel(c)}</span>
                      <span className="text-xs font-bold" style={{ color: c.color }}>{c.avg}/100</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${c.avg}%`, backgroundColor: c.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Bio */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-2xl">{provider.bio}</p>


          {/* Episodes */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              {provider.episodes.length} {t.episodes}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {provider.episodes.map((ep, i) => (
                <EpisodeCard key={i} episode={ep} index={i} isActive={i === activeEp} onClick={handleEpisodeClick} />
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 mb-10">
            <Button onClick={() => setPanelOpen(true)} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8" size="lg">
              {t.bookView}
            </Button>
            <Button variant="outline" size="lg" onClick={() => setMsgOpen(true)} className="w-full sm:w-auto font-semibold px-8 border-border text-foreground hover:bg-muted gap-2">
              <MessageCircle className="h-4 w-4" />
              {lang === "es" ? "Enviar Mensaje" : "Send Message"}
            </Button>
          </div>


          {/* Availability Calendar */}
          <div className="mb-10 border border-border rounded-2xl p-4 bg-card max-w-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
              📅 {lang === "es" ? "Disponibilidad & Pré-réservation" : "Availability & Pre-booking"}
            </h2>
            <AvailabilityCalendar provider={provider} />
          </div>


          <ProviderDashboard provider={provider} />
        </div>
      </main>


      <ServicePanel provider={provider} open={panelOpen} onClose={() => setPanelOpen(false)} t={t} navigate={navigate} />
      <BookingModal provider={provider} open={bookingOpen} onClose={() => setBookingOpen(false)} />
      <MessagingModal provider={provider} open={msgOpen} onClose={() => setMsgOpen(false)} />
    </div>
  );
}
