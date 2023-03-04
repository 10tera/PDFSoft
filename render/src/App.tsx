import { useState, version } from 'react';
import { Routes, Route,useNavigate} from 'react-router-dom';
import "../../electron/src/types/global";
import Home from "./pages/Home";
import PdfReader from './pages/PdfReader';
import PdfMerge from './pages/PdfMerge';
import PdfSplit from './pages/PdfSplit';
import PdfRotate from './pages/PdfRotate';
import Settings from './pages/Settings';
import Error404 from './pages/Error404';



const App = () => {
  const navigate = useNavigate();

  window.eAPI.screenTransition((_event, to) => {
    navigate(to);
  });

  return(
    <Routes>
      <Route path = {"/"} element = {<Home/>} />
      <Route path = {"/pdfreader"} element = {<PdfReader/>} />
      <Route path = {"/pdfmerge"} element = {<PdfMerge/>} />
      <Route path = {"/pdfsplit"} element = {<PdfSplit/>} />
      <Route path = {"/pdfrotate"} element = {<PdfRotate/>} />
      <Route path = {"/settings"} element = {<Settings/>} />
      <Route path = {"*"} element = {<Error404/>} />
    </Routes>
  )
}

export default App
