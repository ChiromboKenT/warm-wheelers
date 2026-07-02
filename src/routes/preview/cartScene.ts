import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/* ============================================================
   Warm Wheelers — real-time PBR preview of the T018 master geometry.

   Coordinates. Spec (T018): +X forward, +Y left, +Z up, mm.
   World: x = specX, y = specZ (up), z = -specY. Root scaled to metres.

   Sources: geometry T018-parameters.csv · shell T023 · glow T024 ·
   driver T025 · materials referenced from build/05_media/reference images
   (Alva / Russell Hobbs gas heaters + LP bottle).
   ============================================================ */

export type ViewName = "hero" | "side" | "rear" | "face";

export interface CartSceneHandles {
  setStage(n: number): void;
  setView(name: ViewName): void;
  stopAutoRotate(): void;
  dispose(): void;
}

const P = {
  wheelbase: 1700,
  track: 1200,
  wheelDia: 260,
  wheelW: 85,
  bodyW: 1300,
  bodyH: 1450,
  bodyLen: 1850,
  boattail: 500,
  domeDepth: 200,
  clearance: 150,
  axleZ: 130,
  frontX: 1200, // body_front_x datum
  rakeShear: -127 / 1450, // 5° lean, top rearward
};
const HALF_W = P.bodyW / 2; // 650
const REAR_X = P.frontX - P.bodyLen; // -650
const TAIL_END = REAR_X - P.boattail; // -1150

/* T023 §3.6 — full steering-sweep keep-out for the front wheel wells */
const ARCH = { x0: 650, x1: 1050, yInner: 460 };

const CHORD = 1284; // recessed flat grille face
const RY = 520; // recess half-width

/* ---------- procedural textures (PBR maps, no downloads) ---------- */
function makeCanvasTexture(
  w: number,
  h: number,
  draw: (g: CanvasRenderingContext2D, w: number, h: number) => void,
): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  draw(g, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

/* asphalt — warm dark speckle, tiled under the cart */
function asphaltTexture(): THREE.CanvasTexture {
  const tex = makeCanvasTexture(512, 512, (g, w, h) => {
    g.fillStyle = "#221c17";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 14000; i++) {
      const v = Math.random();
      g.fillStyle =
        v > 0.985
          ? "rgba(148,132,110,.5)"
          : v > 0.6
            ? `rgba(64,54,44,${0.18 + v * 0.25})`
            : `rgba(10,8,6,${0.12 + v * 0.3})`;
      const s = 1 + Math.random() * 2.4;
      g.fillRect(Math.random() * w, Math.random() * h, s, s);
    }
  });
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.repeat.set(26, 26);
  return tex;
}

/* ceramic radiant plaque — the honeycomb waffle of the reference heaters */
function ceramicTexture(): THREE.CanvasTexture {
  const tex = makeCanvasTexture(512, 128, (g, w, h) => {
    g.fillStyle = "#5a3320"; // grout between tiles
    g.fillRect(0, 0, w, h);
    const cols = 44;
    const rows = 10;
    const cw = w / cols;
    const ch = h / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const warm = 0.82 + Math.random() * 0.18;
        g.fillStyle = `rgb(${Math.round(236 * warm)},${Math.round(148 * warm)},${Math.round(96 * warm)})`;
        g.fillRect(c * cw + 1.2, r * ch + 1.2, cw - 2.4, ch - 2.4);
      }
    }
    // three vertical seams — real plaques come as separate bricks
    g.fillStyle = "#3a2114";
    for (let i = 1; i < 4; i++) g.fillRect((w / 4) * i - 2, 0, 4, h);
  });
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* shutterply — pale wood grain for the deck */
function plyTexture(): THREE.CanvasTexture {
  const tex = makeCanvasTexture(256, 256, (g, w, h) => {
    g.fillStyle = "#c69c60";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) {
      const y = Math.random() * h;
      g.strokeStyle = `rgba(122,84,40,${0.08 + Math.random() * 0.16})`;
      g.lineWidth = 0.6 + Math.random() * 1.6;
      g.beginPath();
      g.moveTo(0, y);
      g.bezierCurveTo(w * 0.3, y + (Math.random() - 0.5) * 14, w * 0.7, y + (Math.random() - 0.5) * 14, w, y);
      g.stroke();
    }
  });
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.repeat.set(3, 2);
  return tex;
}

export function createCartScene(container: HTMLElement, onReady?: () => void): CartSceneHandles {
  /* renderer — throws if WebGL is unavailable; caller shows the fallback */
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  container.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x120d08);
  scene.fog = new THREE.Fog(0x120d08, 9, 20);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;

  const camera = new THREE.PerspectiveCamera(30, 2, 0.1, 60);
  const TARGET = new THREE.Vector3(0.1, 0.62, 0);
  /* pulled back far enough that the full cart sits inside the frame */
  const VIEWS: Record<ViewName, THREE.Vector3> = {
    hero: new THREE.Vector3(4.35, 1.9, 3.5),
    side: new THREE.Vector3(0.1, 0.95, 6.1),
    rear: new THREE.Vector3(-4.25, 2.15, 3.45),
    face: new THREE.Vector3(5.3, 0.9, 1.15),
  };
  camera.position.copy(VIEWS.hero);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(TARGET);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 1.7;
  controls.maxDistance = 9;
  controls.maxPolarAngle = 1.52;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 0.5;
  const stopRotate = () => {
    controls.autoRotate = false;
  };
  renderer.domElement.addEventListener("pointerdown", stopRotate, { once: true });

  /* ---------- lights ---------- */
  const key = new THREE.DirectionalLight(0xfff0dd, 3.1);
  key.position.set(3.6, 4.4, 2.3);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -2.8;
  key.shadow.camera.right = 2.8;
  key.shadow.camera.top = 2.8;
  key.shadow.camera.bottom = -2.8;
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 12;
  key.shadow.bias = -0.0002;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 3;
  scene.add(key, key.target);

  const fill = new THREE.DirectionalLight(0xb8c4d8, 0.6);
  fill.position.set(-4.5, 2.6, -3.2);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffc890, 0.5);
  rim.position.set(-2.2, 1.4, 3.8);
  scene.add(rim);
  scene.add(new THREE.HemisphereLight(0x453723, 0x0b0806, 0.45));

  // light of the glow itself — spills onto the tarmac when the lever is pulled.
  // It casts shadows so it cannot leak through the shell into the arches.
  const glowLight = new THREE.PointLight(0xff7a1a, 0, 2.4, 2);
  glowLight.position.set(1.45, 0.48, 0);
  glowLight.castShadow = true;
  glowLight.shadow.mapSize.set(512, 512);
  glowLight.shadow.camera.near = 0.05;
  glowLight.shadow.bias = -0.002;
  scene.add(glowLight);

  /* ---------- materials ---------- */
  const env = <T extends THREE.Material & { envMapIntensity: number }>(m: T, i: number): T => {
    m.envMapIntensity = i;
    return m;
  };
  const asphalt = asphaltTexture();
  const ceramic = ceramicTexture();
  const ply = plyTexture();

  const MAT = {
    /* powder-coated charcoal steel — the Alva shell read (neutral, not brown) */
    body: env(
      new THREE.MeshPhysicalMaterial({ color: 0x262422, roughness: 0.52, clearcoat: 0.28, clearcoatRoughness: 0.5 }),
      0.5,
    ),
    slat: env(new THREE.MeshStandardMaterial({ color: 0x171310, roughness: 0.6 }), 0.4),
    cavity: env(new THREE.MeshStandardMaterial({ color: 0x0c0906, roughness: 0.95 }), 0.15),
    /* chromed wire guard — bright in the references */
    wire: env(new THREE.MeshStandardMaterial({ color: 0xd8d8dc, metalness: 0.92, roughness: 0.26 }), 1.2),
    tyre: env(new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.94 }), 0.25),
    tyreRib: env(new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.98 }), 0.2),
    rim: env(new THREE.MeshStandardMaterial({ color: 0xb2ada2, metalness: 0.65, roughness: 0.45 }), 0.9),
    hub: env(new THREE.MeshStandardMaterial({ color: 0x2c2723, metalness: 0.4, roughness: 0.6 }), 0.5),
    steel: env(new THREE.MeshStandardMaterial({ color: 0x3d3d42, metalness: 0.85, roughness: 0.45 }), 0.8),
    disc: env(new THREE.MeshStandardMaterial({ color: 0x8f8f94, metalness: 0.9, roughness: 0.35 }), 1.0),
    ply: env(new THREE.MeshStandardMaterial({ map: ply, color: 0xffffff, roughness: 0.85 }), 0.3),
    orange: env(
      new THREE.MeshPhysicalMaterial({ color: 0xd9541a, roughness: 0.48, clearcoat: 0.3, clearcoatRoughness: 0.45 }),
      0.55,
    ),
    suit: env(new THREE.MeshStandardMaterial({ color: 0xe8631f, roughness: 0.62 }), 0.45),
    bone: env(new THREE.MeshStandardMaterial({ color: 0xefd9b0, roughness: 0.5 }), 0.5),
    visor: env(
      new THREE.MeshPhysicalMaterial({ color: 0x191511, roughness: 0.15, metalness: 0.2, clearcoat: 1 }),
      1.2,
    ),
    seat: env(new THREE.MeshStandardMaterial({ color: 0x1c1712, roughness: 0.9 }), 0.2),
  };

  /* root group: build in spec-mm, scale once to metres */
  const root = new THREE.Group();
  root.scale.setScalar(0.001);
  scene.add(root);
  const mesh = (geo: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D = root) => {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };
  /* strut between two spec-space points — braces, arms, columns */
  const strut = (
    a: THREE.Vector3,
    b: THREE.Vector3,
    r: number,
    mat: THREE.Material,
    parent: THREE.Object3D = root,
    capsule = false,
  ) => {
    const len = a.distanceTo(b);
    const geo = capsule
      ? new THREE.CapsuleGeometry(r, Math.max(1, len - 2 * r), 6, 14)
      : new THREE.CylinderGeometry(r, r, len, 12);
    const m = mesh(geo, mat, parent);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    return m;
  };
  /* spec (x, y, z)mm → world mm vector */
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, z, -y);

  /* ---------- ground ---------- */
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(9000, 64),
    env(new THREE.MeshStandardMaterial({ map: asphalt, color: 0xffffff, roughness: 0.96 }), 0.12),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  root.add(ground);

  /* ============================================================
     SHELL — sheared 5° (rake) about Z = 150 (T018 §3, T023)
     ============================================================ */
  const shell = new THREE.Group();
  shell.matrixAutoUpdate = false;
  {
    // x' = x + k·(y − 150)  … lean the whole shell back, base fixed
    const k = P.rakeShear;
    shell.matrix.set(1, k, 0, -150 * k, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  root.add(shell);

  /* footprint helpers — plan view in (specX, specY) */
  const frontXAt = (y: number) => P.frontX + P.domeDepth * Math.sqrt(Math.max(0, 1 - (y / HALF_W) ** 2));
  function frontArc(shape: THREE.Shape, y0: number, y1: number, n = 40) {
    for (let i = 1; i <= n; i++) {
      const y = y0 + ((y1 - y0) * i) / n;
      shape.lineTo(frontXAt(y), y);
    }
  }
  /* Wheel arches are cut on BOTH sides (T023 §3.6) — the old preview
     notched only the right side and the shell passed through the left tyre. */
  function footprint({ notch = false, recess = false } = {}) {
    const s = new THREE.Shape();
    const r = 45;
    s.moveTo(REAR_X + r, -HALF_W);
    if (notch) {
      s.lineTo(ARCH.x0, -HALF_W);
      s.lineTo(ARCH.x0, -ARCH.yInner);
      s.lineTo(ARCH.x1, -ARCH.yInner);
      s.lineTo(ARCH.x1, -HALF_W);
    }
    s.lineTo(P.frontX, -HALF_W);
    if (recess) {
      frontArc(s, -HALF_W, -RY, 14);
      s.lineTo(CHORD, -RY);
      s.lineTo(CHORD, RY);
      s.lineTo(frontXAt(RY), RY);
      frontArc(s, RY, HALF_W, 14);
    } else {
      frontArc(s, -HALF_W, HALF_W, 56);
    }
    if (notch) {
      s.lineTo(ARCH.x1, HALF_W);
      s.lineTo(ARCH.x1, ARCH.yInner);
      s.lineTo(ARCH.x0, ARCH.yInner);
      s.lineTo(ARCH.x0, HALF_W);
    }
    s.lineTo(REAR_X + r, HALF_W);
    s.quadraticCurveTo(REAR_X, HALF_W, REAR_X, HALF_W - r);
    s.lineTo(REAR_X, -HALF_W + r);
    s.quadraticCurveTo(REAR_X, -HALF_W, REAR_X + r, -HALF_W);
    return s;
  }
  function band(shape: THREE.Shape, z0: number, h: number, mat: THREE.Material = MAT.body) {
    const g = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false, steps: 1 });
    g.translate(0, 0, z0);
    g.rotateX(-Math.PI / 2); // (X, Y, Z) → (X, Z, −Y)
    return mesh(g, mat, shell);
  }
  band(footprint({ notch: true }), 150, 150); // skirt + front wheel arches (both sides)
  band(footprint({ recess: true }), 300, 350); // glow grille zone (Z 300–650)
  band(footprint(), 650, 60); // mid rail
  band(footprint({ recess: true }), 710, 350); // driver view band (dark mesh)
  band(footprint(), 1060, 540); // upper body

  /* cavity backdrops inside the two recesses */
  const cavity = (z0: number, z1: number) => {
    const g = new THREE.BoxGeometry(6, z1 - z0, 2 * 512);
    g.translate(1288, (z0 + z1) / 2, 0);
    return mesh(g, MAT.cavity, shell);
  };
  cavity(306, 644);
  cavity(716, 1054);

  /* view band — dark spaced slats the driver sees through (T023 §3.2 S6) */
  for (let i = 0; i < 7; i++) {
    const g = new THREE.BoxGeometry(14, 15, 2 * 519);
    g.translate(1329, 728 + i * 51, 0);
    mesh(g, MAT.slat, shell);
  }

  /* chromed wire guard over the glow grille — straight off the reference
     photos: dense horizontals, welded vertical supports, mounted in the
     recess mouth. Horizontals at x 1332, verticals proud at 1337. */
  {
    const wireR = 4;
    for (let i = 0; i < 8; i++) {
      const g = new THREE.CylinderGeometry(wireR, wireR, 2 * 516, 10);
      g.rotateX(Math.PI / 2);
      g.translate(1332, 318 + i * 45, 0);
      mesh(g, MAT.wire, shell);
    }
    [-350, 0, 350].forEach((y) => {
      const g = new THREE.CylinderGeometry(wireR, wireR, 344, 10);
      g.translate(1337, 475, -y);
      mesh(g, MAT.wire, shell);
    });
  }

  /* glow panels — piano-hinged at the top edge (T024). Ceramic honeycomb
     face; tilt capped at 0.22 rad so an open panel clears the wire guard
     (1332 − wireR) and the cavity backdrop — no part passes through another. */
  const PANEL_TILT = 0.22;
  interface Panel {
    grp: THREE.Group;
    mat: THREE.MeshStandardMaterial;
    v: number;
    target: number;
  }
  const panels: Panel[] = [];
  function glowPanel(zTop: number) {
    const grp = new THREE.Group();
    grp.position.set(1299, zTop, 0);
    const mat = env(
      new THREE.MeshStandardMaterial({
        map: ceramic,
        color: 0x241a12, // cold: dark-tinted ceramic behind the guard
        roughness: 0.55,
        emissiveMap: ceramic,
        emissive: 0xff6400,
        emissiveIntensity: 0,
      }),
      0.3,
    );
    const g = new THREE.BoxGeometry(10, 95, 2 * 505);
    g.translate(0, -47.5, 0); // hang from the hinge
    const m = new THREE.Mesh(g, mat);
    m.castShadow = m.receiveShadow = true;
    grp.add(m);
    shell.add(grp);
    panels.push({ grp, mat, v: 0, target: 0 });
  }
  glowPanel(644);
  glowPanel(522);
  glowPanel(400); // panel 1 (top) lights first

  /* knobs + nameplate on the skirt dome (T023 §3.4) */
  function surfaceNormal(y: number) {
    const x = frontXAt(y) - P.frontX;
    const n = new THREE.Vector3(x / P.domeDepth ** 2, 0, y / HALF_W ** 2); // spec-plane gradient
    return new THREE.Vector3(n.x, 0, -n.z).normalize(); // world
  }
  function knob(ySpec: number, zSpec: number) {
    const n = surfaceNormal(ySpec);
    const grp = new THREE.Group();
    grp.position.set(frontXAt(ySpec), zSpec, -ySpec);
    grp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(26, 26, 16, 24), MAT.slat);
    base.position.y = 6;
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(20, 22, 18, 24), MAT.bone);
    cap.position.y = 20;
    const pip = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 16), MAT.slat);
    pip.position.set(0, 29, 6);
    [base, cap, pip].forEach((m) => {
      m.castShadow = m.receiveShadow = true;
      grp.add(m);
    });
    shell.add(grp);
  }
  knob(-255, 232);
  knob(-345, 232);

  const plateTex = (() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 148;
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    const draw = () => {
      const g = c.getContext("2d")!;
      g.fillStyle = "#f2e3c0";
      g.fillRect(0, 0, 512, 148);
      g.strokeStyle = "#221910";
      g.lineWidth = 10;
      g.strokeRect(9, 9, 494, 130);
      g.fillStyle = "#221910";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.font = '700 64px "Big Shoulders Display", "Arial Narrow", sans-serif';
      g.fillText("WARM WHEELERS", 256, 78, 460);
      tex.needsUpdate = true;
    };
    draw();
    document.fonts?.ready.then(draw).catch(() => undefined);
    return tex;
  })();
  {
    const mats: THREE.Material[] = Array(6).fill(MAT.slat);
    mats[0] = env(new THREE.MeshStandardMaterial({ map: plateTex, roughness: 0.45 }), 0.5);
    const ySpec = 300;
    const n = surfaceNormal(ySpec);
    const m = new THREE.Mesh(new THREE.BoxGeometry(10, 68, 240), mats);
    m.position.set(frontXAt(ySpec) + 2, 228, -ySpec);
    m.rotation.y = -Math.atan2(n.z, n.x);
    m.castShadow = m.receiveShadow = true;
    shell.add(m);
  }

  /* side details from the reference shells: pressed vertical ribs and the
     recessed carry-handle slot high on each flank */
  [1, -1].forEach((side) => {
    [-300, -100, 100, 300].forEach((x) => {
      const g = new THREE.BoxGeometry(26, 700, 12);
      g.translate(x, 950, -side * 650);
      mesh(g, MAT.body, shell);
    });
    const grip = new THREE.Mesh(new THREE.CapsuleGeometry(38, 120, 6, 14), MAT.cavity);
    grip.rotation.z = Math.PI / 2; // lie along X
    grip.scale.z = 0.22; // squash into a slot
    grip.position.set(-350, 1380, -side * 648);
    grip.castShadow = grip.receiveShadow = true;
    shell.add(grip);
  });

  /* top vent slots near the leading edge — the heater's crown */
  [800, 900, 1000].forEach((x) => {
    [1, -1].forEach((side) => {
      const g = new THREE.BoxGeometry(60, 8, 300);
      g.translate(x, 1601, side * 170);
      mesh(g, MAT.cavity, shell);
    });
  });

  /* ---------- boat-tail: open trough, rect → Ø700 pod (T023 §3.3) ---------- */
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  function tailGeometry() {
    const NU = 40;
    const NS = 72;
    const pos: number[] = [];
    const idx: number[] = [];
    for (let iu = 0; iu <= NU; iu++) {
      const u = iu / NU;
      const s = smooth(u);
      const X = REAR_X - P.boattail * u;
      const a = lerp(HALF_W, 350, s);
      const b = lerp(650, 350, s);
      const c = lerp(950, 650, s);
      const n = lerp(5, 2, s);
      const t0 = lerp(0.21, 0.785, s); // rim cut angle from top
      for (let is = 0; is <= NS; is++) {
        const t = t0 + ((2 * Math.PI - 2 * t0) * is) / NS;
        const sy = Math.sin(t);
        const cz = Math.cos(t);
        const y = a * Math.sign(sy) * Math.abs(sy) ** (2 / n);
        const z = c + b * Math.sign(cz) * Math.abs(cz) ** (2 / n);
        pos.push(X, z, -y);
      }
    }
    for (let iu = 0; iu < NU; iu++)
      for (let is = 0; is < NS; is++) {
        const a0 = iu * (NS + 1) + is;
        const b0 = a0 + NS + 1;
        idx.push(a0, b0, a0 + 1, b0, b0 + 1, a0 + 1);
      }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  {
    const tailMat = MAT.body.clone();
    tailMat.side = THREE.DoubleSide;
    mesh(tailGeometry(), tailMat, shell);

    // rim beading over the raw edge
    const rimPts = (side: number) => {
      const pts: THREE.Vector3[] = [];
      for (let iu = 0; iu <= 40; iu++) {
        const u = iu / 40;
        const s = smooth(u);
        const a = lerp(HALF_W, 350, s);
        const b = lerp(650, 350, s);
        const c = lerp(950, 650, s);
        const n = lerp(5, 2, s);
        const t0 = lerp(0.21, 0.785, s);
        const y = a * Math.abs(Math.sin(t0)) ** (2 / n) * side;
        const z = c + b * Math.abs(Math.cos(t0)) ** (2 / n);
        pts.push(new THREE.Vector3(REAR_X - P.boattail * u, z, -y));
      }
      return pts;
    };
    [1, -1].forEach((side) => {
      const curve = new THREE.CatmullRomCurve3(rimPts(side));
      mesh(new THREE.TubeGeometry(curve, 60, 12, 10), MAT.body, shell);
    });

    // pod end: orange bottle base + steel foot ring + pressed bottle ribs
    const cap = new THREE.Mesh(new THREE.CircleGeometry(342, 48), MAT.orange);
    cap.position.set(TAIL_END + 3, 650, 0);
    cap.rotation.y = -Math.PI / 2;
    cap.castShadow = cap.receiveShadow = true;
    shell.add(cap);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(348, 13, 12, 48), MAT.steel);
    ring.position.set(TAIL_END + 6, 650, 0);
    ring.rotation.y = Math.PI / 2;
    ring.castShadow = true;
    shell.add(ring);
    [150, 250].forEach((r) => {
      const rib = new THREE.Mesh(new THREE.TorusGeometry(r, 6, 10, 40), MAT.orange);
      rib.position.set(TAIL_END - 2, 650, 0);
      rib.rotation.y = Math.PI / 2;
      rib.castShadow = true;
      shell.add(rib);
    });
  }

  /* ============================================================
     RUNNING GEAR — not sheared (wheels stay vertical)
     ============================================================ */
  function wheel(x: number, ySpec: number) {
    const grp = new THREE.Group();
    grp.position.set(x, P.axleZ, -ySpec);
    const R = P.wheelDia / 2;
    const tyre = new THREE.Mesh(new THREE.TorusGeometry(R - 31, 31, 22, 40), MAT.tyre);
    tyre.scale.z = P.wheelW / 62;
    const tread = new THREE.Mesh(new THREE.TorusGeometry(R - 4, 7, 8, 48), MAT.tyreRib);
    // spoked steel rim — the Rybro barrow-wheel read
    const rimRing = new THREE.Mesh(new THREE.TorusGeometry(66, 10, 10, 28), MAT.rim);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(26, 26, P.wheelW * 0.78, 20), MAT.hub);
    hub.rotation.x = Math.PI / 2;
    const parts: THREE.Mesh[] = [tyre, tread, rimRing, hub];
    for (let i = 0; i < 5; i++) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(52, 16, 12), MAT.rim);
      const a = (i / 5) * Math.PI * 2;
      spoke.position.set(Math.cos(a) * 46, Math.sin(a) * 46, 0);
      spoke.rotation.z = a;
      parts.push(spoke);
    }
    parts.forEach((m) => {
      m.castShadow = m.receiveShadow = true;
      grp.add(m);
    });
    root.add(grp);
  }
  wheel(P.wheelbase / 2, 600);
  wheel(P.wheelbase / 2, -600); // steered front pair
  wheel(-P.wheelbase / 2, 545);
  wheel(-P.wheelbase / 2, 655); // rear duals, 25 mm gap
  wheel(-P.wheelbase / 2, -545);
  wheel(-P.wheelbase / 2, -655);

  /* axles, steering, brakes — visible in the 150 mm gap and the arches */
  function tube(x: number, z: number, halfSpan: number, r: number) {
    const g = new THREE.CylinderGeometry(r, r, halfSpan * 2, 16);
    g.rotateX(Math.PI / 2);
    g.translate(x, z, 0);
    return mesh(g, MAT.steel);
  }
  tube(P.wheelbase / 2, P.axleZ, 580, 17); // front beam axle
  tube(P.wheelbase / 2 - 80, 96, 555, 8); // tie rod
  tube(-P.wheelbase / 2, P.axleZ, 690, 15); // rear axle
  [470, -470].forEach((y) => {
    // brake discs + calipers (T022)
    const d = new THREE.Mesh(new THREE.CylinderGeometry(90, 90, 8, 32), MAT.disc);
    d.rotation.x = Math.PI / 2;
    d.position.set(-P.wheelbase / 2, P.axleZ, -y);
    d.castShadow = true;
    root.add(d);
    const c = new THREE.Mesh(new THREE.BoxGeometry(60, 52, 30), MAT.slat);
    c.position.set(-P.wheelbase / 2 + 40, P.axleZ + 55, -y);
    c.castShadow = true;
    root.add(c);
  });
  [600, -600].forEach((y) => {
    // kingpin uprights
    const k = new THREE.Mesh(new THREE.CylinderGeometry(13, 13, 110, 12), MAT.steel);
    k.position.set(P.wheelbase / 2, P.axleZ + 20, -y * 0.97);
    k.castShadow = true;
    root.add(k);
  });

  /* chassis per the T020 stack: longeron underside at 150, 30 mm tube,
     12 mm ply on top → deck top at 192 (deck_top_z) */
  [180, -180].forEach((y) => {
    const r = new THREE.Mesh(new THREE.BoxGeometry(2050, 30, 30), MAT.steel);
    r.position.set(25, 165, -y);
    r.castShadow = true;
    root.add(r);
  });
  {
    const deck = new THREE.Mesh(new THREE.BoxGeometry(1900, 12, 1080), MAT.ply);
    deck.position.set(50, 186, 0);
    deck.castShadow = deck.receiveShadow = true;
    root.add(deck);
  }

  /* ============================================================
     COCKPIT — roll hoop, seat, steering, driver-as-bottle (T020/T021/T025)
     ============================================================ */
  {
    const hoopX = -825;
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(325, 17, 12, 40, Math.PI), MAT.steel);
    hoop.position.set(hoopX, 825, 0);
    hoop.rotation.y = Math.PI / 2;
    hoop.castShadow = true;
    root.add(hoop);
    [325, -325].forEach((y) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(17, 17, 505, 12), MAT.steel);
      leg.position.set(hoopX, 572, -y);
      leg.castShadow = true;
      root.add(leg);
    });
    (
      [
        [280, 120],
        [-280, -120],
      ] as const
    ).forEach(([y0, y1]) => {
      // rear braces to the pod floor
      strut(V(hoopX, y0, 900), V(-1080, y1, 340), 11, MAT.steel);
    });

    // cockpit floor + seat tub
    const floor = new THREE.Mesh(new THREE.BoxGeometry(520, 14, 520), MAT.ply);
    floor.position.set(-580, 309, 0);
    floor.receiveShadow = true;
    root.add(floor);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(380, 250, 420), MAT.seat);
    seat.position.set(-680, 442, 0);
    seat.castShadow = seat.receiveShadow = true;
    root.add(seat);

    /* steering — wheel + raked column disappearing through the deck to the
       pitman below (T021); drag link visible in the clearance gap */
    const wheelCtr = V(-260, 0, 560);
    const colDir = wheelCtr.clone().sub(V(-20, 0, 196)).normalize();
    strut(V(-20, 0, 196), wheelCtr, 13, MAT.steel);
    const sw = new THREE.Mesh(new THREE.TorusGeometry(130, 15, 12, 32), MAT.seat);
    sw.position.copy(wheelCtr);
    sw.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), colDir);
    sw.castShadow = sw.receiveShadow = true;
    root.add(sw);
    for (let i = 0; i < 3; i++) {
      // cylinder axis (local Y) already lies in the wheel plane after copying
      // the wheel's quaternion; spinning about local Z fans the spokes out
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 240, 8), MAT.steel);
      spoke.quaternion.copy(sw.quaternion);
      spoke.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 6 + (i / 3) * Math.PI);
      spoke.position.copy(wheelCtr);
      spoke.castShadow = true;
      root.add(spoke);
    }
    strut(V(-20, 120, 135), V(790, 120, 135), 8, MAT.steel); // drag link under the deck

    /* glow lever at the driver's right hand (T024) — clear of the column */
    const leverTop = V(-505, -262, 555);
    strut(V(-520, -270, 320), leverTop, 9, MAT.steel);
    const leverKnob = new THREE.Mesh(new THREE.SphereGeometry(22, 16, 12), MAT.orange);
    leverKnob.position.copy(leverTop);
    leverKnob.castShadow = true;
    root.add(leverKnob);

    /* the driver IS the fuel: orange bottle torso, valve-cap helmet (T025).
       Helmet top at 1045 ≈ head_top_z, 105 mm under the 1150 hoop apex. */
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(190, 300, 8, 24), MAT.suit);
    torso.position.set(-600, 640, 0);
    torso.rotation.z = 0.42;
    torso.castShadow = torso.receiveShadow = true;
    root.add(torso);
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(145, 32, 20), MAT.orange);
    helmet.position.set(-780, 900, 0);
    helmet.castShadow = true;
    root.add(helmet);
    const visor = new THREE.Mesh(
      new THREE.SphereGeometry(148, 24, 12, Math.PI - 0.62, 1.24, 1.02, 0.78),
      MAT.visor,
    );
    visor.position.copy(helmet.position);
    root.add(visor);
    const valve = new THREE.Mesh(new THREE.CylinderGeometry(42, 48, 40, 16), MAT.bone);
    valve.position.set(-780, 1063, 0);
    valve.castShadow = true;
    root.add(valve);

    // arms: left hand on the wheel rim, right hand on the glow lever
    strut(V(-640, 165, 770), V(-300, 95, 600), 36, MAT.suit, root, true);
    strut(V(-640, -165, 770), V(-510, -250, 570), 36, MAT.suit, root, true);
    // legs feet-forward under the wheel; gloves + boots
    strut(V(-480, 90, 420), V(560, 110, 235), 40, MAT.suit, root, true);
    strut(V(-480, -90, 420), V(560, -110, 235), 40, MAT.suit, root, true);
    (
      [
        [-300, 95, 600],
        [-510, -250, 570],
      ] as const
    ).forEach(([x, y, z]) => {
      const glove = new THREE.Mesh(new THREE.SphereGeometry(44, 14, 10), MAT.seat);
      glove.position.copy(V(x, y, z));
      glove.castShadow = true;
      root.add(glove);
    });
    [110, -110].forEach((y) => {
      const boot = new THREE.Mesh(new THREE.BoxGeometry(150, 90, 84), MAT.seat);
      boot.position.copy(V(600, y, 238));
      boot.castShadow = boot.receiveShadow = true;
      root.add(boot);
    });
  }

  /* ============================================================
     Animation + handles
     ============================================================ */
  // wall-clock tween so low frame rates / tab switches can't stall the camera
  let tween: { from: THREE.Vector3; to: THREE.Vector3; t0: number } | null = null;
  const TWEEN_MS = 900;
  const clock = new THREE.Clock();
  const DARK = new THREE.Color(0x241a12);
  const LIT = new THREE.Color(0xfff6ee);
  let firstFrame = true;
  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    let glowSum = 0;
    panels.forEach((p, i) => {
      const rate = reduceMotion ? 1 : Math.min(1, dt * 5.5);
      p.v += (p.target - p.v) * rate;
      p.grp.rotation.z = p.v * PANEL_TILT; // louvre tilt, capped clear of the guard
      // radiant shimmer, not a steady lamp
      p.mat.emissiveIntensity = p.v * (2.6 + (reduceMotion ? 0 : 0.22 * Math.sin(t * 9 + i * 2.1)));
      p.mat.color.lerpColors(DARK, LIT, p.v);
      glowSum += p.v;
    });
    glowLight.intensity = glowSum * (7 + (reduceMotion ? 0 : 0.6 * Math.sin(t * 11)));
    if (tween) {
      const k = Math.min(1, (performance.now() - tween.t0) / TWEEN_MS);
      const e = 1 - Math.pow(1 - k, 3);
      camera.position.lerpVectors(tween.from, tween.to, e);
      if (k >= 1) tween = null;
    }
    controls.update();
    renderer.render(scene, camera);
    if (firstFrame) {
      firstFrame = false;
      onReady?.();
    }
  });

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  if (import.meta.env.DEV || new URLSearchParams(location.search).has("debug")) {
    Object.assign(window as object, { __ww: { camera, controls, renderer } });
  }

  return {
    setStage(n: number) {
      panels.forEach((p, i) => {
        p.target = i < n ? 1 : 0;
      });
    },
    setView(name: ViewName) {
      controls.autoRotate = false;
      const to = VIEWS[name];
      if (reduceMotion) {
        camera.position.copy(to);
        return;
      }
      tween = { from: camera.position.clone(), to: to.clone(), t0: performance.now() };
    },
    stopAutoRotate: stopRotate,
    dispose() {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", stopRotate);
      controls.dispose();
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const mats: THREE.Material[] = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => {
            const anyM = m as THREE.MeshStandardMaterial;
            anyM.map?.dispose();
            anyM.emissiveMap?.dispose();
            anyM.roughnessMap?.dispose();
            m.dispose();
          });
        }
      });
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
