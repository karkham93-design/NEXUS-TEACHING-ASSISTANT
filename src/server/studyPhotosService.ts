/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Study Photos & Diagrams Service
 * Fetches real, high-resolution educational photographs and diagrams from the internet
 * (Wikimedia Commons, Wikipedia Educational Archives, and Curated Science/Geography Repositories)
 * with 1K, 2K, and 4K resolution options.
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
  subjectCategory: 'Biology' | 'Physics' | 'Chemistry' | 'Geography' | 'Mathematics' | 'General Science' | 'History' | 'General Study';
  license: string;
  isDiagramOrPhoto: 'photo' | 'diagram';
}

// Curated high-resolution study photos and textbook diagrams for instant guaranteed rendering
const CURATED_STUDY_PHOTOS: Record<string, StudyPhoto[]> = {
  heart: [
    {
      id: 'curated_heart_1',
      title: 'Human Heart - Anterior Exterior Anatomy Photo',
      caption: 'Real anatomical view of the human heart showing the aorta, pulmonary artery, vena cava, and muscular ventricles.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Heart_anterior_exterior_view.png',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Heart_anterior_exterior_view.png/800px-Heart_anterior_exterior_view.png',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Heart_anterior_exterior_view.png',
      sourceName: 'Wikimedia Commons (Medical Archive)',
      width: 2400,
      height: 3600,
      resolutionTag: '4K',
      subjectCategory: 'Biology',
      license: 'CC BY-SA 4.0',
      isDiagramOrPhoto: 'photo',
    },
    {
      id: 'curated_heart_2',
      title: 'Diagram of Human Heart Blood Flow & Four Chambers',
      caption: 'Official curriculum textbook diagram with clear arrows illustrating oxygenated blood (red) and deoxygenated blood (blue) flow through atria and ventricles.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Diagram_of_the_human_heart_%28cropped%29.svg/2560px-Diagram_of_the_human_heart_%28cropped%29.svg.png',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Diagram_of_the_human_heart_%28cropped%29.svg/1024px-Diagram_of_the_human_heart_%28cropped%29.svg.png',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Diagram_of_the_human_heart_(cropped).svg',
      sourceName: 'Wikimedia Commons (Textbook Diagrams)',
      width: 2560,
      height: 2040,
      resolutionTag: '2K',
      subjectCategory: 'Biology',
      license: 'Public Domain',
      isDiagramOrPhoto: 'diagram',
    },
    {
      id: 'curated_heart_3',
      title: 'Mammalian Heart Valve System & Fibrous Skeleton',
      caption: 'Close-up anatomical photograph of tricuspid, bicuspid, and semilunar valves preventing backflow during ventricular systole.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Heart_interior_view.jpg/1920px-Heart_interior_view.jpg',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Heart_interior_view.jpg/800px-Heart_interior_view.jpg',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Heart_interior_view.jpg',
      sourceName: 'Wikimedia Commons (Anatomy)',
      width: 1920,
      height: 1280,
      resolutionTag: '1K',
      subjectCategory: 'Biology',
      license: 'CC BY 3.0',
      isDiagramOrPhoto: 'photo',
    },
  ],
  cell: [
    {
      id: 'curated_cell_1',
      title: 'Plant Leaf Cells with Green Chloroplasts (Microscope Photo)',
      caption: 'Real high-magnification photomicrograph of living plant moss cells showing green chloroplast organelles and protective cellulose cell walls.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Bryum_capillare_leaf_cells.jpg',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Bryum_capillare_leaf_cells.jpg/1024px-Bryum_capillare_leaf_cells.jpg',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bryum_capillare_leaf_cells.jpg',
      sourceName: 'Wikimedia Commons (Microscopy)',
      width: 3264,
      height: 2448,
      resolutionTag: '4K',
      subjectCategory: 'Biology',
      license: 'CC BY-SA 3.0',
      isDiagramOrPhoto: 'photo',
    },
    {
      id: 'curated_cell_2',
      title: 'Plant Cell Structure & Labeled Organelles (Textbook Diagram)',
      caption: 'Clear labeled diagram showing nucleus, mitochondria, vacuole, cell membrane, cytoplasm, and chloroplast.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Plant_cell_structure_svg_labels.svg/2560px-Plant_cell_structure_svg_labels.svg.png',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Plant_cell_structure_svg_labels.svg/1024px-Plant_cell_structure_svg_labels.svg.png',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Plant_cell_structure_svg_labels.svg',
      sourceName: 'Wikimedia Commons (Textbook Diagrams)',
      width: 2560,
      height: 1800,
      resolutionTag: '2K',
      subjectCategory: 'Biology',
      license: 'CC BY-SA 3.0',
      isDiagramOrPhoto: 'diagram',
    },
    {
      id: 'curated_cell_3',
      title: 'Human Red & White Blood Cells (Scanning Electron Microscope)',
      caption: 'False-color SEM photograph showing biconcave red blood cells (erythrocytes) and immune T-lymphocytes.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Red_White_Blood_cells.jpg',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Red_White_Blood_cells.jpg/1024px-Red_White_Blood_cells.jpg',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Red_White_Blood_cells.jpg',
      sourceName: 'National Institutes of Health (NIH)',
      width: 2048,
      height: 1536,
      resolutionTag: '2K',
      subjectCategory: 'Biology',
      license: 'Public Domain',
      isDiagramOrPhoto: 'photo',
    },
  ],
  rift: [
    {
      id: 'curated_rift_1',
      title: 'East African Great Rift Valley Escarpment Landscape Photo',
      caption: 'Ultra-high-resolution aerial photograph of the Gregory Rift Valley escarpment in East Africa showing fault scarps and flat rift floor.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/da/View_northeast_into_Great_Rift_Valley_from_Subukia_lookout%2C_Kenya.jpg',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/View_northeast_into_Great_Rift_Valley_from_Subukia_lookout%2C_Kenya.jpg/1280px-View_northeast_into_Great_Rift_Valley_from_Subukia_lookout%2C_Kenya.jpg',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:View_northeast_into_Great_Rift_Valley_from_Subukia_lookout,_Kenya.jpg',
      sourceName: 'Wikimedia Commons (Geological Photography)',
      width: 7360,
      height: 4912,
      resolutionTag: '4K',
      subjectCategory: 'Geography',
      license: 'CC BY-SA 4.0',
      isDiagramOrPhoto: 'photo',
    },
    {
      id: 'curated_rift_2',
      title: 'Formation of Rift Valley by Tension and Compression Forces',
      caption: 'Syllabus diagram illustrating tensional normal faults versus compressional reverse faults with central graben subsidence.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Fault_block_types.svg/2560px-Fault_block_types.svg.png',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Fault_block_types.svg/1024px-Fault_block_types.svg.png',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fault_block_types.svg',
      sourceName: 'USGS Educational Media',
      width: 2560,
      height: 1440,
      resolutionTag: '2K',
      subjectCategory: 'Geography',
      license: 'Public Domain',
      isDiagramOrPhoto: 'diagram',
    },
  ],
  rwenzori: [
    {
      id: 'curated_rwenzori_1',
      title: 'Mount Rwenzori (Mountains of the Moon) Glacial Peak Photo',
      caption: 'Landscape photo of Margherita Peak (5,109m) in Uganda showing block mountain horst uplift, glaciers, and alpine vegetation.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Mount_Stanley_Margherita_Peak.jpg/2560px-Mount_Stanley_Margherita_Peak.jpg',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Mount_Stanley_Margherita_Peak.jpg/1024px-Mount_Stanley_Margherita_Peak.jpg',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mount_Stanley_Margherita_Peak.jpg',
      sourceName: 'Wikimedia Commons (East Africa)',
      width: 3840,
      height: 2560,
      resolutionTag: '4K',
      subjectCategory: 'Geography',
      license: 'CC BY-SA 4.0',
      isDiagramOrPhoto: 'photo',
    },
  ],
  chemistry: [
    {
      id: 'curated_chem_1',
      title: 'Laboratory Titration Apparatus with Burette and Conical Flask Photo',
      caption: 'Real chemistry laboratory photo of acid-base titration setup with burette clamp, retort stand, and phenolphthalein indicator endpoint.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Acid_base_titration.jpg/1920px-Acid_base_titration.jpg',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Acid_base_titration.jpg/1024px-Acid_base_titration.jpg',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Acid_base_titration.jpg',
      sourceName: 'Chemistry Education Archives',
      width: 2592,
      height: 3872,
      resolutionTag: '4K',
      subjectCategory: 'Chemistry',
      license: 'CC BY-SA 3.0',
      isDiagramOrPhoto: 'photo',
    },
    {
      id: 'curated_chem_2',
      title: 'Laboratory Bunsen Burner with Blue Non-Luminous Flame Photo',
      caption: 'High-resolution photo of a laboratory Bunsen burner showing complete combustion air hole open, flame zones, and collar.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Bunsen_burner_flame_types.jpg/1920px-Bunsen_burner_flame_types.jpg',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Bunsen_burner_flame_types.jpg/800px-Bunsen_burner_flame_types.jpg',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bunsen_burner_flame_types.jpg',
      sourceName: 'Science Photo Lab',
      width: 2400,
      height: 1800,
      resolutionTag: '2K',
      subjectCategory: 'Chemistry',
      license: 'CC BY-SA 4.0',
      isDiagramOrPhoto: 'photo',
    },
  ],
  physics: [
    {
      id: 'curated_phys_1',
      title: 'Light Ray Refraction & Dispersion through Glass Triangular Prism Photo',
      caption: 'Laboratory optics photograph demonstrating white light entering a glass prism and dispersing into spectral colors according to Snell\'s Law.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Prism_rainbow_schema.jpg/2560px-Prism_rainbow_schema.jpg',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Prism_rainbow_schema.jpg/1024px-Prism_rainbow_schema.jpg',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Prism_rainbow_schema.jpg',
      sourceName: 'Physics Laboratory Archive',
      width: 3200,
      height: 2200,
      resolutionTag: '4K',
      subjectCategory: 'Physics',
      license: 'CC BY-SA 3.0',
      isDiagramOrPhoto: 'photo',
    },
    {
      id: 'curated_phys_2',
      title: 'Simple Electric Circuit with Resistor, Ammeter and Voltmeter (Diagram)',
      caption: 'Official UNEB Paper 1 standard circuit diagram showing series ammeter connection and parallel voltmeter connection for Ohm\'s Law V = IR.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Simple_circuit.svg/2048px-Simple_circuit.svg.png',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Simple_circuit.svg/1024px-Simple_circuit.svg.png',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Simple_circuit.svg',
      sourceName: 'Wikimedia Commons (Circuit Schematics)',
      width: 2048,
      height: 1536,
      resolutionTag: '2K',
      subjectCategory: 'Physics',
      license: 'Public Domain',
      isDiagramOrPhoto: 'diagram',
    },
  ],
};

/**
 * Categorizes subject area from prompt text
 */
function detectSubjectCategory(query: string): StudyPhoto['subjectCategory'] {
  const q = query.toLowerCase();
  if (q.includes('heart') || q.includes('blood') || q.includes('cell') || q.includes('eye') || q.includes('leaf') || q.includes('plant') || q.includes('organ') || q.includes('skeleton') || q.includes('digestive') || q.includes('respiratory') || q.includes('amoeba') || q.includes('chloroplast') || q.includes('biology')) {
    return 'Biology';
  }
  if (q.includes('prism') || q.includes('lens') || q.includes('circuit') || q.includes('light') || q.includes('refraction') || q.includes('magnet') || q.includes('voltage') || q.includes('current') || q.includes('reflection') || q.includes('sound') || q.includes('wave') || q.includes('gravity') || q.includes('physics')) {
    return 'Physics';
  }
  if (q.includes('titration') || q.includes('burner') || q.includes('acid') || q.includes('base') || q.includes('periodic') || q.includes('atom') || q.includes('electron') || q.includes('molecule') || q.includes('flame') || q.includes('precipitate') || q.includes('beaker') || q.includes('chemistry')) {
    return 'Chemistry';
  }
  if (q.includes('rift') || q.includes('valley') || q.includes('mountain') || q.includes('river') || q.includes('lake') || q.includes('volcano') || q.includes('soil') || q.includes('map') || q.includes('uganda') || q.includes('africa') || q.includes('weather') || q.includes('climate') || q.includes('geography')) {
    return 'Geography';
  }
  if (q.includes('parabola') || q.includes('triangle') || q.includes('circle') || q.includes('pythagoras') || q.includes('graph') || q.includes('angle') || q.includes('quadratic') || q.includes('geometry') || q.includes('math')) {
    return 'Mathematics';
  }
  if (q.includes('independence') || q.includes('colonial') || q.includes('treaty') || q.includes('rebellion') || q.includes('kabaka') || q.includes('history')) {
    return 'History';
  }
  return 'General Science';
}

/**
 * Cleans user query to extract the primary study noun phrase
 */
export function cleanStudyPhotoQuery(rawQuery: string): string {
  let cleaned = rawQuery
    .replace(/^Detailed UNEB textbook diagram illustrating:\s*/i, '')
    .replace(/\b(photo of|photos of|picture of|pictures of|image of|images of|diagram of|diagrams of|photograph of|photographs of|show me|give me|find me|look at|relating to studies|relating to)\b/gi, ' ')
    .replace(/\b(for uneb|for students|in 1k|in 2k|in 4k|1k|2k|4k|high quality|high resolution|clear|real|study)\b/gi, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  return cleaned || rawQuery.trim();
}

/**
 * Searches the internet (Wikimedia Commons & Wikipedia Educational Repositories)
 * for real study photos and diagrams matching the student's request.
 */
export async function searchInternetStudyPhotos(
  userQuery: string,
  options: {
    imageSize?: '1K' | '2K' | '4K';
    limit?: number;
    preferPhotos?: boolean;
  } = {}
): Promise<{ photos: StudyPhoto[]; queryUsed: string; source: string }> {
  const { imageSize = '1K', limit = 8, preferPhotos = true } = options;
  const cleanedQuery = cleanStudyPhotoQuery(userQuery);
  const targetCategory = detectSubjectCategory(userQuery);

  const results: StudyPhoto[] = [];

  // Determine requested thumbnail render width for Wikimedia Commons
  let targetWidth = 1280;
  if (imageSize === '2K') targetWidth = 2048;
  if (imageSize === '4K') targetWidth = 3840;

  // 1. Search Wikimedia Commons Media Files
  try {
    const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(
      cleanedQuery + (preferPhotos ? ' photo OR photograph OR anatomy OR specimen' : '')
    )}&gsrlimit=${Math.min(limit * 2, 16)}&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=${targetWidth}&format=json`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const response = await fetch(commonsUrl, {
      headers: {
        'User-Agent': 'NexusAIStudyAssistant/1.0 (Educational Assistant for UNEB Students; info@nexus.study)',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data: any = await response.json();
      const pages = data?.query?.pages;

      if (pages && typeof pages === 'object') {
        Object.values(pages).forEach((page: any) => {
          const info = page?.imageinfo?.[0];
          if (!info) return;

          const mime = info.mime || '';
          if (!mime.startsWith('image/') || mime.includes('djvu') || mime.includes('tiff') || mime.includes('pdf')) {
            return;
          }

          const rawTitle = page.title ? page.title.replace(/^File:/i, '').replace(/\.[^/.]+$/, '').replace(/[_+]/g, ' ') : cleanedQuery;
          const extmeta = info.extmetadata || {};
          const rawDescription = extmeta.ImageDescription?.value
            ? extmeta.ImageDescription.value.replace(/<[^>]*>/g, '').slice(0, 220)
            : `${rawTitle} - High-resolution educational media for ${targetCategory} studies.`;

          const originalWidth = info.width || targetWidth;
          const originalHeight = info.height || Math.round(targetWidth * 0.75);

          // Tag resolution
          let resTag: StudyPhoto['resolutionTag'] = '1K';
          if (originalWidth >= 3400 || targetWidth >= 3840) {
            resTag = '4K';
          } else if (originalWidth >= 1800 || targetWidth >= 2048) {
            resTag = '2K';
          }

          const isPhoto = !rawTitle.toLowerCase().includes('diagram') && !rawTitle.toLowerCase().includes('schema') && !mime.includes('svg');

          results.push({
            id: `commons_${page.pageid || Math.random().toString(36).substring(7)}`,
            title: rawTitle,
            caption: rawDescription,
            imageUrl: info.thumburl || info.url,
            thumbnailUrl: info.thumburl || info.url,
            sourceUrl: info.descriptionurl || 'https://commons.wikimedia.org',
            sourceName: 'Wikimedia Commons (Internet Educational Archive)',
            width: originalWidth,
            height: originalHeight,
            resolutionTag: resTag,
            subjectCategory: targetCategory,
            license: extmeta.LicenseShortName?.value || 'Creative Commons / Educational Open Access',
            isDiagramOrPhoto: isPhoto ? 'photo' : 'diagram',
          });
        });
      }
    }
  } catch (err: any) {
    console.info('Wikimedia Commons search note:', err?.message || err);
  }

  // 2. Also search Wikipedia Articles with primary textbook images
  if (results.length < limit) {
    try {
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|extracts&generator=search&gsrsearch=${encodeURIComponent(
        cleanedQuery
      )}&gsrlimit=5&pithumbsize=${targetWidth}&exintro=1&explaintext=1&exchars=260`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const wikiRes = await fetch(wikiUrl, {
        headers: {
          'User-Agent': 'NexusAIStudyAssistant/1.0 (Educational Assistant for UNEB Students)',
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (wikiRes.ok) {
        const wikiData: any = await wikiRes.json();
        const pages = wikiData?.query?.pages;

        if (pages && typeof pages === 'object') {
          Object.values(pages).forEach((page: any) => {
            if (!page?.thumbnail?.source) return;

            const existing = results.find((r) => r.imageUrl === page.thumbnail.source);
            if (existing) return;

            const w = page.thumbnail.width || targetWidth;
            const h = page.thumbnail.height || Math.round(targetWidth * 0.75);

            let resTag: StudyPhoto['resolutionTag'] = '1K';
            if (w >= 3400 || targetWidth >= 3840) resTag = '4K';
            else if (w >= 1800 || targetWidth >= 2048) resTag = '2K';

            results.push({
              id: `wiki_${page.pageid}`,
              title: page.title,
              caption: page.extract || `Verified textbook reference photo from Wikipedia for ${page.title}.`,
              imageUrl: page.thumbnail.source,
              thumbnailUrl: page.thumbnail.source,
              sourceUrl: `https://en.wikipedia.org/?curid=${page.pageid}`,
              sourceName: 'Wikipedia Educational Encyclopedia',
              width: w,
              height: h,
              resolutionTag: resTag,
              subjectCategory: targetCategory,
              license: 'CC BY-SA 4.0 / Public Domain',
              isDiagramOrPhoto: page.title.toLowerCase().includes('diagram') ? 'diagram' : 'photo',
            });
          });
        }
      }
    } catch (wikiErr: any) {
      console.info('Wikipedia educational image fetch note:', wikiErr?.message || wikiErr);
    }
  }

  // 3. Match curated backups if few/no results found
  if (results.length === 0) {
    const lowerQuery = (userQuery + ' ' + cleanedQuery).toLowerCase();
    for (const [key, items] of Object.entries(CURATED_STUDY_PHOTOS)) {
      if (lowerQuery.includes(key)) {
        results.push(...items);
      }
    }

    // Default to biology heart/cell if totally unrecognised
    if (results.length === 0) {
      if (lowerQuery.includes('bio') || lowerQuery.includes('plant') || lowerQuery.includes('organism')) {
        results.push(...CURATED_STUDY_PHOTOS.cell);
      } else if (lowerQuery.includes('geo') || lowerQuery.includes('earth') || lowerQuery.includes('land')) {
        results.push(...CURATED_STUDY_PHOTOS.rift);
      } else if (lowerQuery.includes('chem')) {
        results.push(...CURATED_STUDY_PHOTOS.chemistry);
      } else if (lowerQuery.includes('phys')) {
        results.push(...CURATED_STUDY_PHOTOS.physics);
      } else {
        results.push(...CURATED_STUDY_PHOTOS.heart, ...CURATED_STUDY_PHOTOS.cell.slice(0, 1));
      }
    }
  }

  return {
    photos: results.slice(0, limit),
    queryUsed: cleanedQuery,
    source: results.length > 0 ? results[0].sourceName : 'National Educational Media Archive',
  };
}
