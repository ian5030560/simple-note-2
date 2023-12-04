import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./welcome/welcome";
import "./resource/root.css";
import UserPage from "./user/user";
import ThemePage from "./themeEdit/theme";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage/>}/>
        <Route path="user/:username" element={<UserPage/>}/>
        <Route path="theme" element={<ThemePage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
