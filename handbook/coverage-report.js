const fs = require('fs');
const path = require('path');
const vm = require('vm');
const studyLayer = require('./study-layer.js');

const repoRoot = path.resolve(__dirname, '..');
const reportPath = path.join(repoRoot, 'COVERAGE.md');

function readRepoFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function loadFormulaData() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(readRepoFile('handbook/formula-data.js'), sandbox, { filename: 'formula-data.js' });
  return {
    cards: sandbox.window.FORMULA_CARDS || [],
    groups: sandbox.window.FORMULA_GROUPS || [],
    references: sandbox.window.FORMULA_SOURCE_REFERENCES || []
  };
}

function countBy(items, keySelector) {
  const result = new Map();
  for (const item of items) {
    const key = keySelector(item);
    result.set(key, (result.get(key) || 0) + 1);
  }
  return result;
}

function sortedEntries(map, order = []) {
  const priority = new Map(order.map((item, index) => [item, index]));
  return [...map.entries()].sort(([leftKey, leftValue], [rightKey, rightValue]) => {
    const leftPriority = priority.has(leftKey) ? priority.get(leftKey) : Number.MAX_SAFE_INTEGER;
    const rightPriority = priority.has(rightKey) ? priority.get(rightKey) : Number.MAX_SAFE_INTEGER;
    if (leftPriority !== rightPriority) return leftPriority - rightPriority;
    if (rightValue !== leftValue) return rightValue - leftValue;
    return String(leftKey).localeCompare(String(rightKey), 'zh-Hans-CN');
  });
}

function percentile(sortedValues, ratio) {
  if (!sortedValues.length) return 0;
  const index = Math.min(sortedValues.length - 1, Math.floor(sortedValues.length * ratio));
  return sortedValues[index];
}

function summarizeNumbers(values) {
  const sortedValues = [...values].sort((left, right) => left - right);
  const total = sortedValues.reduce((sum, value) => sum + value, 0);
  return {
    min: sortedValues[0] || 0,
    p05: percentile(sortedValues, 0.05),
    median: percentile(sortedValues, 0.5),
    avg: sortedValues.length ? Number((total / sortedValues.length).toFixed(1)) : 0
  };
}

function markdownCell(value) {
  return String(value ?? '')
    .split('|').join('\\|')
    .split(String.fromCharCode(13)).join('')
    .split(String.fromCharCode(10)).join('<br>');
}

function markdownTable(headers, rows) {
  return [
    `| ${headers.map(markdownCell).join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map(markdownCell).join(' | ')} |`)
  ].join(String.fromCharCode(10));
}

function chapterKey(card) {
  return `${card.subject} :: ${card.chapter}`;
}

function fieldLength(card, field) {
  return String(card[field] || '').trim().length;
}

function buildReport() {
  const { cards, groups, references } = loadFormulaData();
  const errors = [];
  const fieldNames = ['conditions', 'intuition', 'howToUse', 'miniProof', 'example', 'mistakes'];
  const minimumDepthScore = 110;
  const importanceOrder = ['必背', '常用', '技巧', '了解', '拓展'];
  const requiredSubjects = ['前置基础', '高等数学', '线性代数', '概率论', '冷门技巧', '附录速查'];
  const expectedChapterMinimums = new Map([
    ['高等数学', 12],
    ['线性代数', 6],
    ['概率论', 8]
  ]);
  const requiredLabTypes = [
    'equivalent-compare',
    'taylor-order-lab',
    'trig-transform-lab',
    'integral-method-picker',
    'matrix-eigen-lab',
    'probability-distribution-lab',
    'wallis-recursion',
    'unit-circle',
    'distribution-plot',
    'clt-demo',
    'riemann-sum'
  ];

  const subjects = countBy(cards, (card) => card.subject);
  const chapters = new Map();
  for (const card of cards) {
    const key = chapterKey(card);
    if (!chapters.has(key)) {
      chapters.set(key, {
        subject: card.subject,
        chapter: card.chapter,
        sections: new Set(),
        cards: [],
        interactive: 0,
        missingFields: 0,
        shortFields: 0
      });
    }
    const chapter = chapters.get(key);
    chapter.sections.add(card.section);
    chapter.cards.push(card);
    if (card.interactiveType && card.interactiveType !== 'none') chapter.interactive += 1;
    if (fieldNames.some((field) => fieldLength(card, field) === 0)) chapter.missingFields += 1;
    if (fieldNames.some((field) => fieldLength(card, field) < 18)) chapter.shortFields += 1;
  }

  if (cards.length < 490) errors.push(`Expected at least 490 cards, got ${cards.length}`);
  for (const subject of requiredSubjects) {
    if (!subjects.has(subject)) errors.push(`Missing required subject: ${subject}`);
  }
  for (const [subject, minimum] of expectedChapterMinimums.entries()) {
    const chapterCount = [...chapters.values()].filter((chapter) => chapter.subject === subject).length;
    if (chapterCount < minimum) errors.push(`${subject} should have at least ${minimum} chapters, got ${chapterCount}`);
  }

  const importanceCounts = countBy(cards, (card) => card.importance || '未标注');
  const interactiveCards = cards.filter((card) => card.interactiveType && card.interactiveType !== 'none');
  const interactiveCounts = countBy(interactiveCards, (card) => card.interactiveType);
  if (interactiveCards.length < 160) errors.push(`Expected at least 160 interactive card bindings, got ${interactiveCards.length}`);
  for (const type of requiredLabTypes) {
    if (!interactiveCounts.has(type)) errors.push(`Missing required interactive lab type: ${type}`);
  }

  let studyFailureCount = 0;
  const studyKinds = new Map();
  for (const card of cards) {
    const study = studyLayer.buildStudyLayer(card);
    studyKinds.set(study.kind, (studyKinds.get(study.kind) || 0) + 1);
    const validStudy = study.proofCore && study.proofCore.length >= 60
      && Array.isArray(study.proofSteps) && study.proofSteps.length >= 4
      && Array.isArray(study.triggers) && study.triggers.length >= 2
      && Array.isArray(study.examSteps) && study.examSteps.length >= 5
      && Array.isArray(study.exampleSolution) && study.exampleSolution.length >= 3
      && Array.isArray(study.checklist) && study.checklist.length >= 3;
    if (!validStudy) studyFailureCount += 1;
  }
  if (studyFailureCount) errors.push(`Study layer incomplete for ${studyFailureCount} cards`);

  const fieldRows = fieldNames.map((field) => {
    const lengths = cards.map((card) => fieldLength(card, field));
    const summary = summarizeNumbers(lengths);
    return [
      field,
      summary.min,
      summary.p05,
      summary.median,
      summary.avg,
      lengths.filter((length) => length < 18).length,
      lengths.filter((length) => length === 0).length
    ];
  });

  const chapterRows = [...chapters.values()].map((chapter) => {
    const importanceInChapter = countBy(chapter.cards, (card) => card.importance || '未标注');
    return [
      chapter.subject,
      chapter.chapter,
      chapter.cards.length,
      chapter.sections.size,
      importanceInChapter.get('必背') || 0,
      importanceInChapter.get('常用') || 0,
      importanceInChapter.get('技巧') || 0,
      chapter.interactive,
      chapter.shortFields
    ];
  }).sort((left, right) => String(left[0]).localeCompare(String(right[0]), 'zh-Hans-CN') || String(left[1]).localeCompare(String(right[1]), 'zh-Hans-CN'));

  const subjectRows = sortedEntries(subjects, requiredSubjects).map(([subject, count]) => {
    const subjectChapters = [...chapters.values()].filter((chapter) => chapter.subject === subject);
    const subjectInteractive = subjectChapters.reduce((sum, chapter) => sum + chapter.interactive, 0);
    const subjectSections = new Set(subjectChapters.flatMap((chapter) => [...chapter.sections]));
    return [subject, subjectChapters.length, subjectSections.size, count, subjectInteractive];
  });

  const interactiveRows = sortedEntries(interactiveCounts).map(([type, count]) => {
    const samples = interactiveCards
      .filter((card) => card.interactiveType === type)
      .slice(0, 3)
      .map((card) => card.title)
      .join(' / ');
    return [type, count, samples];
  });

  const depthEntries = cards
    .map((card) => ({
      card,
      total: fieldNames.reduce((sum, field) => sum + Math.min(fieldLength(card, field), 120), 0),
      shortFields: fieldNames.filter((field) => fieldLength(card, field) < 18)
    }))
    .sort((left, right) => left.total - right.total);
  const minDepthScore = depthEntries[0]?.total || 0;
  if (minDepthScore < minimumDepthScore) {
    errors.push(`Minimum card depth score should be at least ${minimumDepthScore}, got ${minDepthScore} (${depthEntries[0]?.card.id})`);
  }

  const shortestCards = depthEntries
    .slice(0, 20)
    .map((entry) => [
      entry.card.id,
      entry.card.subject,
      entry.card.chapter,
      entry.card.title,
      entry.total,
      entry.shortFields.join(', ') || '-'
    ]);

  const newline = String.fromCharCode(10);
  const report = [
    '# Content Coverage Report',
    '',
    '> Generated by `node handbook/coverage-report.js`. Do not edit this file by hand.',
    '',
    '## Baseline',
    '',
    markdownTable(
      ['Metric', 'Value'],
      [
        ['Formula cards', cards.length],
        ['Subjects', subjects.size],
        ['Chapters', chapters.size],
        ['Source references', references.length],
        ['Formula groups', groups.length],
        ['Interactive card bindings', interactiveCards.length],
        ['Interactive lab types', interactiveCounts.size],
        ['Study layer failures', studyFailureCount],
        ['Minimum card depth score', minDepthScore],
        ['Minimum depth gate', minimumDepthScore]
      ]
    ),
    '',
    '## Subject Coverage',
    '',
    markdownTable(['Subject', 'Chapters', 'Sections', 'Cards', 'Interactive bindings'], subjectRows),
    '',
    '## Importance Distribution',
    '',
    markdownTable(['Importance', 'Cards'], sortedEntries(importanceCounts, importanceOrder)),
    '',
    '## Subject And Chapter Coverage',
    '',
    markdownTable(['Subject', 'Chapter', 'Cards', 'Sections', 'Must', 'Common', 'Trick', 'Interactive', 'Short-field cards'], chapterRows),
    '',
    '## Interactive Lab Coverage',
    '',
    markdownTable(['interactiveType', 'Cards', 'Sample cards'], interactiveRows),
    '',
    '## Study Layer Coverage',
    '',
    markdownTable(['Study kind', 'Cards'], sortedEntries(studyKinds)),
    '',
    '## Field Depth Snapshot',
    '',
    markdownTable(['Field', 'Min', 'P05', 'Median', 'Average', 'Cards < 18 chars', 'Missing'], fieldRows),
    '',
    '## Review Targets',
    '',
    'These are the shortest cards by combined study-field length. They are not necessarily wrong, but they are the first candidates when expanding proofs, examples, or mistake notes.',
    '',
    markdownTable(['Card ID', 'Subject', 'Chapter', 'Title', 'Depth score', 'Short fields'], shortestCards),
    '',
    '## Gate Result',
    '',
    errors.length ? errors.map((error) => `- FAIL: ${error}`).join(newline) : '- PASS: coverage gate satisfied.',
    ''
  ].join(newline);

  fs.writeFileSync(reportPath, report, 'utf8');

  if (errors.length) {
    console.error(errors.join(newline));
    process.exit(1);
  }

  console.log(`coverage-ok cards=${cards.length} chapters=${chapters.size} interactive=${interactiveCards.length} report=COVERAGE.md`);
}

buildReport();
