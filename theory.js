/* 베이스 이론 계산, 복습 일정, 음 인식. 화면과 무관한 순수 함수만 둔다. */
(function (root) {
  "use strict";
  const SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
  const KO = {C:'도',D:'레',E:'미',F:'파',G:'솔',A:'라',B:'시'};
  const NAT = [0,2,4,5,7,9,11];
  // s=0 이 가장 굵은 4번 줄(E)
  const STR = [{n:'E',pc:4,midi:28,no:4},{n:'A',pc:9,midi:33,no:3},{n:'D',pc:2,midi:38,no:2},{n:'G',pc:7,midi:43,no:1}];
  const FRETS = 12;
  const pcAt = (s,f) => (STR[s].pc + f) % 12;
  const midiAt = (s,f) => STR[s].midi + f;
  const nm = (pc, flat) => (flat ? FLAT : SHARP)[((pc % 12) + 12) % 12];
  const both = pc => NAT.includes(pc) ? SHARP[pc] : SHARP[pc] + '/' + FLAT[pc];
  const isNat = pc => NAT.includes(pc);
  const strName = s => STR[s].n + '줄';
  const posName = (s,f) => STR[s].n + '줄 ' + (f ? f + '프렛' : '개방현');
  const allPos = (pc, maxF, strings) => {
    const o = []; maxF = maxF == null ? FRETS : maxF;
    for (let s = 0; s < 4; s++) { if (strings && !strings.includes(s)) continue;
      for (let f = 0; f <= maxF; f++) if (pcAt(s,f) === pc) o.push({s,f}); }
    return o;
  };
  const freqOf = midi => 440 * Math.pow(2, (midi - 69) / 12);

  const IVL = ['같은 음','단2도','장2도','단3도','장3도','완전4도','증4도','완전5도','단6도','장6도','단7도','장7도','옥타브'];
  const IVL_SHORT = ['R','b2','2','b3','3','4','b5','5','b6','6','b7','7','8'];
  const IVL_FEEL = ['',
    '바로 옆 칸입니다. 가장 긴장되는 소리입니다.',
    '스케일에서 옆 음으로 걸어갈 때 가장 흔한 거리입니다.',
    '어두운 느낌을 만듭니다. 마이너 코드의 3도입니다.',
    '밝은 느낌을 만듭니다. 메이저 코드의 3도입니다.',
    '옆 가는 줄의 같은 프렛입니다. 베이스 줄끼리의 간격과 같습니다.',
    '불안하게 들리는 음입니다. 블루스의 b5가 이 음입니다.',
    '루트 다음으로 많이 쓰는 음입니다. 파워코드의 5가 이 음입니다.',
    '5도에서 한 칸 위입니다. 마이너 스케일의 6도입니다.',
    '5도에서 두 칸 위입니다. 메이저 스케일의 6도입니다.',
    '옥타브에서 두 칸 아래입니다. 7코드와 m7 코드에 들어갑니다.',
    '옥타브에서 한 칸 아래입니다. maj7 코드에 들어갑니다.',
    '이름이 같은 높은 음입니다.'];
  // 루트에서 가는 줄 쪽으로 옮겨 가며 같은 음정을 찾는 모양
  function shapes(semi) {
    const out = [];
    const dir = d => d === 0 ? '같은 프렛' : (d > 0 ? d + '칸 위' : (-d) + '칸 아래');
    if (semi <= 5 && semi > 0) out.push('같은 줄에서 ' + semi + '칸 위');
    if (Math.abs(semi - 5) <= 3) out.push('한 줄 가는 쪽으로, ' + dir(semi - 5));
    if (Math.abs(semi - 10) <= 3) out.push('두 줄 가는 쪽으로, ' + dir(semi - 10));
    return out;
  }

  const SCALES = [
    {id:'mpent', name:'마이너 펜타토닉', st:[0,3,5,7,10], lb:['1','b3','4','5','b7'], par:9,
      desc:'내추럴 마이너에서 2도와 6도를 뺀 다섯 음입니다. 록 리프와 필인에서 가장 많이 씁니다.'},
    {id:'Mpent', name:'메이저 펜타토닉', st:[0,2,4,7,9], lb:['1','2','3','5','6'], par:0,
      desc:'메이저에서 4도와 7도를 뺀 다섯 음입니다. 밝은 곡의 라인에 잘 어울립니다.'},
    {id:'blues', name:'블루스', st:[0,3,5,6,7,10], lb:['1','b3','4','b5','5','b7'], par:9,
      desc:'마이너 펜타토닉에 b5를 더했습니다. b5는 머물지 않고 지나가는 음으로 씁니다.'},
    {id:'major', name:'메이저', st:[0,2,4,5,7,9,11], lb:['1','2','3','4','5','6','7'], par:0,
      desc:'도수 번호의 기준이 되는 스케일입니다. 칸 간격은 2 2 1 2 2 2 1입니다.'},
    {id:'minor', name:'내추럴 마이너', st:[0,2,3,5,7,8,10], lb:['1','2','b3','4','5','b6','b7'], par:9,
      desc:'메이저에서 3도, 6도, 7도를 한 칸씩 내린 스케일입니다.'},
    {id:'dorian', name:'도리안', st:[0,2,3,5,7,9,10], lb:['1','2','b3','4','5','6','b7'], par:2,
      desc:'내추럴 마이너에서 6도만 한 칸 올렸습니다. 펑크(Funk)와 록에서 자주 씁니다.'},
    {id:'mixo', name:'믹솔리디안', st:[0,2,4,5,7,9,10], lb:['1','2','3','4','5','6','b7'], par:7,
      desc:'메이저에서 7도만 한 칸 내렸습니다. 7코드 위에서 씁니다.'},
    {id:'phrygian', name:'프리지안', st:[0,1,3,5,7,8,10], lb:['1','b2','b3','4','5','b6','b7'], par:4,
      desc:'내추럴 마이너에서 2도를 한 칸 내렸습니다. 루트 바로 위 반음이 특징인 메탈 사운드입니다.'},
    {id:'lydian', name:'리디안', st:[0,2,4,6,7,9,11], lb:['1','2','3','#4','5','6','7'], par:5,
      desc:'메이저에서 4도를 한 칸 올렸습니다.'},
  ];
  const FLAT_KEYS = [5,10,3,8,1];
  const scaleFlat = (root, sc) => FLAT_KEYS.includes((root - sc.par + 12) % 12);
  const spell = (root, sc, i) => nm((root + sc.st[i]) % 12, scaleFlat(root, sc) || sc.lb[i] === 'b5');

  const CHORDS = [
    {id:'5',    suf:'5',    read:'파워코드',          t:[0,7],       lb:['루트','5도']},
    {id:'maj',  suf:'',     read:'메이저',            t:[0,4,7],     lb:['루트','장3도','5도']},
    {id:'m',    suf:'m',    read:'마이너',            t:[0,3,7],     lb:['루트','단3도','5도']},
    {id:'7',    suf:'7',    read:'세븐',              t:[0,4,7,10],  lb:['루트','장3도','5도','단7도']},
    {id:'m7',   suf:'m7',   read:'마이너 세븐',        t:[0,3,7,10],  lb:['루트','단3도','5도','단7도']},
    {id:'maj7', suf:'maj7', read:'메이저 세븐',        t:[0,4,7,11],  lb:['루트','장3도','5도','장7도']},
    {id:'sus4', suf:'sus4', read:'서스포',            t:[0,5,7],     lb:['루트','완전4도','5도']},
    {id:'m7b5', suf:'m7b5', read:'마이너 세븐 플랫 파이브', t:[0,3,6,10], lb:['루트','단3도','감5도','단7도']},
  ];
  const chordById = id => CHORDS.find(c => c.id === id);
  const ROOT_NAMES = ['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
  const rootFlat = pc => ROOT_NAMES[pc].includes('b') || pc === 5;

  // 리듬: 16칸(한 마디, 16분음표 단위)
  const RHYTHMS = [
    {id:'q',   name:'4분음표',     s:[0,4,8,12],                 count:'하나 둘 셋 넷'},
    {id:'e',   name:'8분음표',     s:[0,2,4,6,8,10,12,14],       count:'하나 엔 둘 엔 셋 엔 넷 엔'},
    {id:'off', name:'8분 뒷박',    s:[2,6,10,14],                count:'(하나) 엔 (둘) 엔 (셋) 엔 (넷) 엔'},
    {id:'qe',  name:'4분과 8분',   s:[0,4,6,8,12,14],            count:'하나 둘 엔 셋 넷 엔'},
    {id:'s',   name:'16분음표',    s:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], count:'1 e & a 2 e & a'},
    {id:'gal', name:'말달리기',    s:[0,2,3,4,6,7,8,10,11,12,14,15], count:'1 & a 2 & a'},
    {id:'332', name:'당김음 3 3 2', s:[0,3,6,8,11,14],           count:'세 칸, 세 칸, 두 칸 간격으로 두 번'},
    {id:'push',name:'넷째 박 당기기', s:[0,4,8,14],               count:'하나 둘 셋 (넷) 엔'},
    // 셋잇단: 한 박을 셋으로 (12칸)
    {id:'trip', name:'셋잇단 8분', n:12, sub:3, s:[0,1,2,3,4,5,6,7,8,9,10,11], count:'1 트 렛 2 트 렛', cnt:['1','트','렛','2','트','렛','3','트','렛','4','트','렛']},
    {id:'shuf', name:'셔플', n:12, sub:3, s:[0,2,3,5,6,8,9,11], count:'따-다 따-다 (긴 음, 짧은 음)', cnt:['1','트','렛','2','트','렛','3','트','렛','4','트','렛']},
    {id:'q3',   name:'4분과 셋잇단', n:12, sub:3, s:[0,3,4,5,6,9,10,11], count:'하나 둘트렛 셋 넷트렛', cnt:['1','트','렛','2','트','렛','3','트','렛','4','트','렛']},
    // 홀수 박자: 8분음표 단위
    {id:'78a', name:'7/8 (2+2+3)', n:7, sub:2, acc:[0,2,4], s:[0,2,4], count:'하나둘 하나둘 하나둘셋', cnt:['1','2','1','2','1','2','3']},
    {id:'78b', name:'7/8 (3+2+2)', n:7, sub:2, acc:[0,3,5], s:[0,3,5], count:'하나둘셋 하나둘 하나둘', cnt:['1','2','3','1','2','1','2']},
    {id:'78c', name:'7/8 (2+3+2)', n:7, sub:2, acc:[0,2,5], s:[0,2,5], count:'하나둘 하나둘셋 하나둘', cnt:['1','2','1','2','3','1','2']},
    {id:'54a', name:'5/4 (3+2)', n:10, sub:2, acc:[0,6], s:[0,2,4,6,8], count:'하나 둘 셋 하나 둘', cnt:['1','&','2','&','3','&','1','&','2','&']},
    {id:'54b', name:'5/4 (2+3)', n:10, sub:2, acc:[0,4], s:[0,3,4,7,8], count:'하나 둘 하나 둘 셋', cnt:['1','&','2','&','1','&','2','&','3','&']},
    {id:'54c', name:'5/4 8분음표', n:10, sub:2, acc:[0,6], s:[0,1,2,3,4,5,6,7,8,9], count:'하나엔 둘엔 셋엔 하나엔 둘엔', cnt:['1','&','2','&','3','&','1','&','2','&']},
  ];
  RHYTHMS.forEach(r => { r.n = r.n || 16; r.sub = r.sub || 4; r.acc = r.acc || Array.from({length:r.n / r.sub}, (_, k) => k * r.sub); });

  /* ---------- 복습 일정 (라이트너 상자) ---------- */
  const BOX_DAYS = [0, 1, 2, 4, 8, 16];
  function srsUpdate(item, ok, today) {
    item = item || {box: 0, due: today, seen: 0, right: 0};
    item.seen++; if (ok) item.right++;
    item.box = ok ? Math.min(5, item.box + 1) : 1;
    item.due = addDays(today, ok ? BOX_DAYS[item.box] : 1);
    item.last = today;
    return item;
  }
  function addDays(key, n) {
    const [y,m,d] = key.split('-').map(Number);
    const t = new Date(y, m - 1, d + n);
    return dayKey(t);
  }
  const dayKey = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  const dueItems = (items, today) => Object.keys(items).filter(k => items[k].due <= today).sort((a, b) => items[a].box - items[b].box);

  /* ---------- 음 인식 (McLeod 피치 방식) ---------- */
  // buf: Float32Array, sr: 샘플레이트. 반환 {freq, clarity} 또는 null
  function detectPitch(buf, sr, minF = 35, maxF = 420) {
    const n = buf.length;
    let rms = 0, mean = 0;
    for (let i = 0; i < n; i++) mean += buf[i];
    mean /= n;
    const x = new Float32Array(n);
    for (let i = 0; i < n; i++) { x[i] = buf[i] - mean; rms += x[i] * x[i]; }
    rms = Math.sqrt(rms / n);
    if (rms < 0.004) return null;
    const minLag = Math.floor(sr / maxF), maxLag = Math.min(Math.floor(sr / minF), Math.floor(n / 2));
    const nsdf = new Float32Array(maxLag + 2);
    for (let tau = minLag; tau <= maxLag + 1; tau++) {
      let acf = 0, m = 0;
      const len = n - tau;
      for (let i = 0; i < len; i++) { acf += x[i] * x[i + tau]; m += x[i] * x[i] + x[i + tau] * x[i + tau]; }
      nsdf[tau] = m > 0 ? 2 * acf / m : 0;
    }
    // 양수 구간마다 최고점을 모은다
    const peaks = [];
    let tau = minLag;
    while (tau <= maxLag && nsdf[tau] > 0) tau++;
    while (tau <= maxLag) {
      while (tau <= maxLag && nsdf[tau] <= 0) tau++;
      let best = -1, bi = -1;
      while (tau <= maxLag && nsdf[tau] > 0) { if (nsdf[tau] > best) { best = nsdf[tau]; bi = tau; } tau++; }
      if (bi > 0) peaks.push(bi);
    }
    if (!peaks.length) return null;
    let maxV = 0; peaks.forEach(p => { if (nsdf[p] > maxV) maxV = nsdf[p]; });
    const thr = 0.88 * maxV;
    const p = peaks.find(q => nsdf[q] >= thr);
    // 꼭짓점 보간
    const a = nsdf[p - 1], b = nsdf[p], c = nsdf[p + 1];
    const den = a - 2 * b + c;
    const shift = den ? 0.5 * (a - c) / den : 0;
    const period = p + shift;
    return {freq: sr / period, clarity: b, rms};
  }
  const midiFromFreq = f => 69 + 12 * Math.log2(f / 440);

  const api = {SHARP, FLAT, KO, NAT, STR, FRETS, pcAt, midiAt, nm, both, isNat, strName, posName, allPos, freqOf,
    IVL, IVL_SHORT, IVL_FEEL, shapes, SCALES, scaleFlat, spell, CHORDS, chordById, ROOT_NAMES, rootFlat, RHYTHMS,
    BOX_DAYS, srsUpdate, addDays, dayKey, dueItems, detectPitch, midiFromFreq};
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.TH = api;
})(this);
