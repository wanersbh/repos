import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from './pages/Main';
import Repositorio from './pages/Repositorio';

export default function RoutesApp(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/"  Component={Main} />
                <Route path="/repositorio/:repositorio" Component={Repositorio}   />
            </Routes>
        </BrowserRouter>
    )
}