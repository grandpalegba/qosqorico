import { useState } from "react";
import { X, Star, Send, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubmitReview, useMyReview } from "@/hooks/useReviews";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";

const CRITERIA = [
  { key: "authenticity", labelEs: "Autenticidad", labelEn: "Authenticity", color: "#AD281F", desc: "¿Qué tan genuina fue la experiencia?" },
  { key: "originality",  labelEs: "Originalidad",  labelEn: "Originality",  color: "#C38322", desc: "¿Cuán única e irrepetible fue?" },
  { key: "impact",       labelEs: "Impacto",       labelEn: "Impact",       color: "#2A7A5A", desc: "¿Cuánto te marcó esta experiencia?" },
];

function ScoreSlider({ criterion, value, onChange, lang }) {
  const label = lang === "es" ? criterion.labelEs : criterion.labelEn;
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-2xl font-black" style={{ color: criterion.color }}>{value}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{criterion.desc}</p>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary h-2 rounded-full cursor-pointer"
        style={{ accentColor: criterion.color }}
      />
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}

export default function ReviewModal({ provider, lang = "es", onClose }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: myExistingReview } = useMyReview(provider?.id);
  const { mutateAsync: submitReview, isPending } = useSubmitReview();

  const [scores, setScores] = useState({
    authenticity: myExistingReview?.authenticity ?? 75,
    originality:  myExistingReview?.originality  ?? 75,
    impact:       myExistingReview?.impact       ?? 75,
  });
  const [comment, setComment] = useState(myExistingReview?.comment ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      onClose();
      return;
    }
    setError(null);
    try {
      await submitReview({
        providerId: provider.id,
        authenticity: scores.authenticity,
        originality:  scores.originality,
        impact:       scores.impact,
        comment,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Une erreur s'est produite.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-foreground">
              {lang === "es" ? "Tu evaluación" : "Your review"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {provider?.display_name || provider?.name}
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {!isAuthenticated ? (
            <div className="text-center py-6">
              <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-semibold text-foreground mb-1">
                {lang === "es" ? "Conexión requerida" : "Login required"}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                {lang === "es"
                  ? "Debes iniciar sesión para dejar una evaluación."
                  : "You must be logged in to leave a review."}
              </p>
              <Button onClick={() => { navigate("/login"); onClose(); }} className="bg-primary text-primary-foreground">
                {lang === "es" ? "Iniciar sesión" : "Log in"}
              </Button>
            </div>
          ) : submitted ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">🎉</div>
              <p className="text-sm font-bold text-foreground mb-1">
                {lang === "es" ? "¡Gracias por tu evaluación!" : "Thank you for your review!"}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                {lang === "es"
                  ? "Tu experiencia ayuda a otros exploradores."
                  : "Your experience helps other explorers."}
              </p>
              <Button onClick={onClose} variant="outline">{lang === "es" ? "Cerrar" : "Close"}</Button>
            </div>
          ) : (
            <>
              {/* Sliders */}
              {CRITERIA.map((c) => (
                <ScoreSlider
                  key={c.key}
                  criterion={c}
                  value={scores[c.key]}
                  onChange={(v) => setScores(prev => ({ ...prev, [c.key]: v }))}
                  lang={lang}
                />
              ))}

              {/* Comment */}
              <div className="mb-5">
                <label className="text-sm font-semibold text-foreground mb-1 block">
                  {lang === "es" ? "Comentario (opcional)" : "Comment (optional)"}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder={lang === "es" ? "Comparte tu experiencia..." : "Share your experience..."}
                  className="w-full rounded-xl border border-border bg-background text-sm p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {error && (
                <p className="text-xs text-destructive mb-3">{error}</p>
              )}

              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                <Send className="h-4 w-4" />
                {isPending
                  ? (lang === "es" ? "Enviando..." : "Sending...")
                  : (lang === "es" ? "Publicar evaluación" : "Submit review")}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
