import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, mimeType } = await req.json();
    if (!imageBase64) throw new Error("Imagem não fornecida");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");

    const systemPrompt = `Você é um especialista sênior em topografia com mais de 20 anos de experiência, especializado em análise técnica de produtos cartográficos, levantamentos planialtimétricos, modelagem digital do terreno e normas ABNT.

Ao analisar uma imagem topográfica, você deve:
1. Identificar o tipo de representação topográfica (curvas de nível, malha triangular TIN, perfil, planta, croqui, seção, etc.)
2. Verificar se está tecnicamente correto conforme normas ABNT (NBR 13133 e outras relevantes)
3. Apontar erros técnicos específicos e explicar por que estão errados
4. Fornecer orientações detalhadas de como corrigir
5. Dar dicas profissionais adicionais

Responda SEMPRE em JSON com este formato exato:
{
  "status": "correct" | "incorrect" | "partial",
  "title": "título resumido da análise",
  "topic": "nome do tópico topográfico identificado (ex: Curvas de Nível, TIN, Nivelamento, etc.)",
  "conclusion": "parágrafo conciso com a conclusão técnica principal",
  "reasons": ["lista de razões/evidências que suportam a conclusão"],
  "corrections": ["lista de ações de correção específicas (apenas se houver erros)"],
  "tips": ["lista de 2-3 dicas profissionais de boas práticas"]
}

Seja técnico, preciso e educativo. Use terminologia topográfica correta em português.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${imageBase64}` },
              },
              {
                type: "text",
                text: "Analise esta imagem topográfica. Identifique o que é, verifique se está correto tecnicamente, explique os motivos e forneça orientações. Responda em JSON conforme especificado.",
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de análises atingido. Tente novamente em instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Verifique sua conta." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Erro da API: ${response.status} — ${errorText}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;
    if (!content) throw new Error("Resposta vazia da IA");

    const parsed = JSON.parse(content);
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Erro em analyze-topo-image:", err);
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
