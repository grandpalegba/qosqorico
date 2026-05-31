import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DIETARY_LABELS } from "../../lib/menuData";


export default function MenuItemModal({ item, onClose, onAdd }) {
 const [quantity, setQuantity] = useState(1);
 const [selectedDietary, setSelectedDietary] = useState([]);
 const [selectedCustomizations, setSelectedCustomizations] = useState([]);
 const [specialInstructions, setSpecialInstructions] = useState("");


 const toggleDietary = (key) => {
    setSelectedDietary(prev =>

     prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key]
  );
};


const toggleCustomization = (c) => {
  setSelectedCustomizations(prev =>
     prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
  );
};


const handleAdd = () => {
  onAdd({
     item_id: item.id,
     name: item.name,
     price: item.price,
     quantity,
     dietary: selectedDietary,
     customizations: selectedCustomizations,
     special_instructions: specialInstructions
  });
  onClose();
};


return (
  <AnimatePresence>
     <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
     >
         {/* Backdrop */}
         <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
         />

      {/* Modal */}
      <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-card w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
      >
          {/* Image */}
          <div className="relative h-52 sm:h-60">
           <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
           <button
               onClick={onClose}
               className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
           >
               <X className="w-4 h-4" />
           </button>
           <div className="absolute bottom-0 left-0 right-0 p-5 pb-3">
               <h2 className="text-xl font-bold text-foreground">{item.name}</h2>
               <p className="text-accent font-semibold">${item.price}</p>
           </div>
          </div>


          <div className="p-5 space-y-5">
           {/* Description */}
           <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>


           {/* Dietary Preferences */}
           {item.dietary_options?.length > 0 && (
               <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                   Dietary Preferences

               </p>
               <div className="flex flex-wrap gap-2">
                {item.dietary_options.map(key => {
                    const info = DIETARY_LABELS[key];
                    if (!info) return null;
                    const isActive = selectedDietary.includes(key);
                    return (
                      <button
                          key={key}
                          onClick={() => toggleDietary(key)}
                          className={`px-3 py-1.5 rounded-full text-xs
font-medium border transition-all duration-150 ${
                           isActive
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : `${info.color} border`
                          }`}
                      >
                          {info.label}
                      </button>
                    );
                })}
               </div>
            </div>
          )}


          {/* Customizations */}
          {item.customizations?.length > 0 && (
            <div>
               <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Customizations
               </p>
               <div className="flex flex-wrap gap-2">
                {item.customizations.map(c => {
                    const isActive = selectedCustomizations.includes(c);
                    return (
                      <button
                          key={c}
                          onClick={() => toggleCustomization(c)}

                               className={`px-3 py-1.5 rounded-full text-xs
font-medium border transition-all duration-150 ${
                                isActive
                                     ? "bg-accent text-accent-foreground border-accent shadow-sm"
                                     : "bg-muted text-muted-foreground border-border hover:border-accent/60"
                               }`}
                           >
                               {c}
                           </button>
                      );
                     })}
                  </div>
              </div>
             )}


             {/* Special Instructions */}
             <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Special Instructions
              </p>
              <Textarea
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                  placeholder="Any allergies or special requests for the kitchen..."
                  rows={2}
                  className="text-sm resize-none"
              />
             </div>


             {/* Quantity + Add */}
             <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-3 bg-muted rounded-xl p-1">
                  <button
                     onClick={() => setQuantity(q => Math.max(1, q - 1))}
                     className="w-8 h-8 rounded-lg bg-card hover:bg-background flex items-center justify-center transition-colors shadow-sm"

                   >
                       <Minus className="w-3 h-3" />
                   </button>
                   <span className="w-6 text-center font-bold text-foreground">{quantity}</span>
                   <button
                       onClick={() => setQuantity(q => Math.min(10, q + 1))}
                       className="w-8 h-8 rounded-lg bg-card hover:bg-background flex items-center justify-center transition-colors shadow-sm"
                   >
                       <Plus className="w-3 h-3" />
                   </button>
                 </div>
                 <Button onClick={handleAdd} className="flex-1 gap-2 h-11">
                   <ShoppingBag className="w-4 h-4" />
                   Add to Order · ${(item.price * quantity).toFixed(2)}
                 </Button>
                </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
 );
}
