/* ═══════════════════════════════════════════════════════════
   SOUL BLUEPRINT MATRIX - DUAL DATABASE & REALTIME SYNC
   Module: src/js/db_sync.js
═══════════════════════════════════════════════════════════ */

const bc = new BroadcastChannel('soul_matrix_sync');

/**
 * Parse a CSV file that may contain quoted fields with commas and newlines inside them.
 * Returns array of objects using first row as header keys.
 */
function parseCSV(text) {
  const rows = [];
  let cur = '';
  let inQuotes = false;
  let lineFields = [];
  
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const nextCh = text[i + 1];
    
    if (ch === '"') {
      if (inQuotes && nextCh === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      lineFields.push(cur);
      cur = '';
    } else if ((ch === '\r' || ch === '\n') && !inQuotes) {
      if (ch === '\r' && nextCh === '\n') {
        i++;
      }
      lineFields.push(cur);
      cur = '';
      if (lineFields.length > 0 && (lineFields.length > 1 || lineFields[0] !== '')) {
        rows.push(lineFields);
      }
      lineFields = [];
    } else {
      cur += ch;
    }
  }
  
  if (cur !== '' || lineFields.length > 0) {
    lineFields.push(cur);
    rows.push(lineFields);
  }
  
  if (rows.length === 0) return [];
  
  const headers = rows[0].map(h => h.trim());
  const result = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 1 && row[0] === '') continue;
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = row[idx] !== undefined ? row[idx] : '';
    });
    result.push(obj);
  }
  return result;
}

/**
 * Load and parse interpretations.csv, populate INTERP and DISCOVERED_MODULES.
 */
function processCSVText(text) {
  const rows = parseCSV(text);
  
  for (const key in INTERP) delete INTERP[key];
  for (const key in DISCOVERED_MODULES) delete DISCOVERED_MODULES[key];

  let count = 0;
  rows.forEach(row => {
    const pos    = (row.position || '').trim();
    const module = (row.module   || '').trim();
    const section= (row.section  || '').trim();
    const numStr = (row.number   || '').trim();
    const number = numStr.includes('-') ? numStr : parseInt(numStr, 10);
    const textVal= (row.text     || '').trim();

    if (!pos || !module || !section || (typeof number === 'number' && isNaN(number))) return;

    if (!INTERP[pos])                INTERP[pos] = {};
    if (!INTERP[pos][module])        INTERP[pos][module] = {};
    if (!INTERP[pos][module][section]) INTERP[pos][module][section] = {};
    INTERP[pos][module][section][number] = textVal;

    if (!DISCOVERED_MODULES[module]) {
      DISCOVERED_MODULES[module] = {
        id: module,
        label: MODULE_LABELS[module] || ('◆ ' + module.charAt(0).toUpperCase() + module.slice(1)),
        sections: []
      };
    }
    const mod = DISCOVERED_MODULES[module];
    if (!mod.sections.find(s => s.key === section)) {
      mod.sections.push({
        key: section,
        title: SECTION_TITLES[section] || section.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      });
    }
    count++;
  });
  
  return count;
}

let statusHideTimeout = null;

// ═══════════════════════════════════════════════════════════════════
// DUAL DATABASE MODE  (LIVE = interpretations.csv,  Deep Dive = interpretations_deep.csv)
// ═══════════════════════════════════════════════════════════════════
let dbMode = 'live'; // 'live' | 'deep'
const DB_FILES = {
  live: '../data/interpretations.csv',
  deep: '../data/interpretations_deep.csv'
};
const DB_CACHE_KEYS = {
  live: 'soul_matrix_csv_content',
  deep: 'soul_matrix_csv_deep_content'
};
const DB_LABELS = {
  live: '⚡ LIVE Mode',
  deep: '🔮 Deep Dive'
};

async function loadCSV(mode) {
  mode = mode || dbMode;
  let file = DB_FILES[mode];
  const cacheKey = DB_CACHE_KEYS[mode];
  const label = DB_LABELS[mode];

  updateStatus(`⟳ Loading ${label} interpretation data...`, 'loading', false);

  try {
    let response = await fetch(file);
    if (!response.ok && file.startsWith('../')) {
      const altFile = file.replace('../', '');
      const altResponse = await fetch(altFile);
      if (altResponse.ok) response = altResponse;
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const count = processCSVText(text);
    
    localStorage.setItem(cacheKey, text);

    updateStatus(` ${label}  ·  Loaded ${count} interpretations  ·  ${Object.keys(INTERP).length} positions covered`, 'ok', true);

  } catch (err) {
    console.warn(`Failed to fetch ${file} automatically:`, err);
    
    const cachedText = localStorage.getItem(cacheKey);
    if (cachedText) {
      try {
        const count = processCSVText(cachedText);
        updateStatus(` ${label} — ${count} interpretations from local cache. Click "Load CSV" to refresh.`, 'ok', true);
      } catch (cacheErr) {
        updateStatus(` CORS Blocked & cache corrupt. Please click "Load CSV" to select ${file} manually.`, 'error', false);
      }
    } else {
      // For Deep Dive, quietly fall back to LIVE mode if the deep file doesn't exist yet
      if (mode === 'deep') {
        updateStatus(' Deep Dive database not found — staying on LIVE mode. Add interpretations_deep.csv to use this.', 'loading', true);
        dbMode = 'live';
        updateDbModeButton();
        return;
      }
      updateStatus(` Browser security blocked loading ${file}. Please click "Load CSV" to select it manually.`, 'error', false);
    }
  }
}

function updateDbModeButton() {
  const btn = document.getElementById('db-mode-btn');
  if (!btn) return;
  btn.textContent = DB_LABELS[dbMode];
  btn.title = dbMode === 'live'
    ? 'Currently in LIVE Mode (short, session-ready). Click to switch to Deep Dive (full detail).'
    : 'Currently in Deep Dive Mode (full detail). Click to switch back to LIVE Mode.';
  btn.classList.toggle('deep', dbMode === 'deep');
}

document.getElementById('db-mode-btn').addEventListener('click', async () => {
  dbMode = (dbMode === 'live') ? 'deep' : 'live';
  updateDbModeButton();
  await loadCSV(dbMode);
  // Re-run current calculation so panel updates
  if (readingMode === 'single') {
    document.getElementById('go-btn').click();
  } else {
    document.getElementById('go-compat-btn').click();
  }
});

function updateStatus(text, type, autoHide = true) {
  const statusEl = document.getElementById('data-status');
  const statusBtn = document.getElementById('status-info-btn');
  if (!statusEl) return;

  statusEl.textContent = text;
  statusEl.className = type;
  statusEl.classList.remove('hidden');

  if (statusBtn) {
    statusBtn.title = `Database Status: ${text}`;
  }

  if (statusHideTimeout) {
    clearTimeout(statusHideTimeout);
    statusHideTimeout = null;
  }

  if (autoHide) {
    statusHideTimeout = setTimeout(() => {
      statusEl.classList.add('hidden');
    }, 5000);
  }
}

document.getElementById('status-info-btn').addEventListener('click', () => {
  const statusEl = document.getElementById('data-status');
  if (!statusEl) return;
  if (statusEl.classList.contains('hidden')) {
    const currentType = statusEl.classList.contains('ok') ? 'ok' : (statusEl.classList.contains('error') ? 'error' : 'loading');
    updateStatus(statusEl.textContent, currentType, true);
  } else {
    statusEl.classList.add('hidden');
  }
});





// ═══════════════════════════════════════════════════════════════════
// MANUAL CSV IMPORT
// ═══════════════════════════════════════════════════════════════════
document.getElementById('import-csv-btn').addEventListener('click', () => {
  document.getElementById('csv-file-picker').click();
});

document.getElementById('csv-file-picker').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    const text = evt.target.result;
    try {
      const count = processCSVText(text);
      localStorage.setItem('soul_matrix_csv_content', text);
      updateStatus(` Loaded ${count} interpretations from uploaded CSV  ·  ${Object.keys(INTERP).length} positions covered`, 'ok', true);
      
      // Force calculation update
      document.getElementById('go-btn').click();
    } catch (err) {
      alert('Error parsing CSV: ' + err.message);
    }
  };
  reader.readAsText(file);
});



function broadcastSyncData() {
  let name, day, mon, yr;
  
  if (readingMode === 'single') {
    name = document.getElementById('i-name').value.trim() || 'Client';
    day  = parseInt(document.getElementById('i-day').value)  || 1;
    mon  = parseInt(document.getElementById('i-mon').value)  || 1;
    yr   = parseInt(document.getElementById('i-yr').value)   || 2000;
  } else {
    const name1 = document.getElementById('i-name1').value.trim() || 'Partner 1';
    const day1  = parseInt(document.getElementById('i-day1').value)  || 1;
    const mon1  = parseInt(document.getElementById('i-mon1').value)  || 1;
    const yr1   = parseInt(document.getElementById('i-yr1').value)   || 2000;
    
    const name2 = document.getElementById('i-name2').value.trim() || 'Partner 2';
    const day2  = parseInt(document.getElementById('i-day2').value)  || 1;
    const mon2  = parseInt(document.getElementById('i-mon2').value)  || 1;
    const yr2   = parseInt(document.getElementById('i-yr2').value)   || 2000;
    
    name = `${name1} & ${name2}`;
    day  = `${String(day1).padStart(2,'0')}/${String(mon1).padStart(2,'0')}/${yr1} & ${String(day2).padStart(2,'0')}/${String(mon2).padStart(2,'0')}/${yr2}`;
    mon  = '';
    yr   = '';
  }
  
  bc.postMessage({
    type: 'sync_data',
    client: { name, day, month: mon, year: yr },
    calculatedValues: currentVals,
    database: INTERP,
    discoveredModules: DISCOVERED_MODULES,
    readingMode: readingMode,
    dbMode: dbMode
  });

}

bc.onmessage = function(e) {
  const msg = e.data;
  if (msg.type === 'request_sync') {
    broadcastSyncData();
    if (activePos) {
      bc.postMessage({ type: 'select_position', pos: activePos });
    }
  } else if (msg.type === 'select_position') {
    if (msg.pos && POSITIONS[msg.pos]) {
      openPanel(msg.pos, false);
    }
  }
};

document.getElementById('export-btn').addEventListener('click', () => {
  exportClientPDF();
});

document.getElementById('script-board-btn').addEventListener('click', () => {
  window.open('script_board.html', 'SoulMatrixScriptBoard', 'width=650,height=850,menubar=no,toolbar=no,location=no,status=no');
});
