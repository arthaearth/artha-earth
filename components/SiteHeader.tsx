"use client";

import { useEffect, useState } from "react";
import Spiral from "./Spiral";

const NAV = [
  { href: "#about", label: "Про мене" },
  { href: "#services", label: "Консультації" },
  { href: "#approach", label: "Мій підхід" },
  { href: "#contacts", label: "Контакти" },
];
const LANGS = ["UA", "RU", "EN"];

/** Верхнє меню: при прокручуванні закріплюється й отримує напівпрозорий розмитий фон. */
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={scrolled ? "header is-scrolled" : "header"}>
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
  );
}
