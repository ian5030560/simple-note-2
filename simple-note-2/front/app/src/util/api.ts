import { Cookies } from "react-cookie";
import { ThemeSeed } from "./theme";

const BASE_URL = `http://localhost:8000`;

const API = {
  Auth: {
    // registerOrLogin: `${BASE_URL}/registerAndLogin/`,
    signUp: `${BASE_URL}/register/`,
    signIn: `${BASE_URL}/login/`,
    forgetPassword: `${BASE_URL}/forgetPassword/`,
    // signOut: `${BASE_URL}/logout/`,
  },

  File: {
    add: `${BASE_URL}/media/new/`,
    delete: `${BASE_URL}/media/delete`,
  },

  Info: {
    get: `${BASE_URL}/info/get/`,
    update: `${BASE_URL}/info/update/`,
  },

  Note: {
    get: `${BASE_URL}/note/get/`,
    add: `${BASE_URL}/note/new/`,
    delete: `${BASE_URL}/note/delete/`,
    save: `${BASE_URL}/note/save/`,
    loadTree: `${BASE_URL}/note/tree/`,
  },

  Theme: {
    add: `${BASE_URL}/theme/new/`,
    getAll: `${BASE_URL}/theme/get/`,
    delete: `${BASE_URL}/theme/delete/`
  },

  Collaborate: {
    add: `${BASE_URL}/collaborate/new/`,
    delete: `${BASE_URL}/collaborate/delete/`,
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

function getAccessToken() {
  return new Cookies().get("token").access;
}

type UpdateInfoOptions = {
  image?: string;
  password?: string;
  theme?: { id: string | null; name: string | null; };
}

export type Token = { access: string, refresh: string };

export type NoteTreeData = { noteId: string, noteName: string, parentId: string | null, silblingId: string | null };

export type LoadTreeResult = {
  one: Array<NoteTreeData>;
  multiple: Array<{ noteId: string, noteName: string, url: string }>;
}

export default function useAPI() {
  return {
    auth: {
      signIn: (username: string, password: string) => authFn(username, password, undefined, "sign-in").then(res => res.ok),
      signUp: (username: string, password: string, email: string) => authFn(username, password, email, "register").then(res => res.status),
      // signOut: (username: string) => {
      //   const access = getAccessToken();
      //   return fetch(API.Auth.signOut, { ...postSetup(access), body: JSON.stringify({ username }) });
      // },
      forgetPassword: (username: string, email: string) => fetch(API.Auth.forgetPassword, { ...postSetup, body: JSON.stringify({ username, email }) }).then(res => res.ok)
    },

    file: {
      delete: async (username: string, url: string, noteId: string) => {
        const access = getAccessToken();
        const res = await fetch(API.File.delete, { ...postSetup(access), body: JSON.stringify({ username, url, note_title_id: noteId }) });
        return res.ok;
      },
      add: async (username: string, file: File, noteName: string) => {
        const access = getAccessToken();
        const res = await fetch(API.File.add, {
          method: "POST",
          headers: { "user-agent": headers["user-agent"] },
          body: createFormData({ username, filename: file.name, notename: noteName, content: file })
        });
        if (!res.ok) throw new Error();
        return await res.text();
      },
    },

    note: {
      get: async (username: string, noteId: string) => {
        const access = getAccessToken();
        const res = await fetch(API.Note.get, { ...postSetup(access), body: JSON.stringify({ username, noteId }) });
        if (!res.ok) throw new Error();
        return res.status === 204 ? null : res.text();
      },
      add: async (username: string, noteId: string, notename: string, parentId: string | null, silblingId: string | null) => {
        const access = getAccessToken();
        const res = await fetch(API.Note.add, { ...postSetup(access), body: JSON.stringify({ username, noteId, notename, parentId, silblingId }) });
        return res.ok;
      },
      delete: async (username: string, noteId: string) => {
        const access = getAccessToken();
        const res = await fetch(API.Note.delete, { ...postSetup(access), body: JSON.stringify({ username, noteId }) });
        return res.ok;
      },
      save: async (username: string, noteId: string, content: string, keepAlive?: boolean) => {
        const access = getAccessToken();
        const res = await fetch(API.Note.save, { ...postSetup(access), body: JSON.stringify({ username, noteId, content }), keepalive: keepAlive });
        return res.ok;
      },
      loadTree: async (username: string) => {
        const access = getAccessToken();
        const res = await fetch(API.Note.loadTree, { ...postSetup(access), body: JSON.stringify({ username }) });
        if (!res.ok) throw new Error();
        return await res.json() as LoadTreeResult;
      },
    },

    collab: {
      add: async (username: string, noteId: string, url: string) => {
        const access = getAccessToken();
        const res = await fetch(API.Collaborate.add, { ...postSetup(access), body: JSON.stringify({ username, noteId, url }) });
        return res.ok;
      },
      delete: async (username: string, noteId: string, masterName: string) => {
        const access = getAccessToken();
        const res = await fetch(API.Collaborate.delete, { ...postSetup(access), body: JSON.stringify({ username, noteId, masterName }) });
        return res.ok;
      },
      join: async (username: string, url: string, masterName: string) => {
        const access = getAccessToken();
        const res = await fetch(API.Collaborate.join, { ...postSetup(access), body: JSON.stringify({ username, url, masterName }) });
        return res.ok || res.status === 401;
      },

      // 取得房間人數
      people: (room: string) => fetch(API.Collaborate.people + new URLSearchParams({ id: room }), { method: "GET", headers }).then(async res => {
        if (!res.ok) throw new Error();
        return await res.json() as { count: number };
      })
    },

    info: {
      get: async (username: string) => {
        const access = getAccessToken();
        const res = await fetch(API.Info.get, { ...postSetup(access), body: JSON.stringify({ username }) });
        if (!res.ok) throw new Error();
        return await res.json() as { image: string | null; themeId: string; password: string };
      },
      update: async (username: string, options: UpdateInfoOptions) => {
        const access = getAccessToken();
        const res = await fetch(API.Info.update, {
          ...postSetup(access), body: JSON.stringify({
            username,
            data: { image: options.image ?? null, password: options.password ?? null, theme: options.theme ?? null }
          })
        });
        return res.ok;
      },
    },

    theme: {
      add: async (username: string, theme: { name: string, data: ThemeSeed }) => {
        const access = getAccessToken();
        const res = await fetch(API.Theme.add, { ...postSetup(access), body: JSON.stringify({ username, theme }) });
        return res.ok;
      },
      getAll: async (username: string) => {
        const access = getAccessToken();
        const res = await fetch(API.Theme.getAll, { ...postSetup(access), body: JSON.stringify({ username }) });
        if (!res.ok) throw new Error();
        return await res.json() as { id: string; name: string; data: ThemeSeed; }[];
      },
      delete: async (username: string, id: string) => {
        const access = getAccessToken();
        const res = await fetch(API.Theme.delete, { ...postSetup(access), body: JSON.stringify({ username, themeId: id }) });
        return res.ok;
      }
    },

    ai: {
      socket: () => new WebSocket(API.AI)
    },

    jwt: {
      // register: () => fetch(API.JWT.register, {
      //   ...postSetup(), headers: jwtHeaders,
      //   body: JSON.stringify({ username: "user1", email: "user1@gmail.com", password: "testUser", password2: "testUser" })
      // }).then(async res => {
      //   if (!res.ok) throw new Error();
      //   return await res.json() as Token;
      // }),
      getToken: () => fetch(API.JWT.token, {
        ...postSetup(), headers: jwtHeaders,
        body: JSON.stringify({ username: "user1", password: "testuser" })
      }).then(async res => {
        if (!res.ok) throw new Error();
        return await res.json() as Token;
      }),
      refresh: (refresh: string) => fetch(API.JWT.refresh, {
        ...postSetup(), headers: jwtHeaders, body: JSON.stringify({ refresh })
      }).then(async res => !res.ok ? null : await res.json() as Omit<Token, "refresh">),
    }
  }
}