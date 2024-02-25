import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./Welcome";
import UserPage from "./User";
import ThemePage from "./ThemeEdit";
import { CookiesProvider } from "react-cookie";

export default function App(): React.JSX.Element {
  return <CookiesProvider defaultSetOptions={{ path: "/" }}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path=":file" element={<UserPage />} />
        <Route path="theme" element={<ThemePage />} />
      </Routes>
    </BrowserRouter>
  </CookiesProvider>
}
