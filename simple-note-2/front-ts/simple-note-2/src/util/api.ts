import { useCallback } from "react";

export enum APIs {
  signIn = "http://localhost:8000/signin/",
  signUp = "http://localhost:8000/signin/",
  forgetPassword = "http://localhost:8000/forget_password/",
  signOut = "http://localhost:8000/signout/",
  addFile = "http://localhost:8000/add_file/",
  deleteFile = "http://localhost:8000/delete_file/",
  getInfo = "http://localhost:8000/get_info/",
  updateInfo = "http://localhost:8000/update_info/",
  getNote = "http://localhost:8000/getNote/",
  addNote = "http://localhost:8000/addNote/",
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