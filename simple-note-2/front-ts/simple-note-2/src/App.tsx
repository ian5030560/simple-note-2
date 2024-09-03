import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import UserPage from "./User";
import ThemePage from "./ThemeEdit";
import { CookiesProvider } from "react-cookie";
import "./App.css";
import {contentLoader, settingLoader, NoteProvider, SettingProvider, PublicProvider, PrivateProvider } from "./util/provider";
import WelcomeLayout from "./Welcome";
import Intro from "./Welcome/Intro";
import Auth from "./Welcome/Auth";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PublicProvider/>}>
        <Route path="/" element={<WelcomeLayout />}>
          <Route index element={<Intro />} />
          <Route path="auth" element={<Auth />} />
        </Route>
      </Route>

      <Route element={<PrivateProvider/>}>
        <Route path="note" element={<SettingProvider />} loader={settingLoader}>
          <Route path=":file" element={<NoteProvider><UserPage /></NoteProvider>} loader={contentLoader} />
          <Route path=":host/:file" element={<UserPage/>} />
        </Route>
      </Route>

      <Route path="test" element={<UserPage />} />
      <Route path="theme" element={<ThemePage />} />
    </>
  )
)


export default function App(): React.JSX.Element {
  return <React.StrictMode>
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <RouterProvider router={router} />
    </CookiesProvider>
  </React.StrictMode>
}