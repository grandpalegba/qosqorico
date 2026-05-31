import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { base44 } from "@/api/base44Client";

function SeriesCard({ s, suyu }) {
const [isFav, setIsFav] = useState(false);


// Lazy-check fav on hover to avoid N api calls on render
async function handleHeartClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
        const favs = await base44.entities.Favorite.filter({ provider_id:
"series-" + s.name });
        if (favs[0]) await base44.entities.Favorite.delete(favs[0].id);
        setIsFav(false);
    } else {
        await base44.entities.Favorite.create({
         provider_id: "series-" + s.name,
         provider_name: s.name,
         poster_url: s.image || "",
         series: s.name
        });
        setIsFav(true);
    }
}


return (
    <Link
        to={`/series/${encodeURIComponent(s.name)}`}
        className="flex-shrink-0 group w-[150px] md:w-[170px]"
    >
        {/* Poster */}
        <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-md transition-all duration-200 group-hover:scale-105 group-hover:shadow-xl">
         <img
              src={s.image}
              alt={s.name}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { e.target.src =
"https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&h=900&fit=crop"; }}

      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />


      {/* Suyu color dot */}
      <div
          className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full ring-1 ring-white/40"
          style={{ backgroundColor: suyu.color }}
      />


      {/* Heart button */}
      <button
          onClick={handleHeartClick}
          className="absolute bottom-2.5 right-2.5 p-1 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all"
      >
          <Heart className={`h-3 w-3 ${isFav ? "fill-red-400 text-red-400" :
"text-white/70"}`} />
      </button>


      {/* Keywords */}
      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {s.keywords?.slice(0, 3).map((kw) => (
           <span
                key={kw}
                className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-black/50 text-white/90 backdrop-blur-sm leading-none"
           >
                {kw}
           </span>
          ))}
      </div>


      <div className="absolute bottom-0 left-0 right-0 p-3 pb-8">
          <p className="text-white text-xs font-semibold leading-tight">{s.name}</p>
      </div>




    </div>

     {/* Synopsis */}
     <p className="mt-2 text-[11px] text-muted-foreground leading-snug line-clamp-2">
       {s.synopsis}
     </p>
    </Link>
);
}


export default function SeriesRow({ suyu }) {
const scrollRef = useRef(null);
const [canScrollLeft, setCanScrollLeft] = useState(false);
const [canScrollRight, setCanScrollRight] = useState(true);


const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: "smooth" });
};


const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
};


return (
    <section className="mb-12">
     <div className="flex items-baseline gap-3 px-4 md:px-0 mb-4">
       <h2 className="text-lg font-bold text-foreground">{suyu.name}</h2>
       <span className="text-xs font-medium text-muted-foreground tracking-wide">{suyu.subtitle}</span>
     </div>


     <div className="relative group/row">
       {canScrollLeft && (
         <button
              onClick={() => scroll(-1)}

                className="absolute left-0 top-[40%] -translate-y-1/2 z-10 w-8 h-8 bg-background/90 backdrop-blur shadow-md rounded-full flex items-center justify-center border border-border hover:bg-background transition-all"
            >
                <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
        )}
        {canScrollRight && (
            <button
                onClick={() => scroll(1)}
                className="absolute right-0 top-[40%] -translate-y-1/2 z-10 w-8 h-8 bg-background/90 backdrop-blur shadow-md rounded-full flex items-center justify-center border border-border hover:bg-background transition-all"
            >
                <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
        )}


        <div
            ref={scrollRef}
            onScroll={onScroll}
            className="flex gap-4 overflow-x-auto px-4 md:px-0 pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
            {suyu.series.map((s) => (
                <SeriesCard key={s.name} s={s} suyu={suyu} />
            ))}
            <div className="flex-shrink-0 w-4" />
        </div>
      </div>
    </section>
 );
}
