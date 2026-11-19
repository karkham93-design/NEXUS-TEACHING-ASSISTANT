import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Loader2,
  Download,
  Zap,
  BookOpen,
  Globe,
  Maximize2,
  X,
  ExternalLink,
  Layers,
  MessageSquare,
} from 'lucide-react';

interface StudyPhoto {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  thumbnailUrl: string;
  sourceUrl: string;
  sourceName: string;
  width: number;
  height: number;
  resolutionTag: '1K' | '2K' | '4K' | 'HD';
  subjectCategory: string;
  license?: string;
  isDiagramOrPhoto: 'photo' | 'diagram';
}

interface ActiveMedia {
  url: string;
  fallbackUrl?: string;
  title: string;
  description: string;
  resolution: string;
  dimensions?: string;
  isVector: boolean;
  isInternet: boolean;
  sourceName?: string;
  sourceUrl?: string;
}

interface DiagramGeneratorProps {
  currentConceptTitle?: string;
  onOpenInChat?: (concept: string) => void;
}

function getExportPixelDimensions(
  imageSize: '1K' | '2K' | '4K',
  aspectRatio: string
): { width: number; height: number } {
  const longEdge = imageSize === '4K' ? 3840 : imageSize === '2K' ? 2048 : 1280;
  if (aspectRatio === '4:3') {
    const width = imageSize === '1K' ? 1024 : longEdge;
    return { width, height: Math.round((width * 3) / 4) };
  }
  if (aspectRatio === '1:1') {
    const size = imageSize === '1K' ? 1024 : longEdge;
    return { width: size, height: size };
  }
  const width = imageSize === '2K' ? 2560 : longEdge;
  return { width, height: Math.round((width * 9) / 16) };
}

export const DiagramGenerator: React.FC<DiagramGeneratorProps> = ({
  currentConceptTitle,
  onOpenInChat,
}) => {
  const initialPrompt = currentConceptTitle
    ? `Photo of ${currentConceptTitle.replace(/^[A-Za-z0-9\s()•-]+:\s*/, '')}`
    : 'Photo of human heart four chambers';

  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [lastSearchedQuery, setLastSearchedQuery] = useState<string>(initialPrompt);
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('2K');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [engineMode, setEngineMode] = useState<'internet' | 'ai' | 'vector'>('internet');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [activeImage, setActiveImage] = useState<ActiveMedia | null>(null);
  const [internetPhotos, setInternetPhotos] = useState<StudyPhoto[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [fullscreenPhoto, setFullscreenPhoto] = useState<{
    title: string;
    imageUrl: string;
    fallbackUrl?: string;
    caption: string;
    resolutionTag: string;
    sourceName: string;
    sourceUrl?: string;
    isVector?: boolean;
  } | null>(null);

  const quickStudyPrompts = [
    { label: 'Photo: Human Heart (4 Chambers)', cat: 'Biology', prompt: 'Photo of human heart four chambers and blood vessels' },
    { label: 'Photo: Plant Cell & Chloroplasts', cat: 'Biology', prompt: 'Microscope photo of plant leaf cells with chloroplasts' },
    { label: 'Photo: East Africa Rift Valley', cat: 'Geography', prompt: 'Photo of East African Rift Valley escarpment' },
    { label: 'Photo: Mount Rwenzori Glaciers', cat: 'Geography', prompt: 'Photo of Mount Rwenzori glaciers' },
    { label: 'Photo: Lab Titration & Burette', cat: 'Chemistry', prompt: 'Laboratory photo of acid-base titration burette conical flask' },
    { label: 'Photo: Bunsen Burner Blue Flame', cat: 'Chemistry', prompt: 'Laboratory photo of Bunsen burner blue flame' },
    { label: 'Photo: Red & White Blood Cells', cat: 'Biology', prompt: 'Scanning electron microscope photo of red blood cells' },
    { label: 'Diagram: Glass Prism & Snell\'s Law', cat: 'Physics', prompt: 'Diagram of glass prism light refraction and Snell\'s law' },
    { label: 'Diagram: Electric Circuit Ohm\'s Law', cat: 'Physics', prompt: 'Diagram of electric circuit with ammeter, voltmeter, and resistor' },
    { label: 'Diagram: Quadratic Parabola Graph', cat: 'Mathematics', prompt: 'Diagram of quadratic parabola graph y = ax^2 + bx + c' },
    { label: 'Photo: Solar Eclipse', cat: 'Physics', prompt: 'Photo of total solar eclipse corona' },
    { label: 'Diagram: Circle Theorems & Angles', cat: 'Mathematics', prompt: 'Geometry diagram circle theorem angle at center is twice circumference' },
  ];

  const categories = ['All', 'Biology', 'Geography', 'Chemistry', 'Physics', 'Mathematics'];

  useEffect(() => {
    handleSearchOrGenerate(initialPrompt, 'internet', '2K', '16:9');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateViaApi = async (
    queryToUse: string,
    forceSvg: boolean,
    sizeToUse: '1K' | '2K' | '4K',
    ratioToUse: string,
    signal?: AbortSignal
  ) => {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({
        prompt: queryToUse,
        imageSize: sizeToUse,
        aspectRatio: ratioToUse,
        forceSvg,
        engineMode: forceSvg ? 'vector' : 'ai',
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Generation failed.');
    }

    if (signal?.aborted) return;

    setActiveImage({
      url: data.imageUrl,
      fallbackUrl: data.thumbnailUrl,
      title: data.title || queryToUse,
      description: data.description || '',
      resolution: data.imageSize || sizeToUse,
      dimensions: data.dimensions,
      isVector: Boolean(data.isVectorBlueprint),
      isInternet: Boolean(data.isInternetPhoto),
      sourceName: data.sourceName,
      sourceUrl: data.sourceUrl,
    });

    if (data.relatedPhotos && Array.isArray(data.relatedPhotos)) {
      setInternetPhotos(data.relatedPhotos);
    } else {
      setInternetPhotos([]);
    }
  };

  const handleSearchOrGenerate = async (
    queryText: string,
    modeOverride?: 'internet' | 'ai' | 'vector',
    sizeOverride?: '1K' | '2K' | '4K',
    ratioOverride?: string
  ) => {
    const activeMode = modeOverride ?? engineMode;
    const activeSize = sizeOverride ?? imageSize;
    const activeRatio = ratioOverride ?? aspectRatio;
    const targetQuery = queryText.trim();
    if (!targetQuery) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLastSearchedQuery(targetQuery);

    try {
      setLoading(true);
      setError(null);

      if (activeMode === 'internet') {
        const res = await fetch('/api/search-study-photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            query: targetQuery,
            imageSize: activeSize,
            limit: 8,
            preferPhotos: true,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch photos from the internet.');
        }

        if (controller.signal.aborted) return;

        if (data.photos && data.photos.length > 0) {
          setInternetPhotos(data.photos);
          const top = data.photos[0];
          setActiveImage({
            url: top.imageUrl,
            fallbackUrl: top.thumbnailUrl,
            title: top.title,
            description: top.caption,
            resolution: top.resolutionTag || activeSize,
            dimensions: `${top.width} × ${top.height}`,
            isVector: false,
            isInternet: true,
            sourceName: top.sourceName,
            sourceUrl: top.sourceUrl,
          });
        } else {
          // If no external photo matches, synthesize a topic-specific visual for what the student asked for
          await handleGenerateViaApi(targetQuery, false, activeSize, activeRatio, controller.signal);
        }
      } else if (activeMode === 'vector') {
        await handleGenerateViaApi(targetQuery, true, activeSize, activeRatio, controller.signal);
      } else {
        await handleGenerateViaApi(targetQuery, false, activeSize, activeRatio, controller.signal);
      }
    } catch (err: any) {
      if (err?.name === 'AbortError' || controller.signal.aborted) {
        return;
      }
      console.error('Photo/Diagram load error:', err);
      try {
        await handleGenerateViaApi(targetQuery, true, activeSize, activeRatio, controller.signal);
      } catch (fallbackErr: any) {
        if (fallbackErr?.name !== 'AbortError') {
          setError(err.message || 'Could not load media. Please try another query.');
        }
      }
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  };

  const handleDownloadMedia = async (
    url: string,
    title: string,
    resTag: string,
    isSvg: boolean
  ) => {
    try {
      setDownloading(true);
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 48) || 'study-visual';

      if (isSvg || url.startsWith('data:image/svg+xml')) {
        // Export SVG at target 1K/2K/4K resolution as crisp PNG (or fallback to SVG)
        const { width, height } = getExportPixelDimensions(imageSize, aspectRatio);
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('SVG canvas load failed'));
            img.src = url;
          });
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas unavailable');
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          const pngBlob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob((blob) => resolve(blob), 'image/png')
          );
          if (pngBlob) {
            const blobUrl = URL.createObjectURL(pngBlob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `${slug}-${resTag.toLowerCase()}.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(blobUrl);
            return;
          }
        } catch {
          // Direct SVG download fallback
          const a = document.createElement('a');
          a.href = url;
          a.download = `${slug}-${resTag.toLowerCase()}.svg`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          return;
        }
      }

      let downloadTargetUrl = url;
      if (url.startsWith('/api/proxy-image?')) {
        try {
          const parsedParams = new URLSearchParams(url.split('?')[1] || '');
          const innerUrl = parsedParams.get('url');
          if (innerUrl) downloadTargetUrl = innerUrl;
        } catch {
          // ignore
        }
      }

      if (downloadTargetUrl.startsWith('https://')) {
        const extMatch = downloadTargetUrl.match(/\.(png|jpg|jpeg|webp)(?:[?#]|$)/i);
        const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
        const filename = `${slug}-${resTag.toLowerCase()}.${ext}`;
        const proxyUrl = `/api/proxy-download?url=${encodeURIComponent(downloadTargetUrl)}&filename=${encodeURIComponent(filename)}`;
        const a = document.createElement('a');
        a.href = proxyUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleImageLoadError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const imgEl = e.currentTarget;
    if (imgEl.dataset.fallbackStage !== 'proxy' && imgEl.src.startsWith('https://')) {
      imgEl.dataset.fallbackStage = 'proxy';
      imgEl.src = `/api/proxy-image?url=${encodeURIComponent(imgEl.src)}`;
      return;
    }
    if (imgEl.dataset.fallbackStage === 'done') return;
    imgEl.dataset.fallbackStage = 'done';
    if (activeImage?.fallbackUrl && imgEl.src !== activeImage.fallbackUrl) {
      imgEl.src = activeImage.fallbackUrl;
    }
  };

  const filteredPrompts = activeCategory === 'All'
    ? quickStudyPrompts
    : quickStudyPrompts.filter((p) => p.cat === activeCategory);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 text-slate-200 shadow-2xl space-y-6">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600/30 to-cyan-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-inner">
            <ImageIcon className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-white text-base sm:text-lg tracking-tight">
                1K / 2K / 4K Study Photos &amp; Textbook Diagrams Studio
              </h3>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-600/50 px-2 py-0.5 rounded-full font-mono font-bold uppercase">
                Internet Media Live
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ask for any photo of anything relating to studies • Fetches authentic internet photos &amp; generates 1K/2K/4K diagrams
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] bg-red-950 text-red-300 border border-red-700/50 px-2.5 py-1 rounded-lg font-mono font-semibold flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{imageSize} Spec</span>
          </span>
          <span className="text-[11px] bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-lg font-mono">
            PLE &amp; UCE/UACE
          </span>
        </div>
      </div>

      {/* Engine Mode Tabs: Internet Photos vs AI Generator vs Vector Blueprint */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => {
            setEngineMode('internet');
            handleSearchOrGenerate(prompt, 'internet', imageSize, aspectRatio);
          }}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            engineMode === 'internet'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30 ring-1 ring-cyan-400/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Photos from Internet</span>
          <span className="text-[10px] bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-400/40">Real World</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setEngineMode('ai');
            handleSearchOrGenerate(prompt, 'ai', imageSize, aspectRatio);
          }}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            engineMode === 'ai'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30 ring-1 ring-red-400/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI 1K/2K/4K Studio</span>
          <span className="text-[10px] bg-red-950/80 px-1.5 py-0.2 rounded border border-red-400/40">Custom</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setEngineMode('vector');
            handleSearchOrGenerate(prompt, 'vector', imageSize, aspectRatio);
          }}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            engineMode === 'vector'
              ? 'bg-slate-800 text-white shadow-md border border-slate-700 ring-1 ring-slate-500'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>UNEB Vector Blueprint</span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded font-mono">&lt;50ms</span>
        </button>
      </div>

      {/* Primary Input & Search Bar */}
      <div className="space-y-2">
        <label htmlFor="study-photo-prompt-input" className="block text-xs font-bold text-slate-300">
          Ask for Any Photo or Diagram of Anything Relating to Studies:
        </label>
        <div className="relative">
          <input
            id="study-photo-prompt-input"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchOrGenerate(prompt, engineMode, imageSize, aspectRatio);
            }}
            placeholder="Type any study topic: e.g. Photo of human heart, Mount Rwenzori glaciers, solar eclipse, titration burette..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans shadow-inner pr-32"
          />
          <div className="absolute right-2 top-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleSearchOrGenerate(prompt, engineMode, imageSize, aspectRatio)}
              disabled={loading || !prompt.trim()}
              className="py-1.5 px-3.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : engineMode === 'internet' ? (
                <Globe className="w-3.5 h-3.5" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>{engineMode === 'internet' ? 'Get Photos' : 'Generate'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resolution Specification & Subject Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
        {/* Resolution Options */}
        <div>
          <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
            <span>Resolution Specification (Affordance):</span>
            <span className="text-[10px] text-cyan-400 font-mono">
              {imageSize === '1K' ? '1280px Standard HD' : imageSize === '2K' ? '2048px High Definition' : '3840px+ 4K Ultra HD'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['1K', '2K', '4K'] as const).map((size) => (
              <button
                key={size}
                type="button"
                aria-label={`Set resolution to ${size}`}
                aria-pressed={imageSize === size}
                onClick={() => {
                  setImageSize(size);
                  handleSearchOrGenerate(prompt, engineMode, size, aspectRatio);
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold font-mono transition-all flex flex-col items-center justify-center ${
                  imageSize === size
                    ? 'bg-red-600 text-white ring-2 ring-red-400/50 shadow-md shadow-red-600/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{size}</span>
                <span className="text-[9px] opacity-75 font-sans">
                  {size === '1K' ? 'Standard' : size === '2K' ? 'Hi-Res' : 'Ultra HD'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio Options */}
        <div>
          <div className="text-xs font-bold text-slate-300 mb-2">
            Canvas Aspect Ratio:
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { ratio: '16:9', label: 'Widescreen' },
              { ratio: '4:3', label: 'Textbook' },
              { ratio: '1:1', label: 'Square' },
            ].map((item) => (
              <button
                key={item.ratio}
                type="button"
                aria-label={`Set aspect ratio to ${item.ratio}`}
                aria-pressed={aspectRatio === item.ratio}
                onClick={() => {
                  setAspectRatio(item.ratio);
                  if (engineMode !== 'internet') {
                    handleSearchOrGenerate(prompt, engineMode, imageSize, item.ratio);
                  }
                }}
                className={`py-2 px-3 rounded-lg text-xs font-medium font-mono transition-all flex flex-col items-center justify-center ${
                  aspectRatio === item.ratio
                    ? 'bg-cyan-700 text-white ring-2 ring-cyan-400/50'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{item.ratio}</span>
                <span className="text-[9px] opacity-75 font-sans">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Study Subject Filters & Presets */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-red-400" />
            <span>Popular Study Topics &amp; Photo Suggestions:</span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-0.5 rounded-full font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-red-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {filteredPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setPrompt(qp.prompt);
                handleSearchOrGenerate(qp.prompt, engineMode, imageSize, aspectRatio);
              }}
              className="text-xs px-3 py-1.5 bg-slate-950/80 hover:bg-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{qp.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error alert with instant recovery */}
      {error && (
        <div className="p-3 bg-rose-950/50 border border-rose-800/60 rounded-xl text-xs text-rose-200 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => handleSearchOrGenerate(prompt, 'vector', imageSize, aspectRatio)}
            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-lg text-xs flex items-center gap-1 shrink-0"
          >
            <Zap className="w-3 h-3" />
            <span>Load Vector Blueprint</span>
          </button>
        </div>
      )}

      {/* Loading skeleton when switching topics cleanly */}
      {loading && (
        <div className="bg-slate-950/90 border border-cyan-500/30 rounded-2xl p-4 flex items-center gap-3 text-xs text-cyan-300">
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>
            Fetching &amp; preparing {imageSize} visual for &quot;{prompt}&quot;...
          </span>
        </div>
      )}

      {/* Active Featured Image Display */}
      {activeImage && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="font-bold text-white text-sm sm:text-base" data-testid="active-media-title">
                {activeImage.title}
              </h4>
              <span className="text-[10px] bg-red-950 text-red-300 border border-red-700/50 px-2 py-0.5 rounded font-mono font-bold uppercase">
                {activeImage.resolution} Spec
              </span>
              {activeImage.isInternet && (
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-600/50 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                  <Globe className="w-2.5 h-2.5 text-cyan-400" />
                  <span>Internet Verified Photo</span>
                </span>
              )}
              {activeImage.isVector && (
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  Scalable Vector ({imageSize})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onOpenInChat && (
                <button
                  type="button"
                  onClick={() => onOpenInChat(activeImage.title)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs flex items-center gap-1.5 transition-all border border-slate-700"
                  title="Discuss this visual in NEXUS Examiner Chat"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">Ask Examiner</span>
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  setFullscreenPhoto({
                    title: activeImage.title,
                    imageUrl: activeImage.url,
                    fallbackUrl: activeImage.fallbackUrl,
                    caption: activeImage.description,
                    resolutionTag: activeImage.resolution,
                    sourceName: activeImage.sourceName || 'UNEB Educational Archives',
                    sourceUrl: activeImage.sourceUrl,
                    isVector: activeImage.isVector,
                  })
                }
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs flex items-center gap-1.5 transition-all border border-slate-700"
                title="View in full resolution with zoom"
              >
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Inspect {imageSize}</span>
              </button>

              <button
                type="button"
                disabled={downloading}
                onClick={() =>
                  handleDownloadMedia(
                    activeImage.url,
                    activeImage.title,
                    imageSize,
                    activeImage.isVector
                  )
                }
                className="px-3.5 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-all active:scale-95"
              >
                {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>Download {imageSize}</span>
              </button>
            </div>
          </div>

          {/* Image Frame */}
          <div className="relative rounded-xl border border-slate-800 overflow-hidden bg-black/90 flex items-center justify-center p-2 min-h-[360px] max-h-[540px] group">
            <img
              src={activeImage.url}
              alt={activeImage.title}
              onError={handleImageLoadError}
              className="w-full h-auto max-h-[500px] object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
            />
            {activeImage.dimensions && (
              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm border border-slate-700/80 text-[10px] text-slate-300 px-2.5 py-1 rounded-md font-mono shadow-lg">
                Dimensions: {activeImage.dimensions} • {activeImage.resolution}
              </div>
            )}
          </div>

          {/* Educational Caption & Source */}
          <div className="bg-slate-900/90 border border-slate-800/80 p-3.5 rounded-xl text-xs space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-red-400 uppercase tracking-wider text-[11px]">
                Curriculum Study Context &amp; Details:
              </span>
              {activeImage.sourceName && (
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <span>Source: {activeImage.sourceName}</span>
                  {activeImage.sourceUrl && (
                    <a
                      href={activeImage.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open source page on ${activeImage.sourceName}`}
                      className="text-cyan-400 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3 inline" />
                    </a>
                  )}
                </span>
              )}
            </div>
            <p className="text-slate-300 leading-relaxed">
              {activeImage.description}
            </p>
          </div>
        </div>
      )}

      {/* Gallery of Related Internet Photos & Diagrams */}
      {internetPhotos.length > 1 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h4 className="font-bold text-white text-xs sm:text-sm">
                More Internet Photos &amp; Diagrams for &quot;{lastSearchedQuery}&quot;:
              </h4>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {internetPhotos.length} High-Res Results
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {internetPhotos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => {
                  setActiveImage({
                    url: photo.imageUrl,
                    fallbackUrl: photo.thumbnailUrl,
                    title: photo.title,
                    description: photo.caption,
                    resolution: photo.resolutionTag,
                    dimensions: `${photo.width} × ${photo.height}`,
                    isVector: false,
                    isInternet: true,
                    sourceName: photo.sourceName,
                    sourceUrl: photo.sourceUrl,
                  });
                }}
                className={`text-left group cursor-pointer rounded-xl border bg-slate-950 overflow-hidden transition-all duration-200 hover:scale-[1.02] shadow-md flex flex-col ${
                  activeImage?.url === photo.imageUrl
                    ? 'border-cyan-400 ring-2 ring-cyan-400/50'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="relative aspect-video w-full bg-black/80 overflow-hidden">
                  <img
                    src={photo.thumbnailUrl || photo.imageUrl}
                    alt={photo.title}
                    onError={(e) => {
                      const el = e.currentTarget;
                      if (el.dataset.fallbackStage !== 'proxy' && el.src.startsWith('https://')) {
                        el.dataset.fallbackStage = 'proxy';
                        el.src = `/api/proxy-image?url=${encodeURIComponent(el.src)}`;
                        return;
                      }
                      if (el.dataset.fallbackStage === 'done') return;
                      el.dataset.fallbackStage = 'done';
                      if (photo.imageUrl && el.src !== photo.imageUrl) {
                        el.src = photo.imageUrl;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-1.5 right-1.5 bg-black/80 backdrop-blur-sm text-[9px] font-mono font-bold text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40">
                    {photo.resolutionTag}
                  </span>
                  <span className="absolute bottom-1.5 left-1.5 bg-black/80 backdrop-blur-sm text-[9px] font-sans text-cyan-300 px-1.5 py-0.5 rounded uppercase font-semibold">
                    {photo.isDiagramOrPhoto === 'photo' ? 'Photo' : 'Diagram'}
                  </span>
                </div>
                <div className="p-2.5 flex-1 w-full flex flex-col justify-between">
                  <h5 className="font-semibold text-white text-[11px] line-clamp-2 group-hover:text-cyan-300 transition-colors">
                    {photo.title}
                  </h5>
                  <div className="mt-2 pt-1 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{photo.subjectCategory}</span>
                    <span className="text-cyan-400 font-bold">Select →</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Inspection Modal */}
      {fullscreenPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 sm:p-6 flex flex-col items-center justify-center animate-in fade-in duration-200"
          onClick={() => setFullscreenPhoto(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={fullscreenPhoto.title}
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-white text-sm sm:text-base">
                    {fullscreenPhoto.title}
                  </h3>
                  <span className="text-[10px] bg-red-950 text-red-300 border border-red-700/50 px-2 py-0.5 rounded font-mono font-bold">
                    {fullscreenPhoto.resolutionTag || imageSize} Resolution
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Source: {fullscreenPhoto.sourceName}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={downloading}
                  onClick={() =>
                    handleDownloadMedia(
                      fullscreenPhoto.imageUrl,
                      fullscreenPhoto.title,
                      fullscreenPhoto.resolutionTag || imageSize,
                      Boolean(fullscreenPhoto.isVector)
                    )
                  }
                  className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Save Original</span>
                </button>
                <button
                  type="button"
                  aria-label="Close inspection modal"
                  onClick={() => setFullscreenPhoto(null)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body with Zoomable Image */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/90">
              <img
                src={fullscreenPhoto.imageUrl}
                alt={fullscreenPhoto.title}
                onError={(e) => {
                  const el = e.currentTarget;
                  if (el.dataset.fallbackStage !== 'proxy' && el.src.startsWith('https://')) {
                    el.dataset.fallbackStage = 'proxy';
                    el.src = `/api/proxy-image?url=${encodeURIComponent(el.src)}`;
                    return;
                  }
                  if (el.dataset.fallbackStage === 'done') return;
                  el.dataset.fallbackStage = 'done';
                  if (fullscreenPhoto.fallbackUrl && el.src !== fullscreenPhoto.fallbackUrl) {
                    el.src = fullscreenPhoto.fallbackUrl;
                  }
                }}
                className="max-h-[68vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Modal Footer Caption */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs text-slate-300 leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="max-w-2xl">
                <strong className="text-red-400">Curriculum Context: </strong>
                {fullscreenPhoto.caption}
              </div>
              {fullscreenPhoto.sourceUrl && (
                <a
                  href={fullscreenPhoto.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px] font-mono shrink-0"
                >
                  <span>Open Full Archive Record</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagramGenerator;
