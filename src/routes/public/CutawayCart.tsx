import styles from "./CutawayCart.module.css";

/**
 * Warm Wheelers,the machine.
 * A raked gas-heater soapbox rendered as a layered, shaded SVG: glowing grille,
 * flowing airflow streamlines, detailed rolling wheels and a boat-tail rear.
 * Geometry derived from the engineering side-cutaway in /Vision.
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
      aria-label="Side profile of the Warm Wheelers gas-heater soapbox: a raked heater body with a glowing grille on a low chassis with two large wheels."
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="ww-metal" x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0" stopColor="#b9b1a0" />
          <stop offset="0.45" stopColor="#8d8676" />
          <stop offset="1" stopColor="#5c5648" />
        </linearGradient>
        <linearGradient id="ww-metal-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d8cfbc" />
          <stop offset="1" stopColor="#6e685a" />
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

      {/* ground shadow,blurred once, static */}
      <ellipse className={styles.shadow} cx="360" cy="372" rx="246" ry="20" filter="url(#ww-soft)" />

      {/* airflow streamlines flowing over the body */}
      <g stroke="var(--blueprint-bright)" fill="none" strokeLinecap="round">
        <path className={`${styles.stream} ${cls(styles.streamRun) ?? ""}`} d="M40,150 C190,96 330,92 430,108 C540,126 612,168 668,228" strokeWidth="2.4" opacity="0.85" />
        <path className={`${styles.stream} ${styles.stream2} ${cls(styles.streamRun) ?? ""}`} d="M40,196 C170,168 300,162 392,170 C470,178 540,206 590,250" strokeWidth="2" opacity="0.6" />
        <path className={`${styles.stream} ${styles.stream3} ${cls(styles.streamRun) ?? ""}`} d="M40,250 C150,244 250,242 320,244" strokeWidth="1.6" opacity="0.45" />
      </g>

      {/* the rolling machine,gentle bob applied to the whole rig */}
      <g className={cls(styles.bob)}>
        {/* chassis plank */}
        <rect x="150" y="316" width="420" height="13" rx="4" fill="url(#ww-floor)" />
        <rect x="150" y="316" width="420" height="3" rx="2" fill="#7a7363" opacity="0.7" />

        {/* heater body,raked back, boat-tail rear */}
        <path
          d="M232,304 L300,138 C306,124 320,118 336,120 L452,134 C500,140 548,196 566,262 C572,284 570,300 560,304 Z"
          fill="url(#ww-metal)"
          stroke="#403b31"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* top highlight sheen */}
        <path
          d="M300,150 C308,136 322,132 338,134 L446,146 C488,152 528,196 548,250"
          fill="none"
          stroke="#e7ddc8"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* panel seam */}
        <path d="M430,134 C452,200 452,260 446,304" fill="none" stroke="#403b31" strokeWidth="1.5" opacity="0.5" />

        {/* boat-tail fin */}
        <path d="M452,134 L470,108 C474,100 484,100 487,109 L498,150 Z" fill="url(#ww-metal-edge)" stroke="#403b31" strokeWidth="2" strokeLinejoin="round" />

        {/* reclined driver,helmet + ember visor poking from the cockpit */}
        <g>
          <path d="M392,150 a26,26 0 0 1 50,6 l-50,8 Z" fill="#241710" />
          <circle cx="410" cy="150" r="20" fill="#2c1d12" stroke="#120c07" strokeWidth="2" />
          <path d="M398,150 a14,12 0 0 1 26,2 Z" fill="var(--ember-bright)" className={cls(styles.visor)} />
        </g>

        {/* static bloom behind the grille,a painted-once flame halo replacing the SVG glow filter */}
        <ellipse className={styles.bloom} cx="294" cy="247" rx="78" ry="86" fill="url(#ww-bloom)" />

        {/* glowing grille,three flame panels on the raked front face */}
        <g>
          <polygon className={cls(styles.panel)} points="252,296 268,258 306,272 290,310" fill="url(#ww-flame)" />
          <polygon className={`${cls(styles.panel) ?? ""} ${styles.panel2}`} points="268,258 283,220 321,234 306,272" fill="url(#ww-flame)" />
          <polygon className={`${cls(styles.panel) ?? ""} ${styles.panel3}`} points="283,220 298,184 336,198 321,234" fill="url(#ww-flame)" />
        </g>
        <polygon points="252,296 298,184 336,198 290,310" fill="none" stroke="#3a2a18" strokeWidth="2" opacity="0.55" />

        {/* wind vane (drives the glow) */}
        <line x1="318" y1="270" x2="308" y2="222" stroke="#403b31" strokeWidth="2" />
        <g className={cls(styles.vane)} style={{ transformOrigin: "318px 270px" }}>
          <circle cx="318" cy="270" r="4" fill="#cfc8b8" />
          <path d="M318,270 l16,-5 l-2,10 Z" fill="#cfc8b8" />
        </g>
      </g>

      {/* ---- front wheel (steered) ---- */}
      <g transform="translate(196,340)">
        <circle r="54" fill="url(#ww-tire)" />
        <circle r="54" fill="none" stroke="#0d0a07" strokeWidth="3" />
        <g className={cls(styles.roll)}>
          <circle r="33" fill="url(#ww-rim)" stroke="#3a352c" strokeWidth="2" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <rect key={a} x="-2.5" y="-32" width="5" height="28" rx="2" fill="#4a463b" transform={`rotate(${a})`} />
          ))}
          <circle r="9" fill="#cfc8b8" stroke="#3a352c" strokeWidth="2" />
        </g>
      </g>

      {/* ---- rear wheel (disc brake) ---- */}
      <g transform="translate(520,340)">
        <circle r="54" fill="url(#ww-tire)" />
        <circle r="54" fill="none" stroke="#0d0a07" strokeWidth="3" />
        <g className={cls(styles.roll)}>
          <circle r="33" fill="url(#ww-rim)" stroke="#3a352c" strokeWidth="2" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <rect key={a} x="-2.5" y="-32" width="5" height="28" rx="2" fill="#4a463b" transform={`rotate(${a})`} />
          ))}
          <circle r="22" fill="none" stroke="#9c9585" strokeWidth="3" opacity="0.5" />
          <circle r="9" fill="#cfc8b8" stroke="#3a352c" strokeWidth="2" />
        </g>
      </g>
    </svg>
  );
}
