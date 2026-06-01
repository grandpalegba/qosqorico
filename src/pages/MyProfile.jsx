import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../lib/AuthContext";
import { useLang, T } from "../lib/LangContext";
import { useMyProviderProfile } from "../hooks/useProviders";
import { supabase } from "@/lib/supabaseClient";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { 
  User, Mail, MapPin, Globe, Calendar, Heart, 
  MessageSquare, Bell, Sparkles, BookOpen, ShoppingBag, 
  Edit3, Check, Loader2, PlusCircle 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

export default function MyProfile() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const { lang } = useLang();
  const t = T[lang];
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { data: myProvider, isLoading: loadingProvider } = useMyProviderProfile();
  
  // Tab control
  const activeTab = searchParams.get("tab") || "about";
  const setActiveTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  // State for editing personal info
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [languages, setLanguages] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);

  // Load lists
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.display_name || user.email?.split("@")[0] || "");
      setBio(user.user_metadata?.bio || "");
      setLocation(user.user_metadata?.location || "Cusco, Perú");
      setLanguages(user.user_metadata?.languages?.join(", ") || "Español");
      setAvatarUrl(user.user_metadata?.avatar_url || "");
    }
  }, [user]);

  // Load favorites when tab is active
  useEffect(() => {
    if (activeTab === "favorites" && user) {
      loadFavorites();
    } else if (activeTab === "messages" && user) {
      loadMessages();
    }
  }, [activeTab, user]);

  const loadFavorites = async () => {
    setLoadingFavorites(true);
    try {
      const favs = await base44.entities.Favorite.filter({ user_id: user.id });
      setFavorites(favs);
    } catch (e) {
      console.error("Error loading favorites:", e);
    }
    setLoadingFavorites(false);
  };

  const loadMessages = async () => {
    setLoadingMessages(true);
    try {
      const msgs = await base44.entities.Message.filter({ user_id: user.id });
      // Group or sort messages
      setMessages(msgs);
    } catch (e) {
      console.error("Error loading messages:", e);
    }
    setLoadingMessages(false);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updatedLangs = languages.split(",").map(l => l.trim()).filter(Boolean);
      await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          bio: bio,
          location: location,
          languages: updatedLangs,
          avatar_url: avatarUrl
        }
      });
      setIsEditing(false);
    } catch (e) {
      console.error("Error updating profile:", e);
    }
    setSaving(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const creationDate = user.created_at ? new Date(user.created_at).toLocaleDateString(
    lang === "es" ? "es-ES" : "en-US", 
    { month: 'long', year: 'numeric' }
  ) : "";

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background">
      <Header />
      
      <main className="pt-24 pb-16 max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Airbnb-style Profile Card */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="bg-card border border-border/80 shadow-sm rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-violet-500 via-primary to-orange-500" />
              
              {/* Profile Avatar */}
              <div className="relative group/avatar mt-4 mb-4">
                <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                    <span className="text-[10px] text-white font-bold">{lang === "es" ? "Editar" : "Edit"}</span>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-foreground mb-1">{displayName}</h2>
              <p className="text-xs text-muted-foreground mb-4 font-mono truncate max-w-full">{user.email}</p>

              {/* Badges / Roles */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {lang === "es" ? "Explorador" : "Explorer"}
                </span>
                {myProvider ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                    {lang === "es" ? "Prestario" : "Provider"}
                  </span>
                ) : null}
              </div>

              <div className="w-full border-t border-border/50 pt-4 text-left space-y-3.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-muted-foreground/80" />
                  <span>{lang === "es" ? `Miembro desde ${creationDate}` : `Member since ${creationDate}`}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-muted-foreground/80" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Globe className="h-4 w-4 text-muted-foreground/80" />
                  <span>{lang === "es" ? `Habla ${languages}` : `Speaks ${languages}`}</span>
                </div>
              </div>
            </div>

            {/* Editing Card (Shows when editing) */}
            {isEditing && (
              <div className="bg-card border border-border/80 shadow-sm rounded-3xl p-6 space-y-4 animate-in fade-in duration-200">
                <h3 className="font-bold text-sm text-foreground">{lang === "es" ? "Editar Información" : "Edit Information"}</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-muted-foreground mb-1 font-semibold">{lang === "es" ? "Nombre para mostrar" : "Display Name"}</label>
                    <input 
                      type="text" 
                      value={displayName} 
                      onChange={e => setDisplayName(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 font-semibold">{lang === "es" ? "URL del Avatar (Imagen)" : "Avatar URL (Image)"}</label>
                    <input 
                      type="text" 
                      value={avatarUrl} 
                      onChange={e => setAvatarUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 font-semibold">{lang === "es" ? "Ubicación" : "Location"}</label>
                    <input 
                      type="text" 
                      value={location} 
                      onChange={e => setLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 font-semibold">{lang === "es" ? "Idiomas (separados por comas)" : "Languages (comma separated)"}</label>
                    <input 
                      type="text" 
                      value={languages} 
                      onChange={e => setLanguages(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 font-semibold">Bio</label>
                    <textarea 
                      value={bio} 
                      onChange={e => setBio(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 text-xs" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <Check className="h-3.5 w-3.5 mr-1.5" />}
                    {lang === "es" ? "Guardar" : "Save"}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => setIsEditing(false)}>
                    {lang === "es" ? "Cancelar" : "Cancel"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Airbnb & Fiverr features */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Greeting Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                  {lang === "es" ? `Hola, soy ${displayName}` : `Hello, I'm ${displayName}`}
                  <Sparkles className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {lang === "es" ? "Gestiona tu presencia, comparte experiencias y revisa tu actividad." : "Manage your presence, share experiences, and view your activity."}
                </p>
              </div>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="w-fit gap-1.5 rounded-full border-border/80 text-xs font-semibold px-4 py-2 hover:shadow-sm">
                  <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{lang === "es" ? "Editar perfil" : "Edit profile"}</span>
                </Button>
              )}
            </div>

            {/* Incitations / Incentives Banner Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Participate in a Suyu/Series banner */}
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50/30 dark:from-violet-950/20 dark:to-background border border-violet-100 dark:border-violet-900/40 rounded-3xl p-6 flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-md">
                <div>
                  <div className="h-10 w-10 rounded-2xl bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-400 flex items-center justify-center mb-4">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="font-extrabold text-foreground text-base mb-1.5">{t.tellStoryIncentive}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {t.tellStoryIncentiveSub}
                  </p>
                </div>
                <Link to="/create-provider-profile">
                  <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white rounded-full text-xs font-bold gap-1.5 px-5">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>{t.getStarted}</span>
                  </Button>
                </Link>
              </div>

              {/* Offer a service banner */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50/30 dark:from-emerald-950/20 dark:to-background border border-emerald-100 dark:border-emerald-900/40 rounded-3xl p-6 flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-md">
                <div>
                  <div className="h-10 w-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <h3 className="font-extrabold text-foreground text-base mb-1.5">{t.offerServiceIncentive}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {t.offerServiceIncentiveSub}
                  </p>
                </div>
                <Link to="/create-provider-profile">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold gap-1.5 px-5">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>{t.getStarted}</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Fiverr-style Tabs Section */}
            <div className="bg-card border border-border/80 shadow-sm rounded-3xl overflow-hidden mt-2">
              <div className="flex border-b border-border bg-slate-50/50 dark:bg-muted/10 px-4">
                {[
                  { id: "about", label: lang === "es" ? "Sobre mí" : "About", icon: User },
                  { id: "favorites", label: lang === "es" ? "Favoritos" : "Favorites", icon: Heart },
                  { id: "messages", label: lang === "es" ? "Mensajes" : "Messages", icon: MessageSquare },
                  { id: "notifications", label: lang === "es" ? "Notificaciones" : "Notifications", icon: Bell }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-4 py-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                        isActive 
                          ? "border-primary text-primary" 
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Contents */}
              <div className="p-6 min-h-[220px]">
                
                {/* About Tab */}
                {activeTab === "about" && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Description</h4>
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {bio || (lang === "es" ? "Aún no has escrito una biografía. Haz clic en 'Editar perfil' para presentarte a la comunidad." : "No biography written yet. Click 'Edit profile' to introduce yourself to the community.")}
                      </p>
                    </div>
                    {myProvider && (
                      <div className="border-t border-border pt-4 mt-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                          {lang === "es" ? "Mi perfil de prestador" : "My provider profile"}
                        </h4>
                        <div className="bg-slate-50 dark:bg-muted/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-border/60">
                          <div>
                            <p className="text-sm font-bold text-foreground">{myProvider.display_name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{myProvider.tagline}</p>
                          </div>
                          <Link to={`/provider/${myProvider.id}`}>
                            <Button size="sm" variant="outline" className="text-xs rounded-full border-border/80">
                              {lang === "es" ? "Ver perfil público" : "View public profile"}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Favorites Tab */}
                {activeTab === "favorites" && (
                  <div>
                    {loadingFavorites ? (
                      <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                    ) : favorites.length === 0 ? (
                      <div className="text-center py-10">
                        <Heart className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-foreground">
                          {lang === "es" ? "No tienes favoritos guardados" : "No saved favorites yet"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {lang === "es" ? "Explora las series y haz clic en el corazón para guardarlos aquí." : "Explore the series and click the heart icon to save them here."}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {favorites.map(fav => (
                          <Link key={fav.id} to={`/provider/${fav.provider_id}`} className="group bg-slate-50 dark:bg-muted/10 border border-border/60 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                            <div className="aspect-[4/3] w-full overflow-hidden relative">
                              <img 
                                src={fav.poster_url} 
                                alt={fav.provider_name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={e => { e.target.src = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=200&fit=crop"; }}
                              />
                            </div>
                            <div className="p-3">
                              <p className="font-bold text-sm text-foreground leading-tight">{fav.provider_name}</p>
                              <p className="text-[10px] text-muted-foreground mt-1 truncate">{fav.series}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Messages Tab */}
                {activeTab === "messages" && (
                  <div>
                    {loadingMessages ? (
                      <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-10">
                        <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-foreground">
                          {lang === "es" ? "No hay mensajes recientes" : "No recent messages"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {lang === "es" ? "Contacta a los guías o prestadores para iniciar una conversación." : "Contact guides or providers to start a conversation."}
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/60">
                        {messages.map(msg => (
                          <div key={msg.id} className="py-3 flex gap-3 items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-foreground">{msg.sender_name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{msg.content}</p>
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(msg.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <div className="text-center py-10">
                    <Bell className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-foreground">
                      {lang === "es" ? "Sin notificaciones pendientes" : "No pending notifications"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {lang === "es" ? "Te avisaremos cuando recibas reservas o valoraciones." : "We'll let you know here when you receive bookings or reviews."}
                    </p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
