import React, { useState, useRef, useEffect } from 'react';
import {
  User as UserIcon,
  Sparkles,
  Loader2,
  Volume2,
  Brain,
  RotateCcw,
  Square,
  Zap,
} from 'lucide-react';
import { AudioTutor } from './AudioTutor';
import PromptBar, { BRANCHED_MENU_SECTIONS } from './PromptBar';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  modelUsed?: string;
  highThinking?: boolean;
}

interface ChatBotProps {
  currentConceptContext?: string;
  isGuest?: boolean;
  onNavigateSection?: (sectionId: string) => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ currentConceptContext, onNavigateSection }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: "Greetings, candidate! I am NEXUS, your interactive AI Teaching Assistant dedicated to the Uganda National Examinations Board (UNEB - https://uneb.ac.ug/) curriculum for Primary Level (PLE) and Secondary Level (UCE & UACE). I am equipped to answer anything across all subjects: Mathematics, Physics, Chemistry, Biology, Geography, English, History, ICT, or General Science. Use the branched menu (+) to select syllabus topics, switch examiner roles, or generate textbook diagrams. Feel free to type or dictate using the Voice Pill!",
      modelUsed: 'gemini-flash-lite-latest',
    },
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [modelChoice, setModelChoice] = useState<'gemini-flash-lite-latest' | 'gemini-3.1-flash-lite' | 'gemini-3.8-flash' | 'gemini-4-argon'>('gemini-flash-lite-latest');
  const [highThinking, setHighThinking] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<'general' | 'ple_specialist' | 'uce_specialist' | 'regulations'>('general');
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const quickQuestions = [
    'How do I score Division 1 in PLE Integrated Science?',
    'Solve: 2x² - 4x - 6 = 0 step-by-step',
    'Explain Snell\'s law & total internal reflection',
    'What does the UNEB Act 2021 say about malpractice?',
    'What are the 4 chambers of the heart and their functions?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleToggleHighThinking = (enabled: boolean) => {
    setHighThinking(enabled);
    if (enabled) {
      setModelChoice('gemini-3.8-flash');
    } else {
      setModelChoice('gemini-flash-lite-latest');
    }
  };

  const handleSendMessage = async (textToSend: string, meta?: any) => {
    const userText = textToSend;
    if (!userText.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      text: userText.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 14000);

    try {
      const conversationPayload = [...messages, userMessage].map((m) => ({
        role: m.role,
        text: m.text,
      }));

      if (currentConceptContext && conversationPayload.length <= 2) {
        conversationPayload[0].text += ` [Context: The student is reviewing: ${currentConceptContext}]`;
      }

      const activeModel = meta?.model?.key || modelChoice;
      const isHighThinking = meta?.effort === 'Max' || meta?.effort === 'Extra' || highThinking;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: conversationPayload,
          modelName: activeModel,
          highThinking: isHighThinking,
          role: activeRole,
        }),
      });

      clearTimeout(timeoutId);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate response.');
      }

      const modelMessage: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'model',
        text: data.text || 'I could not generate an answer.',
        modelUsed: data.modelUsed || activeModel,
        highThinking: isHighThinking,
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('Chat interaction notice:', err?.message || err);
      const isAbort = err.name === 'AbortError';
      const fallbackText = isAbort
        ? '⚠️ Cloud response took longer than 14s. Switched to fast curriculum mode — please resend your message!'
        : `⚠️ System Note: ${err.message || 'Connection interrupted. Please try again.'}`;

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 2),
          role: 'model',
          text: fallbackText,
          modelUsed: 'NEXUS Knowledge Base',
        },
      ]);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  };

  const handleTTSPlay = async (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingMsgId(null);
      return;
    }

    try {
      setSpeakingMsgId(msgId);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceName: 'Puck',
          style: 'Insightful, encouraging, articulate UNEB senior examiner explaining a key syllabus concept',
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (data?.audioDataUrl) {
        if (!audioPlayerRef.current) {
          audioPlayerRef.current = new Audio();
        }
        audioPlayerRef.current.src = data.audioDataUrl;
        audioPlayerRef.current.onended = () => setSpeakingMsgId(null);
        audioPlayerRef.current.onerror = () => setSpeakingMsgId(null);
        await audioPlayerRef.current.play();
        return;
      }

      // Seamless browser speech synthesis fallback
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const speechText = (data?.spokenText || text).replace(/[*#_`>]/g, ' ').slice(0, 320);
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.rate = 1.0;
        utterance.onend = () => setSpeakingMsgId(null);
        utterance.onerror = () => setSpeakingMsgId(null);
        window.speechSynthesis.speak(utterance);
        return;
      }

      setSpeakingMsgId(null);
    } catch (e) {
      console.warn('TTS message play notice, using client speech synthesis:', e);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const speechText = text.replace(/[*#_`>]/g, ' ').slice(0, 320);
          const utterance = new SpeechSynthesisUtterance(speechText);
          utterance.rate = 1.0;
          utterance.onend = () => setSpeakingMsgId(null);
          utterance.onerror = () => setSpeakingMsgId(null);
          window.speechSynthesis.speak(utterance);
          return;
        } catch {
          // ignore
        }
      }
      setSpeakingMsgId(null);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'init-reset',
        role: 'model',
        text: 'Conversation history reset. What UNEB topic, concept, or question can I help you master next?',
        modelUsed: modelChoice,
      },
    ]);
  };

  const handleSelectBranchAction = (action: string) => {
    if (action === 'role_general') setActiveRole('general');
    else if (action === 'role_ple') setActiveRole('ple_specialist');
    else if (action === 'role_uce') setActiveRole('uce_specialist');
    else if (action === 'role_regulations') setActiveRole('regulations');
    else if (action === 'nav_workspace' && onNavigateSection) onNavigateSection('workspace');
    else if ((action.startsWith('diag_') || action === 'nav_diagrams') && onNavigateSection) onNavigateSection('diagrams');
    else if (action === 'nav_news' && onNavigateSection) onNavigateSection('pulse');
    else if (action === 'nav_syllabi' && onNavigateSection) onNavigateSection('lessons');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[700px] shadow-2xl overflow-hidden text-slate-200">
      {/* Header with Brand Logo, Model Selector & High Thinking Toggle */}
      <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/aistudio/image_2c59f5bc.png"
            alt="NEXUS Teaching Assistant"
            className="w-9 h-9 object-contain drop-shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-xs">NEXUS Examiner Chat</h3>
              <span className="text-[10px] bg-red-950 text-red-300 border border-red-600/50 px-1.5 py-0.2 rounded font-mono font-semibold">
                UNEB Syllabus
              </span>
              {highThinking && (
                <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-500/50 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold animate-pulse">
                  <Brain className="w-3 h-3 text-purple-400" />
                  HIGH THINKING ON
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive PLE &amp; UCE Examiner • Answers Any Question
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* High Thinking Mode Toggle */}
          <button
            onClick={() => handleToggleHighThinking(!highThinking)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
              highThinking
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
            title="Enable High Thinking level with gemini-3.8-flash for deep syllabus derivations"
          >
            <Brain className="w-3.5 h-3.5 text-purple-300" />
            <span>High Thinking</span>
          </button>

          {/* Model Switcher */}
          <select
            value={modelChoice}
            onChange={(e) => {
              const val = e.target.value as any;
              setModelChoice(val);
              if (val !== 'gemini-3.8-flash' && val !== 'gemini-4-argon') {
                setHighThinking(false);
              }
            }}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-md px-2 py-1 focus:outline-none focus:border-red-500 font-mono"
          >
            <option value="gemini-flash-lite-latest">⚡ Fast Mode (Sub-second)</option>
            <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Standard)</option>
            <option value="gemini-3.8-flash">gemini-3.8-flash (High Reasoning &amp; Thinking)</option>
            <option value="gemini-4-argon">gemini-4-argon (Complex - Paid Key)</option>
          </select>

          {/* Role selector */}
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-md px-2 py-1 focus:outline-none focus:border-red-500"
          >
            <option value="general">Role: Senior UNEB Examiner</option>
            <option value="ple_specialist">Role: PLE P.7 Chief Marker</option>
            <option value="uce_specialist">Role: UCE S.4 Senior Marker</option>
            <option value="regulations">Role: UNEB Act 2021 Officer</option>
          </select>

          <button
            onClick={clearChat}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-md"
            title="Reset Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Thread (Scrollable) */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <img
                  src="/assets/aistudio/image_2c59f5bc.png"
                  alt="NEXUS"
                  className="w-7 h-7 object-contain flex-shrink-0 mt-0.5"
                />
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-red-600 text-white rounded-tr-none shadow-md shadow-red-600/20'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between mb-1.5 border-b border-slate-800/80 pb-1">
                    <span className="text-[10px] text-red-400 font-mono font-semibold flex items-center gap-1">
                      {m.highThinking ? (
                        <Brain className="w-3 h-3 text-purple-400" />
                      ) : (
                        <Zap className="w-3 h-3 text-red-400" />
                      )}
                      <span>{m.modelUsed || 'NEXUS Examiner'}</span>
                    </span>
                    <button
                      onClick={() => handleTTSPlay(m.id, m.text)}
                      className={`text-[11px] px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                        speakingMsgId === m.id
                          ? 'bg-rose-950 text-rose-300'
                          : 'text-slate-400 hover:text-red-300 hover:bg-slate-800'
                      }`}
                      title="Speak answer using Gemini TTS"
                    >
                      {speakingMsgId === m.id ? (
                        <>
                          <Square className="w-3 h-3" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="whitespace-pre-wrap font-sans">{m.text}</div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex-shrink-0 flex items-center justify-center font-bold text-xs mt-0.5">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 justify-start">
            <img
              src="/assets/aistudio/image_2c59f5bc.png"
              alt="NEXUS"
              className="w-7 h-7 object-contain flex-shrink-0 animate-pulse"
            />
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
              <span>
                {highThinking
                  ? 'Executing High Thinking (Deep UNEB Syllabus Analysis & Proof Synthesis via Gemini Reasoning Engine)...'
                  : 'NEXUS Examiner is formulating your revision response...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="px-3 py-1.5 bg-slate-950/70 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-500 shrink-0 font-medium">Suggestions:</span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="whitespace-nowrap px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-800 transition-colors shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Prompt Bar with Branched Menu from image options and Voice Pill */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <PromptBar
          placeholder="Ask anything across UNEB syllabus, type @ or click (+) for branched options..."
          branches={BRANCHED_MENU_SECTIONS}
          defaultModel={modelChoice}
          busy={loading}
          onSend={(text, meta) => handleSendMessage(text, meta)}
          onStop={handleStopGeneration}
          onModelChange={(m) => setModelChoice(m as any)}
          onSelectAction={handleSelectBranchAction}
          onVoiceTranscribe={(text) => handleSendMessage(text)}
          onEffortChange={(effort) => {
            if (effort === 'Max' || effort === 'Extra') {
              setHighThinking(true);
              setModelChoice('gemini-4-argon');
            } else {
              setHighThinking(false);
              setModelChoice('gemini-flash-lite-latest');
            }
          }}
        />
      </div>
    </div>
  );
};
