import React from "react";
import { createBrowserRouter, createRoutesFromElements, LoaderFunctionArgs, Outlet, Route, RouterProvider } from "react-router-dom";
import ThemePage from "./ThemeEdit";
import { CookiesProvider } from "react-cookie";
import "./App.css";
import { contentLoader, settingLoader, PublicProvider, PrivateProvider, collaborateLoader, ThemeConfigProvider, getCookie } from "./util/loader";
import WelcomeLayout from "./Welcome";
import Intro from "./Welcome/Intro";
import Auth from "./Welcome/Auth";
import Editor from "./Editor";
// import EditorComponent from "./Editor/editor";
import { EditorErrorBoundary, SettingErrorBoundary } from "./boundary";
import { decodeBase64 } from "./util/secret";
import UserLayout from "./User";

function editorLoader(args: LoaderFunctionArgs<any>){
  const { params } = args;
  const { id, host } = params;
  const collab = !!(id && host);

  const cookie = getCookie();
  const username = cookie.get("username");

  return !collab ? contentLoader(args, username!) : collaborateLoader(args)
    .then(async (only) => {
      if (only) return await contentLoader(args, decodeBase64(host));
      return null;
    })
    .catch(() => {
      throw new Response(undefined, { status: 404 })
    });
}

const EditorComponent = React.lazy(() => import("./Editor/editor"));

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
        <Route path="note" element={<UserLayout/>} loader={settingLoader} errorElement={<SettingErrorBoundary />}>
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