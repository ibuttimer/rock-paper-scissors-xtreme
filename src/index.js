import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.js';
import { Main, Params, Rules, Play, RoundResultView } from './views/index.js'
import { 
    BASIC_ROUTE, BIGBANG_ROUTE, XTREME_ROUTE, RULES_ROUTE, PLAY_ROUTE, ROUND_RESULT_URL
} from './Globals.js'
import reportWebVitals from './reportWebVitals.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <App /> }>
                    <Route path="" element={ <Main /> } />
                    <Route path={BASIC_ROUTE} element={ <Params /> } />
                    <Route path={BIGBANG_ROUTE} element={ <Params /> } />
                    <Route path={XTREME_ROUTE} element={ <Params /> } />
                    <Route path={RULES_ROUTE} element={ <Rules /> } />
                    <Route path={PLAY_ROUTE} element={ <Play /> } />
                    <Route path={ROUND_RESULT_URL} element={ <RoundResultView /> } />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
