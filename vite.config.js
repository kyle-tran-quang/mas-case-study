import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Serves the repo root so m-goat/ can reach ../fonts/ (Mikado). The scene files are classic <script> tags that share
// window.STORY / window.SCENE / window.AssemblyScene, so Vite serves them as-is and reloads the page when any of them,
// the CSS, or the HTML changes.
export default defineConfig({
  server: {
    port: 5173,
    open: "/m-goat/",
    watch: { ignored: ["**/assets/act1/source*/**", "**/.claude/**"] }   // raw Figma exports: no reload when they change
  },
  plugins: [react(), {
    name: "full-reload-on-scene-change",
    // Classic scripts are not part of Vite's module graph, so there is no HMR boundary for them: force a full reload instead of doing nothing.
    handleHotUpdate({ file, server }) {
      if (/\/m-goat\/.*\.(js|css|html)$/.test(file)) { server.ws.send({ type: "full-reload", path: "*" }); return []; }
    }
  }]
});
