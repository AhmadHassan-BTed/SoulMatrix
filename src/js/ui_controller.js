/* ═══════════════════════════════════════════════════════════
   SOUL BLUEPRINT MATRIX - UI CONTROLLER & INTERACTION ENGINE
   Module: src/js/ui_controller.js
═══════════════════════════════════════════════════════════ */

function highlightCurrentAgeNode(ageKey) {
  clearAgeNodeHighlights();
  const activeNode = document.querySelector(`.age-node[data-pos="${ageKey}"]`);
  if (activeNode) {
    const circle = activeNode.querySelector('circle.rg');
    if (circle) {
      circle.style.stroke = 'var(--goldb)';
      circle.style.strokeWidth = '2';
    }
    const label = activeNode.querySelector('.age-range-label');
    if (label) {
      label.style.fill = 'var(--goldb)';
      label.style.fontWeight = '700';
    }
    activeNode.classList.add('current-age-highlight');
  }
}

function clearAgeNodeHighlights() {
  document.querySelectorAll('.age-node').forEach(node => {
    node.classList.remove('current-age-highlight');
    const circle = node.querySelector('circle.rg');
    if (circle) {
      circle.style.stroke = '#E0D8FF';
      circle.style.strokeWidth = '1.2';
    }
    const label = node.querySelector('.age-range-label');
    if (label) {
      label.style.fill = 'rgba(201, 184, 240, 0.6)';
      label.style.fontWeight = '500';
    }
  });
}

function renderForecast(v) {
  const fcCol = document.getElementById('dv-forecast-col');
  const fcBanner = document.getElementById('forecast-banner');
  if (!fcCol) return;
  
  if (readingMode === 'single' && v.forecast) {
    fcCol.style.display = 'block';
    document.getElementById('fc-title').innerHTML = `Personal Forecast <span class="dv-note">Current Age: ${v.forecast.age} years old</span>`;
    
    currentVals['FORECAST_CURRENT'] = v.forecast.currentEnergy;
    currentVals['FORECAST_KEY'] = v.forecast.keyEnergy;
    currentVals['FORECAST_OUTCOME'] = v.forecast.outcome;
    
    const rowsEl = document.getElementById('fc-rows');
    rowsEl.innerHTML = `
      <div class="dv-row" style="cursor: pointer;" onclick="openPanel('FORECAST_CURRENT')">
        <span>Energy of the Period</span>
        <b>${v.forecast.currentEnergy}</b>
      </div>
      <div class="dv-row" style="cursor: pointer;" onclick="openPanel('FORECAST_KEY')">
        <span>Event Line <em>Age ${v.forecast.secondAge}</em></span>
        <b>${v.forecast.keyEnergy}</b>
      </div>
      <div class="dv-row hl" style="cursor: pointer;" onclick="openPanel('FORECAST_OUTCOME')">
        <span>Outcome of the Period</span>
        <b>${v.forecast.outcome}</b>
      </div>
    `;
    highlightCurrentAgeNode(v.forecast.currentEnergyKey);
    
    // Update the prominent triple-key banner
    if (fcBanner) {
      fcBanner.style.display = 'block';
      document.getElementById('fc-banner-title').textContent = `Personal Forecast Triple Key  ·  Age ${v.forecast.age}`;
      document.getElementById('fc-num-1').textContent = v.forecast.currentEnergy;
      document.getElementById('fc-num-2').textContent = v.forecast.keyEnergy;
      document.getElementById('fc-num-3').textContent = v.forecast.outcome;
      document.getElementById('fc-sub-1').textContent = `Current Age ${v.forecast.age}`;
      document.getElementById('fc-sub-2').textContent = `Age ${v.forecast.secondAge}`;
      document.getElementById('fc-btn-1').onclick = () => openPanel('FORECAST_CURRENT');
      document.getElementById('fc-btn-2').onclick = () => openPanel('FORECAST_KEY');
      document.getElementById('fc-btn-3').onclick = () => openPanel('FORECAST_OUTCOME');
    }
    
  } else if (readingMode === 'compat' && v.compatForecast) {
    fcCol.style.display = 'block';
    document.getElementById('fc-title').innerHTML = `Couple Forecast <span class="dv-note">Shared Year Energies</span>`;
    
    currentVals['COMPAT_FORECAST_CURRENT'] = v.compatForecast.currentEnergy;
    currentVals['COMPAT_FORECAST_KEY'] = v.compatForecast.keyEnergy;
    currentVals['COMPAT_FORECAST_OUTCOME'] = v.compatForecast.outcome;
    
    const name1 = document.getElementById('i-name1').value.trim() || 'Partner 1';
    const name2 = document.getElementById('i-name2').value.trim() || 'Partner 2';
    
    const rowsEl = document.getElementById('fc-rows');
    rowsEl.innerHTML = `
      <div class="dv-row" style="cursor: pointer;" onclick="openPanel('COMPAT_FORECAST_CURRENT')">
        <span>Energy of the Period</span>
        <b>${v.compatForecast.currentEnergy}</b>
      </div>
      <div class="dv-row" style="cursor: pointer;" onclick="openPanel('COMPAT_FORECAST_KEY')">
        <span>Event Line</span>
        <b>${v.compatForecast.keyEnergy}</b>
      </div>
      <div class="dv-row hl" style="cursor: pointer;" onclick="openPanel('COMPAT_FORECAST_OUTCOME')">
        <span>Outcome of the Period</span>
        <b>${v.compatForecast.outcome}</b>
      </div>
      <div class="dv-row">
        <span>${name1} Forecast Key</span>
        <b style="font-size: 11px; width: auto; color: rgba(224,216,255,.5); font-family: Raleway, sans-serif;">
          ${v.compatForecast.p1.currentEnergy} → ${v.compatForecast.p1.keyEnergy} → ${v.compatForecast.p1.outcome}
        </b>
      </div>
      <div class="dv-row">
        <span>${name2} Forecast Key</span>
        <b style="font-size: 11px; width: auto; color: rgba(224,216,255,.5); font-family: Raleway, sans-serif;">
          ${v.compatForecast.p2.currentEnergy} → ${v.compatForecast.p2.keyEnergy} → ${v.compatForecast.p2.outcome}
        </b>
      </div>
    `;
    clearAgeNodeHighlights();
    
    // Update the prominent triple-key banner for couple
    if (fcBanner) {
      fcBanner.style.display = 'block';
      document.getElementById('fc-banner-title').textContent = `Couple Forecast Triple Key`;
      document.getElementById('fc-num-1').textContent = v.compatForecast.currentEnergy;
      document.getElementById('fc-num-2').textContent = v.compatForecast.keyEnergy;
      document.getElementById('fc-num-3').textContent = v.compatForecast.outcome;
      document.getElementById('fc-sub-1').textContent = `${name1}: ${v.compatForecast.p1.currentEnergy}  +  ${name2}: ${v.compatForecast.p2.currentEnergy}`;
      document.getElementById('fc-sub-2').textContent = `${name1}: ${v.compatForecast.p1.keyEnergy}  +  ${name2}: ${v.compatForecast.p2.keyEnergy}`;
      document.getElementById('fc-btn-1').onclick = () => openPanel('COMPAT_FORECAST_CURRENT');
      document.getElementById('fc-btn-2').onclick = () => openPanel('COMPAT_FORECAST_KEY');
      document.getElementById('fc-btn-3').onclick = () => openPanel('COMPAT_FORECAST_OUTCOME');
    }
    
  } else {
    fcCol.style.display = 'none';
    if (fcBanner) fcBanner.style.display = 'none';
  }
}

// ═══════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════
let currentVals = {};
let activePos = null;
let activeModId = 'core';
let editMode = false;
let readingMode = 'single';

function setReadingMode(mode) {
  readingMode = mode;
  const singleBar = document.getElementById('input-bar-single');
  const compatBar = document.getElementById('input-bar-compat');
  const btnSingle = document.getElementById('btn-mode-single');
  const btnCompat = document.getElementById('btn-mode-compat');
  
  if (mode === 'single') {
    singleBar.style.display = 'grid';
    compatBar.style.display = 'none';
    btnSingle.classList.add('active');
    btnCompat.classList.remove('active');
  } else {
    singleBar.style.display = 'none';
    compatBar.style.display = 'grid';
    btnSingle.classList.remove('active');
    btnCompat.classList.add('active');
  }
  
  if (mode === 'single') {
    document.getElementById('go-btn').click();
  } else {
    document.getElementById('go-compat-btn').click();
  }
}



function updateMatrix(v) {
  currentVals = v;
  document.querySelectorAll('.nv').forEach(el => {
    const p = el.dataset.pos;
    if (p && v[p] !== undefined) el.textContent = v[p];
  });
  renderDerived(v.derived);
  renderForecast(v);
  renderActiveProgramsDashboard();
  highlightActiveProgramNodes();
  broadcastSyncData();
}

function renderDerived(d) {
  if (!d) return;
  const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  set('dv-earth', d.earth); set('dv-sky', d.sky); set('dv-personal', d.personalPurpose);
  set('dv-pat', d.paternalP); set('dv-mat', d.maternalP); set('dv-social', d.socialPurpose);
  set('dv-spirit', d.spiritualPurpose);
  // Soul Potentials U1/U2/U3 & Emotional Closeness O/P/OP (populated from currentVals)
  set('dv-u1', currentVals.U1 || '–');
  set('dv-u2', currentVals.U2 || '–');
  set('dv-u3', currentVals.U3 || '–');
  set('dv-o', currentVals.O || '–');
  set('dv-p', currentVals.P || '–');
  set('dv-op', currentVals.OP || '–');
  const tb = document.querySelector('#dv-chakra-tbl tbody');
  if (tb) {
    tb.innerHTML = d.chakras.map(c =>
      `<tr><td class="ck-name">${c.name}<span>${c.zone}</span></td><td>${c.physical}</td><td>${c.energy}</td><td>${c.emotional}</td></tr>`
    ).join('');
  }
  set('ck-tp', d.chakraTotals.physical); set('ck-te', d.chakraTotals.energy); set('ck-tm', d.chakraTotals.emotional);
}

// ═══════════════════════════════════════════════════════════════════
// BUILD DYNAMIC MODULE LIST
// Merges discovered-from-CSV modules with any defaults,
// preserving natural CSV order. New columns = new tabs automatically.
// ═══════════════════════════════════════════════════════════════════
function getModules() {
  const defaults = [
    {id:'core',          label:' Core',    sections:[
      {key:'meaning',title:'What This Position Means'},
      {key:'positive',title:'Positive Expression'},
      {key:'shadow',title:'Shadow Expression'},
      {key:'healing',title:'Healing Path'},
    ]},
    {id:'relationships', label:' Love',    sections:[
      {key:'attraction',title:'Attraction Pattern'},
      {key:'lesson',title:'Relationship Lesson'},
      {key:'wound',title:'Core Wound'},
      {key:'partner',title:'What They Attract'},
    ]},
    {id:'karma',         label:' Karma',   sections:[
      {key:'karmic',title:'Karmic Pattern'},
      {key:'past_life',title:'Past Life Theme'},
      {key:'resolution',title:'Resolution Path'},
    ]},
    {id:'money',         label:'$ Money',   sections:[
      {key:'money_flow',title:'Money Flow'},
      {key:'block',title:'Financial Block'},
      {key:'activation',title:'Activation'},
    ]},
    {id:'purpose',       label:' Purpose', sections:[
      {key:'life_purpose',title:'Life Purpose'},
      {key:'gifts',title:'Natural Gifts'},
      {key:'mission',title:'Soul Mission'},
    ]},
    {id:'forecast',      label:'◎ Forecast',sections:[
      {key:'theme',title:'Energy of the Period'},
      {key:'recommendations',title:'Event Line'},
      {key:'watch_out',title:'Outcome of the Period'},
    ]},
    {id:'compat_general', label:' General', sections:[
      {key:'meaning',title:'General Compatibility'},
    ]},
    {id:'compat_love', label:' Love Dynamics', sections:[
      {key:'meaning',title:'Love Alignment'},
    ]},
    {id:'compat_karma', label:' Relationship Karma', sections:[
      {key:'meaning',title:'Karmic Relationship'},
    ]},
    {id:'compat_finance', label:'$ Shared Finance', sections:[
      {key:'meaning',title:'Financial Compatibility'},
    ]},
    {id:'compat_forecast', label:'◎ Couple Forecast', sections:[
      {key:'theme',title:'Energy of the Period'},
      {key:'recommendations',title:'Event Line'},
      {key:'watch_out',title:'Outcome of the Period'},
    ]},
  ];

  const result = defaults.map(d => ({...d, sections: [...d.sections]}));

  Object.values(DISCOVERED_MODULES).forEach(discovered => {
    const existing = result.find(m => m.id === discovered.id);
    if (!existing) {
      result.push({...discovered});
    } else {
      discovered.sections.forEach(sec => {
        if (!existing.sections.find(s => s.key === sec.key)) {
          existing.sections.push(sec);
        }
      });
    }
  });

  return result;
}

// ═══════════════════════════════════════════════════════════════════
// PANEL
// ═══════════════════════════════════════════════════════════════════
function openPanel(pos, syncToBoard = true) {
  activePos = pos;
  if (syncToBoard) {
    bc.postMessage({ type: 'select_position', pos: pos });
  }
  const meta = POSITIONS[pos] || {name: pos, formula: '', zone: '', color: '#B088F0'};
  const val  = currentVals[pos] ?? '–';
  const col  = meta.color || '#B088F0';

  const titleText = POSITIONS[pos] ? `Position ${pos} — ${POSITIONS[pos].name}` : `Position ${pos}`;
  document.getElementById('panel-pos-label').textContent = `${pos}  ·  ${meta.zone.toUpperCase()}`;
  document.getElementById('panel-pos-label').style.color = col;
  document.getElementById('p-num').textContent = val;
  document.getElementById('p-num').style.color = col;
  document.getElementById('p-num').style.textShadow = `0 0 24px ${col}66`;
  document.getElementById('p-name').textContent = titleText;
  document.getElementById('p-formula').textContent = `Formula: ${meta.formula}`;

  const badge = document.getElementById('p-zone-badge');
  badge.textContent = meta.zone.toUpperCase();
  badge.style.color = col;

  // ── Panel Forecast Triple ──────────────────────────────────────
  const pft = document.getElementById('panel-forecast-triple');
  if (pft) {
    const isForecast = pos.startsWith('age') || pos.startsWith('FORECAST_') || pos.startsWith('COMPAT_FORECAST_');
    if (isForecast) {
      // Determine which energies and which panel keys to use
      let e1, e2, e3, key1, key2, key3;
      if (pos.startsWith('COMPAT_FORECAST_') || (pos.startsWith('age') && readingMode === 'compat')) {
        e1 = currentVals['COMPAT_FORECAST_CURRENT'];
        e2 = currentVals['COMPAT_FORECAST_KEY'];
        e3 = currentVals['COMPAT_FORECAST_OUTCOME'];
        key1 = 'COMPAT_FORECAST_CURRENT'; key2 = 'COMPAT_FORECAST_KEY'; key3 = 'COMPAT_FORECAST_OUTCOME';
      } else {
        e1 = currentVals['FORECAST_CURRENT'];
        e2 = currentVals['FORECAST_KEY'];
        e3 = currentVals['FORECAST_OUTCOME'];
        key1 = 'FORECAST_CURRENT'; key2 = 'FORECAST_KEY'; key3 = 'FORECAST_OUTCOME';
      }
      if (e1 != null) {
        pft.style.display = 'block';
        document.getElementById('pft-n1').textContent = e1;
        document.getElementById('pft-n2').textContent = e2;
        document.getElementById('pft-n3').textContent = e3;
        // Highlight the currently active position
        ['pft-btn-1','pft-btn-2','pft-btn-3'].forEach(id => document.getElementById(id).classList.remove('active-pft'));
        if (pos === key1 || (pos.startsWith('age') && activeModId !== 'compat_forecast')) document.getElementById('pft-btn-1').classList.add('active-pft');
        if (pos === key2) document.getElementById('pft-btn-2').classList.add('active-pft');
        if (pos === key3) document.getElementById('pft-btn-3').classList.add('active-pft');
        document.getElementById('pft-btn-1').onclick = () => openPanel(key1);
        document.getElementById('pft-btn-2').onclick = () => openPanel(key2);
        document.getElementById('pft-btn-3').onclick = () => openPanel(key3);
      } else {
        pft.style.display = 'none';
      }
    } else {
      pft.style.display = 'none';
    }
  }

  const modules = getModules();

  const activeModules = modules.filter(m => {
    if (readingMode === 'compat') {
      return m.id.startsWith('compat_') || m.id === 'compatibility';
    } else {
      return !m.id.startsWith('compat_') && m.id !== 'compatibility' && m.id !== 'programs' && m.id !== 'compat_programs';
    }
  });

  const tabsEl = document.getElementById('mod-tabs');
  tabsEl.innerHTML = '';

  if (pos.startsWith('age') || pos.startsWith('FORECAST_')) {
    activeModId = readingMode === 'compat' ? 'compat_forecast' : 'forecast';
  } else if (pos.startsWith('COMPAT_FORECAST_')) {
    activeModId = 'compat_forecast';
  } else {
    // Check preferred module map
    const prefMapSingle = {
      R1: 'relationships', L: 'relationships', M: 'relationships', S: 'relationships', R: 'relationships',
      R2: 'money', Q: 'money',
      N: 'karma', H2: 'karma', I2: 'karma',
      K: 'purpose', T: 'purpose'
    };
    const prefMapCompat = {
      R1: 'compat_love', L: 'compat_love', M: 'compat_love', S: 'compat_love', R: 'compat_love',
      R2: 'compat_finance', Q: 'compat_finance',
      N: 'compat_karma', H2: 'compat_karma', I2: 'compat_karma'
    };
    const prefMap = readingMode === 'compat' ? prefMapCompat : prefMapSingle;

    // Check if current activeModId has data for this position & value
    let hasDataInActiveMod = false;
    if (INTERP[pos] && INTERP[pos][activeModId]) {
      for (const secKey in INTERP[pos][activeModId]) {
        if (INTERP[pos][activeModId][secKey] && INTERP[pos][activeModId][secKey][val]) {
          hasDataInActiveMod = true;
          break;
        }
      }
    }

    // If activeModId has no data, find which module DOES have data for this position
    if (!hasDataInActiveMod) {
      let foundModWithData = null;
      if (INTERP[pos]) {
        for (const modKey in INTERP[pos]) {
          const isModActive = activeModules.some(m => m.id === modKey);
          if (isModActive) {
            for (const secKey in INTERP[pos][modKey]) {
              if (INTERP[pos][modKey][secKey] && INTERP[pos][modKey][secKey][val]) {
                foundModWithData = modKey;
                break;
              }
            }
          }
          if (foundModWithData) break;
        }
      }

      if (foundModWithData) {
        activeModId = foundModWithData;
      } else if (prefMap[pos] && activeModules.some(m => m.id === prefMap[pos])) {
        activeModId = prefMap[pos];
      } else if (!activeModules.find(m => m.id === activeModId)) {
        activeModId = activeModules[0]?.id || (readingMode === 'compat' ? 'compat_general' : 'core');
      }
    }
  }

  activeModules.forEach(mod => {
    const btn = document.createElement('button');
    btn.className = 'mod-tab' + (mod.id === activeModId ? ' active' : '');
    btn.textContent = mod.label;
    btn.onclick = () => { activeModId = mod.id; openPanel(pos); };
    tabsEl.appendChild(btn);
  });

  renderModContent(pos, val, activeModId, activeModules);

  document.querySelectorAll('.ng').forEach(g => g.classList.remove('active'));
  const activeNode = document.querySelector(`.ng[data-pos="${pos}"]`);
  if (activeNode) activeNode.classList.add('active');

  document.getElementById('panel').classList.add('open');
}

function renderModContent(pos, val, modId, modules) {
  const mods = modules || getModules();
  const mod = mods.find(m => m.id === modId);
  if (!mod) return;

  let targetPos = pos;
  let targetModId = modId;

  if (pos.startsWith('age') || pos.startsWith('FORECAST_')) {
    targetPos = 'FORECAST';
    targetModId = 'forecast';
  } else if (pos.startsWith('COMPAT_FORECAST_')) {
    targetPos = 'COMPAT_FORECAST';
    targetModId = 'compat_forecast';
  }

  const meta = POSITIONS[pos] || {name: pos, formula: '', zone: '', color: '#B088F0'};

  const el = document.getElementById('mod-content');
  el.innerHTML = '';

  const activeProgs = getActivePrograms();
  const nodeProgs = activeProgs.filter(p => p.positions.split('-').includes(pos));
  nodeProgs.forEach(prog => {
    const card = document.createElement('div');
    card.className = 'interp-card';
    card.style.borderColor = 'var(--gold)';
    card.style.background = 'rgba(212,175,110,0.05)';

    const h = document.createElement('h3');
    h.textContent = `Active Program: ${prog.name} (${prog.positions} · ${prog.code})`;
    h.style.color = 'var(--goldb)';
    card.appendChild(h);

    const p = document.createElement('p');
    p.textContent = prog.text;
    card.appendChild(p);
    el.appendChild(card);
  });

  // Compute 3-energy forecast for age nodes and forecast positions
  let energies = null;
  if (pos.startsWith('age')) {
    energies = readingMode === 'compat'
      ? getAgeForecastEnergiesCompat(pos, currentVals)
      : getAgeForecastEnergiesSingle(pos, currentVals);
  } else if (pos === 'FORECAST_CURRENT' || pos === 'FORECAST_KEY' || pos === 'FORECAST_OUTCOME') {
    energies = [
      currentVals['FORECAST_CURRENT'],
      currentVals['FORECAST_KEY'],
      currentVals['FORECAST_OUTCOME']
    ];
  } else if (pos.startsWith('COMPAT_FORECAST_')) {
    energies = [
      currentVals['COMPAT_FORECAST_CURRENT'],
      currentVals['COMPAT_FORECAST_KEY'],
      currentVals['COMPAT_FORECAST_OUTCOME']
    ];
  }

  const ctx = document.createElement('div');
  ctx.className = 'section-label';
  if (energies && energies[0]) {
    ctx.textContent = `Forecast Key: ${energies[0]} — ${energies[1]} — ${energies[2]}`;
  } else {
    ctx.textContent = `Number ${val} in position ${pos}`;
  }
  el.appendChild(ctx);

  // Determine which single section to show for specific forecast position clicks.
  // Age-node clicks show all 3 sections (overview). Direct position clicks show just 1.
  const sectionFilter =
    (pos === 'FORECAST_CURRENT' || pos === 'COMPAT_FORECAST_CURRENT') ? 'theme' :
    (pos === 'FORECAST_KEY'     || pos === 'COMPAT_FORECAST_KEY')     ? 'recommendations' :
    (pos === 'FORECAST_OUTCOME' || pos === 'COMPAT_FORECAST_OUTCOME') ? 'watch_out' :
    null; // null = show all sections (age nodes, core positions, etc.)

  // Check if any section in this module has interpretation text for this position
  let hasAnyTextInModule = false;
  mod.sections.forEach(sec => {
    let sVal = parseInt(val);
    if (energies) {
      if (sec.key === 'theme') sVal = energies[0];
      else if (sec.key === 'recommendations') sVal = energies[1];
      else if (sec.key === 'watch_out') sVal = energies[2];
    }
    if (INTERP[targetPos]?.[targetModId]?.[sec.key]?.[sVal]) {
      hasAnyTextInModule = true;
    }
  });

  let renderedCardCount = 0;

  mod.sections.forEach(sec => {
    // Skip sections that don't match the filter for direct forecast position clicks
    if (sectionFilter && sec.key !== sectionFilter) return;

    // Each section maps to its own energy number
    let sectionVal = parseInt(val);
    if (energies) {
      if (sec.key === 'theme') {
        sectionVal = energies[0];          // 1. Energy of the Period
      } else if (sec.key === 'recommendations') {
        sectionVal = energies[1];          // 2. Event Line
      } else if (sec.key === 'watch_out') {
        sectionVal = energies[2];          // 3. Outcome of the Period
      }
    }

    const text = INTERP[targetPos]?.[targetModId]?.[sec.key]?.[sectionVal] || null;

    // Skip empty sections completely to keep reading board clean (Item 9)
    if (!text) return;

    const card = document.createElement('div');
    card.className = 'interp-card';

    const h = document.createElement('h3');
    h.textContent = energies ? `${sec.title} · Arcana ${sectionVal}` : sec.title;
    card.appendChild(h);

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => startEdit(card, targetPos, targetModId, sec.key, sectionVal, text || '');
    card.appendChild(editBtn);

    const p = document.createElement('p');
    p.textContent = text;
    card.appendChild(p);
    el.appendChild(card);
    renderedCardCount++;
  });

  if (renderedCardCount === 0) {
    const card = document.createElement('div');
    card.className = 'interp-card';
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = `No interpretation entered yet for ${POSITIONS[pos]?.name || pos} · Arcana ${val}. Click Edit to add, or update interpretations.csv.`;
    card.appendChild(p);
    el.appendChild(card);
  }

  const note = document.createElement('div');
  note.className = 'export-note';
  note.textContent = ' Add interpretations by editing interpretations.csv in Excel';
  el.appendChild(note);
}

function startEdit(card, pos, modId, secKey, numVal, currentText) {
  const p = card.querySelector('p');
  const editBtn = card.querySelector('.edit-btn');
  if (!p) return;
  p.style.display = 'none';
  editBtn.style.display = 'none';

  const ta = document.createElement('textarea');
  ta.className = 'edit-area';
  ta.value = currentText;
  ta.placeholder = `Enter your interpretation for number ${numVal} here…`;

  const hint = document.createElement('div');
  hint.style.cssText = 'font-size:10px;color:rgba(212,175,110,.4);margin:4px 0 2px;';
  hint.textContent = 'Session edit only. To save permanently, copy this text into your interpretations.csv file.';

  const actions = document.createElement('div');
  actions.className = 'edit-actions';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'edit-save';
  saveBtn.textContent = 'Apply';
  saveBtn.onclick = () => {
    const newText = ta.value.trim();
    if (!INTERP[pos])                INTERP[pos] = {};
    if (!INTERP[pos][modId])         INTERP[pos][modId] = {};
    if (!INTERP[pos][modId][secKey]) INTERP[pos][modId][secKey] = {};
    INTERP[pos][modId][secKey][numVal] = newText;
    renderModContent(pos, String(numVal), modId);
  };

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'edit-cancel';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.onclick = () => {
    ta.remove(); hint.remove(); actions.remove();
    p.style.display = '';
    editBtn.style.display = '';
  };

  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);
  card.appendChild(hint);
  card.appendChild(ta);
  card.appendChild(actions);
  ta.focus();
}

function toggleEditMode() {
  editMode = !editMode;
  document.body.classList.toggle('edit-mode', editMode);
  const btn = document.getElementById('panel-edit-toggle');
  btn.style.background    = editMode ? 'rgba(92,222,200,.18)' : '';
  btn.style.borderColor   = editMode ? 'var(--teal)' : '';
  btn.style.color         = editMode ? 'var(--teal)' : '';
  btn.textContent         = editMode ? ' Exit Edit' : ' Edit Mode';
}

function closePanel() {
  document.getElementById('panel').classList.remove('open');
  document.querySelectorAll('.ng').forEach(g => g.classList.remove('active'));
  activePos = null;
}

// ═══════════════════════════════════════════════════════════════════
// NODE INTERACTION
// ═══════════════════════════════════════════════════════════════════
document.querySelectorAll('.ng').forEach(g => {
  g.addEventListener('click', () => openPanel(g.dataset.pos));
});
document.getElementById('msv').addEventListener('click', e => {
  if (!e.target.closest('.ng')) closePanel();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

// ═══════════════════════════════════════════════════════════════════
// CALCULATE BUTTON
// ═══════════════════════════════════════════════════════════════════
document.getElementById('go-btn').addEventListener('click', () => {
  const name = document.getElementById('i-name').value.trim() || 'Client';
  const day  = parseInt(document.getElementById('i-day').value)  || 1;
  const mon  = parseInt(document.getElementById('i-mon').value)  || 1;
  const yr   = parseInt(document.getElementById('i-yr').value)   || 2000;
  document.getElementById('client-display').textContent =
    `${name}  ·  ${String(day).padStart(2,'0')} / ${String(mon).padStart(2,'0')} / ${yr}`;
  
  const v = calc(day, mon, yr);
  v.forecast = getPersonalForecast(v, day, mon, yr);
  
  updateMatrix(v);
  if (activePos) openPanel(activePos);
});

document.getElementById('go-compat-btn').addEventListener('click', () => {
  const name1 = document.getElementById('i-name1').value.trim() || 'Partner 1';
  const day1  = parseInt(document.getElementById('i-day1').value)  || 1;
  const mon1  = parseInt(document.getElementById('i-mon1').value)  || 1;
  const yr1   = parseInt(document.getElementById('i-yr1').value)   || 2000;
  
  const name2 = document.getElementById('i-name2').value.trim() || 'Partner 2';
  const day2  = parseInt(document.getElementById('i-day2').value)  || 1;
  const mon2  = parseInt(document.getElementById('i-mon2').value)  || 1;
  const yr2   = parseInt(document.getElementById('i-yr2').value)   || 2000;
  
  const nameDisplay = `${name1} & ${name2}`;
  const dobDisplay = `${String(day1).padStart(2,'0')}/${String(mon1).padStart(2,'0')}/${yr1} & ${String(day2).padStart(2,'0')}/${String(mon2).padStart(2,'0')}/${yr2}`;
  
  document.getElementById('client-display').textContent = `${nameDisplay}  ·  ${dobDisplay}`;
  
  const v_comb = calcCompatibility(day1, mon1, yr1, day2, mon2, yr2);
  v_comb.compatForecast = getCompatibilityForecast(day1, mon1, yr1, day2, mon2, yr2);
  
  updateMatrix(v_comb);
  if (activePos) openPanel(activePos);
});

document.getElementById('nav-forecast-btn').addEventListener('click', () => {
  if (readingMode === 'single') {
    openPanel('FORECAST_CURRENT');
  } else {
    openPanel('COMPAT_FORECAST_CURRENT');
  }
});



// ═══════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════
document.getElementById('export-btn').addEventListener('click', () => window.print());

// ═══════════════════════════════════════════════════════════════════
// MODULE NAV (top bar)
// ═══════════════════════════════════════════════════════════════════
document.querySelectorAll('.mnav-btn:not(.soon)').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mnav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ═══════════════════════════════════════════════════════════════════
// STARS BACKGROUND
// ═══════════════════════════════════════════════════════════════════
(() => {
  const c = document.getElementById('stars');
  const ctx = c.getContext('2d');
  const rng = (s => () => {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  })(42);
  function draw() {
    c.width = innerWidth; c.height = innerHeight;
    ctx.clearRect(0, 0, c.width, c.height);
    for (let i = 0; i < 320; i++) {
      const x = rng() * c.width, y = rng() * c.height, r = rng() * 1.5 + .2, a = rng() * .5 + .08;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill();
    }
    for (let i = 0; i < 14; i++) {
      const x = rng() * c.width, y = rng() * c.height, s = rng() * 9 + 4, a = rng() * .22 + .12;
      ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.lineWidth = .5;
      [[x-s,y,x+s,y],[x,y-s,x,y+s]].forEach(([x1,y1,x2,y2]) => {
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      });
    }
  }
  draw(); window.addEventListener('resize', draw);
})();



function generateOuterAgeNodes() {
  const group = document.getElementById('age-nodes-group');
  if (!group) return;
  group.innerHTML = '';
  
  const vertices = {
    A: { x: 130, y: 450 },
    F: { x: 218, y: 238 },
    B: { x: 430, y: 150 },
    G: { x: 642, y: 238 },
    C: { x: 730, y: 450 },
    H: { x: 642, y: 662 },
    D: { x: 430, y: 750 },
    I: { x: 218, y: 662 }
  };
  
  const sectorCorners = [
    ['A', 'F'], ['F', 'B'], ['B', 'G'], ['G', 'C'],
    ['C', 'H'], ['H', 'D'], ['D', 'I'], ['I', 'A']
  ];
  
  const tValues = [0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875];
  const ageOffsets = [1.25, 2.5, 3.75, 5, 6.25, 7.5, 8.75];
  
  sectorCorners.forEach(([c1, c2], sectorIdx) => {
    const startAge = sectorIdx * 10;
    const p1 = vertices[c1];
    const p2 = vertices[c2];
    
    tValues.forEach((t, i) => {
      const ageOffset = ageOffsets[i];
      const age = startAge + ageOffset;
      const ageKey = `age${age}`;
      
      const x = p1.x + t * (p2.x - p1.x);
      const y = p1.y + t * (p2.y - p1.y);
      
      const vx = x - 430;
      const vy = y - 450;
      const len = Math.sqrt(vx * vx + vy * vy);
      const ux = vx / len;
      const uy = vy / len;
      
      const textDist = 25;
      const tx = x + ux * textDist;
      const ty = y + uy * textDist;
      
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'ng age-node');
      g.setAttribute('data-pos', ageKey);
      g.style.cursor = 'pointer';
      
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      const meta = POSITIONS[ageKey] || {name: `Age Node ${age}`};
      title.textContent = `${ageKey} · ${meta.name}`;
      g.appendChild(title);
      
      const hl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      hl.setAttribute('cx', x);
      hl.setAttribute('cy', y);
      hl.setAttribute('r', 15);
      hl.setAttribute('fill', 'rgba(167, 139, 250, 0.2)');
      hl.setAttribute('class', 'hl');
      hl.setAttribute('filter', 'url(#fb)');
      hl.setAttribute('opacity', '0');
      hl.style.transition = 'opacity 0.15s ease';
      g.appendChild(hl);
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', 10);
      circle.setAttribute('fill', '#0D082E');
      circle.setAttribute('stroke', '#E0D8FF');
      circle.setAttribute('stroke-width', '1.2');
      circle.setAttribute('class', 'rg');
      circle.style.transition = 'stroke 0.15s ease, stroke-width 0.15s ease';
      g.appendChild(circle);
      
      const textNum = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textNum.setAttribute('x', x);
      textNum.setAttribute('y', y);
      textNum.setAttribute('text-anchor', 'middle');
      textNum.setAttribute('dominant-baseline', 'central');
      textNum.setAttribute('font-family', 'Cinzel, serif');
      textNum.setAttribute('font-weight', '700');
      textNum.setAttribute('font-size', '9.5');
      textNum.setAttribute('fill', '#FFF');
      textNum.setAttribute('class', 'nv');
      textNum.setAttribute('data-pos', ageKey);
      textNum.textContent = '·';
      g.appendChild(textNum);
      
      const textRange = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textRange.setAttribute('x', tx);
      textRange.setAttribute('y', ty);
      textRange.setAttribute('text-anchor', 'middle');
      textRange.setAttribute('dominant-baseline', 'central');
      textRange.setAttribute('font-family', 'Raleway, sans-serif');
      textRange.setAttribute('font-size', '7.5');
      textRange.setAttribute('font-weight', '500');
      textRange.setAttribute('fill', 'rgba(201, 184, 240, 0.6)');
      textRange.setAttribute('class', 'age-range-label');
      textRange.style.transition = 'fill 0.15s ease, font-weight 0.15s ease';
      
      const rangeMatch = meta.name.match(/\(([^)]+)\)/);
      textRange.textContent = rangeMatch ? rangeMatch[1] : age;
      g.appendChild(textRange);
      
      g.addEventListener('mouseenter', () => {
        hl.setAttribute('opacity', '1');
        circle.setAttribute('stroke', 'var(--goldb)');
        circle.setAttribute('stroke-width', '1.8');
        textRange.setAttribute('fill', 'var(--goldb)');
        textRange.setAttribute('font-weight', '700');
      });
      g.addEventListener('mouseleave', () => {
        if (activePos !== ageKey && !g.classList.contains('current-age-highlight')) {
          hl.setAttribute('opacity', '0');
          circle.setAttribute('stroke', '#E0D8FF');
          circle.setAttribute('stroke-width', '1.2');
          textRange.setAttribute('fill', 'rgba(201, 184, 240, 0.6)');
          textRange.setAttribute('font-weight', '500');
        }
      });
      
      g.addEventListener('click', (e) => {
        e.stopPropagation();
        openPanel(ageKey);
      });
      
      group.appendChild(g);
    });
  });
}

updateDbModeButton();
loadCSV().then(() => {
  generateOuterAgeNodes();
  document.getElementById('go-btn').click();
});

