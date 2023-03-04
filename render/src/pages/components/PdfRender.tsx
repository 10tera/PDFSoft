import React, { useEffect, forwardRef, useImperativeHandle, useState} from "react";
import * as pdfjs from "pdfjs-dist";

type Props = {
    filePath: string;
    isTopPage: boolean;
};


const PdfReader: React.FC<Props> = (props)=> {
    const [isBeforeRender,setIsBeforeRender] = useState(true);
    const [pdfNumPages,setPdfNumPages] = useState(0);
    /*
    useImperativeHandle(ref, () => ({
        renderPdf(){
            setPageIndexs(_old => []);
            pdfjs.getDocument(props.filePath).promise.then((pdf) => {
                if(props.isTopPage){
                    setPageIndexs([1]);
                }
                else{
                    for (let i = 1; i <= pdf.numPages; i++) {
                        setPageIndexs(old => [...old,i]);
                    }
                }
            });
            setIsBeforeRender(false);
        }
    }));
    */

    
    /*
    useEffect(() => {
        if(pageIndexs.length < 1 || !pageIndexs){
            return;
        }
        if(!props.filePath)return;
        if(isBeforeRender)return;
        console.log(props.filePath);
        pdfjs.getDocument(props.filePath).promise.then((pdf) => {
            console.log(pdf._pdfInfo);
            for (let i = 1; i <= pageIndexs.length; i++) {
                pdf.getPage(i).then((page) => {
                    const scale = 1.0;
                    const viewport = page.getViewport({scale});
                    const canvas = document.getElementById(`pdfRendering${props.filePath}_${i}`);
                    if(canvas){
                        canvas.setAttribute("width",viewport.width.toString());
                        canvas.setAttribute("height", viewport.height.toString());
                        const renderCtx = {canvasContext: canvas.getContext("2d"), viewport: viewport};
                        page.render(renderCtx);
                    }

                });
            }
        });
        setIsBeforeRender(true);
    },[pageIndexs]);
    */


    useEffect(() => {
        if(!props.filePath)return;
        pdfjs.getDocument(props.filePath).promise.then((pdf) => {
            if(props.isTopPage)setPdfNumPages(1);
            else setPdfNumPages(pdf.numPages);
            /*
            for (let i = 1; i <= pdf.numPages; i++) {
                pdf.getPage(i).then((page) => {
                    const scale = 1.0;
                    const viewport = page.getViewport({ scale });
                    const canvas = document.getElementById(`pdfcanvas-${props.filePath}-${i}`);
                    if (canvas) {
                        canvas.setAttribute("width", viewport.width.toString());
                        canvas.setAttribute("height", viewport.height.toString());
                        const renderCtx = { canvasContext: canvas.getContext("2d"), viewport: viewport };
                        page.render(renderCtx);
                    }

                });
            }
            */
        });
    },[props.filePath])

    useEffect(() => {
        if(pdfNumPages < 1)return;
        pdfjs.getDocument(props.filePath).promise.then((pdf) => {
            for (let i = 1; i <= pdfNumPages; i++) {
                pdf.getPage(i).then((page) => {
                    const scale = 1.0;
                    const viewport = page.getViewport({ scale });
                    const canvas = document.getElementById(`pdfcanvas-${props.filePath}-${i}`);
                    if (canvas) {
                        canvas.setAttribute("width", viewport.width.toString());
                        canvas.setAttribute("height", viewport.height.toString());
                        const renderCtx = { canvasContext: canvas.getContext("2d"), viewport: viewport };
                        page.render(renderCtx);
                    }

                });
            }
        });
    },[pdfNumPages])
    

    return (
        <React.Fragment>
            {
                (() => {
                    const canvass: React.ReactElement[] = [];
                    for(let i = 0; i < pdfNumPages; i++){
                        canvass.push(<div key={`pdfcanvas-${props.filePath}-${i+1}`}>
                            <canvas id={`pdfcanvas-${props.filePath}-${i + 1}`} style={{transform: "rotate(0deg)"}}></canvas>
                            <br></br>
                        </div>);
                    }
                    return (
                        <div key={`pdfcanvasdiv-${props.filePath}`}>{canvass}</div>
                    );
                })()
            }
        </React.Fragment>
    );
}

export default PdfReader;