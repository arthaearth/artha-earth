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
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // меню закривається по Esc і при переході на широкий екран; фон не прокручується, поки меню відкрите
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 1100 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);
  const langs = (cls: string) => (
    <div className={cls} role="group" aria-label="Мова">
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
  );

  return (
    <header className={"header" + (scrolled ? " is-scrolled" : "") + (open ? " is-open" : "")}>
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
        {langs("lang lang--header")}
        <a href="#contacts" className="btn-outline btn-outline--sm">
          Записатися
        </a>
        <button
          type="button"
          className="burger"
          aria-label={open ? "Закрити меню" : "Відкрити меню"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div id="mobile-menu" className="mobile-menu" aria-hidden={!open}>
        <nav aria-label="Мобільне меню">
          {NAV.map((i) => (
            <a key={i.href} href={i.href} onClick={close} tabIndex={open ? 0 : -1}>
              {i.label}
            </a>
          ))}
        </nav>
        {langs("lang lang--panel")}
        <a href="#contacts" className="btn-gold mobile-menu__cta" onClick={close} tabIndex={open ? 0 : -1}>
          Записатися на консультацію
        </a>
      </div>
    </header>
  );
}
