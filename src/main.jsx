import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router";

import App from "./App";
import Home from "./routes/Home.jsx";
import Settings from "./routes/Settings.jsx";
import SystemReport from "./routes/SystemReport.jsx";

import Login from "./routes/auth/Login.jsx";

import HomeLayout from "./layouts/HomeLayout";

import "./main.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes>
            <Route index={true} element={<App />} />

            <Route path="home" element={<HomeLayout />}>
                <Route index element={<Home />} />
                <Route path="settings" element={<Settings />} />
                <Route path="sysreport" element={<SystemReport />} />
            </Route>

            <Route path="login" element={<Login />} />
        </Routes>
    </BrowserRouter>
);
