import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

import { getProviderById } from "../lib/providers";
import Header from "../components/Header";
import { useLang, T } from "../lib/LangContext";


const CRITERIA = [
{ key: "authenticity", labelEs: "Autenticidad", labelEn: "Authenticity",
color: "#AD281F" },
{ key: "originality", labelEs: "Originalidad", labelEn: "Originality",
color: "#C38322" },
{ key: "impact", labelEs: "Impacto", labelEn: "Impact", color: "#2A7A5A" },
];


function getRatingsKey(providerId, episodeIndex) {
return `ratings_${providerId}_${episodeIndex}`;
}


const rangeSliderStyle = `
input[type="range"]::-webkit-slider-thumb {
     appearance: none;
     width: 14px;
     height: 14px;
     border-radius: 50%;
     background: white;
     cursor: pointer;
     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
     border: 2px solid rgba(255, 255, 255, 0.9);
}
input[type="range"]::-moz-range-thumb {
     width: 14px;
     height: 14px;
     border-radius: 50%;
     background: white;
     cursor: pointer;
     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
     border: 2px solid rgba(255, 255, 255, 0.9);
}
`;


export default function VideoPlayer() {
const { providerId, episodeIndex } = useParams();
const navigate = useNavigate();

const { lang } = useLang();
const t = T[lang];
const epIdx = parseInt(episodeIndex) || 0;


const provider = getProviderById(providerId);
const episode = provider?.episodes?.[epIdx];


const [ratings, setRatings] = useState({ authenticity: 50, originality: 50,
impact: 50 });
const [submitted, setSubmitted] = useState(false);
const [playing, setPlaying] = useState(false);


useEffect(() => {
    const saved = localStorage.getItem(getRatingsKey(providerId, epIdx));
    if (saved) { setRatings(JSON.parse(saved)); setSubmitted(true); }
}, [providerId, epIdx]);


const handleSubmit = () => {
    localStorage.setItem(getRatingsKey(providerId, epIdx),
JSON.stringify(ratings));
    setSubmitted(true);
};


const updateRating = (key, val) => {
    setRatings(r => ({ ...r, [key]: parseInt(val) }));
};


if (!provider || !episode) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Episodio no
encontrado.</p></div>;
}


const criteriaLabel = (c) => lang === "en" ? c.labelEn : c.labelEs;


return (
    <>
     <style>{rangeSliderStyle}</style>
     <div className="min-h-screen bg-foreground text-white">
         <div className="max-w-screen-sm mx-auto flex flex-col min-h-screen">
          {/* Top bar */}

        <div className="flex items-center justify-between p-4 flex-shrink-0">
             <button
                 onClick={() => navigate(-1)}
                 className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
             >
                 <ArrowLeft className="h-4 w-4 text-white" />
             </button>
             <div className="text-center">
                 <p className="text-xs text-white/50">{episode.subtitle}</p>
             </div>
             <div className="w-9" />
        </div>


        {/* Video area */}
        <div
             className="relative mx-4 rounded-2xl overflow-hidden cursor-pointer flex-shrink-0"
             style={{ aspectRatio: "9/16", maxHeight: "55vh" }}
             onClick={() => setPlaying(!playing)}
        >
             <img
                 src={episode.thumbnail_url}
                 alt={episode.title}
                 className="absolute inset-0 w-full h-full object-cover"
                 onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&h=700&fit=crop"; }}
             />
             <div className="absolute inset-0 bg-black/40" />
             {!playing && (
                 <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50">
                    <Play className="h-7 w-7 text-white fill-white ml-1" />
                  </div>
                 </div>
             )}
             {playing && (

            <div className="absolute inset-0 flex items-center justify-center">
               <div className="text-center">
                   <div className="flex gap-1 items-center justify-center mb-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-1 bg-white rounded-full animate-bounce" style={{ height: 24, animationDelay: `${i * 0.15}s` }} />
                    ))}
                   </div>
                   <p className="text-white/60 text-xs">{lang === "es" ?
"Reproduciendo..." : "Playing..."}</p>
               </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white font-bold text-lg leading-tight">{episode.title}</p>
            <p className="text-white/60 text-sm mt-1">{episode.description}</p>
          </div>
         </div>


         {/* Rating section */}
         <div className="flex-1 overflow-y-auto px-4 pb-6 pt-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white">
               {lang === "es" ? "Evalúa este episodio" : "Rate this episode"}
            </h2>
            {submitted && (
               <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/70">
                   {lang === "es" ? "Evaluado" : "Rated"}
               </span>
            )}
          </div>


          <div className="space-y-6">
            {CRITERIA.map((c) => (
               <div key={c.key}>
                   <div className="flex items-center justify-between mb-2">

                      <span className="text-sm font-semibold text-white">{criteriaLabel(c)}</span>
                      <span className="text-lg font-bold" style={{ color:
c.color }}>{ratings[c.key]}</span>
                    </div>
                    {/* Track + slider overlay */}
                    <div className="relative h-2 bg-white/10 rounded-full group/slider">
                      <div
                        className="absolute left-0 top-0 h-full rounded-full transition-all pointer-events-none"
                        style={{ width: `${ratings[c.key]}%`, backgroundColor:
c.color }}
                      />
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={ratings[c.key]}
                        onChange={(e) => updateRating(c.key, e.target.value)}
                        disabled={submitted}
                        className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer disabled:cursor-default z-10"
                        style={{
                           height: "100%",
                           WebkitAppearance: "none",
                        }}
                      />
                    </div>
                  </div>
              ))}
             </div>


             {!submitted ? (
              <Button
                  onClick={handleSubmit}
                  className="w-full mt-6 font-semibold h-12"
                  style={{ backgroundColor: "#AD281F", color: "white" }}
              >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  {lang === "es" ? "Enviar evaluación" : "Submit rating"}

                 </Button>
             ) : (
                 <div className="mt-6 p-4 rounded-2xl bg-white/5 text-center">
                   <ThumbsUp className="h-5 w-5 text-white/60 mx-auto mb-1" />
                   <p className="text-sm text-white/60">
                     {lang === "es" ? "¡Gracias por tu evaluación!" : "Thanks for your rating!"}
                   </p>
                 </div>
             )}


             <Button
                 variant="ghost"
                 className="w-full mt-3 text-white/40 hover:text-white/70"
                 onClick={() => navigate(-1)}
             >
                 {t.back}
             </Button>
           </div>
          </div>
      </div>
     </>
  );
}
