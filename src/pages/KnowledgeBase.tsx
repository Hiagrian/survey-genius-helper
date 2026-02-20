import { useState } from "react";
import { BookOpen, Search, ChevronDown, ChevronRight, Triangle, Layers, Compass, BarChart2, Calculator, FileText } from "lucide-react";

interface Topic {
  id: string;
  title: string;
  category: string;
  icon: React.ElementType;
  summary: string;
  content: string;
  keywords: string[];
}

const topics: Topic[] = [
  {
    id: "curvas-nivel",
    title: "Curvas de Nível",
    category: "Representação do Terreno",
    icon: Layers,
    summary: "Linhas que unem pontos de mesma cota (altitude) na representação plana do terreno.",
    content: `As curvas de nível são linhas que conectam pontos de igual altitude no terreno. São fundamentais para representar o relevo em mapas e plantas topográficas.

**Propriedades essenciais:**
- Nunca se cruzam (exceto em cavernas ou pontes)
- Nunca se unem (terreno normal)  
- Fecham-se sempre em si mesmas (dentro ou fora da área mapeada)
- Quanto mais próximas: terreno mais íngreme
- Quanto mais afastadas: terreno mais plano

**Tipos de curvas:**
• Curvas mestras (cotadas): equidistância × 5 — linha mais espessa
• Curvas normais: equidistância definida — linha fina
• Curvas intermediárias: E/2 — linha tracejada

**Equidistância (E):**
Escolha conforme escala e finalidade:
- 1:1.000 → E = 0,5 m ou 1 m
- 1:5.000 → E = 1 m ou 2 m  
- 1:10.000 → E = 5 m
- 1:50.000 → E = 20 m

**Norma:** ABNT NBR 13133 — Execução de levantamento topográfico`,
    keywords: ["curva", "nível", "cota", "altitude", "relevo", "equidistância"],
  },
  {
    id: "tin-malha",
    title: "Malha Triangular (TIN)",
    category: "Modelos Digitais",
    icon: Triangle,
    summary: "Triangulated Irregular Network — modelo digital de elevação baseado em triângulos irregulares.",
    content: `O TIN (Triangulated Irregular Network) é um modelo digital de terreno formado por triângulos cujos vértices são os pontos cotados coletados em campo.

**Critério de Delaunay:**
É o critério padrão para triangulação topográfica. Garante que **nenhum ponto** esteja dentro do círculo circunscrito de qualquer triângulo. Isso maximiza os ângulos mínimos dos triângulos, evitando triângulos "agulhados".

**Características de um TIN correto:**
✓ Triângulos com ângulos internos equilibrados (não muito agudos)
✓ Sem cruzamento de arestas
✓ Pontos de break lines respeitados (bordas, talvegues, cumeadas)
✓ Densidade de pontos proporcional à variação do relevo

**Erros comuns:**
✗ Triângulos muito longos e agulhados (poucos pontos)
✗ Cruzamento de bordas de triângulos
✗ Ignorar break lines naturais do terreno
✗ Densidade uniforme em terreno irregular

**Relação com MDT:**
O TIN é a base para geração do MDT (Modelo Digital do Terreno) e das curvas de nível.`,
    keywords: ["tin", "triangular", "malha", "delaunay", "mdt", "modelo digital"],
  },
  {
    id: "nivelamento",
    title: "Nivelamento Geométrico",
    category: "Métodos de Medição",
    icon: Compass,
    summary: "Determinação de diferenças de nível entre pontos usando nível óptico e mira graduada.",
    content: `O nivelamento geométrico determina diferenças de nível entre pontos com alta precisão, usando o nível óptico e régua/mira graduada.

**Equação fundamental:**
\`ΔH = Ré - Vante\`
Onde: Ré = leitura na mira do ponto de cota conhecida | Vante = leitura na mira do ponto desconhecido

**Plano de Comparação:**
\`Plano = Cota do BM + leitura de Ré\`
\`Cota do ponto = Plano - leitura de Vante\`

**Termos importantes:**
- **BM (Benchmark):** referência de nível com cota conhecida
- **Ré:** leitura "para trás" — ponto de cota conhecida
- **Vante:** leitura "para frente" — ponto a determinar
- **Ponto Intermediário (PI):** leitura apenas de Vante, sem visada de Ré

**Erro de fechamento admissível:**
- Precisão normal: E ≤ 20√K (mm), K em km
- Alta precisão: E ≤ 8√K (mm)
- Geodésica de 1ª ordem: E ≤ 4√K (mm)

**Conferência:** Σ Ré − Σ Vante = cota final − cota inicial`,
    keywords: ["nivelamento", "nível", "bm", "ré", "vante", "cota", "altura"],
  },
  {
    id: "poligonal",
    title: "Poligonal Fechada",
    category: "Métodos de Medição",
    icon: Compass,
    summary: "Série de linhas interligadas que parte e retorna ao mesmo ponto, usada para definir o perímetro de uma área.",
    content: `A poligonal é uma linha quebrada formada por lados e ângulos, usada para definir os limites de uma área ou eixo de projeto.

**Tipos:**
- **Fechada:** começa e termina no mesmo ponto (ou em pontos com coordenadas conhecidas)
- **Aberta:** começa em um ponto e termina em outro, ambos com coordenadas conhecidas

**Erro de fechamento angular:**
\`Ea = Σ ângulos medidos − Σ ângulos teóricos\`

Para poligonal fechada: \`Σ θ = (n - 2) × 180°\` (ângulos internos)

**Tolerância angular:**
\`T = 1' × √n\` (precisão topográfica normal)

**Distribuição do erro:** Divide-se o erro igualmente por todos os ângulos.

**Erro linear de fechamento:**
\`Ef = √(ΔX² + ΔY²)\`

**Precisão (1/Ef):**
- Terreno urbano: ≥ 1:5.000
- Terreno rural: ≥ 1:3.000
- Planejamento: ≥ 1:1.000

**Compensação:** Método de Bowditch (proporcional ao comprimento dos lados)`,
    keywords: ["poligonal", "fechada", "ângulo", "fechamento", "perímetro", "bowditch"],
  },
  {
    id: "coordenadas-utm",
    title: "Coordenadas UTM e SIRGAS",
    category: "Sistemas de Referência",
    icon: Compass,
    summary: "Sistema de projeção cartográfica universal usado no Brasil com o datum SIRGAS 2000.",
    content: `**SIRGAS 2000** (Sistema de Referência Geocêntrico para as Américas) é o datum oficial do Brasil desde 2015.

**Projeção UTM (Universal Transverse Mercator):**
Divide o mundo em 60 fusos de 6° de longitude cada.

**Brasil:** Fusos 18 a 25 (longitude 72°W a 30°W)
- Fuso 23 (cobre a maior parte de SP, MG, RJ): meridiano central 45°W

**Convenções:**
- Coordenadas em metros (E = Leste/X, N = Norte/Y)
- Falso Leste: 500.000 m (para E positivo)
- Hemisfério Sul: adicionar 10.000.000 m ao Norte

**Escala:**
- Fator de escala central: 0,9996
- Máxima distorção linear: ± 1/1.000 nas bordas do fuso

**No GPS/Equipamento:**
Configure sempre: WGS84 → converter para SIRGAS 2000 (praticamente equivalente para levantamentos)

**Precisão recomendada:**
- RTK GPS: ± 2-3 cm horizontal
- GNSS pós-processado: ± 1 cm
- GPS convencional: ± 3-5 m`,
    keywords: ["utm", "sirgas", "coordenadas", "fuso", "datum", "gps", "gnss"],
  },
  {
    id: "declividade",
    title: "Declividade e Greide",
    category: "Cálculos",
    icon: BarChart2,
    summary: "Percentual de inclinação do terreno entre dois pontos — essencial para projetos de drenagem e terraplanagem.",
    content: `A declividade expressa a inclinação do terreno entre dois pontos.

**Fórmulas:**
\`i (%) = (ΔH / D) × 100\`
\`i (‰) = (ΔH / D) × 1000\`
\`i (°) = arctan(ΔH / D)\`

Onde: ΔH = diferença de cota | D = distância horizontal

**Classificação do terreno (ABNT):**
- Plano: i < 2%
- Suave ondulado: 2% a 5%
- Ondulado: 5% a 15%
- Forte ondulado: 15% a 45%
- Montanhoso: 45% a 75%
- Escarpado: > 75%

**Legislação ambiental (Código Florestal — Lei 12.651/2012):**
- Acima de 45° (100%): área de preservação permanente (APP)
- Entre 25° e 45°: uso restrito

**Greide de projeto:**
É a linha de projeto que define as cotas de um traçado viário ou canal. A diferença entre greide e terreno determina cortes e aterros.

**Volume de corte/aterro:**
Seções transversais calculadas por média das áreas: \`V = ((A1 + A2) / 2) × d\``,
    keywords: ["declividade", "inclinação", "greide", "corte", "aterro", "terraplanagem"],
  },
  {
    id: "normas-abnt",
    title: "Normas ABNT Topografia",
    category: "Normas Técnicas",
    icon: FileText,
    summary: "Principais normas brasileiras que regem a prática topográfica profissional.",
    content: `**NBR 13133:1994** — Execução de Levantamento Topográfico
Principal norma para levantamentos. Define terminologia, métodos, tolerâncias e conteúdo dos produtos.

**NBR 14166:1998** — Rede de Referência Cadastral Municipal
Define parâmetros para implantação de redes de referência.

**NBR 10647** — Desenho Técnico / Normas gerais

**Resolução IBGE/INCRA n° 3/2013** — Padrão de Exatidão Cartográfica (PEC)
Define classes de exatidão dos produtos cartográficos:
- Classe A (PEC-PCD): 90% dos pontos com erro ≤ 0,5 mm na escala
- Classe B: 90% ≤ 0,8 mm
- Classe C: 90% ≤ 1,0 mm

**Lei Federal 6.496/1977** — Instituição da ART
Anotação de Responsabilidade Técnica obrigatória para serviços de topografia.

**Resolução CONFEA 1.048/2013**
Atribuições profissionais em topografia e geodésia.

**Referência para GPS geodésico:**
Especificações para GPS: IBGE — "Especificações e Normas Gerais para Levantamentos GPS (Versão Preliminar)"`,
    keywords: ["norma", "abnt", "nbr", "art", "ibge", "confea", "legislação"],
  },
  {
    id: "equipamentos",
    title: "Equipamentos Topográficos",
    category: "Instrumentação",
    icon: Calculator,
    summary: "Principais instrumentos usados em levantamentos topográficos modernos e suas aplicações.",
    content: `**Estação Total:**
Integra teodolito eletrônico + distanciômetro. Mede ângulos horizontais, verticais e distâncias.
- Precisão angular: 1" a 5"
- Precisão linear: ± (2 mm + 2 ppm × D)

**Nível Óptico / Eletrônico:**
Determina diferenças de nível. O eletrônico lê a mira automaticamente por código de barras.
- Precisão: ± 0,3 mm/km (alta precisão) a ± 2 mm/km (engenharia)

**GPS/GNSS Geodésico:**
Receptores dupla frequência (L1/L2) para precisão centimétrica.
- RTK: tempo real ± 2-3 cm
- Pós-processado: ± 1 cm
- Estático: ± 5 mm + 1 ppm × linha de base

**Drone / VANT (Veículo Aéreo Não Tripulado):**
Levantamento fotogramétrico. Requer GCPs (pontos de controle) para precisão.
- GSD: 2-5 cm com voo a 100 m
- Acurácia vertical: ± 3× GSD (sem correção)
- Com PPK/RTK embarcado: ± 3-5 cm

**Mira / Régua:**
- Mira telescópica: 4 m ou 5 m graduada em cm
- Mira com código (para níveis digitais)

**Prisma topográfico:**
Refletor para estação total. Mini-prisma para locais de difícil acesso.`,
    keywords: ["estação total", "gps", "nível", "drone", "vant", "equipamento", "mira", "prisma"],
  },
];

export default function KnowledgeBase() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const categories = ["Todos", ...new Set(topics.map((t) => t.category))];

  const filtered = topics.filter((t) => {
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.summary.toLowerCase().includes(search.toLowerCase()) ||
      t.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCategory === "Todos" || t.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="topo-badge px-2 py-0.5 rounded border border-success/40 text-success">BASE TÉCNICA</div>
        </div>
        <h1 className="font-display font-bold text-2xl lg:text-3xl text-foreground">Base de Conhecimento</h1>
        <p className="text-muted-foreground text-sm mt-1">Conceitos, normas, fórmulas e referências técnicas de topografia</p>
      </div>

      {/* Search */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar conceito, norma, fórmula..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:border-primary/50"
        >
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Stats */}
      <div className="flex gap-2 text-xs text-muted-foreground">
        <span className="font-mono-custom">{filtered.length} tópicos encontrados</span>
        {search && <span>· busca: "{search}"</span>}
      </div>

      {/* Topics */}
      <div className="space-y-3">
        {filtered.map((topic) => {
          const Icon = topic.icon;
          const isOpen = expanded === topic.id;
          return (
            <div key={topic.id} className="gradient-card rounded-xl border border-border overflow-hidden card-hover">
              <button
                onClick={() => setExpanded(isOpen ? null : topic.id)}
                className="w-full flex items-start gap-4 px-5 py-4 hover:bg-white/5 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-display font-semibold text-foreground">{topic.title}</h3>
                    {isOpen
                      ? <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      : <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1.5">{topic.category}</p>
                  <p className="text-sm text-muted-foreground">{topic.summary}</p>
                  {!isOpen && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {topic.keywords.slice(0, 4).map((kw) => (
                        <span key={kw} className="topo-badge px-1.5 py-0.5 rounded bg-secondary border border-border text-muted-foreground">{kw}</span>
                      ))}
                    </div>
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border px-5 py-4">
                  <div className="prose prose-sm max-w-none text-foreground">
                    {topic.content.split("\n").map((line, i) => {
                      if (line.startsWith("**") && line.endsWith("**")) {
                        return <p key={i} className="font-display font-semibold text-primary mb-1 mt-3">{line.replace(/\*\*/g, "")}</p>;
                      }
                      if (line.startsWith("`") && line.endsWith("`")) {
                        return (
                          <div key={i} className="my-2">
                            <code className="block px-3 py-2 bg-background rounded-lg border border-border font-mono-custom text-xs text-primary">
                              {line.replace(/`/g, "")}
                            </code>
                          </div>
                        );
                      }
                      if (line.startsWith("✓") || line.startsWith("✗") || line.startsWith("•") || line.startsWith("-")) {
                        return (
                          <p key={i} className={`text-sm pl-2 ${line.startsWith("✓") ? "text-success" : line.startsWith("✗") ? "text-destructive" : "text-foreground"}`}>
                            {line}
                          </p>
                        );
                      }
                      if (!line.trim()) return <div key={i} className="h-2" />;
                      return <p key={i} className="text-sm text-foreground leading-relaxed">{line.replace(/\*\*/g, "")}</p>;
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>Nenhum tópico encontrado para "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
