import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import WelcomePage from "./Welcome";
import UserPage from "./User";
import ThemePage from "./ThemeEdit";
import { CookiesProvider, useCookies } from "react-cookie";
import "./App.css";

const Index = () => {
  const [{ username }] = useCookies(["username"]);
  
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={!username ? <WelcomePage /> : <Navigate to={"/user"}/>} />
      <Route path="user" element={<UserPage />} />
      <Route path=":file" element={username ? <UserPage/> : <Navigate to={"/"}/>}/>
      <Route path="theme" element={<ThemePage />} />
    </Routes>
  </BrowserRouter>
}

export default function App(): React.JSX.Element {
  return <CookiesProvider defaultSetOptions={{ path: "/" }}>
    <Index/>
  </CookiesProvider>
}