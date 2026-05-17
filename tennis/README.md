# Tennis & Padel Schedule

Kleine front-end demo die wedstrijden uit `schema.txt` laadt, toont in een tabel, en filtert op tennis/padel.

**Live (Firebase Hosting):** [https://tennisschema.web.app](https://tennisschema.web.app)

## Bestanden

- `index.html` - pagina en styling
- `schema-editor.html` - beheerpagina voor `schema.txt` (laden, bewerken, downloaden)
- `code.ts` / `code.js` - TypeScript broncode en gegenereerde JS voor de planning
- `schema-editor.ts` / `schema-editor.js` - idem voor de editor
- `schema.txt` - data (CSV-achtig formaat)
- `firebase.json`, `.firebaserc` - Firebase Hosting configuratie

## Vereisten

- Node.js (voor `npx tsc` en `npm run build`)
- Python 3 (optioneel, voor lokale HTTP-server)
- [Firebase CLI](https://firebase.google.com/docs/cli) (`npm install -g firebase-tools`) voor deploy

## Snel starten (lokaal)

In `tennis/`:

```bash
npm run build
npm run serve
```

Vanaf de project-root:

```bash
npm --prefix tennis run build
npm --prefix tennis run serve
```

Open daarna (server draait in `tennis/`):

- [http://localhost:5500/index.html](http://localhost:5500/index.html) — planning
- [http://localhost:5500/schema-editor.html](http://localhost:5500/schema-editor.html) — `schema.txt` bewerken

`fetch("schema.txt")` werkt alleen via HTTP, niet via `file://`.

## TypeScript compileren

```bash
npm run build
```

Compileert `code.ts` → `code.js` en `schema-editor.ts` → `schema-editor.js`.

Bewerk bij voorkeur de `.ts`-bestanden; `npm run build` overschrijft de `.js`-bestanden.

## schema.txt beheren

1. Open `schema-editor.html` (lokaal of op Firebase: `/schema-editor.html`).
2. Bewerk de tekst, gebruik **Download schema.txt**.
3. Vervang `tennis/schema.txt` in dit project.
4. Deploy naar Firebase (zie hieronder) en/of commit naar GitHub.

De editor staat niet meer gelinkt vanaf `index.html`, maar de pagina blijft bereikbaar via de URL.

## Firebase Hosting (gratis Spark-plan)

### Eerste keer opzetten

```bash
firebase login
cd tennis
firebase init hosting
```

Aanbevolen keuzes:

| Vraag | Antwoord |
|--------|----------|
| Project | Bestaand project (bijv. `tennisschema-…`) |
| Public directory | **`.`** (huidige map, niet `public`) |
| Single-page app | **No** |
| GitHub auto-deploy | **No** |
| Overwrite `index.html` | **No** |

In `firebase.json` hoort `"public": "."` te staan, zodat `index.html`, `code.js` en `schema.txt` uit deze map worden gehost (niet de standaard Firebase-welkomstpagina in `public/`).

### Live zetten na wijzigingen

```bash
cd tennis
npm run build          # alleen nodig na wijzigingen in .ts
firebase deploy
```

Daarna in de browser **hard refresh** (`Ctrl+F5`), anders zie je soms nog oude `code.js` of `schema.txt` door cache.

### Controleren

- Planning: `https://tennisschema.web.app/`
- Data direct: `https://tennisschema.web.app/schema.txt`
- Editor: `https://tennisschema.web.app/schema-editor.html`

## GitHub

Repo: [willemtijm/tennis-schedule](https://github.com/willemtijm/tennis-schedule)

Na wijzigingen:

```bash
git add tennis/
git commit -m "Beschrijving van je wijziging"
git push origin main
```

Firebase en GitHub zijn los gekoppeld: na `git push` moet je voor de live site nog **`firebase deploy`** doen (tenzij je later CI instelt).

## Dataformaat

`schema.txt` verwacht een header en daarna regels in dit formaat:

```txt
date,players,sport
2026-05-18,Jan en Piet,tennis
2026-05-17,Klaas en Cor,padel
```

Gebruik geen underscores in Firebase project-ID’s; alleen kleine letters, cijfers en `-`.

## Wat de app doet

- laadt `schema.txt` (met `cache: no-store` om verouderde cache te vermijden)
- sorteert op datum
- toont toekomstige wedstrijden
- filtert op tennis/padel via checkboxes
- highlight de eerstvolgende wedstrijd en toont een countdown
