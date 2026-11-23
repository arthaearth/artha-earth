import Image from "next/image";
import Spiral from "./Spiral";
import SriYantra from "./SriYantra";
import Particles from "./Particles";
import HeroFX from "./HeroFX";

const NAV = [
  { href: "#about", label: "Про мене" },
  { href: "#services", label: "Консультації" },
  { href: "#approach", label: "Мій підхід" },
  { href: "#contacts", label: "Контакти" },
];

const LANGS = ["UA", "RU", "EN"];
const DIRECTIONS = ["Джйотіш", "Нумерологія", "Васту", "Аюрведа"];

export default function Hero() {
  return (
    <section className="hero">
      {/* фільтри «течії» для золотої димки: шум повільно змінюється й зміщує піксели */}
      <svg width="0" height="0" className="fx-defs" aria-hidden focusable="false">
        <filter id="smoke-warp-a" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0055 0.0085" numOctaves="2" seed="4" result="n">
            <animate attributeName="baseFrequency" dur="47s" repeatCount="indefinite" values="0.0055 0.0085;0.0085 0.0062;0.0058 0.0098;0.0055 0.0085" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="34" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="smoke-warp-b" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0075 0.005" numOctaves="2" seed="11" result="n">
            <animate attributeName="baseFrequency" dur="61s" repeatCount="indefinite" values="0.0075 0.005;0.005 0.0092;0.0092 0.0058;0.0075 0.005" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="42" xChannelSelector="G" yChannelSelector="R" />
        </filter>
      </svg>
      <Image
        src="/images/hero-forest.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero__bg"
      />
      <div className="hero__overlay" />
      <div className="mist mist--far" aria-hidden />
      <Image
        src="/images/light-rays.png"
        alt=""
        width={1254}
        height={1254}
        className="hero__rays"
        priority
      />
      <Image
        src="/images/light-rays.png"
        alt=""
        width={1254}
        height={1254}
        className="hero__rays hero__rays--2"
        aria-hidden
      />
      <Image
        src="/images/light-rays.png"
        alt=""
        width={1254}
        height={1254}
        className="hero__rays hero__rays--3"
        aria-hidden
      />
      <div className="mist mist--near" aria-hidden />
      <div className="hero__yantra">
        <Image
          src="/images/yantra-glow-clean.png"
          alt=""
          fill
          sizes="570px"
          priority
          className="yantra__glow"
        />
        <Image
          src="/images/yantra-glow-clean.png"
          alt=""
          fill
          sizes="570px"
          className="yantra__glow yantra__glow--2"
          aria-hidden
        />
        <SriYantra />
        <div className="yantra__light" aria-hidden />
      </div>
      <Particles />
      <HeroFX />

      <header className="header">
        <a href="#top" className="logo">
          <span className="logo__name">
            ARTHA{" "}
            <Spiral />
            {" "}EARTH
          </span>
          <span className="logo__tag">VEDIC KNOWLEDGE</span>
        </a>
        <nav className="nav" aria-label="Головне меню">
          {NAV.map((i) => (
            <a key={i.href} href={i.href}>
              {i.label}
            </a>
          ))}
        </nav>
        <div className="header__right">
          <div className="lang" role="group" aria-label="Мова">
            {LANGS.map((l, idx) => (
              <button
                key={l}
                type="button"
                className={idx === 0 ? "lang__btn is-active" : "lang__btn"}
                aria-pressed={idx === 0}
              >
                {l}
              </button>
            ))}
          </div>
          <a href="#contacts" className="btn-outline btn-outline--sm">
            Записатися
          </a>
        </div>
      </header>

      <div className="hero__content">
        <p className="eyebrow">Давні ведичні знання для сучасного життя</p>
        <h1 className="title">«Сила в спокої»</h1>
        <p className="lead">
          Пізнайте свою природу, знайдіть внутрішню опору та навчіться робити
          усвідомлений вибір завдяки давнім ведичним знанням.
        </p>
        <p className="sub">
          Індивідуальні консультації з Астрології (Джйотіш), ведичної
          нумерології, Васту та Аюрведи.
        </p>
        <p className="quote">Не просто практикувати йогу. Жити в йозі.</p>
        <div className="actions">
          <a href="#contacts" className="btn-gold">
            Записатися на консультацію
            <Image src="/images/arrow.svg" alt="" width={18} height={18} />
          </a>
          <a href="#approach" className="btn-outline">
            Мій підхід
          </a>
        </div>
      </div>

      <footer className="strip">
        <span className="strip__years">Понад 10 років вивчення ведичних наук</span>
        <ul className="strip__list">
          {DIRECTIONS.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <a href="#services" className="strip__scroll">
          Гортати вниз <span aria-hidden>↓</span>
        </a>
      </footer>
    </section>
  );
}
