'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2, Sparkles, FlaskConical, ChefHat, Shield, Calculator, Search, Zap } from 'lucide-react';
import { clsx } from 'clsx';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  toolCalls?: any[];
  toolResults?: any;
  timestamp: Date;
}

interface RecipeCard {
  id: string;
  name: string;
  category: string;
  description: string;
  steps: Array<{ ingredient: string; amount: number; unit: string; notes?: string }>;
  nutrition: {
    perServing: { calories: number; sugarG: number; abv: number; costUsd: number };
    per100ml: { calories: number; sugarG: number };
  };
  allergens: string[];
  dietaryTags: string[];
  regulatoryFlags: { compliant: boolean; warnings: string[]; errors: string[] };
  costPerServing: number;
  costPerBatch: number;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Welcome to **Dr. Bev** — your AI beverage formulation partner! 🧪

I help food-tech founders create production-ready drink recipes with:
- **Precision nutrition** — calories, sugar, ABV per serving & 100ml
- **Regulatory compliance** — EU, UK, US, CA, AU checked automatically
- **Cost optimization** — per-serving & batch costs with supplier data
- **Smart substitutions** — cost, dietary, allergen, or regulatory swaps

**Try asking me:**
- "Create a low-sugar tropical ambrosia with <5g sugar/100ml, vegan, <$0.50/serving"
- "Functional mocktail with adaptogens & nootropics, <50 cal, halal certified"
- "Scale my craft cocktail to 1000L batch — check EU novel food & UK compliance"
- "Substitute stevia for sugar in my recipe — keep flavor profile"

What are we formulating today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [sessionId] = useState(() => `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const scroll = useCallback(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), []);
  useEffect(() => scroll(), [messages, scroll]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || streaming) return;
    const userMessage: Message = { 
      id: `m_${Date.now()}`, 
      role: 'user', 
      content: input, 
      timestamp: new Date() 
    };
    const currentInput = input;
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setStreaming(true);
    
    // Create assistant message placeholder
    const assistantId = `m_${Date.now()}_assistant`;
    setMessages((prev) => [...prev, { 
      id: assistantId, 
      role: 'assistant', 
      content: '', 
      toolCalls: [], 
      toolResults: null,
      timestamp: new Date() 
    }]);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })), 
          sessionId 
        }),
      });
      if (!res.ok) throw new Error('Failed');
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let toolCalls: any[] = [];
      let toolResults: any = null;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split('\n')) {
            if (line.startsWith('0:')) {
              accumulatedContent += line.slice(2);
              setMessages((prev) => prev.map((m) => 
                m.id === assistantId 
                  ? { ...m, content: accumulatedContent, toolCalls, toolResults }
                  : m
              ));
            } else if (line.startsWith('9:')) {
              try {
                const data = JSON.parse(line.slice(2));
                if (data.toolCalls) toolCalls = data.toolCalls;
                if (data.toolResults) toolResults = data.toolResults;
                setMessages((prev) => prev.map((m) => 
                  m.id === assistantId 
                    ? { ...m, content: accumulatedContent, toolCalls, toolResults }
                    : m
                ));
              } catch {}
            } else if (line.startsWith('d:')) {
              // Data stream finish marker
            }
          }
        }
      }
      // Final update to ensure complete state
      setMessages((prev) => prev.map((m) => 
        m.id === assistantId 
          ? { ...m, content: accumulatedContent, toolCalls, toolResults }
          : m
      ));
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [...prev, { 
        id: `m_${Date.now()}_error`, 
        role: 'assistant', 
        content: 'Error occurred. Please try again.', 
        timestamp: new Date() 
      }]);
      // Remove the incomplete assistant message
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setStreaming(false);
      taRef.current?.focus();
    }
  };

  const qps = [
    { label: 'Low-sugar ambrosia', prompt: 'Create a low-sugar tropical ambrosia with <5g sugar/100ml, vegan, <$0.50/serving' },
    { label: 'Functional mocktail', prompt: 'Functional mocktail with adaptogens & nootropics, <50 cal, halal certified' },
    { label: 'Batch scale', prompt: 'Scale my recipe to 1000L batch — check EU novel food & UK compliance' },
    { label: 'Sugar substitute', prompt: 'Substitute stevia/monkfruit for sugar — maintain flavor, check regulatory' },
  ];

  return (
    <div className="flex flex-col h-full bg-ambrosia-dark text-white font-sans">
      <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-ambrosia-dark/95 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ambrosia-pink to-ambrosia-teal flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold">Dr. Bev</h1>
            <p className="text-xs text-white/60 font-manrope">AI Beverage Formulation Agent</p>
          </div>
        </div>
        <div className="flex-1 flex justify-center gap-2 flex-wrap">
          {qps.map((q, i) => (
            <button
              key={i}
              onClick={() => {
                setInput(q.prompt);
                submit(new Event('submit') as any);
              }}
              disabled={streaming}
              className="px-3 py-1.5 text-xs font-manrope bg-ambrosia-pink/20 hover:bg-ambrosia-pink/30 text-ambrosia-dark border border-ambrosia-pink/30 rounded-full transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ambrosia-pink/40"
            >
              {q.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50 font-manrope">
          <span className={clsx('w-2 h-2 rounded-full', streaming ? 'bg-ambrosia-pink animate-pulse' : 'bg-green-500')} />
          {streaming ? 'Formulating...' : 'Ready'}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={endRef}>
        {messages.map((m, i) => (
          <MessageBubble key={m.id} message={m} isLast={i === messages.length - 1} />
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={submit} className="p-4 border-t border-white/10 bg-ambrosia-dark/95 backdrop-blur">
        <div className="flex items-end gap-3">
          <textarea
            ref={taRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit(e);
              }
            }}
            placeholder="Describe your drink concept... (Shift+Enter for new line)"
            disabled={streaming}
            rows={1}
            className="flex-1 min-h-[48px] max-h-48 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-ambrosia-pink focus:ring-2 focus:ring-ambrosia-pink/20 resize-none font-manrope text-sm"
            style={{ lineHeight: '1.5' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || streaming}
            className={clsx(
              'w-12 h-12 rounded-2xl flex items-center justify-center transition',
              'bg-gradient-to-br from-ambrosia-pink to-ambrosia-teal text-white',
              'hover:scale-105 hover:shadow-lg hover:shadow-ambrosia-pink/30',
              'disabled:opacity-50 disabled:hover:scale-100',
              'focus:outline-none focus:ring-2 focus:ring-ambrosia-pink/40 focus:ring-offset-2 focus:ring-offset-ambrosia-dark'
            )}
          >
            {streaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="mt-2 text-xs text-white/40 text-center font-manrope">
          Powered by Groq Llama 3.1 70B · Streaming · Tool-augmented
        </p>
      </form>
    </div>
  );
}

function MessageBubble({
  message,
  isLast,
}: {
  message: Message;
  isLast: boolean;
}) {
  const u = message.role === 'user';
  return (
    <div className={clsx('flex gap-3 animate-fade-in', u ? 'flex-row-reverse' : '')}>
      {!u && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-ambrosia-pink to-ambrosia-teal flex items-center justify-center flex-shrink-0 mt-1">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={clsx('max-w-[85%]', u ? 'order-2' : 'order-1')}>
        <div
          className={clsx(
            'rounded-2xl px-4 py-3',
            u
              ? 'bg-gradient-to-br from-ambrosia-pink/20 to-ambrosia-teal/20 border border-ambrosia-pink/30 rounded-tr-none'
              : 'bg-white/5 border border-white/10 rounded-tl-none'
          )}
        >
          <div className="prose prose-invert max-w-none text-sm">{format(message.content)}</div>
          {message.toolCalls?.length && <ToolCallsDisplay toolCalls={message.toolCalls} />}
          {message.toolResults && <ToolResultsDisplay results={message.toolResults} />}
        </div>
        <p className={clsx('text-[10px] text-white/30 mt-1 px-1', u ? 'text-right' : '')}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {u && (
        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
          <ChefHat className="w-4 h-4 text-white/60" />
        </div>
      )}
    </div>
  );
}

function ToolCallsDisplay({ toolCalls }: { toolCalls: Array<{ name: string; args: Record<string, unknown> }> }) {
  const iconMap: Record<string, React.ElementType> = {
    searchIngredients: Search,
    calculateNutrition: Calculator,
    checkCompatibility: Shield,
    suggestSubstitutes: Zap,
    checkRegulatoryCompliance: Shield,
    generateRecipe: FlaskConical,
  };
  return (
    <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
      {toolCalls.map((call, i) => {
        const Icon = iconMap[call.name] || Zap;
        return (
          <details key={i} className="group">
            <summary className="flex items-center gap-2 text-xs text-white/60 cursor-pointer font-manrope">
              <Icon className="w-3 h-3 text-ambrosia-pink" />
              <span className="capitalize">{call.name.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className="text-white/30 ml-auto">{JSON.stringify(call.args).slice(0, 80)}...</span>
            </summary>
            <pre className="mt-2 p-2 bg-black/30 rounded text-[10px] text-white/70 overflow-x-auto max-h-60">
              {JSON.stringify(call.args, null, 2)}
            </pre>
          </details>
        );
      })}
    </div>
  );
}

function ToolResultsDisplay({ results }: { results: unknown }) {
  if (!results) return null;
  const result = results as { recipe?: RecipeCard; name?: string; steps?: unknown[] };
  if (result.recipe || (result.name && result.steps))
    return <RecipeCardDisplay recipe={result.recipe || result as RecipeCard} />;
  return (
    <details className="mt-3 group">
      <summary className="flex items-center gap-2 text-xs text-white/60 cursor-pointer font-manrope">
        <Zap className="w-3 h-3 text-ambrosia-teal" />
        Tool Result
      </summary>
      <pre className="mt-2 p-2 bg-black/30 rounded text-[10px] text-white/70 overflow-x-auto max-h-60">
        {JSON.stringify(results, null, 2).slice(0, 3000)}
      </pre>
    </details>
  );
}

function RecipeCardDisplay({ recipe }: { recipe: RecipeCard }) {
  return (
    <div className="mt-4 p-4 bg-gradient-to-br from-ambrosia-pink/10 to-ambrosia-teal/10 border border-ambrosia-pink/20 rounded-xl animate-slide-up">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-heading text-lg font-bold text-white">{recipe.name}</h3>
          <p className="text-xs text-white/60 font-manrope capitalize">{recipe.category}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50 font-manrope">
          <span className="px-2 py-0.5 bg-ambrosia-pink/20 rounded-full">
            {recipe.nutrition.perServing.calories.toFixed(0)} cal
          </span>
          <span className="px-2 py-0.5 bg-ambrosia-teal/20 rounded-full">
            {recipe.nutrition.perServing.sugarG.toFixed(1)}g sugar
          </span>
          <span className="px-2 py-0.5 bg-white/10 rounded-full">
            ${recipe.nutrition.perServing.costUsd.toFixed(2)}/serving
          </span>
        </div>
      </div>
      <p className="text-sm text-white/80 mb-3">{recipe.description}</p>
      <div className="space-y-2 mb-3">
        <h4 className="font-medium text-white/70">Steps</h4>
        {recipe.steps.map((s, i) => (
          <div key={i} className="text-xs text-white/70 font-mono">
            {i + 1}. {s.amount}{s.unit} {s.ingredient}{s.notes ? ` — ${s.notes}` : ''}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 text-[10px] text-white/50">
        {recipe.allergens.map((a) => (
          <span key={a} className="px-2 py-0.5 bg-white/10 rounded">
            {a}
          </span>
        ))}
        {recipe.dietaryTags.map((d) => (
          <span key={d} className="px-2 py-0.5 bg-ambrosia-teal/20 rounded">
            {d}
          </span>
        ))}
      </div>
      <div className="mt-3 text-xs text-white/50">
        {recipe.regulatoryFlags.compliant ? (
          <span className="text-green-400">✓ Regulatory compliant</span>
        ) : (
          <span className="text-red-400">
            ✗ Issues: {recipe.regulatoryFlags.warnings.join(', ')}
          </span>
        )}
      </div>
    </div>
  );
}

function format(c: string) {
  return c
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code className="px-1.5 py-0.5 bg-black/30 rounded text-ambrosia-pink text-xs font-mono">$1</code>')
    .replace(/\n/g, '<br/>');
}