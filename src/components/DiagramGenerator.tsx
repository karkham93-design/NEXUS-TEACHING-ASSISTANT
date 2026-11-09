import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Loader2, Download, Zap, BookOpen } from 'lucide-react';

interface DiagramGeneratorProps {
  currentConceptTitle?: string;
}

export const DiagramGenerator: React.FC<DiagramGeneratorProps> = ({ currentConceptTitle }) => {
  const [prompt, setPrompt] = useState<string>(
    currentConceptTitle
      ? `Detailed UNEB textbook diagram illustrating: ${currentConceptTitle}`
      : 'Human heart four chambers and double circulation pathway with labeled vena cava, aorta, and valves'
  );
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [engineMode, setEngineMode] = useState<'vector' | 'ai'>('vector');
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isVector, setIsVector] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const quickPrompts = [
    'Human Heart 4 chambers & double circulation',
    'Electric Circuit with Ohm\'s Law, Ammeter & Voltmeter',
    'Atomic Structure Bohr Model of Carbon (2:4)',
    'Leaf Transverse Section & Photosynthesis Equation',
    'East Africa Rift Valley & Horst Block Mountains',
    'Glass Prism light refraction & Snell\'s law',
    'Plant Cell vs Animal Cell labeled organelles',
    'Mendelian monohybrid cross Punnett square',
    'Circle Theorem angle at center is twice circumference',
    'Quadratic Parabola graph y = ax^2 + bx + c',
  ];

  const handleGenerate = async (overrideSvg?: boolean) => {
    if (!prompt.trim()) return;
    try {
      setLoading(true);
      setError(null);

      const forceSvg = overrideSvg !== undefined ? overrideSvg : engineMode === 'vector';

      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          imageSize,
          aspectRatio,
          forceSvg,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate visual diagram.');
      }

      setGeneratedImage(data.imageUrl);
      setDescription(data.description || '');
      setIsVector(Boolean(data.isVectorBlueprint));
    } catch (err: any) {
      console.error('Diagram gen error:', err);
      // Fallback to vector immediately
      try {
        const fallbackRes = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            imageSize,
            aspectRatio,
            forceSvg: true,
          }),
        });
        const fallbackData = await fallbackRes.json();
        setGeneratedImage(fallbackData.imageUrl);
        setDescription(fallbackData.description || '');
        setIsVector(true);
      } catch {
        setError(err.message || 'Image generation failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Visual Blueprint &amp; Textbook Diagram Studio</h3>
            <p className="text-[11px] text-slate-400">Generate diagrams for any UNEB subject, topic, or calculation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded font-mono font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>Ultra-Fast Engine</span>
          </span>
          <span className="text-[11px] bg-red-950 text-red-300 border border-red-700/50 px-2 py-0.5 rounded font-mono">
            PLE &amp; UCE/UACE
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Engine mode selector */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400 text-[11px] font-medium px-2">Engine Mode:</span>
          <button
            onClick={() => setEngineMode('vector')}
            className={`flex-1 py-1 px-3 rounded-md font-semibold transition-all flex items-center justify-center gap-1.5 ${
              engineMode === 'vector'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Instant Vector Blueprint (&lt;100ms)</span>
          </button>
          <button
            onClick={() => setEngineMode('ai')}
            className={`flex-1 py-1 px-3 rounded-md font-semibold transition-all flex items-center justify-center gap-1.5 ${
              engineMode === 'ai'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini Neural Synthesis</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Prompt / Any Curriculum Diagram Concept:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={2}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            placeholder="Type any concept: electric circuit, carbon atom, mitosis, water cycle, Pythagoras, trigonometry, river profile..."
          />
        </div>

        {/* Quick presets */}
        <div>
          <div className="text-[11px] text-slate-400 font-medium mb-1.5 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-red-400" />
            <span>Popular UNEB Syllabus Diagrams:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(qp)}
                className="text-[11px] px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-700/60 transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Resolution Affordance (1K, 2K, 4K) & Aspect Ratio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Resolution Specification (Affordance):
            </label>
            <div className="flex gap-2">
              {(['1K', '2K', '4K'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setImageSize(size)}
                  className={`flex-1 py-1.5 px-3 rounded text-xs font-bold font-mono transition-all ${
                    imageSize === size
                      ? 'bg-red-600 text-white ring-2 ring-red-400/50'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Aspect Ratio:
            </label>
            <div className="flex gap-2">
              {['16:9', '4:3', '1:1'].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`flex-1 py-1.5 px-3 rounded text-xs font-medium font-mono transition-all ${
                    aspectRatio === ratio
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => handleGenerate()}
          disabled={loading || !prompt.trim()}
          className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all active:scale-[0.99]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating High-Resolution Diagram ({imageSize})...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Educational Diagram ({imageSize})</span>
            </>
          )}
        </button>

        {error && (
          <div className="text-xs text-rose-300 bg-rose-950/40 border border-rose-800/40 rounded p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span>{error}</span>
            <button
              onClick={() => handleGenerate(true)}
              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[11px] font-semibold flex items-center gap-1 shrink-0"
            >
              <Zap className="w-3 h-3" />
              <span>Load Instant Vector Blueprint</span>
            </button>
          </div>
        )}

        {/* Display Generated Image */}
        {generatedImage && (
          <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isVector ? 'UNEB High-Resolution Vector Blueprint' : 'AI Rendered Blueprint'}</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  {imageSize} • {aspectRatio} • {isVector ? 'Scalable SVG' : 'AI Render'}
                </span>
              </span>
              <a
                href={generatedImage}
                download={`nexus-uneb-diagram-${imageSize.toLowerCase()}.${isVector ? 'svg' : 'png'}`}
                className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-200 flex items-center gap-1.5 font-medium border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save High-Res Diagram</span>
              </a>
            </div>
            <div className="rounded-lg border border-slate-800 overflow-hidden bg-black/80 flex items-center justify-center p-1">
              <img
                src={generatedImage}
                alt="Generated UNEB educational diagram"
                className="w-full rounded-lg object-contain max-h-[460px]"
              />
            </div>
            {description && (
              <p className="mt-3 text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <strong className="text-red-400">Examiner Context: </strong>
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
