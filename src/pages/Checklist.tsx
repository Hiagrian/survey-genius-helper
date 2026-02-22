import { useState, useEffect, useCallback } from "react";
import { CheckSquare, Square, Plus, Trash2, RefreshCw, ChevronDown, ChevronRight, Check, Loader2, FolderPlus, List, ArrowLeft, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  category: string;
}

interface CustomChecklist {
  id: string;
  name: string;
  created_at: string;
}

const defaultChecklist: Omit<ChecklistItem, "id">[] = [
  { category: "PRÉ-CAMPO", text: "Verificar calibração da estação total", checked: false },
  { category: "PRÉ-CAMPO", text: "Verificar nível da régua de mira", checked: false },
  { category: "PRÉ-CAMPO", text: "Carregar baterias dos equipamentos", checked: false },
  { category: "PRÉ-CAMPO", text: "Conferir memória do equipamento (armazenamento)", checked: false },
  { category: "PRÉ-CAMPO", text: "Verificar prazo de calibração do nível", checked: false },
  { category: "PRÉ-CAMPO", text: "Definir datum e sistema de coordenadas (SIRGAS 2000)", checked: false },
  { category: "PRÉ-CAMPO", text: "Planejar poligonal principal e pontos de apoio", checked: false },
  { category: "EM CAMPO", text: "Implantar marcos geodésicos nos vértices da poligonal", checked: false },
  { category: "EM CAMPO", text: "Realizar fechamento angular da poligonal", checked: false },
  { category: "EM CAMPO", text: "Verificar erro de fechamento (tolerância < 1'√n)", checked: false },
  { category: "EM CAMPO", text: "Medir ângulos internos em séries duplas", checked: false },
  { category: "EM CAMPO", text: "Coletar pontos de nivelamento de referência (BM)", checked: false },
  { category: "EM CAMPO", text: "Nivelar e contra-nivelar seções críticas", checked: false },
  { category: "EM CAMPO", text: "Registrar pontos cotados em densidade adequada", checked: false },
  { category: "EM CAMPO", text: "Fotografar marcos e situações relevantes", checked: false },
  { category: "EM CAMPO", text: "Anotar obstruções e detalhes do terreno no croqui", checked: false },
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

// ─── Checklist View (items for a given checklist) ───
function ChecklistView({ checklistId, checklistName, onBack }: { checklistId: string | null; checklistName: string; onBack: () => void }) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [newItemText, setNewItemText] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("EM CAMPO");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("checklist_items").select("id, text, checked, category").order("created_at", { ascending: true });
    if (checklistId) {
      query = query.eq("checklist_id", checklistId);
    } else {
      query = query.is("checklist_id", null);
    }
    const { data, error } = await query;

    if (error) {
      toast({ title: "Erro ao carregar checklist", variant: "destructive" });
      setLoading(false);
      return;
    }

    if (data && data.length === 0 && !checklistId) {
      const { data: user } = await supabase.auth.getUser();
      const uid = user.user?.id ?? "";
      const { data: inserted, error: insertError } = await supabase
        .from("checklist_items")
        .insert(defaultChecklist.map((item) => ({ ...item, user_id: uid })))
        .select("id, text, checked, category");
      if (!insertError && inserted) setItems(inserted as ChecklistItem[]);
    } else if (data) {
      setItems(data as ChecklistItem[]);
    }
    setLoading(false);
  }, [toast, checklistId]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const toggle = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newChecked = !item.checked;
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, checked: newChecked } : i));
    await supabase.from("checklist_items").update({ checked: newChecked }).eq("id", id);
  };

  const remove = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await supabase.from("checklist_items").delete().eq("id", id);
  };

  const addItem = async () => {
    if (!newItemText.trim()) return;
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id ?? "";
    const payload: any = { text: newItemText.trim(), category: newItemCategory, checked: false, user_id: uid };
    if (checklistId) payload.checklist_id = checklistId;
    const { data, error } = await supabase.from("checklist_items").insert(payload).select("id, text, checked, category").single();
    if (!error && data) {
      setItems((prev) => [...prev, data as ChecklistItem]);
      setNewItemText("");
      toast({ title: "Item adicionado", description: data.text });
    }
  };

  const reset = async () => {
    if (!checklistId) {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id ?? "";
      await supabase.from("checklist_items").delete().is("checklist_id", null).neq("id", "00000000-0000-0000-0000-000000000000");
      const { data: inserted } = await supabase
        .from("checklist_items")
        .insert(defaultChecklist.map((item) => ({ ...item, user_id: uid })))
        .select("id, text, checked, category");
      if (inserted) setItems(inserted as ChecklistItem[]);
      toast({ title: "Checklist resetado" });
    } else {
      await supabase.from("checklist_items").update({ checked: false }).eq("checklist_id", checklistId);
      setItems((prev) => prev.map((i) => ({ ...i, checked: false })));
      toast({ title: "Itens desmarcados" });
    }
  };

  const categories = [...new Set(items.map((it) => it.category))];
  const totalChecked = items.filter((it) => it.checked).length;
  const progress = items.length > 0 ? Math.round((totalChecked / items.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar
          </button>
          <div className="flex items-center gap-2 mb-1">
            <div className="topo-badge px-2 py-0.5 rounded border border-primary/40 text-primary">
              {checklistId ? "PERSONALIZADO" : "LEVANTAMENTO"}
            </div>
          </div>
          <h1 className="font-display font-bold text-2xl lg:text-3xl text-foreground">{checklistName}</h1>
        </div>
        <button onClick={reset} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 text-sm transition-colors">
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
          <div className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? "bg-success" : "gradient-primary"}`} style={{ width: `${progress}%` }} />
        </div>
        {progress === 100 && (
          <p className="text-success text-sm mt-2 flex items-center gap-1.5"><Check className="w-4 h-4" /> Checklist completo! ✓</p>
        )}
      </div>

      {/* Add item */}
      <div className="gradient-card rounded-xl p-4 border border-border">
        <p className="text-xs text-muted-foreground font-mono-custom mb-3">ADICIONAR ITEM</p>
        <div className="flex gap-2 flex-col sm:flex-row">
          <select value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value)} className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:border-primary/50">
            {["PRÉ-CAMPO", "EM CAMPO", "PÓS-CAMPO", "GERAL"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <input value={newItemText} onChange={(e) => setNewItemText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addItem()} placeholder="Descreva o item do checklist..." className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
          <button onClick={addItem} className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity">
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
              <button onClick={() => setCollapsed((c) => ({ ...c, [category]: !c[category] }))} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  <span className={`topo-badge px-2.5 py-1 rounded border ${colorClass}`}>{category}</span>
                  <span className="text-sm text-muted-foreground">{catDone}/{catItems.length}</span>
                </div>
                <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full gradient-primary rounded-full transition-all duration-300" style={{ width: `${catItems.length > 0 ? (catDone / catItems.length) * 100 : 0}%` }} />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border divide-y divide-border/50">
                  {catItems.map((item) => (
                    <div key={item.id} className={`group flex items-start gap-3 px-5 py-3 transition-colors ${item.checked ? "bg-success/5" : "hover:bg-white/3"}`}>
                      <button onClick={() => toggle(item.id)} className="mt-0.5 flex-shrink-0">
                        {item.checked ? <CheckSquare className="w-4.5 h-4.5 text-success" /> : <Square className="w-4.5 h-4.5 text-muted-foreground hover:text-primary transition-colors" />}
                      </button>
                      <span className={`flex-1 text-sm leading-relaxed ${item.checked ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.text}</span>
                      <button onClick={() => remove(item.id)} className="flex-shrink-0 p-1 text-muted-foreground/50 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <List className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nenhum item ainda. Adicione o primeiro item acima.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Checklist Page ───
export default function Checklist() {
  const [view, setView] = useState<"list" | "checklist">("list");
  const [selectedChecklist, setSelectedChecklist] = useState<{ id: string | null; name: string } | null>(null);
  const [customChecklists, setCustomChecklists] = useState<CustomChecklist[]>([]);
  const [newChecklistName, setNewChecklistName] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCustomChecklists = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("custom_checklists").select("*").order("created_at", { ascending: false });
    if (data) setCustomChecklists(data as CustomChecklist[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCustomChecklists(); }, [fetchCustomChecklists]);

  const createChecklist = async () => {
    if (!newChecklistName.trim()) return;
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id ?? "";
    const { data, error } = await supabase.from("custom_checklists").insert({ name: newChecklistName.trim(), user_id: uid }).select().single();
    if (!error && data) {
      setCustomChecklists((prev) => [data as CustomChecklist, ...prev]);
      setNewChecklistName("");
      toast({ title: "Checklist criado", description: data.name });
    }
  };

  const deleteChecklist = async (id: string) => {
    await supabase.from("custom_checklists").delete().eq("id", id);
    setCustomChecklists((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Checklist excluído" });
  };

  const openChecklist = (id: string | null, name: string) => {
    setSelectedChecklist({ id, name });
    setView("checklist");
  };

  if (view === "checklist" && selectedChecklist) {
    return <ChecklistView checklistId={selectedChecklist.id} checklistName={selectedChecklist.name} onBack={() => setView("list")} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="topo-badge px-2 py-0.5 rounded border border-primary/40 text-primary">CHECKLISTS</div>
        </div>
        <h1 className="font-display font-bold text-2xl lg:text-3xl text-foreground">Meus Checklists</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie seus checklists de levantamento</p>
      </div>

      {/* Default Checklist */}
      <button
        onClick={() => openChecklist(null, "Checklist Planialtimétrico")}
        className="w-full gradient-card rounded-xl border border-border p-5 text-left hover:border-primary/30 transition-colors shadow-card card-hover"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckSquare className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">Checklist Planialtimétrico</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Checklist padrão com 25 itens • PRÉ-CAMPO, EM CAMPO, PÓS-CAMPO</p>
          </div>
        </div>
      </button>

      {/* Create new */}
      <div className="gradient-card rounded-xl p-4 border border-border">
        <p className="text-xs text-muted-foreground font-mono-custom mb-3">CRIAR NOVO CHECKLIST</p>
        <div className="flex gap-2">
          <input
            value={newChecklistName}
            onChange={(e) => setNewChecklistName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createChecklist()}
            placeholder="Nome do checklist (ex: Loteamento São José)"
            className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
          <button onClick={createChecklist} className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity">
            <FolderPlus className="w-4 h-4" /> Criar
          </button>
        </div>
      </div>

      {/* Custom checklists */}
      {customChecklists.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-mono-custom px-1">PERSONALIZADOS</p>
          {customChecklists.map((cl) => (
            <div key={cl.id} className="gradient-card rounded-xl border border-border overflow-hidden group">
              <div className="flex items-center justify-between px-5 py-4">
                <button onClick={() => openChecklist(cl.id, cl.name)} className="flex items-center gap-3 flex-1 text-left">
                  <Pencil className="w-4 h-4 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-display font-medium text-foreground text-sm">{cl.name}</h3>
                    <p className="text-xs text-muted-foreground">{new Date(cl.created_at).toLocaleDateString("pt-BR")}</p>
                  </div>
                </button>
                <button onClick={() => deleteChecklist(cl.id)} className="p-2 text-muted-foreground/50 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
