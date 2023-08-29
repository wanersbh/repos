import { Route, Routes } from "react-router-dom";
import Main from './pages/Main';
import Repositorio from './pages/Repositorio';

export default function RoutesApp() {
    return (
        <Routes>
            <Route path="/" Component={Main} />
            <Route path="/repositorio/:repositorio" Component={Repositorio} />
        </Routes>
    )
}