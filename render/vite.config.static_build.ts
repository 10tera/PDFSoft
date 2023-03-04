import { builtinModules } from 'module'
import react from '@vitejs/plugin-react'

export default {
    root: __dirname,
    base: './',
    build: {
        outDir: '../dist/renderer',
        emptyOutDir: true,
        assetsDir: '',
        rollupOptions: {
            output: {
                format: 'cjs',
            },
            external: [
                'electron',
                ...builtinModules,
            ],
        },
    },
    optimizeDeps: {
        exclude: ['electron'],
    },
    plugins: [react()]
}