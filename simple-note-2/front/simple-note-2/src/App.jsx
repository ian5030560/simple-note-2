import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./welcome/welcome";
import "./resource/root.css";
import UserPage from "./user/user";
import ThemePage from "./themeEdit/theme";
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
