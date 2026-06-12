#!/usr/bin/env bash
# Laedt die 8 Auto-Fotos von Wikimedia Commons nach public/img/<id>.jpg
# Einmal ausfuehren:  bash download-images.sh
set -e
cd "$(dirname "$0")"
mkdir -p public/img
UA="TuningLab/1.0 (privates Hobby-Projekt)"

echo "-> a4b6"
curl -L --fail -A "$UA" -o "public/img/a4b6.jpg" "https://commons.wikimedia.org/wiki/Special:FilePath/Audi%20A4%20B6%20Limousine.JPG?width=900"
echo "-> tt8n"
curl -L --fail -A "$UA" -o "public/img/tt8n.jpg" "https://commons.wikimedia.org/wiki/Special:FilePath/Audi%20TT%201.8T%20quattro%202000.jpg?width=900"
echo "-> clk320"
curl -L --fail -A "$UA" -o "public/img/clk320.jpg" "https://commons.wikimedia.org/wiki/Special:FilePath/2004%20Mercedes-Benz%20CLK%20320%20%28C%20209%29%20Elegance%20coupe%20%282015-06-27%29%2001.jpg?width=900"
echo "-> i30nline"
curl -L --fail -A "$UA" -o "public/img/i30nline.jpg" "https://commons.wikimedia.org/wiki/Special:FilePath/Hyundai%20i30%201.4%20T-GDI%20Intro%20%28III%29%20%E2%80%93%20Frontansicht%2C%203.%20Juni%202017%2C%20D%C3%BCsseldorf.jpg?width=900"
echo "-> fiesta"
curl -L --fail -A "$UA" -o "public/img/fiesta.jpg" "https://commons.wikimedia.org/wiki/Special:FilePath/Ford%20Fiesta%20MK7%20Sport%2020090331%20front.JPG?width=900"
echo "-> golf6"
curl -L --fail -A "$UA" -o "public/img/golf6.jpg" "https://commons.wikimedia.org/wiki/Special:FilePath/VW%20Golf%201.4%20TSI%20Team%20%28VI%29%20%E2%80%93%20Frontansicht%2C%2026.%20M%C3%A4rz%202011%2C%20Ratingen.jpg?width=900"
echo "-> sportsvan"
curl -L --fail -A "$UA" -o "public/img/sportsvan.jpg" "https://commons.wikimedia.org/wiki/Special:FilePath/VW%20Golf%20Sportsvan%201.6%20TDI%20Comfortline.JPG?width=900"
echo "-> bmw430"
curl -L --fail -A "$UA" -o "public/img/bmw430.jpg" "https://commons.wikimedia.org/wiki/Special:FilePath/BMW%20430i%20Gran%20Coup%C3%A9%20%28F36%29%20Washington%20DC%20Metro%20Area%2C%20USA.jpg?width=900"

echo ""
echo "Fertig! 8 Bilder liegen in public/img/."
