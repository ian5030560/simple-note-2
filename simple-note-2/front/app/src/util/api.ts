import { Cookies } from "react-cookie";
import { ThemeSeed } from "./theme";
import { Token } from "../User/SideBar/useUser";

const BASE_URL = `http://localhost:8000`;

const API = {
  Auth: {
    // registerOrLogin: `${BASE_URL}/registerAndLogin/`,
    signUp: `${BASE_URL}/register/`,
    signIn: `${BASE_URL}/login/`,
    forgetPassword: `${BASE_URL}/forgetPassword/`,
    signOut: `${BASE_URL}/logout/`,
  },

  File: {
    add: `${BASE_URL}/media/new/`,
    delete: `${BASE_URL}/media/delete`,
  },

  Info: {
    get: `${BASE_URL}/info/get/`,
    update: `${BASE_URL}/info/update`,
  },

  Note: {
    get: `${BASE_URL}/note/get`,
    add: `${BASE_URL}/note/new`,
    delete: `${BASE_URL}/note/delete/`,
    save: `${BASE_URL}/note/save/`,
    loadTree: `${BASE_URL}/note/tree`,
  },

  Theme: {
    add: `${BASE_URL}/theme/new`,
    get: `${BASE_URL}/theme/get`,
    delete: `${BASE_URL}/theme/delete`
  },

  Collaborate: {
    add: `${BASE_URL}/collaborate/new`,
    delete: `${BASE_URL}/collaborate/delete`,
    join: `${BASE_URL}/collaborate/join/`,
    people: `http://localhost:4000/room?`,
  },

  AI: "ws://cf00-61-216-112-156.ngrok-free.app/ws/ai/",
  JWT: {
    register: `${BASE_URL}/api/jwtauth/register/`, // 儲存使用者並返回tokens
    token: `${BASE_URL}/api/jwtauth/token/`, // 確認使用者並返回新的一組tokens
    refresh: `${BASE_URL}/api/jwtauth/refresh/`, // 使用 refresh token 更新 access token
  }
}

// type APIMap = {
//   [API.registerOrLogin]: { id: `sign-in` | `register`, username: string, password: string, email?: string },
//   [API.forgetPassword]: { username: string, email: string },
//   [API.signOut]: { username: string },
//   [API.deleteFile]: { username: string, url: string, note_title_id: string },
//   [API.getInfo]: { username: string },
//   [API.updateInfo]: { username: string, image: string, data: any },
//   [API.getNote]: { username: string, noteId: string },
//   [API.addNote]: { username: string, noteId: string, notename: string, parentId: string | null, silbling_id: string | null },
//   [API.deleteNote]: { username: string, noteId: string },
//   [API.saveNote]: { username: string, noteId: string, content: any },
// [API.addTheme]: {
//   username: string,
//   theme: {
//     name: string,
//     data: {
//       colorLightPrimary: string,
//       colorLightNeutral: string,
//       colorDarkPrimary: string,
//       colorDarkNeutral: string
//     }
//   }
// },
//   [API.loadNoteTree]: { username: string },
//   [API.addCollaborate]: { username: string, noteId: string, url: string },
//   [API.deleteCollaborate]: { username: string, noteId: string, masterName: string },
//   [API.joinCollaborate]: { username: string, url: string },
//   [API.getNumber]: { room: string },
// }

const headers = {
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "content-type": "application/json",
}

const jwtHeaders = {
  ...headers,
  "accept": "application/json",
}

const postSetup = (access?: Token["access"]): RequestInit => {
  if (access) {
    Object.assign(headers, { "Authorization": `Bearer ${access}` });
  }
  return {
    method: "POST",
    headers: headers
  };
};

function authFn(username: string, password: string, email: string | undefined, type: "sign-in" | "register") {
  const data = { username, password, email, id: type };
  const token = new Cookies().get("token");

  return fetch(type == "register" ? API.Auth.signUp : API.Auth.signIn, { ...postSetup(token.access), body: JSON.stringify(data) });
}

function createFormData(data: Record<string, any>) {
  const formData = new FormData();
  Object.keys(data).forEach(key => formData.append(key, data[key]));

  return formData;
}

export default function useAPI() {

  return {
    auth: {
      signIn: (username: string, password: string) => authFn(username, password, undefined, "sign-in"),
      signUp: (username: string, password: string, email: string) => authFn(username, password, email, "register"),
      signOut: (username: string) => {
        const { access } = new Cookies().get("token");
        return fetch(API.Auth.signOut, { ...postSetup(access), body: JSON.stringify({ username }) });
      },
      forgetPassword: (username: string, email: string) => fetch(API.Auth.forgetPassword, { ...postSetup, body: JSON.stringify({ username, email }) })
    },

    file: {
      delete: (username: string, url: string, noteId: string) => {
        const { access } = new Cookies().get("token");
        return fetch(API.File.delete, { ...postSetup(access), body: JSON.stringify({ username, url, note_title_id: noteId }) })
      },
      add: (username: string, file: File, noteName: string) => {
        const { access } = new Cookies().get("token");
        return fetch(API.File.add, {
          ...postSetup(access),
          headers: { "user-agent": headers["user-agent"] },
          body: createFormData({ username, filename: file.name, notename: noteName, content: file })
        })
      },
    },

    note: {
      get: (username: string, noteId: string) => {
        const { access } = new Cookies().get("token");
        return fetch(API.Note.get, { ...postSetup(access), body: JSON.stringify({ username, noteId }) });
      },
      add: (username: string, noteId: string, notename: string, parentId: string | null, silblingId: string | null) => {
        const { access } = new Cookies().get("token");
        return fetch(API.Note.add, { ...postSetup(access), body: JSON.stringify({ username, noteId, notename, parentId, silblingId }) })
      },
      delete: (username: string, noteId: string) => {
        const { access } = new Cookies().get("token");
        return fetch(API.Note.delete, { ...postSetup(access), body: JSON.stringify({ username, noteId }) });
      },
      save: (username: string, noteId: string, content: string, keepAlive?: boolean) => {
        const { access } = new Cookies().get("token");
        return fetch(API.Note.save, { ...postSetup(access), body: JSON.stringify({ username, noteId, content }), keepalive: keepAlive });
      },
      loadTree: (username: string) => {
        const { access } = new Cookies().get("token");
        return fetch(API.Note.loadTree, { ...postSetup(access), body: JSON.stringify({ username }) });
      },
    },

    collab: {
      add: (username: string, noteId: string, url: string) => {
        const { access } = new Cookies().get("token");
        return fetch(API.Collaborate.add, { ...postSetup(access), body: JSON.stringify({ username, noteId, url }) });
      },
      delete: (username: string, noteId: string, masterName: string) => {
        const { access } = new Cookies().get("token");
        return fetch(API.Collaborate.delete, { ...postSetup(access), body: JSON.stringify({ username, noteId, masterName }) });
      },
      join: (username: string, url: string, masterName: string) => {
        const { access } = new Cookies().get("token");
        return fetch(API.Collaborate.join, { ...postSetup(access), body: JSON.stringify({ username, url, masterName }) })
      },

      // 取得房間人數
      people: (room: string) => fetch(API.Collaborate.people + new URLSearchParams({ id: room }), { method: "GET", headers })
    },

    info: {
      get: () => { },
      update: () => { },
    },

    theme: {
      add: (username: string, theme: { name: string, data: ThemeSeed }) => {
        const { access } = new Cookies().get("token");
        return fetch(API.Theme.add, {...postSetup(access), body: JSON.stringify({ username, theme })})
      },
      get: () => { },
      delete: () => { }
    },

    ai: {
      socket: () => new WebSocket(API.AI)
    },

    jwt: {
      register: (username: string, password: string, email: string) => fetch(API.JWT.register, {
        ...postSetup(), headers: jwtHeaders,
        body: JSON.stringify({ username, password, email, password2: password })
      }),
      getToken: (username: string, password: string) => fetch(API.JWT.token, {
        ...postSetup(), headers: jwtHeaders,
        body: JSON.stringify({ username, password })
      }),
      refresh: (refresh: string) => fetch(API.JWT.refresh, {
        ...postSetup(), headers: jwtHeaders, body: JSON.stringify({ refresh })
      }),
    }
  }
}