import React, { useMemo, useState } from "react";
import {
  Gauge, MoveVertical, Paintbrush, Disc, Check, Dices, X,
  ChevronLeft, ScrollText, Info, Link2,
} from "lucide-react";

import { IMPRESSUM } from "./impressum.js";
import { CAR_PHOTOS, wmUrl, wmPage } from "./photos.js";

/* ============================================================
   TUNING LAB — interaktiver Auto-Tuning-Konfigurator
   Preise: ca.-Werte, deutsche Shops, Stand Mitte 2026.
   ============================================================ */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@600;700&family=Archivo:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root{
  --bg:#0d0e11; --panel:#15171c; --panel-2:#1a1d24; --line:#272b33; --line-2:#39404c;
  --text:#eef0f3; --muted:#9aa2af; --faint:#6b7280;
  --amber:#ffa01f; --amber-deep:#e08200; --amber-soft:rgba(255,160,31,.12);
  --steel:#8fb0e8; --steel-soft:rgba(143,176,232,.12);
}
.tl-root{
  min-height:100vh; background:var(--bg); color:var(--text);
  font-family:'Archivo',system-ui,sans-serif; font-size:15px; line-height:1.5;
  background-image:
    radial-gradient(1100px 420px at 70% -10%, rgba(255,160,31,.05), transparent 60%),
    repeating-linear-gradient(90deg, rgba(255,255,255,.012) 0 1px, transparent 1px 96px);
}
.tl-wrap{max-width:1060px; margin:0 auto; padding:28px 18px 170px;}
@media (max-width:760px){ .tl-wrap{padding-bottom:250px;} }
.tl-display{font-family:'Saira Condensed',sans-serif; text-transform:uppercase; letter-spacing:.05em;}
.tl-mono{font-family:'IBM Plex Mono',monospace;}

.tl-header{display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:26px; flex-wrap:wrap;}
.tl-logo{font-size:34px; font-weight:700; line-height:1; display:flex; align-items:baseline; gap:10px;}
.tl-logo .bar{display:inline-block; width:34px; height:8px; background:var(--amber); transform:skewX(-18deg);}
.tl-sub{color:var(--muted); font-size:13px; margin-top:6px; max-width:560px;}
.tl-kicker{font-size:12px; color:var(--amber); letter-spacing:.18em;}

.tl-cargrid{display:grid; grid-template-columns:repeat(2,1fr); gap:14px;}
@media (max-width:680px){ .tl-cargrid{grid-template-columns:1fr;} }
.tl-carcard{
  text-align:left; background:var(--panel); border:1px solid var(--line); border-radius:14px;
  padding:18px 18px 14px; cursor:pointer; transition:border-color .15s, transform .15s, background .15s;
  display:flex; flex-direction:column; gap:10px; color:var(--text); font:inherit;
}
.tl-carcard:hover{border-color:var(--line-2); transform:translateY(-2px); background:var(--panel-2);}
.tl-carcard:focus-visible, .tl-mod:focus-visible, .tl-btn:focus-visible, .tl-iconbtn:focus-visible,
.tl-back:focus-visible, .tl-sheetclose:focus-visible{ outline:2px solid var(--amber); outline-offset:2px; }
.tl-carname{font-size:21px; font-weight:700;}
.tl-carsub{color:var(--muted); font-size:13px; margin-top:-6px;}
.tl-specrow{display:flex; gap:16px; align-items:center; border-top:1px dashed var(--line); padding-top:10px;}
.tl-spec{display:flex; flex-direction:column;}
.tl-spec b{font-size:17px;}
.tl-spec span{font-size:10px; color:var(--faint); letter-spacing:.14em; text-transform:uppercase;}
.tl-flag{
  margin-left:auto; font-size:10.5px; color:var(--amber); background:var(--amber-soft);
  border:1px solid rgba(255,160,31,.3); border-radius:999px; padding:3px 9px; letter-spacing:.04em; white-space:nowrap;
}

.tl-back{display:inline-flex; align-items:center; gap:6px; color:var(--muted); background:none; border:none;
  cursor:pointer; font:inherit; font-size:13px; padding:4px 6px; border-radius:8px;}
.tl-back:hover{color:var(--text);}
.tl-hero{
  display:flex; gap:22px; align-items:center; background:var(--panel); border:1px solid var(--line);
  border-radius:16px; padding:20px 22px; margin:12px 0 8px; flex-wrap:wrap;
}
.tl-hero .sil{flex:0 0 250px; max-width:100%;}
.tl-heroinfo{flex:1; min-width:250px;}
.tl-heroname{font-size:30px; font-weight:700; line-height:1.05;}
.tl-heroengine{color:var(--amber); font-size:13px; letter-spacing:.12em; margin-top:2px;}
.tl-note{
  display:flex; gap:9px; color:var(--muted); font-size:13px; background:var(--panel-2);
  border:1px solid var(--line); border-radius:10px; padding:10px 12px; margin-top:12px;
}
.tl-note svg{flex:none; margin-top:2px; color:var(--amber);}

.tl-power{margin:18px 2px 6px;}
.tl-powerlabels{display:flex; justify-content:space-between; font-size:11px; color:var(--faint);
  letter-spacing:.14em; text-transform:uppercase; margin-bottom:6px;}
.tl-powertrack{height:14px; border-radius:7px; background:var(--panel-2); border:1px solid var(--line);
  overflow:hidden; display:flex;}
.tl-powerbase{background:linear-gradient(180deg,#3a414d,#2c323c); height:100%; transition:width .45s cubic-bezier(.2,.8,.2,1);}
.tl-powergain{background:linear-gradient(180deg,var(--amber),var(--amber-deep)); height:100%;
  transition:width .45s cubic-bezier(.2,.8,.2,1); box-shadow:0 0 14px rgba(255,160,31,.45);}
.tl-powercaption{display:flex; justify-content:space-between; margin-top:6px; font-size:12.5px; color:var(--muted); gap:10px; flex-wrap:wrap;}
.tl-powercaption b{color:var(--text);}

.tl-cat{margin-top:26px;}
.tl-cathead{display:flex; align-items:center; gap:10px; margin-bottom:10px;}
.tl-cathead svg{color:var(--amber);}
.tl-cathead h3{font-size:18px; margin:0;}
.tl-cathead .count{margin-left:auto; font-size:11px; color:var(--faint); letter-spacing:.1em;}
.tl-modgrid{display:grid; grid-template-columns:repeat(2,1fr); gap:10px;}
@media (max-width:760px){ .tl-modgrid{grid-template-columns:1fr;} }
.tl-mod{
  text-align:left; background:var(--panel); border:1px solid var(--line); border-radius:12px;
  padding:13px 14px; cursor:pointer; color:var(--text); font:inherit;
  display:flex; flex-direction:column; gap:8px; position:relative;
  transition:border-color .15s, background .15s, box-shadow .2s;
}
.tl-mod:hover{border-color:var(--line-2); background:var(--panel-2);}
.tl-mod.on{border-color:var(--amber); background:linear-gradient(180deg, rgba(255,160,31,.08), rgba(255,160,31,.02));
  box-shadow:0 0 0 1px rgba(255,160,31,.35), 0 6px 22px -12px rgba(255,160,31,.5);}
.tl-modtop{display:flex; align-items:flex-start; gap:10px; width:100%;}
.tl-checkbox{flex:none; width:20px; height:20px; border-radius:6px; border:1.5px solid var(--line-2);
  display:grid; place-items:center; margin-top:1px; transition:all .15s; color:#0d0e11;}
.tl-mod.on .tl-checkbox{background:var(--amber); border-color:var(--amber);}
.tl-modname{font-weight:600; font-size:14.5px; line-height:1.3;}
.tl-modprice{margin-left:auto; flex:none; font-size:13.5px; color:var(--text); white-space:nowrap;}
.tl-moddesc{color:var(--muted); font-size:12.8px; line-height:1.45; margin-left:30px;}
.tl-modmeta{display:flex; flex-wrap:wrap; gap:6px; margin-left:30px;}
.tl-badge{font-size:11px; padding:2px 8px; border-radius:999px; border:1px solid; letter-spacing:.02em;}
.tl-badge.ps{color:var(--amber); border-color:rgba(255,160,31,.4); background:var(--amber-soft);}
.tl-badge.nm{color:var(--steel); border-color:rgba(143,176,232,.4); background:var(--steel-soft);}
.tl-badge.req{color:var(--muted); border-color:var(--line-2); background:var(--panel-2);
  display:inline-flex; align-items:center; gap:5px;}
.tl-badge.grp{color:var(--faint); border-color:var(--line); background:transparent;}

.tl-summary{
  position:fixed; left:0; right:0; bottom:0; z-index:40;
  background:rgba(13,14,17,.9); backdrop-filter:blur(12px); border-top:1px solid var(--line);
}
.tl-summaryin{max-width:1060px; margin:0 auto; padding:12px 18px; display:flex; align-items:center; gap:18px; flex-wrap:wrap;}
.tl-sumblock{display:flex; flex-direction:column; min-width:72px;}
.tl-sumblock b{font-size:19px; line-height:1.1;}
.tl-sumblock span{font-size:10px; color:var(--faint); letter-spacing:.14em; text-transform:uppercase;}
.tl-sumblock .gain{color:var(--amber);}
.tl-sumblock .gain-nm{color:var(--steel);}
.tl-btn{
  margin-left:auto; display:inline-flex; align-items:center; gap:8px; cursor:pointer;
  background:var(--amber); color:#171002; border:none; border-radius:10px; padding:11px 16px;
  font-family:'Saira Condensed',sans-serif; font-size:16px; font-weight:700; letter-spacing:.06em;
  text-transform:uppercase; transition:transform .12s, filter .15s;
}
.tl-btn:hover{filter:brightness(1.08); transform:translateY(-1px);}
.tl-btn:disabled{background:var(--panel-2); color:var(--faint); cursor:not-allowed; transform:none; filter:none;}
.tl-compare{width:100%; display:flex; align-items:center; gap:10px; color:var(--muted); font-size:13px;
  border-top:1px dashed var(--line); padding-top:9px; flex-wrap:wrap;}
.tl-iconbtn{background:var(--panel-2); border:1px solid var(--line); color:var(--muted); border-radius:8px;
  width:28px; height:28px; display:grid; place-items:center; cursor:pointer; flex:none; transition:all .15s;}
.tl-iconbtn:hover{color:var(--amber); border-color:var(--amber);}

.tl-toast{
  position:fixed; bottom:118px; left:50%; transform:translateX(-50%); z-index:50;
  background:var(--panel-2); border:1px solid var(--amber); color:var(--text);
  border-radius:10px; padding:10px 16px; font-size:13px; max-width:92vw;
  box-shadow:0 10px 30px rgba(0,0,0,.5); animation:tl-pop .25s ease;
}
@keyframes tl-pop{from{opacity:0; transform:translate(-50%,8px);} to{opacity:1; transform:translate(-50%,0);}}

.tl-overlay{position:fixed; inset:0; z-index:60; background:rgba(5,6,8,.8); backdrop-filter:blur(6px);
  display:flex; flex-direction:column; align-items:center; overflow-y:auto; padding:22px 14px 60px;}
.tl-sheet{
  width:100%; max-width:440px; background:#101218; border:1px solid var(--line-2); border-radius:4px;
  padding:26px 26px 20px; position:relative; color:var(--text);
  box-shadow:0 30px 80px rgba(0,0,0,.7);
}
.tl-sheethead{text-align:center; border-bottom:1.5px dashed var(--line-2); padding-bottom:14px;}
.tl-sheethead .brand{font-size:13px; letter-spacing:.34em; color:var(--amber);}
.tl-sheetcar{font-size:26px; font-weight:700; margin-top:8px; line-height:1.1;}
.tl-sheetengine{color:var(--muted); font-size:12px; margin-top:3px;}
.tl-sheetbody{font-size:12.5px;}
.tl-sheetcat{margin-top:14px;}
.tl-sheetcat h4{font-size:11px; color:var(--amber); letter-spacing:.2em; margin:0 0 6px; font-weight:600;}
.tl-sheetline{display:flex; gap:10px; justify-content:space-between; padding:3px 0; color:var(--text); align-items:baseline;}
.tl-sheetline .dots{flex:1; border-bottom:1px dotted var(--line-2); transform:translateY(-3px); min-width:14px;}
.tl-sheettotals{border-top:1.5px dashed var(--line-2); margin-top:16px; padding-top:12px;}
.tl-sheetbig{display:flex; justify-content:space-between; align-items:baseline; padding:3px 0; gap:10px;}
.tl-sheetbig b{font-size:20px;}
.tl-sheetbig .amber{color:var(--amber);}
.tl-sheetfoot{margin-top:14px; border-top:1.5px dashed var(--line-2); padding-top:10px;
  text-align:center; color:var(--faint); font-size:10.5px; line-height:1.6;}
.tl-sheetclose{
  margin:0 0 14px; display:flex; align-items:center; gap:8px;
  background:var(--panel-2); border:1px solid var(--line-2); color:var(--text); border-radius:999px;
  padding:8px 16px; cursor:pointer; font:inherit; font-size:13px;
}
.tl-sheetclose:hover{border-color:var(--amber); color:var(--amber);}
.tl-footer{margin-top:40px; color:var(--faint); font-size:12px; line-height:1.7;
  border-top:1px solid var(--line); padding-top:14px;}

.tl-body{transition:transform .5s cubic-bezier(.2,.8,.2,1);}
.tl-silcap{text-align:center; color:var(--faint); font-size:10px; letter-spacing:.12em; margin-top:5px; text-transform:uppercase;}

.tl-photowrap{width:100%; line-height:0;}
.tl-herotabs{display:flex; gap:6px; margin-bottom:10px;}
.tl-herotabs button{flex:0 0 auto; background:transparent; border:1px solid var(--line); color:var(--muted); border-radius:999px; padding:5px 13px; font:inherit; font-size:11.5px; letter-spacing:.06em; text-transform:uppercase; cursor:pointer; transition:border-color .15s, color .15s;}
.tl-herotabs button.on{border-color:var(--amber); color:var(--amber);}
.tl-photomiss{border:1px dashed var(--line-2); border-radius:10px; padding:26px 16px; text-align:center; color:var(--faint); font-size:12.5px; line-height:1.7;}
.tl-carphoto{width:100%; height:118px; object-fit:cover; border-radius:9px; display:block; background:var(--bg);}
.tl-credit{color:var(--muted);}

.tl-toggle{display:inline-flex; align-items:center; gap:7px; background:transparent; border:1px solid var(--line); color:var(--muted); border-radius:999px; padding:7px 13px; font:inherit; font-size:12.5px; cursor:pointer; transition:border-color .15s, color .15s;}
.tl-toggle .dot{width:9px; height:9px; border-radius:50%; background:var(--line); transition:background .15s;}
.tl-toggle.on{border-color:var(--amber); color:var(--amber);}
.tl-toggle.on .dot{background:var(--amber);}
.tl-linkbtn{background:none; border:none; padding:0; color:var(--muted); text-decoration:underline; cursor:pointer; font:inherit; font-size:inherit;}
.tl-linkbtn:hover{color:var(--text);}

.tl-codebox{margin-top:18px; background:var(--panel); border:1px solid var(--line); border-radius:12px; padding:14px 16px;}
.tl-coderow{display:flex; gap:10px; margin-top:9px;}
.tl-codeinput{flex:1; min-width:0; background:var(--bg); border:1px solid var(--line); border-radius:9px; color:var(--text); padding:10px 12px; font-size:12.5px; outline:none;}
.tl-codeinput:focus{border-color:var(--amber);}

.tl-sheetactions{display:flex; gap:10px; flex-wrap:wrap; justify-content:center;}
.tl-sheetcode{display:flex; align-items:center; gap:10px; flex-wrap:wrap; border-top:1px dashed var(--line); margin-top:14px; padding-top:12px;}
.tl-sheetcode .lbl{font-size:11px; color:var(--faint); text-transform:uppercase; letter-spacing:.08em;}
.tl-sheetcode code{flex:1; min-width:120px; font-size:11px; color:var(--muted); word-break:break-all; background:var(--bg); border:1px solid var(--line); border-radius:7px; padding:7px 9px;}
.tl-sheetcode .tl-iconbtn{width:auto; padding:0 12px; font-size:12px;}

.tl-imprint .tl-sheetbody h4{margin:16px 0 5px; font-size:13.5px; letter-spacing:.04em; text-transform:uppercase; color:var(--amber);}
.tl-imprint .tl-sheetbody h4:first-child{margin-top:0;}
.tl-imprint .tl-sheetbody p{margin:0; font-size:13px; line-height:1.65; color:var(--muted);}

@media print{
  body{background:#fff !important;}
  .tl-root > *:not(.tl-overlay){display:none !important;}
  .tl-overlay{position:static !important; background:#fff !important; padding:0 !important; display:block !important;}
  .tl-sheetactions, .tl-sheetclose, .tl-noprint, .tl-toast, .tl-summary{display:none !important;}
  .tl-sheet{box-shadow:none !important; margin:0 auto !important; max-width:520px !important;}
  *{-webkit-print-color-adjust:exact; print-color-adjust:exact;}
}

@media (prefers-reduced-motion:reduce){
  .tl-root *{animation:none !important; transition:none !important;}
}
`;

/* ---------------- Fahrzeuge ---------------- */

const CARS = [
  {
    id: "a4b6",
    name: "Audi A4 B6",
    sub: "2.0 (ALT) · 2003 · Limousine",
    engine: "2.0 20V Sauger · 130 PS / 195 Nm",
    basePS: 130, baseNM: 195, accel: 10.9,
    body: "limo",
    note: "Den B6 gab\u2019s auch als 1.9 TDI (130 PS \u2013 der Chip-Liebling) und als 3.0 V6 (220 PS). Der 2.0 ist ein Saugmotor: Software bringt hier nur Feinschliff \u2013 die B6-Szene lebt von Fahrwerk, Felgen und cleanem Look.",
    flag: "Stance-Klassiker",
  },
  {
    id: "tt8n",
    name: "Audi TT 8N",
    sub: "1.8T quattro · Coupé",
    engine: "1.8T 20V (APX) · 225 PS / 280 Nm",
    basePS: 225, baseNM: 280, accel: 6.4,
    body: "tt",
    note: "Der 1.8T 20V ist DER Tuner-Motor seiner \u00C4ra. Der APX ist die fr\u00FChe 225er-Version (1998\u20132000) mit K04-Lader \u2013 Hardware-Tuning identisch zum sp\u00E4teren BAM. Einziger Haken: das \u00E4ltere Steuerger\u00E4t (ME 3.8.5) \u2013 vorher kl\u00E4ren, ob der Tuner das kann.",
    flag: "Tuner-Liebling",
  },
  {
    id: "clk320",
    name: "Mercedes CLK 320 CDI",
    sub: "W209 · OM642 · Coupé",
    engine: "3.0 V6 Diesel · 224 PS / 510 Nm",
    basePS: 224, baseNM: 510, accel: 6.7,
    body: "clk",
    note: "Der OM642 ist ein Drehmoment-Monster \u2013 Tuning-Ziel ist hier Nm, nicht Drehzahl. Wichtig: DPF-Entfernung ist illegal (Betriebserlaubnis weg, T\u00DCV ade). Sauber hei\u00DFt: Kennfeld in Ma\u00DFen + gepflegter Filter.",
    flag: "Drehmoment-Fokus",
  },
  {
    id: "i30nline",
    name: "Hyundai i30 N-Line",
    sub: "1.5 T-GDI 48V · Hatchback",
    engine: "1.5 T-GDI Mildhybrid · 160 PS / 253 Nm",
    basePS: 160, baseNM: 253, accel: 8.9,
    body: "hatch",
    note: "Nicht verwechseln: N-Line ist die Sport-Optik-Variante mit 1.5 T-GDI \u2013 NICHT der 280-PS-i30 N. Die Szene ist entsprechend milder: etwas Software, Federn, Optik \u2013 fertig ist der schicke Daily.",
    flag: "N-Line \u2260 i30 N",
  },
  {
    id: "fiesta",
    name: "Ford Fiesta 1.6 TDCi",
    sub: "MK6 \u00B7 2009 \u00B7 Kleinwagen",
    engine: "1.6 TDCi Diesel \u00B7 90 PS / 212 Nm",
    basePS: 90, baseNM: 212, accel: 12.3,
    body: "mini",
    note: "Sparsamer Pendler mit Szene-Faktor: Der 1.6 TDCi nimmt Software dankbar an (+25 PS / +50 Nm). DPF bleibt drin \u2013 alles T\u00DCV-konform und alltagstauglich.",
    flag: "Budget-Diesel",
  },
  {
    id: "golf6",
    name: "VW Golf 6 1.4 TSI Team",
    sub: "Typ 5K \u00B7 2011 \u00B7 Sondermodell",
    engine: "1.4 TSI \u00B7 122 PS / 200 Nm",
    basePS: 122, baseNM: 200, accel: 9.5,
    body: "golf",
    note: "Sondermodell Team auf 1.4-TSI-Basis (bei VW hei\u00DFt der Motor TSI, nicht TFSI \u2013 das ist Audi). Mit Software und Ladeluftk\u00FChler ein ehrlicher kleiner GTI-Schreck.",
    flag: "Allrounder",
  },
  {
    id: "sportsvan",
    name: "VW Golf Sportsvan 2.0 TDI",
    sub: "\u201EGolf 7 Plus\u201C \u00B7 2014",
    engine: "2.0 TDI EA288 \u00B7 150 PS / 340 Nm",
    basePS: 150, baseNM: 340, accel: 8.9,
    body: "van",
    note: "Offiziell hei\u00DFt der \u201EGolf 7 Plus\u201C ab 2014 Sportsvan. Der EA288-TDI ist eine dankbare Software-Basis: +40 PS / +60 Nm \u2013 DPF bleibt nat\u00FCrlich drin.",
    flag: "Familien-Sleeper",
  },
  {
    id: "bmw430",
    name: "BMW 430i Gran Coup\u00E9",
    sub: "F36 \u00B7 2017",
    engine: "B48 2.0 Turbo \u00B7 252 PS / 350 Nm",
    basePS: 252, baseNM: 350, accel: 5.9,
    body: "gran",
    note: "Der B48 hat viel Luft nach oben: Stage 2 mit Downpipe kratzt an der 320-PS-Marke. 200-Zellen-Kat und Eintragung sind Pflicht \u2013 sauber bleiben lohnt sich.",
    flag: "Premium-Basis",
  },
];

/* ---------------- Mods ---------------- */

const MODS = {
  a4b6: [
    { id: "a4-map", cat: "motor", name: "Kennfeldoptimierung", price: 399, ps: 12, nm: 19, group: "software",
      desc: "Beim Sauger eher Feinschliff: 130 \u2192 ca. 142 PS, bessere Gasannahme. Gro\u00DFe Spr\u00FCnge gibt\u2019s ohne Turbo nicht \u2013 ehrlich ist ehrlich." },
    { id: "a4-esd", cat: "motor", name: "Friedrich Motorsport Duplex-ESD", price: 479, ps: 3, nm: 0,
      desc: "Edelstahl-Endschalld\u00E4mpfer mit Duplex-Endrohren und ABE. Satterer Klang, sauberer Heckabschluss." },
    { id: "a4-filter", cat: "motor", name: "K&N Tauschluftfilter", price: 59, ps: 2, nm: 0,
      desc: "Mehr Ansaugger\u00E4usch als Mehrleistung \u2013 beim ALT eher f\u00FCrs Gef\u00FChl als f\u00FCr den Pr\u00FCfstand." },
    { id: "a4-kwv1", cat: "fahrwerk", name: "KW V1 inox Gewindefahrwerk", price: 1149, ps: 0, nm: 0, group: "fahrwerk-basis",
      desc: "Edelstahl-Federbeine, stufenlos ca. 35\u201365 mm tiefer, mit Teilegutachten. Der Klassiker im B6." },
    { id: "a4-bc", cat: "fahrwerk", name: "BC Racing BR-RA Gewindefahrwerk", price: 1049, ps: 0, nm: 0, group: "fahrwerk-basis",
      desc: "30-fach h\u00E4rteverstellbar, top Preis-Leistung, T\u00DCV-Gutachten dabei." },
    { id: "a4-hr", cat: "fahrwerk", name: "H&R Tieferlegungsfedern 35 mm", price: 239, ps: 0, nm: 0, group: "fahrwerk-basis",
      desc: "Die Budget-Schiene: tiefer auf Serien-D\u00E4mpfern. F\u00FCr den Anfang v\u00F6llig okay." },
    { id: "a4-spur", cat: "fahrwerk", name: "H&R Spurplatten DR 30 mm/Achse", price: 129, ps: 0, nm: 0,
      desc: "F\u00FCllt die Radh\u00E4user \u2013 beim Stance-Look quasi Pflicht. Mit ABE/Gutachten." },
    { id: "a4-grill", cat: "optik", name: "RS4-Style Wabengrill", price: 129, ps: 0, nm: 0,
      desc: "Wabenoptik in Schwarz statt Chromrahmen \u2013 der bekannteste B6-Facelift f\u00FCr kleines Geld." },
    { id: "a4-wheels", cat: "optik", name: "19\u2033 Felgensatz (Concave-Style)", price: 1299, ps: 0, nm: 0,
      desc: "z.\u202FB. Borbet/Concave-Design in 8,5\u00D719. Tief + concave = das B6-Rezept." },
    { id: "a4-tail", cat: "optik", name: "Get\u00F6nte LED-R\u00FCckleuchten", price: 199, ps: 0, nm: 0,
      desc: "Smoked-Look mit E-Pr\u00FCfzeichen, klarer Modernisierungseffekt am Heck." },
    { id: "a4-brakes", cat: "bremsen", name: "ATE PowerDisc + Ceramic-Bel\u00E4ge (VA)", price: 339, ps: 0, nm: 0,
      desc: "Standfester und deutlich weniger Bremsstaub \u2013 die Felgen bleiben sauber." },
    { id: "a4-flex", cat: "bremsen", name: "Stahlflex-Bremsleitungen", price: 109, ps: 0, nm: 0,
      desc: "Knackigerer Druckpunkt, mit ABE." },
  ],

  tt8n: [
    { id: "tt-s1", cat: "motor", name: "Stage 1 Kennfeld (z.\u202FB. HG Motorsport / SKN)", price: 649, ps: 35, nm: 60, group: "software",
      desc: "Ca. 260 PS / 340 Nm auf Serienhardware, inkl. Pr\u00FCfstandsmessung. Beim APX wichtig: ME-3.8.5-Steuerger\u00E4t \u2013 nicht jeder Tuner kann\u2019s, HG/SKN ja. 580\u2013800\u202F\u20AC." },
    { id: "tt-s2", cat: "motor", name: "Stage 2 Kennfeld", price: 899, ps: 55, nm: 90, group: "software", requires: ["tt-dp"],
      desc: "Ca. 280 PS \u2013 braucht freien Abgasweg (Downpipe). Ladeluftk\u00FChler-Upgrade dringend empfohlen, sonst verpufft\u2019s bei hei\u00DFer Ladeluft." },
    { id: "tt-dp", cat: "motor", name: "76 mm Downpipe + 200-Zellen-Sportkat", price: 549, ps: 8, nm: 15,
      desc: "3 Zoll ab Turbo, entlastet den Lader thermisch. Eintragung n\u00F6tig (Einzelabnahme)." },
    { id: "tt-fmic", cat: "motor", name: "Wagner Tuning Ladeluftk\u00FChler (FMIC)", price: 910, ps: 8, nm: 12,
      desc: "600\u00D7355\u00D750er Netz, h\u00E4lt die Ladeluft auch bei Volllast k\u00FChl \u2013 ab Stage 2 quasi Pflicht. Made in Dessau." },
    { id: "tt-dv", cat: "motor", name: "Forge Schubumluftventil", price: 179, ps: 0, nm: 0,
      desc: "Kolben statt Membran: h\u00E4lt Ladedruck stabil \u2013 kein Membranriss mehr am alten 1.8T." },
    { id: "tt-exhaust", cat: "motor", name: "Bull-X 3\u2033 Abgasanlage ab Kat", price: 749, ps: 5, nm: 8,
      desc: "Mehr Durchsatz, typisches 1.8T-Bollern inklusive. Mit Gutachten erh\u00E4ltlich." },
    { id: "tt-kwv3", cat: "fahrwerk", name: "KW V3 inox Gewindefahrwerk", price: 2149, ps: 0, nm: 0, group: "fahrwerk-basis",
      desc: "Zug- und Druckstufe getrennt einstellbar \u2013 die K\u00F6nigsklasse f\u00FCrs Quattro-Coup\u00E9." },
    { id: "tt-bc", cat: "fahrwerk", name: "BC Racing BR-RA Gewindefahrwerk", price: 1099, ps: 0, nm: 0, group: "fahrwerk-basis",
      desc: "H\u00E4rteverstellbar, solide Alltagsabstimmung, T\u00DCV-Gutachten dabei." },
    { id: "tt-dom", cat: "fahrwerk", name: "Wiechers Domstrebe (VA)", price: 159, ps: 0, nm: 0,
      desc: "Steifere Front, direkteres Einlenken \u2013 sp\u00FCrbar auf der Landstra\u00DFe." },
    { id: "tt-spur", cat: "fahrwerk", name: "H&R Spurplatten 2\u00D715 mm", price: 119, ps: 0, nm: 0,
      desc: "Breitere Spur, satterer Stand \u2013 mit ABE." },
    { id: "tt-wheels", cat: "optik", name: "18\u2033 OZ Ultraleggera Satz", price: 1449, ps: 0, nm: 0,
      desc: "Leichtbau-Klassiker, steht dem 8N seit 20 Jahren wie angegossen." },
    { id: "tt-wing", cat: "optik", name: "Heckfl\u00FCgel im 8N-Werksstil", price: 249, ps: 0, nm: 0,
      desc: "Der nachger\u00FCstete Werksspoiler \u2013 beim fr\u00FChen 8N sogar fahrdynamisch sinnvoll." },
    { id: "tt-brakes", cat: "bremsen", name: "EBC Yellowstuff + Scheiben (VA, 312 mm)", price: 419, ps: 0, nm: 0,
      desc: "Mehr Biss bei Stage-Leistung, fading-stabil bei Passabfahrten." },
    { id: "tt-flex", cat: "bremsen", name: "Stahlflex-Bremsleitungen", price: 119, ps: 0, nm: 0,
      desc: "Direkter Druckpunkt \u2013 passt zum Rest des Pakets." },
  ],

  clk320: [
    { id: "clk-map", cat: "motor", name: "Kennfeldoptimierung Stage 1", price: 599, ps: 40, nm: 90, group: "software",
      desc: "Ca. 264 PS / 600 Nm \u2013 das verkraftet die 7G-Tronic. Deutlich mehr Drehmoment sollte man ihr dauerhaft nicht antun." },
    { id: "clk-box", cat: "motor", name: "DTE PowerControl Tuningbox", price: 429, ps: 30, nm: 70, group: "software",
      desc: "Plug&Play am Sensorkabelbaum, r\u00FCckstandslos entfernbar, mit Teilegutachten eintragbar." },
    { id: "clk-tcu", cat: "motor", name: "Getriebesoftware 7G-Tronic", price: 449, ps: 0, nm: 0,
      desc: "Schnellere Schaltzeiten, fr\u00FChere Wandler\u00FCberbr\u00FCckung \u2013 macht das Nm-Plus erst richtig nutzbar." },
    { id: "clk-dpf", cat: "motor", name: "DPF-Reinigung (Wartung)", price: 349, ps: 0, nm: 0,
      desc: "Freier Filter = voller Ladedruck und sauberes Regenerieren. Die legale Antwort aufs DPF-Thema \u2013 Ausbau w\u00E4re Erl\u00F6schen der Betriebserlaubnis." },
    { id: "clk-filter", cat: "motor", name: "BMC Tauschluftfilter", price: 79, ps: 2, nm: 0,
      desc: "Waschbar, minimal besserer Durchsatz \u2013 mehr Pflegeteil als Power-Mod." },
    { id: "clk-b12", cat: "fahrwerk", name: "Bilstein B12 Pro-Kit", price: 899, ps: 0, nm: 0, group: "fahrwerk-basis",
      desc: "B8-D\u00E4mpfer + Eibach-Federn, ca. 30 mm tiefer \u2013 straff, aber langstreckentauglich." },
    { id: "clk-hr", cat: "fahrwerk", name: "H&R Federn ca. 35 mm", price: 259, ps: 0, nm: 0, group: "fahrwerk-basis",
      desc: "Dezente Tieferlegung auf Seriend\u00E4mpfern, mit Teilegutachten." },
    { id: "clk-wheels", cat: "optik", name: "18\u2033 Felgen im AMG-Style", price: 1199, ps: 0, nm: 0,
      desc: "Mehrteiler-Optik im Stil der \u00C4ra \u2013 dem W209 steht klassisch besser als modern." },
    { id: "clk-lip", cat: "optik", name: "Dezente Heckspoilerlippe", price: 149, ps: 0, nm: 0,
      desc: "Lackierte Abrisskante auf dem Kofferraumdeckel \u2013 mehr braucht das Coup\u00E9 nicht." },
    { id: "clk-brakes", cat: "bremsen", name: "ATE Scheiben + Ceramic-Bel\u00E4ge (VA)", price: 389, ps: 0, nm: 0,
      desc: "1,7 Tonnen Diesel-Coup\u00E9 danken es beim Ankern \u2013 und die Felgen bleiben sauber." },
  ],

  i30nline: [
    { id: "i30-map", cat: "motor", name: "Kennfeldoptimierung Stage 1", price: 499, ps: 21, nm: 27, group: "software",
      desc: "160 \u2192 ca. 180 PS, sp\u00FCrbar im mittleren Drehzahlband. Mehr gibt der kleine Lader seri\u00F6s nicht her." },
    { id: "i30-box", cat: "motor", name: "DTE PowerControl X Box", price: 399, ps: 19, nm: 30, group: "software",
      desc: "Zusatzsteuerger\u00E4t mit App-Steuerung und Teilegutachten \u2013 die eintragungsfreundliche Variante." },
    { id: "i30-pedal", cat: "motor", name: "DTE PedalBox", price: 229, ps: 0, nm: 0,
      desc: "Sch\u00E4rfere Gasannahme \u2013 gef\u00FChlte PS, keine echten. Aber im Alltag erstaunlich wirksam." },
    { id: "i30-filter", cat: "motor", name: "K&N Tauschluftfilter", price: 69, ps: 1, nm: 0,
      desc: "Einbau in 10 Minuten, waschbar \u2013 der klassische Erst-Mod." },
    { id: "i30-stx", cat: "fahrwerk", name: "ST X Gewindefahrwerk (by KW)", price: 679, ps: 0, nm: 0, group: "fahrwerk-basis",
      desc: "KW-Technik zum Einstiegspreis, ca. 20\u201345 mm stufenlos, mit Gutachten." },
    { id: "i30-eibach", cat: "fahrwerk", name: "Eibach Pro-Kit Federn ca. 30 mm", price: 269, ps: 0, nm: 0, group: "fahrwerk-basis",
      desc: "Der N-Line-Standard: tiefer und agiler, ohne den Komfort zu opfern." },
    { id: "i30-splitter", cat: "optik", name: "Maxton Design Frontsplitter", price: 169, ps: 0, nm: 0,
      desc: "Schwarz gl\u00E4nzend, passgenau f\u00FCr die N-Line-Front \u2013 der meistverbaute Optik-Mod der Szene." },
    { id: "i30-wheels", cat: "optik", name: "18\u2033 Felgensatz (z.\u202FB. Oxigin/Tomason)", price: 1099, ps: 0, nm: 0,
      desc: "Eine Nummer gr\u00F6\u00DFer als Serie, dunkel lackiert \u2013 sofort erwachsener Stand." },
    { id: "i30-tint", cat: "optik", name: "Scheibent\u00F6nung hinten (95\u202F%)", price: 219, ps: 0, nm: 0,
      desc: "Folierung ab B-S\u00E4ule mit ABG \u2013 rundet den N-Line-Look ab." },
    { id: "i30-pads", cat: "bremsen", name: "EBC Greenstuff Bel\u00E4ge (VA)", price: 119, ps: 0, nm: 0,
      desc: "Besserer Kaltbiss, alltagstauglich, kaum Mehrstaub." },
    { id: "i30-discs", cat: "bremsen", name: "Brembo Scheiben + Bel\u00E4ge (VA)", price: 329, ps: 0, nm: 0,
      desc: "OE-Qualit\u00E4t aufgefrischt \u2013 solide Basis, falls die Serie runter ist." },
  ],
  fiesta: [
    { id: "fie-map", cat: "motor", name: "Kennfeldoptimierung Stage 1", price: 399, ps: 25, nm: 50, group: "software",
      desc: "Abgestimmt auf den 1.6 TDCi: 90 \u2192 ca. 115 PS, sp\u00FCrbar mehr Durchzug \u2013 Verbrauch bleibt oft sogar gleich." },
    { id: "fie-box", cat: "motor", name: "DTE PowerControl Tuningbox", price: 299, ps: 20, nm: 40, group: "software",
      desc: "Zusatzsteuerger\u00E4t, r\u00FCckstandslos ausbaubar \u2013 gut, wenn das Auto mal wieder serienm\u00E4\u00DFig sein soll." },
    { id: "fie-pedal", cat: "motor", name: "PedalBox", price: 229, ps: 0, nm: 0,
      desc: "Sch\u00E4rfere Gasannahme \u2013 f\u00FChlt sich spritziger an, bringt aber keine echte Mehrleistung." },
    { id: "fie-esd", cat: "motor", name: "Edelstahl-ESD (Friedrich Motorsport)", price: 379, ps: 0, nm: 0,
      desc: "Dezent sportlicherer Klang mit ABE \u2013 kein Prollauspuff, der Diesel bleibt zivil." },
    { id: "fie-stx", cat: "fahrwerk", name: "ST X Gewindefahrwerk", price: 679, ps: 0, nm: 0, group: "fahrwerk-basis",
      desc: "30\u201360 mm stufenlos tiefer, mit Teilegutachten \u2013 der Klassiker f\u00FCrs kleine Budget." },
    { id: "fie-eibach", cat: "fahrwerk", name: "Eibach Pro-Kit Federn", price: 289, ps: 0, nm: 0, group: "fahrwerk-basis",
      desc: "Ca. 30 mm tiefer auf Seriend\u00E4mpfern \u2013 g\u00FCnstigster Weg zu besserer Optik." },
    { id: "fie-spur", cat: "fahrwerk", name: "H&R Spurplatten 2\u00D715 mm", price: 119, ps: 0, nm: 0,
      desc: "R\u00E4der b\u00FCndig zum Radlauf \u2013 kleiner Eingriff, gro\u00DFer Effekt." },
    { id: "fie-wheels", cat: "optik", name: "16\u2033-Leichtmetallsatz (z. B. OZ)", price: 749, ps: 0, nm: 0,
      desc: "Leichter und breiter als die Serienr\u00E4der \u2013 Standard-Upgrade der Fiesta-Szene." },
    { id: "fie-lip", cat: "optik", name: "Frontlippe (ST-Look)", price: 149, ps: 0, nm: 0,
      desc: "Schwarzer Splitter f\u00FCr die Front \u2013 macht den Kleinen optisch breiter." },
    { id: "fie-tint", cat: "optik", name: "Scheibent\u00F6nung ab B-S\u00E4ule", price: 199, ps: 0, nm: 0,
      desc: "Folierung hinten \u2013 mit ABG eintragungsfrei." },
    { id: "fie-brakes", cat: "bremsen", name: "ATE Scheiben + Bel\u00E4ge VA", price: 269, ps: 0, nm: 0,
      desc: "Frische Markenbremse vorne \u2013 beim leichten Fiesta v\u00F6llig ausreichend dimensioniert." },
  ],
  golf6: [
    { id: "g6-s1", cat: "motor", name: "Stage 1 Kennfeld", price: 449, ps: 23, nm: 50, group: "software",
      desc: "122 \u2192 ca. 145 PS, 250 Nm \u2013 der kleine TSI wacht richtig auf." },
    { id: "g6-box", cat: "motor", name: "DTE Tuningbox", price: 349, ps: 20, nm: 40, group: "software",
      desc: "Plug-and-Play-Alternative zum Kennfeld \u2013 r\u00FCckstandslos entfernbar." },
    { id: "g6-fmic", cat: "motor", name: "Wagner Ladeluftk\u00FChler", price: 689, ps: 0, nm: 0,
      desc: "H\u00E4lt die Ladeluft auch im Sommerstau k\u00FChl \u2013 sichert die Stage-1-Leistung dauerhaft ab." },
    { id: "g6-filter", cat: "motor", name: "K&N Tauschluftfilter", price: 65, ps: 0, nm: 0,
      desc: "Waschbar und langlebig \u2013 Mehrleistung minimal, aber h\u00E4lt ewig." },
    { id: "g6-esd", cat: "motor", name: "Bull-X Endschalld\u00E4mpfer", price: 449, ps: 0, nm: 0,
      desc: "Kerniger TSI-Sound mit Gutachten \u2013 ohne nervig zu dr\u00F6hnen." },
    { id: "g6-kw", cat: "fahrwerk", name: "KW V1 Gewindefahrwerk", price: 1049, ps: 0, nm: 0, group: "fahrwerk-basis",
      desc: "Edelstahl, Teilegutachten, sauber abgestimmt \u2013 die Premium-Wahl." },
    { id: "g6-stx", cat: "fahrwerk", name: "ST X Gewindefahrwerk", price: 729, ps: 0, nm: 0, group: "fahrwerk-basis",
      desc: "KW-Tochter zum fairen Kurs \u2013 beliebteste Wahl im Golf." },
    { id: "g6-hr", cat: "fahrwerk", name: "H&R Federn ~35 mm", price: 269, ps: 0, nm: 0, group: "fahrwerk-basis",
      desc: "Dezente Tieferlegung auf Seriend\u00E4mpfern." },
    { id: "g6-spur", cat: "fahrwerk", name: "Spurplatten 2\u00D720 mm", price: 129, ps: 0, nm: 0,
      desc: "Satterer Stand an beiden Achsen." },
    { id: "g6-wheels", cat: "optik", name: "18\u2033-Felgensatz (z. B. Borbet)", price: 1190, ps: 0, nm: 0,
      desc: "F\u00FCllt die Radh\u00E4user \u2013 mit Federn zusammen die halbe Miete." },
    { id: "g6-grill", cat: "optik", name: "Wabengrill (GTI-Look)", price: 189, ps: 0, nm: 0,
      desc: "Schwarzer Wabengrill statt Chromleisten \u2013 sofort b\u00F6serer Blick." },
    { id: "g6-spoiler", cat: "optik", name: "GTI-Dachkantenspoiler", price: 249, ps: 0, nm: 0,
      desc: "Original-Look vom GTI \u2013 lackiert in Wagenfarbe." },
    { id: "g6-tint", cat: "optik", name: "Scheibent\u00F6nung ab B-S\u00E4ule", price: 219, ps: 0, nm: 0,
      desc: "Dunkle Heckpartie \u2013 rundet den GTI-Look ab." },
    { id: "g6-brakes", cat: "bremsen", name: "EBC Greenstuff + Scheiben VA", price: 329, ps: 0, nm: 0,
      desc: "Bissigere Bel\u00E4ge plus frische Scheiben \u2013 passend zur Mehrleistung." },
  ],
  sportsvan: [
    { id: "gsv-s1", cat: "motor", name: "Stage 1 Kennfeld", price: 499, ps: 40, nm: 60, group: "software",
      desc: "150 \u2192 ca. 190 PS, 400 Nm \u2013 der EA288 ist eine der dankbarsten Software-Basen \u00FCberhaupt." },
    { id: "gsv-box", cat: "motor", name: "DTE Tuningbox", price: 399, ps: 35, nm: 60, group: "software",
      desc: "Box-Alternative \u2013 r\u00FCckstandslos ausbaubar, z. B. vor R\u00FCckgabe." },
    { id: "gsv-dsg", cat: "motor", name: "DSG-Getriebesoftware", price: 349, ps: 0, nm: 0,
      desc: "Schnellere Schaltzeiten und angehobene Drehmomentfreigabe \u2013 sinnvoll ab Stage 1 mit DSG." },
    { id: "gsv-esd", cat: "motor", name: "Friedrich Edelstahl-ESD", price: 489, ps: 0, nm: 0,
      desc: "Wertiger Klang statt Diesel-N\u00E4hmaschine \u2013 mit ABE." },
    { id: "gsv-hr", cat: "fahrwerk", name: "H&R Federn ~35 mm", price: 259, ps: 0, nm: 0, group: "fahrwerk-basis",
      desc: "Nimmt dem Hochdach-Golf das Staksige \u2013 bleibt familientauglich." },
    { id: "gsv-stx", cat: "fahrwerk", name: "ST X Gewindefahrwerk", price: 749, ps: 0, nm: 0, group: "fahrwerk-basis",
      desc: "Stufenlos einstellbar mit Teilegutachten \u2013 auch f\u00FCr den Sportsvan lieferbar." },
    { id: "gsv-spur", cat: "fahrwerk", name: "Spurplatten 2\u00D715 mm", price: 129, ps: 0, nm: 0,
      desc: "Etwas mehr Stand \u2013 dezent bleibt dezent." },
    { id: "gsv-wheels", cat: "optik", name: "18\u2033-Felgensatz", price: 1290, ps: 0, nm: 0,
      desc: "Gr\u00F6\u00DFere R\u00E4der stehen dem hohen Aufbau erstaunlich gut." },
    { id: "gsv-grill", cat: "optik", name: "R-Line Wabengrill", price: 219, ps: 0, nm: 0,
      desc: "Originaler R-Line-Grill \u2013 dunkler Auftritt ohne Folie." },
    { id: "gsv-tint", cat: "optik", name: "Scheibent\u00F6nung ab B-S\u00E4ule", price: 249, ps: 0, nm: 0,
      desc: "Beim gro\u00DFen Glashaus doppelt sinnvoll: Optik plus k\u00FChlerer Innenraum." },
    { id: "gsv-brakes", cat: "bremsen", name: "ATE Ceramic + Scheiben VA", price: 349, ps: 0, nm: 0,
      desc: "Staubarme Bel\u00E4ge, frische Scheiben \u2013 passend zu 400 Nm." },
  ],
  bmw430: [
    { id: "bmw-s1", cat: "motor", name: "Stage 1 Kennfeld", price: 799, ps: 50, nm: 80, group: "software",
      desc: "252 \u2192 ca. 302 PS, 430 Nm \u2013 auf Serienhardware, der B48 steckt das locker weg." },
    { id: "bmw-s2", cat: "motor", name: "Stage 2 Kennfeld", price: 999, ps: 68, nm: 110, group: "software", requires: ["bmw-dp"],
      desc: "Ca. 320 PS / 460 Nm \u2013 braucht freien Abgasweg, deshalb nur mit Downpipe." },
    { id: "bmw-dp", cat: "motor", name: "Downpipe mit 200-Zellen-Kat", price: 749, ps: 8, nm: 12,
      desc: "Weniger Abgasgegendruck, schnelleres Ansprechen \u2013 Sportkat statt Kat-Ersatz, Eintragung Pflicht." },
    { id: "bmw-fmic", cat: "motor", name: "Wagner Ladeluftk\u00FChler", price: 849, ps: 0, nm: 0,
      desc: "Konstante Ladelufttemperatur auch bei Volllast \u2013 sichert die Stage-Leistung ab." },
    { id: "bmw-intake", cat: "motor", name: "Sport-Ansaugkit", price: 329, ps: 5, nm: 5,
      desc: "Besserer Luftdurchsatz, sch\u00F6neres Ansauggrollen." },
    { id: "bmw-esd", cat: "motor", name: "Klappen-Endschalld\u00E4mpfer", price: 1090, ps: 0, nm: 0,
      desc: "Per Knopfdruck von dezent bis pr\u00E4sent \u2013 mit Gutachten." },
    { id: "bmw-kw", cat: "fahrwerk", name: "KW V1 Gewindefahrwerk", price: 1299, ps: 0, nm: 0, group: "fahrwerk-basis",
      desc: "Souver\u00E4ner Premium-Standard f\u00FCrs F36-Fahrwerk." },
    { id: "bmw-hr", cat: "fahrwerk", name: "H&R Federn ~30 mm", price: 319, ps: 0, nm: 0, group: "fahrwerk-basis",
      desc: "Schlie\u00DFt die Radhausl\u00FCcke \u2013 Komfort bleibt erhalten." },
    { id: "bmw-spur", cat: "fahrwerk", name: "Spurplatten 2\u00D712 mm", price: 149, ps: 0, nm: 0,
      desc: "B\u00FCndiger Stand \u2013 beim Gran Coup\u00E9 Pflichtprogramm." },
    { id: "bmw-wheels", cat: "optik", name: "19\u2033 M-Style-Felgensatz", price: 1690, ps: 0, nm: 0,
      desc: "Doppelspeichen im M-Performance-Look \u2013 f\u00FCllt die Radh\u00E4user perfekt." },
    { id: "bmw-lip", cat: "optik", name: "M-Performance Frontlippe", price: 389, ps: 0, nm: 0,
      desc: "Schwarz gl\u00E4nzende Frontlippe \u2013 dr\u00FCckt die Front optisch tiefer." },
    { id: "bmw-spoiler", cat: "optik", name: "Heckspoiler (M4-Look)", price: 199, ps: 0, nm: 0,
      desc: "Dezente Abrisskante auf dem Kofferraum." },
    { id: "bmw-tint", cat: "optik", name: "Scheibent\u00F6nung ab B-S\u00E4ule", price: 269, ps: 0, nm: 0,
      desc: "Dunkles Heck \u2013 unterstreicht die lange Coup\u00E9-Linie." },
    { id: "bmw-brakes", cat: "bremsen", name: "EBC Bel\u00E4ge + Scheiben VA", price: 449, ps: 0, nm: 0,
      desc: "Standfester bei 320 PS \u2013 ohne gleich die M-Sportbremse zu bezahlen." },
  ],
};

const CATS = [
  { id: "motor", label: "Motor / Leistung", Icon: Gauge, laborH: 1.5 },
  { id: "fahrwerk", label: "Fahrwerk", Icon: MoveVertical, laborH: 3.5 },
  { id: "optik", label: "Optik", Icon: Paintbrush, laborH: 1.0 },
  { id: "bremsen", label: "Bremsen", Icon: Disc, laborH: 2.0 },
];

/* ---------------- Krasse Vergleichspreise ---------------- */

const COMPARE = [
  { price: 7, one: "D\u00F6ner", many: "D\u00F6ner", emoji: "\uD83E\uDD59" },
  { price: 12, one: "Big-Tasty-Men\u00FC", many: "Big-Tasty-Men\u00FCs", emoji: "\uD83C\uDF54" },
  { price: 19, one: "Kasten Augustiner", many: "K\u00E4sten Augustiner", emoji: "\uD83C\uDF7A" },
  { price: 95, one: "Tankf\u00FCllung Super", many: "Tankf\u00FCllungen Super", emoji: "\u26FD" },
  { price: 156, one: "Jahr Netflix", many: "Jahre Netflix", emoji: "\uD83D\uDCFA" },
  { price: 450, one: "PlayStation 5", many: "PlayStation 5", emoji: "\uD83C\uDFAE" },
  { price: 1500, one: "gebrauchter Polo 6N", many: "gebrauchte Polo 6N", emoji: "\uD83D\uDE97" },
  { price: 1800, one: "Woche Malediven (All-in)", many: "Wochen Malediven (All-in)", emoji: "\uD83C\uDFDD\uFE0F" },
  { price: 2500, one: "kompletter zweiter Audi A4 B6", many: "komplette weitere Audi A4 B6", emoji: "\uD83D\uDD30" },
  { price: 6800, one: "gebrauchte Rolex Datejust", many: "gebrauchte Rolex Datejust", emoji: "\u231A" },
];

const fmtEUR = (n) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickComparisons(total, seed) {
  const pool = COMPARE
    .map((c) => ({ ...c, count: Math.floor(total / c.price) }))
    .filter((c) => c.count >= 1 && c.count <= 999);
  if (!pool.length) return [];
  const rand = mulberry32(seed * 7919 + Math.round(total));
  const shuffled = [...pool].sort(() => rand() - 0.5);
  return shuffled.slice(0, Math.min(2, shuffled.length));
}

/* ---------------- Fahrzeug-Silhouetten (SVG) ---------------- */


/* ---------------- Mod-Karte ---------------- */

const GROUP_LABELS = {
  software: "Software \u2013 nur 1 w\u00E4hlbar",
  "fahrwerk-basis": "Fahrwerk-Basis \u2013 nur 1 w\u00E4hlbar",
};

function ModCard({ mod, allMods, on, onToggle }) {
  const reqNames = (mod.requires || [])
    .map((r) => (allMods.find((x) => x.id === r) || {}).name)
    .filter(Boolean);
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      className={"tl-mod" + (on ? " on" : "")}
      onClick={onToggle}
    >
      <div className="tl-modtop">
        <span className="tl-checkbox">{on && <Check size={14} strokeWidth={3} />}</span>
        <span className="tl-modname">{mod.name}</span>
        <span className="tl-modprice tl-mono">{fmtEUR(mod.price)}</span>
      </div>
      <div className="tl-moddesc">{mod.desc}</div>
      {(mod.ps > 0 || mod.nm > 0 || reqNames.length > 0 || mod.group) && (
        <div className="tl-modmeta">
          {mod.ps > 0 && <span className="tl-badge ps tl-mono">+{mod.ps} PS</span>}
          {mod.nm > 0 && <span className="tl-badge nm tl-mono">+{mod.nm} Nm</span>}
          {reqNames.map((n) => (
            <span key={n} className="tl-badge req">
              <Link2 size={11} /> Setzt voraus: {n}
            </span>
          ))}
          {mod.group && <span className="tl-badge grp">{GROUP_LABELS[mod.group]}</span>}
        </div>
      )}
    </button>
  );
}

/* ---------------- Build Sheet ---------------- */

function BuildSheet({ car, mods, totals, laborCost, installOn, buildCode, onCopyCode, onClose }) {
  const date = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric",
  }).format(new Date());

  React.useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="tl-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
      >
        <div className="tl-sheetactions">
          <button className="tl-sheetclose" onClick={() => window.print()}>
            <ScrollText size={15} /> Als PDF speichern
          </button>
          <button className="tl-sheetclose" onClick={onClose}>
            <X size={15} /> Schlie&szlig;en
          </button>
        </div>
        <div className="tl-sheet">
          <div className="tl-sheethead">
            <div className="brand tl-display">Tuning Lab</div>
            <div className="tl-sheetcar tl-display">{car.name}</div>
            <div className="tl-sheetengine tl-mono">{car.engine}</div>
            <div style={{ maxWidth: 290, margin: "8px auto 0" }}>
              <CarIllustration car={car} sel={new Set(mods.map((m) => m.id))} />
            </div>
          </div>
          <div className="tl-sheetbody">
            {CATS.map((cat) => {
              const list = mods.filter((m) => m.cat === cat.id);
              if (!list.length) return null;
              return (
                <div className="tl-sheetcat" key={cat.id}>
                  <h4 className="tl-display">{cat.label}</h4>
                  {list.map((m) => (
                    <div className="tl-sheetline" key={m.id}>
                      <span>
                        {m.name}
                        {m.ps > 0 ? ` (+${m.ps} PS)` : ""}
                      </span>
                      <span className="dots" />
                      <span className="tl-mono">{fmtEUR(m.price)}</span>
                    </div>
                  ))}
                </div>
              );
            })}
            <div className="tl-sheettotals">
              <div className="tl-sheetbig">
                <span>Teilekosten gesamt</span>
                <b className="tl-mono">{fmtEUR(totals.price)}</b>
              </div>
              {installOn && (
                <div className="tl-sheetbig">
                  <span>Einbau (grobe Sch&auml;tzung)</span>
                  <b className="tl-mono">+{fmtEUR(laborCost)}</b>
                </div>
              )}
              <div className="tl-sheetbig">
                <span>Leistungsplus</span>
                <b className="tl-mono amber">+{totals.ps} PS / +{totals.nm} Nm</b>
              </div>
              <div className="tl-sheetbig">
                <span>Endleistung ca.</span>
                <b className="tl-mono amber" style={{ fontSize: 26 }}>{car.basePS + totals.ps} PS</b>
              </div>
              <div className="tl-sheetbig">
                <span>Drehmoment ca.</span>
                <b className="tl-mono">{car.baseNM + totals.nm} Nm</b>
              </div>
            </div>
            {buildCode && (
              <div className="tl-sheetcode">
                <span className="lbl">Build-Code zum Teilen</span>
                <code className="tl-mono">{buildCode}</code>
                <button className="tl-iconbtn tl-noprint" onClick={onCopyCode} title="Code kopieren">
                  Kopieren
                </button>
              </div>
            )}
            <div className="tl-sheetfoot">
              Konfiguriert am {date} &middot; Preise: ca.-Marktpreise DE, ohne {installOn ? "Eintragung" : "Einbau & Eintragung"}
              <br />
              Addierte Herstellerangaben &ndash; der Pr&uuml;fstand hat das letzte Wort.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- App ---------------- */

export default function TuningLab() {
  const [carId, setCarId] = useState(null);
  const [selected, setSelected] = useState({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [seed, setSeed] = useState(1);
  const [toast, setToast] = useState(null);
  const [installOn, setInstallOn] = useState(false);
  const [imprintOpen, setImprintOpen] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [heroView, setHeroView] = useState("live");
  const toastTimer = React.useRef(null);

  const car = carId ? CARS.find((c) => c.id === carId) : null;
  const selSet = new Set(selected[carId] || []);

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  const toggleMod = (mod) => {
    const mods = MODS[carId];
    const cur = new Set(selected[carId] || []);

    if (cur.has(mod.id)) {
      cur.delete(mod.id);
      const removed = [];
      let changed = true;
      while (changed) {
        changed = false;
        for (const m of mods) {
          if (cur.has(m.id) && (m.requires || []).some((r) => !cur.has(r))) {
            cur.delete(m.id);
            removed.push(m.name);
            changed = true;
          }
        }
      }
      if (removed.length) {
        showToast("\u2212 " + removed.join(", ") + " mit abgew\u00E4hlt (Voraussetzung fehlt)");
      }
    } else {
      if (mod.group) {
        for (const m of mods) {
          if (m.group === mod.group && cur.has(m.id)) cur.delete(m.id);
        }
      }
      cur.add(mod.id);
      const added = [];
      const addReq = (m) => {
        for (const rid of m.requires || []) {
          if (!cur.has(rid)) {
            const rm = mods.find((x) => x.id === rid);
            if (rm) {
              if (rm.group) {
                for (const o of mods) {
                  if (o.group === rm.group && cur.has(o.id)) cur.delete(o.id);
                }
              }
              cur.add(rm.id);
              added.push(rm.name);
              addReq(rm);
            }
          }
        }
      };
      addReq(mod);
      if (added.length) {
        showToast("+ " + added.join(", ") + " automatisch mit ausgew\u00E4hlt (Voraussetzung f\u00FCr " + mod.name + ")");
      }
    }
    setSelected({ ...selected, [carId]: [...cur] });
  };

  const totals = useMemo(() => {
    if (!carId) return { price: 0, ps: 0, nm: 0 };
    const set = new Set(selected[carId] || []);
    return MODS[carId].reduce(
      (a, m) => (set.has(m.id) ? { price: a.price + m.price, ps: a.ps + m.ps, nm: a.nm + m.nm } : a),
      { price: 0, ps: 0, nm: 0 }
    );
  }, [carId, selected]);

  const maxPs = useMemo(() => {
    if (!carId) return 0;
    const groups = {};
    let solo = 0;
    for (const m of MODS[carId]) {
      if (m.group) groups[m.group] = Math.max(groups[m.group] || 0, m.ps);
      else solo += m.ps;
    }
    return solo + Object.values(groups).reduce((a, b) => a + b, 0);
  }, [carId]);

  const comparisons = useMemo(
    () => (totals.price > 0 ? pickComparisons(totals.price, seed) : []),
    [totals.price, seed]
  );

  const finalPS = car ? car.basePS + totals.ps : 0;
  const finalNM = car ? car.baseNM + totals.nm : 0;
  const scale = car ? car.basePS + maxPs : 1;
  const selCountTotal = (selected[carId] || []).length;

  const laborCost = useMemo(() => {
    if (!carId) return 0;
    const set = new Set(selected[carId] || []);
    let h = 0;
    for (const m of MODS[carId]) {
      if (set.has(m.id)) {
        const cat = CATS.find((c) => c.id === m.cat);
        h += cat ? cat.laborH : 1.5;
      }
    }
    return Math.round(h * STUNDENSATZ);
  }, [carId, selected]);

  const grandTotal = totals.price + (installOn ? laborCost : 0);
  const accelNew = car ? accelEstimate(car.accel, car.basePS, finalPS) : null;
  const buildCode = car && selCountTotal > 0 ? encodeBuild(carId, selected[carId]) : "";

  const resetBuild = () => {
    if (!carId) return;
    setSelected({ ...selected, [carId]: [] });
    showToast("Konfiguration zur\u00FCckgesetzt \u2013 zur\u00FCck auf Serie");
  };

  const copyBuildCode = () => {
    if (!buildCode) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(buildCode).then(
        () => showToast("Build-Code kopiert \u2013 schick ihn deinen Jungs \uD83D\uDD27"),
        () => showToast("Kopieren blockiert \u2013 Code bitte manuell markieren")
      );
    } else {
      showToast("Kopieren nicht verf\u00FCgbar \u2013 Code bitte manuell markieren");
    }
  };

  const loadBuildCode = () => {
    const res = decodeBuild(codeInput);
    if (!res) {
      showToast("Build-Code ung\u00FCltig \u2013 bitte pr\u00FCfen");
      return;
    }
    setSelected({ ...selected, [res.carId]: res.ids });
    setCarId(res.carId);
    setCodeInput("");
    const c = CARS.find((x) => x.id === res.carId);
    showToast("Build geladen: " + (c ? c.name : res.carId) + " mit " + res.ids.length + " Mods");
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="tl-root">
      <style>{css}</style>
      <PaintDefs />
      <div className="tl-wrap">
        <header className="tl-header">
          <div>
            <div className="tl-logo tl-display">
              <span className="bar" />Tuning Lab
            </div>
            <div className="tl-sub">
              Konfigurator mit echten Mods und realistischen Marktpreisen (DE).
              Basis w&auml;hlen, durchs Teilelager klicken &ndash; unten l&auml;uft die Rechnung live mit.
            </div>
          </div>
          {car && <div className="tl-kicker tl-display">Projekt: {car.name}</div>}
        </header>

        {!car && (
          <>
            <div className="tl-kicker tl-display" style={{ marginBottom: 10 }}>
              Schritt 1 &middot; Basis w&auml;hlen
            </div>
            <div className="tl-cargrid">
              {CARS.map((c) => (
                <button
                  key={c.id}
                  className="tl-carcard"
                  onClick={() => {
                    setCarId(c.id);
                    window.scrollTo({ top: 0 });
                  }}
                >
                  <CarPhoto car={c} />
                  <div>
                    <div className="tl-carname tl-display">{c.name}</div>
                    <div className="tl-carsub">{c.sub}</div>
                  </div>
                  <div className="tl-specrow">
                    <div className="tl-spec">
                      <b className="tl-mono">{c.basePS}</b>
                      <span>PS Serie</span>
                    </div>
                    <div className="tl-spec">
                      <b className="tl-mono">{c.baseNM}</b>
                      <span>Nm Serie</span>
                    </div>
                    <div className="tl-flag">{c.flag}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="tl-codebox">
              <div className="tl-kicker tl-display">Build-Code von einem Kumpel?</div>
              <div className="tl-coderow">
                <input
                  className="tl-codeinput tl-mono"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder={"Code hier einf\u00FCgen \u2026"}
                  spellCheck={false}
                />
                <button className="tl-btn" disabled={!codeInput.trim()} onClick={loadBuildCode}>
                  Laden
                </button>
              </div>
            </div>
            <footer className="tl-footer" style={{ marginTop: 22 }}>
              Privates Hobby-Projekt &middot; Preise = ca.-Marktwerte (DE) ohne Gew&auml;hr.{" "}
              <button className="tl-linkbtn" onClick={() => setImprintOpen(true)}>Impressum &amp; Datenschutz</button>
            </footer>
          </>
        )}

        {car && (
          <>
            <button className="tl-back" onClick={() => setCarId(null)}>
              <ChevronLeft size={16} /> Andere Basis w&auml;hlen
            </button>

            <div className="tl-hero">
              <div className="sil">
                <div className="tl-herotabs" role="tablist">
                  <button
                    className={heroView === "live" ? "on" : ""}
                    onClick={() => setHeroView("live")}
                  >
                    Live-Ansicht
                  </button>
                  <button
                    className={heroView === "photo" ? "on" : ""}
                    onClick={() => setHeroView("photo")}
                  >
                    Foto
                  </button>
                </div>
                {heroView === "photo" ? (
                  <CarPhoto
                    key={carId}
                    car={car}
                    fallback={
                      <div className="tl-photomiss">
                        Foto gerade nicht verf&uuml;gbar &ndash; lege{" "}
                        <span className="tl-mono">img/{carId}.jpg</span> ins Repo
                        (siehe <span className="tl-mono">download-images.sh</span>).
                      </div>
                    }
                  />
                ) : (
                  <CarIllustration car={car} sel={selSet} />
                )}
                <div className="tl-silcap">
                  {heroView === "photo"
                    ? "Originalfoto (Serie) \u2013 deine Mods siehst du in der Live-Ansicht"
                    : "Live-Ansicht \u2013 reagiert auf deine Auswahl"}
                </div>
              </div>
              <div className="tl-heroinfo">
                <div className="tl-heroname tl-display">{car.name}</div>
                <div className="tl-heroengine tl-display">{car.engine}</div>
                <div className="tl-note">
                  <Info size={16} />
                  <span>{car.note}</span>
                </div>
              </div>
            </div>

            <div className="tl-power">
              <div className="tl-powerlabels">
                <span>Leistung</span>
                <span>Vollausbau ca. {scale} PS</span>
              </div>
              <div className="tl-powertrack">
                <div className="tl-powerbase" style={{ width: (car.basePS / scale) * 100 + "%" }} />
                <div className="tl-powergain" style={{ width: (totals.ps / scale) * 100 + "%" }} />
              </div>
              <div className="tl-powercaption">
                <span>
                  Aktuell: <b className="tl-mono">{finalPS} PS</b> &middot; <b className="tl-mono">{finalNM} Nm</b>
                  {car.accel ? (
                    <>
                      {" "}&middot; 0&ndash;100: <b className="tl-mono">
                        {accelNew ? car.accel.toFixed(1) + " \u2192 ca. " + accelNew.toFixed(1) + " s" : car.accel.toFixed(1) + " s"}
                      </b>
                    </>
                  ) : null}
                </span>
                <span>
                  {totals.ps > 0 || totals.nm > 0
                    ? "+" + totals.ps + " PS \u00B7 +" + totals.nm + " Nm gegen\u00FCber Serie"
                    : "Serienzustand"}
                </span>
              </div>
            </div>

            {CATS.map((cat) => {
              const list = MODS[carId].filter((m) => m.cat === cat.id);
              if (!list.length) return null;
              const selCount = list.filter((m) => selSet.has(m.id)).length;
              return (
                <section key={cat.id} className="tl-cat">
                  <div className="tl-cathead">
                    <cat.Icon size={18} />
                    <h3 className="tl-display">{cat.label}</h3>
                    <span className="count tl-mono">{selCount}/{list.length} gew&auml;hlt</span>
                  </div>
                  <div className="tl-modgrid">
                    {list.map((m) => (
                      <ModCard
                        key={m.id}
                        mod={m}
                        allMods={MODS[carId]}
                        on={selSet.has(m.id)}
                        onToggle={() => toggleMod(m)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            <footer className="tl-footer">
              Preise sind ca.-Marktpreise aus deutschen Shops (Stand 06/2026), ohne Montage und Eintragung.
              Leistungsangaben laut Hersteller/Tuner &ndash; reale Werte streuen.
              Viele Umbauten sind eintragungspflichtig (ABE, Teilegutachten oder Einzelabnahme) &ndash;
              vor dem Schrauben kurz mit T&Uuml;V oder Tuner sprechen.
              <br />
              <button className="tl-linkbtn" onClick={() => setImprintOpen(true)}>Impressum &amp; Datenschutz</button>
            </footer>
          </>
        )}
      </div>

      {car && (
        <div className="tl-summary">
          <div className="tl-summaryin">
            <div className="tl-sumblock">
              <b className="tl-mono">{fmtEUR(grandTotal)}</b>
              <span>{installOn ? "Teile + Einbau (ca.)" : "Teilekosten"}</span>
            </div>
            <div className="tl-sumblock">
              <b className="tl-mono gain">+{totals.ps} PS</b>
              <span>Leistung</span>
            </div>
            <div className="tl-sumblock">
              <b className="tl-mono gain-nm">+{totals.nm} Nm</b>
              <span>Drehmoment</span>
            </div>
            <div className="tl-sumblock">
              <b className="tl-mono">{finalPS} PS</b>
              <span>Endleistung</span>
            </div>
            <button className="tl-btn" disabled={selCountTotal === 0} onClick={() => setSheetOpen(true)}>
              <ScrollText size={17} /> Build Sheet
            </button>
            <button
              className={"tl-toggle" + (installOn ? " on" : "")}
              onClick={() => setInstallOn(!installOn)}
              title={"Werkstatt-Einbau grob mitrechnen (" + STUNDENSATZ + " \u20AC/h)"}
            >
              <span className="dot" /> inkl. Einbau {installOn ? "(+" + fmtEUR(laborCost) + ")" : ""}
            </button>
            <button
              className="tl-iconbtn"
              disabled={selCountTotal === 0}
              onClick={resetBuild}
              title={"Alles abw\u00E4hlen"}
              aria-label={"Konfiguration zur\u00FCcksetzen"}
            >
              <X size={15} />
            </button>
            {comparisons.length > 0 && (
              <div className="tl-compare">
                <span>Daf&uuml;r g&auml;b&rsquo;s auch:</span>
                {comparisons.map((c, i) => (
                  <span key={c.one}>
                    {i > 0 && " oder "}
                    <b>
                      &asymp; {c.count}&times; {c.emoji} {c.count === 1 ? c.one : c.many}
                    </b>
                  </span>
                ))}
                <button
                  className="tl-iconbtn"
                  onClick={() => setSeed((s) => s + 1)}
                  title="Andere Vergleiche"
                  aria-label="Andere Vergleiche anzeigen"
                >
                  <Dices size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className="tl-toast" role="status">{toast}</div>
      )}

      {sheetOpen && car && (
        <BuildSheet
          car={car}
          mods={MODS[carId].filter((m) => selSet.has(m.id))}
          totals={totals}
          laborCost={laborCost}
          installOn={installOn}
          buildCode={buildCode}
          onCopyCode={copyBuildCode}
          onClose={() => setSheetOpen(false)}
        />
      )}

      {imprintOpen && <ImprintModal onClose={() => setImprintOpen(false)} />}
    </div>
  );
}

/* ============================================================
   Illustrationen v2 — farbige Zeichnungen, reagieren auf Mods
   ============================================================ */

const EMPTY_SET = new Set();

function PaintDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="tl-paint-a4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2e6ec" />
          <stop offset="0.55" stopColor="#aeb6c1" />
          <stop offset="1" stopColor="#7d8694" />
        </linearGradient>
        <linearGradient id="tl-paint-tt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6f9fdd" />
          <stop offset="0.55" stopColor="#3f6cae" />
          <stop offset="1" stopColor="#27497c" />
        </linearGradient>
        <linearGradient id="tl-paint-clk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b04a59" />
          <stop offset="0.55" stopColor="#84303f" />
          <stop offset="1" stopColor="#561d28" />
        </linearGradient>
        <linearGradient id="tl-paint-i30" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6f8fb" />
          <stop offset="0.55" stopColor="#d7dde6" />
          <stop offset="1" stopColor="#aeb7c4" />
        </linearGradient>
        <linearGradient id="tl-paint-fie" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9534a" />
          <stop offset="0.55" stopColor="#b03228" />
          <stop offset="1" stopColor="#7e1f17" />
        </linearGradient>
        <linearGradient id="tl-paint-g6" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8da2b8" />
          <stop offset="0.55" stopColor="#64798f" />
          <stop offset="1" stopColor="#465769" />
        </linearGradient>
        <linearGradient id="tl-paint-gsv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4f58" />
          <stop offset="0.45" stopColor="#2b2e35" />
          <stop offset="1" stopColor="#17191e" />
        </linearGradient>
        <linearGradient id="tl-paint-bmw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a7cc9" />
          <stop offset="0.55" stopColor="#2d5499" />
          <stop offset="1" stopColor="#1c3868" />
        </linearGradient>
        <linearGradient id="tl-glassgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#41566f" />
          <stop offset="1" stopColor="#131d29" />
        </linearGradient>
        <linearGradient id="tl-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3f7fb" />
          <stop offset="1" stopColor="#94a0af" />
        </linearGradient>
        <linearGradient id="tl-redlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e05445" />
          <stop offset="1" stopColor="#8e251c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* Rad: Serienfelge (5 Speichen) oder Aftermarket (Mehrspeicher),
   Bremsscheibe + Sattel blitzen zwischen den Speichen hervor. */
function Wheel({ cx, upgraded, brake }) {
  const cy = 87;
  const rTire = 17.5;
  const rRim = upgraded ? 13 : 11;
  const spokes = upgraded ? 9 : 5;
  const spokeArr = Array.from({ length: spokes });
  return (
    <g>
      <circle cx={cx} cy={cy} r={rTire} fill="#14171c" stroke="#05070a" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={rRim} fill="#171b21" />
      <circle cx={cx} cy={cy} r={brake ? 8.8 : 7.8} fill="#79818d" />
      <circle cx={cx} cy={cy} r={brake ? 8.8 : 7.8} fill="none" stroke="#565d68" strokeWidth="0.8" />
      <rect
        x={cx + 2} y={cy - 9.2} width="4.6" height="7.6" rx="2"
        fill={brake ? "var(--amber)" : "#6a727d"}
        stroke="#0c0e11" strokeWidth="0.6"
        transform={"rotate(24 " + cx + " " + cy + ")"}
      />
      {spokeArr.map((_, i) => (
        <rect
          key={i}
          x={cx - (upgraded ? 0.75 : 1.3)}
          y={cy - rRim + 0.6}
          width={upgraded ? 1.5 : 2.6}
          height={rRim - 2.2}
          rx="0.8"
          fill={upgraded ? "#d3d9e1" : "#a7aeb8"}
          transform={"rotate(" + (360 / spokes) * i + " " + cx + " " + cy + ")"}
        />
      ))}
      <circle cx={cx} cy={cy} r={rRim} fill="none"
        stroke={upgraded ? "#e4e9ef" : "#99a1ab"} strokeWidth={upgraded ? 2.2 : 1.6} />
      {upgraded && (
        <circle cx={cx} cy={cy} r={rRim - 2.2} fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="0.8" />
      )}
      <circle cx={cx} cy={cy} r="2.2" fill="#2a2f37" stroke="#c8cfd8" strokeWidth="0.8" />
    </g>
  );
}

function Ground() {
  return (
    <g>
      <ellipse cx="130" cy="105.5" rx="112" ry="3.5" fill="#000" opacity="0.38" />
      <rect x="22" y="104.8" width="216" height="2.4" rx="1.2" fill="var(--amber)" opacity="0.75" />
    </g>
  );
}

/* ---------- Audi A4 B6 (Limousine, Silber) ---------- */
function ArtA4({ sel }) {
  const drop = sel.has("a4-kwv1") || sel.has("a4-bc") ? 7 : sel.has("a4-hr") ? 4 : 0;
  const BODY =
    "M18 84 L16 70 Q16 60 30 57 L82 51 Q87 50 91 46 L107 34 Q112 30 121 30 " +
    "L159 30 Q168 30 174 35 L193 49 Q198 52 207 53 L234 56 Q245 58 245 68 L245 84 " +
    "L221 84 A23 23 0 0 1 175 84 L87 84 A23 23 0 0 1 41 84 Z";
  return (
    <svg viewBox="0 0 260 118" width="100%" role="img" aria-hidden="true">
      <Ground />
      <g className="tl-body" style={{ transform: "translateY(" + drop + "px)" }}>
        <clipPath id="tl-clip-a4"><path d={BODY} /></clipPath>
        <path d={BODY} fill="url(#tl-paint-a4)" stroke="#5d6673" strokeWidth="1.4" strokeLinejoin="round" />
        <g clipPath="url(#tl-clip-a4)">
          <rect x="14" y="77" width="234" height="9" fill="rgba(0,0,0,.22)" />
          <line x1="32" y1="64" x2="234" y2="60.5" stroke="rgba(255,255,255,.4)" strokeWidth="1" />
        </g>
        <path d="M96 49 L111 36 L131 36 L131 49 Z" fill="url(#tl-glassgrad)" />
        <path d="M137 49 L137 36 L157 36 L177 49 Z" fill="url(#tl-glassgrad)" />
        <path d="M98 48 L92 43.5 L98 42.5 Z" fill="url(#tl-paint-a4)" stroke="#5d6673" strokeWidth="0.8" />
        <rect x="118" y="56.5" width="6" height="1.7" rx="0.8" fill="rgba(0,0,0,.4)" />
        <rect x="150" y="56" width="6" height="1.7" rx="0.8" fill="rgba(0,0,0,.4)" />
        <path d="M17 59.5 L33 57 L33 62 L17.5 63.5 Z" fill="url(#tl-chrome)" stroke="#5d6673" strokeWidth="0.5" />
        <circle cx="31" cy="61.5" r="1.1" fill="var(--amber)" />
        {sel.has("a4-grill") ? (
          <g>
            <path d="M16.3 65.5 L21.5 65 L21.5 73 L16.9 73.5 Z" fill="#0b0d10" stroke="#1f242b" strokeWidth="0.8" />
            <circle cx="18.4" cy="67.4" r="0.7" fill="#262c34" />
            <circle cx="19.8" cy="68.9" r="0.7" fill="#262c34" />
            <circle cx="18.4" cy="70.4" r="0.7" fill="#262c34" />
            <circle cx="19.8" cy="71.9" r="0.7" fill="#262c34" />
          </g>
        ) : (
          <g>
            <path d="M16.3 65.5 L21.5 65 L21.5 73 L16.9 73.5 Z" fill="#23282f" stroke="#aab2bd" strokeWidth="0.9" />
            <line x1="17" y1="68" x2="21" y2="67.7" stroke="#aab2bd" strokeWidth="0.7" />
            <line x1="17" y1="70.5" x2="21" y2="70.2" stroke="#aab2bd" strokeWidth="0.7" />
          </g>
        )}
        {sel.has("a4-tail") ? (
          <path d="M239 56.5 L245 58 L245 64.5 L239 63.5 Z" fill="#2c1b20" stroke="#7e2c25" strokeWidth="0.7" />
        ) : (
          <path d="M239 56.5 L245 58 L245 64.5 L239 63.5 Z" fill="url(#tl-redlight)" stroke="#6e211a" strokeWidth="0.5" />
        )}
        {sel.has("a4-esd") ? (
          <rect x="242" y="77.5" width="10" height="4.6" rx="2.3" fill="url(#tl-chrome)" stroke="#5d6673" strokeWidth="0.6" />
        ) : (
          <rect x="243.5" y="79" width="7" height="3" rx="1.5" fill="#3a414b" />
        )}
      </g>
      <Wheel cx={64} upgraded={sel.has("a4-wheels")} brake={sel.has("a4-brakes")} />
      <Wheel cx={198} upgraded={sel.has("a4-wheels")} brake={sel.has("a4-brakes")} />
    </svg>
  );
}

/* ---------- Audi TT 8N (Kuppel-Coupé, Blau) ---------- */
function ArtTT({ sel }) {
  const drop = sel.has("tt-kwv3") || sel.has("tt-bc") ? 7 : 0;
  const BODY =
    "M18 84 L16 72 Q16 62 30 59 L70 53 Q132 6 206 54 L234 59 Q245 62 245 72 L245 84 " +
    "L221 84 A23 23 0 0 1 175 84 L87 84 A23 23 0 0 1 41 84 Z";
  return (
    <svg viewBox="0 0 260 118" width="100%" role="img" aria-hidden="true">
      <Ground />
      <g className="tl-body" style={{ transform: "translateY(" + drop + "px)" }}>
        <clipPath id="tl-clip-tt"><path d={BODY} /></clipPath>
        <path d={BODY} fill="url(#tl-paint-tt)" stroke="#1d3354" strokeWidth="1.4" strokeLinejoin="round" />
        <g clipPath="url(#tl-clip-tt)">
          <rect x="14" y="77" width="234" height="9" fill="rgba(0,0,0,.25)" />
          <line x1="32" y1="66" x2="232" y2="63" stroke="rgba(255,255,255,.35)" strokeWidth="1" />
        </g>
        <path d="M86 51 Q132 20 196 51 Z" fill="url(#tl-glassgrad)" />
        <path d="M137 51 L140 29.8 L144 30 L141 51 Z" fill="url(#tl-paint-tt)" />
        <path d="M170 51 L178 39 Q188 44 196 51 Z" fill="url(#tl-paint-tt)" />
        <path d="M92 50 L86 45.5 L92 44.5 Z" fill="url(#tl-paint-tt)" stroke="#1d3354" strokeWidth="0.8" />
        <rect x="122" y="58" width="6" height="1.7" rx="0.8" fill="rgba(0,0,0,.45)" />
        <ellipse cx="26" cy="58.5" rx="8" ry="4.2" fill="url(#tl-chrome)" stroke="#1d3354" strokeWidth="0.6" />
        <path d="M16.3 66 L22 65.5 L22 74 L17 74.5 Z" fill="#10151c" stroke="#2c3a4e" strokeWidth="0.7" />
        {sel.has("tt-fmic") && (
          <g>
            <rect x="17" y="74.5" width="11" height="7.5" rx="1" fill="url(#tl-chrome)" />
            <line x1="18" y1="76.4" x2="27" y2="76.4" stroke="#7a8694" strokeWidth="0.7" />
            <line x1="18" y1="78.3" x2="27" y2="78.3" stroke="#7a8694" strokeWidth="0.7" />
            <line x1="18" y1="80.2" x2="27" y2="80.2" stroke="#7a8694" strokeWidth="0.7" />
          </g>
        )}
        {sel.has("tt-wing") && (
          <g>
            <rect x="208" y="52.5" width="1.6" height="3.2" fill="#171b21" />
            <rect x="226" y="54.5" width="1.6" height="3.2" fill="#171b21" />
            <path d="M203 52.5 L233 56 L234 52.6 L205 49.2 Z" fill="#171b21" stroke="#2c3a4e" strokeWidth="0.6" />
          </g>
        )}
        <path d="M239 58 L245 59.8 L245 66 L239 64.8 Z" fill="url(#tl-redlight)" stroke="#6e211a" strokeWidth="0.5" />
        {sel.has("tt-exhaust") ? (
          <rect x="241" y="77" width="11" height="5.4" rx="2.7" fill="url(#tl-chrome)" stroke="#1d3354" strokeWidth="0.6" />
        ) : (
          <rect x="243" y="79" width="8" height="3.4" rx="1.7" fill="#3a414b" />
        )}
      </g>
      <Wheel cx={64} upgraded={sel.has("tt-wheels")} brake={sel.has("tt-brakes")} />
      <Wheel cx={198} upgraded={sel.has("tt-wheels")} brake={sel.has("tt-brakes")} />
    </svg>
  );
}

/* ---------- Mercedes CLK W209 (Coupé, Granatrot) ---------- */
function ArtCLK({ sel }) {
  const drop = sel.has("clk-b12") ? 5 : sel.has("clk-hr") ? 4 : 0;
  const BODY =
    "M18 84 L16 71 Q16 61 30 58 L98 51 Q103 50 107 46 L120 34 Q124 30 133 30 " +
    "L156 30 Q166 30 174 37 Q192 50 212 53 L236 56 Q245 58 245 69 L245 84 " +
    "L221 84 A23 23 0 0 1 175 84 L87 84 A23 23 0 0 1 41 84 Z";
  return (
    <svg viewBox="0 0 260 118" width="100%" role="img" aria-hidden="true">
      <Ground />
      <g className="tl-body" style={{ transform: "translateY(" + drop + "px)" }}>
        <clipPath id="tl-clip-clk"><path d={BODY} /></clipPath>
        <path d={BODY} fill="url(#tl-paint-clk)" stroke="#3a1219" strokeWidth="1.4" strokeLinejoin="round" />
        <g clipPath="url(#tl-clip-clk)">
          <rect x="14" y="77" width="234" height="9" fill="rgba(0,0,0,.25)" />
          <line x1="32" y1="64.5" x2="234" y2="61" stroke="rgba(255,255,255,.3)" strokeWidth="1" />
        </g>
        <path d="M124 48 L137 36 L153 36 L153 48 Z" fill="url(#tl-glassgrad)" />
        <path d="M159 48 L159 36 L166 36 Q175 41 183 48 Z" fill="url(#tl-glassgrad)" />
        <path d="M126 47.5 L120 43.5 L126 42.5 Z" fill="url(#tl-paint-clk)" stroke="#3a1219" strokeWidth="0.8" />
        <rect x="138" y="56" width="6.5" height="1.7" rx="0.8" fill="rgba(0,0,0,.4)" />
        <path d="M17 57.5 L34 55 Q36.5 57.5 34 60 L17.5 61.5 Z" fill="url(#tl-chrome)" stroke="#3a1219" strokeWidth="0.5" />
        <path d="M16.3 64 L21.5 63.5 L21.5 71 L16.9 71.5 Z" fill="#23282f" stroke="#c9d2dc" strokeWidth="0.8" />
        <line x1="17" y1="66.6" x2="21" y2="66.3" stroke="#c9d2dc" strokeWidth="0.7" />
        <line x1="17" y1="68.8" x2="21" y2="68.5" stroke="#c9d2dc" strokeWidth="0.7" />
        {sel.has("clk-lip") && (
          <path d="M231 55 L244.5 57 L244.5 54.2 L232 52.4 Z" fill="#171b21" stroke="#3a1219" strokeWidth="0.5" />
        )}
        <path d="M238 56.5 L245 58.2 L245 65 L238 63.8 Z" fill="url(#tl-redlight)" stroke="#6e211a" strokeWidth="0.5" />
        <rect x="243" y="78.5" width="8" height="3.4" rx="1.7" fill="#3a414b" />
      </g>
      <Wheel cx={64} upgraded={sel.has("clk-wheels")} brake={sel.has("clk-brakes")} />
      <Wheel cx={198} upgraded={sel.has("clk-wheels")} brake={sel.has("clk-brakes")} />
    </svg>
  );
}

/* ---------- Hyundai i30 N-Line (Hatchback, Polar White) ---------- */
function ArtI30({ sel }) {
  const drop = sel.has("i30-stx") ? 7 : sel.has("i30-eibach") ? 4 : 0;
  const BODY =
    "M18 84 L16 71 Q16 61 30 58 L66 52 Q71 51 75 47 L88 35 Q92 30 101 30 " +
    "L168 30 Q175 30 178 34 L192 56 L235 59 Q245 61 245 71 L245 84 " +
    "L221 84 A23 23 0 0 1 175 84 L87 84 A23 23 0 0 1 41 84 Z";
  return (
    <svg viewBox="0 0 260 118" width="100%" role="img" aria-hidden="true">
      <Ground />
      <g className="tl-body" style={{ transform: "translateY(" + drop + "px)" }}>
        <clipPath id="tl-clip-i30"><path d={BODY} /></clipPath>
        <path d={BODY} fill="url(#tl-paint-i30)" stroke="#7d8694" strokeWidth="1.4" strokeLinejoin="round" />
        <g clipPath="url(#tl-clip-i30)">
          <rect x="14" y="77" width="234" height="9" fill="rgba(0,0,0,.16)" />
          <line x1="32" y1="63.5" x2="230" y2="60.5" stroke="rgba(255,255,255,.6)" strokeWidth="1" />
        </g>
        <path d="M164 27.5 L184 27.5 L181 31 L166 30.5 Z" fill="#1d2127" />
        <path d="M79 49 L95 36.5 L120 36.5 L120 49 Z" fill="url(#tl-glassgrad)" />
        <path d="M126 49 L126 36.5 L167 36.5 Q171 37.5 173 41.5 L177 49 Z"
          fill={sel.has("i30-tint") ? "#0b0f14" : "url(#tl-glassgrad)"} />
        <path d="M81 48.5 L75 44.5 L81 43.5 Z" fill="url(#tl-paint-i30)" stroke="#7d8694" strokeWidth="0.8" />
        <rect x="112" y="56" width="6" height="1.7" rx="0.8" fill="rgba(0,0,0,.35)" />
        <rect x="146" y="55.5" width="6" height="1.7" rx="0.8" fill="rgba(0,0,0,.35)" />
        <path d="M17 58 L33 55.8 L33 60.5 L17.5 62 Z" fill="url(#tl-chrome)" stroke="#7d8694" strokeWidth="0.5" />
        <path d="M16.3 64.5 L21.5 64 L21.5 72.5 L16.9 73 Z" fill="#10141a" stroke="#2a3038" strokeWidth="0.7" />
        <line x1="16.6" y1="74.5" x2="21.5" y2="74.2" stroke="#c2273b" strokeWidth="1" />
        {sel.has("i30-splitter") && (
          <path d="M15.5 80.5 L36 81 L36 84 L16.3 84 Z" fill="#0b0d10" stroke="#23282f" strokeWidth="0.6" />
        )}
        <path d="M186 36 L191 55 L187.5 55 L183 37.5 Z" fill={sel.has("i30-tint") ? "#0b0f14" : "url(#tl-glassgrad)"} />
        <path d="M239 58.5 L245 60 L245 66 L239 65 Z" fill="url(#tl-redlight)" stroke="#6e211a" strokeWidth="0.5" />
        <rect x="243" y="79" width="7.5" height="3.2" rx="1.6" fill="#3a414b" />
      </g>
      <Wheel cx={64} upgraded={sel.has("i30-wheels")} brake={sel.has("i30-discs")} />
      <Wheel cx={198} upgraded={sel.has("i30-wheels")} brake={sel.has("i30-discs")} />
    </svg>
  );
}

/* ---------- Fahrzeugfotos (Wikimedia Commons, Special:FilePath = stabil) ---------- */


/* Foto-Kaskade: 1) lokal img/<id>.jpg  2) Wikimedia-Hotlinks  3) Fallback (SVG) */
function CarPhoto({ car, fallback }) {
  const files = CAR_PHOTOS[car.id] || [];
  const [idx, setIdx] = useState(0);
  const total = 1 + files.length;
  if (idx >= total) {
    return fallback !== undefined ? fallback : <CarIllustration car={car} />;
  }
  const src = idx === 0 ? "img/" + car.id + ".jpg" : wmUrl(files[idx - 1]);
  return (
    <div className="tl-photowrap">
      <img
        className="tl-carphoto"
        src={src}
        alt={car.name}
        loading="lazy"
        onError={() => setIdx(idx + 1)}
      />
    </div>
  );
}

function CarIllustration({ car, sel }) {
  const s = sel || EMPTY_SET;
  if (car.id === "a4b6") return <ArtA4 sel={s} />;
  if (car.id === "tt8n") return <ArtTT sel={s} />;
  if (car.id === "clk320") return <ArtCLK sel={s} />;
  if (car.id === "i30nline") return <ArtI30 sel={s} />;
  if (car.id === "fiesta") return <ArtFiesta sel={s} />;
  if (car.id === "golf6") return <ArtGolf6 sel={s} />;
  if (car.id === "sportsvan") return <ArtSportsvan sel={s} />;
  return <Art430 sel={s} />;
}

/* ---------- Ford Fiesta MK6 (Kleinwagen, Colorado-Rot) ---------- */
function ArtFiesta({ sel }) {
  const drop = sel.has("fie-stx") ? 7 : sel.has("fie-eibach") ? 4 : 0;
  const BODY =
    "M28 84 L26 70 Q26 60 38 57 L64 52 Q69 51 73 47 L84 35 Q88 29 97 29 " +
    "L158 29 Q166 29 169 33 L182 56 L224 59 Q234 61 234 71 L234 84 " +
    "L221 84 A23 23 0 0 1 175 84 L87 84 A23 23 0 0 1 41 84 Z";
  return (
    <svg viewBox="0 0 260 118" width="100%" role="img" aria-hidden="true">
      <Ground />
      <g className="tl-body" style={{ transform: "translateY(" + drop + "px)" }}>
        <clipPath id="tl-clip-fie"><path d={BODY} /></clipPath>
        <path d={BODY} fill="url(#tl-paint-fie)" stroke="#5e1812" strokeWidth="1.4" strokeLinejoin="round" />
        <g clipPath="url(#tl-clip-fie)">
          <rect x="24" y="77" width="214" height="9" fill="rgba(0,0,0,.22)" />
          <line x1="42" y1="63" x2="220" y2="60.5" stroke="rgba(255,255,255,.4)" strokeWidth="1" />
        </g>
        <path d="M156 25.5 L172 25.5 L169.5 29 L158 28.6 Z" fill="#1d2127" />
        <path d="M75 49 L90 36 L113 36 L113 49 Z" fill="url(#tl-glassgrad)" />
        <path d="M119 49 L119 36 L156 36 Q160 37 162 41 L166 49 Z"
          fill={sel.has("fie-tint") ? "#0b0f14" : "url(#tl-glassgrad)"} />
        <path d="M77 48.5 L71 44.5 L77 43.5 Z" fill="url(#tl-paint-fie)" stroke="#5e1812" strokeWidth="0.8" />
        <rect x="108" y="55.5" width="6" height="1.7" rx="0.8" fill="rgba(0,0,0,.4)" />
        <rect x="140" y="55" width="6" height="1.7" rx="0.8" fill="rgba(0,0,0,.4)" />
        <path d="M27 57.5 L42 55.5 L42 60.5 L27.5 62 Z" fill="url(#tl-chrome)" stroke="#5e1812" strokeWidth="0.5" />
        <path d="M26.3 64 L31.5 63.5 L31.5 71.5 L26.9 72 Z" fill="#15181d" stroke="#2a3038" strokeWidth="0.7" />
        {sel.has("fie-lip") && (
          <path d="M25.5 80.5 L44 81 L44 84 L26.3 84 Z" fill="#0b0d10" stroke="#23282f" strokeWidth="0.6" />
        )}
        <path d="M228 56 L234 57.5 L234 66 L228 64.8 Z" fill="url(#tl-redlight)" stroke="#6e211a" strokeWidth="0.5" />
        {sel.has("fie-esd") ? (
          <rect x="230" y="77.5" width="10" height="4.4" rx="2.2" fill="url(#tl-chrome)" stroke="#5e1812" strokeWidth="0.6" />
        ) : (
          <rect x="231.5" y="79" width="7" height="3" rx="1.5" fill="#3a414b" />
        )}
      </g>
      <Wheel cx={64} upgraded={sel.has("fie-wheels")} brake={sel.has("fie-brakes")} />
      <Wheel cx={198} upgraded={sel.has("fie-wheels")} brake={sel.has("fie-brakes")} />
    </svg>
  );
}

/* ---------- VW Golf 6 (Hatch mit dicker C-Saeule, Shadow Blue) ---------- */
function ArtGolf6({ sel }) {
  const drop = sel.has("g6-kw") || sel.has("g6-stx") ? 7 : sel.has("g6-hr") ? 4 : 0;
  const BODY =
    "M18 84 L16 71 Q16 61 30 58 L68 52 Q73 51 77 47 L90 35 Q94 30 103 30 " +
    "L164 30 Q172 30 176 34 L190 55 L234 58 Q245 60 245 70 L245 84 " +
    "L221 84 A23 23 0 0 1 175 84 L87 84 A23 23 0 0 1 41 84 Z";
  return (
    <svg viewBox="0 0 260 118" width="100%" role="img" aria-hidden="true">
      <Ground />
      <g className="tl-body" style={{ transform: "translateY(" + drop + "px)" }}>
        <clipPath id="tl-clip-g6"><path d={BODY} /></clipPath>
        <path d={BODY} fill="url(#tl-paint-g6)" stroke="#33414f" strokeWidth="1.4" strokeLinejoin="round" />
        <g clipPath="url(#tl-clip-g6)">
          <rect x="14" y="77" width="234" height="9" fill="rgba(0,0,0,.22)" />
          <line x1="32" y1="63.5" x2="230" y2="60.5" stroke="rgba(255,255,255,.4)" strokeWidth="1" />
        </g>
        {sel.has("g6-spoiler") && (
          <path d="M160 26.5 L180 26.5 L177 30 L162 29.5 Z" fill="#1d2127" />
        )}
        <path d="M81 49 L96 36.5 L121 36.5 L121 49 Z" fill="url(#tl-glassgrad)" />
        <path d="M127 49 L127 36.5 L155 36.5 L161 49 Z"
          fill={sel.has("g6-tint") ? "#0b0f14" : "url(#tl-glassgrad)"} />
        <path d="M177 38 L187 53 L183 53 L174 39 Z"
          fill={sel.has("g6-tint") ? "#0b0f14" : "url(#tl-glassgrad)"} />
        <path d="M83 48.5 L77 44.5 L83 43.5 Z" fill="url(#tl-paint-g6)" stroke="#33414f" strokeWidth="0.8" />
        <rect x="112" y="56" width="6" height="1.7" rx="0.8" fill="rgba(0,0,0,.4)" />
        <rect x="146" y="55.5" width="6" height="1.7" rx="0.8" fill="rgba(0,0,0,.4)" />
        <path d="M17 58 L33 55.8 L33 60.5 L17.5 62 Z" fill="url(#tl-chrome)" stroke="#33414f" strokeWidth="0.5" />
        {sel.has("g6-grill") ? (
          <g>
            <path d="M16.3 64 L21.5 63.5 L21.5 71.5 L16.9 72 Z" fill="#0b0d10" stroke="#1f242b" strokeWidth="0.8" />
            <circle cx="18.4" cy="65.9" r="0.7" fill="#262c34" />
            <circle cx="19.8" cy="67.4" r="0.7" fill="#262c34" />
            <circle cx="18.4" cy="68.9" r="0.7" fill="#262c34" />
            <circle cx="19.8" cy="70.4" r="0.7" fill="#262c34" />
          </g>
        ) : (
          <g>
            <path d="M16.3 64 L21.5 63.5 L21.5 71.5 L16.9 72 Z" fill="#23282f" stroke="#aab2bd" strokeWidth="0.9" />
            <line x1="17" y1="66.6" x2="21" y2="66.3" stroke="#aab2bd" strokeWidth="0.7" />
            <line x1="17" y1="69" x2="21" y2="68.7" stroke="#aab2bd" strokeWidth="0.7" />
          </g>
        )}
        {sel.has("g6-fmic") && (
          <g>
            <rect x="17" y="74" width="10" height="7.5" rx="1" fill="url(#tl-chrome)" />
            <line x1="18" y1="76" x2="26" y2="76" stroke="#7a8694" strokeWidth="0.7" />
            <line x1="18" y1="78" x2="26" y2="78" stroke="#7a8694" strokeWidth="0.7" />
          </g>
        )}
        <path d="M239 57.5 L245 59 L245 65.5 L239 64.5 Z" fill="url(#tl-redlight)" stroke="#6e211a" strokeWidth="0.5" />
        {sel.has("g6-esd") ? (
          <rect x="242" y="77.5" width="10" height="4.6" rx="2.3" fill="url(#tl-chrome)" stroke="#33414f" strokeWidth="0.6" />
        ) : (
          <rect x="243.5" y="79" width="7" height="3" rx="1.5" fill="#3a414b" />
        )}
      </g>
      <Wheel cx={64} upgraded={sel.has("g6-wheels")} brake={sel.has("g6-brakes")} />
      <Wheel cx={198} upgraded={sel.has("g6-wheels")} brake={sel.has("g6-brakes")} />
    </svg>
  );
}

/* ---------- VW Golf Sportsvan (Hochdach, Deep Black) ---------- */
function ArtSportsvan({ sel }) {
  const drop = sel.has("gsv-stx") ? 7 : sel.has("gsv-hr") ? 4 : 0;
  const BODY =
    "M18 84 L16 70 Q16 60 30 57 L62 51 Q67 50 71 46 L82 32 Q86 23 96 23 " +
    "L172 23 Q180 23 183 28 L194 56 L235 59 Q245 61 245 71 L245 84 " +
    "L221 84 A23 23 0 0 1 175 84 L87 84 A23 23 0 0 1 41 84 Z";
  return (
    <svg viewBox="0 0 260 118" width="100%" role="img" aria-hidden="true">
      <Ground />
      <g className="tl-body" style={{ transform: "translateY(" + drop + "px)" }}>
        <clipPath id="tl-clip-gsv"><path d={BODY} /></clipPath>
        <path d={BODY} fill="url(#tl-paint-gsv)" stroke="#565d68" strokeWidth="1.4" strokeLinejoin="round" />
        <g clipPath="url(#tl-clip-gsv)">
          <rect x="14" y="77" width="234" height="9" fill="rgba(0,0,0,.3)" />
          <line x1="32" y1="62" x2="232" y2="59.5" stroke="rgba(255,255,255,.5)" strokeWidth="1" />
        </g>
        <path d="M73 48 L88 31 L112 31 L112 48 Z" fill="url(#tl-glassgrad)" />
        <path d="M118 48 L118 31 L150 31 L150 48 Z"
          fill={sel.has("gsv-tint") ? "#0b0f14" : "url(#tl-glassgrad)"} />
        <path d="M156 48 L156 31 L171 31 Q175 32.5 177 37 L181 48 Z"
          fill={sel.has("gsv-tint") ? "#0b0f14" : "url(#tl-glassgrad)"} />
        <path d="M75 47.5 L69 43.5 L75 42.5 Z" fill="url(#tl-paint-gsv)" stroke="#565d68" strokeWidth="0.8" />
        <rect x="108" y="55" width="6" height="1.7" rx="0.8" fill="rgba(255,255,255,.25)" />
        <rect x="142" y="54.5" width="6" height="1.7" rx="0.8" fill="rgba(255,255,255,.25)" />
        <path d="M17 57.5 L33 55.5 L33 60 L17.5 61.5 Z" fill="url(#tl-chrome)" stroke="#565d68" strokeWidth="0.5" />
        {sel.has("gsv-grill") ? (
          <g>
            <path d="M16.3 63.5 L21.5 63 L21.5 71 L16.9 71.5 Z" fill="#0b0d10" stroke="#1f242b" strokeWidth="0.8" />
            <circle cx="18.4" cy="65.4" r="0.7" fill="#262c34" />
            <circle cx="19.8" cy="66.9" r="0.7" fill="#262c34" />
            <circle cx="18.4" cy="68.4" r="0.7" fill="#262c34" />
          </g>
        ) : (
          <g>
            <path d="M16.3 63.5 L21.5 63 L21.5 71 L16.9 71.5 Z" fill="#23282f" stroke="#9aa2ad" strokeWidth="0.9" />
            <line x1="17" y1="66" x2="21" y2="65.7" stroke="#9aa2ad" strokeWidth="0.7" />
            <line x1="17" y1="68.5" x2="21" y2="68.2" stroke="#9aa2ad" strokeWidth="0.7" />
          </g>
        )}
        <path d="M239 58 L245 59.5 L245 66 L239 65 Z" fill="url(#tl-redlight)" stroke="#6e211a" strokeWidth="0.5" />
        {sel.has("gsv-esd") ? (
          <rect x="242" y="77.5" width="10" height="4.4" rx="2.2" fill="url(#tl-chrome)" stroke="#565d68" strokeWidth="0.6" />
        ) : (
          <rect x="243.5" y="79" width="7" height="3" rx="1.5" fill="#3a414b" />
        )}
      </g>
      <Wheel cx={64} upgraded={sel.has("gsv-wheels")} brake={sel.has("gsv-brakes")} />
      <Wheel cx={198} upgraded={sel.has("gsv-wheels")} brake={sel.has("gsv-brakes")} />
    </svg>
  );
}

/* ---------- BMW 430i Gran Coupe (lange Linie, Estorilblau) ---------- */
function Art430({ sel }) {
  const drop = sel.has("bmw-kw") ? 7 : sel.has("bmw-hr") ? 4 : 0;
  const BODY =
    "M16 84 L14 70 Q14 60 28 57 L84 51 Q89 50 93 46 L108 34 Q113 30 122 30 " +
    "L152 30 Q162 30 170 36 Q196 52 224 56 L238 58 Q246 60 246 70 L246 84 " +
    "L221 84 A23 23 0 0 1 175 84 L87 84 A23 23 0 0 1 41 84 Z";
  return (
    <svg viewBox="0 0 260 118" width="100%" role="img" aria-hidden="true">
      <Ground />
      <g className="tl-body" style={{ transform: "translateY(" + drop + "px)" }}>
        <clipPath id="tl-clip-bmw"><path d={BODY} /></clipPath>
        <path d={BODY} fill="url(#tl-paint-bmw)" stroke="#162a4d" strokeWidth="1.4" strokeLinejoin="round" />
        <g clipPath="url(#tl-clip-bmw)">
          <rect x="12" y="77" width="236" height="9" fill="rgba(0,0,0,.25)" />
          <line x1="30" y1="63.5" x2="236" y2="60" stroke="rgba(255,255,255,.4)" strokeWidth="1" />
        </g>
        <path d="M96 49 L113 36 L134 36 L134 49 Z" fill="url(#tl-glassgrad)" />
        <path d="M140 49 L140 36 L154 36 Q166 40 178 49 Z"
          fill={sel.has("bmw-tint") ? "#0b0f14" : "url(#tl-glassgrad)"} />
        <path d="M98 48.5 L92 44 L98 43 Z" fill="url(#tl-paint-bmw)" stroke="#162a4d" strokeWidth="0.8" />
        <rect x="118" y="56.5" width="6" height="1.7" rx="0.8" fill="rgba(0,0,0,.4)" />
        <rect x="150" y="56" width="6" height="1.7" rx="0.8" fill="rgba(0,0,0,.4)" />
        <path d="M15 59 L31 56.5 L31 61 L15.5 62.5 Z" fill="url(#tl-chrome)" stroke="#162a4d" strokeWidth="0.5" />
        <path d="M14.3 64.5 L17 64.3 L17 71 L14.8 71.3 Z" fill="#0e1116" stroke="#3c4654" strokeWidth="0.7" />
        <path d="M18 64.2 L20.7 64 L20.7 70.7 L18.5 71 Z" fill="#0e1116" stroke="#3c4654" strokeWidth="0.7" />
        {sel.has("bmw-lip") && (
          <path d="M13.5 80 L34 80.5 L34 84 L14.3 84 Z" fill="#0b0d10" stroke="#23282f" strokeWidth="0.6" />
        )}
        {sel.has("bmw-spoiler") && (
          <path d="M226 55 L243 56.8 L243 54 L227 52.3 Z" fill="#171b21" stroke="#162a4d" strokeWidth="0.5" />
        )}
        <path d="M239 58 L246 59.6 L246 65 L239 64 Z" fill="url(#tl-redlight)" stroke="#6e211a" strokeWidth="0.5" />
        {sel.has("bmw-esd") ? (
          <rect x="242" y="77" width="11" height="5.2" rx="2.6" fill="url(#tl-chrome)" stroke="#162a4d" strokeWidth="0.6" />
        ) : (
          <rect x="243" y="78.5" width="8" height="3.6" rx="1.8" fill="#3a414b" />
        )}
      </g>
      <Wheel cx={64} upgraded={sel.has("bmw-wheels")} brake={sel.has("bmw-brakes")} />
      <Wheel cx={198} upgraded={sel.has("bmw-wheels")} brake={sel.has("bmw-brakes")} />
    </svg>
  );
}

/* ---------------- Build-Code (Teilen mit Freunden) ---------------- */

const STUNDENSATZ = 110; // EUR pro Werkstattstunde (grobe Schaetzung)

function encodeBuild(carId, ids) {
  try {
    return btoa(carId + ":" + ids.join(",")).replace(/=+$/, "");
  } catch (e) { return ""; }
}

function decodeBuild(code) {
  try {
    let s = code.trim();
    while (s.length % 4 !== 0) s += "=";
    const raw = atob(s);
    const sep = raw.indexOf(":");
    if (sep < 0) return null;
    const carId = raw.slice(0, sep);
    if (!CARS.some((c) => c.id === carId)) return null;
    const valid = new Set(MODS[carId].map((m) => m.id));
    let ids = raw.slice(sep + 1).split(",").filter((id) => valid.has(id));
    /* Konsistenz: Mods ohne erfuellte Voraussetzung entfernen, Gruppen-Doppel aufloesen */
    const mods = MODS[carId];
    const set = new Set(ids);
    let changed = true;
    while (changed) {
      changed = false;
      for (const m of mods) {
        if (set.has(m.id) && (m.requires || []).some((r) => !set.has(r))) {
          set.delete(m.id); changed = true;
        }
      }
    }
    const seen = {};
    for (const m of mods) {
      if (set.has(m.id) && m.group) {
        if (seen[m.group]) set.delete(m.id);
        else seen[m.group] = true;
      }
    }
    return { carId, ids: [...set] };
  } catch (e) { return null; }
}

function accelEstimate(base, basePS, finalPS) {
  if (!base || finalPS <= basePS) return null;
  const t = base * Math.pow(basePS / finalPS, 0.7);
  return Math.round(t * 10) / 10;
}

/* ---------------- Impressum ---------------- */

function ImprintModal({ onClose }) {
  React.useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="tl-overlay" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <button className="tl-sheetclose" onClick={onClose}><X size={15} /> Schlie&szlig;en</button>
        <div className="tl-sheet tl-imprint">
          <div className="tl-sheethead">
            <div className="brand tl-display">Tuning Lab</div>
            <div className="tl-sheetcar tl-display">Impressum</div>
          </div>
          <div className="tl-sheetbody">
            <h4 className="tl-display">Angaben gem&auml;&szlig; &sect; 5 DDG</h4>
            <p>{IMPRESSUM.name}<br />{IMPRESSUM.strasse}<br />{IMPRESSUM.ort}<br />Deutschland</p>
            <h4 className="tl-display">Kontakt</h4>
            <p>E-Mail: {IMPRESSUM.email}</p>
            <h4 className="tl-display">Verantwortlich f&uuml;r den Inhalt</h4>
            <p>{IMPRESSUM.name}, Anschrift wie oben.</p>
            <h4 className="tl-display">Haftung f&uuml;r Inhalte</h4>
            <p>Dieses Projekt ist ein privates, nicht-kommerzielles Hobby-Tool. Alle Preise sind unverbindliche ca.-Marktwerte ohne Gew&auml;hr; Leistungsangaben sind Hersteller-/Tuner-Angaben und keine Zusicherung. Keine Beratung, kein Verkauf, keine Vermittlung. F&uuml;r externe Produkte und Marken gelten die Rechte der jeweiligen Inhaber.</p>
            <h4 className="tl-display">Bildnachweise</h4>
            <p>
              Fahrzeugfotos: Wikimedia Commons \u2013 Urheber und Lizenz (u.\u202Fa. CC BY-SA) auf der jeweiligen Dateiseite:{" "}
              {Object.values(CAR_PHOTOS).flat().map((f, i, arr) => (
                <React.Fragment key={f}>
                  <a className="tl-credit" href={wmPage(f)} target="_blank" rel="noreferrer">[{i + 1}]</a>
                  {i < arr.length - 1 ? " " : ""}
                </React.Fragment>
              ))}
            </p>
            <h4 className="tl-display">Datenschutz (Kurzfassung)</h4>
            <p>Diese Seite setzt keine Cookies, nutzt kein Tracking und speichert keine personenbezogenen Daten. Alle Konfigurationen leben nur im Browser-Speicher der aktuellen Sitzung. Beim Hosting &uuml;ber GitHub Pages kann GitHub technisch bedingt Server-Logs (z. B. IP-Adressen) verarbeiten &ndash; Details in der Datenschutzerkl&auml;rung von GitHub.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
