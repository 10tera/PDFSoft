import React, { useEffect, useState ,useReducer} from "react";
import { Button ,TextField} from "@mui/material";
import { DataGrid, GridColumns, GridRowProps} from "@mui/x-data-grid";
import SettingDeleteButton from "./components/SettingDeleteButton";
import SettingEditButton from "./components/SettingEditButton";

type State = {
    newFileName: string,
    newFolderPath: String,
}

const initState: State = {
    newFileName: "",
    newFolderPath: "",
}

type Action =
    | { type: "setNewFileName", payload: string }
    | { type: "setNewFolderPath", payload: string };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "setNewFileName":
            return { ...state, newFileName: action.payload };
        case "setNewFolderPath":
            return { ...state, newFolderPath: action.payload };
        default:
            return state;
    }
}

const Settings: React.FC = () => {
    let isFirstRender = true;

    const columns: GridColumns<any> = [
        {
            field: "id",
            headerName: "ID",
            width: 90,
            maxWidth: 90,
        },
        {
            field: "path",
            headerName: "フォルダパス",
            width: 250,
            flex: 1
        },
        {
            field: "name",
            headerName: "自動設定されるファイル名",
            width: 250,
            flex: 1
        },
        {
            field: "edit",
            headerName: "編集",
            width: 90,
            maxWidth: 90,
            renderCell: (params) => <SettingEditButton id = {params.row.id} path = {params.row.path} name = {params.row.name} editFunction = {editData}/>
        },
        {
            field: "delete",
            headerName: "削除",
            width: 90,
            maxWidth: 90,
            renderCell: (params) => <SettingDeleteButton id = {params.row.id} path = {params.row.path} deleteFunction = {deleteData}/>
        }
    ];
    const [rows, setRows]: [any[],any] = useState([]);
    const [state, dispatch] = useReducer(reducer,initState);

    const deleteData = (id: number,key: string) => {
        const newRows = rows.filter((val, _index) => val.id !== id);
        newRows.forEach((val,index) => {
            newRows[index].id = index + 1;
        });
        setRows(newRows);
        window.eAPI.setSettings({key: "filenamedata", data: newRows});
    }

    const editData = (id: number, fileName: string, folderPath: string) => {
        const newRows = [...rows];
        newRows.forEach((val,index) => {
            if(val.id === id){
                newRows[index].name = fileName;
                newRows[index].path = folderPath;
            }
        });
        setRows(newRows);
        window.eAPI.setSettings({key: "filenamedata",data: newRows});
    }

    const setFirstSettings = async () => {
        const settings = await window.eAPI.getSettings("filenamedata");
        setRows(settings);
    }

    const clearSettings = () => {
        window.eAPI.clearSettings();
    }

    const openFolder = async() => {
        const path = await window.eAPI.openDialog({ multiSelections: false, openDirectory: true, openFile: false });
        if (path) dispatch({ type: "setNewFolderPath", payload: path[0]});
    }

    const addData = () => {
        if(state.newFileName === "" || state.newFolderPath === "")return;
        const newRows = [...rows, { id: rows.length + 1, path: state.newFolderPath, name: state.newFileName }];
        setRows(newRows);
        window.eAPI.setSettings({key: "filenamedata",data: newRows});
        dispatch({type: "setNewFileName",payload: ""});
        dispatch({type: "setNewFolderPath",payload: ""});
    }

    const handleNewFileNameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        dispatch({type: "setNewFileName", payload: event.target.value});
    }

    useEffect(() => {
        if(!isFirstRender)return;
        setFirstSettings();
        isFirstRender = false;
    },[]);
    return(
        <React.Fragment>
            <h1>設定</h1>
            <h2>自動ファイル名設定</h2>
            <h3>設定追加</h3>
            <TextField style={{ margin: "10px 0px 10px 0px" }} id = {"newName"} label={"ファイル名"} variant={"outlined"} required onChange = {handleNewFileNameChange}></TextField>
            <br/>
            <TextField style={{ margin: "10px 0px 10px 0px" }} id = {"newFolderPath"} label = {"フォルダパス"} variant = {"outlined"} disabled value = {state.newFolderPath}></TextField>
            <br/>
            <Button style={{ margin: "10px 0px 10px 0px"}} variant = {"outlined"} onClick={openFolder} >フォルダ選択</Button>
            <br/>
            <Button variant = {"outlined"} onClick = {addData}>データ追加</Button>
            <h3>設定一覧</h3>
            <div style={{height: 400}}>
                <DataGrid rows = {rows} columns={columns}/>
            </div>
        </React.Fragment>
    );
}
export default Settings;