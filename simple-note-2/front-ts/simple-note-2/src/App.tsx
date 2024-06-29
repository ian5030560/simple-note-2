import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./Welcome";
import UserPage from "./User";
import ThemePage from "./ThemeEdit";
import { CookiesProvider } from "react-cookie";
import "./App.css";
import { AuthMiddleware } from "./util/middleware";
import ContextProvider from "./util/context";

const Index = () => {

  return <BrowserRouter>
    <Routes>
      <Route path="test" element={<UserPage />} />
      <Route element={<AuthMiddleware />}>
        <Route path="/" element={<WelcomePage />} />
        <Route element={<ContextProvider />}>
          <Route path=":file" element={<UserPage />} />
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