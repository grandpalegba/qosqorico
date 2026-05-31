import { motion } from "framer-motion";
import { Plus } from "lucide-react";


const TAG_COLORS = {

"gluten-free": "bg-yellow-100 text-yellow-700",
"vegetarian": "bg-lime-100 text-lime-700",
"vegan": "bg-green-100 text-green-700",
"seafood": "bg-cyan-100 text-cyan-700",
"popular": "bg-orange-100 text-orange-700",
"signature": "bg-primary/10 text-primary",
"chef's pick": "bg-accent/20 text-accent-foreground",
"cocktail": "bg-purple-100 text-purple-700",
"non-alcoholic": "bg-blue-100 text-blue-700"
};


export default function MenuItemCard({ item, onClick }) {
return (
     <motion.div
         whileHover={{ y: -3 }}
         whileTap={{ scale: 0.98 }}
         onClick={onClick}
         className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-shadow duration-200"
     >
         {/* Image */}
         <div className="relative h-44 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {/* Add button */}
          <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-primary shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
            <Plus className="w-4 h-4 text-primary-foreground" />
          </div>
          {/* Tags */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {item.tags?.slice(0, 2).map(tag => (

            <span key={tag} className={`text-[10px] font-semibold px-2 py-0.5
rounded-full capitalize ${TAG_COLORS[tag] || "bg-muted text-muted-foreground"}`}>
               {tag}
            </span>
         ))}
       </div>
      </div>


      {/* Content */}
      <div className="p-4">
       <div className="flex items-start justify-between gap-2 mb-1">
         <h3 className="font-semibold text-foreground text-sm leading-tight">{item.name}</h3>
         <span className="text-accent font-bold text-sm flex-shrink-0">${item.price}</span>
       </div>
       <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.description}</p>
      </div>
    </motion.div>
 );
}
