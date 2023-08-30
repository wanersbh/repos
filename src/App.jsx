import { BrowserRouter } from "react-router-dom";
import RoutesApp from "./routes";

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';

import GlobalStyle from './styles/global';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';

function App() {

  return (
    <BrowserRouter>
      <StyleSheetManager shouldForwardProp={prop => isPropValid(prop)}>
        <ToastContainer autoClose={2500} />
        <GlobalStyle />
        <RoutesApp />
      </StyleSheetManager >
    </BrowserRouter >
  )
}

export default App
