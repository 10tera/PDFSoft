import { builtinModules } from 'module'
import { spawn } from "child_process";
// @ts-ignore
import electronPath from "electron";

console.log("main vite config called.")
console.log(`__dirname :${__dirname}`)
let electronProcess: any = null
export default {
    root: __dirname,         // メインプロセスディレクトリを指し示す
    base: "./",
    build: {
        outDir: '../dist/main',
        // emptyOutDir: true,
        lib: {
            entry: 'src/main.ts',   // Electronは現在CommonJs形式のみをサポートしています。
            formats: ['cjs'],
            fileName: () => '[name].cjs',
        },
        rollupOptions: {
            // include: ["../../dist/renderer"],
            external: [          // 組み込みAPIをパッケージ化しないようRollupに指示する
                'electron',
                ...builtinModules,
            ],
        }
    },
    plugins: [],
}