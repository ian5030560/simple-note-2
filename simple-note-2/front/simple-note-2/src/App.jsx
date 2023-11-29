import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Welcome from "./welcome/welcome";
import "./resource/root.css";
import UserPage from "./user/user";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome/>}/>
        <Route path="user" element={<UserPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
