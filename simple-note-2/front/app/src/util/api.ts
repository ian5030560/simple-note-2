import { useCallback } from "react";

type APIMap = {
  "http://localhost:8000/registerAndLogin/": { id: "sign-in" | "register", username: string, password: string, email?: string },
  "http://localhost:8000/forgetPassword/": { username: string, email: string },
  "http://localhost:8000/logout/": { username: string },
  // "http://localhost:8000/newMediaFile/": FormData,
  "http://localhost:8000/deleteFile/": { username: string, url: string, note_title_id: string },
  "http://localhost:8000/getInfo/": { username: string },
  "http://localhost:8000/updateInfo/": { username: string, image: string, data: any },
  "http://localhost:8000/getNote/": { username: string, noteId: string },
  "http://localhost:8000/newNote/": { username: string, noteId: string, notename: string, parentId: string | null, silbling_id: string | null },
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
  "http://140.127.74.226:8000/gemma/": { text: string },
  "http://localhost:8000/newCollaborate/": { username: string, noteId: string, url: string },
  "http://localhost:8000/deleteCollaborate/": { username: string, noteId: string, masterName: string },
  "http://localhost:8000/joinCollaborate/": { username: string, url: string },
  "http://localhost:4000/room/number": { room: string },
}

export enum APIs {
  registerOrLogin = "http://localhost:8000/registerAndLogin/",
  forgetPassword = "http://localhost:8000/forgetPassword/",
  signOut = "http://localhost:8000/logout/",
  // addFile = "http://localhost:8000/newMediaFile/",
  deleteFile = "http://localhost:8000/deleteFile/",
  getInfo = "http://localhost:8000/getInfo/",
  updateInfo = "http://localhost:8000/updateInfo/",
  getNote = "http://localhost:8000/getNote/",
  addNote = "http://localhost:8000/newNote/",
  deleteNote = "http://localhost:8000/deleteNote/",
  saveNote = "http://localhost:8000/saveNote/",
  addTheme = "http://localhost:8000/newTheme/",
  loadNoteTree = "http://localhost:8000/loadNoteTree/",
  callAI = "http://140.127.74.226:8000/gemma/",
  addCollaborate = "http://localhost:8000/newCollaborate/",
  deleteCollaborate = "http://localhost:8000/deleteCollaborate/",
  joinCollaborate = "http://localhost:8000/joinCollaborate/",
  getNumberInRoom = "http://localhost:4000/room/number",
}

export default function useAPI<T extends APIs>(api: T): (data: APIMap[T]) => [Promise<Response>, AbortController] {
  return useCallback((data: APIMap[T]) => {
    const controller = new AbortController();
    const { signal } = controller;

    return [
      fetch(api, {
        body: JSON.stringify(data), method: "POST",
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
          "content-type": "application/json",
        }, signal
      }), controller]
  }, [api]);
}