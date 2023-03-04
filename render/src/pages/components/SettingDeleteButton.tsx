import React, { useState } from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {GridRowId} from "@mui/x-data-grid";

type Props = {
    id: GridRowId,
    path: string,
    deleteFunction: (id: number,key: string) => void,
};

const SettingDeleteButton: React.FC<Props> = (props) => {
    const [isOpenDialog, setIsOpenDialog] = useState(false);

    const handleOpen = () => {
        setIsOpenDialog(true);
    }

    const handleClose = () => {
        setIsOpenDialog(false);
    }

    const deleteRow = () => {
        props.deleteFunction(Number(props.id),props.path);
        handleClose();
    }
    return (
        <React.Fragment>
            <Button variant={"contained"}　onClick = {handleOpen}>削除</Button>
            <Dialog open={isOpenDialog} onClose={handleClose} aria-labelledby="alert-dialog-delete-title" aria-describedby="alert-dialog-delete-description">
                <DialogTitle id={"alert-dialog-delete-title"}>確認</DialogTitle>
                <DialogContent>
                    <DialogContentText id={"alert-dialog-delete-description"}>ID[{props.id}]を本当に削除しますか？</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant={"outlined"} autoFocus onClick={handleClose}>やめる</Button>
                    <Button onClick={deleteRow}>削除する</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default SettingDeleteButton;