# Harsh Srivastava – Portfolio (v2)

A dark, motion-rich portfolio: starfield background, floating glass navbar, a portrait with a
"hover to scan" face-mesh effect, animated project covers, a 3D carousel, auto-advancing journey
tabs, skill marquees, a physics toolkit you can throw around, an FAQ that plays like a chat, and an
approve-before-send contact form.

Built with React 18, Vite, Tailwind CSS, Framer Motion, Lenis and Matter.js.

## Edit your content
Everything lives in **`src/data/profile.js`**. Search it for `[PLACEHOLDER]`.

| What | Field |
| --- | --- |
| Booking link for every "Book a call" button | `calendlyUrl` (empty = opens email) |
| Contact form | `formspreeId` (empty = opens the visitor's email app) |
| Project screenshots / GIFs | `image: 'file.webp'` on each project, file in `/public` |
| Live demo links | `demo` on each project |
| Internships | `experience: []` (same shape as `journey`) |
| Testimonials (section hidden while empty) | `testimonials: []` |
| FAQ answers (empty answers are skipped) | `faqs` |
| Portrait / résumé | replace `public/harsh.webp` / `public/resume.pdf` |
| Toolkit icons | `src/data/icons.js` |

After deploying, replace `YOUR-DOMAIN.example` in `index.html`, `public/robots.txt` and `public/sitemap.xml`.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
```
If npm warns about esbuild install scripts: `npm install-scripts approve esbuild` then `npm rebuild esbuild`.

## Deploy (free)
- **Vercel:** import the GitHub repo. It detects Vite automatically.
- **Netlify:** build command `npm run build`, publish directory `dist`.
- **GitHub Pages:** push to `main`, then Settings → Pages → Source: GitHub Actions (workflow included).

## Easter egg
Type `/critic` anywhere on the page.
