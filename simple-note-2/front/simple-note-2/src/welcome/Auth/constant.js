export const STATE = {
    SUCCESS: "success",
    FAILURE: "failure",
    LOADING: "loading",
    FORGET: "forget",
}

export const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: "Please enter the ${label}",
    types: {
        // eslint-disable-next-line no-template-curly-in-string
        email: "${label} is not correct",
    },
    number: {
        // eslint-disable-next-line no-template-curly-in-string
        range: "${label} must be between ${min} and ${max}",
    },
};