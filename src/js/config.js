/* ═══════════════════════════════════════════════════════════
   SOUL BLUEPRINT MATRIX - CONFIGURATION & METADATA
   Module: src/js/config.js
═══════════════════════════════════════════════════════════ */

// Global interpretation store: INTERP[position][module][section][number] = "text"
const INTERP = {};

// Track which modules & sections exist (dynamically discovered from CSV)
const DISCOVERED_MODULES = {}; // { moduleId: { label, sections: [{key, title}] } }

const MODULE_LABELS = {
  core:             ' Core',
  relationships:    ' Love',
  karma:            ' Karma',
  money:            '$ Money',
  purpose:          ' Purpose',
  forecast:         '◎ Forecast',
  compatibility:    ' Compatibility',
  compat_general:   ' General',
  compat_love:      ' Love Dynamics',
  compat_karma:     ' Relationship Karma',
  compat_finance:   '$ Shared Finance',
  compat_programs:  ' Compatibility Programs',
  compat_forecast:  '◎ Couple Forecast',
};

// Fallback section titles for known section keys
const SECTION_TITLES = {
  relationship_problems: 'Relationship Problems',
  nature_of_the_relationship: 'Nature of the Relationship',
  meaning:          'What This Position Means',
  positive:         'Positive Expression',
  shadow:           'Shadow Expression',
  healing:          'Healing Path',
  attraction:       'Attraction Pattern',
  lesson:           'Relationship Lesson',
  wound:            'Core Wound',
  partner:          'What They Attract',
  karmic:           'Karmic Pattern',
  past_life:        'Past Life Theme',
  resolution:       'Resolution Path',
  money_flow:       'Money Flow',
  block:            'Financial Block',
  activation:       'Activation',
  life_purpose:     'Life Purpose',
  gifts:            'Natural Gifts',
  mission:          'Soul Mission',
  current_cycle:    'Current Cycle',
  next_phase:       'Next Phase',
  yearly:           'Yearly Theme',
  theme:            'Energy of the Period',
  recommendations:  'Event Line',
  watch_out:        'Outcome of the Period',
};



// ═══════════════════════════════════════════════════════════════════
// POSITION METADATA
// ═══════════════════════════════════════════════════════════════════
const POSITIONS = {
  // Core Personal Square
  A:  {name:'Portrait / Personal Karma',    formula:'Day of Birth',            zone:'Personal Karma', color:'#B088F0'},
  A1: {name:'Soul Task for Children',       formula:'A + A2',                  zone:'Family Karma',   color:'#C0D4FF'},
  A2: {name:'Parent-Child Karma',           formula:'A + E',                   zone:'Family Karma',   color:'#E060B0'},

  B:  {name:'Spiritual Talent / Essence',   formula:'Month of Birth',          zone:'Spiritual Talent',color:'#D4AF6E'},
  B1: {name:'Personal Talent from Birth',   formula:'B + B2',                  zone:'Spiritual Talent',color:'#C0D4FF'},
  B2: {name:'Self-Realization / Profession',formula:'B + E',                   zone:'Self Realization',color:'#5CDEC8'},

  C:  {name:'Material Karma / Year Task',   formula:'Year Digit Sum',          zone:'Material Karma',  color:'#E060B0'},
  C1: {name:'Earning Experience Field',     formula:'C + K',                   zone:'Material Karma',  color:'#D4CCFF'},
  K:  {name:'Entry to Finance Line',        formula:'C + E',                   zone:'Money Channel',   color:'#5CDEC8'},

  D:  {name:'Spiritual Karma / Social Task',formula:'A + B + C',               zone:'Spiritual Karma', color:'#D4AF6E'},
  D1: {name:'Subconscious Fears',           formula:'D + J',                   zone:'Karmic Tail',     color:'#FFD080'},
  J:  {name:'Subconscious Block / Entry',   formula:'D + E',                   zone:'Relationships',   color:'#5CDEC8'},

  E:  {name:'Soul Comfort Zone / Center',   formula:'A + B + C + D',           zone:'Core Center',     color:'#FFD97D'},

  // Lineage Lines (Ancestral Square)
  F:  {name:"Father's Male Line",           formula:'A + B',                   zone:'Lineage',        color:'#D4CCFF'},
  F1: {name:"Father's Male Line Upper Gift", formula:'F + F2',                 zone:'Lineage',        color:'#D4CCFF'},
  F2: {name:"Father's Male Line Talent",    formula:'F + L2',                  zone:'Lineage',        color:'#D4CCFF'},

  G:  {name:"Father's Female Line",         formula:'B + C',                   zone:'Lineage',        color:'#D4CCFF'},
  G1: {name:"Father's Female Line Upper Gift",formula:'G + G2',                zone:'Lineage',        color:'#D4CCFF'},
  G2: {name:"Father's Female Line Talent",  formula:'G + L2',                  zone:'Lineage',        color:'#D4CCFF'},

  H:  {name:"Mother's Male Line",           formula:'C + D',                   zone:'Lineage',        color:'#D4CCFF'},
  H1: {name:"Mother's Male Line Character", formula:'H + H2',                  zone:'Lineage',        color:'#D4CCFF'},
  H2: {name:"Mother's Male Line Karma",     formula:'H + L2',                  zone:'Lineage',        color:'#D4CCFF'},

  I:  {name:"Mother's Female Line",         formula:'D + A',                   zone:'Lineage',        color:'#D4CCFF'},
  I1: {name:"Mother's Female Line Character",formula:'I + I2',                 zone:'Lineage',        color:'#D4CCFF'},
  I2: {name:"Mother's Female Line Karma",   formula:'I + L2',                  zone:'Lineage',        color:'#D4CCFF'},
  L2: {name:'Lineage Combined',             formula:'F + G + H + I',           zone:'Lineage',        color:'#D4CCFF'},

  // Channels
  L:  {name:'Central Balance Point',        formula:'K + J',                   zone:'Money & Love',   color:'#FFD97D'},
  M:  {name:'Ideal Partner / Meeting Place',formula:'J + L',                   zone:'Relationships',  color:'#C0D4FF'},
  N:  {name:'Suitable Niche / Profession',  formula:'K + L',                   zone:'Money Channel',  color:'#E060B0'},
  R:  {name:'Relationship Gateway Code',    formula:'M + L',                   zone:'Relationships',  color:'#D4AF6E'},
  R1: {name:'Relationship Dynamics',        formula:'R + M',                   zone:'Relationships',  color:'#D4AF6E'},
  R2: {name:'Profession / Financial Success',formula:'R + L',                zone:'Money Channel',  color:'#5CDEC8'},

  // Emotional Feelings (Chapter 3.7)
  O:  {name:'Material Emotional Closeness', formula:'A2 + E',                  zone:'Heart & Feelings',color:'#E060B0'},
  P:  {name:'Spiritual Emotional Closeness',formula:'B2 + E',                  zone:'Heart & Feelings',color:'#5CDEC8'},
  OP: {name:'Emotional Closeness Synthesis',formula:'O + P',                   zone:'Heart & Feelings',color:'#FFD97D'},

  // Soul Potentials
  U1: {name:'Higher Soul Potential 1',      formula:'A + B',                   zone:'Soul Potential', color:'#B088F0'},
  U2: {name:'Higher Soul Potential 2',      formula:'C + D',                   zone:'Soul Potential', color:'#B088F0'},
  U3: {name:'Combined Soul Synthesis',      formula:'U1 + U2',                 zone:'Soul Potential', color:'#D4AAFF'},

  FORECAST_CURRENT: {name:'Energy of the Period', formula:'Arcana of Current Age', zone:'forecast', color:'#A78BFA'},
  FORECAST_KEY: {name:'Event Line', formula:'Arcana of Second Age', zone:'forecast', color:'#A78BFA'},
  FORECAST_OUTCOME: {name:'Outcome of the Period', formula:'Current Energy + Key Energy', zone:'forecast', color:'#A78BFA'},
  
  COMPAT_FORECAST_CURRENT: {name:"Couple Energy of the Period", formula:'Partner 1 Current + Partner 2 Current', zone:'compat_forecast', color:'#D4AF6E'},
  COMPAT_FORECAST_KEY: {name:"Couple Event Line", formula:'Partner 1 Key + Partner 2 Key', zone:'compat_forecast', color:'#D4AF6E'},
  COMPAT_FORECAST_OUTCOME: {name:"Couple Outcome of the Period", formula:'Partner 1 Outcome + Partner 2 Outcome', zone:'compat_forecast', color:'#D4AF6E'},
};

// Populate the 56 intermediate age nodes dynamically
(() => {
  const sectorCorners = [
    ['A', 'F'], ['F', 'B'], ['B', 'G'], ['G', 'C'],
    ['C', 'H'], ['H', 'D'], ['D', 'I'], ['I', 'A']
  ];
  sectorCorners.forEach(([c1, c2], sectorIdx) => {
    const startAge = sectorIdx * 10;
    const offsets = [1.25, 2.5, 3.75, 5, 6.25, 7.5, 8.75];
    
    const getRangeLabel = (S, offset) => {
      if (offset === 1.25) return `${S+1}-${S+2},5`;
      if (offset === 2.5) return `${S+2},5-${S+3},5`;
      if (offset === 3.75) return `${S+3},5-${S+5}`;
      if (offset === 5) return `${S+5} years old`;
      if (offset === 6.25) return `${S+6}-${S+7},5`;
      if (offset === 7.5) return `${S+7},5-${S+8},5`;
      if (offset === 8.75) return `${S+8},5-${S+10}`;
      return '';
    };
    
    const getFormula = (offset) => {
      if (offset === 5) return `red(${c1} + ${c2})`;
      if (offset === 2.5) return `red(${c1} + Age${startAge+5})`;
      if (offset === 7.5) return `red(Age${startAge+5} + ${c2})`;
      if (offset === 1.25) return `red(${c1} + Age${startAge+2.5})`;
      if (offset === 3.75) return `red(Age${startAge+2.5} + Age${startAge+5})`;
      if (offset === 6.25) return `red(Age${startAge+5} + Age${startAge+7.5})`;
      if (offset === 8.75) return `red(Age${startAge+7.5} + ${c2})`;
      return '';
    };

    offsets.forEach(offset => {
      const ageKey = `age${startAge + offset}`;
      const rangeLabel = getRangeLabel(startAge, offset);
      POSITIONS[ageKey] = {
        name: `Age Node ${startAge + offset} (${rangeLabel})`,
        formula: getFormula(offset),
        zone: 'forecast',
        color: '#A78BFA'
      };
    });
  });
})();

// ═══════════════════════════════════════════════════════════════════
// CALCULATION ENGINE



const MATRIX_TRIPLETS = [
  { key: 'M-N-D', label: 'Karmic Tail', nodes: ['M', 'N', 'D'] },
  { key: 'L2-L1-L', label: 'Relationship / Sacral Line', nodes: ['L2', 'L1', 'L'] },
  { key: 'R-R1-R2', label: 'Money & Wealth Line', nodes: ['R', 'R1', 'R2'] },
  { key: 'A-J-E', label: 'Personal Talent Line', nodes: ['A', 'J', 'E'] },
  { key: 'B-K-E', label: 'Mind & Communication Line', nodes: ['B', 'K', 'E'] },
  { key: 'C-L-E', label: 'Physical Root Line', nodes: ['C', 'L', 'E'] },
  { key: 'D-M-E', label: 'Ancestral Earth Line', nodes: ['D', 'M', 'E'] },
  { key: 'F-F1-F2', label: "Father's Male Line", nodes: ['F', 'F1', 'F2'] },
  { key: 'G-G1-G2', label: "Father's Female Line", nodes: ['G', 'G1', 'G2'] },
  { key: 'H-H1-H2', label: "Mother's Male Line", nodes: ['H', 'H1', 'H2'] },
  { key: 'I-I1-I2', label: "Mother's Female Line", nodes: ['I', 'I1', 'I2'] },
  { key: 'A-O-P', label: 'Ajna / Third Eye Zone', nodes: ['A', 'O', 'P'] },
  { key: 'J-S-T', label: 'Heart & Expression Zone', nodes: ['J', 'S', 'T'] }
];
