export const IPC = {
    SCREEN: {
        navigate: "screenTransition",
    },
    NODE: {
        dialog: "dialog:open",
        saveDialog: "saveDialog:open",
        saveFile: "saveFile:fromPath",
        readDir: "fs:readdir",
        getSettings: "settings:get",
        setSettings: "settings:set",
        clearSettings: "settings:clear",
        deleteSettings: "settings:delete",
    },
    PATH: {
        basename: "path:basename",
        join: "path:join",
    },
}