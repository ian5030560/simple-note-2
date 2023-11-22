import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Welcome from "./pages/welcome";
import "./resource/root.css";
import UserPage from "./pages/user";

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
