import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import { SUYUS } from "../lib/data";
import { getProvidersForSeries } from "../lib/providers";
import { useLang, T } from "../lib/LangContext";
import { Link } from "react-router-dom";


const SCORE_COLORS = ["#AD281F", "#C38322", "#2A7A5A"];
const CRITERIA_KEYS = ["authenticity", "originality", "impact"];


function seededNum(str, min, max) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 9973;
  return min + (h % (max - min));
}


function getProviderScores(providerId) {
  // Simulate: ~30% of providers don't have ratings yet
  const hasRatings = seededNum(providerId + "hasratings", 0, 10) > 2;
  if (!hasRatings) return null;
  return CRITERIA_KEYS.map((k, i) => ({
    score: seededNum(providerId + k, 62, 97),
    color: SCORE_COLORS[i]
  }));
}


export default function Series() {
  const { seriesName } = useParams();
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = T[lang];
  const decoded = decodeURIComponent(seriesName);

  const suyu = SUYUS.find((s) => s.series.some((sr) => sr.name === decoded));
  const series = suyu?.series.find((sr) => sr.name === decoded);
  const providers = suyu ? getProvidersForSeries(decoded, suyu.id) : [];

  if (!series) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Serie no encontrada.</p>
      </div>
    );
  }

  // Use real series-specific questions from the first provider's episodes
  const episodeQuestions = providers[0]?.episodes?.map(ep => ep.title) || [
    "¿Cómo llegaste hasta aquí?",
    "¿Cuál es tu secreto en Cusco?",
    "¿Qué hace único tu trabajo?",
    "¿Qué mensaje dejas al mundo?"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-14 pb-12">
        {/* Hero */}
        <div className="relative h-72 md:h-96 overflow-hidden">
          <img
            src={series.image}
            alt={series.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&h=900&fit=crop"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 max-w-screen-lg mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white mb-3 transition-colors"
            >
              <ArrowLeft className="h-3 w-3" /> {t.back}
            </button>
            {suyu && (
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white mb-2 inline-block"
                style={{ backgroundColor: suyu.color }}
              >
                {suyu.name}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-1">{series.name}</h1>
          </div>
        </div>


        <div className="max-w-screen-lg mx-auto px-4 md:px-6">
          {/* Synopsis + Keywords */}
          <div className="mt-6 md:flex md:gap-10">
            <div className="flex-1">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{t.synopsis}</h2>
              <p className="text-sm font-medium text-foreground mb-4">{series.synopsis}</p>
              {series.synopsis_larga && (
                <p className="text-sm text-muted-foreground leading-relaxed mt-4">{series.synopsis_larga}</p>
              )}
            </div>
            {series.keywords && (
              <div className="mt-5 md:mt-0 md:w-56 flex-shrink-0">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{t.keywords}</h2>
                <div className="flex flex-wrap gap-2">
                  {series.keywords.map((kw) => (
                    <span key={kw} className="text-xs font-semibold px-3 py-1 bg-secondary text-secondary-foreground rounded-full">{kw}</span>
                  ))}
                </div>
              </div>
            )}
          </div>


          {/* Episode questions */}
          <div className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              {lang === "es" ? "Episodios" : "Episodes"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {episodeQuestions.map((q, i) => (
                <div key={i} className="bg-card rounded-xl p-4 border border-border">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                    {`Ep. ${i + 1}`}
                  </span>
                  <p className="text-sm font-semibold text-foreground mt-1 leading-snug">{q}</p>
                </div>
              ))}
            </div>
          </div>


          {/* Providers gallery — 4 per series */}
          <div className="mt-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{t.protagonists}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {providers.map((p) => {
                const scores = getProviderScores(p.id);
                return (
                  <Link key={p.id} to={`/provider/${p.id}`} className="group">
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-md transition-all duration-200 group-hover:scale-[1.03] group-hover:shadow-xl">
                      <img
                        src={p.poster_url}
                        alt={p.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=900&fit=crop"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                      {scores && (
                        <div className="absolute bottom-12 right-3 flex flex-col items-end gap-1">
                          {scores.map((s, i) => (
                            <span key={i} className="text-xl font-black leading-none" style={{ color: s.color, textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                              {s.score}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white font-bold text-lg leading-none">{p.name}</p>
                        <p className="text-white/70 text-xs mt-1 line-clamp-2">{p.tagline}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
