import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, AlertCircle, Sparkles, User, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  getCurrentMonthRevenue, getCurrentMonthProfit, getCurrentMonthExpenseTotal,
  getTopProducts, getExpensesByCategory,
} from '../store/useStore';
import { formatCurrency, formatPercent, generateId } from '../lib/utils';
import type { ChatMessage } from '../types';

const quickQuestions = [
  'Quanto lucrei esse mês?',
  'Qual produto deu mais lucro?',
  'Onde estou gastando mais?',
  'Vale a pena vender a R$ 19,90?',
  'Quanto preciso vender para sobrar R$ 3.000?',
  'Qual produto devo produzir mais?',
  'Qual minha margem atual?',
  'Quando vou atingir R$ 5.000 de lucro?',
];

export default function AIAssistant() {
  const sales = useStore((s) => s.sales);
  const expenses = useStore((s) => s.expenses);
  const chatMessages = useStore((s) => s.chatMessages);
  const addChatMessage = useStore((s) => s.addChatMessage);
  const settings = useStore((s) => s.settings);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const revenue = getCurrentMonthRevenue(sales);
  const profit = getCurrentMonthProfit(sales);
  const expenseTotal = getCurrentMonthExpenseTotal(expenses);
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const topProducts = getTopProducts(sales);
  const expensesByCategory = getExpensesByCategory(expenses);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  function generateResponse(question: string): string {
    const q = question.toLowerCase();

    if (q.includes('lucrei') || q.includes('lucro esse mês') || q.includes('quanto lucr')) {
      return `Com base nos dados de **maio de 2026**, aqui está seu resumo financeiro:\n\n• **Faturamento bruto:** ${formatCurrency(revenue)}\n• **Total de gastos:** ${formatCurrency(expenseTotal)}\n• **Lucro líquido:** ${formatCurrency(profit)}\n• **Margem de lucro:** ${formatPercent(margin)}\n\n${profit > 2000 ? '🎉 Ótimo resultado! Sua margem está acima de 50%, o que é excelente para o setor de impressão 3D.' : 'Há espaço para crescer. Foco em reduzir custos de materiais e aumentar volume de vendas.'}\n\nSua margem atual de **${formatPercent(margin)}** é ${margin > 60 ? 'excelente' : margin > 40 ? 'boa' : 'abaixo do ideal'}. A referência do mercado para produtos impressos 3D é de 50-70%.`;
    }

    if (q.includes('mais lucro') || q.includes('produto') && q.includes('lucr')) {
      const top = topProducts[0];
      if (!top) return 'Ainda não há dados suficientes de vendas para analisar. Registre mais vendas!';
      return `O produto mais lucrativo de maio foi:\n\n🏆 **${top.name}**\n• Lucro total: **${formatCurrency(top.profit)}**\n• Unidades vendidas: **${top.units}**\n• Faturamento: **${formatCurrency(top.revenue)}**\n• Margem: **${formatPercent(top.revenue > 0 ? (top.profit / top.revenue) * 100 : 0)}**\n\nPara melhorar ainda mais:\n1. Aumente o volume de produção deste item\n2. Explore marketplaces com taxas menores (TikTok Shop tem taxa de 10%)\n3. Considere criar variações do produto para aumentar o ticket médio`;
    }

    if (q.includes('gastando') || q.includes('gastos') || q.includes('despesas')) {
      const top3 = expensesByCategory.slice(0, 3);
      const topCat = top3[0];
      return `Análise dos seus gastos de maio:\n\n${top3.map((c, i) => `${i + 1}. **${c.category}**: ${formatCurrency(c.value)} (${formatPercent(expenseTotal > 0 ? (c.value / expenseTotal) * 100 : 0)})`).join('\n')}\n\n**Total de gastos:** ${formatCurrency(expenseTotal)}\n\n💡 **Dica:** ${topCat ? `${topCat.category} representa a maior fatia dos seus custos. ` : ''}Para reduzir custos com filamentos, considere comprar em maior volume (lotes acima de 10kg têm desconto de 15-20% nos fornecedores). Também vale comparar preços entre Polymaker, Bambu e marcas nacionais.`;
    }

    if (q.includes('r$ 19') || q.includes('vale a pena') || q.includes('19,90')) {
      const avgCost = topProducts.reduce((s, p) => s + (p.revenue / Math.max(p.units, 1) * 0.3), 0) / Math.max(topProducts.length, 1);
      return `Análise de viabilidade para vender a R$ 19,90:\n\n**Cenário típico para produto pequeno:**\n• Custo de produção estimado: R$ 4,00–6,00\n• Embalagem: R$ 1,00–2,00\n• Taxa marketplace (12-14%): R$ 2,39–2,79\n• **Lucro estimado: R$ 9,11–13,51**\n• **Margem estimada: 46–68%**\n\n✅ **Conclusão:** Sim, vale a pena se o custo de produção ficar abaixo de R$ 7,50. Para maximizar o retorno:\n1. Prefira marketplaces com taxas menores (TikTok Shop: 10%)\n2. Agrupe em packs (3 por R$ 49,90 = melhor conversão)\n3. Negocie frete incluso para aumentar conversão`;
    }

    if (q.includes('3.000') || q.includes('r$ 3') || q.includes('sobrar')) {
      const monthlyProfit = profit;
      const needed = 3000 - monthlyProfit;
      const avgProfitPerSale = sales.length > 0 ? profit / Math.max(sales.filter((s) => {
        const d = new Date(s.date);
        const now = new Date('2026-05-31');
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      }).length, 1) : 50;

      return `Para atingir R$ 3.000 de lucro líquido por mês:\n\n**Situação atual (maio):** ${formatCurrency(monthlyProfit)} de lucro\n**Falta:** ${needed > 0 ? formatCurrency(needed) : '✅ Meta já atingida!'}\n\n${needed > 0 ? `**O que fazer:**\n• Com ticket médio atual, você precisa de aprox. **${Math.ceil(needed / avgProfitPerSale)} vendas adicionais**\n• Ou aumentar preços médios em **${formatPercent((needed / Math.max(revenue, 1)) * 100)}**\n\n**Estratégias recomendadas:**\n1. 🎯 Focar em produtos com margem > 65%\n2. 📦 Criar combos e kits para aumentar ticket médio\n3. 🚀 Investir mais em TikTok Shop (menor taxa + maior alcance)\n4. 💼 Buscar clientes atacado (20+ unidades com margem de 30-40%)` : '🎉 Parabéns! Você já superou a meta de R$ 3.000!'}`;
    }

    if (q.includes('produzir mais') || q.includes('produção')) {
      const sorted = [...topProducts].sort((a, b) => {
        const mA = a.revenue > 0 ? (a.profit / a.revenue) * 100 : 0;
        const mB = b.revenue > 0 ? (b.profit / b.revenue) * 100 : 0;
        return mB - mA;
      });
      const best = sorted[0];
      return `Com base na análise de margem × volume, minha recomendação é:\n\n🏆 **Prioridade máxima: ${best?.name ?? 'Chaveiro Personalizado'}**\n• Alta margem + alto volume de vendas\n• Menor tempo de impressão por unidade\n• Baixo custo de material\n\n**Estratégia de produção sugerida:**\n1. Programe impressões noturnas de chaveiros e organizadores\n2. Reserve horários diurnos para itens de maior valor (decoração, miniaturas)\n3. Mantenha estoque mínimo de 10 unidades dos top 3 produtos\n\n**Meta sugerida:** Produzir 50% a mais dos produtos mais vendidos na próxima semana.`;
    }

    if (q.includes('margem') || q.includes('margem atual')) {
      return `Sua margem de lucro atual em maio de 2026:\n\n• **Margem geral:** ${formatPercent(margin)}\n• **Faturamento:** ${formatCurrency(revenue)}\n• **Custos totais:** ${formatCurrency(expenseTotal + revenue - profit)}\n\n**Avaliação:** ${margin >= 60 ? '🟢 Excelente! Acima da média do mercado de impressão 3D (50-70%)' : margin >= 40 ? '🟡 Boa margem, mas há espaço para melhorar' : '🔴 Margem abaixo do ideal. Revise seus preços e custos'}\n\n**Dicas para aumentar a margem:**\n1. Negocie melhores preços com fornecedores de filamento\n2. Aumente preços em 5-10% em marketplaces com menos sensibilidade a preço (Amazon)\n3. Reduza taxa de falha de impressão para diminuir desperdício de material`;
    }

    if (q.includes('5.000') || q.includes('5000')) {
      const monthlyGrowth = 0.12;
      const monthsNeeded = profit > 0 ? Math.ceil(Math.log(5000 / profit) / Math.log(1 + monthlyGrowth)) : 6;
      return `Para atingir R$ 5.000/mês de lucro:\n\n**Situação atual:** ${formatCurrency(profit)}/mês\n**Meta:** R$ 5.000/mês\n\nCom crescimento médio de 12% ao mês:\n**Estimativa: ${monthsNeeded} ${monthsNeeded === 1 ? 'mês' : 'meses'}**\n\n**Marcos intermediários:**\n• 1 mês: ${formatCurrency(profit * 1.12)}\n• 2 meses: ${formatCurrency(profit * Math.pow(1.12, 2))}\n• 3 meses: ${formatCurrency(profit * Math.pow(1.12, 3))}\n\n**Para acelerar o crescimento:**\n1. Lançar 2-3 novos produtos por mês\n2. Criar presença no TikTok (maior crescimento orgânico)\n3. Buscar parcerias com lojas físicas de games/hobbies`;
    }

    return `Entendi sua pergunta: "${question}"\n\nCom base nos seus dados de maio de 2026:\n• Faturamento: ${formatCurrency(revenue)}\n• Lucro: ${formatCurrency(profit)}\n• Margem: ${formatPercent(margin)}\n\nPara uma resposta mais precisa sobre esse tópico específico, configure sua chave OpenAI nas configurações. Por enquanto, posso analisar seus dados e responder perguntas sobre lucro, produtos, gastos, metas e estratégias de crescimento!\n\nTente perguntar: "Qual produto deu mais lucro?" ou "Quanto lucrei esse mês?"`;
  }

  async function handleSend(messageText?: string) {
    const text = messageText ?? input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800));

    const response = generateResponse(text);
    const assistantMsg: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(assistantMsg);
    setIsTyping(false);
  }

  function formatMessageContent(content: string) {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="text-slate-100 font-semibold">{part.slice(2, -2)}</strong>;
      }
      return <span key={idx}>{part}</span>;
    });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-100">Assistente Financeiro IA</h2>
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full border border-indigo-500/30">Beta</span>
            </div>
            <p className="text-sm text-slate-500">Análise inteligente do seu negócio</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-green-400">Online</span>
        </div>
      </div>

      {/* API Key notice */}
      {!settings.openaiApiKey && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-4">
          <AlertCircle size={16} className="text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-300">
            Configure sua chave OpenAI nas <span className="underline cursor-pointer">configurações</span> para respostas reais via IA. Por enquanto, o assistente usa dados reais do seu negócio com respostas pré-calculadas.
          </p>
        </div>
      )}

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Quick questions panel */}
        <div className="hidden lg:flex flex-col w-64 flex-shrink-0">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-indigo-400" />
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Perguntas Rápidas</h3>
            </div>
            <div className="space-y-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors group border border-transparent hover:border-slate-700"
                >
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
                  <span className="text-xs leading-tight">{q}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'assistant'
                    ? 'bg-gradient-to-br from-indigo-500 to-violet-600'
                    : 'bg-gradient-to-br from-slate-600 to-slate-700'
                }`}>
                  {msg.role === 'assistant' ? (
                    <Bot size={14} className="text-white" />
                  ) : (
                    <User size={14} className="text-white" />
                  )}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {formatMessageContent(msg.content)}
                  </p>
                  <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions on mobile */}
          <div className="lg:hidden flex gap-2 overflow-x-auto py-3 flex-shrink-0">
            {quickQuestions.slice(0, 4).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="flex-shrink-0 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 hover:bg-slate-700 transition-colors whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <div className="flex items-center gap-3 mt-3 bg-slate-800 border border-slate-700 rounded-2xl p-3 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Pergunte sobre suas finanças..."
              className="flex-1 bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none"
              disabled={isTyping}
            />
            <button
              className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-700 transition-colors"
              title="Gravar áudio"
            >
              <Mic size={18} />
            </button>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center disabled:opacity-40 hover:from-indigo-600 hover:to-violet-700 transition-all"
            >
              <Send size={15} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
