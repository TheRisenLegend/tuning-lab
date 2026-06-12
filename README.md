# Tuning Lab 🔧

Interaktiver Auto-Tuning-Konfigurator — 8 Autos, 109 echte Mods, Live-Zeichnung,
Build-Codes zum Teilen, Build Sheet als PDF.

## Setup (einmalig)

```bash
cd ~/Dokumente
unzip ~/Downloads/tuning-lab.zip
cd tuning-lab
npm install
bash download-images.sh     # holt die 8 Auto-Fotos nach public/img/
```

## Impressum ausfüllen

```bash
nano src/impressum.js
```

Mit `Strg+W` nach `[VORNAME` suchen, alle Platzhalter in `[ECKIGEN KLAMMERN]`
ersetzen, `Strg+S`, `Strg+X` — fertig.

## Lokal testen

```bash
npm run dev
```

→ http://localhost:5173 im Browser öffnen. Mit `Strg+C` beenden.

## Auf GitHub veröffentlichen

Neues Repo **tuning-lab** auf github.com anlegen (leer, ohne README), dann:

```bash
git init
git add .
git commit -m "Tuning Lab v1"
git branch -M main
git remote add origin git@github.com:DEIN-USERNAME/tuning-lab.git
git push -u origin main
npm run deploy
```

`npm run deploy` baut die Seite und pusht sie auf den Branch `gh-pages`.
Danach einmalig auf GitHub prüfen: **Settings → Pages → Branch: gh-pages** (Ordner `/`).

Die Seite läuft dann unter: `https://DEIN-USERNAME.github.io/tuning-lab/`

## Updates später

```bash
git add .
git commit -m "Änderung XY"
git push
npm run deploy
```

## Bilder

Die Fotos stammen von Wikimedia Commons (CC-Lizenzen, Links im Impressum unter
„Bildnachweise"). Eigene Fotos? Einfach `public/img/<auto-id>.jpg` ersetzen —
IDs: `a4b6, tt8n, clk320, i30nline, fiesta, golf6, sportsvan, bmw430`.
Fehlt ein Bild, greift automatisch der Wikimedia-Hotlink, danach die Zeichnung.
