// Спіраль, що замінює «&» у логотипі: розкручується від центру
// й закінчується у верхньому правому куті.
const TURNS = 2.1;
const STEPS = 140;
const END_ANGLE = -Math.PI / 4; // кут «вгору-вправо»
const R_START = 0.4;
const R_END = 10.5;

function buildPath() {
  const total = TURNS * 2 * Math.PI;
  const pts: string[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const k = i / STEPS;
    const phi = END_ANGLE - (1 - k) * total;
    const r = R_START + (R_END - R_START) * k;
    const x = 12 + r * Math.cos(phi);
    const y = 12 + r * Math.sin(phi);
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return pts.join(" ");
}

const PATH = buildPath();

export default function Spiral() {
  return (
    <svg
      className="logo__spiral"
      viewBox="0 0 24 24"
      role="img"
      aria-label="&"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d={PATH} />
    </svg>
  );
}
