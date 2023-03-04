import { builtinModules } from 'module'
import {defineConfig} from "vite";
// @ts-ignore

console.log("main vite config called.")
console.log(`__dirname :${__dirname}`)
export default defineConfig({
    root: __dirname,         // メインプロセスディレクトリを指し示す
    base: "./",
    build: {
        outDir: '../dist/main',
        emptyOutDir: true,
        
        rollupOptions: {
            input: {
                main: __dirname + "/src/main.ts",
                preload: __dirname + "/src/preload.ts"
            },
            output:{
                entryFileNames: "[name].cjs",
                assetFileNames: "[name].[ext]",
                chunkFileNames: "[name].js",
                format: "cjs",
                
            },
            preserveEntrySignatures: "exports-only",
            // include: ["../../dist/renderer"],
            external: [          // 組み込みAPIをパッケージ化しないようRollupに指示する
                'electron',
                ...builtinModules,
            ],
        },
        watch: {
        }
    }
})