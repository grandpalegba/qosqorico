import { motion } from "framer-motion";
import { Clock } from "lucide-react";


export default function ServiceCard({ service, selected, onSelect }) {
 return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(service.id)}

        className={`w-full text-left p-5 rounded-2xl border-2 transition-all
duration-200 ${
         selected
              ? "border-primary bg-primary/5 shadow-md"
              : "border-border bg-card hover:border-primary/40 hover:bg-card/80"
        }`}
    >
        <div className="flex items-start gap-4">
         <span className="text-3xl">{service.icon}</span>
         <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-base">{service.name}</p>
              <p className="text-sm text-muted-foreground mb-1">{service.subtitle}</p>
              <p className="text-xs text-muted-foreground leading-relaxed hidden sm:block">{service.description}</p>
              <div className="flex items-center gap-1 mt-2">
               <Clock className="w-3 h-3 text-accent" />
               <span className="text-xs text-accent font-medium">{service.duration}</span>
              </div>
         </div>
         {selected && (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
               <div className="w-2 h-2 rounded-full bg-primary-foreground" />
              </div>
         )}
        </div>
    </motion.button>
 );
}
