import process from "process";
import React from "react";
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from "react-router-dom";
import UserLayout from "./User";
import ThemePage from "./ThemeEdit";
import { CookiesProvider } from "react-cookie";
import "./App.css";
import { contentLoader, settingLoader, SettingProvider, PublicProvider, PrivateProvider } from "./util/provider";
import WelcomeLayout from "./Welcome";
import Intro from "./Welcome/Intro";
import Auth from "./Welcome/Auth";
import Editor, { InnerEditor } from "./Editor";

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
            <Route path=":id/:host?" element={<Editor />} loader={contentLoader} />
          </Route>
        </Route>
      </Route>

      <Route path="test" element={<UserLayout><Outlet /></UserLayout>}>
        <Route index element={<InnerEditor test />} />
        <Route path="collab" element={<InnerEditor test collab />} />
      </Route>
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