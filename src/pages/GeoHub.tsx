import { useState } from "react";
import { ChevronDown, ChevronRight, MapPin, Mountain, Layers, Ruler, Triangle, Compass, Target, TrendingUp, Grid3X3, CircleDot } from "lucide-react";

interface Topic {
  title: string;
  icon: React.ReactNode;
  description: string;
  content: string[];
}

const topics: Topic[] = [
  {
    title: "Curvas de Nível",
    icon: <Mountain className="w-5 h-5" />,
    description: "Linhas que conectam pontos de mesma altitude, representando o relevo do terreno.",
    content: [
      "São linhas imaginárias que unem pontos de mesma cota (altitude) no terreno, formando a representação gráfica do relevo.",
      "A equidistância é o intervalo vertical constante entre curvas consecutivas — quanto menor a equidistância, mais detalhado o levantamento.",
      "Curvas mestras (ou principais) são desenhadas com traço mais espesso a cada 5 intervalos e possuem valor de cota indicado.",
      "Curvas mais próximas indicam terreno íngreme; curvas espaçadas indicam terreno suave ou plano.",
      "As curvas de nível nunca se cruzam e nunca se unem, exceto em casos de penhascos verticais ou cavernas.",
      "São fundamentais para cálculo de volumes de corte e aterro, projetos de drenagem e terraplanagem.",
    ],
  },
  {
    title: "Malha Triangular (TIN)",
    icon: <Grid3X3 className="w-5 h-5" />,
    description: "Rede de triângulos irregulares formada a partir de pontos cotados para representar a superfície do terreno.",
    content: [
      "TIN (Triangulated Irregular Network) é um modelo digital de terreno criado pela triangulação de Delaunay de pontos cotados.",
      "Cada triângulo define uma face plana do terreno, permitindo interpolar cotas em qualquer ponto da superfície.",
      "A malha triangular preserva os pontos originais do levantamento, sem suavização artificial dos dados.",
      "É a base para geração de curvas de nível, cálculo de volumes, perfis e seções transversais.",
      "Triângulos muito achatados ou alongados devem ser evitados pois geram distorções na representação do relevo.",
      "A qualidade do TIN depende diretamente da densidade e distribuição dos pontos coletados em campo.",
    ],
  },
  {
    title: "Pontos de Nível (Benchmarks)",
    icon: <Target className="w-5 h-5" />,
    description: "Referências altimétricas conhecidas utilizadas como base para nivelamento geométrico.",
    content: [
      "Benchmarks (BM) são marcos de referência com altitude conhecida e precisa, utilizados como pontos de partida para nivelamento.",
      "Podem ser referências de nível (RRNN) do IBGE, marcos geodésicos ou pontos materializados no terreno pelo topógrafo.",
      "O nivelamento geométrico é o método mais preciso para determinar diferenças de nível entre pontos.",
      "A contra-nivelação (nivelamento de ida e volta) é obrigatória para verificar a consistência das medições.",
      "A tolerância de fechamento do nivelamento segue a norma ABNT NBR 13133, variando conforme a classe de precisão.",
      "Os pontos de nível são essenciais para controle altimétrico de obras, drenagem e projetos de engenharia.",
    ],
  },
  {
    title: "Taludes",
    icon: <TrendingUp className="w-5 h-5" />,
    description: "Superfícies inclinadas resultantes de cortes ou aterros no terreno.",
    content: [
      "Talude é a superfície inclinada que limita uma plataforma de corte ou aterro, definida pela relação entre altura (H) e base (V:H).",
      "Taludes de corte são resultantes da escavação do terreno natural; taludes de aterro são formados pela deposição de material.",
      "A inclinação do talude depende do tipo de solo, coesão do material, presença de água e normas de segurança.",
      "A representação em planta topográfica usa curvas de nível espaçadas uniformemente nas faces inclinadas.",
      "O pé do talude (base) e a crista (topo) são linhas de mudança de inclinação que devem ser levantadas com precisão.",
      "Taludes instáveis podem causar deslizamentos — a análise geotécnica é complementar ao levantamento topográfico.",
      "O cálculo de volume de corte e aterro em taludes utiliza o método das seções transversais ou prismatóide.",
    ],
  },
  {
    title: "Poligonal Topográfica",
    icon: <Compass className="w-5 h-5" />,
    description: "Sequência de linhas conectadas que formam o esqueleto de referência do levantamento.",
    content: [
      "A poligonal é o conjunto de pontos interligados que serve como estrutura de apoio para o levantamento de detalhes.",
      "Pode ser fechada (retorna ao ponto inicial), enquadrada (entre dois pontos conhecidos) ou aberta (sem verificação).",
      "O erro de fechamento angular deve respeitar a tolerância T = 1'√n, onde n é o número de vértices.",
      "O erro linear de fechamento é compensado pelo método de Bowditch (proporcional aos comprimentos) ou Transit (proporcional às projeções).",
      "A precisão mínima aceitável para levantamento cadastral é de 1:5.000 conforme a NBR 13133.",
      "Os ângulos internos são medidos em séries duplas (posição direta e inversa) para eliminar erros instrumentais.",
      "Os marcos da poligonal devem ser materializados com piquetes, pregos ou marcos de concreto para futuras referências.",
    ],
  },
  {
    title: "Sistema de Coordenadas e Datum",
    icon: <MapPin className="w-5 h-5" />,
    description: "Referencial geodésico utilizado para posicionamento e georreferenciamento.",
    content: [
      "O datum oficial do Brasil é o SIRGAS 2000, adotado desde fevereiro de 2015 como referência obrigatória.",
      "O sistema UTM (Universal Transversa de Mercator) divide o globo em 60 fusos de 6° cada, com coordenadas em metros (E, N).",
      "O Brasil é coberto pelos fusos UTM 18 a 25 Sul, cada um com meridiano central específico.",
      "O fator de escala k₀ no meridiano central do fuso UTM é 0,9996, atingindo k=1 nas linhas secantes.",
      "Coordenadas geodésicas (latitude, longitude, altitude) diferem das coordenadas planas UTM e requerem transformação.",
      "O georreferenciamento de imóveis rurais exige SIRGAS 2000 e rastreamento GNSS conforme normas do INCRA.",
    ],
  },
  {
    title: "Modelo Digital de Terreno (MDT)",
    icon: <Layers className="w-5 h-5" />,
    description: "Representação numérica da superfície do terreno em formato digital.",
    content: [
      "O MDT é a representação matemática da superfície do terreno, excluindo edificações e vegetação.",
      "Pode ser gerado a partir de pontos cotados, curvas de nível digitalizadas ou dados LiDAR/fotogramétricos.",
      "Os métodos de interpolação mais comuns são: TIN, krigagem, inverso da distância ponderada (IDW) e spline.",
      "O MDS (Modelo Digital de Superfície) inclui objetos sobre o terreno — a diferença MDS-MDT gera o modelo de altura.",
      "A resolução do MDT depende da densidade de pontos coletados e da equidistância desejada para as curvas de nível.",
      "É fundamental para projetos de estradas, drenagem, barragens, loteamentos e análises hidrológicas.",
    ],
  },
  {
    title: "Nivelamento Geométrico",
    icon: <Ruler className="w-5 h-5" />,
    description: "Método de alta precisão para determinação de diferenças de nível entre pontos.",
    content: [
      "Consiste em leituras de mira (ré e vante) com nível óptico ou digital, calculando desníveis por diferença de leituras.",
      "O nivelamento composto envolve múltiplas estações intermediárias quando a distância entre pontos é grande.",
      "A visada de ré é feita sobre o ponto de cota conhecida; a visada de vante é feita sobre o ponto a determinar.",
      "O erro de fechamento altimétrico deve respeitar: Classe IIN = 10mm√K (K em km), conforme NBR 13133.",
      "Fontes de erro: curvatura terrestre, refração atmosférica, erro de colimação, desníveis da mira e vibração.",
      "A compensação do erro é feita proporcionalmente à distância ou ao número de estações.",
      "Nivelamento trigonométrico é uma alternativa menos precisa que utiliza ângulos verticais e distâncias.",
    ],
  },
  {
    title: "Estação Total e GNSS",
    icon: <CircleDot className="w-5 h-5" />,
    description: "Equipamentos fundamentais para coleta de dados topográficos e geodésicos.",
    content: [
      "A estação total combina teodolito eletrônico e distanciômetro, medindo ângulos e distâncias simultaneamente.",
      "O modo de medição sem prisma (reflectorless) permite medir pontos inacessíveis até centenas de metros.",
      "A calibração periódica é obrigatória — erros de colimação horizontal e vertical devem ser verificados antes de cada trabalho.",
      "GNSS (Global Navigation Satellite System) utiliza sinais de satélites para posicionamento 3D de alta precisão.",
      "O método RTK (Real Time Kinematic) fornece coordenadas centimétricas em tempo real usando correção diferencial.",
      "O pós-processamento de dados GNSS utiliza efemérides precisas do IGS para melhorar a acurácia.",
      "A combinação estação total + GNSS oferece o melhor resultado para levantamentos cadastrais completos.",
    ],
  },
  {
    title: "Norma ABNT NBR 13133",
    icon: <Triangle className="w-5 h-5" />,
    description: "Norma técnica que regulamenta a execução de levantamentos topográficos no Brasil.",
    content: [
      "A NBR 13133 estabelece as condições exigíveis para execução de levantamento topográfico em áreas urbanas e rurais.",
      "Define classes de precisão: Classe I (alta), Classe II (média) e Classe III (baixa), com tolerâncias específicas.",
      "Especifica métodos de levantamento planimétrico: irradiação, interseção, caminhamento e alinhamento.",
      "Determina critérios para escolha de equipamentos, calibração e condições ambientais de trabalho.",
      "Exige memorial descritivo, planta topográfica com simbologia padronizada e ART/RRT do responsável técnico.",
      "O relatório técnico deve conter: objetivo, metodologia, equipamentos utilizados, resultados e análise de precisão.",
      "É referência obrigatória para contratos de serviços topográficos e perícias judiciais.",
    ],
  },
];

export default function GeoHub() {
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="topo-badge px-2 py-0.5 rounded border border-accent/40 text-accent">MÓDULO EDUCACIONAL</div>
        </div>
        <h1 className="font-display font-bold text-2xl lg:text-3xl text-foreground">GeoHub</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Tudo o que é essencial em um levantamento planialtimétrico cadastral
        </p>
      </div>

      {/* Topics */}
      <div className="space-y-3">
        {topics.map((topic) => {
          const isOpen = openTopic === topic.title;
          return (
            <div key={topic.title} className="gradient-card rounded-xl border border-border overflow-hidden shadow-card">
              <button
                onClick={() => setOpenTopic(isOpen ? null : topic.title)}
                className="w-full flex items-start gap-4 px-5 py-4 hover:bg-white/5 transition-colors text-left"
              >
                <div className="mt-0.5 text-primary flex-shrink-0">{topic.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-foreground text-base">{topic.title}</h3>
                  <p className="text-muted-foreground text-sm mt-0.5 leading-relaxed">{topic.description}</p>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="border-t border-border px-5 py-4 space-y-3">
                  {topic.content.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-primary/60 flex-shrink-0" />
                      <p className="text-sm text-foreground/85 leading-relaxed">{item}</p>
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
