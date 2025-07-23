import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tagger from 'tagger';

// Assuming `componentTagger` is an object or method
const { componentTagger } = tagger;

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger,  // Use correctly if it's a function
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
