import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./Welcome";
import "./resource/root.css";
import UserPage from "./User";
import ThemePage from "./ThemeEdit";
import { CookiesProvider } from "react-cookie";

function App() {
  return <CookiesProvider defaultSetOptions={"/"}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path=":file" element={<UserPage />} />
        <Route path="theme" element={<ThemePage />} />
      </Routes>
    </BrowserRouter>
  </CookiesProvider>
}

export default App;
