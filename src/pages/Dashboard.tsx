import topoHero from "@/assets/topo-hero.jpg";
import { Link } from "react-router-dom";
import { Camera, CheckSquare, BookOpen, Triangle, TrendingUp, Layers, Compass, ArrowRight } from "lucide-react";

const stats = [
  { label: "Conceitos Cobertos", value: "150+", icon: BookOpen, color: "text-accent" },
  { label: "Itens no Checklist", value: "48", icon: CheckSquare, color: "text-primary" },
  { label: "Análises IA", value: "∞", icon: Camera, color: "text-success" },
  { label: "Normas ABNT", value: "12", icon: Layers, color: "text-topo-contour" },
];

const quickLinks = [
  {
    to: "/analisador",
    icon: Camera,
    title: "Analisar Imagem",
    desc: "Envie uma imagem topográfica e receba análise técnica instantânea da IA",
    gradient: "from-primary/20 to-primary/5",
    border: "border-primary/20",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
    badge: "IA Ativa",
  },
  {
    to: "/checklist",
    icon: CheckSquare,
    title: "Meu Checklist",
    desc: "Gerencie e acompanhe seu checklist de levantamento planialtimétrico",
    gradient: "from-accent/20 to-accent/5",
    border: "border-accent/20",
    iconBg: "bg-accent/20",
    iconColor: "text-accent",
    badge: "Dinâmico",
  },
  {
    to: "/conhecimento",
    icon: BookOpen,
    title: "Base de Conhecimento",
    desc: "Conceitos, normas, fórmulas e terminologia completa de topografia",
    gradient: "from-success/20 to-success/5",
    border: "border-success/20",
    iconBg: "bg-success/20",
    iconColor: "text-success",
    badge: "Completo",
  },
];

const topoTopics = [
  "Levantamento Planialtimétrico",
  "Curvas de Nível",
  "Malha Triangular (TIN)",
  "Nivelamento Geométrico",
  "Coordenadas UTM",
  "Poligonal Fechada",
  "Declividade do Terreno",
  "Seção Transversal",
];

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden min-h-[220px] lg:min-h-[280px]">
        <img
          src={topoHero}
          alt="Topografia"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        <div className="relative p-6 lg:p-10 flex flex-col justify-center h-full">
          <div className="flex items-center gap-2 mb-3">
            <div className="topo-badge px-2 py-1 rounded border border-primary/40 text-primary">
              SISTEMA PROFISSIONAL
            </div>
          </div>
          <h1 className="font-display font-bold text-2xl lg:text-4xl text-foreground mb-2 leading-tight">
            TopoGIS — Plataforma de<br className="hidden lg:block" /> Topografia Inteligente
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base max-w-xl mb-4">
            Análise de imagens com IA, checklist de campo, base técnica completa e muito mais. Tudo que você precisa para levantamentos precisos.
          </p>
          <Link
            to="/analisador"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold text-sm w-fit hover:opacity-90 transition-opacity"
          >
            <Camera className="w-4 h-4" />
            Analisar Imagem Agora
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="gradient-card rounded-xl p-4 border border-border shadow-card card-hover">
            <div className="flex items-start justify-between mb-3">
              <Icon className={`w-5 h-5 ${color}`} />
              <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <p className={`font-display font-bold text-2xl ${color} mb-1`}>{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
          <Compass className="w-4.5 h-4.5 text-primary" />
          Acesso Rápido
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {quickLinks.map(({ to, icon: Icon, title, desc, gradient, border, iconBg, iconColor, badge }) => (
            <Link
              key={to}
              to={to}
              className={`group block rounded-xl p-5 border ${border} bg-gradient-to-br ${gradient} hover:scale-[1.01] transition-all duration-200`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <span className={`topo-badge px-2 py-0.5 rounded border ${border} ${iconColor}`}>{badge}</span>
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              <div className={`flex items-center gap-1.5 mt-3 ${iconColor} text-xs font-medium`}>
                Acessar <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Topics covered */}
      <div>
        <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
          <Triangle className="w-4.5 h-4.5 text-primary" />
          Tópicos Cobertos
        </h2>
        <div className="flex flex-wrap gap-2">
          {topoTopics.map((topic) => (
            <span
              key={topic}
              className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-sm text-secondary-foreground hover:border-primary/40 hover:text-primary transition-colors cursor-default"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
