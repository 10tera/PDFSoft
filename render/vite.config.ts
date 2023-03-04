import { defineConfig } from 'vite'
import {builtinModules} from "module"
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  base: "./",
  build: {
    outDir: "../dist/render",
    assetsDir: "public",
    rollupOptions: {
      output: {
        format: "cjs"
      },
      external: [
        "electron",
        ...builtinModules
      ]
    }
  },
  optimizeDeps: {
    exclude: ["electron"]
  },
  server: {
    port: 3000
  },
  plugins: [react()],
})
