// Логарифмічна спіраль, що замінює «&» у логотипі.
const TURNS = 2.4;
const STEPS = 120;

function buildPath() {
  const pts: string[] = [];
  const maxTheta = TURNS * 2 * Math.PI;
  for (let i = 0; i <= STEPS; i++) {
    const t = (i / STEPS) * maxTheta;
    const r = 0.6 + 10.4 * (t / maxTheta) ** 1.15;
    const x = 12 + r * Math.cos(t - Math.PI / 2);
    const y = 12 + r * Math.sin(t - Math.PI / 2);
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
      width="22"
      height="22"
      role="img"
      aria-label="&"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATH} />
    </svg>
  );
}
