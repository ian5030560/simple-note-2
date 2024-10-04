import { useCallback } from "react";

type APIMap = {
  [APIs.registerOrLogin]: { id: "sign-in" | "register", username: string, password: string, email?: string },
  [APIs.forgetPassword]: { username: string, email: string },
  [APIs.signOut]: { username: string },
  [APIs.deleteFile]: { username: string, url: string, note_title_id: string },
  [APIs.getInfo]: { username: string },
  [APIs.updateInfo]: { username: string, image: string, data: any },
  [APIs.getNote]: { username: string, noteId: string },
  [APIs.addNote]: { username: string, noteId: string, notename: string, parentId: string | null, silbling_id: string | null },
  [APIs.deleteNote]: { username: string, noteId: string },
  [APIs.saveNote]: { username: string, noteId: string, content: any },
  [APIs.addTheme]: {
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
  [APIs.loadNoteTree]: { username: string },
  [APIs.addCollaborate]: { username: string, noteId: string, url: string },
  [APIs.deleteCollaborate]: { username: string, noteId: string, masterName: string },
  [APIs.joinCollaborate]: { username: string, url: string },
  [APIs.getNumber]: { room: string },
}

export default function useAPI<T extends keyof APIMap>(api: T): (data: APIMap[T]) => [Promise<Response>, AbortController] {
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