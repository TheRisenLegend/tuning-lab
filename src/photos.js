/* Wikimedia-Commons-Dateinamen je Auto.
   [0] = Hauptbild (wird von download-images.sh nach public/img/<id>.jpg geladen),
   weitere = Hotlink-Fallbacks. Lizenzen/Autoren: siehe Dateiseite (Bildnachweis im Impressum). */
export const CAR_PHOTOS = {
  a4b6: ["Audi A4 B6 Limousine.JPG", "Audi A4 B6 (2000\u20132004) front MJ.JPG"],
  tt8n: ["Audi TT 1.8T quattro 2000.jpg", "Audi TT coup\u00E9 (8N) front.JPG"],
  clk320: ["2004 Mercedes-Benz CLK 320 (C 209) Elegance coupe (2015-06-27) 01.jpg", "Mercedes-Benz CLK C209 black.jpg"],
  i30nline: ["Hyundai i30 N Fastback (48672159966).jpg", "Hyundai i30 Fastback N.jpg"],
  fiesta: ["Ford Fiesta MK7 Sport 20090331 front.JPG", "Ford Fiesta MK7 front.JPG"],
  golf6: ["VW Golf 1.4 TSI Team (VI) \u2013 Frontansicht, 26. M\u00E4rz 2011, Ratingen.jpg", "VW Golf VI front 20100509.jpg"],
  sportsvan: ["VW Golf Sportsvan 1.6 TDI Comfortline.JPG", "Volkswagen Golf Sportsvan (2015) in denim blue in Wolfsburg.JPG"],
  bmw430: ["BMW 430i Gran Coup\u00E9 (F36) Washington DC Metro Area, USA.jpg", "BMW 430d Gran Coup\u00E9 M Sport (F36) \u2013 Frontansicht, 18. Oktober 2015, D\u00FCsseldorf.jpg"],
};

export const wmUrl = (f) =>
  "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(f) + "?width=640";
export const wmPage = (f) =>
  "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(f.replace(/ /g, "_"));
