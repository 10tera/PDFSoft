import React, {useState, useEffect, useRef} from "react";
import Dropzone from "./components/Dropzone";
import PdfRender from "./components/PdfRender";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = "../node_modules/pdfjs-dist/build/pdf.worker.js";

const PdfReader: React.FC = () => {
    const [filePaths,setFilePaths] = useState<string[]>([]);
    const [fileName,setFileName] = useState("");
    const renderPdf = useRef<{ renderPdf(): void}>(null);

    const getFileName = async (path:string) => {
        const gotFileName = await window.eAPI.getBaseName(path);
        setFileName(gotFileName);
    }
    
    useEffect(() => {
        if(filePaths.length !== 1 || !filePaths){
            return;
        }
        getFileName(filePaths[0]);
        //setFileName(gotFileName);
        //renderPdf?.current?.renderPdf();
    },[filePaths]);

    return (
        <React.Fragment>
            <h1>PDF Reader</h1>
            <p>PDFの表示や印刷</p>
            <Dropzone openFile setFilePaths={setFilePaths}></Dropzone>
            <p>{fileName}</p>
            <PdfRender filePath={filePaths[0]} isTopPage = {true}></PdfRender>
        </React.Fragment>
    );
}

export default PdfReader;