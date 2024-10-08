import React from "react";
import { createBrowserRouter, createRoutesFromElements, isRouteErrorResponse, LoaderFunctionArgs, Outlet, Route, RouterProvider, useRouteError } from "react-router-dom";
import UserLayout from "./User";
import ThemePage from "./ThemeEdit";
import { CookiesProvider } from "react-cookie";
import "./App.css";
import { contentLoader, settingLoader, SettingProvider, PublicProvider, PrivateProvider, collaborateLoader, ThemeConfigProvider } from "./util/provider";
import WelcomeLayout from "./Welcome";
import Intro from "./Welcome/Intro";
import Auth from "./Welcome/Auth";
import Editor from "./Editor";
import EditorComponent from "./Editor/editor";
import { EditorErrorBoundary, SettingErrorBoundary } from "./boundary";

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
        <Route path="note" element={<SettingProvider />} loader={settingLoader} errorElement={<SettingErrorBoundary />}>
          <Route element={<UserLayout><Outlet /></UserLayout>}>
            <Route path=":id/:host?" element={<Editor />}
              errorElement={<EditorErrorBoundary />}
              loader={(args: LoaderFunctionArgs<any>) => {
                const { params } = args;
                const { id, host } = params;
                const collab = !!(id && host);
                return !collab ? contentLoader(args) : collaborateLoader(args)
                  .then(async (only) => {
                    if (only) return await contentLoader(args);
                    return null;
                  })
                  .catch(() => {
                    throw new Response(undefined, { status: 404 })
                  });
              }} />
          </Route>
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