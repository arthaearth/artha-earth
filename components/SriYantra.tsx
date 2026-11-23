/**
 * Шрі-янтра: класична геометрія.
 *
 * Дев'ять переплетених трикутників (4 вгору — Шива, 5 вниз — Шакті) задані
 * координатами «Type III» (жорстка побудова, див. Soundarya Lahari, вірш 11),
 * джерело координат: @vibzart/sri-yantra (MIT) / TeXample.net.
 * Координати в просторі 300×300, центр (150,150), радіус описаного кола 100.
 *
 * Далі назовні: бінду → 9 трикутників → коло → 8 пелюсток → коло →
 * 16 пелюсток → коло → бгупура (три квадрати з чотирма брамами).
 */

// [лівий x, y основи, y вершини, правий x]
const TRIANGLES: [number, number, number, number][] = [
  [53.65669559977147, 123.20508075688774, 250, 246.34330440022853], // D1 ▽
  [52.984011026495736, 174.24660560764943, 50, 247.01598897350425], // U1 △
  [98.71823312733801, 220.03828947357886, 123.20508075688774, 201.281766872662], // U3 △
  [78.26467997914015, 197.92315674002487, 78.10499177949904, 221.73532002085986], // U2 △
  [90.4856922951427, 78.10499177949904, 160.66014976539617, 209.51430770485734], // D3 ▽
  [80.98384838952128, 103.12199145016105, 220.03828947357886, 219.0161516104787], // D2 ▽
  [114.9488500600036, 160.66014976539617, 103.12199145016105, 185.0511499399964], // U4 △
  [116.35142605010424, 134.30757626706648, 197.92315674002487, 183.64857394989576], // D4 ▽
  [124.61190803072795, 144.79777263138968, 174.24660560764943, 175.38809196927207], // D5 ▽
];

// Робоча система: координати зображення 1254×1254, центр янтри (CX, CY).
const CX = 626;
const CY = 608;
const R1 = 190; // коло, що описує трикутники
const R2 = 247; // кінчики 8 пелюсток = основа 16 пелюсток
const R3 = 292; // кінчики 16 пелюсток
const S = R1 / 100;

const f = (n: number) => n.toFixed(2);
const px = (x: number) => CX + (x - 150) * S;
const py = (y: number) => CY + (y - 150) * S;

function trianglePath([l, yb, yt, r]: [number, number, number, number]) {
  const m = (l + r) / 2;
  return `M${f(px(l))} ${f(py(yb))}L${f(px(r))} ${f(py(yb))}L${f(px(m))} ${f(py(yt))}Z`;
}

/** Одна пелюстка: основа на колі r0 (півширина w радіан), кінчик на колі r1, вісь — кут a. */
function petalPath(a: number, w: number, r0: number, r1: number) {
  const pt = (rad: number, lat: number) => {
    // локальні координати (rad — вздовж осі, lat — убік) → глобальні
    const x = rad * Math.cos(a) - lat * Math.sin(a);
    const y = rad * Math.sin(a) + lat * Math.cos(a);
    return `${f(CX + x)} ${f(CY + y)}`;
  };
  const bx = r0 * Math.cos(w);
  const by = r0 * Math.sin(w);
  const L = r1 - bx;
  // два дзеркальні вигини: опуклий біля основи, увігнутий біля кінчика
  const c1 = (sign: 1 | -1) => pt(bx + L * 0.30, sign * by * 1.22);
  const c2 = (sign: 1 | -1) => pt(r1 - L * 0.16, sign * by * 0.34);
  return (
    `M${pt(bx, by)}C${c1(1)} ${c2(1)} ${pt(r1, 0)}` +
    `C${c2(-1)} ${c1(-1)} ${pt(bx, -by)}`
  );
}

function lotus(count: number, r0: number, r1: number, phase = 0) {
  const step = (2 * Math.PI) / count;
  const w = step / 2;
  let d = "";
  for (let i = 0; i < count; i++) {
    const a = phase + i * step - Math.PI / 2;
    d += petalPath(a, w, r0, r1);
  }
  return d;
}

/** Бгупура: квадрат з половиною сторони h і брамою (напівширина g, виступ p) на кожній стороні. */
function bhupura(h: number, g: number, p: number) {
  const side = `M${-h} ${-h}H${-g}V${-h - p}H${g}V${-h}H${h}`;
  return [0, 90, 180, 270]
    .map(
      (deg) =>
        `<path transform="translate(${CX} ${CY}) rotate(${deg})" d="${side}"/>`,
    )
    .join("");
}

const BHUPURA = [
  { h: 318, g: 44, p: 36 },
  { h: 336, g: 52, p: 36 },
  { h: 354, g: 60, p: 36 },
]
  .map(({ h, g, p }) => bhupura(h, g, p))
  .join("");

const PATHS = {
  triangles: TRIANGLES.map(trianglePath).join(""),
  petals8: lotus(8, R1, R2),
  petals16: lotus(16, R2, R3),
};

export default function SriYantra() {
  return (
    <svg
      className="yantra__svg"
      viewBox="0 0 1254 1254"
      role="img"
      aria-label="Шрі-янтра"
      fill="none"
      stroke="url(#yantra-gold)"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <defs>
        <linearGradient id="yantra-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6dc9c" />
          <stop offset="0.5" stopColor="#d4a03c" />
          <stop offset="1" stopColor="#a9792a" />
          {/* повільний «перелив» золота */}
          <animateTransform
            attributeName="gradientTransform"
            type="rotate"
            from="0 0.5 0.5"
            to="360 0.5 0.5"
            dur="48s"
            repeatCount="indefinite"
          />
        </linearGradient>
        {/* ніжний рельєф: світлий блік зверху-ліворуч + м'яка тінь знизу-праворуч */}
        <filter
          id="yantra-emboss"
          filterUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="1254"
          height="1254"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.6" result="blur" />
          <feSpecularLighting
            in="blur"
            surfaceScale="3.2"
            specularConstant="0.85"
            specularExponent="18"
            lightingColor="#fff1c9"
            result="spec"
          >
            <feDistantLight azimuth="235" elevation="50" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="hi" />
          <feOffset in="SourceAlpha" dx="2.2" dy="2.8" result="off" />
          <feGaussianBlur in="off" stdDeviation="2.4" result="softOff" />
          <feFlood floodColor="#06120b" floodOpacity="0.55" />
          <feComposite in2="softOff" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="hi" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#yantra-emboss)">
      <g strokeWidth="4">
        <circle cx={CX} cy={CY} r={R1} />
        <circle cx={CX} cy={CY} r={R2} />
        <circle cx={CX} cy={CY} r={R3} />
        <path d={PATHS.petals8} />
        <path d={PATHS.petals16} />
        <g dangerouslySetInnerHTML={{ __html: BHUPURA }} />
      </g>
      <path d={PATHS.triangles} strokeWidth="3.4" />
      <circle
        cx={CX}
        cy={CY}
        r="5.5"
        fill="url(#yantra-gold)"
        stroke="none"
      />
      </g>
    </svg>
  );
}
