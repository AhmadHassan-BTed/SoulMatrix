/* ═══════════════════════════════════════════════════════════
   SOUL BLUEPRINT MATRIX - PERSONAL CLIENT PDF EXPORTER
   Module: src/js/pdf_exporter.js
═══════════════════════════════════════════════════════════ */


function exportClientPDF() {
  let name, dobStr;
  if (readingMode === 'single') {
    name = document.getElementById('i-name').value.trim() || 'Client';
    const day = document.getElementById('i-day').value;
    const mon = document.getElementById('i-mon').value;
    const yr = document.getElementById('i-yr').value;
    dobStr = `${String(day).padStart(2,'0')}.${String(mon).padStart(2,'0')}.${yr}`;
  } else {
    name = `${document.getElementById('i-name1').value.trim() || 'Partner 1'} & ${document.getElementById('i-name2').value.trim() || 'Partner 2'}`;
    dobStr = 'Compatibility Matrix';
  }

  const svgContent = document.getElementById('msv').outerHTML;
  
  const coordKeys = [
    { key:'A', label:'Point A (Visiting Card / Day)' },
    { key:'B', label:'Point B (Spiritual Talent / Month)' },
    { key:'C', label:'Point C (Material Task / Year)' },
    { key:'D', label:'Point D (Karmic Task / Social Purpose)' },
    { key:'E', label:'Point E (Soul Comfort Zone / Center)' },
    { key:'N', label:'Karmic Tail (D - N - R)' },
    { key:'L', label:'Point L (Money Gateway Code)' },
    { key:'R', label:'Point R (Relationship Gateway Code)' },
    { key:'R1', label:'Point R1 (Ideal Partner)' },
    { key:'M', label:'Point M (Balance Point)' },
    { key:'O', label:'Point O (Optimal Niche / Profession)' },
    { key:'derived_p1', label:'1st Soul Purpose (20–40 yrs)' },
    { key:'derived_p2', label:'2nd Soul Purpose (40–60 yrs)' },
    { key:'derived_p3', label:'3rd Soul Purpose (60+ yrs)' },
    { key:'derived_p4', label:'4th Soul Purpose (Planetary Mission)' }
  ];

  let tableRows = '';
  coordKeys.forEach(item => {
    let val = '';
    let nameText = '';
    let themeText = '';

    if (item.key === 'derived_p1') {
      val = currentVals.derived?.personalPurpose || '–';
      nameText = 'Personal Purpose';
      themeText = 'Personal ease, self-confidence, inner potential (ages 20-40)';
    } else if (item.key === 'derived_p2') {
      val = currentVals.derived?.socialPurpose || '–';
      nameText = 'Social / Lineage Purpose';
      themeText = 'Mastering inner power, lineage alignment (ages 40-60)';
    } else if (item.key === 'derived_p3') {
      val = currentVals.derived?.spiritualPurpose || '–';
      nameText = 'Spiritual Purpose';
      themeText = 'Global wisdom, spiritual maturity, peace (ages 60+)';
    } else if (item.key === 'derived_p4') {
      val = red((currentVals.derived?.personalPurpose || 0) + (currentVals.derived?.socialPurpose || 0));
      nameText = 'Planetary Mission';
      themeText = 'Becoming a master teacher and spiritual mentor';
    } else if (item.key === 'N') {
      val = `${currentVals.D || ''} - ${currentVals.N || ''} - ${currentVals.R || ''}`;
      nameText = 'Karmic Tail Program';
      themeText = 'Uncovering ancestral lessons, releasing karmic blocks';
    } else {
      val = currentVals[item.key] ?? '–';
      const pos = POSITIONS[item.key] || {};
      nameText = pos.name || item.key;
      themeText = pos.zone || 'Core energy coordinate';
    }

    tableRows += `
      <tr>
        <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">${item.label}</td>
        <td style="padding:10px; border-bottom:1px solid #eee; text-align:center; font-weight:bold; color:#7C3AED;">${val}</td>
        <td style="padding:10px; border-bottom:1px solid #eee;">${nameText}</td>
        <td style="padding:10px; border-bottom:1px solid #eee; font-style:italic;">${themeText}</td>
      </tr>
    `;
  });

  const win = window.open('', '_blank');
  win.document.write(\`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Destiny Matrix Report — \${name}</title>
      <style>
        body { font-family: 'Georgia', serif; color: #2D3748; line-height: 1.6; padding: 40px; }
        h1, h2, h3 { font-family: 'Cinzel', serif; color: #4A5568; }
        .header { text-align: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 20px; margin-bottom: 30px; }
        .greeting { background: #FAF5FF; border-left: 4px solid #9F7AEA; padding: 20px; margin: 20px 0; font-style: italic; }
        .chart-box { text-align: center; margin: 30px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
        th { background: #EDF2F7; padding: 12px; text-align: left; font-family: sans-serif; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
        .page-break { page-break-before: always; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <button class="no-print" onclick="window.print()" style="padding:10px 20px; background:#7C3AED; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold; margin-bottom:20px;"> Print / Save as PDF</button>

      <div class="header">
        <h1>THE MATRIX OF DESTINY</h1>
        <h2>Your Personal Soul Book & Life Guide</h2>
        <p>FULL DESTINY MATRIX CHART ANALYSIS: <strong>\${name}</strong> (\${dobStr})</p>
      </div>

      <div class="greeting">
        <strong>Dear \${name}!</strong><br>
        Welcome to the opening of your personal Destiny Matrix Chart! This document is your soul's digital blueprint and master life guide, calculated strictly from the energetic frequency of your date of birth (\${dobStr}). In this report, every chapter is dedicated to your personal growth, inner peace, emotional healing, and spiritual abundance. Use this book as a manual whenever you need to make important life decisions, regain inner tranquility, or unlock a new level of your potential!
      </div>

      <div class="chart-box">
        <h3>CHAPTER 1: MATRIX SUMMARY DIAGRAM</h3>
        <div style="max-width: 600px; margin: 0 auto;">\${svgContent}</div>
      </div>

      <div class="page-break"></div>

      <h3>CHAPTER 2: MATRIX SUMMARY DIAGRAM & CORE CODES</h3>
      <p>Below is the complete calculation of your primary coordinates and key codes within the Destiny Matrix system:</p>

      <table>
        <thead>
          <tr>
            <th>Matrix Coordinate</th>
            <th>Code / Energy Arcana</th>
            <th>English Arcana Name</th>
            <th>Key Life Theme</th>
          </tr>
        </thead>
        <tbody>
          \${tableRows}
        </tbody>
      </table>

      <div class="page-break"></div>
      <h3>CHAPTER 3: 7-CHAKRA HEALTH MATRIX ANALYSIS</h3>
      <p>Your complete health map from Sahasrara to Muladhara, detailing physical, energy, and emotional levels.</p>

      <table>
        <thead>
          <tr><th>Chakra</th><th>Physical Level</th><th>Energy Level</th><th>Emotional Level</th></tr>
        </thead>
        <tbody>
          \${currentVals.derived?.chakras?.map(c => \`
            <tr>
              <td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">\${c.name} (\${c.zone})</td>
              <td style="padding:8px; border-bottom:1px solid #eee; text-align:center;">\${c.physical}</td>
              <td style="padding:8px; border-bottom:1px solid #eee; text-align:center;">\${c.energy}</td>
              <td style="padding:8px; border-bottom:1px solid #eee; text-align:center; font-weight:bold; color:#7C3AED;">\${c.emotional}</td>
            </tr>
          \`).join('') || ''}
        </tbody>
      </table>

    </body>
    </html>
  \`);
  win.document.close();
}

