import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AIOrchestrator, AIResponse } from '../../services/ai/aiOrchestrator';
import {
  MessageSquareCode,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  responseMetadata?: AIResponse;
}

export const CopilotChat: React.FC = () => {
  const { students, classes, alerts, budget, schoolHealth, payments, logAIOperation, currentUser } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `Bonjour **${currentUser.firstName} ${currentUser.lastName}**.\n\n` +
        `Je suis votre **Directeur IA / Copilote de Direction**. Je suis directement connecté aux données réelles de l'établissement.\n\n` +
        `Que souhaitez-vous savoir, analyser ou décider aujourd'hui ?`,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const samplePrompts = [
    'Quelle est la situation générale de l’établissement ?',
    'Quels sont les élèves prioritaires à risque de décrochage ?',
    'Fais-moi le point sur les impayés et la trésorerie.',
    'Quelles sont les classes en difficulté en sciences ?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const response = AIOrchestrator.processQuery(query, {
        students,
        classes,
        alerts,
        budget,
        health: schoolHealth,
        payments
      });

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        responseMetadata: response
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);

      logAIOperation('DirectorCopilot', query, response.dataPointsUsed, response.confidenceScore);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ASSISTANT CONVERSATIONNEL CONNECTÉ AUX DONNÉES</span>
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white">
          Directeur IA — « Demandez à vos données »
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl">
          Interrogez directement l'état de l'établissement en langage naturel. Chaque réponse distingue explicitement les faits observés des prévisions statistiques et s'appuie sur vos données sécurisées.
        </p>
      </div>

      {/* Suggested Chips */}
      <div className="flex flex-wrap gap-2">
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-xs bg-slate-900/80 hover:bg-brand-950/80 text-slate-300 hover:text-brand-300 border border-slate-800 hover:border-brand-700 px-3 py-1.5 rounded-full transition-all flex items-center space-x-1.5"
          >
            <span>💬</span>
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Conversation Box */}
      <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col h-[520px] overflow-hidden">
        {/* Messages scroll area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white'
                    : 'bg-gradient-to-tr from-brand-500 to-indigo-600 text-white shadow-lg shadow-brand-500/20'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* AI Metadata & Fact Check badge */}
                {msg.responseMetadata && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-2 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                        msg.responseMetadata.sourceType === 'FAIT_REEL'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-purple-950 text-purple-300 border border-purple-800'
                      }`}>
                        Source : {msg.responseMetadata.sourceType}
                      </span>
                      <span className="text-slate-400 font-semibold">
                        Confiance : {msg.responseMetadata.confidenceScore}%
                      </span>
                    </div>

                    {msg.responseMetadata.suggestedFollowUpActions.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Pistes d’exploration suggérées :
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {msg.responseMetadata.suggestedFollowUpActions.map((action, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => handleSend(action)}
                              className="text-[11px] bg-slate-950 hover:bg-slate-800 text-brand-300 px-2 py-1 rounded border border-slate-800 transition-colors flex items-center space-x-1"
                            >
                              <span>{action}</span>
                              <ArrowRight className="w-3 h-3 text-slate-500" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className={`text-[10px] ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-500'} text-right`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs text-brand-400 p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analyse des données scolaires et calcul des indicateurs...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center space-x-3">
          <input
            type="text"
            placeholder="Posez une question sur les notes, l’assiduité, les finances ou les classes..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim()}
            className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:hover:bg-brand-600 text-white transition-all shadow-lg shadow-brand-600/30"
            title="Envoyer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
