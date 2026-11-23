// Золоті світні частинки, що пливуть екраном у різні боки (чиста CSS-анімація).
const COUNT = 64;

function rand(i: number, k: number) {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const DOTS = Array.from({ length: COUNT }, (_, i) => ({
  left: 2 + rand(i, 1) * 96,
  top: 8 + rand(i, 2) * 84,
  size: 2 + rand(i, 3) * 4.5,
  dur: 26 + rand(i, 4) * 34,
  delay: -rand(i, 5) * 60,
  dx: (rand(i, 6) - 0.4) * 460,
  dy: (rand(i, 7) - 0.75) * 380,
  wob: (rand(i, 8) - 0.5) * 120,
}));

export default function Particles() {
  return (
    <div className="particles" aria-hidden>
      {DOTS.map((d, i) => (
        <span
          key={i}
          style={
            {
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              animationDuration: `${d.dur}s`,
              animationDelay: `${d.delay}s`,
              "--dx": `${d.dx}px`,
              "--dy": `${d.dy}px`,
              "--wob": `${d.wob}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
