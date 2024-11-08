const API = {
  Auth: {
    registerOrLogin: "http://localhost:8000/registerAndLogin/",
    forgetPassword: "http://localhost:8000/forgetPassword/",
    signOut: "http://localhost:8000/logout/",
  },

  File: {
    add: "http://localhost:8000/newMediaFile/",
    delete: "http://localhost:8000/deleteFile/",
  },

  Info: {
    get: "http://localhost:8000/getInfo/",
    update: "http://localhost:8000/updateInfo/",
  },

  Note: {
    get: "http://localhost:8000/getNote/",
    add: "http://localhost:8000/newNote/",
    delete: "http://localhost:8000/deleteNote/",
    save: "http://localhost:8000/saveNote/",
    loadTree: "http://localhost:8000/loadNoteTree/",
  },

  Theme: {
    add: "http://localhost:8000/newTheme/",
  },

  Collaborate: {
    add: "http://localhost:8000/newCollaborate/",
    delete: "http://localhost:8000/deleteCollaborate/",
    join: "http://localhost:8000/joinCollaborate/",
    people: "http://localhost:4000/room?",
  },

  AI: "ws://localhost:4000/ws/ai"
}

// type APIMap = {
//   [API.registerOrLogin]: { id: "sign-in" | "register", username: string, password: string, email?: string },
//   [API.forgetPassword]: { username: string, email: string },
//   [API.signOut]: { username: string },
//   [API.deleteFile]: { username: string, url: string, note_title_id: string },
//   [API.getInfo]: { username: string },
//   [API.updateInfo]: { username: string, image: string, data: any },
//   [API.getNote]: { username: string, noteId: string },
//   [API.addNote]: { username: string, noteId: string, notename: string, parentId: string | null, silbling_id: string | null },
//   [API.deleteNote]: { username: string, noteId: string },
//   [API.saveNote]: { username: string, noteId: string, content: any },
//   [API.addTheme]: {
//     username: string,
//     theme: {
//       name: string,
//       data: {
//         colorLightPrimary: string,
//         colorLightNeutral: string,
//         colorDarkPrimary: string,
//         colorDarkNeutral: string
//       }
//     }
//   },
//   [API.loadNoteTree]: { username: string },
//   [API.addCollaborate]: { username: string, noteId: string, url: string },
//   [API.deleteCollaborate]: { username: string, noteId: string, masterName: string },
//   [API.joinCollaborate]: { username: string, url: string },
//   [API.getNumber]: { room: string },
// }

const setup = {
  headers: {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "content-type": "application/json",
  }
}
const postSetup = {
  ...setup,
  method: "POST",
}

function authFn(username: string, password: string, email: string | undefined, type: "sign-in" | "register") {
  const data = { username, password, email, id: type };
  return fetch(API.Auth.registerOrLogin, { ...postSetup, body: JSON.stringify(data) });
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
      signOut: (username: string) => fetch(API.Auth.signOut, { ...postSetup, body: JSON.stringify({ username }) }),
      forgetPassword: (username: string, email: string) => fetch(API.Auth.forgetPassword, { ...postSetup, body: JSON.stringify({ username, email }) }),
    },

    file: {
      delete: (username: string, url: string, noteId: string) => fetch(API.File.delete, { ...postSetup, body: JSON.stringify({ username, url, note_title_id: noteId }) }),
      add: (username: string, file: File, noteName: string) => fetch(API.File.add, { ...postSetup, body: createFormData({ username, filename: file.name, notename: noteName, content: file }) }),
    },

    note: {
      get: (username: string, noteId: string) => fetch(API.Note.get, { ...postSetup, body: JSON.stringify({ username, noteId }) }),
      add: (username: string, noteId: string, notename: string, parentId: string | null, silblingId: string | null) => {
        return fetch(API.Note.add, { ...postSetup, body: JSON.stringify({ username, noteId, notename, parentId, silblingId }) })
      },
      delete: (username: string, noteId: string) => fetch(API.Note.delete, { ...postSetup, body: JSON.stringify({ username, noteId }) }),
      save: (username: string, noteId: string, content: any) => fetch(API.Note.save, { ...postSetup, body: JSON.stringify({ username, noteId, content }) }),
      loadTree: (username: string) => fetch(API.Note.loadTree, { ...postSetup, body: JSON.stringify({ username }) }),
    },

    collab: {
      add: (username: string, noteId: string, url: string) => fetch(API.Collaborate.add, { ...postSetup, body: JSON.stringify({ username, noteId, url }) }),
      delete: (username: string, noteId: string, masterName: string) => fetch(API.Collaborate.delete, { ...postSetup, body: JSON.stringify({ username, noteId, masterName }) }),
      join: (username: string, url: string, masterName: string) => fetch(API.Collaborate.join, { ...postSetup, body: JSON.stringify({ username, url, masterName }) }),

      // 取得房間人數
      people: (room: URLSearchParams) => fetch(API.Collaborate.people + room.toString(), { method: "GET", ...setup })
    },

    info: {
      get: () => { },
      update: () => { },
    },

    theme: {
      add: () => { },
    }
  }
}