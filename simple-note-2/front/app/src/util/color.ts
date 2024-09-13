function shouldTextBeBlack(backgroundcolor: string) {
    const color = hexToRgb(backgroundcolor);

    if (!color) throw new Error("Invalid backgroundColor");

    const brightness = Math.round(((color.r * 299) +
        (color.g * 587) +
        (color.b * 114)) / 1000);

    return brightness > 125;
}

function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


export function determineWhiteOrBlack(primaryColor: string) {
    return shouldTextBeBlack(primaryColor) ? "black" : "white";
}