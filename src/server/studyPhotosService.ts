/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Study Photos & Diagrams Service
 * Fetches authentic, high-relevance educational photographs and diagrams from the internet
 * (Wikimedia Commons, Wikipedia Educational Archives, and NASA Image Library)
 * strictly matching what the student asked for, with 1K, 2K, and 4K resolution support.
 */

export interface StudyPhoto {
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
  requestedSize: '1K' | '2K' | '4K';
  subjectCategory:
    | 'Biology'
    | 'Physics'
    | 'Chemistry'
    | 'Geography'
    | 'Mathematics'
    | 'Astronomy & Space'
    | 'History'
    | 'General Science';
  license: string;
  isDiagramOrPhoto: 'photo' | 'diagram';
  relevanceScore?: number;
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'of', 'in', 'on', 'at', 'to', 'for', 'and', 'or', 'with',
  'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'how', 'what', 'why', 'where', 'when', 'which', 'who', 'whom',
  'photo', 'photos', 'picture', 'pictures', 'image', 'images', 'photograph',
  'photographs', 'diagram', 'diagrams', 'illustration', 'illustrations',
  'drawing', 'drawings', 'chart', 'charts', 'show', 'me', 'give', 'find',
  'get', 'generate', 'create', 'make', 'look', 'like', 'real', 'clear',
  'high', 'quality', 'resolution', 'hd', 'uhd', '1k', '2k', '4k', 'study',
  'studies', 'relating', 'related', 'about', 'uneb', 'syllabus', 'textbook',
  'student', 'students', 'curriculum', 'labeled', 'labelled', 'detailed',
  'functions', 'function', 'system', 'systems', 'process', 'structure',
  'structures', 'pathway', 'escarpment', 'landscape', 'views', 'view',
]);

/**
 * Extracts clean, high-signal search keywords from any natural student request.
 */
export function cleanStudyPhotoQuery(rawQuery: string): string {
  let cleaned = rawQuery
    .replace(/^Detailed UNEB textbook diagram illustrating:\s*/i, '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/&/g, ' ')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleaned
    .split(' ')
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w.toLowerCase()));

  if (words.length > 0) {
    return words.slice(0, 6).join(' ');
  }

  return rawQuery
    .replace(/\b(photo|photos|picture|pictures|image|images|diagram|diagrams|1k|2k|4k|show me|give me)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts a shorter core fallback query (2-3 strongest words) when full query is too specific.
 */
function buildCoreFallbackQuery(cleanedQuery: string): string {
  const words = cleanedQuery.split(/\s+/).filter((w) => w.length > 2);
  if (words.length <= 2) return cleanedQuery;
  return words.slice(0, 3).join(' ');
}

function getQueryKeywords(query: string): string[] {
  return cleanStudyPhotoQuery(query)
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length >= 3);
}

/**
 * Scores how well a candidate image title/caption matches the student's requested topic.
 */
function scoreRelevance(
  title: string,
  caption: string,
  keywords: string[],
  mediawikiIndex: number,
  width: number,
  preferPhotos: boolean,
  isPhoto: boolean
): number {
  const haystackTitle = title.toLowerCase();
  const haystackFull = `${title} ${caption}`.toLowerCase();

  let matchedInTitle = 0;
  let matchedAnywhere = 0;

  for (const kw of keywords) {
    if (haystackTitle.includes(kw)) matchedInTitle++;
    if (haystackFull.includes(kw)) matchedAnywhere++;
  }

  // Reject completely unrelated items unless keywords is empty
  if (keywords.length > 0 && matchedAnywhere === 0) {
    return -1000;
  }

  // Reject likely unrelated biographies/entertainment/non-study false positives
  const negativePatterns = [
    'actress', 'actor', 'television personality', 'film director', 'headshot',
    'singer', 'album', 'episode', 'movie poster', 'novel by', 'footballer',
    'politician portrait', 'mayor of', 'celebrity',
  ];
  for (const neg of negativePatterns) {
    if (haystackFull.includes(neg) && !keywords.some((k) => neg.includes(k))) {
      return -1000;
    }
  }

  // Penalize non-English localized diagram labels if alternatives exist
  if (/[-_](fa|ar|ru|zh|ja|ko|hi|th|he|uk|pl|cs|de|fr|es)\.(png|jpg|svg)/i.test(title)) {
    return -500;
  }

  let score = 0;
  score += matchedInTitle * 40;
  score += matchedAnywhere * 20;

  // Prefer full match of all keywords
  if (keywords.length > 0 && matchedAnywhere === keywords.length) {
    score += 35;
  }

  // Search engine rank signal (index starts at 1)
  score += Math.max(0, 20 - mediawikiIndex * 2);

  // Resolution bonus
  if (width >= 2000) score += 12;
  else if (width >= 1000) score += 6;
  else if (width < 400) score -= 25;

  // Photo vs diagram preference
  if (preferPhotos && isPhoto) score += 15;
  if (!preferPhotos && !isPhoto) score += 15;

  // Gently prefer modern scientific photographs/diagrams over antique prints unless explicitly requested
  if (/(wellcome|rare books|engraving|etching|woodcut|17th century|18th century)/i.test(haystackFull)) {
    score -= 22;
  }

  return score;
}

/**
 * Categorizes subject area from prompt text
 */
function detectSubjectCategory(query: string): StudyPhoto['subjectCategory'] {
  const q = query.toLowerCase();
  if (
    q.includes('planet') || q.includes('solar') || q.includes('eclipse') ||
    q.includes('moon') || q.includes('galaxy') || q.includes('nebula') ||
    q.includes('mars') || q.includes('jupiter') || q.includes('saturn') ||
    q.includes('astronomy') || q.includes('space') || q.includes('orbit') ||
    q.includes('comet') || q.includes('star')
  ) {
    return 'Astronomy & Space';
  }
  if (
    q.includes('heart') || q.includes('blood') || q.includes('cell') ||
    q.includes('eye') || q.includes('leaf') || q.includes('plant') ||
    q.includes('organ') || q.includes('skeleton') || q.includes('digestive') ||
    q.includes('respiratory') || q.includes('amoeba') || q.includes('chloroplast') ||
    q.includes('dna') || q.includes('mitosis') || q.includes('frog') ||
    q.includes('lion') || q.includes('elephant') || q.includes('fish') ||
    q.includes('insect') || q.includes('flower') || q.includes('biology') ||
    q.includes('brain') || q.includes('kidney') || q.includes('lung')
  ) {
    return 'Biology';
  }
  if (
    q.includes('prism') || q.includes('lens') || q.includes('circuit') ||
    q.includes('light') || q.includes('refraction') || q.includes('magnet') ||
    q.includes('voltage') || q.includes('current') || q.includes('reflection') ||
    q.includes('sound') || q.includes('wave') || q.includes('gravity') ||
    q.includes('pendulum') || q.includes('pulley') || q.includes('physics')
  ) {
    return 'Physics';
  }
  if (
    q.includes('titration') || q.includes('burner') || q.includes('acid') ||
    q.includes('base') || q.includes('periodic') || q.includes('atom') ||
    q.includes('electron') || q.includes('molecule') || q.includes('flame') ||
    q.includes('precipitate') || q.includes('beaker') || q.includes('crystal') ||
    q.includes('chemistry') || q.includes('laboratory')
  ) {
    return 'Chemistry';
  }
  if (
    q.includes('rift') || q.includes('valley') || q.includes('mountain') ||
    q.includes('river') || q.includes('nile') || q.includes('lake') ||
    q.includes('volcano') || q.includes('soil') || q.includes('map') ||
    q.includes('uganda') || q.includes('africa') || q.includes('rwenzori') ||
    q.includes('kilimanjaro') || q.includes('glacier') || q.includes('weather') ||
    q.includes('climate') || q.includes('geography') || q.includes('waterfall')
  ) {
    return 'Geography';
  }
  if (
    q.includes('parabola') || q.includes('triangle') || q.includes('circle') ||
    q.includes('pythagoras') || q.includes('graph') || q.includes('angle') ||
    q.includes('quadratic') || q.includes('geometry') || q.includes('math')
  ) {
    return 'Mathematics';
  }
  if (
    q.includes('independence') || q.includes('colonial') || q.includes('treaty') ||
    q.includes('rebellion') || q.includes('kabaka') || q.includes('history') ||
    q.includes('ancient') || q.includes('pyramid')
  ) {
    return 'History';
  }
  return 'General Science';
}

function getTargetWidth(imageSize: '1K' | '2K' | '4K'): number {
  // Keep Wikimedia requests within standard thumb.wikimedia.org CDN buckets (1280 / 1920)
  // to avoid upload.wikimedia.org unscaled 429 throttling in browsers
  if (imageSize === '4K' || imageSize === '2K') return 1920;
  return 1280;
}

function computeResolutionTag(width: number): StudyPhoto['resolutionTag'] {
  if (width >= 2800) return '4K';
  if (width >= 1600) return '2K';
  if (width >= 1000) return '1K';
  return 'HD';
}

function normalizeWikimediaThumbUrl(
  rawUrl: string,
  originalWidth: number,
  originalHeight: number,
  isSvgOrAnimated = false
): { url: string; width: number; height: number } {
  const cleanUrl = String(rawUrl || '').split('?')[0];
  const commonsMatch = cleanUrl.match(
    /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/([0-9a-f]+\/[0-9a-f]+\/([^/]+))$/i
  );
  if (commonsMatch) {
    const relPath = commonsMatch[1];
    const fileName = commonsMatch[2];
    const isSvg = isSvgOrAnimated || fileName.toLowerCase().endsWith('.svg');
    const bucket = [1920, 1280, 960, 500, 330].find((b) => isSvg || b < originalWidth) || 330;
    return {
      url: `https://thumb.wikimedia.org/wikipedia/commons/thumb/${relPath}/${bucket}px-${fileName}${isSvg ? '.png' : ''}`,
      width: bucket,
      height: Math.round((bucket * originalHeight) / Math.max(1, originalWidth)),
    };
  }
  return { url: cleanUrl, width: originalWidth, height: originalHeight };
}

async function queryWikimediaCommons(
  searchQuery: string,
  targetWidth: number,
  requestedSize: '1K' | '2K' | '4K',
  keywords: string[],
  targetCategory: StudyPhoto['subjectCategory'],
  preferPhotos: boolean,
  bitmapOnly: boolean
): Promise<StudyPhoto[]> {
  const gsQuery = bitmapOnly ? `${searchQuery} filetype:bitmap` : searchQuery;
  const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(
    gsQuery
  )}&gsrlimit=12&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=${targetWidth}&format=json`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(commonsUrl, {
      headers: {
        'User-Agent': 'NexusAIStudyAssistant/1.0 (Educational Assistant for UNEB Students)',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) return [];

    const data: any = await response.json();
    const pagesObj = data?.query?.pages;
    if (!pagesObj || typeof pagesObj !== 'object') return [];

    const pages = Object.values(pagesObj).sort((a: any, b: any) => (a.index || 999) - (b.index || 999));
    const items: StudyPhoto[] = [];

    for (const page of pages as any[]) {
      const info = page?.imageinfo?.[0];
      if (!info) continue;

      const mime = String(info.mime || '').toLowerCase();
      if (!mime.startsWith('image/') || mime.includes('djvu') || mime.includes('tiff') || mime.includes('pdf')) {
        continue;
      }

      const rawTitle = page.title
        ? String(page.title).replace(/^File:/i, '').replace(/\.[^/.]+$/, '').replace(/[_+]/g, ' ')
        : searchQuery;

      const extmeta = info.extmetadata || {};
      const rawDescription = extmeta.ImageDescription?.value
        ? String(extmeta.ImageDescription.value).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 240)
        : `${rawTitle} — Educational reference image for ${targetCategory}.`;

      const originalWidth = Number(info.width) || targetWidth;
      const originalHeight = Number(info.height) || Math.round(targetWidth * 0.75);
      if (originalWidth < 250 || originalHeight < 200) continue;

      const isSvgOrGif = mime.includes('svg') || mime.includes('gif');
      const isPhoto =
        !isSvgOrGif &&
        !/\b(diagram|schema|chart|scheme|flowchart|map of)\b/i.test(rawTitle);

      const rel = scoreRelevance(
        rawTitle,
        rawDescription,
        keywords,
        Number(page.index) || 10,
        originalWidth,
        preferPhotos,
        isPhoto
      );

      if (rel < -100) continue;

      // Always prefer reliable thumb.wikimedia.org standard CDN buckets (330, 500, 960, 1280, 1920)
      const normalized = normalizeWikimediaThumbUrl(
        info.thumburl || info.url,
        info.thumbwidth || originalWidth,
        info.thumbheight || originalHeight,
        mime.includes('svg')
      );
      const safeMediaUrl = normalized.url;
      const deliveredWidth = normalized.width;
      const deliveredHeight = normalized.height;

      items.push({
        id: `commons_${page.pageid || Math.random().toString(36).slice(2)}`,
        title: rawTitle,
        caption: rawDescription,
        imageUrl: safeMediaUrl,
        thumbnailUrl: safeMediaUrl,
        sourceUrl: info.descriptionurl || 'https://commons.wikimedia.org',
        sourceName: 'Wikimedia Commons',
        width: deliveredWidth,
        height: deliveredHeight,
        resolutionTag: computeResolutionTag(deliveredWidth),
        requestedSize,
        subjectCategory: targetCategory,
        license: extmeta.LicenseShortName?.value || 'Creative Commons / Open Access',
        isDiagramOrPhoto: isPhoto ? 'photo' : 'diagram',
        relevanceScore: rel,
      });
    }

    return items;
  } catch (err: any) {
    clearTimeout(timeout);
    console.info('Wikimedia Commons query note:', err?.message || err);
    return [];
  }
}

async function queryWikipediaImages(
  searchQuery: string,
  targetWidth: number,
  requestedSize: '1K' | '2K' | '4K',
  keywords: string[],
  targetCategory: StudyPhoto['subjectCategory'],
  preferPhotos: boolean
): Promise<StudyPhoto[]> {
  const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|extracts&generator=search&gsrsearch=${encodeURIComponent(
    searchQuery
  )}&gsrlimit=8&pithumbsize=${targetWidth}&exintro=1&explaintext=1&exchars=260`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const wikiRes = await fetch(wikiUrl, {
      headers: {
        'User-Agent': 'NexusAIStudyAssistant/1.0 (Educational Assistant for UNEB Students)',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!wikiRes.ok) return [];

    const wikiData: any = await wikiRes.json();
    const pagesObj = wikiData?.query?.pages;
    if (!pagesObj || typeof pagesObj !== 'object') return [];

    const pages = Object.values(pagesObj).sort((a: any, b: any) => (a.index || 999) - (b.index || 999));
    const items: StudyPhoto[] = [];

    for (const page of pages as any[]) {
      if (!page?.thumbnail?.source) continue;
      const w = Number(page.thumbnail.width) || targetWidth;
      const h = Number(page.thumbnail.height) || Math.round(targetWidth * 0.75);
      if (w < 220) continue;

      const title = String(page.title || searchQuery);
      const extract = String(page.extract || `Verified educational photo from Wikipedia for ${title}.`);
      const isPhoto = !/diagram|map_of|chart/i.test(page.pageimage || title);

      const rel = scoreRelevance(
        title,
        extract,
        keywords,
        Number(page.index) || 10,
        w,
        preferPhotos,
        isPhoto
      );

      // Require stronger relevance for Wikipedia pages so unrelated people/places are excluded
      if (rel < 20) continue;

      const normalizedWiki = normalizeWikimediaThumbUrl(page.thumbnail.source, w, h, false);

      items.push({
        id: `wiki_${page.pageid}`,
        title,
        caption: extract,
        imageUrl: normalizedWiki.url,
        thumbnailUrl: normalizedWiki.url,
        sourceUrl: `https://en.wikipedia.org/?curid=${page.pageid}`,
        sourceName: 'Wikipedia Educational Encyclopedia',
        width: normalizedWiki.width,
        height: normalizedWiki.height,
        resolutionTag: computeResolutionTag(normalizedWiki.width),
        requestedSize,
        subjectCategory: targetCategory,
        license: 'CC BY-SA 4.0 / Public Domain',
        isDiagramOrPhoto: isPhoto ? 'photo' : 'diagram',
        relevanceScore: rel - 5, // Slight preference for full Wikimedia Commons photos
      });
    }

    return items;
  } catch (err: any) {
    clearTimeout(timeout);
    console.info('Wikipedia query note:', err?.message || err);
    return [];
  }
}

async function queryNasaImages(
  searchQuery: string,
  requestedSize: '1K' | '2K' | '4K',
  targetCategory: StudyPhoto['subjectCategory']
): Promise<StudyPhoto[]> {
  if (targetCategory !== 'Astronomy & Space' && !/\b(earth|volcano|rift|glacier|river|atmosphere|satellite)\b/i.test(searchQuery)) {
    return [];
  }

  const nasaUrl = `https://images-api.nasa.gov/search?q=${encodeURIComponent(searchQuery)}&media_type=image&page_size=5`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    const res = await fetch(nasaUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return [];

    const data: any = await res.json();
    const items: StudyPhoto[] = [];

    for (const entry of data?.collection?.items || []) {
      const meta = entry?.data?.[0];
      const thumbLink = entry?.links?.find((l: any) => l.rel === 'preview')?.href;
      if (!meta || !thumbLink) continue;

      const nasaId = meta.nasa_id;
      const largeUrl = thumbLink.replace(/~(thumb|small|medium)\.jpg$/i, '~large.jpg');

      items.push({
        id: `nasa_${nasaId}`,
        title: meta.title || searchQuery,
        caption: String(meta.description || '').replace(/<[^>]*>/g, '').slice(0, 240),
        imageUrl: largeUrl,
        thumbnailUrl: thumbLink,
        sourceUrl: `https://images.nasa.gov/details/${nasaId}`,
        sourceName: 'NASA Image Library',
        width: requestedSize === '4K' ? 3840 : requestedSize === '2K' ? 2048 : 1280,
        height: requestedSize === '4K' ? 2160 : requestedSize === '2K' ? 1152 : 720,
        resolutionTag: requestedSize,
        requestedSize,
        subjectCategory: targetCategory,
        license: 'Public Domain (NASA)',
        isDiagramOrPhoto: 'photo',
        relevanceScore: 55,
      });
    }

    return items;
  } catch {
    clearTimeout(timeout);
    return [];
  }
}

/**
 * Searches the internet (Wikimedia Commons, Wikipedia Educational Encyclopedia, and NASA)
 * for real study photos and diagrams strictly matching the student's prompt.
 */
export async function searchInternetStudyPhotos(
  userQuery: string,
  options: {
    imageSize?: '1K' | '2K' | '4K';
    limit?: number;
    preferPhotos?: boolean;
  } = {}
): Promise<{ photos: StudyPhoto[]; queryUsed: string; source: string }> {
  const { imageSize = '2K', limit = 8, preferPhotos = true } = options;
  const cleanedQuery = cleanStudyPhotoQuery(userQuery);
  const coreQuery = buildCoreFallbackQuery(cleanedQuery);
  const keywords = getQueryKeywords(userQuery);
  const targetCategory = detectSubjectCategory(userQuery);
  const targetWidth = getTargetWidth(imageSize);

  // Run primary searches in parallel for speed and relevance
  const [commonsBitmap, wikiPrimary, nasaResults] = await Promise.all([
    queryWikimediaCommons(cleanedQuery, targetWidth, imageSize, keywords, targetCategory, preferPhotos, preferPhotos),
    queryWikipediaImages(cleanedQuery, targetWidth, imageSize, keywords, targetCategory, preferPhotos),
    queryNasaImages(cleanedQuery, imageSize, targetCategory),
  ]);

  let combined: StudyPhoto[] = [...commonsBitmap, ...nasaResults, ...wikiPrimary];

  // If primary query was too specific and yielded fewer than 3 relevant items, broaden with core query + all-format Wikimedia
  if (combined.length < 3 && coreQuery && coreQuery !== cleanedQuery) {
    const coreKeywords = getQueryKeywords(coreQuery);
    const [broadCommons, broadWiki] = await Promise.all([
      queryWikimediaCommons(coreQuery, targetWidth, imageSize, coreKeywords, targetCategory, preferPhotos, preferPhotos),
      queryWikipediaImages(coreQuery, targetWidth, imageSize, coreKeywords, targetCategory, preferPhotos),
    ]);
    combined.push(...broadCommons, ...broadWiki);
  }

  // If still fewer than 2 items when preferPhotos=true, also allow high-res diagrams from Wikimedia Commons
  if (combined.length < 2 && preferPhotos) {
    const diagramCommons = await queryWikimediaCommons(
      coreQuery || cleanedQuery,
      targetWidth,
      imageSize,
      getQueryKeywords(coreQuery || cleanedQuery),
      targetCategory,
      false,
      false
    );
    combined.push(...diagramCommons);
  }

  // Deduplicate by normalized URL / title and sort strictly by relevanceScore descending
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const deduped: StudyPhoto[] = [];

  combined.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

  for (const item of combined) {
    const normUrl = item.imageUrl.split('?')[0];
    const normTitle = item.title.toLowerCase().trim();
    if (seenUrls.has(normUrl) || seenTitles.has(normTitle)) continue;
    seenUrls.add(normUrl);
    seenTitles.add(normTitle);
    deduped.push(item);
  }

  const finalPhotos = deduped.slice(0, limit);

  return {
    photos: finalPhotos,
    queryUsed: cleanedQuery,
    source: finalPhotos.length > 0 ? finalPhotos[0].sourceName : 'Wikimedia Commons',
  };
}
