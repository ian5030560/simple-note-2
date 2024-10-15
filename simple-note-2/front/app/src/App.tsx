import React from "react";
import { createBrowserRouter, createRoutesFromElements, LoaderFunctionArgs, Route, RouterProvider } from "react-router-dom";
import ThemePage from "./ThemeEdit";
import { CookiesProvider } from "react-cookie";
import "./App.css";
import { contentLoader, settingLoader, Public, Private, collaborateLoader, ThemeConfigProvider, getCookie } from "./util/loader";
import WelcomeLayout from "./Welcome";
import Intro from "./Welcome/Intro";
import Auth from "./Welcome/Auth";
import Editor from "./Editor";
import { EditorErrorBoundary, SettingErrorBoundary } from "./boundary";
import { decodeBase64 } from "./util/secret";
import UserLayout, { Switch } from "./User";

function editorLoader(args: LoaderFunctionArgs<any>) {
  const { params } = args;
  const { id, host } = params;
  const collab = !!(id && host);

  const cookie = getCookie();
  const username = cookie.get("username");

  return !collab ? contentLoader(args, username!) : collaborateLoader(args)
    .then(async (only) => {
      console.log(only);
      if (only) return await contentLoader(args, decodeBase64(host));
      return false;
    })
    .catch(() => {
      throw new Response(undefined, { status: 403 })
    });
}

const EditorComponent = React.lazy(() => import("./Editor/editor"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Public />}>
        <Route path="/" element={<WelcomeLayout />}>
          <Route index element={<Intro />} />
          <Route path="auth" element={<Auth />} />
        </Route>
      </Route>

      <Route element={<Private />}>
        <Route path="note" element={<UserLayout />} loader={settingLoader} errorElement={<SettingErrorBoundary />}>
            <Route path=":id/:host?" element={<Editor />} errorElement={<EditorErrorBoundary />} loader={editorLoader} />
        </Route>
      </Route>

      <Route path="test">
        <Route index element={<EditorComponent test />} />
        <Route path="collab" element={<EditorComponent test collab />} />
      </Route>
      <Route path="theme" element={<ThemePage />} />
    </>
  )
)


export default function App(): React.JSX.Element {
  return <ThemeConfigProvider>
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <RouterProvider router={router} />
    </CookiesProvider>
  </ThemeConfigProvider>
}