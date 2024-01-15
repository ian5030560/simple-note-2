import postData from "../util/post";

export default class User{
    
    static async checkSignIn(username) {

        let response = await postData(
            "http://localhost:8000/signin_status/",
            { username: username },
        )
    
        return response.status === 200;
    }

    static async userLogOut(username){
    
        let response = await postData(
            "http://localhost:8000/signout/",
            { username: username },
        )
    
        return response.status === 200;
    }

    static async loadInfo(username){
        return undefined;
    }
}