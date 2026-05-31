import { Link } from "react-router-dom";
import { Mountain, CalendarDays, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang, T } from "../lib/LangContext";
import { useAuth } from "../lib/AuthContext";


export default function Header() {
 const { lang, setLang } = useLang();
 const t = T[lang];
 const { isAuthenticated } = useAuth();


 return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 h-14">
        <Link to="/" className="flex items-center gap-2">
             <Mountain className="h-6 w-6 text-primary" />
             <span className="text-base font-bold tracking-widest text-primary">QOSQORICO</span>
        </Link>
        <div className="flex items-center gap-2">
             <div className="flex items-center border border-border rounded-full overflow-hidden text-xs font-semibold">

          <button
              onClick={() => setLang("es")}
              className={`px-2.5 py-1 transition-colors ${lang === "es" ?
"bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
          >
              ES
          </button>
          <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 transition-colors ${lang === "en" ?
"bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
          >
              EN
          </button>
        </div>
        {isAuthenticated && (
          <>
              <Link to="/my-reservations" className="hidden sm:flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>{lang === "es" ? "Mis Reservas" : "My Bookings"}</span>
              </Link>
              <Link to="/settings" className="hidden sm:flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                <Settings className="h-3.5 w-3.5" />
                <span>{lang === "es" ? "Parámetros" : "Settings"}</span>
              </Link>
          </>
        )}
        <Link to="/login">
          <Button variant="ghost" size="sm" className="text-sm hidden sm:inline-flex">{t.login}</Button>
        </Link>
        <Link to="/register">
          <Button size="sm" className="text-sm bg-primary text-primary-foreground hover:bg-primary/90">{t.register}</Button>
        </Link>

          </div>
      </div>
    </header>
 );
}
