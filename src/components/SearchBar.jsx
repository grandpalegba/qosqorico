import { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useLang } from "../lib/LangContext";


const LANGUAGES = ["Español", "English", "Quechua", "Français"];


export default function SearchBar({ onSearch, onFiltersChange }) {
 const [query, setQuery] = useState("");
 const [showFilters, setShowFilters] = useState(false);
 const [lang_, setLangFilter] = useState("");
 const { lang } = useLang();
 const ref = useRef(null);


 useEffect(() => {
    function onClick(e) { if (ref.current && !ref.current.contains(e.target))
setShowFilters(false); }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
 }, []);

const lbl = (es, en) => lang === "es" ? es : en;


function handleChange(e) {
    setQuery(e.target.value);
    onSearch(e.target.value);
}


function clear() {
    setQuery("");
    onSearch("");
}


function applyFilters(newLang) {
    onFiltersChange?.({ lang: newLang, location: "", price: "all" });
}


function setAndApplyLang(v) { setLangFilter(v); applyFilters(v); }


function clearAll() {
    setLangFilter("");
    applyFilters("");
}


const activeCount = lang_ ? 1 : 0;


return (
    <div className="relative max-w-xl" ref={ref}>
     <div className="flex gap-2">
       {/* Search input */}
       <div className="relative flex-1">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
         <input
           type="text"
           value={query}
           onChange={handleChange}
           placeholder={lbl("Buscar series, categorías, proveedores…",
"Search series, categories, providers…")}

           className="w-full h-10 pl-9 pr-9 rounded-full border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          {query && (
           <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
               <X className="h-4 w-4" />
           </button>
          )}
      </div>


      {/* Filter button */}
      <button
          onClick={() => setShowFilters(v => !v)}
          className={`flex items-center gap-1.5 px-3.5 h-10 rounded-full
border text-xs font-semibold transition-all ${showFilters || activeCount > 0
? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}
      >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          {lbl("Filtros", "Filters")}
          {activeCount > 0 && (
           <span className="bg-white/30 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">{activeCount}</span>
          )}
      </button>
    </div>


    {/* Dropdown panel */}
    {showFilters && (
      <div className="absolute left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl z-30 p-4 space-y-4">


          {/* Language */}
          <div>
           <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{lbl("Idioma", "Language")}</p>
           <div className="flex flex-wrap gap-1.5">
               <button

                    onClick={() => setAndApplyLang("")}
                    className={`px-3 py-1 rounded-full text-xs font-medium border
transition-all ${!lang_ ? "bg-primary text-primary-foreground border-primary"
: "border-border text-muted-foreground hover:text-foreground"}`}
                >
                    {lbl("Todos", "All")}
                </button>
                {LANGUAGES.map(l => (
                    <button
                        key={l}
                        onClick={() => setAndApplyLang(l === lang_ ? "" : l)}
                        className={`px-3 py-1 rounded-full text-xs font-medium
border transition-all ${lang_ === l ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
                    >
                        {l}
                    </button>
                ))}
             </div>
           </div>


           {activeCount > 0 && (
             <button onClick={clearAll} className="text-xs text-destructive hover:underline font-medium">
                {lbl("Limpiar filtros", "Clear filters")}
             </button>
           )}
        </div>
      )}
    </div>
 );
}
