import { motion } from "framer-motion";


export default function TimeSlotPicker({ slots, allSlots, selected, onSelect
}) {
 const isAvailable = (slot) => slots.includes(slot);


 const lunch = allSlots.filter(s => parseInt(s) < 17);

const dinner = allSlots.filter(s => parseInt(s) >= 17);


const Group = ({ label, times }) => (
  <div className="mb-5">
     <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">{label}</p>
     <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
      {times.map(slot => {
          const available = isAvailable(slot);
          const isSelected = selected === slot;
          return (
            <motion.button
                key={slot}
                whileHover={available ? { scale: 1.05 } : {}}
                whileTap={available ? { scale: 0.95 } : {}}
                disabled={!available}
                onClick={() => available && onSelect(slot)}
                className={`py-2.5 px-1 rounded-xl text-sm font-medium
transition-all duration-150 ${
                 isSelected
                      ? "bg-primary text-primary-foreground shadow-md"
                      : available
                      ? "bg-card border border-border hover:border-primary/60 text-foreground"
                      : "bg-muted text-muted-foreground line-through cursor-not-allowed opacity-50"
                }`}
            >
                {slot}
            </motion.button>
          );
      })}
     </div>
  </div>
);


return (
  <div>
     <Group label="Lunch Service" times={lunch} />
     <Group label="Dinner Service" times={dinner} />
  </div>

 );
}
