import Image from "next/image";
import SriYantra from "./SriYantra";
import GoldDust from "./GoldDust";

const DIRECTIONS = ["Джйотіш", "Нумерологія", "Васту", "Аюрведа"];

export default function Hero() {
  return (
    <section className="hero">
      {/* фільтри «течії» для золотої димки: шум повільно змінюється й зміщує піксели */}
      <svg width="0" height="0" className="fx-defs" aria-hidden focusable="false">
        <filter id="smoke-warp-a" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0055 0.0085" numOctaves="2" seed="4" result="n">
            <animate attributeName="baseFrequency" dur="104s" repeatCount="indefinite" values="0.0055 0.0085;0.0085 0.0062;0.0058 0.0098;0.0055 0.0085" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="34" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="smoke-warp-b" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0075 0.005" numOctaves="2" seed="11" result="n">
            <animate attributeName="baseFrequency" dur="134s" repeatCount="indefinite" values="0.0075 0.005;0.005 0.0092;0.0092 0.0058;0.0075 0.005" />
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
      <div className="hero__yantra">
        {/* золотий туман кружляє навколо нерухомої янтри: два шари у протилежні боки */}
        <div className="yantra__orbit yantra__orbit--1" aria-hidden>
          <Image
            src="/images/yantra-glow-clean.png"
            alt=""
            fill
            sizes="570px"
            priority
            className="yantra__glow"
          />
        </div>
        <div className="yantra__orbit yantra__orbit--2" aria-hidden>
          <Image
            src="/images/yantra-glow-clean.png"
            alt=""
            fill
            sizes="570px"
            className="yantra__glow yantra__glow--2"
          />
        </div>
        <SriYantra />
        <div className="yantra__light" aria-hidden />
      </div>
      <GoldDust />

      <div className="hero__content">
        <p className="eyebrow">Давні ведичні знання для сучасного життя</p>
        <h1 className="title">«Сила в спокої»</h1>
        <p className="lead">
          Пізнайте свою природу. Відкрийте власні ресурси. Знайдіть внутрішню
          опору та ясність у прийнятті важливих життєвих рішень.
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
