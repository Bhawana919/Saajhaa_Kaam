'use strict';

/* ─── DOM refs ─── */
const cv = document.getElementById('film');
const ctx = cv.getContext('2d');
const seek = document.getElementById('seek');
const playButton = document.getElementById('play');
const clock = document.getElementById('clock');

/* ─── Palette ─── */
const PAPER = '#F6F4EE';
const INK   = '#252A25';
const BRICK = '#A64C32';
const SAGE  = '#6B7561';
const CLAY  = '#EAE5DB';
const LINE  = '#D5D1C7';
const WHITE = '#FFFFFF';
const GOLD  = '#C4A55A';

/* ─── Timeline segments ─── */
const segments = [
  { from: 0,   to: 10,  caption: 'Nepal has no shortage of talent. Yet for many young people, a good job still seems to begin with a flight abroad.', scene: 0 },
  { from: 10,  to: 23,  caption: 'The ILO reported more than 740,000 labour permits in one fiscal year. That is permits, not unique people. We cannot solve migration with an app, but we can make one better option real.', scene: 1 },
  { from: 23,  to: 40,  caption: 'Our idea is Sajha Kaam: shared work. A Nepali worker meets a diaspora or global client through one small, clearly priced project. No endless applications; the goal is the first paid result.', scene: 2 },
  { from: 40,  to: 51,  caption: 'A client posts a task with its pay, deadline, deliverables and revision limit visible before anyone applies.', scene: 3 },
  { from: 51,  to: 63,  caption: 'A worker applies with a relevant sample. The client sees the actual proof, offers a paid milestone, and both sides accept the same terms.', scene: 4 },
  { from: 63,  to: 77,  caption: 'The workroom tracks delivery, feedback and a human help route. Payment status comes from a licensed partner in a real launch. What you see today is a simulated demo, not a live wallet.', scene: 5 },
  { from: 77,  to: 88,  caption: 'After a confirmed project, the worker can share a portable record of skills and results, and revoke access whenever they choose.', scene: 6 },
  { from: 88,  to: 102, caption: 'We rejected a digital "sovereign zone." A municipality cannot create international law. Instead, a local skills hub can train workers while real banks and existing law handle the rest.', scene: 7 },
  { from: 102, to: 113, caption: 'We would begin with twenty workers, five diaspora-led companies and ten small paid opportunities, then measure completed work and repeat clients.', scene: 8 },
  { from: 113, to: 120, caption: 'Global work should be a real choice from home. Sajha Kaam.', scene: 9 }
];

/* ─── Playback state ─── */
let time = 0;
let playing = false;
let last = 0;
let recorder = null;
let recording = false;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   EASING FUNCTIONS — smooth, natural, no jitter
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/** Clamp value to [0,1] */
function clamp01(x) { return Math.max(0, Math.min(1, x)); }

/** Smooth hermite interpolation (smoothstep) */
function smoothstep(x) {
  x = clamp01(x);
  return x * x * (3 - 2 * x);
}

/** Even smoother Ken Perlin's smootherstep — eliminates second-derivative discontinuity */
function smootherstep(x) {
  x = clamp01(x);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

/** Ease-out cubic — fast start, gentle deceleration */
function easeOutCubic(x) {
  x = clamp01(x);
  return 1 - Math.pow(1 - x, 3);
}

/** Ease-in-out cubic — smooth both ends */
function easeInOutCubic(x) {
  x = clamp01(x);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/** Ease-out quart — even gentler landing */
function easeOutQuart(x) {
  x = clamp01(x);
  return 1 - Math.pow(1 - x, 4);
}

/** Gentle elastic settle — subtle overshoot that feels organic */
function easeOutBack(x) {
  x = clamp01(x);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

/**
 * Staggered entrance: compute progress for element #index in a group of N,
 * spreading their start times across `staggerWindow` seconds.
 * @param {number} elapsed  — time since scene started (seconds)
 * @param {number} index    — which element (0-based)
 * @param {number} total    — how many elements in the stagger group
 * @param {number} duration — each element's animation duration (seconds)
 * @param {number} staggerWindow — total spread across all elements (seconds)
 * @param {Function} easeFn — easing function
 */
function stagger(elapsed, index, total, duration = 0.6, staggerWindow = 0.8, easeFn = easeOutCubic) {
  const delay = (staggerWindow / Math.max(1, total - 1)) * index;
  const t = (elapsed - delay) / duration;
  return easeFn(clamp01(t));
}

/**
 * Crossfade alpha: smooth scene transition
 * Returns opacity [0,1] that fades in at scene start and fades out near scene end.
 */
function sceneFade(seg, t) {
  const fadeInDur = 0.8;   // seconds
  const fadeOutDur = 0.6;  // seconds
  const elapsed = t - seg.from;
  const remaining = seg.to - t;
  const fadeIn = smootherstep(elapsed / fadeInDur);
  const fadeOut = remaining < fadeOutDur ? smootherstep(remaining / fadeOutDur) : 1;
  return fadeIn * fadeOut;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   IMAGE LOADING — optional PNG assets
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const imageCache = {};
const imageLoadFailed = {};

/**
 * Load an image from assets/ folder. Returns the Image if loaded, or null.
 * Non-blocking: first call triggers load, subsequent calls return cached result.
 */
function getImage(name) {
  if (imageLoadFailed[name]) return null;
  if (imageCache[name]) return imageCache[name];
  const img = new Image();
  img.onload = () => { imageCache[name] = img; };
  img.onerror = () => { imageLoadFailed[name] = true; };
  img.src = `assets/${name}`;
  return null;
}

/**
 * Draw an image centered at (cx, cy) scaled to fit within maxW × maxH.
 * alpha controls opacity. Returns true if drawn.
 */
function drawImage(name, cx, cy, maxW, maxH, alpha = 1) {
  const img = getImage(name);
  if (!img) return false;
  const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
  ctx.restore();
  return true;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DRAWING PRIMITIVES
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function text(s, x, y, size = 28, color = INK, weight = 500, align = 'left') {
  ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}

function rr(x, y, w, h, r = 14, fill = WHITE, stroke = LINE) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function rule(x, y, w) {
  ctx.fillStyle = LINE;
  ctx.fillRect(x, y, w, 2);
}

function wrap(str, max) {
  ctx.font = '500 22px system-ui, sans-serif';
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if (ctx.measureText(line + ' ' + w).width > max && line) {
      lines.push(line);
      line = w;
    } else {
      line += (line ? ' ' : '') + w;
    }
  }
  lines.push(line);
  return lines;
}

/** Draw a card with stagger animation support */
function card(x, y, w, h, head, lines, accent = false, alpha = 1, slideOffset = 0) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(0, slideOffset);
  rr(x, y, w, h, 14, accent ? CLAY : WHITE);
  text(head, x + 26, y + 49, 26, INK, 700);
  lines.forEach((v, j) => text(v, x + 26, y + 94 + j * 33, 21, SAGE));
  ctx.restore();
}

function phone(x, y, w = 355, h = 431, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  rr(x, y, w, h, 25, PAPER, INK);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.stroke();
  text('Sajha', x + 25, y + 53, 27, INK, 700);
  text('Kaam.', x + 110, y + 53, 27, BRICK, 700);
  rule(x + 24, y + 70, w - 48);
  ctx.restore();
}

function badge(s, x, y, w, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  rr(x, y, w, 36, 18, CLAY, null);
  text(s, x + 14, y + 25, 16, SAGE, 700);
  ctx.restore();
}

function source() {
  text('ILO Nepal · FY 2023/24 labour permits · not unique people', 54, 613, 18, SAGE);
}

/** Subtle floating motion (organic, not jittery) — uses sine waves */
function floatY(time, seed = 0, amplitude = 3, period = 4) {
  return Math.sin((time + seed) * (2 * Math.PI / period)) * amplitude;
}

function floatX(time, seed = 0, amplitude = 2, period = 5) {
  return Math.cos((time + seed * 1.7) * (2 * Math.PI / period)) * amplitude;
}

/** Draw a subtle paper texture line pattern in the background */
function drawPaperTexture(alpha = 0.04) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 25; i++) {
    const y = 30 + i * 29;
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(1240, y);
    ctx.stroke();
  }
  ctx.restore();
}

/** Draw decorative corner elements */
function drawCornerAccents(alpha = 0.08) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = BRICK;
  ctx.lineWidth = 2;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(30, 60);
  ctx.lineTo(30, 30);
  ctx.lineTo(60, 30);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(1220, 30);
  ctx.lineTo(1250, 30);
  ctx.lineTo(1250, 60);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(30, 660);
  ctx.lineTo(30, 690);
  ctx.lineTo(60, 690);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(1220, 690);
  ctx.lineTo(1250, 690);
  ctx.lineTo(1250, 660);
  ctx.stroke();

  ctx.restore();
}

/** Draw a smooth animated connecting line between two points */
function animatedLine(x1, y1, x2, y2, progress, color = SAGE, lineWidth = 2, dashed = false) {
  if (progress <= 0) return;
  const p = clamp01(progress);
  const cx = x1 + (x2 - x1) * p;
  const cy = y1 + (y2 - y1) * p;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  if (dashed) ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(cx, cy);
  ctx.stroke();
  ctx.restore();
}

/** Draw a dot/node at position */
function dot(x, y, r = 5, color = BRICK, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SCENE RENDERERS — each with smooth per-element animation
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function sceneDraw(seg, t) {
  const elapsed = t - seg.from;
  const sceneAlpha = sceneFade(seg, t);

  ctx.save();
  ctx.globalAlpha = sceneAlpha;

  switch (seg.scene) {

    case 0: {
      // "Nepali talent. Global opportunity."
      const t1 = stagger(elapsed, 0, 5, 0.7, 1.2, easeOutCubic);
      const t2 = stagger(elapsed, 1, 5, 0.7, 1.2, easeOutCubic);
      const t3 = stagger(elapsed, 2, 5, 0.8, 1.2, easeOutCubic);
      const t4 = stagger(elapsed, 3, 5, 0.8, 1.2, easeOutCubic);
      const t5 = stagger(elapsed, 4, 5, 0.5, 1.2, easeOutCubic);

      // Try to draw mountain silhouette as ambient background
      drawImage('scene0/mountain_silhouette.png', 640, 600, 1000, 200, 0.15 * t1);

      // Title lines slide in from left
      ctx.save();
      ctx.globalAlpha = t1;
      ctx.translate((1 - t1) * -40, 0);
      text('Nepali talent.', 70, 172, 64, INK, 700);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = t2;
      ctx.translate((1 - t2) * -40, 0);
      text('Global opportunity.', 70, 248, 64, BRICK, 700);
      ctx.restore();

      // Cards slide up
      const slideUp3 = (1 - t3) * 30;
      const slideUp4 = (1 - t4) * 30;
      card(70, 314, 480, 175, 'HERE', ['Skills. Ambition. A choice to stay.'], false, t3, slideUp3);

      // Try to draw worker figures inside cards
      drawImage('scene0/worker_figure_female.png', 480, 400, 80, 130, t3 * 0.7);

      card(735, 314, 480, 175, 'WORLD', ['Customers. Projects. Real demand.'], false, t4, slideUp4);
      drawImage('scene0/globe_connected.png', 1140, 400, 80, 130, t4 * 0.7);

      // Animated connection line between cards
      const lineProgress = easeOutCubic(clamp01((elapsed - 1.5) / 0.8));
      animatedLine(550, 400, 735, 400, lineProgress, SAGE, 3);

      // Arrow head
      if (lineProgress > 0.9) {
        const arrowAlpha = easeOutCubic(clamp01((lineProgress - 0.9) / 0.1));
        ctx.save();
        ctx.globalAlpha = arrowAlpha;
        ctx.fillStyle = SAGE;
        ctx.beginPath();
        ctx.moveTo(735, 395);
        ctx.lineTo(735, 405);
        ctx.lineTo(745, 400);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Nepal map as decorative element
      drawImage('scene0/nepal_map_silhouette.png', 640, 530, 250, 100, t5 * 0.3);
      break;
    }

    case 1: {
      // "740,000+ labour permits"
      const t1 = stagger(elapsed, 0, 4, 0.7, 1.0, easeOutCubic);
      const t2 = stagger(elapsed, 1, 4, 0.9, 1.0, easeOutQuart);
      const t3 = stagger(elapsed, 2, 4, 0.6, 1.0, easeOutCubic);
      const t4 = stagger(elapsed, 3, 4, 0.6, 1.0, easeOutCubic);

      // Title
      ctx.save();
      ctx.globalAlpha = t1;
      ctx.translate((1 - t1) * -30, 0);
      text('The problem is bigger than a number.', 70, 160, 47, INK, 700);
      ctx.restore();

      // Big number — "count up" effect
      const countProgress = easeOutQuart(clamp01((elapsed - 0.5) / 1.5));
      const displayNum = Math.round(740000 * countProgress);
      const numStr = displayNum.toLocaleString() + (countProgress >= 0.98 ? '+' : '');

      ctx.save();
      ctx.globalAlpha = t2;
      const numScale = 0.95 + 0.05 * t2; // Subtle scale-in
      ctx.translate(70, 326);
      ctx.scale(numScale, numScale);
      text(numStr, 0, 0, 110, BRICK, 700);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = t3;
      text('labour permits issued in FY 2023/24', 73, 387, 30, INK);
      ctx.restore();

      // Info box
      ctx.save();
      ctx.globalAlpha = t4;
      ctx.translate(0, (1 - t4) * 20);
      rr(73, 432, 790, 80, 9, CLAY, null);
      text('Permits are not a count of unique emigrants.', 95, 482, 25, INK, 600);
      ctx.restore();

      // Decorative images
      drawImage('scene1/passport_stack.png', 1050, 300, 200, 180, t2 * 0.5);
      drawImage('scene1/crowd_silhouettes.png', 640, 560, 400, 100, t4 * 0.2);

      source();
      break;
    }

    case 2: {
      // "Sajha Kaam — Shared Work"
      const t1 = stagger(elapsed, 0, 5, 0.7, 1.2, easeOutCubic);
      const t2 = stagger(elapsed, 1, 5, 0.6, 1.2, easeOutCubic);
      const t3 = stagger(elapsed, 2, 5, 0.8, 1.2, easeOutCubic);
      const t4 = stagger(elapsed, 3, 5, 0.8, 1.2, easeOutCubic);
      const t5 = stagger(elapsed, 4, 5, 0.7, 1.2, easeOutCubic);

      // Title
      ctx.save();
      ctx.globalAlpha = t1;
      ctx.translate((1 - t1) * -30, 0);
      text('Sajha Kaam.', 70, 170, 72, INK, 700);
      ctx.restore();

      // Devanagari subtitle
      ctx.save();
      ctx.globalAlpha = t2;
      text('साझा काम', 70, 229, 31, BRICK, 700);
      ctx.restore();

      // Worker card
      const slideUp3 = (1 - t3) * 35;
      card(70, 308, 410, 171, 'Nepali talent', ['One relevant work sample'], false, t3, slideUp3);
      drawImage('scene2/laptop_worker.png', 410, 390, 80, 120, t3 * 0.6);

      // Client card
      const slideUp4 = (1 - t4) * 35;
      card(785, 308, 410, 171, 'Global client', ['One clearly priced project'], false, t4, slideUp4);

      // Handshake image in center
      drawImage('scene2/handshake_paper.png', 640, 420, 150, 130, t5 * 0.6);

      // Result text
      ctx.save();
      ctx.globalAlpha = t5;
      text('A first paid result', 640, 553, 31, BRICK, 700, 'center');
      ctx.restore();

      break;
    }

    case 3: {
      // "Clear Terms — Task Posting"
      const t1 = stagger(elapsed, 0, 5, 0.7, 1.0, easeOutCubic);
      const t2 = stagger(elapsed, 1, 5, 0.8, 1.0, easeOutCubic);
      const t3 = stagger(elapsed, 2, 5, 0.7, 1.0, easeOutCubic);
      const t4 = stagger(elapsed, 3, 5, 0.6, 1.0, easeOutCubic);
      const t5 = stagger(elapsed, 4, 5, 0.5, 1.0, easeOutCubic);

      // Title
      ctx.save();
      ctx.globalAlpha = t1;
      ctx.translate((1 - t1) * -30, 0);
      text('Every task starts with clear terms.', 70, 150, 47, INK, 700);
      ctx.restore();

      // Phone mockup
      phone(77, 202, 470, 337, t2);

      // Phone content — staggered
      ctx.save();
      ctx.globalAlpha = t3;
      ctx.translate(0, (1 - t3) * 15);
      text('12 product listings', 105, 312, 33, INK, 700);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = t4;
      ctx.translate(0, (1 - t4) * 15);
      text('$60 · sample', 105, 375, 31, BRICK, 700);
      text('7 days · one revision', 105, 425, 21, SAGE);
      ctx.restore();

      // Detail card
      const slideUp5 = (1 - t5) * 30;
      card(650, 230, 560, 270, 'Before applying, see:', [
        'Scope and deliverables',
        'Due date and rights',
        'Gross amount and known fees'
      ], true, t5, slideUp5);

      // Decorative icons
      drawImage('scene3/price_tag.png', 700, 540, 80, 80, t4 * 0.4);
      drawImage('scene3/calendar_icon.png', 820, 540, 80, 80, t5 * 0.4);
      drawImage('scene3/checklist_icon.png', 940, 540, 80, 80, t5 * 0.4);

      break;
    }

    case 4: {
      // "Proof first. Both sides agree."
      const t1 = stagger(elapsed, 0, 4, 0.7, 1.0, easeOutCubic);
      const t2 = stagger(elapsed, 1, 4, 0.8, 1.0, easeOutCubic);
      const t3 = stagger(elapsed, 2, 4, 0.8, 1.0, easeOutCubic);
      const t4 = stagger(elapsed, 3, 4, 0.6, 1.0, easeOutCubic);

      // Title
      ctx.save();
      ctx.globalAlpha = t1;
      ctx.translate((1 - t1) * -30, 0);
      text('Proof first. Both sides agree.', 70, 145, 46, INK, 700);
      ctx.restore();

      // Worker card — slides from left
      ctx.save();
      ctx.globalAlpha = t2;
      ctx.translate((1 - t2) * -50, 0);
      card(70, 218, 500, 267, 'Worker application', [
        'One selected sample',
        'Short introduction',
        'Consent to share'
      ], false, 1, 0);
      ctx.restore();

      // Client card — slides from right
      ctx.save();
      ctx.globalAlpha = t3;
      ctx.translate((1 - t3) * 50, 0);
      card(715, 218, 500, 267, 'Client offer', [
        'Fixed price and deliverable',
        'One revision',
        'Accepted by both parties'
      ], true, 1, 0);
      ctx.restore();

      // Connection line between cards
      const lineP = easeOutCubic(clamp01((elapsed - 1.8) / 0.7));
      animatedLine(570, 350, 715, 350, lineP, BRICK, 2, true);

      // Agreement dot
      dot(640, 350, 6 * t4, BRICK, t4);

      // Profile images
      drawImage('scene4/worker_profile.png', 320, 530, 120, 100, t2 * 0.4);
      drawImage('scene4/client_profile.png', 960, 530, 120, 100, t3 * 0.4);

      break;
    }

    case 5: {
      // "One shared workroom."
      const t1 = stagger(elapsed, 0, 4, 0.7, 1.0, easeOutCubic);
      const t2 = stagger(elapsed, 1, 4, 0.9, 1.0, easeOutCubic);
      const t3 = stagger(elapsed, 2, 4, 0.8, 1.0, easeOutCubic);
      const t4 = stagger(elapsed, 3, 4, 0.6, 1.0, easeOutCubic);

      // Title
      ctx.save();
      ctx.globalAlpha = t1;
      ctx.translate((1 - t1) * -30, 0);
      text('One shared workroom.', 70, 147, 48, INK, 700);
      ctx.restore();

      // Timeline card — with staggered timeline items
      ctx.save();
      ctx.globalAlpha = t2;
      ctx.translate(0, (1 - t2) * 30);
      rr(70, 224, 550, 280, 14, WHITE);
      text('Visible timeline', 96, 268, 26, INK, 700);

      const timelineItems = ['Offer accepted', 'Work submitted', 'Feedback or revision', 'Human help and appeal'];
      timelineItems.forEach((item, i) => {
        const itemT = stagger(elapsed, i, timelineItems.length, 0.5, 1.5, easeOutCubic);
        // Timeline dot
        dot(110, 304 + i * 46, 5, BRICK, itemT);
        // Timeline line
        if (i < timelineItems.length - 1) {
          animatedLine(110, 309 + i * 46, 110, 345 + i * 46, itemT, LINE, 1);
        }
        // Item text
        ctx.save();
        ctx.globalAlpha = itemT;
        text(item, 130, 308 + i * 46, 21, SAGE);
        ctx.restore();
      });
      ctx.restore();

      // Payment card
      const slideUp3 = (1 - t3) * 25;
      card(710, 230, 480, 224, 'Payment status', [
        'Awaiting external partner',
        'DEMO · simulated only'
      ], true, t3, slideUp3);

      // DEMO stamp
      ctx.save();
      ctx.globalAlpha = t4 * 0.7;
      ctx.translate(950, 490 + (1 - t4) * 20);
      ctx.rotate(-0.08);
      rr(-60, -20, 120, 40, 4, 'transparent', BRICK);
      ctx.strokeStyle = BRICK;
      ctx.lineWidth = 3;
      ctx.stroke();
      text('DEMO', -45, 8, 22, BRICK, 700);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = t4;
      text('No live wallet in this prototype.', 713, 530, 22, BRICK, 700);
      ctx.restore();

      break;
    }

    case 6: {
      // "A Work Passport workers control."
      const t1 = stagger(elapsed, 0, 5, 0.7, 1.2, easeOutCubic);
      const t2 = stagger(elapsed, 1, 5, 0.8, 1.2, easeOutCubic);
      const t3 = stagger(elapsed, 2, 5, 0.6, 1.2, easeOutCubic);
      const t4 = stagger(elapsed, 3, 5, 0.6, 1.2, easeOutCubic);
      const t5 = stagger(elapsed, 4, 5, 0.5, 1.2, easeOutCubic);

      // Title
      ctx.save();
      ctx.globalAlpha = t1;
      ctx.translate((1 - t1) * -30, 0);
      text('A Work Passport workers control.', 70, 145, 44, INK, 700);
      ctx.restore();

      // Phone
      phone(77, 196, 465, 361, t2);

      // Phone content
      ctx.save();
      ctx.globalAlpha = t3;
      ctx.translate(0, (1 - t3) * 15);
      text('Your work, with evidence', 104, 304, 28, INK, 700);
      text('Sample · worker supplied', 104, 358, 20, SAGE);
      text('Result · client confirmed', 104, 404, 20, SAGE);
      ctx.restore();

      badge('Share link: revocable', 104, 455, 285, t4);

      // Lock icon decorative
      drawImage('scene6/lock_icon.png', 430, 490, 60, 70, t4 * 0.5);

      // Detail card
      const slideUp5 = (1 - t5) * 30;
      card(680, 240, 535, 251, 'Portable proof', [
        'Clear evidence source',
        'Private content stays private',
        'Not a legal identity'
      ], true, t5, slideUp5);

      // Passport card image
      drawImage('scene6/passport_card.png', 950, 540, 200, 100, t5 * 0.4);

      break;
    }

    case 7: {
      // "Keep the useful idea. Respect real law."
      const t1 = stagger(elapsed, 0, 5, 0.7, 1.2, easeOutCubic);
      const t2 = stagger(elapsed, 1, 5, 0.8, 1.2, easeOutCubic);
      const t3 = stagger(elapsed, 2, 5, 0.8, 1.2, easeOutCubic);
      const t4 = stagger(elapsed, 3, 5, 0.8, 1.2, easeOutCubic);
      const t5 = stagger(elapsed, 4, 5, 0.6, 1.2, easeOutCubic);

      // Title
      ctx.save();
      ctx.globalAlpha = t1;
      ctx.translate((1 - t1) * -30, 0);
      text('Keep the useful idea. Respect real law.', 70, 139, 43, INK, 700);
      ctx.restore();

      // Three-column architecture — slide up
      const slideUp2 = (1 - t2) * 30;
      const slideUp3 = (1 - t3) * 30;
      const slideUp4 = (1 - t4) * 30;

      card(65, 222, 350, 252, 'Skills hub', [
        'Train and onboard',
        'Optional local partner'
      ], false, t2, slideUp2);

      // Connection arrows
      const arrowP1 = easeOutCubic(clamp01((elapsed - 1.5) / 0.6));
      animatedLine(415, 348, 462, 348, arrowP1, SAGE, 2);

      card(462, 222, 350, 252, 'Sajha Kaam', [
        'Clear agreement',
        'Auditable record'
      ], true, t3, slideUp3);

      const arrowP2 = easeOutCubic(clamp01((elapsed - 1.8) / 0.6));
      animatedLine(812, 348, 860, 348, arrowP2, SAGE, 2);

      card(860, 222, 350, 252, 'Licensed partner', [
        'External settlement',
        'Subject to agreement'
      ], false, t4, slideUp4);

      // Decorative building images
      drawImage('scene7/skills_hub_building.png', 240, 520, 120, 120, t2 * 0.35);
      drawImage('scene7/bank_building.png', 1035, 520, 120, 120, t4 * 0.35);

      // "No invented charter" text
      ctx.save();
      ctx.globalAlpha = t5;
      text('No invented charter jurisdiction.', 68, 545, 26, BRICK, 700);
      ctx.restore();

      break;
    }

    case 8: {
      // "A four-week pilot to test the loop."
      const t1 = stagger(elapsed, 0, 5, 0.7, 1.0, easeOutCubic);
      const t2 = stagger(elapsed, 1, 5, 0.8, 1.0, easeOutCubic);
      const t3 = stagger(elapsed, 2, 5, 0.8, 1.0, easeOutCubic);
      const t4 = stagger(elapsed, 3, 5, 0.8, 1.0, easeOutCubic);
      const t5 = stagger(elapsed, 4, 5, 0.6, 1.0, easeOutCubic);

      // Title
      ctx.save();
      ctx.globalAlpha = t1;
      ctx.translate((1 - t1) * -30, 0);
      text('A four-week pilot to test the loop.', 70, 144, 46, INK, 700);
      ctx.restore();

      // Three cards — staggered slide-up
      const slideUp2 = (1 - t2) * 30;
      const slideUp3 = (1 - t3) * 30;
      const slideUp4 = (1 - t4) * 30;

      card(70, 233, 345, 252, '20 workers', [
        'Vetted for a narrow',
        'category of paid tasks'
      ], false, t2, slideUp2);

      card(467, 233, 345, 252, '5 buyers', [
        'Diaspora-led SMEs',
        'with real purchase intent'
      ], true, t3, slideUp3);

      card(864, 233, 345, 252, '10 opportunities', [
        'Targets, not prior',
        'results or impact'
      ], false, t4, slideUp4);

      // Decorative images
      drawImage('scene8/group_people_20.png', 240, 530, 200, 80, t2 * 0.35);
      drawImage('scene8/target_bullseye.png', 1035, 530, 100, 100, t4 * 0.35);

      // Bottom text
      ctx.save();
      ctx.globalAlpha = t5;
      text('Measure completed work and repeat demand.', 70, 555, 26, SAGE);
      ctx.restore();

      break;
    }

    case 9: {
      // "Sajha Kaam." — closing
      const centerX = 640;
      const t1 = easeOutQuart(clamp01(elapsed / 1.0));
      const t2 = easeOutCubic(clamp01((elapsed - 0.4) / 0.8));
      const t3 = easeOutCubic(clamp01((elapsed - 1.0) / 0.7));

      // Mountain/sunrise background
      drawImage('scene9/nepal_sunrise.png', 640, 500, 800, 250, t1 * 0.2);

      // Main title — scale and fade
      ctx.save();
      ctx.globalAlpha = t1;
      const scale1 = 0.92 + 0.08 * t1;
      ctx.translate(centerX, 265);
      ctx.scale(scale1, scale1);
      text('Sajha', 0, 0, 102, INK, 700, 'center');
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = t2;
      const scale2 = 0.92 + 0.08 * t2;
      ctx.translate(centerX, 375);
      ctx.scale(scale2, scale2);
      text('Kaam.', 0, 0, 102, BRICK, 700, 'center');
      ctx.restore();

      // Tagline
      ctx.save();
      ctx.globalAlpha = t3;
      text('Local talent. Global work. Clear terms.', centerX, 456, 28, INK, 500, 'center');
      ctx.restore();

      // Decorative border
      drawImage('scene9/decorative_border.png', 640, 520, 500, 40, t3 * 0.3);

      break;
    }
  }

  ctx.restore();
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN DRAW LOOP
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function draw(t) {
  // Clear canvas
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, 1280, 720);

  // Subtle paper texture background
  drawPaperTexture(0.03);

  // Corner accents
  drawCornerAccents(0.06);

  // Find current segment
  const seg = segments.find(s => t >= s.from && t < s.to) || segments[segments.length - 1];

  // Render scene
  sceneDraw(seg, t);

  // Bottom separator
  rule(54, 578, 1172);

  // Captions — smooth word-wrap
  const ls = wrap(seg.caption, 1170);
  ls.slice(0, 4).forEach((v, j) => text(v, 54, 615 + j * 24, 20, INK, 500));

  // Progress bar — smooth
  ctx.fillStyle = CLAY;
  ctx.fillRect(54, 693, 1172, 4);
  ctx.fillStyle = BRICK;
  ctx.fillRect(54, 693, 1172 * (t / 120), 4);

  // Clock
  clock.textContent = `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')} / 2:00`;
  seek.value = t;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ANIMATION FRAME — deltaTime capped to prevent jitter
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function frame(ts) {
  if (playing) {
    if (last) {
      // Cap delta to prevent huge jumps (e.g., after tab switch)
      const delta = Math.min((ts - last) / 1000, 0.05); // Max 50ms per frame
      time = Math.min(120, time + delta);
    }
    last = ts;
    if (time >= 120) {
      playing = false;
      playButton.textContent = 'Play';
      last = 0;
    }
  }
  draw(time);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CONTROLS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

playButton.onclick = () => {
  if (time >= 120) time = 0;
  playing = !playing;
  last = 0;
  playButton.textContent = playing ? 'Pause' : 'Play';
};

document.getElementById('reset').onclick = () => {
  time = 0;
  playing = false;
  last = 0;
  playButton.textContent = 'Play';
  draw(0);
};

seek.oninput = () => {
  time = Number(seek.value);
  last = 0;
  draw(time);
};

document.getElementById('record').onclick = () => {
  if (!cv.captureStream || !window.MediaRecorder) {
    alert('Canvas recording is unavailable in this browser.');
    return;
  }
  if (recording) return;

  time = 0;
  last = 0;
  playing = true;
  playButton.textContent = 'Pause';

  const stream = cv.captureStream(30);
  let chunks = [];
  const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : 'video/webm';

  recorder = new MediaRecorder(stream, {
    mimeType: mime,
    videoBitsPerSecond: 5500000
  });

  recorder.ondataavailable = e => {
    if (e.data.size) chunks.push(e.data);
  };

  recorder.onstop = () => {
    const u = URL.createObjectURL(new Blob(chunks, { type: 'video/webm' }));
    const a = document.createElement('a');
    a.href = u;
    a.download = 'sajha-kaam-visual-track.webm';
    a.click();
    setTimeout(() => URL.revokeObjectURL(u), 10000);
    stream.getTracks().forEach(t => t.stop());
    recording = false;
    document.getElementById('record').textContent = 'Record WebM';
  };

  recording = true;
  document.getElementById('record').textContent = 'Recording…';
  recorder.start(1000);

  setTimeout(() => {
    if (recorder?.state === 'recording') recorder.stop();
    playing = false;
    last = 0;
    playButton.textContent = 'Play';
  }, 120100);
};
