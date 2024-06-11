import { useCallback } from "react";

type APIMap = {
  "http://localhost:8000/registerAndLogin/": { id: "sign-in", username: string, password: string } | { id: "register", username: string, password: string, email: string },
  "http://localhost:8000/forgetPassword/": { username: string, email: string },
  "http://localhost:8000/logout/": { username: string },
  "http://localhost:8000/newMediaFile/": { username: string, filename: string, notename: string, content: string },
  "http://localhost:8000/deleteMediaFile/": { username: string, url: string },
  "http://localhost:8000/getInfo/": { username: string },
  "http://localhost:8000/updateInfo/": { username: string, image: string, data: any },
  "http://localhost:8000/getNote/": { username: string, noteId: string },
  "http://localhost:8000/newNote/": { username: string, noteId: string, notename: string },
  "http://localhost:8000/deleteNote/": { username: string, noteId: string },
  "http://localhost:8000/saveNote/": { username: string, noteId: string, content: any },
  "http://localhost:8000/newTheme/": {
    username: string,
    theme: {
      name: string,
      data: {
        colorLightPrimary: string,
        colorLightNeutral: string,
        colorDarkPrimary: string,
        colorDarkNeutral: string
      }
    }
  },
  "http://localhost:8000/loadNoteTree/": { username: string },
  "http://localhost:8000/gemma/": {text: string}
}

export enum APIs {
  signIn = "http://localhost:8000/registerAndLogin/",
  signUp = "http://localhost:8000/registerAndLogin/",
  forgetPassword = "http://localhost:8000/forgetPassword/",
  signOut = "http://localhost:8000/logout/",
  addFile = "http://localhost:8000/newMediaFile/",
  deleteFile = "http://localhost:8000/deleteMediaFile/",
  getInfo = "http://localhost:8000/getInfo/",
  updateInfo = "http://localhost:8000/updateInfo/",
  getNote = "http://localhost:8000/getNote/",
  addNote = "http://localhost:8000/newNote/",
  deleteNote = "http://localhost:8000/deleteNote/",
  saveNote = "http://localhost:8000/saveNote/",
  addTheme = "http://localhost:8000/newTheme/",
  loadNoteTree = "http://localhost:8000/loadNoteTree/",
  callAI = "http://localhost:8000/gemma/",
}

export default function useAPI<T extends APIs>(api: T) {
  return useCallback((data: APIMap[T]) => {
    return fetch(api, {
      body: JSON.stringify(data),
      method: "POST",
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "content-type": "application/json",
      },
    })
  }, [api]);
}