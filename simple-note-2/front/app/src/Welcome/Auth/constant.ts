 
import {ValidateMessages} from "rc-field-form/lib/interface";

export enum STATE {
    SUCCESS = "success",
    FAILURE = "failure",
    LOADING = "loading",
    FORGET = "forget",
}

export const validateMessages: ValidateMessages = {
    
    required: "請輸入 ${label}",
    types: {
        email: "${label} 的格式錯誤",
    },
    string: {
        range: "${label} 必須在 ${min} 和 ${max} 字元之間",
    },
};

export interface AuthProp {
    onChange: () => void;
}