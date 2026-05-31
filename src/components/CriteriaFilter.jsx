import { motion, AnimatePresence } from "framer-motion";


const CRITERIA = [
 {
     key: "authenticity",
     labelEs: "Autenticidad",
     labelEn: "Authenticity",
     color: "#AD281F",
     bg: "bg-red-50",
     ring: "ring-red-300",
     activeBg: "bg-red-700",
     icon: "  🌿"
 },
 {
     key: "originality",
     labelEs: "Originalidad",
     labelEn: "Originality",
     color: "#C38322",
     bg: "bg-amber-50",
     ring: "ring-amber-300",
     activeBg: "bg-amber-600",

     icon: " ✨"
},
{
     key: "impact",
     labelEs: "Impacto",
     labelEn: "Impact",
     color: "#2A7A5A",
     bg: "bg-emerald-50",
     ring: "ring-emerald-300",
     activeBg: "bg-emerald-700",
     icon: " 🏔"
}
];


export default function CriteriaFilter({ active, minScore, onSelect,
onScoreChange, lang }) {
const label = (c) => lang === "es" ? c.labelEs : c.labelEn;
const activeInfo = CRITERIA.find(c => c.key === active);


return (
     <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
        {lang === "es" ? "Filtrar por criterio" : "Filter by criterion"}
      </p>
      <div className="flex flex-wrap gap-2">
        {CRITERIA.map(c => {
             const isActive = active === c.key;
             return (
               <motion.button
                key={c.key}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelect(isActive ? null : c.key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
text-xs font-semibold border transition-all duration-200 ${
                  isActive
                      ? "text-white border-transparent shadow-md"
                      : "bg-card border-border text-muted-foreground hover:border-border/60 hover:text-foreground"
                }`}

                style={isActive ? { backgroundColor: c.color, borderColor:
c.color } : {}}
            >
                <span>{c.icon}</span>
                {label(c)}
            </motion.button>
        );
      })}
    </div>


    {/* Score slider — only when a criterion is active */}
    <AnimatePresence>
      {active && activeInfo && (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
        >
            <div className="mt-3 flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                    {lang === "es" ? "Mín." : "Min."} {label(activeInfo)}
                </span>
                <input
                    type="range"
                    min={50}
                    max={95}
                    step={5}
                    value={minScore}
                    onChange={e => onScoreChange(Number(e.target.value))}
                    className="flex-1 h-1.5 rounded-full accent-current cursor-pointer"
                    style={{ accentColor: activeInfo.color }}
                />
                <span
                    className="text-xs font-bold w-10 text-right"
                    style={{ color: activeInfo.color }}
                >
                    {minScore}+
                </span>

              </div>
           </motion.div>
         )}
        </AnimatePresence>
    </div>
 );
}
