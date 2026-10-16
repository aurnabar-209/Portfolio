# Ameer Sohail Aurnab — Portfolio

A single-page portfolio built with plain HTML, CSS, and JavaScript — no build step,
no framework, no `npm install`. That means you can deploy it by just pushing these
files to GitHub, and it loads fast because there's nothing to bundle.

## Files

- `index.html` — page structure and content
- `style.css` — design system (colors, type, glassmorphism, animations)
- `script.js` — cursor, particle background, typewriter, scroll reveals, project/skill data
- `resume.pdf` — **placeholder, replace with your real resume PDF**

## Deploy to GitHub Pages (free)

1. Create a new repository on GitHub named **exactly**: `aurnabar-209.github.io`
2. Push these files to the `main` branch (root of the repo, not a subfolder):
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/aurnabar-209/aurnabar-209.github.io.git
   git push -u origin main
   ```
3. Wait 1–2 minutes. Your site is live at **https://aurnabar-209.github.io**
   (Settings → Pages should already show it as active for a `username.github.io` repo —
   no extra configuration needed.)

## Things to edit before you publish

- [ ] Replace `resume.pdf` with your actual resume.
- [ ] In `index.html`, swap the Formspree placeholder
      (`action="https://formspree.io/f/YOUR_FORM_ID"`) for your own free endpoint from
      [formspree.io](https://formspree.io) — otherwise the contact form just shows a
      reminder instead of sending.
- [ ] In `script.js`, update `projectData` with your **real GitHub repo URLs**
      (right now they're guesses based on your project names — rename your repos to
      match, or update the `href` values).
- [ ] In `script.js`, fill in `certData` with any real certificates — the section
      shows a clean empty state until you do.
- [ ] Double check the Education/Experience/Research copy in `index.html` still
      matches your latest details (defense outcome, final thesis metrics, etc.).

## Design notes

- Dark-mode only, Apple/Linear-inspired glassmorphism.
- The background particle network in the hero and the small waveform in the
  Research section are both a deliberate nod to your EEG/seizure-detection thesis —
  not generic decoration.
- Respects `prefers-reduced-motion` and disables the custom cursor on touch devices.
- No external JS frameworks — just vanilla JS, so Lighthouse performance stays high.
  If you'd rather have the full Next.js + TypeScript + Tailwind + Framer Motion +
  Three.js stack from your original spec, that's a bigger, separate build — say the
  word and I'll scaffold it.
