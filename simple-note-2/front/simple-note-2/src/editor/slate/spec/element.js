/**
 * 
 * @param {React.ReactNode} element 
 * @param {boolean} inline 
 */
export default function createElement(element, inline = false) {
    return {
        element: element,
        inline: inline,
    }
}