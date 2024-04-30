import { useCallback } from "react";

export enum APIs {
  signIn = "http://localhost:8000/registerAndLogin/",
  signUp = "http://localhost:8000/registerAndLogin/",
  forgetPassword = "http://localhost:8000/forgetPassword/",
  signOut = "http://localhost:8000/signout/",
  addFile = "http://localhost:8000/newMediaFile/",
  deleteFile = "http://localhost:8000/deleteMediaFile/",
  getInfo = "http://localhost:8000/getInfo/",
  updateInfo = "http://localhost:8000/updateInfo/",
  getNote = "http://localhost:8000/getNote/",
  addNote = "http://localhost:8000/newNote/",
  deleteNote = "http://localhost:8000/deleteNote/",
  saveNote = "http://localhost:8000/saveNote/",

}

type APICallBack<T> = (data: T) => Promise<Response>;
export default function useAPI<T = any>(api: APIs): APICallBack<T>{
  return useCallback((data: T) => {
    return fetch(api, {
      // credentials: "include",
      body: JSON.stringify(data),
      method: "POST",
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "content-type": "application/json",
      },
    })
  }, [api]);
}