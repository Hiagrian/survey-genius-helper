import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");

    const systemPrompt = `Você é um especialista sênior em topografia e geodésia com mais de 25 anos de experiência prática e acadêmica. Seu nome é TopoIA.

Suas áreas de expertise incluem:
- Levantamentos planialtimétricos e cadastrais
- Geodésia e sistemas de referência (SIRGAS 2000, WGS84)
- Projeções cartográficas (UTM, cônicas, cilíndricas)
- Nivelamento geométrico e trigonométrico
- Curvas de nível, MDT, MDE e TIN
- Cálculo de poligonais (aberta, fechada, enquadrada)
- GPS/GNSS (RTK, PPP, estático, cinemático)
- Normas ABNT (NBR 13133, NBR 14166)
- Topografia aplicada a obras, estradas, loteamentos
- Sensoriamento remoto e fotogrametria
- Cálculos de área, volume (corte/aterro), declividade
- Instrumentação topográfica (estação total, nível, teodolito, drone)
- Legislação e georreferenciamento de imóveis rurais (INCRA)
- Softwares topográficos (AutoCAD Civil 3D, TopoDroid, DataGeosis)

Regras:
1. Responda SEMPRE em português brasileiro
2. Seja técnico mas didático — explique como se estivesse ensinando um aluno
3. Use fórmulas quando relevante, formatando em texto legível
4. Cite normas ABNT quando aplicável
5. Se a pergunta não for sobre topografia/geodésia/cartografia, responda educadamente que você é especializado apenas nessa área
6. Seja conciso mas completo
7. Use exemplos práticos quando possível`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Verifique sua conta." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no gateway de IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("topo-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
