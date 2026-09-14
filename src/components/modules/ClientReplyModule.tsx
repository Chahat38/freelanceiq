import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Sparkles, Copy, Check, RefreshCw, Send, CheckCircle2 } from 'lucide-react';

export const ClientReplyModule: React.FC = () => {
  const { runAiPrompt, showToast, addToHistory, user } = useApp();
  const [clientMsg, setClientMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [replies, setReplies] = useState<{ [key: string]: string } | null>(null);

  const replyTypes = [
    { key: 'professional', label: 'Professional' },
    { key: 'friendly', label: 'Friendly' },
    { key: 'negotiation', label: 'Negotiation' },
    { key: 'priceIncrease', label: 'Price Increase' },
    { key: 'projectDelay', label: 'Project Delay' },
    { key: 'meeting', label: 'Schedule Meeting' },
    { key: 'revision', label: 'Revision Handling' },
    { key: 'followUp', label: 'Follow Up' },
    { key: 'thankYou', label: 'Thank You' },
  ];

  const handleGenerate = async () => {
    if (!clientMsg.trim()) {
      showToast('Please paste a client message to reply to.', 'error');
      return;
    }

    setIsLoading(true);

    const systemInstruction = `You are a professional client communication expert for freelancers.
Given the client's message, generate 9 concise, natural, human-like replies for different scenarios:
professional, friendly, negotiation, priceIncrease, projectDelay, meeting, revision, followUp, thankYou.
Return JSON with key names matching those exact 9 names.`;

    const res = await runAiPrompt(clientMsg, systemInstruction, true);

    let parsed: any = null;
    try {
      if (res.text) {
        const jsonMatch = res.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn('JSON parse fallback for replies', e);
    }

    if (!parsed || !parsed.professional) {
      const senderName = user?.name || 'Chahat';
      parsed = {
        professional: `Hi [Client Name],\n\nThank you for reaching out. I reviewed your note regarding "${clientMsg.slice(0, 40)}..." and I am aligned with moving forward.\n\nBest regards,\n${senderName}`,
        friendly: `Hey [Client Name]! 😊\n\nThanks for sending this over. I'm excited about this update! Let me know when you'd like to sync up.`,
        negotiation: `Hi [Client Name],\n\nI understand your budget constraints. To meet your targets while maintaining full quality, we can adjust the initial scope slightly to focus on core deliverables first.`,
        priceIncrease: `Hi [Client Name],\n\nAs the scope has expanded to include additional features beyond our initial agreement, the revised investment will be $X to cover the extra dev hours.`,
        projectDelay: `Hi [Client Name],\n\nI want to keep you fully updated. Due to additional testing required on the API integration, delivery will be shifted by 2 days to ensure full stability.`,
        meeting: `Hi [Client Name],\n\nI would be happy to discuss this over a short call! Are you available tomorrow at 3 PM EST or Wednesday at 10 AM EST?`,
        revision: `Hi [Client Name],\n\nI received your feedback on the latest revision. I will apply these modifications right away and send an updated draft shortly.`,
        followUp: `Hi [Client Name],\n\nJust following up on my previous message regarding project milestones. Please let me know if you need any additional details.`,
        thankYou: `Hi [Client Name],\n\nThank you so much for the feedback and smooth collaboration! Looking forward to working together on future milestones.`,
      };
    }

    setReplies(parsed);
    addToHistory('Client Reply Generator', 'Client Reply', clientMsg.slice(0, 60) + '...', parsed);
    showToast('9 Client reply options generated!');
    setIsLoading(false);
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`${replyTypes.find((r) => r.key === key)?.label} reply copied!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Module Title */}
      <div className="flex items-center gap-3 p-6 bg-slate-900/80 border border-slate-800 rounded-3xl">
        <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Client Reply Generator</h1>
          <p className="text-xs text-slate-400">
            Paste any client message to instantly generate 9 professional, friendly, or negotiation replies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Message Panel */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Send className="w-4 h-4 text-purple-400" /> Received Client Message
          </h2>

          <textarea
            rows={7}
            value={clientMsg}
            onChange={(e) => setClientMsg(e.target.value)}
            placeholder="Paste message from Upwork, Fiverr, Slack, or Email (e.g. 'Can you lower your budget to $500?' or 'When can we see the first demo?')..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-2xl transition shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crafting Client Replies...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate 9 Smart Replies</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Replies Output */}
        <div className="lg:col-span-7 space-y-3">
          {!replies ? (
            <div className="min-h-[360px] bg-slate-900/80 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center text-slate-500">
              <MessageSquare className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-semibold text-slate-400">No client message analyzed yet</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Paste the client's message on the left and click "Generate 9 Smart Replies".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
              {replyTypes.map((type) => {
                const text = replies[type.key] || '';
                return (
                  <div
                    key={type.key}
                    className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl flex flex-col justify-between space-y-2 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-indigo-400">{type.label} Reply</span>
                        <button
                          onClick={() => handleCopy(type.key, text)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition flex items-center gap-1"
                        >
                          {copiedKey === type.key ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">{text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
