const uuid = (number?: number) => window.crypto.randomUUID().split("-").join("").substring(0, number);
export default uuid;