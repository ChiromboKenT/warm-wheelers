// Concept Geometry deliverables generator — T007 / T008 / T009
// Produces dimensioned SVG sketches and rasterises them to PNG.
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const ROOT = 'c:/Users/Computer/Documents/Hooligan/Projects/Warm Wheelers/build';

function save(svg, outSvg, outPng, width) {
  mkdirSync(dirname(outSvg), { recursive: true });
  writeFileSync(outSvg, svg);
  const r = new Resvg(svg, { fitTo: { mode: 'width', value: width } });
  writeFileSync(outPng, r.render().asPng());
  console.log('wrote', outPng);
}

// ---- shared style ----
const css = `
  .bg{fill:#0e1116}
  .panel{fill:#161b22;stroke:#30363d;stroke-width:1}
  .ink{fill:#e6edf3}
  .muted{fill:#8b949e}
  .accent{fill:#ff7b3d}
  .glow{fill:#ff3b30}
  .line{stroke:#e6edf3;stroke-width:2;fill:none}
  .thin{stroke:#8b949e;stroke-width:1;fill:none}
  .dim{stroke:#58a6ff;stroke-width:1;fill:none}
  .dimtxt{fill:#58a6ff;font:600 13px 'Segoe UI',sans-serif}
  .body{fill:#21262d;stroke:#484f58;stroke-width:1.5}
  .ghost{fill:none;stroke:#3fb950;stroke-width:1.5;stroke-dasharray:5 4}
  text{font-family:'Segoe UI',Arial,sans-serif}
  .title{font:700 26px 'Segoe UI';fill:#e6edf3}
  .sub{font:400 14px 'Segoe UI';fill:#8b949e}
  .lbl{font:600 13px 'Segoe UI';fill:#e6edf3}
  .note{font:400 12px 'Segoe UI';fill:#8b949e}
`;

// horizontal dimension line with arrows + label
function hdim(x1, x2, y, label) {
  return `
  <line class="dim" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" marker-start="url(#a)" marker-end="url(#a)"/>
  <line class="thin" x1="${x1}" y1="${y-6}" x2="${x1}" y2="${y+6}"/>
  <line class="thin" x1="${x2}" y1="${y-6}" x2="${x2}" y2="${y+6}"/>
  <text class="dimtxt" x="${(x1+x2)/2}" y="${y-7}" text-anchor="middle">${label}</text>`;
}
function vdim(y1, y2, x, label) {
  return `
  <line class="dim" x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" marker-start="url(#a)" marker-end="url(#a)"/>
  <line class="thin" x1="${x-6}" y1="${y1}" x2="${x+6}" y2="${y1}"/>
  <line class="thin" x1="${x-6}" y1="${y2}" x2="${x+6}" y2="${y2}"/>
  <text class="dimtxt" x="${x-8}" y="${(y1+y2)/2}" text-anchor="end" transform="rotate(-90 ${x-8} ${(y1+y2)/2})">${label}</text>`;
}
const defs = `<defs>
  <marker id="a" markerWidth="9" markerHeight="9" refX="4.5" refY="4.5" orient="auto">
    <path d="M1,1 L8,4.5 L1,8 Z" fill="#58a6ff"/>
  </marker>${'' /* arrow */}
  <style>${css}</style>
</defs>`;

/* =========================================================
   T007 — Reference board + dimension notes
   ========================================================= */
function refBoard() {
  const W = 1400, H = 900;
  // heater proportions (Goldair-style radiant): ~ 700 H x 600 W x 230 D
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${defs}
<rect class="bg" width="${W}" height="${H}"/>
<text class="title" x="40" y="50">T007 · Reference Board — Domestic Gas Heater &amp; LP Cylinder</text>
<text class="sub" x="40" y="74">Warm Wheelers · Red Bull Soapbox JHB 2026 · real product proportions (mm) · v0 2026-06-22</text>

<!-- Heater front -->
<g transform="translate(70,120)">
  <text class="lbl" x="0" y="-10">Radiant heater — FRONT (Goldair-style)</text>
  <rect class="body" x="0" y="0" width="300" height="350" rx="14"/>
  <!-- grille -->
  <rect class="panel" x="22" y="40" width="256" height="220" rx="6"/>
  ${Array.from({length:6},(_,i)=>`<rect class="glow" x="34" y="${52+i*34}" width="232" height="14" rx="7" opacity="${0.35+i*0.06}"/>`).join('')}
  <!-- knobs -->
  <circle class="accent" cx="60" cy="300" r="14"/><circle class="accent" cx="110" cy="300" r="14"/>
  <rect class="muted" x="180" y="288" width="96" height="24" rx="6" fill="#30363d"/>
  <text class="note" x="200" y="304" fill="#e6edf3">WARM WHEELERS</text>
  <!-- castors -->
  <circle class="ink" cx="40" cy="358" r="10"/><circle class="ink" cx="260" cy="358" r="10"/>
  ${hdim(0,300,400,'≈ 600 width')}
  ${vdim(0,350,-30,'≈ 700 height')}
</g>

<!-- Heater side -->
<g transform="translate(520,120)">
  <text class="lbl" x="0" y="-10">Radiant heater — SIDE</text>
  <rect class="body" x="0" y="0" width="120" height="350" rx="14"/>
  <rect class="thin" x="6" y="40" width="10" height="220"/>
  <circle class="ink" cx="20" cy="358" r="10"/><circle class="ink" cx="100" cy="358" r="10"/>
  ${hdim(0,120,400,'≈ 230 depth')}
</g>

<!-- LP cylinder 9kg -->
<g transform="translate(760,150)">
  <text class="lbl" x="0" y="-10">LP cylinder — 9 kg (costume basis)</text>
  <rect class="accent" x="30" y="60" width="150" height="260" rx="20"/>
  <rect class="accent" x="70" y="30" width="70" height="40" rx="8"/>
  <rect class="muted" x="86" y="6" width="38" height="30" rx="6" fill="#30363d"/>
  ${hdim(30,180,360,'≈ 310 Ø')}
  ${vdim(30,320,10,'≈ 580 tall')}
</g>

<!-- LP cylinder 19kg -->
<g transform="translate(1010,120)">
  <text class="lbl" x="0" y="-10">LP cylinder — 19 kg (alt)</text>
  <rect class="accent" x="30" y="60" width="190" height="300" rx="24" opacity="0.85"/>
  <rect class="accent" x="80" y="28" width="90" height="44" rx="8" opacity="0.85"/>
  <rect class="muted" x="104" y="4" width="42" height="30" rx="6" fill="#30363d"/>
  ${hdim(30,220,400,'≈ 375 Ø')}
  ${vdim(28,360,10,'≈ 700 tall')}
</g>

<!-- notes box -->
<g transform="translate(70,560)">
  <rect class="panel" x="0" y="0" width="1260" height="290" rx="12"/>
  <text class="lbl" x="20" y="34">Dimension notes &amp; sourcing</text>
  <text class="note" x="20" y="64">• Heater silhouette target: tall, narrow box ≈ 600 W × 700 H × 230 D — the "honest heater" proportion the shell must read as (matrix SP1).</text>
  <text class="note" x="20" y="90">• Front grille = where the red glow panels sit; 6 bars, lit bar-by-bar (matrix SP5). Control knobs + nameplate at lower face.</text>
  <text class="note" x="20" y="116">• Castor wheels are cosmetic cues only — real running wheels are larger and load-bearing (see T009).</text>
  <text class="note" x="20" y="142">• 9 kg bottle (≈310 Ø ×580) is the lighter costume basis; 19 kg (≈375 Ø ×700) if a bigger seated read is wanted. Pick before T008.</text>
  <text class="note" x="20" y="168">• Cylinder dims are nominal SA domestic LPG; confirm against the actual bottle/costume foam blank before committing.</text>
  <text class="note" x="20" y="194" fill="#3fb950">ACTION: replace these block diagrams with 6–10 sourced photos (front / side / 3-4 / grille close-up) + measured dims on the real units.</text>
  <text class="note" x="20" y="220" fill="#3fb950">ACTION: log image sources/links in dimension-notes.md so proportions are traceable.</text>
  <text class="note" x="20" y="258" fill="#8b949e">Status: scaffold v0 (proportions blocked in) — feeds T008 costume volume + T009 shell silhouette.</text>
</g>
</svg>`;
}

/* =========================================================
   T008 — Driver / cockpit envelope
   ========================================================= */
function driverEnvelope() {
  const W = 1400, H = 950;
  // scale: 1 mm = 0.42 px ; ground line at y=860
  const s = 0.42, gy = 860, x0 = 470;
  const mm = v => v * s;
  // seated H-point low for low CoG
  const hipX = x0 + mm(0), hipY = gy - mm(220);   // H-point 220mm off floor
  const headCx = hipX-mm(150), headCy = hipY-mm(680), headR = mm(130);
  const envX = x0-mm(280), envY = gy-mm(1180), envW = mm(1100), envH = mm(1180);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${defs}
<rect class="bg" width="${W}" height="${H}"/>
<text class="title" x="40" y="50">T008 · Driver / Cockpit Envelope — SIDE (95th-pct male, semi-reclined)</text>
<text class="sub" x="40" y="74">Warm Wheelers · all dims mm · helmet + bottle costume + steering reach + ≤10 s egress · v0 2026-06-22</text>

<!-- ground -->
<line class="line" x1="60" y1="${gy}" x2="${W-60}" y2="${gy}"/>
<text class="note" x="62" y="${gy+24}">GROUND / floor pan</text>

<!-- clearance envelope (ghost box) -->
<rect class="ghost" x="${envX}" y="${envY}" width="${envW}" height="${envH}" rx="10"/>
<text class="note" x="${envX}" y="${envY-10}" fill="#3fb950">CLEARANCE ENVELOPE — nothing rigid inside this box</text>

<!-- bottle costume volume over driver -->
<rect class="ghost" x="${headCx-mm(180)}" y="${gy-mm(1120)}" width="${mm(360)}" height="${mm(900)}" rx="${mm(120)}" stroke="#ff7b3d" opacity="0.8"/>
<text class="note" x="${headCx-mm(180)}" y="${gy-mm(1120)+18}" fill="#ff7b3d" text-anchor="middle" transform="rotate(-90 ${headCx-mm(180)} ${gy-mm(1120)+18})">orange BOTTLE costume volume</text>

<!-- seat -->
<path class="body" d="M ${x0-mm(150)} ${hipY} h ${mm(450)} v ${mm(40)} h ${-mm(450)} z"/>
<path class="body" d="M ${x0-mm(150)} ${hipY} l ${-mm(40)} ${-mm(620)} l ${mm(120)} ${0} l ${mm(40)} ${mm(560)} z"/>
<text class="note" x="${x0-mm(150)}" y="${hipY+34}">seat pan · H-point ↓ low for CoG</text>

<!-- driver: hip->torso->head, and hip->knee->foot (recumbent) -->
<g stroke="#e6edf3" stroke-width="3" fill="none">
  <line x1="${hipX}" y1="${hipY}" x2="${hipX-mm(120)}" y2="${hipY-mm(560)}"/>
  <line x1="${hipX}" y1="${hipY}" x2="${hipX+mm(420)}" y2="${hipY-mm(40)}"/>
  <line x1="${hipX+mm(420)}" y1="${hipY-mm(40)}" x2="${hipX+mm(560)}" y2="${gy-mm(40)}"/>
  <line x1="${hipX-mm(90)}" y1="${hipY-mm(470)}" x2="${hipX+mm(260)}" y2="${hipY-mm(330)}"/>
</g>
<!-- head + helmet -->
<circle class="body" cx="${headCx}" cy="${headCy}" r="${headR}"/>
<text class="note" x="${headCx}" y="${headCy+5}" text-anchor="middle" fill="#e6edf3">HELMET</text>

<!-- steering reach: short arc + grip -->
<path class="ghost" d="M ${hipX+mm(150)} ${hipY-mm(180)} A ${mm(620)} ${mm(620)} 0 0 1 ${hipX+mm(360)} ${hipY-mm(430)}" opacity="0.7" stroke="#ff7b3d"/>
<circle class="accent" cx="${hipX+mm(260)}" cy="${hipY-mm(330)}" r="9"/>
<text class="note" x="${hipX+mm(285)}" y="${hipY-mm(330)+4}" fill="#ff7b3d">steering grip (reach arc)</text>

<!-- pedals -->
<rect class="accent" x="${hipX+mm(540)}" y="${gy-mm(70)}" width="${mm(60)}" height="${mm(70)}"/>
<text class="note" x="${hipX+mm(540)}" y="${gy+24}" fill="#ff7b3d">pedals/brake</text>

<!-- egress arrow -->
<path d="M ${headCx} ${headCy-headR-6} q ${mm(150)} ${-mm(230)} ${mm(470)} ${-mm(120)}" class="line" marker-end="url(#a)" stroke="#3fb950"/>
<text class="note" x="${headCx+mm(220)}" y="${headCy-headR-mm(230)}" fill="#3fb950">EGRESS ≤ 10 s (S4) — up &amp; out, no tools</text>

<!-- dimensions -->
${vdim(headCy-headR, gy, envX-mm(70), '≈1060 head+helmet clearance')}
${vdim(hipY, gy, x0+mm(640), '≈220 H-point ht')}
${vdim(hipY-mm(40), gy, hipX+mm(560)+mm(50), '≈560 knee ht')}
${hdim(envX, hipX+mm(560), gy+mm(150), '≈1250 occupant length (recumbent)')}

<!-- side panel of anthropometrics -->
<g transform="translate(990,150)">
  <rect class="panel" x="0" y="0" width="360" height="300" rx="12"/>
  <text class="lbl" x="18" y="32">95th-pct male seated (mm)</text>
  <text class="note" x="18" y="62">Sitting height (seat→crown): 965</text>
  <text class="note" x="18" y="86">+ helmet allowance: 60–100 → reserve 1060</text>
  <text class="note" x="18" y="110">Buttock–knee length: 620</text>
  <text class="note" x="18" y="134">Knee height seated: 560</text>
  <text class="note" x="18" y="158">Shoulder breadth: 510  (min cockpit W)</text>
  <text class="note" x="18" y="182">Hip breadth: 420</text>
  <text class="note" x="18" y="214" fill="#3fb950">Checks fed to matrix:</text>
  <text class="note" x="18" y="236">S4 egress ≤10 s · S6 view ≥100° · C5 CoG low</text>
  <text class="note" x="18" y="270" fill="#8b949e">Status: scaffold v0 — verify on real driver + costume.</text>
</g>
</svg>`;
}

/* =========================================================
   T009 — Side + top layout sketch v0
   ========================================================= */
function layout() {
  const W = 1400, H = 1180;
  const s = 0.27; const mm = v => v*s;
  // SIDE
  const sgy = 560, sx = 120;
  // TOP
  const tcy = 900, tx = 120;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${defs}
<rect class="bg" width="${W}" height="${H}"/>
<text class="title" x="40" y="48">T009 · Concept Layout v0 — SIDE + TOP  [DECISION]</text>
<text class="sub" x="40" y="72">Warm Wheelers · all dims mm · within RB max 2000 W × 2500 H × 6000 L · v0 2026-06-22</text>

<!-- ===== SIDE VIEW ===== -->
<text class="lbl" x="${sx}" y="${sgy-mm(1620)}">SIDE</text>
<line class="line" x1="${sx-30}" y1="${sgy}" x2="${sx+mm(2400)}" y2="${sgy}"/>
<text class="note" x="${sx-26}" y="${sgy+22}">ground</text>

<!-- wheels: wheelbase 1800, front near x=300, rear x=2100 -->
<circle class="body" cx="${sx+mm(300)}" cy="${sgy-mm(110)}" r="${mm(110)}"/>
<circle class="body" cx="${sx+mm(2100)}" cy="${sgy-mm(110)}" r="${mm(110)}"/>

<!-- heater shell silhouette (tall box) raked back slightly -->
<path class="body" d="M ${sx+mm(250)} ${sgy-mm(160)}
  L ${sx+mm(250)} ${sgy-mm(1500)}
  L ${sx+mm(2150)} ${sgy-mm(1500)}
  L ${sx+mm(2200)} ${sgy-mm(160)} Z"/>
<!-- grille zone front -->
<rect class="panel" x="${sx+mm(250)}" y="${sgy-mm(1300)}" width="${mm(120)}" height="${mm(900)}"/>
${Array.from({length:6},(_,i)=>`<rect class="glow" x="${sx+mm(258)}" y="${sgy-mm(1280)+mm(i*150)}" width="${mm(104)}" height="${mm(90)}" opacity="${0.3+i*0.06}"/>`).join('')}

<!-- driver+seat low -->
<circle class="ghost" cx="${sx+mm(1150)}" cy="${sgy-mm(900)}" r="${mm(150)}" stroke="#3fb950"/>
<line class="ghost" x1="${sx+mm(1150)}" y1="${sgy-mm(760)}" x2="${sx+mm(1300)}" y2="${sgy-mm(250)}" stroke="#3fb950"/>
<text class="note" x="${sx+mm(900)}" y="${sgy-mm(620)}" fill="#3fb950">driver + bottle (mass low, at floor)</text>
<!-- ballast -->
<rect class="accent" x="${sx+mm(900)}" y="${sgy-mm(230)}" width="${mm(500)}" height="${mm(70)}"/>
<text class="note" x="${sx+mm(905)}" y="${sgy-mm(245)}" fill="#ff7b3d">ballast low</text>

<!-- side dims -->
${hdim(sx+mm(300), sx+mm(2100), sgy+mm(260), '1800 wheelbase')}
${vdim(sgy-mm(1500), sgy, sx-mm(60), '1500 shell ht (≤2500 max)')}
${vdim(sgy-mm(110)*2, sgy, sx+mm(2320), '≈220 ground clr')}
${hdim(sx+mm(190), sx+mm(2200), sgy+mm(440), '≈2350 overall length (≤6000 max)')}

<!-- ===== TOP VIEW ===== -->
<text class="lbl" x="${tx}" y="${tcy-mm(900)}">TOP (plan)</text>
<!-- body outline -->
<rect class="body" x="${tx+mm(190)}" y="${tcy-mm(300)}" width="${mm(2000)}" height="${mm(600)}" rx="${mm(80)}"/>
<!-- wheels: track 1300, wheelbase 1800 -->
${[[300,-650],[300,650],[2100,-650],[2100,650]].map(([x,y])=>
  `<rect class="panel" x="${tx+mm(x)-mm(55)}" y="${tcy+mm(y)-mm(110)}" width="${mm(110)}" height="${mm(220)}"/>`).join('')}
<!-- centreline -->
<line class="thin" x1="${tx+mm(150)}" y1="${tcy}" x2="${tx+mm(2250)}" y2="${tcy}" stroke-dasharray="6 5"/>
<!-- seat/driver -->
<circle class="ghost" cx="${tx+mm(1150)}" cy="${tcy}" r="${mm(260)}" stroke="#3fb950"/>
<text class="note" x="${tx+mm(1000)}" y="${tcy-mm(300)+18}" fill="#3fb950">seat centred, low</text>
<!-- steering at front axle -->
<line class="accent" x1="${tx+mm(300)}" y1="${tcy-mm(650)}" x2="${tx+mm(300)}" y2="${tcy+mm(650)}" stroke="#ff7b3d" stroke-width="3"/>
<text class="note" x="${tx+mm(330)}" y="${tcy-mm(560)}" fill="#ff7b3d">steered front axle</text>

<!-- top dims -->
${vdim(tcy-mm(650), tcy+mm(650), tx-mm(60), '1300 track')}
${hdim(tx+mm(300), tx+mm(2100), tcy+mm(820), '1800 wheelbase')}
${hdim(tx+mm(190), tx+mm(2190), tcy-mm(440), '2000 body width (≤2000 max)')}

<!-- decision panel -->
<g transform="translate(950,520)">
  <rect class="panel" x="0" y="0" width="400" height="430" rx="12"/>
  <text class="lbl" x="18" y="34">DECISION — geometry v0</text>
  <text class="note" x="18" y="64">Wheelbase: 1800 mm</text>
  <text class="note" x="18" y="88">Track width: 1300 mm</text>
  <text class="note" x="18" y="112">Ground clearance: ~220 mm</text>
  <text class="note" x="18" y="136">Shell height: 1500 mm (rake ~3°)</text>
  <text class="note" x="18" y="160">Overall L×W×H: 2350×2000×1500</text>
  <text class="note" x="18" y="196" fill="#3fb950">Why:</text>
  <text class="note" x="18" y="218">• CoG target ≤0.45×track → ≤585 mm (C1)</text>
  <text class="note" x="18" y="240">• Turning radius aim ≤6 m (ST1)</text>
  <text class="note" x="18" y="262">• Compact, well inside RB 2×2.5×6 m</text>
  <text class="note" x="18" y="284">• Mass low: driver+bottle+ballast at floor</text>
  <text class="note" x="18" y="320" fill="#ff7b3d">Open / to verify:</text>
  <text class="note" x="18" y="342">• Real wheel Ø vs ground clr</text>
  <text class="note" x="18" y="364">• Track vs measured CoG (tilt-table)</text>
  <text class="note" x="18" y="386">• RB official weight limit [RB?]</text>
  <text class="note" x="18" y="416" fill="#8b949e">Log this in the decision log.</text>
</g>
</svg>`;
}

save(refBoard(),       `${ROOT}/05_media/T007-reference-board-v0.svg`,   `${ROOT}/05_media/T007-reference-board-v0.png`,   1680);
save(driverEnvelope(), `${ROOT}/02_CAD/T008-driver-envelope-v0.svg`,     `${ROOT}/02_CAD/T008-driver-envelope-v0.png`,     1680);
save(layout(),         `${ROOT}/02_CAD/T009-layout-sketch-v0.svg`,       `${ROOT}/02_CAD/T009-layout-sketch-v0.png`,       1680);
console.log('done');
