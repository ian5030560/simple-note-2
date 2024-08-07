export const uuid = (number?: number) => window.crypto.randomUUID().split("-").slice(0, number).join("-");

export const encodeBase64 = btoa
export const decodeBase64 = atob