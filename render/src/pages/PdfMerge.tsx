import React, { useState, useRef, useEffect } from "react";
import { Button ,MenuItem,Select,FormControl, SelectChangeEvent, IconButton} from "@mui/material";
import {RotateRight, RotateLeft} from "@mui/icons-material";
import {PDFDocument,degrees} from "pdf-lib";
import fs from "fs";
import path from "path";
import Dropzone from "./components/Dropzone";
import PdfRender from "./components/PdfRender";


const PdfMerge: React.FC = () => {
    const [filePaths, setFilePaths] = useState<string[]>([]);
    const [selectData,setSelectData] = useState<any[]>([]);
    const [selectedData,setSelectedData]  = useState(-1);
    const [rotateInfo, setRotateInfo] = useState<number[]>([]);

    const finedIndexFromName = (str:string) => {
        const pattern = /\[index\]/g;
        const indices = [];
        let match;
        while((match = pattern.exec(str))){
            indices.push(match.index);
        }
        return indices;
    }

    const isMatch = (target: string, base:string, indices: number[]) => {
        let patternString = "^";
        let patternString2 = "";
        let i = 0;
        while(i < base.length){
            //[index]部
            if(indices.includes(i)){
                //先頭かどうか
                patternString += "\\d+";
                patternString2 += "(\\d+)";
                i += 7;
            }
            //他の部分
            else{
                patternString += base[i];
                patternString2 += base[i];
                i++;
            }
        }
        patternString += "$";
        patternString2 += "$";
        const pattern = new RegExp(patternString);
        const pattern2 = new RegExp(patternString2);
        const matched = target.match(pattern2);
        if(matched){
            return [pattern.test(target),matched[1]];
        }
        else{
            return [pattern.test(target), null];
        }
    }

    const pdfMergeButtonClick = async() => {
        let defaultPath: string;
        //テンプレート未使用
        if(selectedData === -1){
            defaultPath = "";
        }
        //テンプレート使用
        else{
            const targetDirectory = selectData[selectedData].path;
            const fileName = selectData[selectedData].name;
            const targetDirFileList = await window.eAPI.readdir(targetDirectory);
            const indexList = finedIndexFromName(fileName);
            let newFileName: string = "";
            if(indexList.length < 1){
                newFileName = fileName + ".pdf";
            }
            else{
                const kouho: number[] = [];
                for (let name of targetDirFileList) {
                    const isMatchBase = isMatch(name, fileName, indexList);
                    if (isMatchBase[0] && isMatchBase[1]) {
                        kouho.push(Number(isMatchBase[1]));
                    }
                }
                if(kouho.length < 1)kouho.push(0);
                const newIndex = Math.max(...kouho) + 1;
                newFileName = fileName.replace(/\[index\]/g, String(newIndex)) + ".pdf";
            }
            const joinedPath = await window.eAPI.getJoinPath([targetDirectory,newFileName]);
            defaultPath = joinedPath;
        }
        const targetFilePath = await window.eAPI.openSaveDialog({ defaultPath: defaultPath});
        if(targetFilePath){
            window.eAPI.saveFile({path: targetFilePath,filePathDatas: filePaths, rotateDatas: rotateInfo});
        }
    }

    const handleSelectChange = (event: SelectChangeEvent) => {
        setSelectedData(Number(event.target.value));
    }

    useEffect(() => {
        if (filePaths.length < 1 || !filePaths) {
            return;
        }
        const newRotateDatas: number[] = [];
        for(let newFilepath in filePaths){
            newRotateDatas.push(0);
        }
        setRotateInfo(newRotateDatas);
    },[filePaths])

    useEffect(() => {
        window.eAPI.getSettings("filenamedata").then((settings) => {
            setSelectData(settings);
        });
    },[]);

    return(
        <React.Fragment>
            <h1>PDF Merge</h1>
            <p>PDFファイルの結合</p>
            <h2>プリセット選択</h2>
            <FormControl fullWidth>
                <Select id={"template-select"} value={String(selectedData)}  onChange = {handleSelectChange}>
                    {
                        selectData.map((val, index) => {
                            return (
                                <MenuItem key={`selectdata-${index}`} value={String(index)}>{val.path}</MenuItem>
                            )
                        })
                    }
                </Select>
            </FormControl>
            <Dropzone openFile multiSelections setFilePaths={setFilePaths}></Dropzone>
            {filePaths.length > 0 ? <Button variant={"contained"} onClick={pdfMergeButtonClick}>PDF結合</Button>:<></>}
            {
                filePaths.map((path,index) => {
                    return(
                        <div key={`file_${path}`}>
                            <IconButton onClick = {() => {
                                const target_canvas = document.getElementById(`pdfcanvas-${path}-1`);
                                let target_index = 0;
                                for(let i = 0; i < filePaths.length; i++){
                                    if(filePaths[i] === path){
                                        target_index = i;
                                        break;
                                    }
                                }
                                rotateInfo.map((data: number, index: number) => {
                                    if (index === target_index && target_canvas) {
                                        console.log((data - 90) % 360);
                                        target_canvas.style.transform = `rotate(${(data - 90) % 360}deg)`;
                                    }
                                })
                                setRotateInfo(rotateInfo.map((data: number,index: number) => index === target_index ? (data - 90)% 360:data));
                            }}>
                                <RotateLeft/>
                            </IconButton>
                            <IconButton onClick={() => {
                                const target_canvas = document.getElementById(`pdfcanvas-${path}-1`);
                                let target_index = 0;
                                for (let i = 0; i < filePaths.length; i++) {
                                    if (filePaths[i] === path) {
                                        target_index = i;
                                        break;
                                    }
                                }
                                rotateInfo.map((data:number,index:number) => {
                                    if(index === target_index && target_canvas){
                                        target_canvas.style.transform = `rotate(${(data + 90) % 360}deg)`;
                                    }
                                })
                                setRotateInfo(rotateInfo.map((data: number, index: number) => index === target_index ? (data + 90) % 360 : data));
                            }}>
                                <RotateRight/>
                            </IconButton>
                            <PdfRender filePath={path} isTopPage={true}></PdfRender>
                        </div>
                    )
                })
            }
        </React.Fragment>
    );
}

export default PdfMerge;