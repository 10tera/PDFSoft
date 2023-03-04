import {IpcRendererEvent, contextBridge, ipcRenderer} from "electron";


ipcRenderer.invoke("sendIPC").then((val) => {
    contextBridge.exposeInMainWorld("eAPI", {
        screenTransition: (callback: (_event: IpcRendererEvent, to: string) => void) => ipcRenderer.on(val.SCREEN.navigate, callback),
        openDialog: (options: { multiSelections: boolean, openFile: boolean, openDirectory: boolean }) => ipcRenderer.invoke(val.NODE.dialog,options),
        openSaveDialog: (options: { defaultPath: string }) => ipcRenderer.invoke(val.NODE.saveDialog,options),
        saveFile: (options: { path: string, filePathDatas: any[], rotateDatas: any[] }) => ipcRenderer.send(val.NODE.saveFile,options),
        getBaseName: (filePath: string) => ipcRenderer.invoke(val.PATH.basename,filePath),
        getJoinPath: (args: string[]) => ipcRenderer.invoke(val.PATH.join,args),
        getSettings: (key: string) => ipcRenderer.invoke(val.NODE.getSettings,key),
        setSettings: (options: {key: string,data: undefined}) => ipcRenderer.send(val.NODE.setSettings,options),
        clearSettings: () => ipcRenderer.send(val.NODE.clearSettings),
        deleteSettings: (key: string) => ipcRenderer.send(val.NODE.deleteSettings,key),
        readdir: (path: string) => ipcRenderer.invoke(val.NODE.readDir,path),
    });
});




contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
});

