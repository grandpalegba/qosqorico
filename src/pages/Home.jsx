import { useState } from "react";
import Header from "../components/Header";
import SeriesRow from "../components/SeriesRow";
import SearchBar from "../components/SearchBar";
import ProvidersMap from "../components/ProvidersMap";
import CriteriaFilter from "../components/CriteriaFilter";
import { SUYUS } from "../lib/data";
import { useLang, T } from "../lib/LangContext";


const HERO_IMG = "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1400&h=600&fit=crop";


// Seeded score per series per criterion (same logic as Profile page)
function seededNum(str, min, max) {
 let h = 0;
 for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) %
9973;
 return min + (h % (max - min));
}


const CRITERIA_KEYS = ["authenticity", "originality", "impact"];


function getSeriesScore(seriesName, criterion) {
 return seededNum(seriesName + criterion, 50, 100);
}


export default function Home() {

const { lang } = useLang();
const t = T[lang];
const [searchQuery, setSearchQuery] = useState("");
const [criteriaFilter, setCriteriaFilter] = useState(null);
const [minScore, setMinScore] = useState(70);
const [advFilters, setAdvFilters] = useState({ lang: "", location: "",
price: "all" });


const PRICE_RANGES = { low: { max: 50 }, medium: { min: 50, max: 100 },
high: { min: 100 } };


const filterSeries = (series) => {
  const q = searchQuery.toLowerCase().trim();
  const textMatch = !q ||
      series.title?.toLowerCase().includes(q) ||
      series.name?.toLowerCase().includes(q) ||
      (series.keywords && series.keywords.some(k =>
k.toLowerCase().includes(q)));
  const criteriaMatch = !criteriaFilter ||
      getSeriesScore(series.name, criteriaFilter) >= minScore;


  // Advanced filters applied to keywords/name as proxies (real filtering
  // happens on provider level)
  const { lang: langF, location: locF, price: priceF } = advFilters;
  const langMatch = !langF || (series.keywords && series.keywords.some(k =>
k.toLowerCase().includes(langF.toLowerCase()))) ||
series.name.toLowerCase().includes(langF.toLowerCase());
  const locMatch = !locF || (series.keywords && series.keywords.some(k =>
k.toLowerCase().includes(locF.toLowerCase())));
  // Price filter: use seeded price proxy per series
  let priceMatch = true;
  if (priceF && priceF !== "all") {
      const range = PRICE_RANGES[priceF];
      const proxy = seededNum(series.name + "price", 20, 220);
      if (range.min && proxy < range.min) priceMatch = false;
      if (range.max && proxy > range.max) priceMatch = false;
  }


  return textMatch && criteriaMatch && langMatch && locMatch && priceMatch;
};

const filteredSuyus = SUYUS.map(suyu => ({
  ...suyu,
  series: suyu.series.filter(filterSeries)
})).filter(suyu => suyu.series.length > 0);


return (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-20 pb-12 max-w-screen-lg mx-auto">


      {/* Hero section */}
      <div className="mx-4 md:mx-0 mb-10 rounded-2xl overflow-hidden relative">
        <img src={HERO_IMG} alt="Cusco" className="w-full h-56 md:h-72 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
             <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Qosqorico</p>
              <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-3">
                {lang === "es"
                   ? "Voces aut\u00e9nticas del coraz\u00f3n del mundo"
                   : "Authentic voices from the heart of the world"}
              </h1>
              <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-xl">
                {lang === "es"
                   ? "Una plataforma inmersiva donde los guardianes de la cultura cusque\u00f1a comparten su historia, su arte y su sabidur\u00eda. Descubre Cusco a trav\u00e9s de quienes lo viven desde adentro."
                   : "An immersive platform where the guardians of Cusco's culture share their story, art, and wisdom. Discover Cusco through the eyes of those who truly live it."}
              </p>
             </div>
        </div>
      </div>

        {/* Criteria filter */}
        {!searchQuery && (
          <div className="px-4 md:px-0 mb-6">
              <CriteriaFilter
                active={criteriaFilter}
                minScore={minScore}
                onSelect={setCriteriaFilter}
                onScoreChange={setMinScore}
                lang={lang}
              />
          </div>
        )}


        {/* Search bar */}
        <div className="px-4 md:px-0 mb-6">
          <SearchBar onSearch={setSearchQuery} onFiltersChange={setAdvFilters}
/>
          {searchQuery && filteredSuyus.length === 0 && (
              <p className="text-sm text-muted-foreground mt-3">
                {lang === "es" ? "Sin resultados para" : "No results for"}
&ldquo;{searchQuery}&rdquo;
              </p>
          )}
        </div>


        {!searchQuery && (
          <div className="px-4 md:px-0 mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{t.discover}</h2>
              <p className="text-sm text-muted-foreground">{t.discoverSub}</p>
          </div>
        )}


        {filteredSuyus.map((suyu) => (
          <SeriesRow key={suyu.id} suyu={suyu} />
        ))}


        {!searchQuery && <ProvidersMap />}
      </main>
     </div>
 );
}
