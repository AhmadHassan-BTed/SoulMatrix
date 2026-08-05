/* ═══════════════════════════════════════════════════════════
   SOUL BLUEPRINT MATRIX - COMBINATION PROGRAMS ENGINE
   Module: src/js/programs_engine.js
═══════════════════════════════════════════════════════════ */


function getActivePrograms() {
  const active = [];
  const db = (typeof INTERP !== 'undefined') ? INTERP : database;
  const vals = (typeof currentVals !== 'undefined') ? currentVals : calculatedValues;
  if (!db || !vals) return active;

  const targetModule = readingMode === 'compat' ? 'compat_programs' : 'programs';
  const seenMatches = new Set();

  function parseCodeNumbers(codeStr) {
    return String(codeStr).split(/[\s,-]+/).map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
  }

  function numbersEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    const s1 = [...arr1].sort((a,b) => a - b).join('-');
    const s2 = [...arr2].sort((a,b) => a - b).join('-');
    return s1 === s2;
  }

  for (const posKey in db) {
    const pUpper = posKey.toUpperCase().trim();
    const isGenericProgram = pUpper === 'PROGRAM' || pUpper === 'PROGRAMS' || pUpper === '*' || pUpper === 'ANY' || pUpper === 'ALL';
    const isSpecificTrio = posKey.includes('-');

    const progMod = db[posKey][targetModule];
    if (!progMod) continue;

    for (const secKey in progMod) {
      for (const numKey in progMod[secKey]) {
        const text = progMod[secKey][numKey];
        if (!text) continue;

        const targetNums = parseCodeNumbers(numKey);
        if (targetNums.length !== 3) continue;

        const progName = secKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        if (isSpecificTrio && !isGenericProgram) {
          const positions = posKey.split('-').map(p => p.trim());
          if (positions.length === 3) {
            const v1 = vals[positions[0]], v2 = vals[positions[1]], v3 = vals[positions[2]];
            if (v1 !== undefined && v2 !== undefined && v3 !== undefined) {
              const currentNums = [parseInt(v1, 10), parseInt(v2, 10), parseInt(v3, 10)];
              if (numbersEqual(targetNums, currentNums)) {
                const matchId = `${progName}:${posKey}`;
                if (!seenMatches.has(matchId)) {
                  seenMatches.add(matchId);
                  active.push({
                    positions: posKey,
                    code: `${v1}-${v2}-${v3}`,
                    name: progName,
                    locationLabel: posKey,
                    text: text
                  });
                }
              }
            }
          }
        } else {
          // Universal Scanner: Scan all standard matrix triplets & node combinations
          for (const trip of MATRIX_TRIPLETS) {
            const v1 = vals[trip.nodes[0]], v2 = vals[trip.nodes[1]], v3 = vals[trip.nodes[2]];
            if (v1 !== undefined && v2 !== undefined && v3 !== undefined) {
              const currentNums = [parseInt(v1, 10), parseInt(v2, 10), parseInt(v3, 10)];
              if (numbersEqual(targetNums, currentNums)) {
                const matchId = `${progName}:${trip.key}`;
                if (!seenMatches.has(matchId)) {
                  seenMatches.add(matchId);
                  active.push({
                    positions: trip.key,
                    code: `${v1}-${v2}-${v3}`,
                    name: progName,
                    locationLabel: `${trip.label} (${trip.key})`,
                    text: text
                  });
                }
              }
            }
          }
        }
      }
    }
  }
  return active;
}

function renderActiveProgramsDashboard() {
  const col = document.getElementById('dv-programs-col');
  const list = document.getElementById('dv-programs-list');
  if (!col || !list) return;

  const active = getActivePrograms();
  if (active.length === 0) {
    col.style.display = 'none';
    list.innerHTML = '';
    return;
  }

  col.style.display = 'block';
  list.innerHTML = active.map(prog => `
    <div class="interp-card active-program-card" data-positions="${prog.positions}" style="border-color: var(--gold); background: rgba(212,175,110,0.05); margin-bottom: 12px; padding: 12px 16px; cursor: pointer; transition: transform 0.15s, border-color 0.15s;">
      <h4 style="font-family: Cinzel, serif; font-size: 13px; color: var(--goldb); margin: 0 0 6px; display: flex; justify-content: space-between;">
        <span> ${prog.name}</span>
        <span style="font-size: 10px; color: var(--muted); font-family: Raleway, sans-serif;">${prog.locationLabel || prog.positions} (${prog.code})</span>
      </h4>
      <p style="font-size: 12px; line-height: 1.5; color: var(--lav); margin: 0; white-space: pre-wrap;">${prog.text}</p>
    </div>
  `).join('');

  // Add click listeners to active program cards
  list.querySelectorAll('.active-program-card').forEach(card => {
    card.addEventListener('click', () => {
      const positionsKey = card.dataset.positions;
      // Broadcast to Script Board
      bc.postMessage({ type: 'select_program', positions: positionsKey });
      // Open / focus Script Board window
      window.open('script_board.html', 'SoulMatrixScriptBoard', 'width=650,height=850,menubar=no,toolbar=no,location=no,status=no');
    });
    // Add hover transitions
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = 'var(--goldb)';
      card.style.transform = 'translateY(-1px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = 'var(--gold)';
      card.style.transform = 'translateY(0)';
    });
  });
}

function highlightActiveProgramNodes() {
  document.querySelectorAll('.ng').forEach(g => {
    g.classList.remove('program-highlight');
  });

  const active = getActivePrograms();
  active.forEach(prog => {
    const positions = prog.positions.split('-');
    positions.forEach(pos => {
      const node = document.querySelector(`.ng[data-pos="${pos}"]`);
      if (node) {
        node.classList.add('program-highlight');
      }
    });
  });
}

