/**
 * 
 * @param {string} value 
 * @param {React.ReactNode} label 
 * @param {(value: string) => object} handler 
 */
export default function createAddItem(value, label, handler){
    return {
        value: value,
        label: label,
        handler: handler
    }
}