import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Trash2, ChevronUp, ChevronDown, Send, Loader2 } from
"lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";


export default function OrderCart({ items, onRemove, onClear }) {
 const { toast } = useToast();
 const [open, setOpen] = useState(false);
 const [submitting, setSubmitting] = useState(false);


 const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

const count = items.reduce((sum, i) => sum + i.quantity, 0);


const handleSubmit = async () => {
  setSubmitting(true);
  await base44.entities.Order.create({
     items,
     total,
     status: "submitted"
  });
  setSubmitting(false);
  setOpen(false);
  onClear();
  toast({
     title: "Order sent to the kitchen!",
     description: `${count} item${count > 1 ? "s" : ""} ·
$${total.toFixed(2)}`,
  });
};


if (count === 0) return null;


return (
  <>
     {/* Floating cart button */}
     <motion.button
         initial={{ scale: 0, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         onClick={() => setOpen(true)}
         className="fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground h-14 pl-4 pr-5 rounded-full shadow-xl flex items-center gap-3 hover:bg-primary/90 transition-colors"
     >
         <ShoppingBag className="w-5 h-5" />
         <span className="font-semibold text-sm">View Order</span>
         <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
          {count}
         </div>
     </motion.button>


     {/* Drawer */}

    <AnimatePresence>
      {open && (
        <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
        >
             <motion.div
                 className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                 onClick={() => setOpen(false)}
             />
             <motion.div
                 initial={{ y: "100%" }}
                 animate={{ y: 0 }}
                 exit={{ y: "100%" }}
                 transition={{ type: "spring", damping: 28, stiffness: 300 }}
                 className="relative bg-card w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
             >
                 {/* Header */}
                 <div className="flex items-center justify-between p-5 border-b border-border">
                  <div>
                      <h2 className="font-bold text-foreground text-lg">Your
Order</h2>
                      <p className="text-xs text-muted-foreground">{count}
item{count > 1 ? "s" : ""}</p>
                  </div>
                  <button
                      onClick={() => setOpen(false)}
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors"
                  >
                      <X className="w-4 h-4" />
                  </button>
                 </div>


                 {/* Items */}
                 <div className="flex-1 overflow-y-auto p-5 space-y-3">

              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                         <p className="font-medium text-sm text-foreground truncate">{item.name}</p>
                         <p className="text-accent font-semibold text-sm flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">qty:
{item.quantity} · ${item.price} each</p>
                        {item.customizations?.length > 0 && (
                         <p className="text-xs text-muted-foreground mt-0.5">{item.customizations.join(", ")}</p>
                        )}
                        {item.dietary?.length > 0 && (
                         <p className="text-xs text-muted-foreground">{item.dietary.join(" · ")}</p>
                        )}
                        {item.special_instructions && (
                         <p className="text-xs italic text-muted-foreground mt-0.5">"{item.special_instructions}"</p>
                        )}
                    </div>
                    <button
                        onClick={() => onRemove(i)}
                        className="text-muted-foreground hover:text-destructive transition-colors mt-0.5"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
              ))}
            </div>


            {/* Footer */}
            <div className="p-5 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Total</span>

                     <span className="text-xl font-bold text-foreground">${total.toFixed(2)}</span>
                   </div>
                   <Button onClick={handleSubmit} disabled={submitting}
className="w-full h-12 gap-2 text-base">
                     {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> :
<Send className="w-4 h-4" />}
                     {submitting ? "Sending..." : "Send to Kitchen"}
                   </Button>
                 </div>
                </motion.div>
            </motion.div>
           )}
       </AnimatePresence>
     </>
  );
}
