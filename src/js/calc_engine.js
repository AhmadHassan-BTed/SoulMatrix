/* ═══════════════════════════════════════════════════════════
   SOUL BLUEPRINT MATRIX - CALCULATION ENGINE
   Module: src/js/calc_engine.js
═══════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════════════
function red(n) {
  while (n > 22) n = [...String(n)].reduce((a, d) => a + parseInt(d), 0);
  return n;
}

function calc(day, mon, yr) {
  const A = red(day), B = red(mon);
  const C = red([...String(yr)].reduce((a, d) => a + parseInt(d), 0));
  const D = red(A+B+C), E = red(A+B+C+D);
  const F = red(A+B), G = red(B+C), H = red(C+D), I = red(D+A);

  const A2 = red(A+E), A1 = red(A+A2);
  const B2 = red(B+E), B1 = red(B+B2);
  const K = red(C+E),  C1 = red(C+K);
  const J = red(D+E),  D1 = red(D+J);

  const L = red(K+J), M = red(J+L), N = red(K+L);
  const Q = C1;
  const O = red(A2+E), P = red(B2+E), OP = red(O+P);
  const S = J, T = K;
  const L2 = red(F+G+H+I), L1 = red(E+L2);
  const F2 = red(F+L2), G2 = red(G+L2), H2 = red(H+L2), I2 = red(I+L2);
  const F1 = red(F+F2), G1 = red(G+G2), H1 = red(H+H2), I1 = red(I+I2);
  const R = red(M+L), R1 = red(R+M), R2 = red(R+L);
  const U1 = red(A+B), U2 = red(C+D), U3 = red(U1+U2);

  const earth = red(A+C), sky = red(B+D);
  const personalPurpose = red(earth+sky);
  const paternalP = red(F+H), maternalP = red(G+I);
  const socialPurpose = red(paternalP+maternalP);
  const spiritualPurpose = red(personalPurpose+socialPurpose);

  const ckDef = [
    ['Sahasrara','Crown',A,B],['Ajna','Third Eye',O,P],['Vishuddha','Throat',J,K],
    ['Anahata','Heart',S,T],['Manipura','Solar Plexus',E,E],
    ['Svadhisthana','Sacral',L,M],['Muladhara','Root',C,D]
  ];
  const chakras = ckDef.map(([name,zone,ph,en]) => ({name,zone,physical:ph,energy:en,emotional:red(ph+en)}));
  const sum = k => chakras.reduce((a,c) => a + c[k], 0);
  const chakraTotals = {physical:red(sum('physical')), energy:red(sum('energy')), emotional:red(sum('emotional'))};

  const ageVals = {};
  const sectorCorners = [
    ['A', 'F'], ['F', 'B'], ['B', 'G'], ['G', 'C'],
    ['C', 'H'], ['H', 'D'], ['D', 'I'], ['I', 'A']
  ];
  const cornerValues = { A, F, B, G, C, H, D, I };
  sectorCorners.forEach(([c1, c2], sectorIdx) => {
    const startAge = sectorIdx * 10;
    const v1 = cornerValues[c1];
    const v2 = cornerValues[c2];
    const vm = red(v1 + v2);
    const vq1 = red(v1 + vm);
    const vq2 = red(vm + v2);
    const ve1 = red(v1 + vq1);
    const ve2 = red(vq1 + vm);
    const ve3 = red(vm + vq2);
    const ve4 = red(vq2 + v2);
    
    ageVals[`age${startAge + 1.25}`] = ve1;
    ageVals[`age${startAge + 2.5}`] = vq1;
    ageVals[`age${startAge + 3.75}`] = ve2;
    ageVals[`age${startAge + 5}`] = vm;
    ageVals[`age${startAge + 6.25}`] = ve3;
    ageVals[`age${startAge + 7.5}`] = vq2;
    ageVals[`age${startAge + 8.75}`] = ve4;
  });

  return Object.assign({A,B,C,D,E,F,G,H,I,J,K,L,M,O,P,OP,Q,N,S,T,L2,L1,F2,G2,H2,I2,F1,G1,H1,I1,R,R1,R2,U1,U2,U3}, ageVals, {
    derived:{earth,sky,personalPurpose,paternalP,maternalP,socialPurpose,spiritualPurpose,chakras,chakraTotals}});
}

function calculateAge(day, month, year) {
  const today = new Date();
  let age = today.getFullYear() - year;
  const m = today.getMonth() + 1 - month;
  if (m < 0 || (m === 0 && today.getDate() < day)) {
    age--;
  }
  return age;
}

function getAgeNodeKey(age) {
  age = age % 80;
  if (age < 0) age += 80;
  const S = Math.floor(age / 10) * 10;
  const rem = age % 10;
  const cornerKeys = ['A', 'F', 'B', 'G', 'C', 'H', 'D', 'I'];
  const sectorIdx = Math.floor(age / 10);
  if (rem === 0) {
    return cornerKeys[sectorIdx];
  } else if (rem === 1 || rem === 2) {
    return `age${S + 1.25}`;
  } else if (rem === 3) {
    return `age${S + 2.5}`;
  } else if (rem === 4) {
    return `age${S + 3.75}`;
  } else if (rem === 5) {
    return `age${S + 5}`;
  } else if (rem === 6 || rem === 7) {
    return `age${S + 6.25}`;
  } else if (rem === 8) {
    return `age${S + 7.5}`;
  } else if (rem === 9) {
    return `age${S + 8.75}`;
  }
}

function getPersonalForecast(v, day, mon, yr) {
  const age = calculateAge(day, mon, yr);
  const currentEnergyKey = getAgeNodeKey(age);
  const currentEnergy = v[currentEnergyKey];
  const secondAge = age <= 40 ? (age + 40) : (age - 40);
  const keyEnergyKey = getAgeNodeKey(Math.round(secondAge));
  const keyEnergy = v[keyEnergyKey];
  const outcome = red(currentEnergy + keyEnergy);
  return {
    age, currentEnergyKey, currentEnergy,
    secondAge, keyEnergyKey, keyEnergy, outcome
  };
}

function getCompatibilityForecast(day1, mon1, yr1, day2, mon2, yr2) {
  const v1 = calc(day1, mon1, yr1);
  const f1 = getPersonalForecast(v1, day1, mon1, yr1);
  const v2 = calc(day2, mon2, yr2);
  const f2 = getPersonalForecast(v2, day2, mon2, yr2);
  const coupleCurrent = red(f1.currentEnergy + f2.currentEnergy);
  const coupleKey = red(f1.keyEnergy + f2.keyEnergy);
  const coupleOutcome = red(f1.outcome + f2.outcome);
  return {
    p1: f1, p2: f2,
    currentEnergy: coupleCurrent,
    keyEnergy: coupleKey,
    outcome: coupleOutcome
  };
}

function getAgeForecastEnergiesSingle(ageKey, v) {
  const age = parseFloat(ageKey.substring(3));
  const energy1 = v[ageKey] || 0;
  const secondAge = age <= 40 ? (age + 40) : (age - 40);
  const keyEnergyKey = getAgeNodeKey(Math.round(secondAge));
  const energy2 = v[keyEnergyKey] || 0;
  const energy3 = red(energy1 + energy2);
  return [energy1, energy2, energy3];
}

function getAgeForecastEnergiesCompat(ageKey, v) {
  const v1 = v.v1 || {};
  const v2 = v.v2 || {};
  
  const f1_current = v1[ageKey] || 0;
  const age = parseFloat(ageKey.substring(3));
  const secondAge = age <= 40 ? (age + 40) : (age - 40);
  const keyEnergyKey = getAgeNodeKey(Math.round(secondAge));
  const f1_key = v1[keyEnergyKey] || 0;
  const f1_outcome = red(f1_current + f1_key);
  
  const f2_current = v2[ageKey] || 0;
  const f2_key = v2[keyEnergyKey] || 0;
  const f2_outcome = red(f2_current + f2_key);
  
  const coupleCurrent = red(f1_current + f2_current);
  const coupleKey = red(f1_key + f2_key);
  const coupleOutcome = red(f1_outcome + f2_outcome);
  
  return [coupleCurrent, coupleKey, coupleOutcome];
}



function calcCompatibility(d1, m1, y1, d2, m2, y2) {
  const v1 = calc(d1, m1, y1);
  const v2 = calc(d2, m2, y2);
  
  const v_comb = {};
  
  Object.keys(v1).forEach(key => {
    if (key !== 'derived') {
      v_comb[key] = red(v1[key] + v2[key]);
    }
  });
  
  const A = v_comb.A, B = v_comb.B, C = v_comb.C, D = v_comb.D, E = v_comb.E;
  const F = v_comb.F, G = v_comb.G, H = v_comb.H, I = v_comb.I;
  const J = v_comb.J, K = v_comb.K, L = v_comb.L, M = v_comb.M;
  const O = v_comb.O, P = v_comb.P;
  const S = v_comb.S, T = v_comb.T;
  
  const earth = red(A+C), sky = red(B+D);
  const personalPurpose = red(earth+sky);
  const paternalP = red(F+H), maternalP = red(G+I);
  const socialPurpose = red(paternalP+maternalP);
  const spiritualPurpose = red(personalPurpose+socialPurpose);
  
  const ckDef = [
    ['Sahasrara','Crown',A,B],['Ajna','Third Eye',O,P],['Vishuddha','Throat',J,K],
    ['Anahata','Heart',S,T],['Manipura','Solar Plexus',E,E],
    ['Svadhisthana','Sacral',L,M],['Muladhara','Root',C,D]
  ];
  const chakras = ckDef.map(([name,zone,ph,en]) => ({name,zone,physical:ph,energy:en,emotional:red(ph+en)}));
  const sum = k => chakras.reduce((a,c) => a + c[k], 0);
  const chakraTotals = {physical:red(sum('physical')), energy:red(sum('energy')), emotional:red(sum('emotional'))};
  
  v_comb.v1 = v1;
  v_comb.v2 = v2;
  v_comb.derived = {earth, sky, personalPurpose, paternalP, maternalP, socialPurpose, spiritualPurpose, chakras, chakraTotals};
  
  return v_comb;
}

