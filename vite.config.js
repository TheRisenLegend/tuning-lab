import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" = relative Pfade -> funktioniert auf GitHub Pages unter /tuning-lab/
export default defineConfig({
  plugins: [react()],
  base: "./",
});
