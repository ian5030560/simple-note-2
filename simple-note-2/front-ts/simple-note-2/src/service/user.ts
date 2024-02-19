import postData from "../util/post";
// import { createContext, useContext } from "react";

// export const UtilContext = createContext({
//     async checkSignIn(username: string) {

//         let response = await postData(
//             "http://localhost:8000/signin_status/",
//             { username: username },
//         )

//         return response.status === 200;
//     },

//     async logOut(username: string) {

//         let response = await postData(
//             "http://localhost:8000/signout/",
//             { username: username },
//         )

//         return response.status === 200;
//     },

//     async uploadImage(file: File) {
//         let form = new FormData();
//         form.append("file", file);
//         let res = await fetch(
//             "http://localhost:5000/upload",
//             {
//                 method: "POST",
//                 body: form,
//             }
//         ).then((r) => r.text())

//         return res
//     }
// });

// export const {Provider: UtilProvider} = UtilContext;
// export const useUtils = () => useContext(UtilContext);

export default class User {

    static async checkSignIn(username: string) {

        let response = await postData(
            "http://localhost:8000/signin_status/",
            { username: username },
        )

        return response.status === 200;
    }

    static async userLogOut(username: string) {

        let response = await postData(
            "http://localhost:8000/signout/",
            { username: username },
        )

        return response.status === 200;
    }

    static async loadInfo(username: string) {
        return undefined;
    }

    static async uploadImage(file: File) {
        let form = new FormData();
        form.append("file", file);
        let res = await fetch(
            "http://localhost:5000/upload",
            {
                method: "POST",
                body: form,
            }
        ).then((r) => r.text())

        return res
    }
}


