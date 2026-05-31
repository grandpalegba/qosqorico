import { X, MapPin, Star, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function ServicePanel({ provider, open, onClose }) {
 if (!open) return null;

return (
  <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
    <div
        className="relative w-full max-w-md bg-card h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
    >
        <div className="sticky top-0 bg-card/90 backdrop-blur-md z-10 flex items-center justify-between p-4 border-b border-border">
         <h2 className="font-bold text-foreground">{"Servicios & Productos"}</h2>
         <button onClick={onClose} className="p-1 rounded-full hover:bg-muted transition-colors">
           <X className="h-5 w-5 text-muted-foreground" />
         </button>
        </div>


        <div className="p-4 border-b border-border">
         <h3 className="font-bold text-foreground">{provider.full_name}</h3>
         <p className="text-xs text-muted-foreground mt-1">{provider.bio}</p>
         <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
           <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{provider.location}</span>
           <span className="flex items-center gap-1"><Star className="h-3 w-3 text-accent fill-accent" />{provider.rating}</span>
           <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{provider.languages.join(", ")}</span>
         </div>
        </div>


        <div className="p-4 space-y-3">
         {provider.services.map((s, i) => (
           <div key={i} className="bg-background rounded-xl p-4 border border-border">
             <div className="flex items-start justify-between gap-3">
                 <div className="flex-1">
                   <h4 className="font-semibold text-sm text-foreground">{s.name}</h4>

                    <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{s.duration}</span>
                    </div>
                 </div>
                 <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-primary">${s.price}</p>
                    <p className="text-[10px] text-muted-foreground">{s.currency}</p>
                 </div>
                </div>
                <Button className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                 Reservar
                </Button>
             </div>
          ))}
        </div>
      </div>
    </div>
 );
}
