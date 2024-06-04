import { useCallback } from "react";

type APIMap = {
  signIn: { id: "sign-in", username: string, password: string },
  signUp: { id: "register", username: string, password: string, email: string },
  forgetPassword: { username: string, email: string },
  signOut: { username: string },
  addFile: { username: string, filename: string, notename: string, content: string },
  deleteFile: { username: string, url: string },
  getInfo: { username: string },
  updateInfo: { username: string, image: string, data: any },
  getNote: { username: string, noteId: string },
  addNote: { username: string, noteId: string, notename: string },
  deleteNote: { username: string, noteId: string },
  saveNote: { username: string, noteId: string, content: any },
  addTheme: {
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
  loadNoteTree: {username: string},
}

export const APIs = {
  signIn: "http://localhost:8000/registerAndLogin/",
  signUp: "http://localhost:8000/registerAndLogin/",
  forgetPassword: "http://localhost:8000/forgetPassword/",
  signOut: "http://localhost:8000/logout/",
  addFile: "http://localhost:8000/newMediaFile/",
  deleteFile: "http://localhost:8000/deleteMediaFile/",
  getInfo: "http://localhost:8000/getInfo/",
  updateInfo: "http://localhost:8000/updateInfo/",
  getNote: "http://localhost:8000/getNote/",
  addNote: "http://localhost:8000/newNote/",
  deleteNote: "http://localhost:8000/deleteNote/",
  saveNote: "http://localhost:8000/saveNote/",
  addTheme: "http://localhost:8000/newTheme/",
  loadNoteTree: "http://localhost:8000/loadNoteTree/",
}

export default function useAPI<T extends keyof typeof APIs>(api: typeof APIs[T]): (data: APIMap[T]) => Promise<Response> {
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