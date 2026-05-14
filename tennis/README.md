# Tennis & Padel Schedule

Kleine front-end demo die wedstrijden uit `schema.txt` laadt, toont in een tabel, en filtert op tennis/padel.

## Bestanden

- `index.html` - pagina en styling
- `schema-editor.html` - beheerpagina voor `schema.txt` (laden, bewerken, downloaden)
- `code.ts` - TypeScript broncode voor de planning
- `code.js` - gegenereerde JavaScript output
- `schema-editor.ts` - TypeScript voor de beheerpagina
- `schema-editor.js` - gegenereerde JavaScript voor de beheerpagina
- `schema.txt` - data (CSV-achtig formaat)

## Vereisten

- Node.js (voor `npx tsc`)
- Python 3 (voor lokale HTTP server)

## Snel starten met npm scripts

Optie A (eerst naar `tennis/` gaan):

```bash
cd tennis
npm run build
npm run serve
```

Optie B (vanaf project-root):

```bash
npm --prefix tennis run build
npm --prefix tennis run serve
```

Open daarna:

- [http://localhost:5500/index.html](http://localhost:5500/index.html) (planning)
- [http://localhost:5500/schema-editor.html](http://localhost:5500/schema-editor.html) (`schema.txt` beheren)

## Compile TypeScript naar JavaScript

Handmatig (vanaf de project-root):

```bash
npx tsc "tennis/code.ts" --target es2017 --lib dom,es2017 --module none --skipLibCheck --typeRoots "tennis/.types" --outFile "tennis/code.js"
```

Omdat sommige globale types in deze workspace kunnen botsen, maak je eerst een lege map aan voor `--typeRoots`:

```bash
mkdir -p "tennis/.types"
```

Na compileren kun je die map weer verwijderen:

```bash
rmdir "tennis/.types"
```

## Lokaal draaien

Handmatig (vanaf de project-root), gebruik een simpele lokale server zodat `fetch("schema.txt")` werkt:

```bash
python3 -m http.server 5500
```

Open daarna:

- [http://localhost:5500/tennis/index.html](http://localhost:5500/tennis/index.html)
- [http://localhost:5500/tennis/schema-editor.html](http://localhost:5500/tennis/schema-editor.html) (bewerk `schema.txt`)

## schema.txt beheren

Open `schema-editor.html` in de browser (via dezelfde HTTP-server als de planning). De pagina laadt `schema.txt`, je past de tekst aan, en gebruikt **Download schema.txt** om een nieuw bestand op te slaan.

Omdat dit een statische site is, kan de browser **`schema.txt` op de server niet overschrijven**. Na download vervang je lokaal het bestand `tennis/schema.txt` (en commit/push of upload opnieuw bij Firebase).

## Dataformaat

`schema.txt` verwacht een header en daarna regels in dit formaat:

```txt
date,players,sport
2026-04-18,Jan en Piet,tennis
2026-04-17,Klaas en Cor,padel
```

## Wat de app doet

- laadt de data uit `schema.txt`
- sorteert op datum
- toont alleen toekomstige wedstrijden
- filtert op tennis/padel via checkboxes
- highlight de eerstvolgende wedstrijd en toont countdown
