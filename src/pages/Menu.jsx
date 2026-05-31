import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Utensils, CalendarCheck } from "lucide-react";
import { MENU_CATEGORIES } from "../lib/menuData";
import MenuItemCard from "../components/menu/MenuItemCard";
import MenuItemModal from "../components/menu/MenuItemModal";
import OrderCart from "../components/menu/OrderCart";
import { Button } from "@/components/ui/button";


export default function Menu() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0].id);
  const [cartItems, setCartItems] = useState([]);

  const handleAdd = (cartItem) => {
    setCartItems(prev => [...prev, cartItem]);
  };

  const handleRemove = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const currentCategory = MENU_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="border-b border-border bg-card/70 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground text-sm">Our Menu</span>
          </div>
          <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs hidden sm:flex">
            <Link to="/reservations">
              <CalendarCheck className="w-3.5 h-3.5" />
              Reserve a Table
            </Link>
          </Button>
          <div className="sm:hidden w-16" />
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-52 md:h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&h=500&fit=crop"
          alt="Menu"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-xs font-bold uppercase tracking-widest text-accent/90 mb-2">Qosqorico</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">The Menu</h1>
          <p className="text-white/70 text-sm max-w-md">
            Andean flavors, refined. Click any dish to customize your order.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 py-3 overflow-x-auto scrollbar-hide">
            {MENU_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {cat.name}
                <span className="ml-1.5 text-xs opacity-70">({cat.items.length})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">{currentCategory?.name}</h2>
            <p className="text-sm text-muted-foreground">{currentCategory?.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentCategory?.items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <MenuItemCard
                  item={item}
                  onClick={() => setSelectedItem(item)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA to reserve */}
        <div className="mt-16 rounded-3xl bg-primary/5 border border-primary/20 p-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Ready for the full experience?</p>
          <h3 className="text-2xl font-bold text-foreground mb-3">Reserve Your Table</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
            Book a seat and let us craft an unforgettable Andean dinner for you.
          </p>
          <Button asChild className="gap-2">
            <Link to="/reservations">
              <CalendarCheck className="w-4 h-4" />
              Make a Reservation
            </Link>
          </Button>
        </div>
      </div>

      {/* Item Modal */}
      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAdd={handleAdd}
        />
      )}

      {/* Cart */}
      <OrderCart
        items={cartItems}
        onRemove={handleRemove}
        onClear={() => setCartItems([])}
      />
    </div>
  );
}
