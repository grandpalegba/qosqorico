import { useState, useEffect, useRef } from "react";
import { X, Send, MessageSquare } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLang } from "../lib/LangContext";
import { Button } from "@/components/ui/button";


export default function MessagingModal({ provider, open, onClose }) {
 const { lang } = useLang();
 const [messages, setMessages] = useState([]);
 const [input, setInput] = useState("");
 const [sending, setSending] = useState(false);
 const [userName, setUserName] = useState("");
 const [nameSet, setNameSet] = useState(false);
 const bottomRef = useRef(null);


 const lbl = (es, en) => lang === "es" ? es : en;


 useEffect(() => {
    if (!open || !provider) return;
    loadMessages();
    const unsub = base44.entities.Message?.subscribe?.((event) => {
      if (event.data?.provider_id === provider.id) {
          setMessages(prev => {
           if (event.type === "create") return [...prev, event.data];
           if (event.type === "delete") return prev.filter(m => m.id !==
event.id);
           return prev;
          });
      }
    });
    return () => unsub?.();
 }, [open, provider?.id]);


 useEffect(() => {

    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);


async function loadMessages() {
    const msgs = await base44.entities.Message.filter({ provider_id:
provider.id }, "created_date", 50);
    setMessages(msgs);
}


async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    await base44.entities.Message.create({
     provider_id: provider.id,
     sender_name: userName || lbl("Visitante", "Visitor"),
     content: input.trim(),
     is_provider: false,
    });
    setInput("");
    setSending(false);
    await loadMessages();
}


if (!open) return null;


return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
     <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
     <div
          className="relative w-full max-w-md bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col"
          style={{ height: "min(600px, 90vh)", animation: "slideUp 0.3s ease" }}
          onClick={e => e.stopPropagation()}
     >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
           <div className="flex items-center gap-3">

          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-sm">{provider?.full_name}</h2>
            <p className="text-[11px] text-green-500 font-medium">{lbl("En línea", "Online")}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted transition-colors">
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>


      {/* Name prompt */}
      {!nameSet && (
        <div className="px-5 py-3 bg-muted/50 border-b border-border flex-shrink-0">
          <p className="text-xs text-muted-foreground mb-2">{lbl("¿Cómo te llamamos?", "What should we call you?")}</p>
          <div className="flex gap-2">
            <input
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder={lbl("Tu nombre", "Your name")}
                className="flex-1 h-8 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                onKeyDown={e => e.key === "Enter" && userName.trim() &&
setNameSet(true)}
            />
            <button
                onClick={() => userName.trim() && setNameSet(true)}
                className="px-3 h-8 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
            >
                OK
            </button>
          </div>

        </div>
      )}


      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {/* Welcome message */}
        <div className="flex justify-start">
           <div className="max-w-[75%] bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5">
              <p className="text-sm text-foreground leading-relaxed">
                {lbl(
                 `¡Hola! Soy ${provider?.full_name}. ¿En qué puedo ayudarte?
Puedes preguntarme sobre mis servicios, precios o cualquier duda antes de
reservar.`,
                 `Hello! I'm ${provider?.full_name}. How can I help you? Feel
free to ask about my services, prices, or anything before booking.`
                )}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">{provider?.full_name}</p>
           </div>
        </div>


        {messages.map((m, i) => (
           <div key={m.id || i} className={`flex ${m.is_provider ?
"justify-start" : "justify-end"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5
${m.is_provider ? "bg-muted rounded-tl-sm" : "bg-primary text-primary-foreground rounded-tr-sm"}`}>
                <p className="text-sm leading-relaxed">{m.content}</p>
                <p className={`text-[10px] mt-1 ${m.is_provider ?
"text-muted-foreground" : "text-primary-foreground/70"}`}>
                 {m.sender_name}
                </p>
              </div>
           </div>
        ))}
        <div ref={bottomRef} />
      </div>


      {/* Input */}

        <form onSubmit={handleSend} className="px-4 py-3 border-t border-border flex gap-2 flex-shrink-0">
          <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={lbl("Escribe un mensaje…", "Type a message…")}
              className="flex-1 h-10 px-4 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
              type="submit"
              disabled={sending || !input.trim()}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 transition-opacity"
          >
              {sending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </form>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(40px);
opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
     </div>
  );
}
