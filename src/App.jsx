import { BrowserRouter } from "react-router-dom";
import RoutesApp from "./routes";

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';

import GlobalStyle from './styles/global';

function App() {

  return (
    <BrowserRouter>
      <ToastContainer />
      <GlobalStyle />
      <RoutesApp />
    </BrowserRouter>
  )
}

export default App
