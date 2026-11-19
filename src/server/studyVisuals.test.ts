import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanStudyPhotoQuery } from './studyPhotosService';
import { generateUNEBDiagramSVG, getTargetPixelDimensions } from './diagramGenerator';

test('cleanStudyPhotoQuery extracts accurate search terms from student prompts', () => {
  assert.equal(
    cleanStudyPhotoQuery('Show me a 4K photo of human heart four chambers'),
    'human heart four chambers'
  );
  assert.equal(
    cleanStudyPhotoQuery('Detailed UNEB textbook diagram illustrating: Integrated Science: The Human Circulatory System & Blood Functions'),
    'Integrated Science Human Circulatory Blood'
  );
  assert.equal(
    cleanStudyPhotoQuery('Photo of Mount Rwenzori glaciers and vegetation'),
    'Mount Rwenzori glaciers vegetation'
  );
});

test('getTargetPixelDimensions scales accurately for 1K, 2K, and 4K resolutions', () => {
  assert.deepEqual(getTargetPixelDimensions('1K', '16:9'), { width: 1280, height: 720 });
  assert.deepEqual(getTargetPixelDimensions('2K', '16:9'), { width: 2560, height: 1440 });
  assert.deepEqual(getTargetPixelDimensions('4K', '16:9'), { width: 3840, height: 2160 });

  assert.deepEqual(getTargetPixelDimensions('1K', '4:3'), { width: 1024, height: 768 });
  assert.deepEqual(getTargetPixelDimensions('4K', '4:3'), { width: 3840, height: 2880 });

  assert.deepEqual(getTargetPixelDimensions('2K', '1:1'), { width: 2048, height: 2048 });
  assert.deepEqual(getTargetPixelDimensions('4K', '1:1'), { width: 3840, height: 3840 });
});

test('generateUNEBDiagramSVG routes topics accurately and enforces 1K/2K/4K SVG pixel attributes', () => {
  const leafDiagram = generateUNEBDiagramSVG('photosynthesis light reaction in leaf', '4K', '16:9');
  assert.match(leafDiagram.description, /Photosynthesis|Leaf/i);
  assert.match(leafDiagram.svg, /width="3840" height="2160"/);

  const cellDiagram = generateUNEBDiagramSVG('plant cell with chloroplasts', '2K', '4:3');
  assert.match(cellDiagram.description, /plant cell/i);
  assert.match(cellDiagram.svg, /width="2048" height="1536"/);

  const heartDiagram = generateUNEBDiagramSVG('human heart 4 chambers', '1K', '16:9');
  assert.match(heartDiagram.description, /heart/i);
  assert.match(heartDiagram.svg, /width="1280" height="720"/);
});
