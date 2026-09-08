'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2, Sparkles, FlaskConical, ChefHat, Shield, Calculator, Search, Zap } from 'lucide-react';
import { clsx } from 'clsx';

interface Message { id: string; role: 'user'|'assistant'|'tool'; content: string; toolCalls?: any[]; toolResults?: any; timestamp: Date; }
interface RecipeCard { id: string; name: string; category: string; description: string; steps: Array<{ingredient:string;amount:number;unit:string;notes?:string}>; nutrition: {perServing:{calories:number;sugarG:number;abv:number;costUsd:number};per100ml:{calories:number;sugarG:number}}; allergens:string[]; dietaryTags:string[]; regulatoryFlags:{compliant:boolean;warnings:string[];errors:string[]}; costPerServing:number; costPerBatch:number; }

export function ChatInterface() {
  const [messages,setMessages]=useState<Message[]>([{id:'welcome',role:'assistant',content:`Welcome to **Dr. Bev** — your AI beverage formulation partner! 🧪

I help food-tech founders create production-ready drink recipes with:
- **Precision nutrition** — calories, sugar, ABV per serving & 100ml
- **Regulatory compliance** — EU, UK, US, CA, AU checked automatically
- **Cost optimization** — per-serving & batch costs with supplier data
- **Smart substitutions** — cost, dietary, allergen, or regulatory swaps

**Try asking me:**
- "Create a low-sugar tropical soda with <5g sugar/100ml, vegan, <$0.50/serving"
- "Functional mocktail with adaptogens & nootropics, <50 cal, halal certified"
- "Scale my craft cocktail to 1000L batch — check EU novel food & UK compliance"
- "Substitute stevia for sugar in my recipe — keep flavor profile"

What are we formulating today?`,timestamp:new Date()}]);
  const [input,setInput]=useState(''); const [streaming,setStreaming]=useState(false);
  const [sessionId]=useState(()=>`sess_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const endRef=useRef<HTMLDivElement>(null); const taRef=useRef<HTMLTextAreaElement>(null);
  const scroll=useCallback(()=>endRef.current?.scrollIntoView({behavior:'smooth'}),[]);
  useEffect(()=>scroll(),[messages,scroll]);

  const submit=async(e:React.FormEvent)=>{e.preventDefault();if(!input.trim()||streaming)return;
    const um:Message={id:`m_${Date.now()}`,role:'user',content:input,timestamp:new Date()};
    setMessages(p=>[...p,um]); const txt=input;setInput('');setStreaming(true);
    try{const res=await fetch('/api/agent',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[...messages,um],sessionId})});
      if(!res.ok)throw new Error('Failed');const rd=res.body?.getReader();const dec=new TextDecoder();let ac='',tc:any[]=[],tr:any=null;
      const aid=`m_${Date.now()}`;let am:Message={id:aid,role:'assistant',content:'',timestamp:new Date()};
      setMessages(p=>[...p,am]);
      if(rd){while(true){const{done,value}=await rd.read();if(done)break;const chunk=dec.decode(value);for(const line of chunk.split('\\n')){if(line.startsWith('0:')){ac+=line.slice(2);am={...am,content:ac};setMessages(p=>p.map(m=>m.id===aid?am:m));}else if(line.startsWith('9:')){try{const d=JSON.parse(line.slice(2));if(d.toolCalls)tc=d.toolCalls;if(d.toolResults)tr=d.toolResults;am={...am,toolCalls:tc,toolResults:tr};setMessages(p=>p.map(m=>m.id===aid?am:m));}catch{}}}}}}catch{setMessages(p=>[...p,{id:`m_${Date.now()}`,role:'assistant',content:'Error occurred. Try again.',timestamp:new Date()}]);}finally{setStreaming(false);taRef.current?.focus();}};

  const qps=[{label:'Low-sugar soda',prompt:'Create a low-sugar tropical soda with <5g sugar/100ml, vegan, <$0.50/serving'},{label:'Functional mocktail',prompt:'Functional mocktail with adaptogens & nootropics, <50 cal, halal certified'},{label:'Batch scale',prompt:'Scale my recipe to 1000L batch — check EU novel food & UK compliance'},{label:'Sugar substitute',prompt:'Substitute stevia/monkfruit for sugar — maintain flavor, check regulatory'}];
  return <div className="flex flex-col h-full bg-soda-dark text-white font-sans">
    <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-soda-dark/95 backdrop-blur sticky top-0 z-10">
      <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-soda-pink to-soda-teal flex items-center justify-center"><FlaskConical className="w-5 h-5 text-white"/></div><div><h1 className="font-heading text-xl font-bold">Dr. Bev</h1><p className="text-xs text-white/60 font-manrope">AI Beverage Formulation Agent</p></div></div>
      <div className="flex-1 flex justify-center gap-2 flex-wrap">{qps.map((q,i)=><button key={i} onClick={()=>{setInput(q.prompt);submit(new Event('submit')as any);}} disabled={streaming} className="px-3 py-1.5 text-xs font-manrope bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition disabled:opacity-50">{q.label}</button>)}</div>
      <div className="flex items-center gap-2 text-xs text-white/50 font-manrope"><span className={clsx('w-2 h-2 rounded-full',streaming?'bg-soda-pink animate-pulse':'bg-green-500')}></span>{streaming?'Formulating...':'Ready'}</div>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={endRef}>{messages.map((m,i)=><MessageBubble key={m.id} message={m} isLast={i===messages.length-1}/>)}<div ref={endRef}/></div>
    <form onSubmit={submit} className="p-4 border-t border-white/10 bg-soda-dark/95 backdrop-blur">
      <div className="flex items-end gap-3"><textarea ref={taRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submit(e);}} placeholder="Describe your drink concept... (Shift+Enter for new line)" disabled={streaming} rows={1} className="flex-1 min-h-[48px] max-h-48 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-soda-pink focus:ring-2 focus:ring-soda-pink/20 resize-none font-manrope text-sm" style={{lineHeight:'1.5'}}/>
        <button type="submit" disabled={!input.trim()||streaming} className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center transition','bg-gradient-to-br from-soda-pink to-soda-teal text-white','hover:scale-105 hover:shadow-lg hover:shadow-soda-pink/30','disabled:opacity-50 disabled:hover:scale-100')}>{streaming?<Loader2 className="w-5 h-5 animate-spin"/>:<Send className="w-5 h-5"/></button></div>
      <p className="mt-2 text-xs text-white/40 text-center font-manrope">Powered by Groq Llama 3.1 70B · Streaming · Tool-augmented</p>
    </form>
  </div>;
}

function MessageBubble({message,isLast}:{message:Message;isLast:boolean}){const u=message.role==='user';return<div className={clsx('flex gap-3 animate-fade-in',u?'flex-row-reverse':'')}>{!u&&<div className="w-8 h-8 rounded-xl bg-gradient-to-br from-soda-pink to-soda-teal flex items-center justify-center flex-shrink-0 mt-1"><Sparkles className="w-4 h-4 text-white"/></div>}<div className={clsx('max-w-[85%]',u?'order-2':'order-1')}>
<div className={clsx('rounded-2xl px-4 py-3',u?'bg-gradient-to-br from-soda-pink/20 to-soda-teal/20 border border-soda-pink/30 rounded-tr-none':'bg-white/5 border border-white/10 rounded-tl-none')}>
<div className="prose prose-invert max-w-none text-sm">{format(message.content)}</div>
{message.toolCalls?.length&&<ToolCallsDisplay toolCalls={message.toolCalls}/>}
{message.toolResults&&<ToolResultsDisplay results={message.toolResults}/>}</div>
<p className={clsx('text-[10px] text-white/30 mt-1 px-1',u?'text-right':'')}>{message.timestamp.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</p></div>{u&&<div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 mt-1"><ChefHat className="w-4 h-4 text-white/60"/></div>}</div>;}
function ToolCallsDisplay({toolCalls}:{toolCalls:any[]}){const ic:any={searchIngredients:Search,calculateNutrition:Calculator,checkCompatibility:Shield,suggestSubstitutes:Zap,checkRegulatoryCompliance:Shield,generateRecipe:FlaskConical};return<div className="mt-3 space-y-2 border-t border-white/10 pt-3">{toolCalls.map((c,i)=>{const I=ic[c.name]||Zap;return<details key={i} className="group"><summary className="flex items-center gap-2 text-xs text-white/60 cursor-pointer font-manrope"><I className="w-3 h-3 text-soda-pink"/><span className="capitalize">{c.name.replace(/([A-Z])/g,' $1').trim()}</span><span className="text-white/30 ml-auto">{JSON.stringify(c.args).slice(0,80)}...</span></summary><pre className="mt-2 p-2 bg-black/30 rounded text-[10px] text-white/70 overflow-x-auto max-h-40">{JSON.stringify(c.result,null,2).slice(0,2000)}</pre></details>;})}</div>;}
function ToolResultsDisplay({results}:{results:any}){if(!results)return null;if(results.recipe||(results.name&&results.steps))return<RecipeCardDisplay recipe={results.recipe||results}/>;return<details className="mt-3 group"><summary className="flex items-center gap-2 text-xs text-white/60 cursor-pointer font-manrope"><Zap className="w-3 h-3 text-soda-teal"/>Tool Result</summary><pre className="mt-2 p-2 bg-black/30 rounded text-[10px] text-white/70 overflow-x-auto max-h-60">{JSON.stringify(results,null,2).slice(0,3000)}</pre></details>;}
function RecipeCardDisplay({recipe}:{recipe:RecipeCard}){return<div className="mt-4 p-4 bg-gradient-to-br from-soda-pink/10 to-soda-teal/10 border border-soda-pink/20 rounded-xl animate-slide-up"><div className="flex items-start justify-between gap-4 mb-3"><div><h3 className="font-heading text-lg font-bold text-white">{recipe.name}</h3><p className="text-xs text-white/60 font-manrope capitalize">{recipe.category}</p></div><div className="flex items-center gap-2 text-xs text-white/50 font-manrope"><span className="px-2 py-0.5 bg-soda-pink/20 rounded-full">{recipe.nutrition.perServing.calories.toFixed(0)} cal</span><span className="px-2 py-0.5 bg-soda-teal/20 rounded-full">{recipe.nutrition.perServing.sugarG.toFixed(1)}g sugar</span><span className="px-2 py-0.5 bg-soda-blue/20 rounded-full">${recipe.nutrition.perServing.costUsd.toFixed(2)}/serving</span></div></div>{recipe.description&&<p className="text-sm text-white/80 mb-3">{recipe.description}</p>}<div className="grid grid-cols-2 gap-4 mb-3"><div><h4 className="text-xs font-manrope text-white/50 uppercase tracking-wider mb-2">Formula</h4><ul className="space-y-1 text-sm">{recipe.steps.map((s,i)=><li key={i} className="flex justify-between text-white/90"><span>{s.ingredient}</span><span className="font-mono text-soda-pink">{s.amount}{s.unit}</span></li>)}</ul></div><div><h4 className="text-xs font-manrope text-white/50 uppercase tracking-wider mb-2">Nutrition (per 100ml)</h4><ul className="space-y-1 text-sm text-white/80"><li>Calories: {recipe.nutrition.per100ml.calories.toFixed(1)}</li><li>Sugar: {recipe.nutrition.per100ml.sugarG.toFixed(1)}g</li><li>ABV: {recipe.nutrition.perServing.abv.toFixed(1)}%</li></ul></div></div><div className="flex flex-wrap gap-2 mb-3">{recipe.allergens.map(a=><span key={a} className="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs rounded-full font-manrope">{a}</span>)}{recipe.dietaryTags.map(d=><span key={d} className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full font-manrope">{d}</span>)}</div>{recipe.regulatoryFlags&&<div className="pt-3 border-t border-white/10"><div className="flex items-center gap-2 text-xs font-manrope mb-2"><span className={clsx('w-2 h-2 rounded-full',recipe.regulatoryFlags.compliant?'bg-green-500':'bg-red-500')}></span><span>{recipe.regulatoryFlags.compliant?'Compliant':'Non-compliant'}</span></div>{recipe.regulatoryFlags.warnings.map(w=><p key={w} className="text-xs text-amber-300 font-manrope">⚠ {w}</p>)}{recipe.regulatoryFlags.errors.map(e=><p key={e} className="text-xs text-red-300 font-manrope">✗ {e}</p>)}</div>}</div>;}
function format(c:string){return c.replace(/\\*\\*(.+?)\\*\\*/g,'<strong>$1</strong>').replace(/\\*(.+?)\\*/g,'<em>$1</em>').replace(/`(.+?)`/g,'<code className="px-1.5 py-0.5 bg-black/30 rounded text-soda-pink text-xs font-mono">$1</code>').replace(/\\n/g,'<br/>');}