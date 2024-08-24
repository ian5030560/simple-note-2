export const uuid = () => window.crypto.randomUUID().split("-").join("-");

export const encodeBase64 = btoa
export const decodeBase64 = atob