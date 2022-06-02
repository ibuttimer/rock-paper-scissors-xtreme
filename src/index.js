import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.js';
import Main from './views/Main/Main.jsx'
import Rules from './views/Rules/Rules.jsx'
import reportWebVitals from './reportWebVitals.js';
import Navbar from './components/layout/Navbar/Navbar.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <App /> }>
                    <Route path="" element={ <Main /> } />
                    <Route path="rules" element={ <Rules /> } />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
