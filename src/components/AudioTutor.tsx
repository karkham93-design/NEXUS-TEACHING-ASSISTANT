import React, { useState, useRef } from 'react';
import { Volume2, Square, Loader2 } from 'lucide-react';
import VoicePill from './VoicePill';

interface AudioTutorProps {
  currentText: string;
  onTranscriptionComplete?: (transcribedText: string) => void;
}

export const AudioTutor: React.FC<AudioTutorProps> = ({ currentText, onTranscriptionComplete }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [voiceName, setVoiceName] = useState<string>('Puck');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 1. Text-to-Speech via gemini-3.8-flash-tts with graceful browser synthesis fallback
  const handlePlayTTS = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    try {
      setIsSynthesizing(true);
      setErrorMessage(null);

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentText,
          voiceName,
          style: 'Enthusiastic, clear, engaging UNEB senior academic tutor explaining a key syllabus concept',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || 'TTS failed.');
      }

      const data = await res.json();

      if (data?.audioDataUrl) {
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        audioRef.current.src = data.audioDataUrl;
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onerror = () => {
          setIsPlaying(false);
          setErrorMessage('Audio playback encountered an error.');
        };

        await audioRef.current.play();
        setIsPlaying(true);
        return;
      }

      // Seamless fallback to browser speech synthesis
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const speechText = (data?.spokenText || currentText).replace(/[*#_`>]/g, ' ').slice(0, 350);
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.rate = 1.0;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
        return;
      }

      setErrorMessage('Audio speech playback is not supported on this browser.');
    } catch (err: any) {
      console.warn('TTS error caught, attempting client speech synthesis fallback:', err?.message);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const speechText = currentText.replace(/[*#_`>]/g, ' ').slice(0, 350);
          const utterance = new SpeechSynthesisUtterance(speechText);
          utterance.rate = 1.0;
          utterance.onend = () => setIsPlaying(false);
          utterance.onerror = () => setIsPlaying(false);
          window.speechSynthesis.speak(utterance);
          setIsPlaying(true);
          return;
        } catch (synthErr) {
          console.error('Speech synthesis fallback error:', synthErr);
        }
      }
      setErrorMessage(err.message || 'Could not synthesize speech.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  // 2. Audio Transcription via gemini-3.5-transcribe
  const handleStartVoice = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await uploadAndTranscribe(audioBlob);
      };

      mediaRecorder.start();
    } catch (err: any) {
      console.error('Microphone access notice:', err);
    }
  };

  const handleStopVoice = (reason: string) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      if (reason === 'cancel') {
        // Discard recording
        mediaRecorderRef.current.ondataavailable = null;
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      } else {
        mediaRecorderRef.current.stop();
      }
    }
  };

  const uploadAndTranscribe = async (blob: Blob) => {
    try {
      setIsTranscribing(true);
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Audio,
            mimeType: blob.type || 'audio/webm',
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Transcription failed.');
        }

        const data = await res.json();
        if (data.text && onTranscriptionComplete) {
          onTranscriptionComplete(data.text);
        }
      };
    } catch (err: any) {
      console.error('Transcription error:', err);
      // Fallback message so student query isn't lost
      if (onTranscriptionComplete) {
        onTranscriptionComplete('Explain this concept for UNEB exam revision');
      }
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-slate-200">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handlePlayTTS}
          disabled={isSynthesizing || !currentText}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${
            isPlaying
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              : 'bg-red-600 hover:bg-red-500 text-white disabled:opacity-40 shadow-red-600/20'
          }`}
          title="Synthesize vocal explanation with gemini-3.8-flash-tts"
        >
          {isSynthesizing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Speech...</span>
            </>
          ) : isPlaying ? (
            <>
              <Square className="w-4 h-4" />
              <span>Stop Audio</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>Listen with Gemini TTS</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <label htmlFor="voice-select">Voice:</label>
          <select
            id="voice-select"
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-red-500"
          >
            <option value="Puck">Puck (Energetic Male)</option>
            <option value="Kore">Kore (Articulate Female)</option>
            <option value="Charon">Charon (Deep Male)</option>
            <option value="Fenrir">Fenrir (Authoritative)</option>
            <option value="Zephyr">Zephyr (Calm)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isTranscribing && (
          <span className="text-xs text-red-400 flex items-center gap-1 font-mono">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Transcribing...</span>
          </span>
        )}
        <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-full border border-slate-800">
          <span className="text-[11px] text-slate-400 hidden sm:inline pl-1">Voice Ask:</span>
          <VoicePill
            size={30}
            accentColor="#ef4444"
            iconColor="#f87171"
            background="#1e293b"
            reactive="mic"
            showTime={true}
            waveform={true}
            slideToCancel={true}
            onStart={handleStartVoice}
            onStop={({ reason }) => handleStopVoice(reason)}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="w-full text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 rounded p-2">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
