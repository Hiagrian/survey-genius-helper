import { Triangle, Phone } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="border-t border-border bg-card/50 mt-8">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <Triangle className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="font-display font-bold text-foreground text-sm">TopoGIS</p>
            <span className="topo-badge text-primary">Versão Beta</span>
          </div>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Este aplicativo foi desenvolvido para oferecer suporte prático e eficiente às atividades de topografia, reunindo ferramentas essenciais que auxiliam profissionais e estudantes na realização de medições, cálculos e análises em campo.
          </p>
          <p>
            Criado por <span className="text-foreground font-semibold">Hiago Rian</span>, o app está atualmente em <span className="text-primary font-semibold">versão Beta</span>, o que significa que novas funcionalidades, melhorias e atualizações serão implementadas continuamente para aprimorar sua experiência.
          </p>
          <p>
            Caso identifique qualquer erro técnico, instabilidade ou sugestão de melhoria — seja em funcionalidades avançadas ou em detalhes simples — sua colaboração será muito bem-vinda.
          </p>
          <div className="flex items-center gap-2 text-foreground">
            <Phone className="w-4 h-4 text-primary" />
            <span>Entre em contato: <a href="tel:+5519981636472" className="text-primary hover:underline font-medium">+55 19 98163-6472</a></span>
          </div>
          <p className="text-xs text-muted-foreground/60 pt-2">
            Seu feedback é fundamental para tornar este aplicativo cada vez mais completo, preciso e confiável para a área da topografia.
          </p>
        </div>

        <div className="border-t border-border pt-4 flex items-center justify-between text-xs text-muted-foreground/50">
          <span>© 2025 TopoGIS — Hiago Rian</span>
          <span className="topo-badge">v1.0-beta</span>
        </div>
      </div>
    </footer>
  );
}
