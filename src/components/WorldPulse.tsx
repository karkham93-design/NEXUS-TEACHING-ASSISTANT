import React, { useState, useEffect } from 'react';
import { Globe, MapPin, ExternalLink, RefreshCw, Loader2, Compass, Newspaper, Sparkles } from 'lucide-react';

export const WorldPulse: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'places'>('news');
  const [newsQuery, setNewsQuery] = useState<string>(
    'Uganda National Examinations Board (https://uneb.ac.ug/) official updates, PLE UCE exam timetables, candidate registration guidelines, and educational developments'
  );
  const [placesQuery, setPlacesQuery] = useState<string>(
    'UNEB Uganda National Examinations Board headquarters Kyambogo Ntinda Kampala, Kyambogo University, and renowned secondary schools in Uganda'
  );

  const [newsSummary, setNewsSummary] = useState<string>('');
  const [citations, setCitations] = useState<Array<{ title: string; url: string }>>([]);
  const [placesText, setPlacesText] = useState<string>('');
  const [mapSources, setMapSources] = useState<Array<{ title: string; uri: string }>>([]);

  const [loadingNews, setLoadingNews] = useState<boolean>(false);
  const [loadingPlaces, setLoadingPlaces] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorldPulse = async () => {
    try {
      setLoadingNews(true);
      setError(null);
      const res = await fetch('/api/world-pulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: newsQuery }),
      });
      if (!res.ok) {
        throw new Error('Failed to retrieve world pulse.');
      }
      const data = await res.json();
      setNewsSummary(data.summary || '');
      setCitations(data.citations || []);
    } catch (err: any) {
      console.error('World pulse error:', err);
      setError(err.message || 'Could not fetch global tech briefing.');
    } finally {
      setLoadingNews(false);
    }
  };

  const fetchPlaces = async () => {
    try {
      setLoadingPlaces(true);
      setError(null);
      const res = await fetch('/api/places-maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: placesQuery }),
      });
      if (!res.ok) {
        throw new Error('Failed to retrieve locations.');
      }
      const data = await res.json();
      setPlacesText(data.text || '');
      setMapSources(data.mapSources || []);
    } catch (err: any) {
      console.error('Places maps error:', err);
      setError(err.message || 'Could not fetch tech locations.');
    } finally {
      setLoadingPlaces(false);
    }
  };

  useEffect(() => {
    fetchWorldPulse();
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-white">World Pulse: Global Tech & Outside Intelligence</h3>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'news'
                ? 'bg-cyan-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>Search Grounded News</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('places');
              if (!placesText) fetchPlaces();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'places'
                ? 'bg-cyan-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Maps Grounded Tech Hubs</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 rounded p-2.5">
          {error}
        </div>
      )}

      {/* Tab 1: Google Search Grounded Tech News */}
      {activeTab === 'news' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newsQuery}
              onChange={(e) => setNewsQuery(e.target.value)}
              placeholder="Search global software news or industry shifts..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={fetchWorldPulse}
              disabled={loadingNews}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              {loadingNews ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>Refresh Briefing</span>
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Live Gemini Search Intelligence
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Model: gemini-3.8-flash (googleSearch)</span>
            </div>

            {loadingNews ? (
              <div className="py-8 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                <span>Querying Google Search Grounding for current global events...</span>
              </div>
            ) : (
              <div className="text-xs leading-relaxed text-slate-300 space-y-2 whitespace-pre-wrap">
                {newsSummary || 'No news summary retrieved.'}
              </div>
            )}

            {/* Citations & Sources */}
            {citations.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                  Verified Grounding Citations:
                </span>
                <div className="flex flex-wrap gap-2">
                  {citations.map((c, i) => (
                    <a
                      key={i}
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700/60 px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors"
                    >
                      <span className="max-w-[200px] truncate">{c.title}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Google Maps Grounded Places */}
      {activeTab === 'places' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={placesQuery}
              onChange={(e) => setPlacesQuery(e.target.value)}
              placeholder="Find tech hubs, research campuses, or hackathon spots..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={fetchPlaces}
              disabled={loadingPlaces}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              {loadingPlaces ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Compass className="w-3.5 h-3.5" />}
              <span>Search Hubs</span>
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Google Maps Grounded Locations
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Model: gemini-3.8-flash (googleMaps)</span>
            </div>

            {loadingPlaces ? (
              <div className="py-8 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                <span>Searching Google Maps Grounding data...</span>
              </div>
            ) : (
              <div className="text-xs leading-relaxed text-slate-300 space-y-2 whitespace-pre-wrap">
                {placesText || 'Click Search Hubs to discover tech centers and university labs.'}
              </div>
            )}

            {/* Google Maps Links (Mandatory per Skill) */}
            {mapSources.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                  Grounding Map Locations &amp; Pins:
                </span>
                <div className="flex flex-wrap gap-2">
                  {mapSources.map((m, i) => (
                    <a
                      key={i}
                      href={m.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700/60 px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors"
                    >
                      <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      <span className="max-w-[220px] truncate">{m.title}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
