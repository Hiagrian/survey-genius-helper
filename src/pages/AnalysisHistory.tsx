import { useEffect, useState } from "react";
import { History, CheckCircle, XCircle, Lightbulb, Trash2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HistoryItem {
  id: string;
  status: "correct" | "incorrect" | "partial";
  title: string | null;
  topic: string | null;
  conclusion: string | null;
  created_at: string;
}

const statusConfig = {
  correct: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", border: "border-success/30", label: "CORRETO" },
  incorrect: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", label: "INCORRETO" },
  partial: { icon: Lightbulb, color: "text-warning", bg: "bg-warning/10", border: "border-warning/30", label: "PARCIAL" },
};

export default function AnalysisHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("analysis_history")
      .select("id, status, title, topic, conclusion, created_at")
      .order("created_at", { ascending: false });
    if (!error && data) setItems(data as HistoryItem[]);
    setLoading(false);
  };

  useEffect(() => { fetchHistory(); }, []);

  const remove = async (id: string) => {
    await supabase.from("analysis_history").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast({ title: "Análise removida" });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="topo-badge px-2 py-0.5 rounded border border-primary/40 text-primary">HISTÓRICO</div>
        </div>
        <h1 className="font-display font-bold text-2xl lg:text-3xl text-foreground">Histórico de Análises</h1>
        <p className="text-muted-foreground text-sm mt-1">Todas as análises de imagens realizadas com IA</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="gradient-card rounded-xl border border-border p-12 text-center">
          <History className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="font-display font-semibold text-muted-foreground">Nenhuma análise ainda</p>
          <p className="text-sm text-muted-foreground/70 mt-1">As análises feitas no Analisador de Imagens aparecerão aqui</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const s = statusConfig[item.status];
            const Icon = s.icon;
            return (
              <div key={item.id} className={`gradient-card rounded-xl border ${s.border} p-4 flex gap-4 items-start`}>
                <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4.5 h-4.5 ${s.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className={`topo-badge text-xs ${s.color}`}>{s.label}</span>
                    <button onClick={() => remove(item.id)} className="text-muted-foreground/40 hover:text-destructive transition-colors flex-shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {item.topic && <p className="font-display font-semibold text-sm text-foreground mb-0.5">{item.topic}</p>}
                  {item.conclusion && <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.conclusion}</p>}
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground/60">
                    <Clock className="w-3 h-3" />
                    {formatDate(item.created_at)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
