import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Mic, MicOff, Sparkles, X, ArrowRight, Volume2 } from 'lucide-react';

export const VoiceAssistantModal: React.FC = () => {
  const { isVoiceAssistantOpen, setIsVoiceAssistantOpen, showToast } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('Listening to your voice prompt...');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isVoiceAssistantOpen) {
      setIsListening(false);
      setTranscript('');
      return;
    }

    // Try Web Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setStatus('Speak now... (e.g., "Generate proposal for React website")');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setStatus('Click mic to speak again or choose a quick voice preset below.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      try {
        recognition.start();
      } catch (err) {
        console.warn('SpeechRecognition start error:', err);
      }
    } else {
      setStatus('Speech Recognition API limited in iframe. Select or type command below.');
    }
  }, [isVoiceAssistantOpen]);

  if (!isVoiceAssistantOpen) return null;

  const quickPresets = [
    { label: 'Generate proposal for React website', path: '/app/proposal-generator' },
    { label: 'Check if this client message is a scam', path: '/app/scam-detector' },
    { label: 'Calculate price for mobile app in PKR', path: '/app/price-estimator' },
    { label: 'Create new client invoice for $1,200', path: '/app/invoice-generator' },
    { label: 'Ask AI Mentor how to get high paying clients', path: '/app/ai-mentor' },
  ];

  const handleExecuteVoiceCommand = (cmdText: string, customPath?: string) => {
    showToast(`Executing voice command: "${cmdText}"`);
    setIsVoiceAssistantOpen(false);

    const lower = cmdText.toLowerCase();
    let path = customPath || '/app/proposal-generator';

    if (lower.includes('proposal')) path = '/app/proposal-generator';
    else if (lower.includes('scam') || lower.includes('fake')) path = '/app/scam-detector';
    else if (lower.includes('price') || lower.includes('cost') || lower.includes('rate')) path = '/app/price-estimator';
    else if (lower.includes('invoice') || lower.includes('bill')) path = '/app/invoice-generator';
    else if (lower.includes('mentor') || lower.includes('advice') || lower.includes('clients')) path = '/app/ai-mentor';
    else if (lower.includes('contract') || lower.includes('risk')) path = '/app/contract-analyzer';
    else if (lower.includes('task') || lower.includes('todo')) path = '/app/task-manager';

    navigate(path, { state: { voicePrompt: cmdText } });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">FreelanceIQ Voice Assistant</h3>
              <p className="text-xs text-slate-400">AI Speech-to-Text Command Bridge</p>
            </div>
          </div>
          <button
            onClick={() => setIsVoiceAssistantOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orb & Wave animation */}
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <div
            onClick={() => setIsListening(!isListening)}
            className={`cursor-pointer w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 relative ${
              isListening
                ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/50 scale-110 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {isListening ? (
              <Mic className="w-10 h-10 text-white" />
            ) : (
              <MicOff className="w-10 h-10 text-slate-400" />
            )}
            {isListening && (
              <span className="absolute -inset-2 rounded-full border border-indigo-500/40 animate-ping" />
            )}
          </div>

          <p className="mt-4 text-xs font-medium text-indigo-400">{status}</p>

          <div className="mt-4 min-h-12 w-full px-4 py-3 bg-slate-950/60 rounded-xl border border-slate-800 text-sm text-slate-200">
            {transcript ? (
              <span className="italic text-slate-100">"{transcript}"</span>
            ) : (
              <span className="text-slate-500">Your spoken voice command will appear here...</span>
            )}
          </div>

          {transcript && (
            <button
              onClick={() => handleExecuteVoiceCommand(transcript)}
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 transition"
            >
              <span>Execute Command</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Voice Presets */}
        <div className="border-t border-slate-800 pt-4">
          <p className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Quick Voice Sample Prompts
          </p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {quickPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleExecuteVoiceCommand(preset.label, preset.path)}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition flex items-center justify-between group"
              >
                <span>"{preset.label}"</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
