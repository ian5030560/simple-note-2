 
import {ValidateMessages} from "rc-field-form/lib/interface";

export enum STATE {
    SUCCESS = "success",
    FAILURE = "failure",
    LOADING = "loading",
    FORGET = "forget",
}

export const validateMessages: ValidateMessages = {
    
    required: "Please enter the ${label}",
    types: {
        email: "${label} is not correct",
    },
    number: {
        range: "${label} must be between ${min} and ${max}",
    },
};

export interface AuthProp {
    onChange: () => void;
}