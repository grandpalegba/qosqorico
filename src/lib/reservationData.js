export const SERVICES = [
 {
     id: "Dining Experience",
     name: "Dining Experience",
     subtitle: "À la carte dinner",
     description: "A refined à la carte journey through our seasonal Andean menu.",
     duration: "2–3 hours",
     icon: "🍽️"
 },
 {
     id: "Chef's Table",
     name: "Chef's Table",
     subtitle: "Exclusive 6-course tasting",
     description: "Six curated courses with wine pairing — a personal experience with our head chef.",
     duration: "3–4 hours",
     icon: "👨‍🍳"
 },
 {
     id: "Tasting Menu",
     name: "Tasting Menu",
     subtitle: "8-course degustation",
     description: "Our full degustation with optional wine pairings. The complete Qosqorico experience.",
     duration: "4 hours",
     icon: "✨"
 },
 {
     id: "Private Event",
     name: "Private Event",
     subtitle: "Exclusive venue hire",
     description: "Exclusive use of our dining room or terrace for celebrations and corporate events.",
     duration: "Custom",
     icon: "🥂"
 }
];

export const TIME_SLOTS = [
"12:00", "12:30", "13:00", "13:30",
"19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
];

// Simulate some already-booked slots
export const BOOKED_SLOTS = {
// date -> array of booked time slots
};

export function getAvailableSlots(date, existingReservations) {
const dateStr = date instanceof Date ? date.toISOString().split("T")[0] : date;
const booked = existingReservations
     .filter(r => r.date === dateStr && r.status !== "cancelled")
     .map(r => r.time_slot);
return TIME_SLOTS.filter(slot => !booked.includes(slot));
}
