import { useState, useRef, useCallback } from "react";
import { Camera, Upload, Loader2, CheckCircle, XCircle, Lightbulb, BookOpen, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  status: "correct" | "incorrect" | "partial";
  title: string;
  conclusion: string;
  reasons: string[];
  corrections: string[];
  tips: string[];
  topic: string;
}

export default function ImageAnalyzer() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Formato inválido", description: "Envie apenas imagens.", variant: "destructive" });
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
    setResult(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const analyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64 = image.split(",")[1];
      const { data, error } = await supabase.functions.invoke("analyze-topo-image", {
        body: { imageBase64: base64, mimeType: imageFile?.type || "image/jpeg" },
      });
      if (error) throw error;
      const analysisResult = data as AnalysisResult;
      setResult(analysisResult);

      // Save to analysis_history
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id ?? "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("analysis_history") as any).insert({
        user_id: uid,
        status: analysisResult.status,
        title: analysisResult.title,
        topic: analysisResult.topic,
        conclusion: analysisResult.conclusion,
        reasons: analysisResult.reasons,
        corrections: analysisResult.corrections,
        tips: analysisResult.tips,
      });
    } catch (err) {
      toast({ title: "Erro na análise", description: "Tente novamente em instantes.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setImageFile(null);
    setResult(null);
  };

  const statusConfig = {
    correct: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", border: "border-success/30", label: "CORRETO" },
    incorrect: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", label: "INCORRETO" },
    partial: { icon: Lightbulb, color: "text-warning", bg: "bg-warning/10", border: "border-warning/30", label: "PARCIALMENTE CORRETO" },
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="topo-badge px-2 py-0.5 rounded border border-accent/40 text-accent">IA VISION</div>
        </div>
        <h1 className="font-display font-bold text-2xl lg:text-3xl text-foreground">Analisador de Imagens</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Envie qualquer imagem topográfica — malha triangular, curvas de nível, croquis, medições — e a IA identificará erros e fornecerá orientações.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload area */}
        <div className="space-y-4">
          {!image ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 min-h-[280px] flex flex-col items-center justify-center group ${
                dragOver
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 hover:bg-secondary/50"
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <p className="font-display font-semibold text-foreground mb-1">Arraste ou clique para enviar</p>
              <p className="text-sm text-muted-foreground">PNG, JPG, WEBP até 20MB</p>
              <div className="flex flex-wrap gap-1.5 justify-center mt-4">
                {["Malha Triangular", "Curvas de Nível", "Plantas", "Perfis", "Croquis"].map((t) => (
                  <span key={t} className="topo-badge px-2 py-0.5 rounded border border-border text-muted-foreground">{t}</span>
                ))}
              </div>
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-border">
              <img src={image} alt="Imagem para análise" className="w-full object-contain max-h-80" />
              <button
                onClick={reset}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-background/80 backdrop-blur text-muted-foreground hover:text-foreground border border-border"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}

          {image && (
            <button
              onClick={analyze}
              disabled={loading}
              className="w-full py-3 rounded-lg gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analisando com IA...</>
              ) : (
                <><Camera className="w-4 h-4" /> Analisar Imagem</>
              )}
            </button>
          )}
        </div>

        {/* Result */}
        <div>
          {!result && !loading && (
            <div className="h-full min-h-[280px] border border-border rounded-xl flex flex-col items-center justify-center text-center p-8 bg-muted/30">
              <BookOpen className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="font-display font-semibold text-muted-foreground mb-1">Aguardando Imagem</p>
              <p className="text-sm text-muted-foreground/70">
                Envie uma imagem topográfica e a IA fará uma análise técnica completa
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[280px] border border-primary/20 rounded-xl flex flex-col items-center justify-center text-center p-8 bg-primary/5 topo-scan-line">
              <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin mb-4" />
              <p className="font-display font-semibold text-primary mb-1">Processando...</p>
              <p className="text-sm text-muted-foreground">Gemini Vision está analisando sua imagem</p>
            </div>
          )}

          {result && (() => {
            const s = statusConfig[result.status];
            const Icon = s.icon;
            return (
              <div className={`rounded-xl border ${s.border} ${s.bg} p-5 space-y-4 animate-fade-in`}>
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${s.color}`} />
                  <span className={`topo-badge font-bold ${s.color}`}>{s.label}</span>
                  <span className="text-xs text-muted-foreground ml-auto">Salvo no histórico ✓</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-mono-custom mb-0.5">TÓPICO IDENTIFICADO</p>
                  <p className="font-display font-semibold text-foreground">{result.topic}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-mono-custom mb-0.5">CONCLUSÃO</p>
                  <p className="text-sm text-foreground leading-relaxed">{result.conclusion}</p>
                </div>
                {result.reasons.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground font-mono-custom mb-2">MOTIVOS</p>
                    <ul className="space-y-1.5">
                      {result.reasons.map((r, i) => (
                        <li key={i} className="flex gap-2 text-sm text-foreground">
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${s.color.replace('text-', 'bg-')}`} />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.corrections.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground font-mono-custom mb-2">COMO CORRIGIR</p>
                    <ul className="space-y-1.5">
                      {result.corrections.map((c, i) => (
                        <li key={i} className="flex gap-2 text-sm text-accent">
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-accent" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.tips.length > 0 && (
                  <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                    <p className="text-xs text-primary font-mono-custom mb-1.5 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" /> DICAS DO ESPECIALISTA
                    </p>
                    <ul className="space-y-1">
                      {result.tips.map((t, i) => (
                        <li key={i} className="text-xs text-primary/80">{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
