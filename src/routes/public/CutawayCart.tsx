import styles from "./CutawayCart.module.css";

/**
 * Warm Wheelers — the machine, side profile.
 *
 * Rebuilt to the T018 CAD master spec (2026-07-02 validation pass): an upright,
 * tall-narrow domestic gas heater with a **convex domed front face**, a
 * chrome-guarded **three-panel glow grille**, an **upper view band** (the driver
 * sees through the heater's top grille), control knobs and a nameplate — the body
 * **boat-tails into the orange LP-gas-bottle driver pod** (the driver is the fuel),
 * with a **welded roll hoop** over the helmet and **six wheels** (two steered up
 * front, dual load-sharing wheels at the rear for the gas-truck read).
 *
 * `rolling` drives every animation. Set it false (e.g. inside the annotated
 * cutaway diagram) for a still, blueprint-style render with no per-frame work.
 */
export function CutawayCart({ rolling = true }: { rolling?: boolean }) {
  const cls = (c: string) => (rolling ? c : undefined);
  return (
    <svg
      className={styles.svg}
      viewBox="0 0 720 430"
      role="img"
      aria-label="Side profile of the Warm Wheelers cart: an upright charcoal gas-heater body with a convex domed front, a glowing three-panel grille and an upper view band, boat-tailing into an orange gas-bottle driver pod under a roll hoop, riding on six pneumatic wheels."
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* charcoal heater body */}
        <linearGradient id="ww-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#403830" />
          <stop offset="0.5" stopColor="#282019" />
          <stop offset="1" stopColor="#161009" />
        </linearGradient>
        <linearGradient id="ww-face" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4c4238" />
          <stop offset="1" stopColor="#241d16" />
        </linearGradient>
        {/* orange LP-gas bottle pod — the driver is the fuel */}
        <linearGradient id="ww-bottle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffa648" />
          <stop offset="0.45" stopColor="#f2701e" />
          <stop offset="1" stopColor="#b83d10" />
        </linearGradient>
        <linearGradient id="ww-bottle-hi" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
        </linearGradient>
        {/* chrome grille guard */}
        <linearGradient id="ww-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2ecdd" />
          <stop offset="0.5" stopColor="#a49c8b" />
          <stop offset="1" stopColor="#d7d0c0" />
        </linearGradient>
        <linearGradient id="ww-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#c8431c" />
          <stop offset="0.5" stopColor="#ff8c2b" />
          <stop offset="1" stopColor="#ffd66b" />
        </linearGradient>
        <radialGradient id="ww-bloom" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffb324" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#ff6b1a" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ff6b1a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ww-rim" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#cfc8b8" />
          <stop offset="0.6" stopColor="#8c8576" />
          <stop offset="1" stopColor="#4a463b" />
        </radialGradient>
        <radialGradient id="ww-tire" cx="0.42" cy="0.38" r="0.7">
          <stop offset="0" stopColor="#3b3730" />
          <stop offset="1" stopColor="#16120d" />
        </radialGradient>
        <linearGradient id="ww-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5c5648" />
          <stop offset="1" stopColor="#3a352c" />
        </linearGradient>
        <filter id="ww-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      {/* ground shadow — blurred once, static */}
      <ellipse className={styles.shadow} cx="366" cy="388" rx="256" ry="18" filter="url(#ww-soft)" />

      {/* airflow streamlines sliding over the domed top and off the boat-tail */}
      <g stroke="var(--blueprint-bright)" fill="none" strokeLinecap="round">
        <path className={`${styles.stream} ${cls(styles.streamRun) ?? ""}`} d="M28,120 C150,78 300,74 430,92 C540,108 604,132 676,150" strokeWidth="2.4" opacity="0.85" />
        <path className={`${styles.stream} ${styles.stream2} ${cls(styles.streamRun) ?? ""}`} d="M28,168 C150,146 300,142 408,152 C486,160 556,186 612,214" strokeWidth="2" opacity="0.6" />
        <path className={`${styles.stream} ${styles.stream3} ${cls(styles.streamRun) ?? ""}`} d="M28,214 C130,208 230,206 300,208" strokeWidth="1.6" opacity="0.45" />
      </g>

      {/* the rolling machine — gentle bob applied to the whole rig */}
      <g className={cls(styles.bob)}>
        {/* chassis plank + low steel spine */}
        <rect x="176" y="298" width="392" height="12" rx="4" fill="url(#ww-floor)" />
        <rect x="176" y="298" width="392" height="3" rx="2" fill="#7a7363" opacity="0.7" />

        {/* ---- orange LP-gas-bottle driver pod (rear, boat-tailed) ---- */}
        <g>
          <path
            d="M474,150 C540,150 592,182 592,232 C592,286 548,306 496,306 L474,306 Z"
            fill="url(#ww-bottle)"
            stroke="#8f2f0a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* bottle collar + valve boss */}
          <rect x="512" y="140" width="46" height="16" rx="6" fill="#c8541a" stroke="#8f2f0a" strokeWidth="2" />
          <rect x="527" y="128" width="16" height="16" rx="3" fill="#9c9585" stroke="#4a463b" strokeWidth="1.5" />
          {/* pressure bands + sheen */}
          <path d="M486,206 C528,200 566,204 588,214" fill="none" stroke="#8f2f0a" strokeWidth="1.6" opacity="0.5" />
          <path d="M484,250 C528,246 566,250 588,258" fill="none" stroke="#8f2f0a" strokeWidth="1.6" opacity="0.5" />
          <path d="M494,168 C512,166 528,168 540,176 L534,250 C520,214 506,186 494,168 Z" fill="url(#ww-bottle-hi)" />
        </g>

        {/* ---- charcoal heater body: upright, ~5° lean, convex domed front ---- */}
        <path
          d="M196,300
             L184,164 C180,126 200,104 230,100
             C316,90 404,96 462,118
             C500,134 518,160 510,192
             C504,216 492,232 478,242
             L478,300 Z"
          fill="url(#ww-body)"
          stroke="#120d08"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* domed-top sheen highlight */}
        <path
          d="M196,168 C192,130 210,112 236,108 C312,100 398,106 456,128"
          fill="none"
          stroke="#6f6252"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* ribbed side-panel seams (the silver flank cue from the reference heaters) */}
        <g stroke="#0f0b07" strokeWidth="1.4" opacity="0.4" fill="none">
          <path d="M300,104 L300,296" />
          <path d="M340,104 L340,296" />
          <path d="M380,108 L380,296" />
        </g>
        {/* rolled shoulder that meets the boat-tail */}
        <path d="M462,118 C500,134 518,160 510,192 C504,212 494,226 482,236" fill="none" stroke="#0f0b07" strokeWidth="1.6" opacity="0.5" />

        {/* ---- convex domed front face plate ---- */}
        <path
          d="M196,300 L184,164 C180,126 200,104 230,100 C216,140 214,220 214,300 Z"
          fill="url(#ww-face)"
          stroke="#120d08"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* static bloom behind the grille */}
        <ellipse className={styles.bloom} cx="196" cy="250" rx="70" ry="72" fill="url(#ww-bloom)" />

        {/* ---- three-panel glow grille (lower front) ---- */}
        <g>
          <rect className={cls(styles.panel)} x="168" y="252" width="52" height="24" rx="4" fill="url(#ww-flame)" />
          <rect className={`${cls(styles.panel) ?? ""} ${styles.panel2}`} x="170" y="222" width="50" height="24" rx="4" fill="url(#ww-flame)" />
          <rect className={`${cls(styles.panel) ?? ""} ${styles.panel3}`} x="172" y="192" width="48" height="24" rx="4" fill="url(#ww-flame)" />
        </g>
        {/* chrome wire guard over the grille */}
        <g stroke="url(#ww-chrome)" fill="none" strokeLinecap="round">
          <rect x="164" y="186" width="60" height="96" rx="6" strokeWidth="3" />
          <line x1="182" y1="188" x2="182" y2="280" strokeWidth="1.6" opacity="0.8" />
          <line x1="196" y1="188" x2="196" y2="280" strokeWidth="1.6" opacity="0.8" />
          <line x1="210" y1="188" x2="210" y2="280" strokeWidth="1.6" opacity="0.8" />
        </g>

        {/* ---- upper view band (the heater's top grille — driver sees through it) ---- */}
        <g>
          <rect x="176" y="140" width="52" height="34" rx="4" fill="#0d0a07" stroke="#3a352c" strokeWidth="1.5" />
          {[147, 154, 161, 168].map((y) => (
            <line key={y} x1="180" y1={y} x2="224" y2={y} stroke="#4a463b" strokeWidth="2" />
          ))}
        </g>

        {/* control knobs on the top shoulder */}
        <g>
          <circle cx="252" cy="120" r="7" fill="#cfc8b8" stroke="#3a352c" strokeWidth="2" />
          <circle cx="276" cy="116" r="7" fill="#cfc8b8" stroke="#3a352c" strokeWidth="2" />
          <line x1="252" y1="120" x2="256" y2="115" stroke="#3a352c" strokeWidth="2" />
          <line x1="276" y1="116" x2="280" y2="111" stroke="#3a352c" strokeWidth="2" />
        </g>

        {/* nameplate — WARM WHEELERS badge low on the face */}
        <g>
          <rect x="230" y="272" width="88" height="18" rx="4" fill="#0f0b07" stroke="#5a4128" strokeWidth="1.4" />
          <text x="274" y="285" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="0.5" fill="var(--flame-pale)">
            WARM WHEELERS
          </text>
        </g>

        {/* ---- reclined driver + welded roll hoop over the pod ---- */}
        <g>
          {/* roll hoop arcing over the helmet */}
          <path d="M468,300 C466,204 486,160 526,150 C568,160 588,204 586,300" fill="none" stroke="#9c9585" strokeWidth="7" strokeLinecap="round" opacity="0.85" />
          <path d="M468,300 C466,204 486,160 526,150 C568,160 588,204 586,300" fill="none" stroke="#e7ddc8" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          {/* helmet + ember visor poking from the open pod top */}
          <circle cx="526" cy="164" r="21" fill="#2c1d12" stroke="#120c07" strokeWidth="2" />
          <path d="M512,166 a14,11 0 0 1 28,1 Z" fill="var(--ember-bright)" className={cls(styles.visor)} />
        </g>
      </g>

      {/* ---- front wheel (steered) ---- */}
      <g transform="translate(230,344)">
        <circle r="50" fill="url(#ww-tire)" />
        <circle r="50" fill="none" stroke="#0d0a07" strokeWidth="3" />
        <g className={cls(styles.roll)}>
          <circle r="30" fill="url(#ww-rim)" stroke="#3a352c" strokeWidth="2" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <rect key={a} x="-2.4" y="-29" width="4.8" height="26" rx="2" fill="#4a463b" transform={`rotate(${a})`} />
          ))}
          <circle r="8" fill="#cfc8b8" stroke="#3a352c" strokeWidth="2" />
        </g>
      </g>

      {/* ---- rear duals (load-sharing pair, disc brake) — outboard twin peeks behind ---- */}
      <g transform="translate(556,344)">
        <circle r="48" fill="#100c08" />
        <circle r="48" fill="none" stroke="#0d0a07" strokeWidth="3" />
        <circle r="26" fill="#2b271f" stroke="#3a352c" strokeWidth="2" />
      </g>
      <g transform="translate(522,344)">
        <circle r="50" fill="url(#ww-tire)" />
        <circle r="50" fill="none" stroke="#0d0a07" strokeWidth="3" />
        <g className={cls(styles.roll)}>
          <circle r="30" fill="url(#ww-rim)" stroke="#3a352c" strokeWidth="2" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <rect key={a} x="-2.4" y="-29" width="4.8" height="26" rx="2" fill="#4a463b" transform={`rotate(${a})`} />
          ))}
          {/* brake disc */}
          <circle r="20" fill="none" stroke="#9c9585" strokeWidth="3" opacity="0.55" />
          <circle r="8" fill="#cfc8b8" stroke="#3a352c" strokeWidth="2" />
        </g>
      </g>
    </svg>
  );
}
