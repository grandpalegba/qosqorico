import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";


const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
 "January","February","March","April","May","June",
 "July","August","September","October","November","December"
];


export default function MiniCalendar({ selected, onSelect }) {
 const today = new Date();
 today.setHours(0, 0, 0, 0);


 const [viewDate, setViewDate] = useState(() => {
     const d = new Date();
     d.setDate(1);
     return d;
 });


 const year = viewDate.getFullYear();

const month = viewDate.getMonth();
const firstDay = new Date(year, month, 1).getDay();
const daysInMonth = new Date(year, month + 1, 0).getDate();


const cells = [];
for (let i = 0; i < firstDay; i++) cells.push(null);
for (let d = 1; d <= daysInMonth; d++) cells.push(d);


const prevMonth = () => {
 const d = new Date(viewDate);
 d.setMonth(d.getMonth() - 1);
 setViewDate(d);
};


const nextMonth = () => {
 const d = new Date(viewDate);
 d.setMonth(d.getMonth() + 1);
 setViewDate(d);
};


const handleDay = (day) => {
 if (!day) return;
 const d = new Date(year, month, day);
 d.setHours(0, 0, 0, 0);
 if (d < today) return;
 onSelect(d);
};


const isSelected = (day) => {
 if (!day || !selected) return false;
 return (
     selected.getFullYear() === year &&
     selected.getMonth() === month &&
     selected.getDate() === day
 );
};


const isPast = (day) => {
 if (!day) return false;
 const d = new Date(year, month, day);
 return d < today;

};


const isToday = (day) => {
  if (!day) return false;
  return (
     today.getFullYear() === year &&
     today.getMonth() === month &&
     today.getDate() === day
  );
};


return (
  <div className="bg-card rounded-2xl border border-border p-4 select-none">
     {/* Header */}
     <div className="flex items-center justify-between mb-4">
       <button
           onClick={prevMonth}
           className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
       >
           <ChevronLeft className="w-4 h-4 text-muted-foreground" />
       </button>
       <p className="font-semibold text-foreground text-sm">
           {MONTHS[month]} {year}
       </p>
       <button
           onClick={nextMonth}
           className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
       >
           <ChevronRight className="w-4 h-4 text-muted-foreground" />
       </button>
     </div>


     {/* Day headers */}
     <div className="grid grid-cols-7 mb-1">
       {DAYS.map(d => (
           <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
            {d}
           </div>

        ))}
      </div>


      {/* Grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => (
          <motion.button
              key={i}
              whileHover={day && !isPast(day) ? { scale: 1.1 } : {}}
              whileTap={day && !isPast(day) ? { scale: 0.9 } : {}}
              onClick={() => handleDay(day)}
              disabled={!day || isPast(day)}
              className={`w-8 h-8 mx-auto rounded-full text-xs font-medium
transition-all duration-150 ${
                  isSelected(day)
                    ? "bg-primary text-primary-foreground shadow"
                    : isToday(day)
                    ? "border border-primary text-primary font-bold"
                    : isPast(day) || !day
                    ? "text-muted-foreground opacity-30 cursor-not-allowed"
                    : "hover:bg-muted text-foreground"
              }`}
          >
              {day || ""}
          </motion.button>
        ))}
      </div>
    </div>
 );
}
