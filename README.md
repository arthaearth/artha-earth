# Artha & Earth

Сайт-портфоліо: консультації з Джйотіш, ведичної нумерології, Васту та Аюрведи.

- Стек: Next.js 15 (App Router) + TypeScript, звичайний CSS, шрифти через `@fontsource`.
- План сайту (тиждень 1): [`docs/Artha-Earth-plan-week1.docx`](docs/Artha-Earth-plan-week1.docx)
- Зараз реалізовано: перший екран головної сторінки (з Figma).

## Запуск

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

Деплой: Vercel (імпорт цього репозиторію, налаштування за замовчуванням).

## Шрі-янтра

Янтра в першому екрані намальована векторно (`components/SriYantra.tsx`), а не взята з растра.
Координати дев'яти трикутників — «Type III» (жорстка побудова): джерело
[`@vibzart/sri-yantra`](https://github.com/vibzart/sri-yantra) (MIT) / TeXample.net.
Оригінальне растрове зображення з Figma збережено в `docs/source-art/`; у `public/images/yantra-glow-clean.png` лишилась лише світна димка без золотих ліній.
