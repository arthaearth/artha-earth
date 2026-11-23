// Дрібні світлові пилинки, що повільно здіймаються вгору (чиста CSS-анімація).
const COUNT = 30;

function rand(i: number, k: number) {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const DOTS = Array.from({ length: COUNT }, (_, i) => ({
  left: 8 + rand(i, 1) * 90,
  top: 20 + rand(i, 2) * 70,
  size: 1.5 + rand(i, 3) * 3,
  dur: 14 + rand(i, 4) * 16,
  delay: -rand(i, 5) * 30,
  drift: (rand(i, 6) - 0.5) * 60,
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
              "--drift": `${d.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
