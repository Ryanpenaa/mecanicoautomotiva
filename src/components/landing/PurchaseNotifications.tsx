import { useEffect, useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANOS } from "@/config/oferta";

const SAMPLE_NAMES = ["Lucas M.", "Rafael S.", "Carlos A.", "Bruno L.", "Marcos P.", "André F.", "Felipe R.", "Diego C."];

type Notice = { name: string; plan: string; minutes: number };

// Demonstration only: these notices do not represent verified transactions.
export function PurchaseNotifications() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    let timer: ReturnType<typeof setTimeout>;
    let previousName = "";
    const showNext = () => {
      const names = SAMPLE_NAMES.filter((name) => name !== previousName);
      const name = names[Math.floor(Math.random() * names.length)] ?? "Lucas M.";
      previousName = name;
      setNotice({
        name,
        plan: Math.random() < 0.5 ? PLANOS.basico.titulo : PLANOS.profissional.titulo,
        minutes: 1 + Math.floor(Math.random() * 25),
      });
      timer = setTimeout(() => {
        setNotice(null);
        timer = setTimeout(showNext, 12000 + Math.random() * 8000);
      }, 7000);
    };
    timer = setTimeout(showNext, 5000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  if (!notice || dismissed) return null;

  return (
    <aside
      aria-label="Exemplo ilustrativo de compra"
      className="fixed top-14 left-3 z-40 flex w-[270px] max-w-[calc(100vw-24px)] items-start gap-2.5 rounded-lg border border-border bg-card p-3 text-card-foreground shadow-[var(--shadow-card)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-2 motion-safe:duration-300"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
        <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1 text-xs leading-relaxed">
        <p className="font-semibold">{notice.name} adquiriu</p>
        <p className="font-semibold text-primary">{notice.plan}</p>
        <p className="text-muted-foreground">Há {notice.minutes} {notice.minutes === 1 ? "minuto" : "minutos"} <span className="align-super text-[9px] text-muted-foreground/70">· exemplo</span></p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="-mt-1 -mr-1 h-6 w-6 shrink-0 text-muted-foreground"
        aria-label="Fechar notificações de compra"
        title="Fechar notificações"
        onClick={() => setDismissed(true)}
      >
        <X className="h-3 w-3" />
      </Button>
    </aside>
  );
}