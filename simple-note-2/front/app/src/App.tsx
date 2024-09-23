import React from "react";
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from "react-router-dom";
import UserLayout from "./User";
import ThemePage from "./ThemeEdit";
import { CookiesProvider } from "react-cookie";
import "./App.css";
import { contentLoader, settingLoader, NoteProvider, SettingProvider, PublicProvider, PrivateProvider } from "./util/provider";
import WelcomeLayout from "./Welcome";
import Intro from "./Welcome/Intro";
import Auth from "./Welcome/Auth";
import Editor from "./Editor";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PublicProvider />}>
        <Route path="/" element={<WelcomeLayout />}>
          <Route index element={<Intro />} />
          <Route path="auth" element={<Auth />} />
        </Route>
      </Route>

      <Route element={<PrivateProvider />}>
        <Route path="note" element={<SettingProvider />} loader={settingLoader}>
          <Route element={<UserLayout><Outlet /></UserLayout>}>
            <Route path=":id/:host?" element={<Editor/>} loader={contentLoader} />
          </Route>
        </Route>
      </Route>

      <Route path="test" element={<UserLayout><Editor test/></UserLayout>} />
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