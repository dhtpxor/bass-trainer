/* 베이스와 기타 트레이너: 화면, 저장, 소리, 마이크, 문제 */
"use strict";
const {STR, SHARP, FLAT, NAT, pcAt, midiAt, nm, both, isNat, strName, posName, allPos, IVL, IVL_SHORT, IVL_FEEL, shapes,
  SCALES, scaleFlat, spell, CHORDS, chordById, ROOT_NAMES, rootFlat, RHYTHMS} = TH;
let UNITS = CT.UNITS, LESSONS = CT.LESSONS;
const NS = () => STR.length;
const instName = () => TH.inst().name;

/* ---------- 작은 도구 ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function el(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const vibrate = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };
let toastT = 0;
function toast(msg) { let t = $('#toast'); if (!t) { t = el('<div class="toast" id="toast" role="status"></div>'); document.body.appendChild(t); }
  t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2600); }

const I = {
  today:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
  learn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2z"/><path d="M22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z"/></svg>',
  practice:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6l4 18H5z"/><path d="M12 16l5-9"/><path d="M8 13h8"/></svg>',
  records:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18"/><path d="M6 20v-7"/><path d="M11 20V6"/><path d="M16 20v-10"/><path d="M21 20v-4"/></svg>',
  chev:'<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z"/></svg>',
  stop:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  sound:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',
  tip:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/></svg>',
  lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>',
  tuner:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 16a8 8 0 0 1 16 0"/><path d="M12 16l3-6"/></svg>',
  metro:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6l4 18H5z"/><path d="M12 16l5-9"/></svg>',
  dots:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="8" r="2.2"/><circle cx="12" cy="14" r="2.2"/><circle cx="18" cy="8" r="2.2"/><path d="M3 4h18v1.5H3zM3 18.5h18V20H3z" opacity=".5"/></svg>',
  ivl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="6" cy="17" r="3"/><circle cx="18" cy="7" r="3"/><path d="M8.5 15l7-6"/></svg>',
  chord:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="7" r="2.5"/><circle cx="12" cy="17" r="2.5"/></svg>',
  scale:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 19h4v-4h4v-4h4V7h4"/></svg>',
  ear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-6 0"/><path d="M10 9a2 2 0 0 1 4 0"/></svg>',
  tap:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7" opacity=".5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>',
  target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>',
  share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>',
  okc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M7.5 12.5l3 3 6-6.5"/></svg>',
  noc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7"/></svg>',
};
const starsOf = best => best >= 10 ? 3 : best >= 9 ? 2 : best >= 8 ? 1 : 0;
const starsHtml = n => `<div class="stars" aria-label="별 ${n}개">${[0,1,2].map(k => I.star.replace('<svg', `<svg class="${k < n ? 'on' : ''}"`)).join('')}</div>`;

/* ---------- 저장 ---------- */
const KEY = 'bassTrainer.v1';
function fresh() { return {lessons:{}, items:{}, days:{}, tot:{}, xp:0, onboarded:false, inst:'bass', by:{}, settings:{sound:true, orient:'auto', unlockAll:false, mic:false, theme:'stage', startTier:1}}; }
let D = fresh();
try { const x = JSON.parse(localStorage.getItem(KEY)); if (x && (x.lessons || x.by)) D = Object.assign(fresh(), x, {settings:Object.assign(fresh().settings, x.settings || {})}); } catch (e) {}
function save() { try { const {lessons, items, tot, ...rest} = D; localStorage.setItem(KEY, JSON.stringify(rest)); } catch (e) {} }
/* 악기마다 진도, 복습 문제, 정답 기록, 시작 등급을 따로 둔다 */
function bindInst(id) {
  if (!D.by) D.by = {};
  if (!D.by.bass && D.lessons && Object.keys(D.lessons).length + Object.keys(D.items || {}).length) D.by.bass = {lessons:D.lessons, items:D.items || {}, tot:D.tot || {}, startTier:D.settings.startTier || 1};
  if (!['bass','guitar'].includes(id)) id = 'bass';
  const b = D.by[id] || (D.by[id] = {lessons:{}, items:{}, tot:{}, startTier:1});
  D.inst = id; D.lessons = b.lessons; D.items = b.items; D.tot = b.tot;
  TH.setInstrument(id); const set = CT.sets[id] || CT.sets.bass; UNITS = set.UNITS; LESSONS = set.LESSONS;
}
function setInst(id) { bindInst(id); save(); }
bindInst(D.inst || 'bass');
const today = () => TH.dayKey();
function dayRec(k = today()) { return D.days[k] || (D.days[k] = {steps:{}, q:{}}); }
const SKILL_NAMES = {basics:'기초', notes:'음 위치', intervals:'음정', chords:'코드톤', scales:'스케일', rhythm:'리듬', tech:'지식과 주법'};
function record(skill, key, ok) {
  const d = dayRec(); const r = d.q[skill] || (d.q[skill] = [0, 0]); r[1]++; if (ok) r[0]++;
  const t = D.tot[skill] || (D.tot[skill] = [0, 0]); t[1]++; if (ok) t[0]++;
  if (key) D.items[key] = TH.srsUpdate(D.items[key], ok, today());
  save();
}
function stepsOf(d = dayRec()) { if (!d.st) d.st = {}; if (d.steps && Object.keys(d.steps).length && !d.st.bass) { d.st.bass = d.steps; } return d.st[D.inst] || (d.st[D.inst] = {}); }
function setStep(name) { const d = dayRec(); stepsOf(d)[name] = true; checkDay(); save(); }
function checkDay() {
  const d = dayRec(); const st = stepsOf(d);
  const reviewOk = st.review || reviewKeys().length === 0;
  if (reviewOk && st.lesson && st.play && !d.done) { d.done = true; save(); addXP(20); toast('오늘 연습을 모두 마쳤습니다. 보너스 20 XP'); }
}
function streak() {
  let n = 0; const d = new Date();
  if (!(D.days[TH.dayKey(d)] || {}).done) d.setDate(d.getDate() - 1);
  while ((D.days[TH.dayKey(d)] || {}).done) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
/* 경험치와 레벨: 레벨 L이 되려면 100 x L(L-1)/2 XP */
const LV_TITLES = [[1,'첫 줄을 튕긴 날'],[3,'연습실 단골'],[5,'합주 준비 완료'],[7,'세션 연주자'],[10,'그루브 마스터']];
function levelInfo(xp = D.xp || 0) {
  const level = Math.floor((Math.sqrt(1 + 8 * xp / 100) - 1) / 2) + 1, base = 100 * (level - 1) * level / 2, next = 100 * level * (level + 1) / 2;
  const title = LV_TITLES.filter(t => level >= t[0]).pop()[1];
  return {level, into:xp - base, need:next - base, pct:Math.round((xp - base) / (next - base) * 100), title};
}
function updateChip() { const c = $('#lvchip'); if (c) c.innerHTML = '<span class="led amber"></span>Lv ' + levelInfo().level; const ic = $('#instchip'); if (ic) ic.innerHTML = esc(instName()) + '<span class="caret" aria-hidden="true">▾</span>'; }
function xpPop(t) { const e = el(`<div class="xp-pop">${esc(t)}</div>`); document.body.appendChild(e); setTimeout(() => e.remove(), 1100); }
function addXP(n, pop) {
  const before = levelInfo().level; D.xp = (D.xp || 0) + n; save(); updateChip();
  if (pop) xpPop('+' + n + ' XP');
  const after = levelInfo().level; if (after > before) setTimeout(() => toast('레벨 ' + after + '이 되었습니다. ' + levelInfo().title), pop ? 900 : 0);
}
const lessonIndex = id => LESSONS.findIndex(l => l.id === id);
const isDone = id => !!(D.lessons[id] && D.lessons[id].done);
const startTier = () => (D.by && D.by[D.inst] && D.by[D.inst].startTier) || 1;
function setStartTier(t) { D.by[D.inst].startTier = t; save(); }
function currentLesson() { return LESSONS.find(l => l.unit >= startTier() && !isDone(l.id)) || LESSONS.find(l => !isDone(l.id)) || null; }
function isOpen(l) {
  if (D.settings.unlockAll || isDone(l.id) || l.unit < startTier()) return true;
  const i = lessonIndex(l.id); if (i === 0) return true;
  if (l.unit === startTier() && LESSONS[i - 1].unit < l.unit) return true;
  return isDone(LESSONS[i - 1].id);
}
const tierName = u => (UNITS.find(x => x.id === u) || {}).name || '';
function reviewKeys() { return TH.dueItems(D.items, today()); }

/* ---------- 소리 ---------- */
const AU = {
  ctx: null,
  get() { if (!this.ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; this.ctx = new C(); }
    if (this.ctx.state === 'suspended') this.ctx.resume(); return this.ctx; },
  now() { const a = this.get(); return a ? a.currentTime : 0; },
  pluck(midi, when, dur = .55) {
    if (!D.settings.sound) return; const a = this.get(); if (!a) return;
    try { const t = when || a.currentTime, f = 440 * Math.pow(2, (midi + 12 - 69) / 12);
      const g = a.createGain(), lp = a.createBiquadFilter(), o1 = a.createOscillator(), o2 = a.createOscillator(), g2 = a.createGain();
      const gtr = D.inst === 'guitar';
      o1.type = 'sawtooth'; o1.frequency.value = f; o2.type = gtr ? 'triangle' : 'sine'; o2.frequency.value = gtr ? f * 2 : f / 2; g2.gain.value = gtr ? .25 : .6;
      lp.type = 'lowpass'; lp.Q.value = 2; lp.frequency.setValueAtTime(gtr ? 4200 : 1800, t); lp.frequency.exponentialRampToValueAtTime(gtr ? 900 : 280, t + dur * .8);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.42, t + .008); g.gain.exponentialRampToValueAtTime(.18, t + .12); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o1.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); g.connect(a.destination);
      o1.start(t); o2.start(t); o1.stop(t + dur + .05); o2.stop(t + dur + .05);
    } catch (e) {}
  },
  click(when, accent) {
    if (!D.settings.sound) return; const a = this.get(); if (!a) return;
    try { const o = a.createOscillator(), g = a.createGain(); o.type = 'square'; o.frequency.value = accent ? 1900 : 1250;
      g.gain.setValueAtTime(accent ? .16 : .1, when); g.gain.exponentialRampToValueAtTime(.0001, when + .035);
      o.connect(g); g.connect(a.destination); o.start(when); o.stop(when + .05); } catch (e) {}
  },
  strum(id, down = true) { const sh = TH.GSHAPES[id]; if (!sh) return; const t0 = this.now() + .05; let k = 0;
    const idx = [0,1,2,3,4,5]; (down ? idx : idx.reverse()).forEach(s => { if (sh.f[s] >= 0) this.pluck(midiAt(s, sh.f[s]), t0 + (k++) * .028, 1.1); }); },
  seq(list, gap = .42, delay = .05) { const t0 = this.now() + delay; list.forEach((p, i) => this.pluck(midiAt(p[0], p[1]), t0 + i * gap)); return list.length * gap; },
};

/* 박자 시계: 앞으로 0.15초 분량을 미리 예약하고, 화면은 소리가 나는 순간에 맞춘다 */
const Clock = {
  on:false, n:0, next:0, timer:0, q:[], log:[], bpm:70, sub:4, cb:null, ui:null, onstop:null,
  start({bpm, sub, tick, ui, onstop, bars, total}) {
    this.stop(); const a = AU.get(); if (!a) return;
    Object.assign(this, {on:true, n:0, q:[], log:[], bpm, sub, cb:tick, ui, onstop, end: total || (bars ? bars * 4 * sub : 0)});
    this.next = a.currentTime + .12; clearInterval(this.timer); this.timer = setInterval(() => this.pump(), 25); this.pump();
    const loop = () => { if (!this.on) return; const now = a.currentTime;
      while (this.q.length && this.q[0][1] <= now) { const [n] = this.q.shift(); if (this.ui) this.ui(n); }
      if (this.end && this.n >= this.end && !this.q.length) { setTimeout(() => this.stop(), 60000 / this.bpm / this.sub); return; }
      requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  },
  pump() { const a = AU.ctx; if (!a) return;
    while (this.next < a.currentTime + .15 && (!this.end || this.n < this.end)) {
      this.cb && this.cb(this.n, this.next); this.q.push([this.n, this.next]); this.log.push([this.n, this.next]);
      if (this.log.length > 128) this.log.shift(); this.next += 60 / this.bpm / this.sub; this.n++; } },
  stop() { if (!this.on) return; this.on = false; clearInterval(this.timer); const f = this.onstop; this.onstop = null; if (f) f(); },
};

/* ---------- 마이크 음 인식 ---------- */
const Mic = {
  on:false, stream:null, src:null, an:null, buf:null, timer:0, hist:[], cb:null, err:'',
  supported() { return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) && window.isSecureContext; },
  async start(cb) {
    this.cb = cb; if (this.on) return true;
    if (!this.supported()) { this.err = '이 화면에서는 마이크를 쓸 수 없습니다. 설치한 앱이나 앱 주소로 열어 주세요.'; return false; }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false, noiseSuppression:false, autoGainControl:false}});
      const a = AU.get(); this.src = a.createMediaStreamSource(this.stream); this.an = a.createAnalyser(); this.an.fftSize = 4096;
      this.src.connect(this.an); this.buf = new Float32Array(this.an.fftSize); this.on = true; this.hist = [];
      this.timer = setInterval(() => this.tick(), 70); return true;
    } catch (e) { this.err = '마이크 사용이 허용되지 않았습니다. 폰 설정에서 이 앱의 마이크 권한을 켜 주세요.'; return false; }
  },
  tick() {
    this.an.getFloatTimeDomainData(this.buf);
    const r = TH.detectPitch(this.buf, AU.ctx.sampleRate, TH.inst().minF, TH.inst().maxF);
    if (!r || r.clarity < .82) { this.hist = []; this.cb && this.cb(null); return; }
    const m = TH.midiFromFreq(r.freq), mid = Math.round(m);
    this.hist.push(mid); if (this.hist.length > 3) this.hist.shift();
    const stable = this.hist.length === 3 && this.hist.every(x => x === mid);
    this.cb && this.cb({freq:r.freq, midi:mid, cents:Math.round((m - mid) * 100), pc:((mid % 12) + 12) % 12, stable, clarity:r.clarity});
  },
  stop() { clearInterval(this.timer); this.on = false; this.cb = null;
    try { this.stream && this.stream.getTracks().forEach(t => t.stop()); this.src && this.src.disconnect(); } catch (e) {}
    this.stream = null; },
};

/* 화면 켜짐 유지(연습 중) */
const Wake = { lock:null, async on() { try { if ('wakeLock' in navigator && !this.lock) { this.lock = await navigator.wakeLock.request('screen'); this.lock.addEventListener('release', () => this.lock = null); } } catch (e) {} },
  off() { try { this.lock && this.lock.release(); } catch (e) {} this.lock = null; } };

/* ---------- 지판 ---------- */
function orient() { const o = D.settings.orient; if (o === 'v' || o === 'h') return o; return (innerWidth > innerHeight && innerWidth >= 600) ? 'h' : 'v'; }
const DOT = {root:['var(--root)','var(--on-root)'], tone:['var(--tone)','var(--on-tone)'], ok:['var(--good)','#04140b'], bad:['var(--bad)','#ffffff'], ask:['var(--ask)','#03131c'],
  dim:['var(--dim,#3a332e)','var(--on-dim,#b9b1a4)'], ghost:['var(--surface)','var(--ink)']};
function board(o) {
  o = Object.assign({from:0, to:12, dots:[], hiS:null, tap:null, small:false}, o);
  const v = (o.orient || orient()) === 'v';
  const first = o.from === 0 ? 1 : o.from, rows = o.to - first + 1;
  let W, H, P;
  const N = NS(), last = N - 1;
  if (v) { const SX = N > 4 ? 46 : 66, RH = o.small ? 34 : 38, top = 36, left = N > 4 ? 44 : 50;
    P = (s, f) => ({x:left + s * SX, y:f === 0 && o.from === 0 ? 18 : top + (f - first + .5) * RH});
    W = left + last * SX + 40; H = top + rows * RH + 8;
    var cell = {w:SX, h:RH}, geo = {top, left, RH, SX};
  } else { const CW = o.small ? 48 : 56, RH = N > 4 ? 32 : 40, top = 12, left = o.from === 0 ? 44 : 24;
    P = (s, f) => ({x:f === 0 && o.from === 0 ? 20 : left + (f - first + .5) * CW, y:top + (last - s) * RH + RH / 2});
    W = left + rows * CW + 10; H = top + N * RH + 24;
    var cell = {w:CW, h:RH}, geo = {top, left, CW, RH};
  }
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${instName()} 지판 그림">`;
  if (v) {
    const {top, left, RH, SX} = geo, x0 = left - SX / 2 + 6, x1 = left + last * SX + SX / 2 - 6;
    s += `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${rows * RH}" rx="3" fill="var(--wood)"/>`;
    for (let f = first; f <= o.to; f++) { const y = top + (f - first + .5) * RH, cx = (x0 + x1) / 2;
      if ([3,5,7,9].includes(f)) s += `<circle cx="${cx}" cy="${y}" r="5" fill="var(--inlay)"/>`;
      if (f === 12) s += `<circle cx="${left + SX * (last / 2 - 1)}" cy="${y}" r="5" fill="var(--inlay)"/><circle cx="${left + SX * (last / 2 + 1)}" cy="${y}" r="5" fill="var(--inlay)"/>`;
      s += `<text x="16" y="${y}" font-size="13" fill="var(--muted)" text-anchor="middle" dominant-baseline="central">${f}</text>`; }
    for (let f = first - 1; f <= o.to; f++) { const y = top + (f - first + 1) * RH, nut = f === 0;
      s += `<rect x="${x0}" y="${y - (nut ? 4 : 1)}" width="${x1 - x0}" height="${nut ? 6 : 2}" fill="${nut ? 'var(--nut)' : 'var(--fret)'}"/>`; }
    for (let k = 0; k < N; k++) { const x = left + k * SX, w = N > 4 ? 3.2 - k * .38 : 4.2 - k * .7, hi = o.hiS === k;
      s += `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${rows * RH}" fill="${hi ? 'var(--ask)' : 'var(--string)'}"/>`;
      if (o.from !== 0) s += `<text x="${x}" y="18" font-size="15" font-weight="800" fill="${hi ? 'var(--ask)' : 'var(--muted)'}" text-anchor="middle" dominant-baseline="central">${STR[k].n}</text>`;
      else if (!o.dots.some(d => d.s === k && d.f === 0)) s += `<text x="${x}" y="18" font-size="15" font-weight="800" fill="${hi ? 'var(--ask)' : 'var(--muted)'}" text-anchor="middle" dominant-baseline="central">${STR[k].n}</text>`; }
  } else {
    const {top, left, CW, RH} = geo, y0 = top + 4, y1 = top + N * RH - 4, x0 = left, x1 = left + rows * CW;
    s += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="3" fill="var(--wood)"/>`;
    for (let f = first; f <= o.to; f++) { const x = left + (f - first + .5) * CW;
      if ([3,5,7,9].includes(f)) s += `<circle cx="${x}" cy="${(y0 + y1) / 2}" r="5" fill="var(--inlay)"/>`;
      if (f === 12) s += `<circle cx="${x}" cy="${top + RH * (N / 2 - 1)}" r="5" fill="var(--inlay)"/><circle cx="${x}" cy="${top + RH * (N / 2 + 1)}" r="5" fill="var(--inlay)"/>`;
      s += `<text x="${x}" y="${H - 9}" font-size="13" fill="var(--muted)" text-anchor="middle" dominant-baseline="central">${f}</text>`; }
    for (let f = first - 1; f <= o.to; f++) { const x = left + (f - first + 1) * CW, nut = f === 0;
      s += `<rect x="${x - (nut ? 4 : 1)}" y="${y0}" width="${nut ? 6 : 2}" height="${y1 - y0}" fill="${nut ? 'var(--nut)' : 'var(--fret)'}"/>`; }
    for (let k = 0; k < N; k++) { const y = top + (last - k) * RH + RH / 2, w = N > 4 ? 3.2 - k * .38 : 4.2 - k * .7, hi = o.hiS === k;
      s += `<rect x="${x0}" y="${y - w / 2}" width="${x1 - x0}" height="${w}" fill="${hi ? 'var(--ask)' : 'var(--string)'}"/>`;
      if (!(o.from === 0 && o.dots.some(d => d.s === k && d.f === 0))) s += `<text x="${o.from === 0 ? 20 : 10}" y="${y}" font-size="15" font-weight="800" fill="${hi ? 'var(--ask)' : 'var(--muted)'}" text-anchor="middle" dominant-baseline="central">${STR[k].n}</text>`; }
  }
  const r = N > 4 ? (o.small ? 12 : 14) : (o.small ? 13 : 15);
  o.dots.forEach(d => { if (d.f < o.from && !(d.f === 0 && o.from === 0)) return; if (d.f > o.to) return;
    const p = P(d.s, d.f), [fill, ink] = DOT[d.c || 'tone'], t = d.t == null ? '' : String(d.t);
    const fs = t.length > 2 ? 10 : t.length > 1 ? 12 : 13;
    s += `<g class="dot${d.pulse ? ' pulse' : ''}"><circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${fill}" stroke="${d.c === 'ghost' ? 'var(--muted)' : 'var(--wood)'}" stroke-width="2"/><text x="${p.x}" y="${p.y}" font-size="${fs}" style="fill:${ink}">${esc(t)}</text></g>`; });
  if (o.tap) for (let k = 0; k < N; k++) for (let f = o.from === 0 ? 0 : o.from; f <= o.to; f++) {
    const p = P(k, f); s += `<rect class="hit" data-s="${k}" data-f="${f}" x="${p.x - cell.w / 2}" y="${p.y - cell.h / 2}" width="${cell.w}" height="${cell.h}"/>`; }
  s += '</svg>';
  const box = el(`<div class="board ${v ? 'v' : 'h'}">${s}</div>`);
  if (o.tap) box.addEventListener('click', e => { const t = e.target.closest('.hit'); if (t) o.tap(+t.dataset.s, +t.dataset.f); });
  return box;
}

/* ---------- 레슨 그림 ---------- */
function nearPos(midi, s0, f0, lo, hi) {
  const out = [];
  for (let s = 0; s < NS(); s++) for (let f = Math.max(0, lo); f <= Math.min(12, hi); f++) if (midiAt(s, f) === midi && !(s === s0 && f === f0)) out.push({s, f});
  return out;
}
function figure(fig) {
  const wrap = el('<div class="figure"></div>'); let o = {dots:[]}, legend = [];
  const add = (b, cap) => { const c = el('<div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:4px"></div>'); if (cap) c.appendChild(el(`<b class="small">${esc(cap)}</b>`)); c.appendChild(b); wrap.appendChild(c); };
  if (fig.k === 'open') { o = {from:0, to:4, dots:STR.map((x, s) => ({s, f:0, t:x.n}))}; }
  else if (fig.k === 'string') { o.from = 0; o.to = fig.maxF;
    for (let f = 0; f <= fig.maxF; f++) { const pc = pcAt(fig.s, f); if (isNat(pc)) o.dots.push({s:fig.s, f, t:nm(pc)}); else if (fig.all) o.dots.push({s:fig.s, f, t:nm(pc), c:'dim'}); }
    o.hiS = fig.s; legend = fig.all ? [['tone','자연음'],['dim','샵 음']] : []; }
  else if (fig.k === 'marks') { o = {from:0, to:12, hiS:fig.s, dots:[]};
    for (let f = 0; f <= 12; f++) { const pc = pcAt(fig.s, f); if (!isNat(pc)) continue; o.dots.push({s:fig.s, f, t:nm(pc), c:fig.frets.includes(f) ? 'root' : 'dim'}); }
    legend = [['root','먼저 외울 기준점'],['dim','기준점에서 세어 찾는 음']]; }
  else if (fig.k === 'marks2') { o = {from:0, to:8, dots:[]}; [0,1].forEach(s => fig.frets.forEach(f => o.dots.push({s, f, t:nm(pcAt(s, f)), c:s ? 'tone' : 'root'}))); }
  else if (fig.k === 'same') { o = {from:0, to:fig.maxF, dots:allPos(fig.pc, fig.maxF, fig.strings).map(p => ({...p, t:nm(fig.pc)}))}; }
  else if (fig.k === 'five') { o = {from:0, to:6, dots:[]}; [0,1,2].forEach((s, i) => { const c = ['root','tone','ask'][i];
      o.dots.push({s, f:5, t:nm(pcAt(s, 5)), c}); o.dots.push({s:s + 1, f:0, t:nm(pcAt(s + 1, 0)), c}); }); legend = [['root','같은 색끼리 같은 음']]; }
  else if (fig.k === 'ivl') { const m0 = midiAt(fig.s, fig.f), lo = Math.max(0, fig.f - 3), hi = Math.min(12, fig.f + 4);
    o = {from:lo <= 1 ? 0 : lo, to:hi, dots:[{s:fig.s, f:fig.f, t:'R', c:'root'}]};
    fig.semis.forEach(se => nearPos(m0 + se, fig.s, fig.f, lo, hi).forEach(p => o.dots.push({...p, t:IVL_SHORT[se]})));
    legend = [['root','루트(R)'],['tone','음정']]; }
  else if (fig.k === 'chord') {
    const mk = id => { const ch = chordById(id), m0 = midiAt(fig.s, fig.f), lo = Math.max(0, fig.f - 2), hi = Math.min(12, fig.f + 4);
      const dots = [{s:fig.s, f:fig.f, t:'R', c:'root'}];
      ch.t.slice(1).forEach(x => { const ps = nearPos(m0 + x, fig.s, fig.f, lo, hi); if (ps.length) { const best = ps.sort((a, b) => Math.abs(a.f - fig.f) - Math.abs(b.f - fig.f))[0]; dots.push({...best, t:IVL_SHORT[x]}); } });
      return {from:lo <= 1 ? 0 : lo, to:hi, dots}; };
    if (fig.alt) { add(board(Object.assign(mk(fig.alt), {small:true})), ROOT_NAMES[fig.root] + chordById(fig.alt).suf + ' (' + chordById(fig.alt).read + ')');
      add(board(Object.assign(mk(fig.id), {small:true})), ROOT_NAMES[fig.root] + chordById(fig.id).suf + ' (' + chordById(fig.id).read + ')'); return wrap; }
    o = mk(fig.id); legend = [['root','루트(R)'],['tone','코드톤']]; }
  else if (fig.k === 'scale') { const sc = SCALES.find(x => x.id === fig.id); o = {from:Math.max(0, fig.from - 0), to:fig.to, dots:[]};
    for (let s = 0; s < NS(); s++) { if (fig.strings && !fig.strings.includes(s)) continue;
      for (let f = fig.from; f <= fig.to; f++) { const i = sc.st.indexOf((pcAt(s, f) - fig.root + 12) % 12); if (i >= 0) o.dots.push({s, f, t:sc.lb[i], c:i ? 'tone' : 'root'}); } }
    legend = [['root','루트(1)'],['tone','스케일 음']]; }
  else if (fig.k === 'shape') { (fig.ids || [fig.id]).forEach(id => { const sh = TH.GSHAPES[id]; add(board(Object.assign(shapeBoard(id), {small:!!fig.ids})), id + ' 코드'); }); 
    wrap.appendChild(el(`<div class="legend"><span><i style="background:${DOT.root[0]}"></i>근음</span><span><i style="background:${DOT.tone[0]}"></i>누르는 자리</span><span>× 치지 않는 줄</span></div>`)); return wrap; }
  else if (fig.k === 'pts') { o = {from:fig.from, to:fig.to, dots:fig.pts.map(([s, f, t, c]) => ({s, f, t, c:c || 'tone'}))}; }
  else if (fig.k === 'appr') { o = {from:2, to:7, dots:[{s:fig.from[0], f:fig.from[1], t:'A', c:'root'}, {s:1, f:4, t:'C#', c:'ask'}, {s:fig.to[0], f:fig.to[1], t:'D', c:'tone'}]};
    legend = [['root','지금 코드 A'],['ask','접근음 C#'],['tone','다음 코드 D']]; }
  add(board(o));
  if (legend.length) wrap.appendChild(el(`<div class="legend">${legend.map(([c, t]) => `<span><i style="background:${DOT[c][0]};border:1px solid var(--line)"></i>${esc(t)}</span>`).join('')}</div>`));
  return wrap;
}
function shapeBoard(id) {
  const sh = TH.GSHAPES[id], max = Math.max(4, ...sh.f) , dots = [];
  sh.f.forEach((f, s) => { if (f < 0) dots.push({s, f:0, t:'×', c:'ghost'}); else { const pc = pcAt(s, f); dots.push({s, f, t:nm(pc, [5,10,3,8,1].includes(sh.root)), c:pc === sh.root ? 'root' : 'tone'}); } });
  return {from:0, to:max + 1 > 5 ? max + 1 : 5, dots, orient:'v'};
}
function rhythmGrid(id, nowIdx) {
  const r = RHYTHMS.find(x => x.id === id);
  return `<div class="rgrid" style="grid-template-columns:repeat(${r.n},1fr)" aria-label="${esc(r.name)} 리듬 그림">${Array.from({length:r.n}, (_, k) => `<i class="${r.s.includes(k) ? 'on' : ''}${r.acc.includes(k) ? ' beat' : ''}${k === nowIdx ? ' now' : ''}"></i>`).join('')}</div>`;
}
const COUNT16 = ['1','e','&','a','2','e','&','a','3','e','&','a','4','e','&','a'];
const rCount = r => r.cnt || COUNT16;
function playRhythm(id, bpm, bars, ui, onstop) {
  const r = RHYTHMS.find(x => x.id === id);
  Clock.start({bpm, sub:r.sub, total:bars ? bars * r.n : 0, tick:(n, t) => { const k = n % r.n; if (r.acc.includes(k)) AU.click(t, k === 0); if (r.s.includes(k)) AU.pluck(TH.inst().low, t, .3); }, ui:ui ? (n => ui(n % r.n)) : null, onstop});
}
const LINE_OFF = {R:0, 5:7, 8:12, 7:10, 3:4};
function playLine(pat, rootMidi, bpm, ui, onstop) {
  Clock.start({bpm, sub:2, bars:2, tick:(n, t) => { const r = pat[n % 8]; if (n % 2 === 0) AU.click(t, n % 8 === 0); if (r === 'x') AU.pluck(rootMidi, t, .045); else if (r) AU.pluck(rootMidi + LINE_OFF[r], t, .32); }, ui, onstop});
}

/* ---------- 풀이 문구 ---------- */
function countUp(s, f) {
  if (f === 0) return STR[s].n + '줄은 아무것도 누르지 않은 개방현이 ' + STR[s].n + '입니다.';
  const a = []; for (let i = 0; i <= f; i++) a.push(SHARP[pcAt(s, i)] + '(' + (i || '개방') + ')');
  let t = STR[s].n + '줄을 한 칸씩 세면 ' + a.join(' ') + '.';
  if (f === 12) t += ' 12프렛은 개방현과 이름이 같습니다.';
  else if (f === 5 && s < 3) t += ' 5프렛은 옆 가는 줄의 개방현과 같은 음입니다.';
  else { const m = [3,5,7].find(x => Math.abs(x - f) <= 2 && x !== f); if (m != null && f > 0) t += ' 기준점 ' + m + '프렛(' + nm(pcAt(s, m)) + ')에서 ' + Math.abs(f - m) + '칸 ' + (f > m ? '위' : '아래') + '로 기억하면 쉽습니다.'; }
  return t;
}
const ivExplain = (semi, s0) => { const sh = shapes(semi, s0); return '루트에서 ' + semi + '칸 거리를 ' + IVL[semi] + '라고 부릅니다. ' + IVL_FEEL[semi] + (sh.length ? ' 지판 모양: ' + sh.join(', 또는 ') + '.' : ''); };

/* ---------- 문제 만들기 ---------- */
// 문제 객체: {skill, key, prompt, sub, sym, board:{...}, answers:[{t,v}], wide, mic:{pc}|{midi}, answer(v)->결과, chord:true}
function qOpen(s) {
  s = s == null ? rnd(NS()) : s; const key = 'op:' + s;
  if (Math.random() < .5) return {skill:'basics', key, correct:s, prompt:'색이 다른 줄의 이름은 무엇일까요?', board:{from:0, to:5, hiS:s},
    answers:STR.map((x, i) => ({t:NS() > 4 ? x.no + '번 ' + x.n : x.n, v:i})),
    answer:v => ({ok:v === s, title:v === s ? '맞습니다' : '정답은 ' + STR[s].no + '번 ' + STR[s].n + '줄입니다', text:'굵은 줄부터 ' + STR.map(x => x.n).join(', ') + '입니다. ' + STR[s].n + '줄은 ' + STR[s].no + '번 줄이라고도 부릅니다.', dots:[{s, f:0, t:STR[s].n, c:'ok'}]})};
  return {skill:'basics', key, prompt:(NS() > 4 ? STR[s].no + '번 ' : '') + STR[s].n + '줄을 눌러 보세요', sub:'그 줄의 아무 칸이나 누르면 됩니다', board:{from:0, to:5},
    sol:{s, f:0}, tap:(k) => ({ok:k === s, title:k === s ? '맞습니다' : '누른 줄은 ' + STR[k].n + '줄입니다', text:'굵은 줄부터 ' + STR.map(x => x.n).join(', ') + '입니다. 그림의 왼쪽(가로 그림에서는 아래)이 가장 굵은 줄입니다.', dots:[{s, f:0, t:STR[s].n, c:'ok'}].concat(k !== s ? [{s:k, f:0, t:STR[k].n, c:'bad'}] : [])}),
    mic:{pc:STR[s].pc, label:STR[s].n + '줄 개방현'}};
}
function qStep(kind, x) {
  kind = kind || pick(['next','gap','half','half']);
  if (kind === 'next') { const pc = x != null ? x : pick(NAT), i = NAT.indexOf(pc), nx = NAT[(i + 1) % 7];
    return {skill:'basics', key:'st:next:' + pc, correct:nx, prompt:nm(pc) + ' 다음 자연음은 무엇일까요?', sub:'샵과 플랫을 빼고, 알파벳 순서대로 다음 음입니다',
      answers:NAT.map(p => ({t:nm(p), v:p})), answer:v => ({ok:v === nx, title:v === nx ? '맞습니다' : '정답은 ' + nm(nx) + '입니다', text:'C D E F G A B 다음은 다시 C입니다. ' + nm(pc) + ' 다음은 ' + nm(nx) + '이고, 둘 사이는 ' + ((nx - pc + 12) % 12) + '칸입니다.'})}; }
  if (kind === 'gap') { const pc = x != null ? x : pick([4,11,4,11,0,2,5,7,9]), i = NAT.indexOf(pc), nx = NAT[(i + 1) % 7], g = (nx - pc + 12) % 12;
    return {skill:'basics', key:'st:gap:' + pc, correct:g, prompt:nm(pc) + '에서 ' + nm(nx) + '까지 몇 칸일까요?', answers:[{t:'1칸 (반음)', v:1}, {t:'2칸 (온음)', v:2}], wide:true,
      answer:v => ({ok:v === g, title:v === g ? '맞습니다' : '정답은 ' + g + '칸입니다', text:'자연음 사이는 대부분 2칸입니다. E와 F, B와 C 사이만 1칸입니다.'})}; }
  const pc = x != null ? x : rnd(12), up = Math.random() < .5, t = (pc + (up ? 1 : 11)) % 12;
  return {skill:'basics', key:'st:half:' + pc, correct:t, prompt:both(pc) + '에서 한 칸 ' + (up ? '위' : '아래') + '는 무슨 음일까요?',
    answers:Array.from({length:12}, (_, p) => ({t:both(p), v:p, sm:!isNat(p)})), many:true,
    answer:v => ({ok:v === t, title:v === t ? '맞습니다' : '정답은 ' + both(t) + '입니다', text:'#은 한 칸 위, b은 한 칸 아래라는 뜻입니다. ' + (isNat(t) ? '' : both(t) + '는 한 자리를 두 이름으로 부르는 것입니다.')})};
}
function qFind(o, fixed) {
  o = Object.assign({strings:[0,1,2,3], maxF:12, nat:true}, o);
  let s, f, pc;
  if (fixed) { s = fixed.s; f = fixed.f; pc = pcAt(s, f); }
  else do { s = pick(o.strings); f = rnd(o.maxF + 1); pc = pcAt(s, f); } while (o.nat && !isNat(pc));
  const key = 'n:' + s + ':' + f, range = {from:0, to:Math.max(o.maxF, f)};
  const explain = countUp(s, f);
  if (Math.random() < .5) return {skill:'notes', key, sol:{s, f}, prompt:'색이 다른 줄에서 ' + both(pc) + ' 음을 누르세요', sub:strName(s) + ', 0~' + range.to + '프렛', board:Object.assign({hiS:s}, range),
    tap:(k, g) => { const ok = k === s && pcAt(k, g) === pc;
      return {ok, title:ok ? '맞습니다' : (k !== s ? '다른 줄을 눌렀습니다' : '누른 음은 ' + both(pcAt(k, g)) + '입니다'), text:explain,
        dots:allPos(pc, range.to, [s]).map(p => ({...p, t:nm(pc), c:'ok'})).concat(ok ? [] : [{s:k, f:g, t:nm(pcAt(k, g)), c:'bad'}])}; },
    mic:{pc, label:strName(s) + '의 ' + nm(pc)}};
  return {skill:'notes', key, correct:pc, prompt:'물음표 자리는 무슨 음일까요?', sub:posName(s, f), board:Object.assign({dots:[{s, f, t:'?', c:'ask'}]}, range),
    answers:(o.nat ? NAT : Array.from({length:12}, (_, i) => i)).map(p => ({t:o.nat ? nm(p) : both(p), v:p, sm:!isNat(p)})), many:!o.nat,
    answer:v => ({ok:v === pc, title:v === pc ? '맞습니다' : '정답은 ' + both(pc) + '입니다', text:explain, dots:[{s, f, t:nm(pc), c:v === pc ? 'ok' : 'bad'}]})};
}
function qOct(fixed) {
  let s, f; if (fixed) { s = fixed.s; f = fixed.f; } else { s = rnd(2); do { f = 1 + rnd(9); } while (!isNat(pcAt(s, f))); }
  const m = midiAt(s, f) + 12, pc = pcAt(s, f), tgt = nearPos(m, s, f, 0, 12);
  return {skill:'notes', key:'o:' + s + ':' + f, sol:tgt[0], prompt:'R(' + nm(pc) + ')의 한 옥타브 위를 누르세요', sub:'두 줄 가는 쪽으로 넘어가 두 칸 위', board:{from:0, to:12, dots:[{s, f, t:'R', c:'root'}]},
    tap:(k, g) => { const ok = midiAt(k, g) === m;
      return {ok, title:ok ? '맞습니다' : (pcAt(k, g) === pc ? '이름은 같지만 높이가 다른 ' + nm(pc) + '입니다' : '누른 음은 ' + both(pcAt(k, g)) + '입니다'),
        text:'옥타브는 루트에서 12칸 위입니다. ' + strName(s) + ' ' + f + '프렛의 옥타브는 ' + tgt.map(p => posName(p.s, p.f)).join(', ') + '입니다.',
        dots:[{s, f, t:'R', c:'root'}].concat(tgt.map(p => ({...p, t:'8', c:'ok'}))).concat(ok ? [] : [{s:k, f:g, t:nm(pcAt(k, g)), c:'bad'}])}; },
    mic:{midi:m, pc, label:'한 옥타브 위 ' + nm(pc)}};
}
function qIvl(set, semiFix) {
  const semi = semiFix != null ? semiFix : pick(set), key = 'v:' + semi;
  if (Math.random() < .5) { let s, f, s2, f2, g = 0;
    do { s = rnd(3); f = 1 + rnd(8); const ps = nearPos(midiAt(s, f) + semi, s, f, Math.max(0, f - 4), Math.min(12, f + 5)); if (ps.length) { const p = pick(ps); s2 = p.s; f2 = p.f; } g++; } while (s2 == null && g < 200);
    const lo = Math.max(0, Math.min(f, f2) - 2), hi = Math.min(12, Math.max(f, f2) + 2);
    return {skill:'intervals', key, correct:semi, prompt:'R에서 물음표까지는 무슨 음정일까요?', board:{from:lo <= 1 ? 0 : lo, to:hi, dots:[{s, f, t:'R', c:'root'}, {s:s2, f:f2, t:'?', c:'ask'}]},
      answers:set.map(v => ({t:IVL[v], v})), onShow:() => { AU.pluck(midiAt(s, f)); AU.pluck(midiAt(s2, f2), AU.now() + .45); },
      answer:v => ({ok:v === semi, title:v === semi ? '맞습니다' : '정답은 ' + IVL[semi] + '입니다', text:ivExplain(semi, s), dots:[{s, f, t:'R', c:'root'}, {s:s2, f:f2, t:IVL_SHORT[semi], c:v === semi ? 'ok' : 'bad'}], play:[[s, f], [s2, f2]]})};
  }
  const s = rnd(2), f = 2 + rnd(6), m = midiAt(s, f) + semi, pc = (pcAt(s, f) + semi) % 12, lo = Math.max(0, f - 3), hi = Math.min(12, f + 5);
  const solI = nearPos(m, s, f, lo, hi)[0] || allPos(pc, 12)[0];
  return {skill:'intervals', key, sol:solI, prompt:'R(' + both(pcAt(s, f)) + ')에서 ' + IVL[semi] + ' 위의 음을 누르세요', sub:'루트보다 높은 쪽에서 찾습니다', board:{from:lo <= 1 ? 0 : lo, to:hi, dots:[{s, f, t:'R', c:'root'}]},
    tap:(k, g) => { const ok = midiAt(k, g) === m || (pcAt(k, g) === pc && midiAt(k, g) > midiAt(s, f));
      return {ok, title:ok ? '맞습니다' : '누른 음은 ' + both(pcAt(k, g)) + '입니다', text:ivExplain(semi),
        dots:[{s, f, t:'R', c:'root'}].concat(nearPos(m, s, f, lo, hi).map(p => ({...p, t:IVL_SHORT[semi], c:'ok'}))).concat(ok ? [] : [{s:k, f:g, t:nm(pcAt(k, g)), c:'bad'}]), play:[[s, f], [k, g]]}; },
    mic:{pc, label:IVL[semi] + ' 위 ' + nm(pc)}};
}
function qChord(types, idFix) {
  const ch = chordById(idFix || pick(types)), root = rnd(12), rn = ROOT_NAMES[root], flat = rootFlat(root);
  return {skill:'chords', key:'c:' + ch.id, chord:true, ch, root, rn, flat, sym:rn + ch.suf,
    prompt:'', sub:'읽는 법: ' + rn + ' ' + ch.read + '. 들어가는 음: ' + ch.t.map((x, i) => ch.lb[i] + (x ? '(' + x + '칸 위)' : '')).join(', '), board:{from:0, to:12}};
}
function qDegree(scaleId, fix) {
  const sc = SCALES.find(x => x.id === scaleId), root = fix ? fix.root : pick([9,4,7,2,0,5]), i = fix ? fix.i : 1 + rnd(sc.st.length - 1), pc = (root + sc.st[i]) % 12, name = spell(root, sc, i);
  const rf = allPos(root, 12, [0,1]).find(p => p.f >= 2 && p.f <= 8) || allPos(root, 12, [0,1])[0];
  const lo = Math.max(0, rf.f - 1), hi = Math.min(12, rf.f + 4);
  let solD = null; for (let s = 0; s < NS() && !solD; s++) for (let f = lo; f <= hi; f++) if (pcAt(s, f) === pc) { solD = {s, f}; break; }
  return {skill:'scales', sol:solD || allPos(pc, 12)[0], key:'d:' + scaleId + ':' + i + ':' + root, prompt:nm(root, scaleFlat(root, sc)) + ' ' + sc.name + '의 ' + sc.lb[i] + '도 음을 누르세요', sub:sc.lb.join(' ') + ' 중에서, 루트 근처 상자 안에서 찾으세요',
    board:{from:lo <= 1 ? 0 : lo, to:hi, dots:[{s:rf.s, f:rf.f, t:'1', c:'root'}]},
    tap:(k, g) => { const ok = pcAt(k, g) === pc;
      const dots = []; for (let s = 0; s < NS(); s++) for (let f = lo; f <= hi; f++) { const j = sc.st.indexOf((pcAt(s, f) - root + 12) % 12); if (j >= 0) dots.push({s, f, t:sc.lb[j], c:j === i ? 'ok' : j === 0 ? 'root' : 'dim'}); }
      if (!ok) dots.push({s:k, f:g, t:nm(pcAt(k, g)), c:'bad'});
      return {ok, title:ok ? '맞습니다. ' + name + '입니다' : '정답은 ' + name + '입니다', text:sc.lb[i] + '도는 루트에서 ' + sc.st[i] + '칸 위입니다. 상자 안의 모든 스케일 음을 표시했습니다.', dots}; },
    mic:{pc, label:sc.lb[i] + '도 ' + name}};
}
function qRhythm(set, idFix) {
  const id = idFix || pick(set), r = RHYTHMS.find(x => x.id === id);
  const same = RHYTHMS.filter(x => x.id !== id && x.n === r.n), pref = shuffle(same.filter(x => set.includes(x.id))), rest = shuffle(same.filter(x => !set.includes(x.id)));
  const opts = shuffle([id, ...pref.concat(rest).slice(0, 2).map(x => x.id)]);
  return {skill:'rhythm', key:'r:' + id, correct:id, prompt:'들리는 리듬은 어느 것일까요?', sub:'메트로놈 소리가 박입니다. 다시 듣기를 눌러 여러 번 들어도 됩니다', rhythm:{id, opts},
    answer:v => ({ok:v === id, title:v === id ? '맞습니다. ' + r.name + '입니다' : '정답은 ' + r.name + '입니다', text:'세는 법: ' + r.count + '. 검은 칸에서 줄을 칩니다.'})};
}
function qAppr(kind) {
  const pairs = [[9,2],[4,9],[7,0],[2,7],[0,5],[9,4],[5,7]], [a, b] = pick(pairs);
  kind = kind || (Math.random() < .3 ? 'above' : 'below');
  const t = (b + (kind === 'above' ? 1 : kind === 'fifth' ? 7 : 11)) % 12;
  const cand = [t, (b + 1) % 12, (b + 11) % 12, (b + 7) % 12, (b + 2) % 12, (a + 1) % 12, (b + 5) % 12].filter((v, i, arr) => arr.indexOf(v) === i);
  const opts = shuffle([t].concat(shuffle(cand.slice(1)).slice(0, 3)));
  const what = kind === 'fifth' ? '5도' : '한 칸 ' + (kind === 'above' ? '위' : '아래');
  return {skill:'chords', key:'ap:' + kind, correct:t, prompt:ROOT_NAMES[a] + '에서 ' + ROOT_NAMES[b] + '로 넘어갑니다. ' + ROOT_NAMES[b] + '의 ' + what + ' 접근음은?',
    answers:opts.map(v => ({t:both(v), v})), answer:v => ({ok:v === t, title:v === t ? '맞습니다' : '정답은 ' + both(t) + '입니다', text:(kind === 'fifth' ? '다음 루트의 5도에서 루트로 가면 강하게 해결됩니다. ' : '접근음은 다음 코드 루트의 바로 옆 칸입니다. ') + ROOT_NAMES[b] + '의 ' + what + '는 ' + both(t) + '입니다. 마디의 마지막 박에 치고 다음 마디 첫 박에 ' + ROOT_NAMES[b] + '로 들어갑니다.'})};
}
function qMcq(lid, i) {
  const L = LESSONS.find(l => l.id === lid), b = L.bank[i], right = b.a[0];
  return {skill:'tech', key:'mq:' + lid + ':' + i, correct:right, prompt:b.q, sub:L.title, wide:true,
    answers:shuffle(b.a).map(t => ({t, v:t})), answer:v => ({ok:v === right, title:v === right ? '맞습니다' : '정답은 "' + right + '"입니다', text:b.why})};
}
const KEYS_MAJ = [0,7,2,9,4,5,10], KEYS_MIN = [9,4,2,7,0];
const DEG = {major:{off:[0,2,4,5,7,9,11], q:['','m','m','','','m','dim'], rn:['I','ii','iii','IV','V','vi','vii°']},
  minor:{off:[0,2,3,5,7,8,10], q:['m','m7b5','','m','7','',''], rn:['i','ii°','III','iv','V7','VI','VII']}};
function qRoman(mode, fix) {
  mode = mode || 'major'; const M = DEG[mode], key = fix ? fix.key : pick(mode === 'major' ? KEYS_MAJ : KEYS_MIN), d = fix ? fix.d : rnd(7);
  const flat = mode === 'major' ? [5,10].includes(key) : [2,7,0].includes(key);
  const chord = k => nm((key + M.off[k]) % 12, flat) + M.q[k], kname = nm(key, flat) + (mode === 'major' ? ' 메이저' : ' 마이너');
  const others = shuffle([0,1,2,3,4,5,6].filter(k => k !== d)).slice(0, 3);
  const all = [0,1,2,3,4,5,6].map(k => M.rn[k] + ' ' + chord(k)).join(', ');
  const base = {skill:'chords', key:'rn:' + mode + ':' + key + ':' + d, wide:true};
  if (Math.random() < .5) return Object.assign(base, {correct:d, prompt:kname + ' 키의 ' + M.rn[d] + ' 코드는?', sub:'대문자는 메이저, 소문자는 마이너입니다',
    answers:shuffle([d, ...others]).map(k => ({t:chord(k), v:k})), answer:v => ({ok:v === d, title:v === d ? '맞습니다' : '정답은 ' + chord(d) + '입니다', text:kname + ' 키의 코드: ' + all + '.'})});
  return Object.assign(base, {correct:d, prompt:kname + ' 키에서 ' + chord(d) + '는 몇 도 코드일까요?',
    answers:shuffle([d, ...others]).map(k => ({t:M.rn[k], v:k})), answer:v => ({ok:v === d, title:v === d ? '맞습니다' : '정답은 ' + M.rn[d] + '입니다', text:kname + ' 키의 코드: ' + all + '.'})});
}
function qEar(set, semiFix) {
  const semi = semiFix != null ? semiFix : pick(set), m0 = 31 + rnd(10), play = () => { AU.pluck(m0, AU.now() + .05, .7); AU.pluck(m0 + semi, AU.now() + .6, .7); };
  return {skill:'intervals', key:'ei:' + semi, correct:semi, prompt:'두 음 사이의 음정은 무엇일까요?', sub:'그림 없이 소리만 듣고 고르세요', replay:play, onShow:play,
    answers:set.map(v => ({t:IVL[v], v})), answer:v => ({ok:v === semi, title:v === semi ? '맞습니다' : '정답은 ' + IVL[semi] + '입니다', text:ivExplain(semi)})};
}
function qShape(set, idFix) {
  const id = idFix || pick(set), pool = set.length >= 4 ? set : Object.keys(TH.GSHAPES), others = shuffle(pool.filter(x => x !== id)).slice(0, 3);
  const sh = TH.GSHAPES[id], ch = chordById(sh.ch), notes = sh.f.map((f, s) => f < 0 ? null : nm(pcAt(s, f), [5,10,3,8,1].includes(sh.root))).filter(Boolean);
  return {skill:'chords', key:'sh:' + id, correct:id, prompt:'이 코드 모양의 이름은?', sub:'색이 다른 점이 근음입니다. 소리 버튼으로 들어 볼 수 있습니다', board:shapeBoard(id),
    replay:() => AU.strum(id), replayLabel:'코드 소리 듣기', onShow:() => AU.strum(id),
    answers:shuffle([id, ...others]).map(x => ({t:x, v:x})),
    answer:v => ({ok:v === id, title:v === id ? '맞습니다. ' + id + '입니다' : '정답은 ' + id + '입니다', text:id + '는 ' + (ch ? ch.read : '') + ' 코드입니다. 울리는 음: ' + notes.join(' ') + '.' + (sh.barre ? ' 검지로 ' + sh.barre + '프렛 여러 줄을 한꺼번에 누르는 바레 코드입니다.' : '') + (sh.f.includes(-1) ? ' ×표 줄은 치지 않거나 손가락으로 살짝 막습니다.' : '')})};
}
function qPower(fix) {
  const s = fix ? fix.s : rnd(2), f = fix ? fix.f : 1 + rnd(9), pc = pcAt(s, f), name = nm(pc, [5,10,3,8,1].includes(pc)) + '5';
  const others = shuffle([1,2,3,5,7,9,10,11].map(k => (pc + k) % 12)).slice(0, 3).map(p => nm(p, [5,10,3,8,1].includes(p)) + '5');
  const dots = [{s, f, t:'R', c:'root'}, {s:s + 1, f:f + 2, t:'5'}, {s:s + 2, f:f + 2, t:'8'}];
  return {skill:'chords', key:'pw:' + s + ':' + f, correct:name, prompt:'이 파워코드의 이름은?', sub:'근음(R)의 음 이름 뒤에 5를 붙입니다', board:{from:Math.max(0, f - 1), to:Math.min(12, f + 3), dots},
    onShow:() => AU.seq([[s, f], [s + 1, f + 2], [s + 2, f + 2]], .02),
    answers:shuffle([name, ...others]).map(x => ({t:x, v:x})),
    answer:v => ({ok:v === name, title:v === name ? '맞습니다' : '정답은 ' + name + '입니다', text:'근음은 ' + posName(s, f) + ', ' + both(pc) + '입니다. ' + countUp(s, f)})};
}
function genFromDrill(d, ctx) {
  ctx = ctx || {};
  if (d.type === 'mix') return genFromDrill(pick(d.parts), ctx);
  if (d.type === 'mcq') { const L = ctx.L; if (!L || !L.bank) return qOpen(); if (!ctx.mq || !ctx.mq.length) ctx.mq = shuffle(L.bank.map((_, i) => i)); return qMcq(L.id, ctx.mq.shift()); }
  if (d.type === 'roman') return qRoman(d.mode);
  if (d.type === 'shape') return qShape(d.set);
  if (d.type === 'power') return qPower();
  if (d.type === 'ear') return qEar(d.set);
  if (d.type === 'open') return qOpen();
  if (d.type === 'step') return qStep();
  if (d.type === 'find') return qFind(d);
  if (d.type === 'oct') return qOct();
  if (d.type === 'ivl') return qIvl(d.set);
  if (d.type === 'chord') return qChord(d.types);
  if (d.type === 'degree') return qDegree(d.scale);
  if (d.type === 'rhythm') return qRhythm(d.set);
  if (d.type === 'appr') return qAppr(d.kinds ? pick(d.kinds) : null);
}
function genFromKey(key) {
  const p = key.split(':');
  try {
    if (p[0] === 'op') return qOpen(+p[1]);
    if (p[0] === 'st') return qStep(p[1], +p[2]);
    if (p[0] === 'n') return qFind({maxF:12, nat:isNat(pcAt(+p[1], +p[2]))}, {s:+p[1], f:+p[2]});
    if (p[0] === 'o') return qOct({s:+p[1], f:+p[2]});
    if (p[0] === 'v') { const t = +p[1]; return qIvl(shuffle([2,3,4,5,7,10,11,12].filter(x => x !== t)).slice(0, 3).concat(t).sort((a, b) => a - b), t); }
    if (p[0] === 'c') return qChord(null, p[1]);
    if (p[0] === 'd') return qDegree(p[1], {i:+p[2], root:+p[3]});
    if (p[0] === 'r') return qRhythm(['q','e','off','qe','s','gal','332','push'], p[1]);
    if (p[0] === 'ap') return qAppr(p[1] || null);
    if (p[0] === 'mq') return qMcq(p[1], +p[2]);
    if (p[0] === 'sh') return qShape(Object.keys(TH.GSHAPES), p[1]);
    if (p[0] === 'pw') return qPower({s:+p[1], f:+p[2]});
    if (p[0] === 'rn') return qRoman(p[1], {key:+p[2], d:+p[3]});
    if (p[0] === 'ei') { const t = +p[1]; return qEar(shuffle([3,4,5,7,10,12].filter(x => x !== t)).slice(0, 3).concat(t).sort((a, b) => a - b), t); }
  } catch (e) {}
  return null;
}

/* ---------- 문제 진행기 ---------- */
// host: 문제를 그릴 요소, foot: 아래 버튼 칸. opts: {count, next(i)->문제, onDone(결과), allowMic}
function Runner(host, foot, opts) {
  const st = {i:0, right:0, combo:0, gained:0, q:null, done:false, answered:false, results:[], chordStep:0, chordMiss:false, found:[], extra:[]};
  const total = opts.count || 0, footWrap = foot.parentElement;
  function micOn() { return D.settings.mic && Mic.supported(); }
  function render() {
    const q = st.q; host.innerHTML = '';
    host.appendChild(el(`<div class="qtop">${total ? `<span class="qcount">${st.i + 1}/${total}</span><div class="bar-track"><div class="bar-fill" style="width:${(st.i + (st.answered ? 1 : 0)) / total * 100}%"></div></div>` : `<span class="qcount">연습 ${st.i + 1}</span><span style="flex:1"></span>`}<span class="combo">${st.combo >= 2 ? '연속 ' + st.combo : ''}</span><span class="pill">${esc(SKILL_NAMES[q.skill])}</span></div>`));
    if (opts.passNote && st.i === 0 && !st.answered) host.appendChild(el(`<p class="small muted">${esc(opts.passNote)}</p>`));
    const head = el('<div class="qhead"></div>');
    if (q.sym) head.appendChild(el(`<div class="big-sym">${esc(q.sym)}</div>`));
    if (q.chord) { const done = st.chordStep >= q.ch.t.length;
      head.appendChild(el(`<div class="q">${done ? '구성음 전체 위치입니다' : esc(q.ch.lb[st.chordStep]) + '를 누르세요 <span class="muted small">(' + (st.chordStep + 1) + '/' + q.ch.t.length + ')</span>'}</div>`)); }
    else head.appendChild(el(`<div class="q">${esc(q.prompt)}</div>`));
    if (q.sub) head.appendChild(el(`<div class="sub">${esc(q.sub)}</div>`));
    host.appendChild(head);
    if (q.rhythm) renderRhythm(q);
    if (q.replay) { const rb = el(`<button class="btn block" style="min-height:${q.board ? 48 : 64}px">${I.sound}${q.replayLabel || '두 음 다시 듣기'}</button>`); rb.onclick = q.replay; host.appendChild(rb); }
    let bEl = null;
    if (q.board) {
      const dots = (st.answered && st.res && st.res.dots) ? st.res.dots : (q.board.dots || []).concat(st.found, st.extra);
      if (q.chord && st.answered) { const all = []; for (let s = 0; s < NS(); s++) for (let f = 0; f <= 12; f++) { const j = q.ch.t.indexOf((pcAt(s, f) - q.root + 12) % 12); if (j >= 0) all.push({s, f, t:IVL_SHORT[q.ch.t[j]], c:j ? 'tone' : 'root'}); }
        bEl = board(Object.assign({}, q.board, {dots:all, tap:(s, f) => AU.pluck(midiAt(s, f))})); }
      else bEl = board(Object.assign({}, q.board, {dots, tap:st.answered ? (s, f) => AU.pluck(midiAt(s, f)) : (q.tap || q.chord) ? onTap : null}));
      bEl.classList.add('fit'); host.appendChild(bEl);
    }
    if (!st.answered && (q.mic || q.chord) && micOn()) host.appendChild(el(`<div class="listen" id="listen"><i class="lv"></i><span>듣는 중입니다. ${instName()}로 쳐 보세요${q.mic && q.mic.midi ? ' (높이까지 확인)' : ''}</span></div>`));
    if (st.chordMsg && !st.answered) host.appendChild(el(`<div class="feedback ${st.chordMsg.ok ? 'ok' : 'bad'}"><span>${esc(st.chordMsg.t)}</span></div>`));
    renderFoot();
    if (bEl) requestAnimationFrame(() => { const sb = host.closest('.sheet-body'); if (!sb) return;
      const used = sb.scrollHeight - bEl.offsetHeight;
      bEl.style.setProperty('--fit-h', Math.max(240, sb.clientHeight - used - 2) + 'px'); });
  }
  function renderRhythm(q) {
    const box = el('<div style="display:flex;flex-direction:column;gap:10px"></div>');
    const lb = el(`<button class="btn">${I.play}리듬 ${st.answered ? '다시 ' : ''}듣기</button>`);
    lb.onclick = () => { if (Clock.on) { Clock.stop(); return; } lb.innerHTML = I.stop + '멈추기'; playRhythm(q.rhythm.id, 80, 2, null, () => { lb.innerHTML = I.play + '리듬 다시 듣기'; }); };
    box.appendChild(lb);
    q.rhythm.opts.forEach((id, k) => { const r = RHYTHMS.find(x => x.id === id);
      const o = el(`<button class="ropt${st.answered && id === q.rhythm.id ? ' pick' : ''}"><span class="small muted">${st.answered ? esc(r.name) : '보기 ' + (k + 1)}</span>${rhythmGrid(id)}</button>`);
      if (!st.answered) o.onclick = () => onChoice(id); else o.onclick = () => playRhythm(id, 80, 1);
      box.appendChild(o); });
    host.appendChild(box);
    if (!st.answered && !st.autoPlayed) { st.autoPlayed = true; setTimeout(() => lb.click(), 250); }
  }
  const COLS = {2:2, 3:3, 4:4, 5:5, 6:3, 7:7, 8:4, 12:6};
  function renderFoot() {
    foot.innerHTML = ''; footWrap.classList.remove('ok', 'bad'); const q = st.q;
    if (!st.answered) {
      if (q.answers) { const n = q.answers.length, a = el(`<div class="answers${n === 12 ? ' many' : ''}${q.wide ? ' long' : ''}" style="grid-template-columns:repeat(${q.wide && n === 4 && q.answers.some(x => String(x.t).length > 7) ? 1 : q.wide && n === 4 ? 2 : COLS[n] || 4},1fr)"></div>`);
        q.answers.forEach(x => { const b = el(`<button class="btn">${esc(x.t)}</button>`); b.onclick = () => onChoice(x.v); a.appendChild(b); }); foot.appendChild(a); }
      if (q.tap || q.chord) { const b = el('<button class="btn">정답 보기</button>'); b.onclick = () => giveUp(); foot.appendChild(b); }
      if (q.mic || q.chord) { const m = el(`<button class="btn${D.settings.mic ? ' primary' : ''}" aria-pressed="${D.settings.mic}">${I.mic}${D.settings.mic ? '마이크 끄기' : instName() + '로 치기'}</button>`); m.onclick = toggleMic; foot.appendChild(m); }
      if (q.rhythm) foot.appendChild(el('<p class="small muted" style="margin:0;width:100%;text-align:center">위의 보기 중에서 들린 리듬을 고르세요</p>'));
      const sk = el('<button class="btn sm skip-btn">이 문제 넘어가기</button>'); sk.onclick = skip; foot.appendChild(sk);
      return;
    }
    const r = st.res; footWrap.classList.add(r.ok ? 'ok' : 'bad');
    const f = el(`<div class="fbk ${r.ok ? 'ok' : 'bad'}" role="status"><div class="h">${r.ok ? I.okc : I.noc}<span>${esc(r.title)}</span>${st.gained ? `<span class="xp">+${st.gained} XP</span>` : ''}</div>${r.text ? `<div class="tx">${esc(r.text)}</div>` : ''}<div class="acts"></div></div>`);
    if (r.play) { const pb = el(`<button class="btn sm">${I.sound}두 음 듣기</button>`); pb.onclick = () => AU.seq(r.play, .45); $('.acts', f).appendChild(pb); }
    const nb = el(`<button class="btn ${r.ok ? 'good' : 'bad'}">${opts.count && st.i + 1 >= total ? '결과 보기' : '다음 문제'}</button>`); nb.onclick = next; $('.acts', f).appendChild(nb);
    foot.appendChild(f);
  }
  async function toggleMic() {
    if (D.settings.mic) { D.settings.mic = false; save(); Mic.stop(); render(); return; }
    const ok = await Mic.start(onPitch); if (!ok) { toast(Mic.err); return; }
    D.settings.mic = true; save(); render();
  }
  function onPitch(p) {
    const q = st.q; if (!q || st.answered) return; const L = $('#listen span', host);
    if (!p) return;
    if (L) L.textContent = '들린 음: ' + both(p.pc);
    if (!p.stable) return;
    if (q.chord) { const want = (q.root + q.ch.t[st.chordStep]) % 12; if (p.pc === want) { const pos = allPos(want, 12).find(x => midiAt(x.s, x.f) === p.midi) || allPos(want, 12)[0]; Mic.hist = []; onTap(pos.s, pos.f, true); } return; }
    if (!q.mic) return;
    const hit = q.mic.midi != null ? p.midi === q.mic.midi : p.pc === q.mic.pc;
    if (hit) { Mic.hist = []; const r = q.tap(q.sol.s, q.sol.f);
      finish({ok:true, title:'맞습니다. ' + q.mic.label + '을(를) 쳤습니다', text:r.text, dots:r.dots}); }
  }
  function onTap(s, f, fromMic) {
    const q = st.q; if (st.answered) return; if (!fromMic) AU.pluck(midiAt(s, f));
    if (q.chord) {
      const want = (q.root + q.ch.t[st.chordStep]) % 12, got = pcAt(s, f), semi = q.ch.t[st.chordStep];
      const why = semi ? q.ch.lb[st.chordStep] + '는 루트 ' + q.rn + '에서 ' + semi + '칸 위, ' + nm(want, q.flat) + '입니다.' : '루트는 코드 기호의 첫 글자 ' + q.rn + '입니다.';
      if (got === want) { st.found.push({s, f, t:IVL_SHORT[semi], c:st.chordStep ? 'tone' : 'root'}); st.chordStep++; st.chordMsg = {ok:true, t:'맞습니다. ' + why};
        if (st.chordStep >= q.ch.t.length) finish({ok:!st.chordMiss, title:st.chordMiss ? '완성했지만 틀린 자리가 있었습니다' : '한 번에 맞혔습니다',
          text:q.sym + '의 음은 ' + q.ch.t.map(x => nm((q.root + x) % 12, q.flat)).join(', ') + '입니다. 지판의 같은 음을 모두 표시했습니다. 눌러서 소리를 들어 보세요.'});
        else render(); }
      else { st.chordMiss = true; vibrate(60); st.chordMsg = {ok:false, t:'누른 음은 ' + nm(got, q.flat) + '입니다. ' + why}; st.extra = [{s, f, t:nm(got, q.flat), c:'bad'}]; render(); st.extra = []; }
      return; }
    finish(q.tap(s, f));
  }
  function onChoice(v) { const q = st.q; if (st.answered) return; finish(q.answer(v)); }
  function giveUp() { const q = st.q;
    if (q.chord) { st.chordMiss = true; st.chordStep = q.ch.t.length; finish({ok:false, title:'정답을 확인하세요', text:q.sym + '의 음은 ' + q.ch.t.map(x => nm((q.root + x) % 12, q.flat)).join(', ') + '입니다. ' + q.sub}); return; }
    const r = q.tap(q.sol.s, q.sol.f);
    finish({ok:false, title:'정답을 확인하세요', text:r.text, dots:(r.dots || []).filter(d => d.c !== 'bad')});
  }
  function skip() { if (st.answered) return; Clock.stop(); st.combo = 0; st.results.push({key:st.q.key, ok:false, skip:true}); next(); }
  function finish(res) {
    if (st.answered) return; st.answered = true; st.res = res; st.chordMsg = null; Clock.stop();
    if (res.ok) { st.right++; st.combo++; st.gained = 10 + Math.min(st.combo - 1, 4) * 2; addXP(st.gained); }
    else { st.combo = 0; st.gained = 0; vibrate([40, 40, 40]); }
    record(st.q.skill, st.q.key, res.ok); st.results.push({key:st.q.key, ok:res.ok});
    render(); const sb = host.closest('.sheet-body'); if (sb) sb.scrollTo({top:0});
  }
  function next() {
    Clock.stop();
    if (total && st.i + 1 >= total) { st.done = true; footWrap.classList.remove('ok', 'bad'); opts.onDone({right:st.right, total, results:st.results}); return; }
    st.i++; load();
  }
  function load() {
    Object.assign(st, {answered:false, res:null, gained:0, chordStep:0, chordMiss:false, found:[], extra:[], chordMsg:null, autoPlayed:false});
    st.q = opts.next(st.i); window.__bt = st; if (!st.q) { opts.onDone({right:st.right, total:st.i, results:st.results}); return; }
    render(); const sb = host.closest('.sheet-body'); if (sb && st.i) sb.scrollTo({top:0}); if (st.q.onShow) setTimeout(st.q.onShow, 200);
    if (micOn() && (st.q.mic || st.q.chord)) Mic.start(onPitch);
  }
  load();
  return {stop() { Clock.stop(); Mic.stop(); }};
}

/* ---------- 시트(화면 전체를 덮는 창) ---------- */
let sheetClose = null;
function openSheet(title, build, opts = {}) {
  closeSheet(true);
  const sh = el(`<section class="sheet" role="dialog" aria-label="${esc(title)}"><div class="sheet-bar"><button class="icon-btn" aria-label="닫기">${I.back}</button><h2>${esc(title)}</h2><span id="sheet-extra"></span></div><div class="sheet-body"><div class="sheet-in"></div></div><div class="sheet-foot"><div class="in"></div></div></section>`);
  $('#sheet-root').appendChild(sh); document.body.style.overflow = 'hidden';
  $('.sheet-bar .icon-btn', sh).onclick = () => history.back();
  const api = {el:sh, body:$('.sheet-in', sh), foot:$('.sheet-foot .in', sh), footWrap:$('.sheet-foot', sh), setTitle:t => $('.sheet-bar h2', sh).textContent = t,
    progress(n, i) { let p = $('.progress', sh); if (!p) { p = el('<div class="progress"></div>'); $('.sheet-bar', sh).after(p); } p.innerHTML = Array.from({length:n}, (_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join(''); },
    scrollTop() { $('.sheet-body', sh).scrollTo({top:0}); }, cleanup:null};
  sheetClose = () => { Clock.stop(); Mic.stop(); Wake.off(); api.cleanup && api.cleanup(); sh.remove(); document.body.style.overflow = ''; sheetClose = null; renderTab(); };
  Wake.on(); build(api);
  return api;
}
function closeSheet(silent) { if (sheetClose) sheetClose(); }

/* ---------- 레슨 화면 ---------- */
function openLesson(id, startPhase) {
  const L = LESSONS.find(l => l.id === id); if (!L) return;
  openSheet(tierName(L.unit) + ' ' + (LESSONS.filter(l => l.unit === L.unit).indexOf(L) + 1) + '. ' + L.title, sh => {
    const n = L.cards.length; let phase = startPhase || 'cards', idx = 0, runner = null;
    sh.cleanup = () => runner && runner.stop();
    function cards() {
      phase = 'cards'; sh.progress(n + 2, idx); const c = L.cards[idx]; sh.body.innerHTML = '';
      const card = el(`<article class="card lcard"><span class="eyebrow">설명 ${idx + 1} / ${n}</span><h3>${esc(c.h)}</h3><div class="body">${c.p.map(x => `<p>${esc(x)}</p>`).join('')}</div></article>`);
      if (c.table) card.appendChild(el(`<table class="t"><tbody>${c.table.map(r => `<tr>${r.map((x, i) => i ? `<td>${esc(x)}</td>` : `<td><b>${esc(x)}</b></td>`).join('')}</tr>`).join('')}</tbody></table>`));
      if (c.fig) card.appendChild(figure(c.fig));
      if (c.rhythm) [c.rhythm, c.rhythm2].filter(Boolean).forEach(id2 => { const r = RHYTHMS.find(x => x.id === id2);
        const box = el(`<div style="display:flex;flex-direction:column;gap:6px"><b class="small">${esc(r.name)} <span class="muted">${esc(r.count)}</span></b><div class="rg">${rhythmGrid(id2)}</div><div class="rcount" style="grid-template-columns:repeat(${r.n},1fr)">${rCount(r).map(x => `<span>${x}</span>`).join('')}</div></div>`);
        const b = el(`<button class="btn sm" style="align-self:flex-start">${I.play}들어 보기</button>`);
        b.onclick = () => { if (Clock.on) { Clock.stop(); return; } b.innerHTML = I.stop + '멈추기'; playRhythm(id2, 72, 2, k => { $('.rg', box).innerHTML = rhythmGrid(id2, k); }, () => { b.innerHTML = I.play + '들어 보기'; $('.rg', box).innerHTML = rhythmGrid(id2); }); };
        box.appendChild(b); card.appendChild(box); });
      if (c.line) { const box = el(`<div style="display:flex;flex-direction:column;gap:8px"><div class="lsteps"></div></div>`);
        const draw = now => $('.lsteps', box).innerHTML = `<div class="rgrid" style="grid-template-columns:repeat(8,1fr)">${c.line.pat.map((r, k) => `<i style="height:40px;display:grid;place-items:center;font-size:13px;font-weight:800;font-style:normal" class="${r ? 'on' : ''}${k === now ? ' now' : ''}">${r || ''}</i>`).join('')}</div><div class="rcount" style="grid-template-columns:repeat(8,1fr)">${['1','&','2','&','3','&','4','&'].map(x => `<span>${x}</span>`).join('')}</div>`;
        draw(-1); const b = el(`<button class="btn sm" style="align-self:flex-start">${I.play}A로 들어 보기</button>`);
        b.onclick = () => { if (Clock.on) { Clock.stop(); return; } b.innerHTML = I.stop + '멈추기'; playLine(c.line.pat, 33, 84, k => draw(k % 8), () => { b.innerHTML = I.play + 'A로 들어 보기'; draw(-1); }); };
        box.appendChild(b); card.appendChild(box); }
      if (c.sound) { const b = el(`<button class="btn sm" style="align-self:flex-start">${I.sound}소리 들어 보기</button>`);
        b.onclick = () => { if (c.sound.strum) { c.sound.strum.forEach((id, k) => setTimeout(() => AU.strum(id), k * 1300)); return; }
          const d = AU.seq(c.sound.seq, .5); if (c.sound.then) setTimeout(() => AU.seq(c.sound.then, .5), d * 1000 + 500); }; card.appendChild(b); }
      if (c.tip) card.appendChild(el(`<div class="tip">${I.tip}<span>${esc(c.tip)}</span></div>`));
      sh.body.appendChild(card);
      sh.foot.innerHTML = '';
      const prev = el('<button class="btn">이전</button>'); prev.disabled = idx === 0; prev.onclick = () => { Clock.stop(); idx--; cards(); sh.scrollTop(); };
      const nx = el(`<button class="btn primary">${idx === n - 1 ? '연습 문제 풀기' : '다음'}</button>`);
      nx.onclick = () => { Clock.stop(); if (idx < n - 1) { idx++; cards(); sh.scrollTop(); } else drill(); };
      sh.foot.append(prev, nx);
    }
    function drill() {
      phase = 'drill'; sh.progress(n + 2, n); sh.body.innerHTML = ''; sh.scrollTop();
      const host = el('<div style="display:flex;flex-direction:column;gap:16px"></div>');
      sh.body.append(host);
      const ctx = {L}; runner = Runner(host, sh.foot, {count:10, passNote:'8개 이상 맞히면 통과', next:() => genFromDrill(L.drill, ctx), onDone:res => result(res)});
    }
    function result(res) {
      Mic.stop(); const pass = res.right >= 8, rec = D.lessons[L.id] || (D.lessons[L.id] = {}), first = pass && !rec.done, stars = starsOf(res.right);
      rec.best = Math.max(rec.best || 0, res.right); rec.stars = Math.max(rec.stars || 0, stars); rec.tries = (rec.tries || 0) + 1; if (pass && !rec.done) { rec.done = true; rec.at = today(); }
      const gain = first ? 50 : pass ? 20 : 10; addXP(gain, true);
      stepsOf().last = L.id; setStep('lesson'); save();
      sh.body.innerHTML = ''; sh.scrollTop(); sh.progress(n + 2, n + (pass ? 1 : 0));
      const nextL = LESSONS[lessonIndex(L.id) + 1];
      sh.body.appendChild(el(`<div class="card result hero"><span class="eyebrow">${pass ? '통과했습니다' : '조금만 더'}</span>${starsHtml(stars)}<div class="score">${res.right}<span class="muted" style="font-size:28px"> / ${res.total}</span></div><div class="xp-gain">+${gain} XP${first ? ', 레슨 완료 보너스' : ''}</div>
        <p>${pass ? (nextL ? '다음 레슨 "' + esc(nextL.title) + '"이 열렸습니다. 이제 ' + instName() + '를 들고 배운 것을 손으로 익혀 보세요.' : '모든 레슨을 마쳤습니다. 매일 복습과 자유 연습으로 이어 가세요.') : '8개 이상 맞히면 통과입니다. 틀린 문제의 풀이를 떠올리며 한 번 더 풀어 보세요. 설명을 다시 봐도 좋습니다.'}</p></div>`));
      const wrong = res.results.filter(r => !r.ok && !r.skip).length, skipped = res.results.filter(r => r.skip).length;
      if (skipped) sh.body.appendChild(el(`<div class="card"><b>넘어간 ${skipped}문제는 점수에 들어가지 않았습니다</b><span class="small muted">복습 목록에도 넣지 않습니다. 준비되면 다시 풀어 보세요.</span></div>`));
      if (wrong) sh.body.appendChild(el(`<div class="card"><b>틀린 ${wrong}문제는 내일 복습에 다시 나옵니다</b><span class="small muted">같은 문제를 며칠에 걸쳐 다시 맞히면 오래 기억에 남습니다.</span></div>`));
      sh.foot.innerHTML = '';
      if (pass) { const a = el('<button class="btn">레슨 목록</button>'); a.onclick = () => history.back();
        const b = el('<button class="btn primary">악기로 해 보기</button>'); b.onclick = () => play(); sh.foot.append(a, b); }
      else { const a = el('<button class="btn">설명 다시 보기</button>'); a.onclick = () => { idx = 0; cards(); };
        const b = el('<button class="btn primary">다시 풀기</button>'); b.onclick = () => drill(); sh.foot.append(a, b);
        if (nextL) { const c = el('<button class="btn block">통과하지 않고 다음 레슨으로</button>'); c.onclick = () => { rec.done = true; rec.at = rec.at || today(); save(); location.replace('#lesson-' + nextL.id); }; sh.foot.appendChild(c); } }
    }
    function play() { phase = 'play'; sh.progress(n + 2, n + 1); sh.body.innerHTML = ''; sh.scrollTop(); playTask(sh, L, () => { setStep('play'); }); }
    if (phase === 'play') play(); else if (phase === 'drill') drill(); else cards();
  });
  location.hash = 'lesson-' + id;
}

/* 악기 과제 화면 */
function metroBox(bpm0, onBpm) {
  let bpm = bpm0; const box = el(`<div class="card"><div class="spread"><b>메트로놈</b><div class="beats" aria-hidden="true"><i></i><i></i><i></i><i></i></div></div>
    <div class="bpm"><button class="btn sm" data-d="-5" aria-label="5 느리게">-5</button><input type="range" min="40" max="200" value="${bpm}" aria-label="빠르기"><button class="btn sm" data-d="5" aria-label="5 빠르게">+5</button><output class="num">${bpm}</output></div>
    <button class="btn primary block mb">${I.play}메트로놈 시작</button></div>`);
  const out = $('output', box), rng = $('input', box), go = $('.mb', box);
  const set = v => { bpm = Math.max(40, Math.min(200, v)); out.textContent = bpm; rng.value = bpm; Clock.bpm = bpm; onBpm && onBpm(bpm); };
  rng.oninput = () => set(+rng.value); $$('[data-d]', box).forEach(b => b.onclick = () => set(bpm + +b.dataset.d));
  go.onclick = () => { if (Clock.on) { Clock.stop(); return; } go.innerHTML = I.stop + '멈추기';
    Clock.start({bpm, sub:1, tick:(n, t) => AU.click(t, n % 4 === 0), ui:n => $$('.beats i', box).forEach((x, i) => { x.className = i === n % 4 ? 'on' + (i === 0 ? ' first' : '') : ''; }),
      onstop:() => { go.innerHTML = I.play + '메트로놈 시작'; $$('.beats i', box).forEach(x => x.className = ''); }}); };
  box.getBpm = () => bpm;
  return box;
}
function playTask(sh, L, onDone) {
  const P = L.play; sh.setTitle('악기로 해 보기: ' + P.title);
  sh.body.appendChild(el(`<div class="card"><span class="eyebrow">${esc(L.title)}</span><h3 style="font-size:20px">${esc(P.title)}</h3><ol style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:6px;font-size:16px">${P.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>`));
  if (P.kind === 'tap') { sh.body.appendChild(tapTrainer(P.rhythm, P.bpm)); }
  else sh.body.appendChild(metroBox(P.bpm));
  let micActive = false;
  if (P.kind === 'seq') {
    let i = 0; const seq = P.seq, minF = Math.max(0, Math.min(...seq.map(p => p[1])) - 1), maxF = Math.min(12, Math.max(minF + 4, Math.max(...seq.map(p => p[1])) + 1));
    const box = el(`<div class="card"><div class="spread"><b>따라 치기</b><span class="pill num" id="seqc"></span></div><div class="sq-board" style="display:flex;justify-content:center"></div><div class="listen" id="seql" hidden><i class="lv"></i><span>마이크로 듣는 중입니다</span></div><div class="row"><button class="btn sm" id="sq-prev">이전 음</button><button class="btn sm" id="sq-next">다음 음</button><button class="btn sm" id="sq-play">${I.sound}모두 듣기</button></div></div>`);
    const draw = () => { const dots = seq.map((p, k) => ({s:p[0], f:p[1], t:nm(pcAt(p[0], p[1])), c:k < i ? 'ok' : k === i ? 'ask' : 'dim', pulse:k === i}));
      const uniq = []; dots.forEach(d => { const j = uniq.findIndex(u => u.s === d.s && u.f === d.f); if (j < 0) uniq.push(d); else if (d.c === 'ask') uniq[j] = d; else if (uniq[j].c === 'dim' && d.c === 'ok') uniq[j] = d; });
      const b = $('.sq-board', box); b.innerHTML = ''; b.appendChild(board({from:minF <= 1 ? 0 : minF, to:maxF, dots:uniq, tap:(s, f) => AU.pluck(midiAt(s, f))}));
      $('#seqc', box).textContent = i >= seq.length ? '완료' : (i + 1) + ' / ' + seq.length + ', ' + posName(seq[i][0], seq[i][1]); };
    const adv = () => { i++; if (i >= seq.length) { draw(); doneMsg(); } else draw(); };
    $('#sq-next', box).onclick = () => { if (i < seq.length) { AU.pluck(midiAt(...seq[i])); adv(); } };
    $('#sq-prev', box).onclick = () => { if (i > 0) { i--; draw(); } };
    $('#sq-play', box).onclick = () => AU.seq(seq, 60 / P.bpm);
    draw(); sh.body.appendChild(box);
    const micLabel = I.mic + instName() + ' 소리로 자동 확인하기', micBtn = el(`<button class="btn block">${micLabel}</button>`);
    micBtn.onclick = async () => { if (micActive) { Mic.stop(); micActive = false; micBtn.innerHTML = micLabel; $('#seql', box).hidden = true; return; }
      const ok = await Mic.start(p => { if (!p || i >= seq.length) return; $('#seql span', box).textContent = '들린 음: ' + both(p.pc); if (p.stable && p.pc === pcAt(...seq[i])) { Mic.hist = []; adv(); } });
      if (!ok) { toast(Mic.err); return; } micActive = true; micBtn.innerHTML = I.mic + '마이크 끄기'; $('#seql', box).hidden = false; };
    sh.body.appendChild(micBtn);
    sh.body.appendChild(el('<p class="small muted">마이크는 폰을 앰프나 악기 몸통 가까이에 두면 잘 듣습니다. 음 이름으로 확인하므로 다른 줄의 같은 음도 맞게 처리됩니다.</p>'));
  }
  function doneMsg() { if ($('#done-msg', sh.body)) return; sh.body.appendChild(el('<div class="feedback ok" id="done-msg"><b class="h">끝까지 쳤습니다</b><span>메트로놈 빠르기를 5 올려 한 번 더 해 보세요. 실수 없이 세 번 연속 치면 손에 익은 것입니다.</span></div>')); }
  sh.foot.innerHTML = '';
  const b = el('<button class="btn primary">다 했어요</button>'); b.onclick = () => { onDone(); addXP(30, true); toast('악기 연습을 기록했습니다'); setTimeout(() => history.back(), 500); };
  sh.foot.appendChild(b);
}
function tapTrainer(rid, bpm0) {
  if ((RHYTHMS.find(x => x.id === rid) || {}).n !== 16) rid = 'e';
  const r = () => RHYTHMS.find(x => x.id === cur); let cur = rid, taps = [], pat = RHYTHMS.find(x => x.id === rid).s.slice();
  const box = el(`<div style="display:flex;flex-direction:column;gap:12px"></div>`);
  const m = metroBox(bpm0); $('.mb', m).remove(); box.appendChild(m);
  const chips = el('<div class="chips"></div>'); RHYTHMS.filter(x => x.n === 16).forEach(x => { const c = el(`<button class="chip" aria-pressed="${x.id === cur}">${esc(x.name)}</button>`); c.onclick = () => { cur = x.id; pat = x.s.slice(); $$('.chip', chips).forEach(k => k.setAttribute('aria-pressed', k === c)); grid(-1); }; chips.appendChild(c); });
  box.appendChild(chips);
  const g = el('<div><div class="rgrid edit"></div><div class="rcount">' + COUNT16.map(x => `<span>${x}</span>`).join('') + '</div></div>'); box.appendChild(g);
  const grid = now => { $('.rgrid', g).innerHTML = Array.from({length:16}, (_, k) => `<i data-k="${k}" class="${pat.includes(k) ? 'on' : ''}${k % 4 === 0 ? ' beat' : ''}${k === now ? ' now' : ''}"></i>`).join(''); };
  $('.rgrid', g).onclick = e => { const k = e.target.dataset.k; if (k == null) return; const n = +k; pat = pat.includes(n) ? pat.filter(x => x !== n) : pat.concat(n); grid(-1); };
  grid(-1);
  const row = el(`<div class="row"><button class="btn primary" id="tp">${I.play}시작</button><label class="sw" style="flex:1"><span class="small">정답 리듬을 베이스 소리로 듣기</span><input type="checkbox" id="tg" checked></label></div>`); box.appendChild(row);
  const pad = el('<button class="pad">박에 맞춰 여기를 두드리기</button>'); box.appendChild(pad);
  const res = el('<div class="card"><b id="tr">시작을 누르고 검은 칸에 맞춰 두드리세요</b><span class="small muted" id="ta">블루투스 이어폰과 스피커는 소리가 늦게 나와 오차가 크게 나옵니다. 폰 스피커나 유선 이어폰으로 재세요.</span></div>'); box.appendChild(res);
  $('#tp', row).onclick = () => { if (Clock.on) { Clock.stop(); return; } taps = []; $('#tp', row).innerHTML = I.stop + '멈추기';
    Clock.start({bpm:m.getBpm(), sub:4, tick:(n, t) => { const k = n % 16; if (k % 4 === 0) AU.click(t, k === 0); if (pat.includes(k) && $('#tg', row).checked) AU.pluck(TH.inst().low, t, .25); }, ui:n => grid(n % 16), onstop:() => { $('#tp', row).innerHTML = I.play + '시작'; grid(-1); }}); };
  pad.addEventListener('pointerdown', e => { e.preventDefault(); if (!Clock.on) { $('#tr', res).textContent = '먼저 시작을 누르세요'; return; }
    const a = AU.ctx, lat = a.outputLatency || a.baseLatency || 0, t = a.currentTime; let best = null;
    Clock.log.forEach(([n, tt]) => { if (!pat.includes(n % 16)) return; const d = t - (tt + lat); if (best === null || Math.abs(d) < Math.abs(best)) best = d; });
    if (best === null) return; const ms = Math.round(best * 1000), step = 60000 / Clock.bpm / 4;
    if (Math.abs(ms) > step * .9) { $('#tr', res).textContent = '쉬는 자리에서 두드렸습니다'; vibrate(30); return; }
    taps.push(Math.abs(ms)); if (taps.length > 16) taps.shift();
    $('#tr', res).textContent = Math.abs(ms) <= 30 ? '정확합니다 (' + (ms >= 0 ? '+' : '') + ms + 'ms)' : ms > 0 ? ms + 'ms 늦었습니다' : (-ms) + 'ms 빨랐습니다';
    const avg = Math.round(taps.reduce((x, y) => x + y, 0) / taps.length);
    $('#ta', res).textContent = '최근 ' + taps.length + '번 평균 오차 ' + avg + 'ms. 30ms 안쪽이면 박에 붙어 있는 것입니다.'; });
  return box;
}

/* ---------- 연습 도구 ---------- */
const TOOLS = [
  {id:'tuner', ic:'tuner', name:'튜너', desc:'마이크로 줄을 맞춥니다'},
  {id:'metro', ic:'metro', name:'메트로놈', desc:'빠르기를 정하고 박에 맞춰 칩니다'},
  {id:'notes', ic:'dots', name:'음 위치', desc:'줄과 프렛에서 음 찾기'},
  {id:'ivl', ic:'ivl', name:'음정', desc:'루트에서 몇 도인지 익히기'},
  {id:'chord', ic:'chord', name:'코드톤', desc:'코드 기호 보고 구성음 짚기'},
  {id:'scale', ic:'scale', name:'스케일 보기', desc:'스케일과 모드를 지판에 표시'},
  {id:'ear', ic:'ear', name:'리듬 듣기', desc:'들리는 리듬 맞히기'},
  {id:'tap', ic:'tap', name:'박 맞추기', desc:'두드려서 박 오차 재기'},
  {id:'weak', ic:'target', name:'약한 문제 집중', desc:'자주 틀린 문제만 다시'},
];
function openTool(id) {
  const T = TOOLS.find(t => t.id === id); if (!T) return;
  openSheet(T.name, sh => {
    let runner = null; sh.cleanup = () => runner && runner.stop();
    const runDrill = (gen, settings) => { sh.body.innerHTML = ''; if (settings) sh.body.appendChild(settings);
      const host = el('<div style="display:flex;flex-direction:column;gap:16px"></div>'); sh.body.appendChild(host);
      runner && runner.stop(); runner = Runner(host, sh.foot, {count:0, next:gen, onDone:() => {}}); };
    const chipRow = (items, curv, on) => { const c = el('<div class="chips"></div>'); items.forEach(([v, t]) => { const b = el(`<button class="chip" aria-pressed="${v === curv}">${esc(t)}</button>`); b.onclick = () => on(v); c.appendChild(b); }); return c; };
    if (id === 'tuner') return tuner(sh);
    if (id === 'metro') { sh.body.appendChild(metroBox(80)); sh.body.appendChild(el('<div class="card small"><b>쓰는 요령</b><span class="muted">높은 소리가 마디의 첫 박입니다. 클릭이 내 베이스 소리에 묻혀 들리지 않으면 정확하게 친 것입니다. 틀리기 시작하면 10 낮추세요.</span></div>')); sh.footWrap.hidden = true; return; }
    if (id === 'tap') { sh.body.appendChild(tapTrainer('e', 80)); sh.footWrap.hidden = true; return; }
    if (id === 'notes') { let st = 'all', nat = true, mf = 12;
      const go = () => { const s = el('<div style="display:flex;flex-direction:column;gap:8px"></div>');
        s.appendChild(chipRow([['all','모든 줄'],['0','E줄'],['1','A줄'],['2','D줄'],['3','G줄']], st, v => { st = v; go(); }));
        s.appendChild(chipRow([['nat','자연음만'],['all','샵 포함'],['5','0~5프렛'],['12','0~12프렛']].map(x => x), null, v => { if (v === 'nat') nat = true; else if (v === 'all') nat = false; else mf = +v; go(); }));
        $$('.chip', s.children[1]).forEach((b, k) => b.setAttribute('aria-pressed', [nat, !nat, mf === 5, mf === 12][k]));
        runDrill(() => qFind({strings:st === 'all' ? [0,1,2,3] : [+st], maxF:mf, nat}), s); };
      return go(); }
    if (id === 'ivl') { let set = 'basic'; const go = () => runDrill(() => qIvl(set === 'basic' ? [3,4,5,7,10,12] : [1,2,3,4,5,6,7,8,9,10,11,12]), chipRow([['basic','기본 6개'],['all','12개 전부']], set, v => { set = v; go(); })); return go(); }
    if (id === 'chord') { let set = 'tri'; const go = () => runDrill(() => qChord(set === 'tri' ? ['5','maj','m'] : ['maj','m','7','m7','maj7','sus4','m7b5']), chipRow([['tri','파워코드와 3화음'],['all','7화음 포함']], set, v => { set = v; go(); })); return go(); }
    if (id === 'ear') { let set = 'easy'; const go = () => runDrill(() => qRhythm(set === 'easy' ? ['q','e','off','qe'] : ['e','s','gal','332','push','off']), chipRow([['easy','4분과 8분'],['hard','16분과 당김음']], set, v => { set = v; go(); })); return go(); }
    if (id === 'weak') { const keys = Object.keys(D.items).filter(k => D.items[k].seen >= 1).sort((a, b) => (D.items[a].right / D.items[a].seen) - (D.items[b].right / D.items[b].seen)).slice(0, 12);
      if (!keys.length) { sh.body.appendChild(el('<div class="card"><b>아직 기록이 없습니다</b><span class="muted">레슨이나 연습 문제를 풀면 자주 틀린 문제가 여기에 모입니다.</span></div>')); sh.footWrap.hidden = true; return; }
      return runDrill(i => genFromKey(keys[i % keys.length]), el(`<div class="card small"><b>정답률이 낮은 문제 ${keys.length}개를 돌아가며 냅니다</b></div>`)); }
    if (id === 'scale') return scaleView(sh);
  });
  location.hash = 'tool-' + id;
}
function scaleView(sh) {
  sh.footWrap.hidden = true; let root = 9, sid = 'mpent', lab = 'deg';
  const go = () => { sh.body.innerHTML = ''; const sc = SCALES.find(x => x.id === sid), flat = scaleFlat(root, sc);
    const sel = el(`<div class="card"><div class="row"><label class="small muted" for="sr">루트</label><select id="sr" class="btn sm">${ROOT_NAMES.map((n, i) => `<option value="${i}"${i === root ? ' selected' : ''}>${n}</option>`).join('')}</select>
      <label class="small muted" for="ss">스케일</label><select id="ss" class="btn sm" style="flex:1">${SCALES.map(x => `<option value="${x.id}"${x.id === sid ? ' selected' : ''}>${x.name}</option>`).join('')}</select></div>
      <div class="seg"><button data-l="deg" aria-pressed="${lab === 'deg'}">도수로 보기</button><button data-l="name" aria-pressed="${lab === 'name'}">음 이름으로 보기</button></div></div>`);
    sh.body.appendChild(sel);
    $('#sr', sel).onchange = e => { root = +e.target.value; go(); }; $('#ss', sel).onchange = e => { sid = e.target.value; go(); };
    $$('[data-l]', sel).forEach(b => b.onclick = () => { lab = b.dataset.l; go(); });
    const info = el(`<div class="card"><h3 style="font-size:20px">${esc(nm(root, flat) + ' ' + sc.name)}</h3><p>${esc(sc.desc)}</p>
      <table class="t"><thead><tr><th>도수</th>${sc.lb.map(x => `<td><b>${x}</b></td>`).join('')}</tr></thead><tbody><tr><th>음</th>${sc.st.map((x, i) => `<td>${spell(root, sc, i)}</td>`).join('')}</tr><tr><th>칸</th>${sc.st.map(x => `<td class="num">${x}</td>`).join('')}</tr></tbody></table></div>`);
    sh.body.appendChild(info);
    const dots = []; for (let s = 0; s < NS(); s++) for (let f = 0; f <= 12; f++) { const i = sc.st.indexOf((pcAt(s, f) - root + 12) % 12); if (i >= 0) dots.push({s, f, t:lab === 'deg' ? sc.lb[i] : spell(root, sc, i), c:i ? 'tone' : 'root'}); }
    const b = el('<div style="display:flex;justify-content:center"></div>'); b.appendChild(board({dots, tap:(s, f) => AU.pluck(midiAt(s, f))})); sh.body.appendChild(b);
    const pb = el(`<button class="btn">${I.sound}한 옥타브 올라가며 듣기</button>`); pb.onclick = () => { const m0 = 28 + ((root - 4 + 12) % 12); const t0 = AU.now() + .05; sc.st.concat(12).forEach((x, k) => AU.pluck(m0 + x, t0 + k * .38)); }; sh.body.appendChild(pb);
  };
  go();
}
function tuner(sh) {
  sh.footWrap.hidden = true;
  const box = el(`<div class="card tuner"><div class="note" id="tn">-</div><div class="hint" id="th">아래 버튼을 누르고 줄 하나를 쳐 보세요</div>
    <svg class="gauge" viewBox="0 0 300 120" aria-hidden="true"><path d="M30 110 A120 120 0 0 1 270 110" fill="none" stroke="var(--line)" stroke-width="10" stroke-linecap="round"/>
    <path d="M131 12 A120 120 0 0 1 169 12" fill="none" stroke="var(--good)" stroke-width="10" stroke-linecap="round" opacity=".5"/>
    <line id="tneedle" x1="150" y1="112" x2="150" y2="22" stroke="var(--ink)" stroke-width="4" stroke-linecap="round" style="transform-origin:150px 112px;transition:transform .12s"/><circle cx="150" cy="112" r="7" fill="var(--ink)"/>
    <text x="30" y="118" font-size="12" fill="var(--muted)" text-anchor="middle">-50</text><text x="270" y="118" font-size="12" fill="var(--muted)" text-anchor="middle">+50</text></svg>
    <div class="small muted num" id="tf"> </div><div class="strpick">${STR.map((x, i) => `<div data-s="${i}">${x.n}</div>`).join('')}</div></div>`);
  sh.body.appendChild(box);
  const btn = el(`<button class="btn primary block">${I.mic}튜너 켜기</button>`); sh.body.appendChild(btn);
  sh.body.appendChild(el('<div class="card small"><b>맞추는 법</b><span class="muted">바늘이 왼쪽이면 음이 낮으니 줄감개를 감고, 오른쪽이면 풉니다. 가운데 초록 칸에 머무르면 맞은 것입니다. 줄을 친 뒤 손을 떼고 소리가 울리는 동안 보세요. 폰을 악기 몸통 가까이에 두면 잘 들립니다.</span></div>'));
  const tuned = new Set(); let hist = [];
  btn.onclick = async () => {
    if (Mic.on) { Mic.stop(); btn.innerHTML = I.mic + '튜너 켜기'; return; }
    const ok = await Mic.start(p => {
      if (!p) return; hist.push(p.freq); if (hist.length > 5) hist.shift();
      const f = hist.slice().sort((a, b) => a - b)[Math.floor(hist.length / 2)], m = TH.midiFromFreq(f), mid = Math.round(m), cents = Math.round((m - mid) * 100);
      // 가장 가까운 개방현
      let sNear = 0; STR.forEach((x, i) => { if (Math.abs(x.midi - m) < Math.abs(STR[sNear].midi - m)) sNear = i; });
      $('#tn', box).innerHTML = nm(((mid % 12) + 12) % 12) + '<sub>' + (Math.floor(mid / 12) - 1) + '</sub>';
      $('#tf', box).textContent = f.toFixed(1) + ' Hz';
      $('#tneedle', box).style.transform = 'rotate(' + Math.max(-60, Math.min(60, cents * 1.2)) + 'deg)';
      const h = $('#th', box), target = STR[sNear], diff = Math.round((m - target.midi) * 100);
      if (Math.abs(diff) <= 5) { h.className = 'hint ok'; h.textContent = TH.strName(sNear) + '이 맞았습니다'; tuned.add(sNear); }
      else if (Math.abs(diff) > 250) { h.className = 'hint'; h.textContent = '줄 하나만 울려 주세요'; }
      else { h.className = 'hint ' + (diff < 0 ? 'lo' : 'hi'); h.textContent = target.n + '줄: ' + Math.abs(diff) + '센트 ' + (diff < 0 ? '낮음. 줄감개를 감으세요' : '높음. 줄감개를 푸세요'); }
      $$('.strpick div', box).forEach((d, i) => d.className = tuned.has(i) ? 'tuned' : i === sNear ? 'on' : '');
    });
    if (!ok) { toast(Mic.err); return; }
    btn.innerHTML = I.mic + '튜너 끄기';
  };
}

/* ---------- 복습 ---------- */
function openReview() {
  const keys = reviewKeys().slice(0, 10);
  if (!keys.length) { setStep('review'); toast('오늘 복습할 문제가 없습니다'); renderTab(); return; }
  openSheet('오늘의 복습', sh => {
    let runner;
    sh.cleanup = () => runner && runner.stop();
    const host = el('<div style="display:flex;flex-direction:column;gap:16px"></div>'); sh.body.appendChild(host);
    runner = Runner(host, sh.foot, {count:keys.length, passNote:'전에 틀렸거나 다시 볼 때가 된 문제입니다', next:i => genFromKey(keys[i]) || qFind({}), onDone:res => {
      setStep('review'); sh.body.innerHTML = '';
      sh.body.appendChild(el(`<div class="card result hero"><span class="eyebrow">복습 완료</span><div class="score">${res.right}<span class="muted" style="font-size:28px"> / ${res.total}</span></div><p>맞힌 문제는 다음 복습까지 간격이 길어지고, 틀린 문제는 내일 다시 나옵니다.</p></div>`));
      sh.foot.innerHTML = ''; const b = el('<button class="btn primary">오늘 화면으로</button>'); b.onclick = () => history.back(); sh.foot.appendChild(b); }});
  });
  location.hash = 'review';
}

/* ---------- 탭 화면 ---------- */
const TABS = [['today','오늘'],['learn','배우기'],['practice','연습'],['records','기록']];
let tab = 'today';
function renderNav() {
  $('#nav').innerHTML = TABS.map(([id, t]) => `<button data-tab="${id}" aria-current="${id === tab ? 'page' : 'false'}">${I[id]}<span>${t}</span></button>`).join('');
}
$('#nav').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) location.hash = b.dataset.tab; });
function renderTab() {
  renderNav(); updateChip(); $('#bar-title').textContent = TABS.find(t => t[0] === tab)[1];
  const m = $('#main'); m.innerHTML = ''; const pg = el('<div class="page"></div>'); m.appendChild(pg);
  ({today:viewToday, learn:viewLearn, practice:viewPractice, records:viewRecords})[tab](pg);
}
/* 악기 스위치: 오늘과 배우기 화면 맨 위 */
function instSwitch(pg) {
  const w = el(`<div class="inst-wrap"><div class="inst-switch" role="group" aria-label="악기 고르기">${[['bass','베이스','4줄'],['guitar','일렉기타','6줄']].map(([k, n, sub]) => `<button data-i="${k}" aria-pressed="${D.inst === k}"><b>${n}</b><span>${sub}</span></button>`).join('')}</div></div>`);
  const tipOff = () => { if (!D.settings.instTip) { D.settings.instTip = true; save(); } };
  if (!D.settings.instTip) { const t = el(`<div class="inst-tip" role="note"><span>여기서 <b>일렉기타</b>로 바꿀 수 있어요. 진도는 악기마다 따로 저장됩니다.</span><button aria-label="알림 닫기">${I.x || '×'}</button></div>`);
    $('button', t).onclick = () => { tipOff(); t.remove(); }; w.appendChild(t); }
  $$('.inst-switch button', w).forEach(b => b.onclick = () => { tipOff(); if (b.dataset.i === D.inst) { renderTab(); return; } setInst(b.dataset.i); renderTab(); updateChip(); toast(instName() + '로 바꿨습니다'); });
  pg.appendChild(w);
}
function viewToday(pg) {
  instSwitch(pg);
  if (IN_ARTIFACT) moveCard(pg);
  const d = dayRec(), cl = currentLesson(), due = reviewKeys().length, hasItems = Object.keys(D.items).length > 0;
  const ds = stepsOf(d), playL = LESSONS.find(l => l.id === ds.last) || [...LESSONS].reverse().find(l => isDone(l.id)) || cl || LESSONS[0];
  const reviewDone = ds.review || due === 0, Lv = levelInfo();
  const totQ = Object.values(D.tot).reduce((a, r) => a + r[1], 0), totR = Object.values(D.tot).reduce((a, r) => a + r[0], 0);
  const doneN = LESSONS.filter(l => isDone(l.id)).length;
  pg.appendChild(el(`<div class="card hero lvl-card"><div class="lvl-badge"><div style="display:flex;flex-direction:column;align-items:center"><b>${Lv.level}</b><span>레벨</span></div></div>
    <div class="t">${esc(Lv.title)} <span class="pill accent" style="vertical-align:middle">${cl ? esc(tierName(cl.unit)) + ' 과정' : '전 과정 완료'}</span></div>
    <div><div class="bar-track"><div class="bar-fill" style="width:${Lv.pct}%"></div></div><div class="spread small muted" style="margin-top:6px"><span class="num" style="font-size:15px">${Lv.into} / ${Lv.need} XP</span><span>다음 레벨까지 ${Lv.need - Lv.into}</span></div></div></div>`));
  pg.appendChild(el(`<div class="stats3"><div><b>${streak()}</b><span>연속 일수</span></div><div><b>${doneN}<span class="muted" style="font-size:16px">/${LESSONS.length}</span></b><span>완료 레슨</span></div><div><b>${totQ ? Math.round(totR / totQ * 100) + '%' : '-'}</b><span>정답률</span></div></div>`));
  const steps = [
    {id:'review', n:1, done:reviewDone, t:'복습', s:due ? '다시 볼 문제 ' + Math.min(due, 10) + '개, 약 3분' : (hasItems ? '오늘 복습할 문제가 없습니다' : '레슨을 풀면 복습 문제가 생깁니다'), go:openReview},
    {id:'lesson', n:2, done:!!ds.lesson, t:cl ? tierName(cl.unit) + ' ' + (LESSONS.filter(l => l.unit === cl.unit).indexOf(cl) + 1) + '. ' + cl.title : '약한 문제 집중', s:cl ? '설명 읽고 문제 10개, 약 4분' : '모든 레슨 완료. 자주 틀린 문제를 풉니다', go:() => cl ? openLesson(cl.id) : openTool('weak')},
    {id:'play', n:3, done:!!ds.play, t:'악기로: ' + playL.play.title, s:'메트로놈 ' + playL.play.bpm + ', 약 3분', go:() => openLesson(playL.id, 'play')},
  ];
  const firstOpen = steps.find(x => !x.done);
  const card = el(`<div class="card"><div class="spread"><b style="font-size:18px">${d.done ? '오늘 연습을 마쳤습니다' : '오늘의 10분'}</b><span class="row" style="gap:6px">${steps.map(x => `<span class="led${x.done ? ' on' : ''}"></span>`).join('')}</span></div><div class="steps"></div></div>`);
  steps.forEach(x => { const b = el(`<button class="step${x.done ? ' done' : ''}${x === firstOpen ? ' next' : ''}"><span class="dot">${x.done ? I.check.replace('<svg', '<svg width="16" height="16"') : x.n}</span><span class="txt"><b>${esc(x.t)}</b><span>${esc(x.s)}</span></span>${I.chev}</button>`); b.onclick = x.go; $('.steps', card).appendChild(b); });
  if (firstOpen) { const go = el(`<button class="btn primary block">${firstOpen.n}단계 시작하기</button>`); go.onclick = firstOpen.go; card.appendChild(go); }
  pg.appendChild(card);
  const wk = el('<div class="card"><div class="spread"><b>이번 주</b><span class="small muted">세 단계를 마친 날에 불이 켜집니다</span></div><div class="week"></div></div>');
  for (let i = 6; i >= 0; i--) { const x = new Date(); x.setDate(x.getDate() - i); const on = (D.days[TH.dayKey(x)] || {}).done;
    $('.week', wk).appendChild(el(`<div class="${on ? 'on' : ''}${i === 0 ? ' today' : ''}"><i></i>${['일','월','화','수','목','금','토'][x.getDay()]}</div>`)); }
  pg.appendChild(wk);
  installCard(pg);
  shareCard(pg);
}
function viewLearn(pg) {
  instSwitch(pg);
  pg.appendChild(el(`<div><div class="eyebrow">6등급, ${LESSONS.length}레슨</div><h2 class="page-title">레슨 지도</h2><p class="muted small" style="margin-top:4px">문제 10개 중 8개를 맞히면 다음 레슨이 열립니다. 9개는 별 두 개, 10개는 별 세 개입니다.</p></div>`));
  const pickRow = el(`<div class="card"><div class="spread"><b>시작 등급</b><span class="small muted">고른 등급부터 열립니다</span></div><div class="chips">${UNITS.map(u => `<button class="chip" data-u="${u.id}" aria-pressed="${startTier() === u.id}">${esc(u.name)}</button>`).join('')}</div></div>`);
  $$('[data-u]', pickRow).forEach(b => b.onclick = () => { setStartTier(+b.dataset.u); renderTab(); setTimeout(() => { const h = document.getElementById('tier-' + b.dataset.u); if (h) h.scrollIntoView({behavior:'smooth', block:'start'}); }, 50); });
  pg.appendChild(pickRow);
  const cl = currentLesson(), pos = ['', 'r', '', 'l']; let k = 0;
  UNITS.forEach(u => { const ls = LESSONS.filter(l => l.unit === u.id), dn = ls.filter(l => isDone(l.id)).length;
    pg.appendChild(el(`<div class="unit-head" id="tier-${u.id}" style="scroll-margin-top:70px"><span class="no">${u.id}</span><div><b>${esc(u.name)}</b><span>${esc(u.sub)}</span></div><span class="cnt">${dn}/${ls.length}</span></div>`));
    const path = el('<div class="path"></div>');
    ls.forEach((l, j) => { const done = isDone(l.id), open = isOpen(l), cur = cl && cl.id === l.id, rec = D.lessons[l.id] || {};
      const n = el(`<button class="node ${pos[k++ % 4]}${done ? ' done' : ''}${cur ? ' current' : ''}${!open ? ' locked' : ''}" aria-label="${esc(u.name)} ${j + 1}. ${esc(l.title)}">${cur ? '<span class="bubble">지금 할 레슨</span>' : ''}<span class="disc">${done ? I.check : !open ? I.lock : j + 1}</span><span class="nt">${esc(l.title)}</span>${done ? starsHtml(rec.stars || starsOf(rec.best || 0)) : ''}</button>`);
      n.onclick = () => open ? openLesson(l.id) : toast('앞 레슨을 통과하면 열립니다. 위의 시작 등급에서 더 높은 등급을 고를 수도 있습니다');
      path.appendChild(n); });
    pg.appendChild(path); });
}
function viewPractice(pg) {
  pg.appendChild(el('<div><div class="eyebrow">시간 제한 없이 자유롭게</div><h2 class="page-title">연습 도구</h2></div>'));
  const g = el('<div class="tools"></div>');
  TOOLS.forEach(t => { const b = el(`<button class="tool"><span class="ic">${I[t.ic]}</span><b>${esc(t.name)}</b><span>${esc(t.desc)}</span></button>`); b.onclick = () => openTool(t.id); g.appendChild(b); });
  pg.appendChild(g);
}
function viewRecords(pg) {
  const days = Object.keys(D.days).filter(k => D.days[k].done).length;
  const totQ = Object.values(D.tot).reduce((a, r) => a + r[1], 0), totR = Object.values(D.tot).reduce((a, r) => a + r[0], 0);
  pg.appendChild(el('<h2 class="page-title">나의 기록</h2>'));
  pg.appendChild(el(`<div class="stat-row"><div class="stat"><b>${D.xp || 0}</b><span>모은 XP</span></div><div class="stat"><b>${days}</b><span>연습한 날</span></div><div class="stat"><b>${totQ ? Math.round(totR / totQ * 100) + '%' : '-'}</b><span>전체 정답률</span></div></div>`));
  const sk = el('<div class="card"><b>분야별 정답률</b></div>');
  Object.keys(SKILL_NAMES).forEach(k => { const r = D.tot[k]; const p = r && r[1] ? Math.round(r[0] / r[1] * 100) : null;
    sk.appendChild(el(`<div class="skill"><span>${SKILL_NAMES[k]}</span><div class="bar-track"><div class="bar-fill" style="width:${p || 0}%;background:${p == null ? 'var(--line)' : p >= 80 ? 'var(--good)' : p >= 50 ? 'var(--ask)' : 'var(--bad)'}"></div></div><span class="num">${p == null ? '기록 없음' : p + '%'}</span></div>`)); });
  pg.appendChild(sk);
  // 약한 자리 지도
  const hm = el('<div class="card"><b>지판 위의 약한 자리</b><span class="small muted">음 위치 문제를 푼 자리만 표시합니다. 빨간 자리를 연습 탭의 음 위치에서 집중해서 풀어 보세요.</span></div>');
  const dots = []; Object.keys(D.items).forEach(k => { const p = k.split(':'); if (p[0] !== 'n') return; const it = D.items[k], s = +p[1], f = +p[2], acc = it.right / it.seen;
    dots.push({s, f, t:nm(pcAt(s, f)), c:acc >= .8 ? 'ok' : acc >= .5 ? 'ask' : 'bad'}); });
  const hb = el('<div style="display:flex;justify-content:center"></div>'); hb.appendChild(board({dots})); hm.appendChild(hb);
  hm.appendChild(el(`<div class="legend"><span><i style="background:var(--good)"></i>80% 이상</span><span><i style="background:var(--ask)"></i>50~79%</span><span><i style="background:var(--bad)"></i>50% 미만</span></div>`));
  pg.appendChild(hm);
  // 설정
  const st = el(`<div class="card"><b>설정</b>
    <label class="sw"><span>소리</span><input type="checkbox" id="s-sound" ${D.settings.sound ? 'checked' : ''}></label>
    <div><span class="small muted">악기 (진도는 악기마다 따로 저장됩니다)</span><div class="seg" id="s-inst"><button data-v="bass">베이스</button><button data-v="guitar">일렉기타</button></div></div>
    <div><span class="small muted">테마</span><div class="seg" id="s-theme"><button data-v="stage">무대</button><button data-v="pastel">파스텔</button><button data-v="light">밝은 화면</button></div></div>
    <label class="sw"><span>모든 레슨 열기 <span class="small muted">(이미 아는 내용은 건너뛰기)</span></span><input type="checkbox" id="s-unlock" ${D.settings.unlockAll ? 'checked' : ''}></label>
    <div><span class="small muted">지판 방향</span><div class="seg" id="s-or"><button data-v="auto">자동</button><button data-v="v">세로</button><button data-v="h">가로</button></div></div>
    <button class="btn sm" id="s-share">${I.share}친구에게 공유</button>
    <div class="row"><button class="btn sm" id="s-exp">기록 백업</button><button class="btn sm" id="s-imp">백업 불러오기</button><button class="btn sm" id="s-reset" style="color:var(--bad)">기록 지우기</button></div>
    <span class="small muted">기록은 이 폰에만 저장됩니다. 폰을 바꾸기 전에 백업 내용을 메모장에 붙여 두세요.</span></div>`);
  $$('#s-or button', st).forEach(b => { b.setAttribute('aria-pressed', b.dataset.v === D.settings.orient); b.onclick = () => { D.settings.orient = b.dataset.v; save(); renderTab(); }; });
  $('#s-share', st).onclick = shareApp;
  $$('#s-inst button', st).forEach(b => { b.setAttribute('aria-pressed', b.dataset.v === D.inst); b.onclick = () => { setInst(b.dataset.v); renderTab(); toast(instName() + '로 바꿨습니다'); }; });
  $('#s-sound', st).onchange = e => { D.settings.sound = e.target.checked; save(); };
  $$('#s-theme button', st).forEach(b => { b.setAttribute('aria-pressed', b.dataset.v === D.settings.theme); b.onclick = () => { D.settings.theme = b.dataset.v; save(); applyTheme(); renderTab(); }; });
  $('#s-unlock', st).onchange = e => { D.settings.unlockAll = e.target.checked; save(); };
  $('#s-exp', st).onclick = () => modal('기록 백업', `<p class="small muted">아래 글을 모두 복사해 메모장이나 카톡 나와의 채팅에 붙여 두세요.</p><textarea readonly>${esc(JSON.stringify(D))}</textarea>`, [['복사하기', m => { const t = $('textarea', m); t.select(); (navigator.clipboard ? navigator.clipboard.writeText(t.value) : Promise.reject()).then(() => toast('복사했습니다')).catch(() => { try { document.execCommand('copy'); toast('복사했습니다'); } catch (e) { toast('글을 길게 눌러 직접 복사해 주세요'); } }); }], ['닫기']]);
  $('#s-imp', st).onclick = () => modal('백업 불러오기', '<p class="small muted">백업해 둔 글을 붙여 넣으세요. 지금 기록은 백업 내용으로 바뀝니다.</p><textarea></textarea>', [['불러오기', m => { try { const x = JSON.parse($('textarea', m).value); if (!x.lessons && !x.by) throw 0; D = Object.assign(fresh(), x); bindInst(D.inst || 'bass'); save(); toast('기록을 불러왔습니다'); renderTab(); return true; } catch (e) { toast('백업 글이 올바르지 않습니다'); return false; } }], ['취소']]);
  $('#s-reset', st).onclick = () => modal('기록을 모두 지울까요?', '<p>레슨 진도, 복습 문제, 연속 일수가 모두 지워지고 되돌릴 수 없습니다.</p>', [['모두 지우기', () => { const s = D.settings, inst = D.inst; D = fresh(); D.settings = s; bindInst(inst); save(); toast('기록을 지웠습니다'); renderTab(); return true; }, 'danger'], ['취소']]);
  pg.appendChild(st);
  pg.appendChild(el('<p class="small muted" style="text-align:center">베이스와 기타 트레이너, 인터넷 없이도 동작합니다</p>'));
}
function modal(title, html, btns) {
  const back = el(`<div class="modal-back"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><h3 style="font-size:19px">${esc(title)}</h3>${html}<div class="row" style="justify-content:flex-end"></div></div></div>`);
  const m = $('.modal', back), row = $('.row', m);
  btns.forEach(([t, fn, kind]) => { const b = el(`<button class="btn sm${kind === 'danger' ? '' : fn ? ' primary' : ''}"${kind === 'danger' ? ' style="background:var(--bad);color:#fff;border-color:var(--bad)"' : ''}>${esc(t)}</button>`);
    b.onclick = () => { const r = fn ? fn(m) : true; if (r !== false && (!fn || r === true || kind === 'danger')) back.remove(); }; row.appendChild(b); });
  back.addEventListener('click', e => { if (e.target === back) back.remove(); });
  document.body.appendChild(back);
}

/* ---------- 친구에게 공유 ---------- */
const APP_URL = 'https://dhtpxor.github.io/bass-trainer/';
const SHARE_TEXT = '베이스와 일렉기타를 처음부터 배우는 연습 앱이에요. 폰에서 열고 "홈 화면에 추가"를 누르면 앱처럼 쓸 수 있어요.';
async function shareApp() {
  const data = {title:'베이스와 기타 트레이너', text:SHARE_TEXT, url:APP_URL};
  try { if (navigator.share) { await navigator.share(data); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(SHARE_TEXT + ' ' + APP_URL); toast('주소를 복사했습니다. 카톡이나 문자에 붙여 넣으세요'); return; } catch (e) {}
  modal('친구에게 공유', `<p class="small muted">아래 글을 길게 눌러 복사한 뒤 카톡이나 문자에 붙여 넣으세요.</p><textarea readonly>${esc(SHARE_TEXT + ' ' + APP_URL)}</textarea>`, [['닫기']]);
}
function shareCard(pg) {
  const c = el(`<div class="card"><div class="spread"><div><b>친구에게 공유</b><div class="small muted">같이 배우면 더 오래 이어 갑니다. 기록은 각자의 폰에 따로 저장됩니다.</div></div></div><button class="btn block">${I.share}공유하기</button></div>`);
  $('button', c).onclick = shareApp; pg.appendChild(c);
}

/* ---------- 설치 ---------- */
let installEvt = null;
const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; $('#install').hidden = false; if (tab === 'today' && !sheetClose) renderTab(); });
window.addEventListener('appinstalled', () => { installEvt = null; $('#install').hidden = true; toast('홈 화면에 설치했습니다'); });
async function doInstall() { if (!installEvt) return; installEvt.prompt(); try { await installEvt.userChoice; } catch (e) {} installEvt = null; $('#install').hidden = true; renderTab(); }
$('#install').onclick = doInstall;
/* Claude 아티팩트 안에서 열렸을 때: 진짜 앱 주소로 옮기기 */
const IN_ARTIFACT = (location.hostname !== 'dhtpxor.github.io' && !/^(localhost|127\.)/.test(location.hostname)) || /[?&]artifact=1/.test(location.search);
const b64enc = t => btoa(unescape(encodeURIComponent(t))), b64dec = t => decodeURIComponent(escape(atob(t)));
function moveLink() { return APP_URL + '#import=' + b64enc(JSON.stringify(D)); }
function moveCard(pg) {
  const c = el(`<div class="card move-card"><b>피크 아이콘 앱으로 설치하세요</b><span class="small muted">지금 화면은 Claude 안에서 열린 미리보기라 설치하면 스피커 아이콘이 붙습니다. 아래 버튼을 누르면 진짜 앱 주소가 지금까지의 진도를 그대로 가지고 열립니다. 거기서 크롬 메뉴의 "홈 화면에 추가"를 누르세요.</span><a class="btn primary block" target="_blank" rel="noopener">진도 가지고 앱 주소로 열기</a><button class="btn sm">주소 복사하기</button></div>`);
  const a = $('a', c); a.href = moveLink(); a.onclick = () => { a.href = moveLink(); };
  $('button', c).onclick = async () => { const u = moveLink(); try { await navigator.clipboard.writeText(u); toast('주소를 복사했습니다. 크롬 주소창에 붙여 넣으세요'); }
    catch (e) { modal('주소 복사', '<p class="small muted">아래 글을 길게 눌러 모두 복사한 뒤 크롬 주소창에 붙여 넣으세요.</p><textarea readonly>' + esc(u) + '</textarea>', [['닫기']]); } };
  pg.appendChild(c);
}
/* 옮기기 주소로 열렸을 때 진도 받기 */
function checkImport() {
  const h = location.hash; if (!h.startsWith('#import=')) return;
  let x = null; try { x = JSON.parse(b64dec(h.slice(8))); } catch (e) {}
  history.replaceState(null, '', '#today'); tab = 'today';
  if (!x || !(x.by || x.lessons)) { toast('옮기기 주소가 올바르지 않습니다'); renderTab(); return; }
  const apply = () => { const theme = D.settings.theme; D = Object.assign(fresh(), x, {settings:Object.assign(fresh().settings, x.settings || {}, {instTip:true})}); D.onboarded = true;
    bindInst(D.inst || 'bass'); save(); applyTheme(); const o = $('.onb'); if (o) o.remove(); renderTab(); updateChip(); toast('진도를 옮겨 왔습니다. 이제 홈 화면에 추가하세요'); return true; };
  const has = Object.values(D.by || {}).some(b => Object.keys(b.lessons || {}).length || Object.keys(b.items || {}).length);
  if (!has) apply();
  else modal('진도 옮겨 오기', '<p class="small muted">이 기기에 이미 기록이 있습니다. 가져온 진도로 바꿀까요? 지금 기록은 지워집니다.</p>', [['가져온 진도로 바꾸기', apply], ['지금 기록 유지']]);
}
function installCard(pg) {
  if (standalone()) return;
  if (IN_ARTIFACT) return;
  if (installEvt) { const c = el(`<div class="card"><b>폰에 앱으로 설치하기</b><span class="small muted">홈 화면 아이콘으로 바로 열리고, 인터넷이 없어도 쓸 수 있습니다.</span><button class="btn primary">설치하기</button></div>`); $('button', c).onclick = doInstall; pg.appendChild(c); }
  else if (isIOS()) pg.appendChild(el('<div class="card"><b>아이폰에 설치하기</b><span class="small muted">Safari 아래쪽의 공유 버튼을 누르고 "홈 화면에 추가"를 고르세요.</span></div>'));
  else if (!('serviceWorker' in navigator) || location.protocol !== 'https:') {}
  else pg.appendChild(el('<div class="card"><b>폰에 앱으로 설치하기</b><span class="small muted">Chrome이나 삼성 인터넷의 메뉴에서 "홈 화면에 추가" 또는 "앱 설치"를 누르세요.</span></div>'));
}

/* ---------- 이동(주소 해시) ---------- */
function route() {
  const h = location.hash.slice(1);
  if (TABS.some(t => t[0] === h)) { if (sheetClose) sheetClose(); if (tab !== h) { tab = h; window.scrollTo(0, 0); } renderTab(); return; }
  if (!h) { if (sheetClose) sheetClose(); renderTab(); return; }
  if (sheetClose) return; // 이미 열린 시트
  if (h.startsWith('lesson-')) { const id = h.slice(7); if (LESSONS.some(l => l.id === id) && isOpen(LESSONS.find(l => l.id === id))) openLesson(id); else location.replace('#learn'); return; }
  if (h.startsWith('tool-')) { openTool(h.slice(5)); return; }
  if (h === 'review') { openReview(); return; }
  if (h.startsWith('import=')) { checkImport(); return; }
  location.replace('#today');
}
window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (sheetClose && (TABS.some(t => t[0] === h) || !h)) { sheetClose(); } route(); });
window.addEventListener('scroll', () => $('#bar').classList.toggle('scrolled', scrollY > 4), {passive:true});
let rz = 0; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (D.settings.orient === 'auto' && !sheetClose) renderTab(); }, 200); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { Clock.stop(); } });

const THEMES = {stage:{attr:'dark', color:'#0c0d0f', name:'무대', prev:'linear-gradient(160deg,#1c1f23 0 55%,#ffb020 55% 62%,#16181b 62%)'},
  pastel:{attr:'pastel', color:'#f6f2fd', name:'파스텔', prev:'linear-gradient(160deg,#f6f2fd 0 55%,#ff9fbd 55% 62%,#a394ff 62%)'},
  light:{attr:'light', color:'#ecebe7', name:'밝은 화면', prev:'linear-gradient(160deg,#ffffff 0 55%,#c77800 55% 62%,#ecebe7 62%)'}};
if (D.settings.light && !D.settings.theme) D.settings.theme = 'light';
if (!THEMES[D.settings.theme]) D.settings.theme = 'stage';
function applyTheme() { const t = THEMES[D.settings.theme]; document.documentElement.dataset.theme = t.attr; const m = $('#theme-color'); if (m) m.content = t.color; }
const ART = {
  board:'<svg viewBox="0 0 280 200"><rect x="40" y="20" width="200" height="160" rx="10" fill="var(--wood)"/><rect x="40" y="20" width="200" height="10" fill="var(--nut)"/>' + [70,110,150].map(y => `<rect x="40" y="${y}" width="200" height="3" fill="var(--fret)"/>`).join('') + [65,115,165,215].map((x, i) => `<rect x="${x - 2 + i * .3}" y="30" width="${5 - i}" height="150" fill="var(--string)"/>`).join('') + '<circle cx="115" cy="90" r="16" fill="var(--root)"/><circle cx="165" cy="130" r="16" fill="var(--tone)"/><circle cx="215" cy="90" r="16" fill="var(--ask)"/></svg>',
  loop:'<svg viewBox="0 0 280 200"><path d="M70 100 A70 70 0 0 1 210 100" fill="none" stroke="var(--line2)" stroke-width="4" stroke-dasharray="8 8"/><path d="M210 100 A70 70 0 0 1 70 100" fill="none" stroke="var(--line2)" stroke-width="4" stroke-dasharray="8 8"/>' + [[70,100,'1'],[140,30,'2'],[210,100,'3']].map(([x, y, t], i) => `<circle cx="${x}" cy="${y}" r="26" fill="var(--raised)" stroke="${i < 2 ? 'var(--good)' : 'var(--accent)'}" stroke-width="3"/><text x="${x}" y="${y + 1}" text-anchor="middle" dominant-baseline="central" font-size="24" font-weight="700" fill="var(--ink)" font-family="var(--disp)">${t}</text>`).join('') + '<text x="140" y="150" text-anchor="middle" font-size="18" font-weight="800" fill="var(--muted)" font-family="var(--font)">복습, 레슨, 악기</text></svg>',
  mic:'<svg viewBox="0 0 280 200"><rect x="118" y="30" width="44" height="90" rx="22" fill="var(--raised)" stroke="var(--accent)" stroke-width="4"/><path d="M98 100 a42 42 0 0 0 84 0" fill="none" stroke="var(--accent)" stroke-width="4"/><rect x="138" y="142" width="4" height="24" fill="var(--accent)"/>' + [1,2,3].map(k => `<path d="M${190 + k * 14} ${75 - k * 8} q${10} ${25 + k * 8} 0 ${50 + k * 16}" fill="none" stroke="var(--good)" stroke-width="3" opacity="${1 - k * .25}"/><path d="M${90 - k * 14} ${75 - k * 8} q-10 ${25 + k * 8} 0 ${50 + k * 16}" fill="none" stroke="var(--good)" stroke-width="3" opacity="${1 - k * .25}"/>`).join('') + '</svg>',
};
function onboarding() {
  if (D.onboarded) return;
  const slides = [
    {h:'어떤 악기를 배우나요?', p:'베이스와 일렉기타 모두 입문부터 고수까지 6등급 36레슨이 있습니다. 진도는 악기마다 따로 저장되고, 기록 탭에서 언제든 바꿀 수 있습니다.', insts:true},
    {h:'처음부터 차근차근', p:'줄 이름부터 코드, 리듬, 솔로까지 등급별로 익힙니다. 설명은 원하는 만큼 천천히 읽고 넘기세요.', art:ART.board},
    {h:'하루 10분, 세 단계', p:'복습, 레슨, 악기 연습 순서로 합니다. 틀린 문제는 다음 날 다시 나와서 약한 자리가 채워집니다. 맞힐수록 경험치가 쌓여 레벨이 오릅니다.', art:ART.loop},
    {h:'악기로 직접 쳐서 확인', p:'마이크를 켜면 화면을 누르는 대신 실제로 친 음으로 정답을 확인합니다. 튜너도 같은 마이크를 씁니다. 마이크 허락은 처음 쓸 때 따로 묻습니다.', art:ART.mic},
    {h:'어디서 시작할까요?', p:'악기를 처음 잡는다면 입문부터 시작하세요. 이미 칠 줄 알면 맞는 등급을 고르면 그 등급부터 열립니다. 나중에 배우기 탭에서 바꿀 수 있습니다.', tiers:true},
    {h:'마음에 드는 테마를 고르세요', p:'나중에 기록 탭에서 언제든 바꿀 수 있습니다.', themes:true},
  ];
  let i = 0; const o = el('<div class="onb" role="dialog" aria-label="처음 사용 안내"></div>'); document.body.appendChild(o);
  const done = () => { D.onboarded = true; save(); o.remove(); renderTab(); };
  const draw = () => { const s = slides[i];
    const ipick = s.insts ? `<div class="themes" style="grid-template-columns:1fr 1fr">${[['bass','베이스','4줄, 리듬과 그루브의 바닥'],['guitar','일렉기타','6줄, 코드와 리프와 솔로']].map(([k, n, d]) => `<button class="theme-pick" data-inst="${k}" aria-pressed="${D.inst === k}" style="padding:16px 10px"><b style="font-size:18px">${n}</b><span class="small muted" style="font-weight:600">${d}</span></button>`).join('')}</div>` : '';
    const tpick = s.tiers ? `<div class="chips" style="margin-top:10px">${UNITS.map(u => `<button class="chip" data-tier="${u.id}" aria-pressed="${startTier() === u.id}">${esc(u.name)}</button>`).join('')}</div><p class="small" style="margin-top:8px">${esc(UNITS.find(u => u.id === startTier()).sub)}</p>` : '';
    const pick = ipick + tpick + (s.themes ? `<div class="themes">${Object.keys(THEMES).map(k => `<button class="theme-pick" data-t="${k}" aria-pressed="${D.settings.theme === k}"><i style="background:${THEMES[k].prev}"></i>${THEMES[k].name}</button>`).join('')}</div>` : '');
    o.innerHTML = `<div class="art">${s.art || ''}</div><h2>${esc(s.h)}</h2><p>${esc(s.p)}</p>${pick}<div class="dots">${slides.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div><div class="acts"><button class="btn" id="onb-skip">${i ? '이전' : '건너뛰기'}</button><button class="btn primary" id="onb-next">${i === slides.length - 1 ? '시작하기' : '다음'}</button></div>`;
    $('#onb-skip', o).onclick = () => { if (i) { i--; draw(); } else done(); };
    $('#onb-next', o).onclick = () => { if (i < slides.length - 1) { i++; draw(); } else done(); };
    $$('.theme-pick', o).forEach(b => b.onclick = () => { D.settings.theme = b.dataset.t; save(); applyTheme(); draw(); });
    $$('[data-tier]', o).forEach(b => b.onclick = () => { setStartTier(+b.dataset.tier); draw(); });
    $$('[data-inst]', o).forEach(b => b.onclick = () => { setInst(b.dataset.inst); draw(); }); };
  draw();
}
applyTheme();
$('#sharebtn').innerHTML = I.share; $('#sharebtn').onclick = shareApp;
$('#instchip').onclick = () => modal('악기 바꾸기', '<p class="small muted">진도와 복습은 악기마다 따로 저장됩니다.</p><div class="seg" id="m-inst"><button data-v="bass" aria-pressed="' + (D.inst === 'bass') + '">베이스</button><button data-v="guitar" aria-pressed="' + (D.inst === 'guitar') + '">일렉기타</button></div>', [['닫기']]);
document.addEventListener('click', e => { const b = e.target.closest('#m-inst [data-v]'); if (!b) return; D.settings.instTip = true; setInst(b.dataset.v); updateChip(); const back = b.closest('.modal-back'); if (back) back.remove(); renderTab(); toast(instName() + '로 바꿨습니다'); });
checkImport();
if (!location.hash) history.replaceState(null, '', '#today');
tab = TABS.some(t => t[0] === location.hash.slice(1)) ? location.hash.slice(1) : 'today';
renderTab();
if (!TABS.some(t => t[0] === location.hash.slice(1))) { const h = location.hash; history.replaceState(null, '', '#' + tab); history.pushState(null, '', h); route(); }

onboarding();
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => { try { navigator.serviceWorker.register('sw.js').catch(() => {}); } catch (e) {} });
}
