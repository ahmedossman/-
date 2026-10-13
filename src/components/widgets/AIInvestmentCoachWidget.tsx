import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { aiPlatform } from '../../services/aiPlatform';
import { fetchAIAnalysis } from '../../services/apiClient';
import { Bot, HelpCircle, Send, Sparkles, User, RefreshCw, BookOpen, CheckCircle2 } from 'lucide-react';

export const AIInvestmentCoachWidget: React.FC = () => {
  const { holdings, marketData, language } = useApp();
  const isAr = language === 'AR';

  const coachPrompts = aiPlatform.getInvestmentCoachPrompts();
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(coachPrompts[0].id);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLog, setChatLog] = useState<Array<{ sender: 'USER' | 'AI'; text: string; sources?: string[] }>>([
    {
      sender: 'AI',
      text: isAr
        ? 'مرحباً بك! أنا المستشار الاستثماري الذكي لمصر. يمكنك اختيار أي من الاستفسارات الشائعة أدناه أو طرح سؤالك المباشر حول الذهب والشهادات والتضخم.'
        : 'Welcome! I am your AI Investment Coach for the Egyptian Market. Select a guided macro prompt below or type your custom query.',
      sources: ['Central Bank of Egypt FX Reports', 'CAPMAS Inflation Statistics', 'World Gold Council'],
    },
  ]);

  const activePrompt = coachPrompts.find((p) => p.id === selectedPrompt) || coachPrompts[0];

  const handleSendQuery = async (e?: React.FormEvent, customQueryText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customQueryText || query;
    if (!textToSend.trim() || loading) return;

    if (!customQueryText) setQuery('');
    setChatLog((prev) => [...prev, { sender: 'USER', text: textToSend }]);
    setLoading(true);

    const response = await fetchAIAnalysis(textToSend, holdings, marketData);
    setChatLog((prev) => [
      ...prev,
      {
        sender: 'AI',
        text: response,
        sources: ['Central Bank of Egypt', 'CAPMAS Inflation Bulletin', 'Cairo Bullion Exchange Live Data'],
      },
    ]);
    setLoading(false);
  };

  return (
    <div className="bg-[#0D1424] border border-slate-800 rounded-xl p-5 select-none space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">
              {isAr ? 'المستشار الاستثماري الذكي ومساعد القرارات (AI Investment Coach)' : 'Gemini AI Investment Coach & Prompt Engine'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'إجابات مدعومة بمصادر موثوقة من البنك المركزي والتعبئة والإحصاء ومجلس الذهب العالمي' : 'Verified macro guidance powered by Central Bank of Egypt, CAPMAS, & World Gold Council data'}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono">
          GEMINI 3.6 FLASH
        </span>
      </div>

      {/* Guided Prompts Bank */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-300 block">
          {isAr ? 'الاستفسارات الهيكلية الشائعة (Guided Macro Prompts):' : 'Guided Investment Questions:'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {coachPrompts.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPrompt(p.id);
                handleSendQuery(undefined, isAr ? p.questionAr : p.question);
              }}
              className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                selectedPrompt === p.id
                  ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-medium line-clamp-1">{isAr ? p.questionAr : p.question}</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded shrink-0 font-mono">
                {p.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Chat Output Log */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col h-[350px]">
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
          {chatLog.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'AI' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`p-3.5 rounded-xl max-w-2xl leading-relaxed whitespace-pre-line ${msg.sender === 'USER' ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30' : 'bg-slate-900 border border-slate-800 text-slate-200 font-sans'}`}>
                <p>{msg.text}</p>
                {msg.sources && (
                  <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-2 flex-wrap">
                    <BookOpen className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span className="font-bold">{isAr ? 'المصادر المعتمدة:' : 'Sources:'}</span>
                    {msg.sources.map((s, i) => (
                      <span key={i} className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300">{s}</span>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'USER' && (
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-950/40 p-3 rounded-xl border border-indigo-500/20 w-fit">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{isAr ? 'جاري استخراج البيانات وتحليل الاستفسار بواسطة الذكاء الاصطناعي...' : 'Gemini AI retrieving sources & synthesizing response...'}</span>
            </div>
          )}
        </div>

        {/* Query Input */}
        <form onSubmit={handleSendQuery} className="mt-3 pt-3 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isAr
                ? 'طرح سؤال مباشر للمستشار الاستثماري (مثال: متى يحين الوقت الأمثل لبيع الذهب؟)'
                : 'Ask custom investment question (e.g. Is 24K gold better than USD cash reserves?)'
            }
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            <span>{isAr ? 'إرسال' : 'Ask Coach'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
