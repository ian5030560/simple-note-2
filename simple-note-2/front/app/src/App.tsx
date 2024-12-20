import React, { Suspense, useMemo } from "react";
import { createBrowserRouter, createRoutesFromElements, LoaderFunctionArgs, Outlet, Route, RouterProvider, ShouldRevalidateFunctionArgs } from "react-router-dom";
import ThemePage from "./ThemeEdit";
import { Cookies, CookiesProvider } from "react-cookie";
import "./App.css";
import { contentLoader, settingLoader, collaborateLoader, validateLoader } from "./loader";
import WelcomeLayout from "./Welcome";
import Intro from "./Welcome/intro";
import Auth from "./Welcome/Auth";
import { EditorErrorBoundary, SettingErrorBoundary } from "./boundary";
import UserLayout from "./User";
import { OfficialDarkButton, OfficialThemeProvider } from "./util/theme";
import Editor from "./Editor";
import { Public, Private } from "./route";
import withPageTitle from "./util/pageTitle";
import { SimpleNote2LocalStorage } from "./util/store";

function editorLoader(args: LoaderFunctionArgs<any>) {
  const { params } = args;
  const { id, host } = params;
  const collab = !!(id && host);

  const username = new Cookies().get("username");

  return !collab ? contentLoader(args, username!) : collaborateLoader(args)
    .then(async (only) => {
      if (only) return await contentLoader(args, atob(host));
      return false;
    })
    .catch(() => {
      throw new Response(undefined, { status: 403 })
    });
}

const EditorComponent = React.lazy(() => import("./Editor/editor"));
function shouldRevalidateFn({ currentParams: { id: oid }, nextParams: { id: nid } }: ShouldRevalidateFunctionArgs) {
  return oid !== nid;
}

const PlayGroundLayout = withPageTitle(() => <Suspense><Outlet /><OfficialDarkButton /></Suspense>, "playground");

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Public />} loader={validateLoader}>
        <Route path="/" element={<WelcomeLayout />}>
          <Route index element={<Intro />} />
          <Route path="auth" element={<Auth />} />
        </Route>
      </Route>

      <Route element={<Private />} loader={validateLoader}>
        <Route path="note" element={<UserLayout />} loader={settingLoader}
          shouldRevalidate={shouldRevalidateFn} errorElement={<SettingErrorBoundary />}>
          <Route path=":id/:host?" element={<Editor />} errorElement={<EditorErrorBoundary />}
            loader={editorLoader} shouldRevalidate={shouldRevalidateFn} />
        </Route>
        <Route path="theme" element={<ThemePage />} />
      </Route>

      <Route path="playground" element={<PlayGroundLayout />}>
        <Route index element={<EditorComponent test />} />
        <Route path="collab" element={<EditorComponent test collab />} />
      </Route>
    </>
  )
)


export default function App(): React.JSX.Element {
  
  const dark = useMemo(() => {
    const store = new SimpleNote2LocalStorage();
    return store.getOfficialDark();
  }, []);

  return <CookiesProvider defaultSetOptions={{ path: "/" }}>
    <OfficialThemeProvider dark={dark}>
      <RouterProvider router={router} />
    </OfficialThemeProvider>
  </CookiesProvider>
}