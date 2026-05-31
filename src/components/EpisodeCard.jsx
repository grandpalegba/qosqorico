import { Play } from "lucide-react";


export default function EpisodeCard({ episode, index, isActive, onClick }) {
 return (
    <button
        onClick={() => onClick(index)}
        className={`flex-shrink-0 w-full snap-center transition-all duration-300
${isActive ? "opacity-100" : "opacity-60"}`}
    >
        <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-lg mx-auto max-w-[360px]">
         <img
           src={episode.thumbnail_url}
           alt={episode.title}
           className="absolute inset-0 w-full h-full object-cover"
           loading="lazy"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />
         <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
           <span className="text-white/70 text-xs font-medium">{episode.subtitle}</span>
           <span className="bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">{episode.duration}</span>
         </div>
         <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 transition-transform hover:scale-110">
              <Play className="h-6 w-6 text-white fill-white ml-0.5" />
           </div>

          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-white font-bold text-lg">{episode.title}</h3>
            <p className="text-white/70 text-xs mt-1 line-clamp-2">{episode.description}</p>
          </div>
         </div>
     </button>
 );
}
