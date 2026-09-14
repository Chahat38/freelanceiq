import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Sparkles, Send, Bot, User, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  time: string;
}

export const AiMentorModule: React.FC = () => {
  const { runAiPrompt, user } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'mentor',
      text: `Assalam-o-Alaikum ${user.name}! I am your AI Freelance Business Mentor. Ask me anything about scaling your freelance business, Upwork Top Rated strategies, pricing, or managing client expectations.`,
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuestions = [
    'How do I negotiate a $3,000 fixed price project on Upwork?',
    'What is the best way to handle taxes as a freelancer in Pakistan?',
    'Payoneer vs Wise: which is lower fee for PKR bank withdrawals?',
    'How do I maintain a 100% Upwork Job Success Score?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    const systemPrompt = `You are a world-class freelance growth mentor specializing in helping freelancers from Pakistan, India, and emerging markets scale to $10k+/month on Upwork, Fiverr, and direct contracts.
Give encouraging, practical, actionable, step-by-step advice.`;

    const res = await runAiPrompt(query, systemPrompt);

    const mentorReply: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'mentor',
      text:
        res.text ||
        'Great question! Focus on clear milestone definitions, over-communicating weekly progress, and securing at least a 30% upfront deposit on custom contracts.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, mentorReply]);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 p-6 bg-slate-900/80 border border-slate-800 rounded-3xl">
        <div className="p-3 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Freelance Strategy Mentor</h1>
          <p className="text-xs text-slate-400">
            24/7 Strategic advice on rate scaling, client negotiations, payment gateways, and tax compliance.
          </p>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col h-[580px]">
        {/* Sample questions chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {sampleQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition whitespace-nowrap shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'mentor' && (
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl p-3.5 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none font-sans'
                }`}
              >
                <p>{m.text}</p>
                <span className="text-[10px] opacity-60 block text-right mt-1">{m.time}</span>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 text-xs items-center text-slate-400">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" /> Mentor is formulating strategy advice...
              </span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-2 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI Mentor anything about freelancing..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-2xl transition shadow-lg shadow-amber-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
