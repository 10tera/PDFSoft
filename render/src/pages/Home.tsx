import React, {} from "react";
import "../assets/Home.css"

const Home: React.FC = () => {
    return(
        <React.Fragment>
            <div className="all">
                <div className="mainTitle">
                    <h1 className="title">PDFツール</h1>
                    <h4 className="title">　かんたんに使える</h4>
                    <h4 className="title">　時短につながるテンプレート機能</h4>
                    <h4 className="title">　カスタマイズ機能</h4>
                </div>
                <div className="pdfTools">
                    <h2>全てのPDFツール</h2>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Home;