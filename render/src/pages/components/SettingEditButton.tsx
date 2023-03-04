import React, { useState ,useReducer} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,TextField} from "@mui/material";
import {GridRowId} from "@mui/x-data-grid";
import { StatTimer } from "pdfjs-dist/types/src/display/display_utils";

type Props = {
    id: GridRowId,
    path: string,
    name: string,
    editFunction: (id: number,fileName: string, folderPath: string) => void;
};

type State = {
    fileName: string,
    folderPath: string,
}

type Action = 
    | {type: "setFileName", payload: string}
    | {type: "setFolderPath", payload: string};

const reducer = (state: State,action: Action): State => {
    switch(action.type){
        case "setFileName":
            return {...state,fileName: action.payload};
        case "setFolderPath":
            return {...state,folderPath: action.payload};
        default:
            return state;
    }
}

const SettingEditButton: React.FC<Props> = (props) => {
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [folderPath,setFolderPath] = useState(props.path);
    const [state,dispatch] = useReducer(reducer,{fileName:props.name, folderPath: props.path});
    const handleOpen = () => {
        setIsOpenDialog(true);
    }

    const handleClose = () => {
        dispatch({type: "setFileName",payload: props.name});
        dispatch({type: "setFolderPath",payload: props.path});
        setIsOpenDialog(false);
    }

    const editRow = () => {
        props.editFunction(Number(props.id),state.fileName,state.folderPath);
        setIsOpenDialog(false);
        //handleClose();
    }

    const openFolder = async () => {
        const path = await window.eAPI.openDialog({ multiSelections: false, openDirectory: true, openFile :false});
        if(path)dispatch({type: "setFolderPath", payload: path[0]});
    }

    const handleFileNameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        dispatch({type: "setFileName", payload: event.target.value});
    }


    return (
        <React.Fragment>
            <Button variant = {"contained"} onClick = {handleOpen}>編集</Button>
            <Dialog open = {isOpenDialog} onClose={handleClose} aria-labelledby="alert-edit-delete-title" aria-describedby="alert-dialog-edit-description">
                <DialogTitle id = {"alert-dialog-edit-title"}>編集</DialogTitle>
                <DialogContent>
                    <TextField style={{margin:"10px"}} id = {"editFileName"} label = {"ファイル名"} variant = {"outlined"} defaultValue = {props.name} onChange = {handleFileNameChange} required></TextField>
                    <br/>
                    <TextField style={{ margin: "10px" }} id = {"editFolderPath"} label = {"フォルダパス"} variant = {"outlined"} value = {state.folderPath} disabled></TextField>
                    <br/>
                    <Button style={{ margin: "10px 0px 10px 0px",width: "100%"}} variant="outlined" onClick={openFolder} >フォルダ選択</Button>
                </DialogContent>
                <DialogActions>
                    <Button variant = {"outlined"} autoFocus onClick = {handleClose}>やめる</Button>
                    <Button onClick = {editRow}>変更する</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default SettingEditButton;