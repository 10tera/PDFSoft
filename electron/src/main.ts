import {app,BrowserWindow,Menu, MenuItemConstructorOptions,ipcMain, dialog, OpenDialogOptions} from "electron";
import ElectronStore from "electron-store";
import path,{join,basename} from "path";
import { PDFDocument, degrees } from "pdf-lib";
import fs from "fs";
import http from "http";
import {IPC} from "./constants/ipc"
import { read } from "original-fs";
console.log(__dirname);
console.log(IPC.SCREEN.navigate);

let mainWindow: BrowserWindow | null;
const mainMenu:MenuItemConstructorOptions[] = [
    {
        label: "ファイル",
        submenu:[
            { role: "close", label: "閉じる"}
        ]
    },
    {
        label: "編集",
        submenu:[
            { role: "cut", label: "切り取り"},
            { role: "copy", label: "コピー"},
            { role: "paste", label: "貼り付け"}
        ]
    },
    {
        label: "表示",
        submenu:[
            { role: "reload", label: "再読み込み"},
            !app.isPackaged ? {role: "toggleDevTools", label: "開発者ツール表示"} : {}
        ]
    },
    {
        label: "ウィンドウ",
        submenu:[
            { role: "minimize" , label: "最小化"},
            { role: "togglefullscreen", label: "フルスクリーン切り替え"}
        ]
    },
    {
        label: "PDFツール",
        submenu:[
            {
                label: "ホーム",
                click: () => mainWindow?.webContents.send(IPC.SCREEN.navigate,"/")
            },
            {
                label: "PDFリーダー",
                click: () => mainWindow?.webContents.send(IPC.SCREEN.navigate,"/pdfreader")
            },
            {
                label: "PDF結合",
                click: () => mainWindow?.webContents.send(IPC.SCREEN.navigate,"/pdfmerge")
            },
            {
                label: "PDF分割",
                click: () => mainWindow?.webContents.send(IPC.SCREEN.navigate,"/pdfsplit")
            },
            {
                label: "PDF回転",
                click: () => mainWindow?.webContents.send(IPC.SCREEN.navigate,"/pdfrotate")
            }
        ]
    },
    {
        label: "設定",
        submenu:[
            {
                label: "設定",
                click: () => mainWindow?.webContents.send(IPC.SCREEN.navigate,"/settings")
            }
        ]
    }
];

const store = new ElectronStore();

const menu = Menu.buildFromTemplate(mainMenu);
Menu.setApplicationMenu(menu);

app.setName("PDFSoft");


const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        title: "PDFSoft",
        width: 800,
        height: 600,
        webPreferences: {
            //nodeIntegration: false,
            //sandbox: false,
            contextIsolation: true,
            webSecurity: false,
            preload: path.join(__dirname,"preload.cjs")
        }
    });
    if(app.isPackaged){
        mainWindow.loadFile(join(__dirname,"../render/index.html"));
    }
    else{
        mainWindow.loadURL("http://localhost:3000");
        mainWindow.webContents.openDevTools();
    }
}

app.on("ready",() => {
    createMainWindow();
    ipcMain.handle("sendIPC", () => {
        return IPC;
    });

    ipcMain.handle(IPC.NODE.readDir, async (_event: Electron.IpcMainInvokeEvent, path: string) => {
        try{
            return fs.readdirSync(path,{withFileTypes: true}).filter(file => file.isFile() && (file.name.endsWith(".pdf") || file.name.endsWith(".PDF"))).map(file => file.name.slice(0,-4));
        }
        catch(err){
            console.error(err);
            return;
        }
        
    })

    ipcMain.handle(IPC.PATH.basename, async (_event: Electron.IpcMainInvokeEvent, args: string) => {
        return basename(args);
    });

    ipcMain.handle(IPC.PATH.join, async (_event: Electron.IpcMainInvokeEvent, args: string[]) => {
        return path.join(args[0],args[1]);
    });

    ipcMain.handle(IPC.NODE.getSettings, async (_event: Electron.IpcMainInvokeEvent, key: string) => {
        return store.get(key,[]);
    });

    ipcMain.on(IPC.NODE.setSettings, (_event: Electron.IpcMainInvokeEvent,args: {key: string, data: undefined}) => {
        store.set(args.key,args.data);
    });

    ipcMain.on(IPC.NODE.clearSettings, (_event: Electron.IpcMainInvokeEvent) => {
        store.clear();
    })

    ipcMain.on(IPC.NODE.deleteSettings, (_event: Electron.IpcMainInvokeEvent, key: string) => {
        store.delete(key);
    })

    ipcMain.handle(IPC.NODE.saveDialog, async(_event: Electron.IpcMainInvokeEvent, args: {defaultPath: string}) => {
        const {canceled,filePath} = await dialog.showSaveDialog({
            title: "ファイルを保存",
            defaultPath: args.defaultPath,
            filters: [{name: "PDF", extensions: ["pdf"]}]
        });
        return filePath;
    })

    ipcMain.on(IPC.NODE.saveFile, async(_event: Electron.IpcMainInvokeEvent, args: {path: string, filePathDatas: [], rotateDatas: []}) => {
        const mergedPdf = await PDFDocument.create();
        for (let i = 0; i < args.filePathDatas.length; i++) {
            const pdfBuffer = fs.readFileSync(args.filePathDatas[i]);
            const pdfDoc = await PDFDocument.load(pdfBuffer);
            const pages = pdfDoc.getPages();
            for (let pageIndexs = 0; pageIndexs < pages.length; pageIndexs++) {
                pages[pageIndexs].setRotation(degrees(pages[pageIndexs].getRotation().angle + args.rotateDatas[i]));
            }
            const mergedpages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            mergedpages.forEach(page => {
                mergedPdf.addPage(page);
            })
        }
        const mergedPdfBytes = await mergedPdf.save();
        fs.writeFile(args.path,mergedPdfBytes,(err) => {
            if(err){
                console.error(err);
                return;
            }
        });
    })

    ipcMain.handle(IPC.NODE.dialog, async (_event: Electron.IpcMainInvokeEvent, args: { multiSelections: boolean, openFile: boolean, openDirectory: boolean}) => {
        const properties: OpenDialogOptions["properties"] = [];
        const filters: OpenDialogOptions["filters"] = [];
        if(args.multiSelections){
            properties.push("multiSelections");
        }
        if(args.openDirectory){
            properties.push("openDirectory");
        }
        if(args.openFile){
            properties.push("openFile");
            filters.push({
                name: "PDFファイル",
                extensions: ["pdf","PDF"]
            })
        }
        const {canceled, filePaths} = await dialog.showOpenDialog({
            title: "PDFファイルを選択",
            properties: properties,
            filters: filters,
        });
        if(canceled){
            return;
        }
        else{
            return filePaths;
        }
    });
});

app.on("window-all-closed",() => {
    if(process.platform !== "darwin"){
        mainWindow = null;
        app.quit();
    }
});

app.on("activate",() => {
    if(mainWindow === null){
        createMainWindow();
    }
});
