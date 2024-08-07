import React, { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./Welcome";
import UserPage from "./User";
import ThemePage from "./ThemeEdit";
import { CookiesProvider } from "react-cookie";
import "./App.css";
import { AuthProivder } from "./util/provider";
import { NoteProvider, SettingProvider } from "./util/provider";
import { APIs } from "./util/api";

const Index = () => {

  return <BrowserRouter>
    <Routes>
      <Route path="test" element={<UserPage />} />
      <Route element={<SettingProvider/>}>
        <Route path="/" element={<WelcomePage />} />
      </Route>
      <Route element={<AuthProivder />}>
        <Route element={<NoteProvider/>}>
          <Route path=":file" element={<UserPage />}/>
        </Route>
      </Route>
      <Route path="theme" element={<ThemePage />} />
    </Routes>
  </BrowserRouter>
}

export default function App(): React.JSX.Element {
  return <CookiesProvider defaultSetOptions={{ path: "/" }}>
    <Index />
  </CookiesProvider>
}