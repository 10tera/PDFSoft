import { IpcRendererEvent } from "electron";

export interface Versions{
    node: () => string;
    chrome: () => string;
    electron: () => string;
}


export interface EApi{
    screenTransition: (callback: (_event: IpcRendererEvent, to: string) => void) => void;
    openDialog: (options: {}) =>  Promise<string[] | null>;
    openSaveDialog: (options: { defaultPath: string }) => Promise<string>;
    saveFile: (options: { path: string, filePathDatas: any[], rotateDatas: any[] }) => void;
    getBaseName: (filePath: string) => Promise<string>;
    getJoinPath: (args: string[]) => Promise<string>;
    getSettings: (key: string) => Promise<any>;
    setSettings: (options: {key: string,data: any}) => void;
    clearSettings: () => void;
    deleteSettings: (key: string) => void;
    readdir: (path: string) => Promise<any>; 
}

declare global {
    /*
    interface Window {
        versions: Versions;
        eapi: EApi;
    }
    */
    var versions: Versions
    var eAPI: EApi
}