import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { base44 } from "@/api/base44Client";


export default function FavoriteButton({ provider, className = "" }) {
 const [isFav, setIsFav] = useState(false);
 const [favId, setFavId] = useState(null);
 const [loading, setLoading] = useState(true);


 useEffect(() => {
     checkFav();
 }, [provider.id]);


 async function checkFav() {
     setLoading(true);
     const favs = await base44.entities.Favorite.filter({ provider_id:
provider.id });
     if (favs.length > 0) {
         setIsFav(true);
         setFavId(favs[0].id);
     } else {
         setIsFav(false);
         setFavId(null);
     }
     setLoading(false);
 }


 async function toggle(e) {

     e.preventDefault();
     e.stopPropagation();
     if (loading) return;
     setLoading(true);
     if (isFav && favId) {
         await base44.entities.Favorite.delete(favId);
         setIsFav(false);
         setFavId(null);
     } else {
         const created = await base44.entities.Favorite.create({
          provider_id: provider.id,
          provider_name: provider.full_name || provider.name,
          poster_url: provider.poster_url || "",
          series: provider.series || ""
         });
         setIsFav(true);
         setFavId(created.id);
     }
     setLoading(false);
 }


 return (
     <button
         onClick={toggle}
         className={`p-1.5 rounded-full transition-all duration-200 ${isFav ?
"text-red-500 bg-red-50" : "text-muted-foreground hover:text-red-400 bg-black/20 hover:bg-black/30"} ${className}`}
         title={isFav ? "Remove from favorites" : "Add to favorites"}
     >
         <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-red-500" : ""}`} />
     </button>
 );
}
