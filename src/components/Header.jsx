import { Link, useNavigate } from "react-router-dom";
import { Mountain, Bell, Mail, Heart, Menu, User, CalendarDays, Settings, LogOut, HelpCircle, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang, T } from "../lib/LangContext";
import { useAuth } from "../lib/AuthContext";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
 const { lang, setLang } = useLang();
 const t = T[lang];
 const { user, isAuthenticated, logout } = useAuth();
 const navigate = useNavigate();

 // Simple role check placeholder (can be expanded later)
 const isProvider = user?.user_metadata?.role === 'provider';

 return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
             <Mountain className="h-7 w-7 text-primary" />
             <span className="text-lg font-extrabold tracking-tight text-primary">QOSQORICO</span>
        </Link>
        
        {/* Right Side: Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
             
          {/* Language Toggle (only if logged out) */}
          {!isAuthenticated && (
            <div className="hidden sm:flex items-center border border-border rounded-full overflow-hidden text-xs font-semibold">
              <button
                  onClick={() => setLang("es")}
                  className={`px-2.5 py-1.5 transition-colors ${lang === "es" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
              >
                  ES
              </button>
              <button
                  onClick={() => setLang("en")}
                  className={`px-2.5 py-1.5 transition-colors ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
              >
                  EN
              </button>
            </div>
          )}

          {!isAuthenticated ? (
            <>
              {/* Logged Out State - No Devenir Prestataire */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full flex items-center gap-2 px-3 py-5 hover:shadow-md transition-all border-border/60">
                    <Menu className="h-4 w-4 text-muted-foreground" />
                    <div className="bg-muted text-muted-foreground rounded-full p-1">
                      <User className="h-4 w-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl">
                  <DropdownMenuItem className="font-bold cursor-pointer" onClick={() => navigate("/register")}>
                    {t.register}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/login")}>
                    {t.login}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-muted-foreground">
                    {lang === "es" ? "Centro de ayuda" : "Help Center"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Logged In State — Show Participate & Propose links, hide icons */}
              <div className="hidden md:flex items-center gap-5 mr-2">
                <Link to="/create-provider-profile" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                  {t.participateSeries}
                </Link>
                <Link to="/create-provider-profile" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                  {t.proposeService}
                </Link>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden hover:ring-2 ring-primary/20 transition-all">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt="Avatar" />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user?.email?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                    {/* Green online dot */}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 mt-2 rounded-xl">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none truncate">{user?.email}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{lang === "es" ? "Explorador / Prestario" : "Explorer / Provider"}</p>
                  </div>
                  <DropdownMenuSeparator />
                  
                  {/* Dropdown Items in priority order */}
                  <DropdownMenuItem className="cursor-pointer font-semibold" onClick={() => navigate("/profile")}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>{t.profile}</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/my-reservations")}>
                    <CalendarDays className="mr-2 h-4 w-4" />
                    <span>{t.myReservations}</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t.settings}</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Logged-in gated icons now as menu options */}
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile?tab=favorites")}>
                    <Heart className="mr-2 h-4 w-4" />
                    <span>{lang === "es" ? "Favoritos" : "Favorites"}</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile?tab=messages")}>
                    <Mail className="mr-2 h-4 w-4" />
                    <span>{lang === "es" ? "Mensajes" : "Messages"}</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile?tab=notifications")}>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>{lang === "es" ? "Notificaciones" : "Notifications"}</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Language Toggle inside Profile Menu when connected */}
                  <div className="flex items-center justify-between px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground">
                    <span>{lang === "es" ? "Idioma" : "Language"}</span>
                    <div className="flex items-center border border-border rounded-full overflow-hidden text-[10px]">
                      <button
                        onClick={(e) => { e.stopPropagation(); setLang("es"); }}
                        className={`px-2 py-1 transition-colors ${lang === "es" ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted"}`}
                      >
                        ES
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setLang("en"); }}
                        className={`px-2 py-1 transition-colors ${lang === "en" ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted"}`}
                      >
                        EN
                      </button>
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{lang === "es" ? "Cerrar sesión" : "Log out"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

        </div>
      </div>
    </header>
  );
}
