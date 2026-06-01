import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, PlusCircle, FlaskConical } from "lucide-react";
import Header from "../components/Header";
import { SUYUS } from "../lib/data";
import { useProvidersForSeries } from "../hooks/useProviders";
import { getQuestionsForSeries } from "../lib/providers";
import { useLang, T } from "../lib/LangContext";
import { Link, useNavigate as useNav } from "react-router-dom";


const SCORE_COLORS = ["#AD281F", "#C38322", "#2A7A5A"];
const CRITERIA_KEYS = ["authenticity", "originality", "impact"];



export default function Series() {
  const { seriesName } = useParams();
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = T[lang];
  const decoded = decodeURIComponent(seriesName);
  const isDemoSeries = decoded === "Demo Qosqorico";

  const suyu = SUYUS.find((s) => s.series.some((sr) => sr.name === decoded));
  const series = suyu?.series.find((sr) => sr.name === decoded);

  // Load real + demo providers from Supabase hook
  const { data: providers = [], isLoading: loadingProviders } = useProvidersForSeries(decoded);
  const realProviders = providers.filter(p => !p.is_demo);
  const demoProviders = providers.filter(p => p.is_demo);

  if (!series) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Serie no encontrada.</p>
      </div>
    );
  }

  // Use series-specific episode questions
  const episodeQuestions = getQuestionsForSeries(decoded);

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


          {/* Providers gallery */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.protagonists}</h2>
              {!isDemoSeries && (
                <Link
                  to="/create-provider-profile"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  {lang === "es" ? "Proponer esta experiencia" : "Offer this experience"}
                </Link>
              )}
            </div>

            {loadingProviders ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-4 border-border border-t-primary rounded-full animate-spin" />
              </div>
            ) : realProviders.length === 0 && demoProviders.length === 0 ? (
              // Empty state
              <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
                <p className="text-2xl mb-3">🎭</p>
                <p className="font-semibold text-foreground text-sm mb-1">
                  {lang === "es" ? "¡Sé el primero en esta serie!" : "Be the first in this series!"}
                </p>
                <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">
                  {lang === "es"
                    ? "Nadie ha propuesto aún una experiencia en esta temática. ¿Te animas?"
                    : "No one has offered an experience in this theme yet. Ready to start?"}
                </p>
                <Link
                  to="/create-provider-profile"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
                >
                  <PlusCircle className="h-4 w-4" />
                  {lang === "es" ? "Crear mi perfil" : "Create my profile"}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Real providers first */}
                {realProviders.map((p) => (
                  <Link key={p.id} to={`/provider/${p.id}`} className="group">
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-md transition-all duration-200 group-hover:scale-[1.03] group-hover:shadow-xl">
                      <img
                        src={p.poster_url}
                        alt={p.display_name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=900&fit=crop"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white font-bold text-lg leading-none">{p.display_name}</p>
                        <p className="text-white/70 text-xs mt-1 line-clamp-2">{p.tagline}</p>
                      </div>
                    </div>
                  </Link>
                ))}

                {/* Demo providers — with badge */}
                {demoProviders.map((p) => (
                  <Link key={p.id} to={`/provider/${p.id}`} className="group">
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-md transition-all duration-200 group-hover:scale-[1.03] group-hover:shadow-xl">
                      <img
                        src={p.poster_url}
                        alt={p.display_name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=900&fit=crop"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-violet-600/90 text-white rounded-full">
                          <FlaskConical className="h-2.5 w-2.5" /> DÉMO
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white font-bold text-lg leading-none">{p.display_name}</p>
                        <p className="text-white/70 text-xs mt-1 line-clamp-2">{p.tagline}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
