import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import Header from "../components/Header";
import { useLang } from "../lib/LangContext";
import { Copy, Check, Users, Gift, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function generateReferralCode(userId) {
 // Deterministic code based on user id
 const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
 let h = 0;
 for (let i = 0; i < userId.length; i++) h = (h * 31 + userId.charCodeAt(i)) % 999983;
 let code = "QR-";
 let seed = h;
 for (let i = 0; i < 6; i++) {
     code += chars[seed % chars.length];
     seed = Math.floor(seed / chars.length) + (seed % 97) * 31 + i * 7;
     seed = seed % 999983;
 }
 return code;
}

export default function Settings() {
const { lang } = useLang();
const lbl = (es, en) => lang === "es" ? es : en;
const [user, setUser] = useState(null);
const [copied, setCopied] = useState(false);
const [referralCode, setReferralCode] = useState("");
const [referredCount, setReferredCount] = useState(0);
const [estimatedCommission, setEstimatedCommission] = useState(0);
const [loading, setLoading] = useState(true);

useEffect(() => {
    async function load() {
        setLoading(true);
        const me = await base44.auth.me().catch(() => null);
        if (me) {
            setUser(me);
            const code = me.referral_code || generateReferralCode(me.id);
            setReferralCode(code);
            // Save code to user if not set
            if (!me.referral_code) {
                await base44.auth.updateMe({ referral_code: code });
            }
            // Count referred users
            const referred = await base44.entities.User.filter({ referred_by: code }).catch(() => []);
            setReferredCount(referred.length);
            // Simulate commission (25% of avg booking ~$80 per referred user)
            setEstimatedCommission(referred.length * 80 * 0.25);
        }
        setLoading(false);
    }
    load();
}, []);

function copyCode() {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
}

const shareUrl = `${window.location.origin}/register?ref=${referralCode}`;

function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
}

return (
    <div className="min-h-screen bg-background">
     <Header />
     <main className="pt-20 pb-12 max-w-screen-md mx-auto px-4">
         <h1 className="text-2xl font-bold text-foreground mb-1 mt-6">{lbl("Parámetros", "Settings")}</h1>
         <p className="text-sm text-muted-foreground mb-8">{lbl("Gestiona tu cuenta y tu programa de partenariado.", "Manage your account and referral programme.")}</p>

         {loading ? (
          <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin" /></div>
         ) : (
          <>
            {/* User info */}
            {user && (
                 <div className="bg-card border border-border rounded-2xl p-5 mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{lbl("Mi cuenta", "My account")}</p>
                  <p className="text-sm font-semibold text-foreground">{user.full_name || user.email}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <div className="mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {user.role || "explorador"}
                    </span>
                  </div>
                 </div>
            )}

            {/* Referral section */}
           <div className="bg-card border border-border rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Gift className="h-4 w-4 text-accent" />
              <h2 className="font-bold text-foreground text-sm">{lbl("Programa de Partenariado", "Referral Programme")}</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              {lbl(
                  "Comparte tu código único. Cuando un usuario registrado con tu código venda un producto o servicio a través de la plataforma, recibirás el 25% de la comisión que percibe la plataforma sobre esa venta.",
                  "Share your unique code. Each time a user registered with your code sells a product or service through the platform, you earn 25% of the platform's commission on that sale."
              )}
            </p>

            {/* Code display */}
            <div className="bg-muted rounded-xl p-4 flex items-center justify-between mb-3">
              <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">{lbl("Tu código", "Your code")}</p>
                  <p className="text-2xl font-black tracking-widest text-foreground font-mono">{referralCode}</p>
              </div>
              <button
                  onClick={copyCode}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${copied ? "bg-green-100 text-green-700" : "bg-background border border-border text-foreground hover:bg-muted"}`}
              >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? lbl("¡Copiado!", "Copied!") : lbl("Copiar", "Copy")}
              </button>
            </div>

            {/* Share link */}
            <div className="bg-background border border-border rounded-xl px-3 py-2.5 flex items-center gap-2 mb-4">
                <p className="flex-1 text-xs text-muted-foreground truncate">{shareUrl}</p>
                <button onClick={copyLink} className="flex-shrink-0 text-xs font-semibold text-primary hover:underline">
                 {lbl("Copiar enlace", "Copy link")}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted rounded-xl p-3 text-center">
                 <div className="flex items-center justify-center gap-1 mb-1 text-muted-foreground">
                   <Users className="h-3.5 w-3.5" />
                 </div>
                 <p className="text-2xl font-black text-foreground">{referredCount}</p>
                 <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{lbl("Usuarios referidos", "Referred users")}</p>
                </div>
                <div className="bg-muted rounded-xl p-3 text-center">
                 <div className="flex items-center justify-center gap-1 mb-1 text-accent">
                   <Gift className="h-3.5 w-3.5" />
                 </div>
                 <p className="text-2xl font-black text-foreground">${estimatedCommission.toFixed(0)}</p>
                 <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{lbl("Comisiones est.", "Est. commissions")}</p>
                </div>
            </div>

            <p className="text-[10px] text-muted-foreground mt-3">
                * {lbl("Estimación basada en el 25% de la comisión de plataforma sobre las ventas de tus referidos.", "Estimate based on 25% of the platform commission on your referred users' sales.")}
            </p>
          </div>

             {/* How it works */}
             <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-foreground mb-3">{lbl("¿Cómo funciona?", "How it works?")}</h3>
                  <div className="space-y-3">
                   {[
                     { n: "1", es: "Comparte tu código o enlace con amigos y conocidos.", en: "Share your code or link with friends." },
                     { n: "2", es: "El nuevo usuario se registra usando tu código.", en: "The new user signs up using your code." },
                     { n: "3", es: "Cuando ese usuario venda un producto o servicio a través de la plataforma, recibes el 25% de la comisión que la plataforma cobra sobre dicha venta.", en: "When that user sells a product or service through the platform, you receive 25% of the commission the platform charges on that sale." },
                   ].map(step => (
                     <div key={step.n} className="flex items-start gap-3">
                         <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                           {step.n}
                         </div>
                         <p className="text-sm text-muted-foreground leading-relaxed">{lbl(step.es, step.en)}</p>
                     </div>
                   ))}
                  </div>
             </div>
           </>
        )}
      </main>
    </div>
  );
}
