import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import obfuscator from "vite-plugin-javascript-obfuscator";

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),

    command === "build" &&
      obfuscator({
        options: {
          compact: true,
          controlFlowFlattening: true,
          deadCodeInjection: false,
          stringArray: true,
          stringArrayThreshold: 0.75,
          debugProtection: true,
          disableConsoleOutput: true,
          identifierNamesGenerator: "hexadecimal",
        },
      }),
  ].filter(Boolean),

  server: {
    port: 5173,
  },
}));