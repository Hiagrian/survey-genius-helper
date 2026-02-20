import { useState, useEffect } from "react";
import { CheckSquare, Square, Plus, Trash2, RefreshCw, ChevronDown, ChevronRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  category: string;
}

const defaultChecklist: Omit<ChecklistItem, "id">[] = [
  // Pré-campo
  { category: "PRÉ-CAMPO", text: "Verificar calibração da estação total", checked: false },
  { category: "PRÉ-CAMPO", text: "Verificar nível da régua de mira", checked: false },
  { category: "PRÉ-CAMPO", text: "Carregar baterias dos equipamentos", checked: false },
  { category: "PRÉ-CAMPO", text: "Conferir memória do equipamento (armazenamento)", checked: false },
  { category: "PRÉ-CAMPO", text: "Verificar prazo de calibração do nível", checked: false },
  { category: "PRÉ-CAMPO", text: "Definir datum e sistema de coordenadas (SIRGAS 2000)", checked: false },
  { category: "PRÉ-CAMPO", text: "Planejar poligonal principal e pontos de apoio", checked: false },
  // Campo
  { category: "EM CAMPO", text: "Implantar marcos geodésicos nos vértices da poligonal", checked: false },
  { category: "EM CAMPO", text: "Realizar fechamento angular da poligonal", checked: false },
  { category: "EM CAMPO", text: "Verificar erro de fechamento (tolerância < 1'√n)", checked: false },
  { category: "EM CAMPO", text: "Medir ângulos internos em séries duplas", checked: false },
  { category: "EM CAMPO", text: "Coletar pontos de nivelamento de referência (BM)", checked: false },
  { category: "EM CAMPO", text: "Nivelar e contra-nivelar seções críticas", checked: false },
  { category: "EM CAMPO", text: "Registrar pontos cotados em densidade adequada", checked: false },
  { category: "EM CAMPO", text: "Fotografar marcos e situações relevantes", checked: false },
  { category: "EM CAMPO", text: "Anotar obstruções e detalhes do terreno no croqui", checked: false },
  // Escritório
  { category: "PÓS-CAMPO", text: "Importar dados do coletor para o software", checked: false },
  { category: "PÓS-CAMPO", text: "Calcular e compensar a poligonal (Bowditch/Transit)", checked: false },
  { category: "PÓS-CAMPO", text: "Verificar erro linear de fechamento (1:5000 mín.)", checked: false },
  { category: "PÓS-CAMPO", text: "Gerar MDT e curvas de nível com equidistância definida", checked: false },
  { category: "PÓS-CAMPO", text: "Conferir curvas de nível (não cruzam, não se unem)", checked: false },
  { category: "PÓS-CAMPO", text: "Gerar malha triangular TIN e validar triângulos", checked: false },
  { category: "PÓS-CAMPO", text: "Calcular áreas e volumes conforme norma ABNT NBR 13133", checked: false },
  { category: "PÓS-CAMPO", text: "Plotar planta final com simbologia normalizada", checked: false },
  { category: "PÓS-CAMPO", text: "Assinar ART/RRT do responsável técnico", checked: false },
];

const categoryColors: Record<string, string> = {
  "PRÉ-CAMPO": "text-accent border-accent/30 bg-accent/10",
  "EM CAMPO": "text-primary border-primary/30 bg-primary/10",
  "PÓS-CAMPO": "text-success border-success/30 bg-success/10",
};

export default function Checklist() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [newItemText, setNewItemText] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("EM CAMPO");
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("topo-checklist");
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      const initial = defaultChecklist.map((item) => ({ ...item, id: crypto.randomUUID() }));
      setItems(initial);
      localStorage.setItem("topo-checklist", JSON.stringify(initial));
    }
  }, []);

  const save = (next: ChecklistItem[]) => {
    setItems(next);
    localStorage.setItem("topo-checklist", JSON.stringify(next));
  };

  const toggle = (id: string) => {
    save(items.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)));
  };

  const remove = (id: string) => {
    save(items.filter((it) => it.id !== id));
  };

  const addItem = () => {
    if (!newItemText.trim()) return;
    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      text: newItemText.trim(),
      category: newItemCategory,
      checked: false,
    };
    save([...items, newItem]);
    setNewItemText("");
    toast({ title: "Item adicionado", description: newItem.text });
  };

  const reset = () => {
    const initial = defaultChecklist.map((item) => ({ ...item, id: crypto.randomUUID() }));
    save(initial);
    toast({ title: "Checklist resetado", description: "Todos os itens foram restaurados." });
  };

  const categories = [...new Set(items.map((it) => it.category))];
  const totalChecked = items.filter((it) => it.checked).length;
  const progress = items.length > 0 ? Math.round((totalChecked / items.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="topo-badge px-2 py-0.5 rounded border border-primary/40 text-primary">LEVANTAMENTO</div>
          </div>
          <h1 className="font-display font-bold text-2xl lg:text-3xl text-foreground">Checklist Planialtimétrico</h1>
          <p className="text-muted-foreground text-sm mt-1">Acompanhe cada etapa do levantamento de campo</p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 text-sm transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Resetar
        </button>
      </div>

      {/* Progress */}
      <div className="gradient-card rounded-xl p-5 border border-border shadow-card">
        <div className="flex items-center justify-between mb-3">
          <span className="font-display font-semibold text-foreground">{totalChecked}/{items.length} concluídos</span>
          <span className={`font-display font-bold text-xl ${progress === 100 ? "text-success" : "text-primary"}`}>{progress}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? "bg-success" : "gradient-primary"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <p className="text-success text-sm mt-2 flex items-center gap-1.5">
            <Check className="w-4 h-4" /> Levantamento completo! ✓
          </p>
        )}
      </div>

      {/* Add item */}
      <div className="gradient-card rounded-xl p-4 border border-border">
        <p className="text-xs text-muted-foreground font-mono-custom mb-3">ADICIONAR ITEM</p>
        <div className="flex gap-2 flex-col sm:flex-row">
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:border-primary/50"
          >
            {["PRÉ-CAMPO", "EM CAMPO", "PÓS-CAMPO"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <input
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="Descreva o item do checklist..."
            className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
          <button
            onClick={addItem}
            className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Adicionar
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {categories.map((category) => {
          const catItems = items.filter((it) => it.category === category);
          const catDone = catItems.filter((it) => it.checked).length;
          const isOpen = collapsed[category] !== true;
          const colorClass = categoryColors[category] || "text-muted-foreground border-border bg-secondary";

          return (
            <div key={category} className="gradient-card rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setCollapsed((c) => ({ ...c, [category]: !c[category] }))}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  <span className={`topo-badge px-2.5 py-1 rounded border ${colorClass}`}>{category}</span>
                  <span className="text-sm text-muted-foreground">{catDone}/{catItems.length}</span>
                </div>
                <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary rounded-full transition-all duration-300"
                    style={{ width: `${catItems.length > 0 ? (catDone / catItems.length) * 100 : 0}%` }}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border divide-y divide-border/50">
                  {catItems.map((item) => (
                    <div key={item.id} className={`flex items-start gap-3 px-5 py-3 transition-colors ${item.checked ? "bg-success/5" : "hover:bg-white/3"}`}>
                      <button onClick={() => toggle(item.id)} className="mt-0.5 flex-shrink-0">
                        {item.checked
                          ? <CheckSquare className="w-4.5 h-4.5 text-success" />
                          : <Square className="w-4.5 h-4.5 text-muted-foreground hover:text-primary transition-colors" />}
                      </button>
                      <span className={`flex-1 text-sm leading-relaxed ${item.checked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {item.text}
                      </span>
                      <button
                        onClick={() => remove(item.id)}
                        className="flex-shrink-0 p-1 text-muted-foreground/50 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
