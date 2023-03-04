import React, {DragEvent, useState} from "react";
import {Button} from "@mui/material";
import "../../assets/Dropzone.css"

type Props = {
    multiSelections?: boolean;
    openFile?: boolean;
    openDirectory?: boolean;
    setFilePaths: React.Dispatch<React.SetStateAction<string[]>>;
}

const Dropzone: React.FC<Props> = (props) => {
    const options: { multiSelections: boolean, openFile: boolean, openDirectory: boolean } = { multiSelections: false, openFile: false, openDirectory: false };
    if (props.multiSelections) {
        options.multiSelections = true;
    }
    if (props.openDirectory) {
        options.openDirectory = true;
    }
    if (props.openFile) {
        options.openFile = true;
    }

    const [dropZoneWarningText, setDropZoneWarningText] = useState("");

    const changeWarning = (text: string) => {
        setDropZoneWarningText(text);
    }

    const resetWarning = () => {
        setDropZoneWarningText("");
    }

    const openFile = async () => {
        const filePaths = await window.eAPI.openDialog(options);
        resetWarning();
        if(!filePaths){
            return;
        }
        props.setFilePaths(filePaths);
    }

    const dragOver = (_event: DragEvent) => {
        _event.stopPropagation();
        _event.preventDefault();
    }

    const dragLeave = (_event: DragEvent) => {
        _event.stopPropagation();
        _event.preventDefault();
    }

    const drop = (_event: DragEvent) => {
        _event.stopPropagation();
        _event.preventDefault();
        const filePaths = Array.from(_event.dataTransfer.files);
        if(!filePaths || filePaths.length === 0){
            resetWarning();
            return;
        }
        if(options.multiSelections){
            props.setFilePaths(filePaths.map( f => f.path));
            resetWarning();
        }
        else if(filePaths.length > 1){
            changeWarning("ファイルを一つだけ開くことができます");
        }
        else{
            props.setFilePaths([filePaths[0].path]);
            resetWarning();
        }
    }
    return (
        <React.Fragment>
            <div id="dropSideZone">
                <div id="dropZone" onDragOver = {dragOver} onDragLeave = {dragLeave} onDrop = {drop}>
                    <Button variant="outlined" onClick = {openFile}>ファイル選択</Button>
                    <p id="dropZoneWarning">{dropZoneWarningText}</p>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Dropzone;