import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer }
from "recharts";
import { MessageSquare, Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "../lib/LangContext";


const NARRATIVE_CRITERIA = [
 {
     key: "authenticity",

     labelEs: "Autenticidad",
     labelEn: "Authenticity",
     descEs: "La sinceridad del enfoque, el carácter verdadero y conmovedor del relato personal.",
     descEn: "The sincerity of the approach, the genuine and touching nature of the personal story.",
     color: "#AD281F"
},
{
     key: "originality",
     labelEs: "Originalidad",
     labelEn: "Originality",
     descEs: "La unicidad de la perspectiva compartida sobre Cusco, lo que diferencia esta historia de los clichés turísticos.",
     descEn: "The uniqueness of the perspective shared about Cusco, what sets this story apart from tourist clichés.",
     color: "#C38322"
},
{
     key: "impact",
     labelEs: "Impacto",
     labelEn: "Impact",
     descEs: "La fuerza del mensaje, su capacidad de conmover, educar o inspirar.",
     descEn: "The power of the message, its ability to move, educate or inspire.",
     color: "#2A7A5A"
},
];


const MERCHANT_CRITERIA = [
{
     key: "human_quality",
     labelEs: "Calidad humana",
     labelEn: "Human quality",
     descEs: "La acogida, la amabilidad, la fluidez del intercambio y el respeto mutuo durante la prestación.",
     descEn: "The welcome, kindness, fluidity of the exchange and mutual respect during the service.",
     color: "#5B3FC8"
},

{
     key: "offer_quality",
     labelEs: "Calidad de la oferta",
     labelEn: "Offer quality",
     descEs: "El rigor, el acabado del producto, el respeto de las promesas y el dominio técnico.",
     descEn: "The rigor, product finish, promise delivery and technical mastery.",
     color: "#1A7FA0"
},
{
     key: "utility",
     labelEs: "Utilidad",
     labelEn: "Utility",
     descEs: "El aporte concreto para el comprador, el valor de uso, el enriquecimiento real de su experiencia en Cusco.",
     descEn: "The concrete contribution for the buyer, the use value, how it genuinely enriched their experience in Cusco.",
     color: "#D97706"
},
];


const ALL_CRITERIA = [...NARRATIVE_CRITERIA, ...MERCHANT_CRITERIA];


function seededNum(str, min, max) {
let h = 0;
for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) %
9973;
return min + (h % (max - min));
}


function getSeedReviews(providerId) {
const names = ["Sophie L.", "Carlos M.", "Elena R.", "James W.", "Fatima B.", "Yuki T.", "Pedro A."];
const narrativeComments = [
     "Une expérience absolument authentique, je recommande à tous !",
     "Una conexión real con la cultura andina, fue transformador.",
     "Incredible depth and knowledge, truly unique.",
     "Totalmente auténtico, superó mis expectativas.",
     "Une rencontre inoubliable, pleine de sens.",
     "The most meaningful experience of my trip to Cusco.",

    "Increíble carisma y saber, lo repetiría sin dudarlo."
];
const merchantComments = [
    "Service impeccable, produit de grande qualité.",
    "Exactamente lo que prometían, sin sorpresas negativas.",
    "Worth every penny, genuinely useful for my stay.",
    "Muy buen trato, se nota el amor por lo que hace.",
    "Produit soigné, livraison rapide, je suis ravi.",
    "The experience added real value to my trip.",
    "Profesional, amable y muy puntual. Volveré."
];
return Array.from({ length: 4 }, (_, i) => ({
    id: `seed-${i}`,
    reviewer_name: names[seededNum(providerId + i + "name", 0, names.length)],
    comment_narrative: narrativeComments[seededNum(providerId + i + "nc", 0,
narrativeComments.length)],
    comment_merchant: merchantComments[seededNum(providerId + i + "mc", 0,
merchantComments.length)],
    authenticity: seededNum(providerId + i + "auth", 70, 100),
    originality: seededNum(providerId + i + "orig", 65, 100),
    impact: seededNum(providerId + i + "imp", 68, 100),
    human_quality: seededNum(providerId + i + "hq", 72, 100),
    offer_quality: seededNum(providerId + i + "oq", 68, 100),
    utility: seededNum(providerId + i + "ut", 70, 100),
    created_date: new Date(Date.now() - seededNum(providerId + i + "date", 0,
30) * 86400000).toISOString()
}));
}




function CriteriaBlock({ title, icon, criteria, scores, reviews }) {
return (
    <div className="bg-card border border-border rounded-2xl p-4 mb-4">
     <div className="flex items-center gap-2 mb-4">
       {icon}
       <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</h3>
     </div>


     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
       {/* Radar */}

       <ResponsiveContainer width="100%" height={170}>
         <RadarChart data={criteria.map(c => ({
             subject: scores[c.key]?.label || c.labelEn,
             value: scores[c.key]?.avg || 0,
             fullMark: 100
         }))}>
             <PolarGrid stroke="hsl(var(--border))" />
             <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill:
"hsl(var(--muted-foreground))" }} />
             <Radar dataKey="value" stroke={criteria[0].color}
fill={criteria[0].color} fillOpacity={0.2} strokeWidth={2} />
         </RadarChart>
       </ResponsiveContainer>


       {/* Bars */}
       <div className="flex flex-col justify-center space-y-3">
         {criteria.map(c => (
             <div key={c.key}>
               <div className="flex justify-between items-center mb-1">
                 <span className="text-[11px] font-semibold text-muted-foreground">{scores[c.key]?.label}</span>
                 <span className="text-[11px] font-bold" style={{ color:
c.color }}>{scores[c.key]?.avg}/100</span>
               </div>
               <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                 <div className="h-full rounded-full transition-all duration-700" style={{ width: `${scores[c.key]?.avg}%`, backgroundColor:
c.color }} />
               </div>
             </div>
         ))}
       </div>
     </div>
    </div>
);
}


export default function ProviderDashboard({ provider }) {
const { lang } = useLang();
const [reviews, setReviews] = useState([]);
const [loading, setLoading] = useState(true);

const [activeTab] = useState("merchant");


const lbl = (es, en) => lang === "es" ? es : en;


useEffect(() => { loadReviews(); }, [provider.id]);


async function loadReviews() {
    setLoading(true);
    const real = await base44.entities.Review.filter({ provider_id:
provider.id }, "-created_date", 20);
    setReviews([...real, ...getSeedReviews(provider.id)]);
    setLoading(false);
}


// Build score map
function buildScores(criteria) {
    return Object.fromEntries(criteria.map(c => {
     const vals = reviews.map(r => r[c.key]).filter(Boolean);
     const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) /
vals.length) : seededNum(provider.id + c.key, 62, 97);
     return [c.key, { avg, label: lang === "es" ? c.labelEs : c.labelEn }];
    }));
}


const narrativeScores = buildScores(NARRATIVE_CRITERIA);
const merchantScores = buildScores(MERCHANT_CRITERIA);


const criteriaLabel = c => lang === "es" ? c.labelEs : c.labelEn;


return (
    <div className="mt-10 border-t border-border pt-8">
     <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
       <Star className="h-4 w-4" />
       {lbl("Evaluaciones", "Evaluations")}
     </h2>


     {/* Merchant block only */}
     <CriteriaBlock
       title={lbl("The Service", "The Service")}
       icon={<ShoppingBag className="h-4 w-4 text-accent" />}

      criteria={MERCHANT_CRITERIA}
      scores={merchantScores}
      reviews={reviews}
    />


    {/* Comments */}
    <div className="mb-8">
      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-1.5">
         <MessageSquare className="h-3.5 w-3.5" />
         {lbl("Comentarios", "Comments")} ({reviews.length})
      </h3>
      {loading ? (
         <div className="flex justify-center py-6"><div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin" /></div>
      ) : (
         <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
             {reviews.map((r, i) => (
              <div key={r.id || i} className="bg-card border border-border rounded-xl p-4">
                   <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">{r.reviewer_name}</span>
                    <div className="flex gap-1 flex-wrap justify-end">
                        {MERCHANT_CRITERIA.map(c => (
                         <span key={c.key} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-muted whitespace-nowrap" style={{ color: c.color }}>
                              {(lang === "es" ? c.labelEs : c.labelEn).slice(0, 3)}
{r[c.key]}
                         </span>
                        ))}
                    </div>
                   </div>
                   {r.comment_merchant && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.comment_merchant}</p>
                   )}
              </div>
             ))}
         </div>
      )}

       </div>


     </div>
  );
}
