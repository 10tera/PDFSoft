import { spawn } from "child_process";
import { createServer, build } from "vite";
import electronPath from "electron";

const server = await createServer({ configFile: "render/vite.config.ts" });
await server.listen();
console.log(`start render process port:${server.config.server.port}`);


console.log("start electron process");

let electronProcess = null;
build({
    configFile: "electron/vite.config.ts",
    build: {
        watch: {}
    },
    plugins: [{
        name: "electron-main-starter",
        writeBundle() {
            if (electronProcess) {
                electronProcess.kill();
            }
            electronProcess = spawn(electronPath, ["."], { stdio: "inherit" });
        }
    }]
});
