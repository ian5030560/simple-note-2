function hexToRgb(hex: string) {
    const digit1 = hex.slice(0, 2);
    const digit2 = hex.slice(2, 4);
    const digit3 = hex.slice(4, 6);

    return {
        r: parseInt(digit1, 16),
        g: parseInt(digit2, 16),
        b: parseInt(digit3, 16)
    };
}

function rgbToHex(r: number, g: number, b: number) {
    return (Number(r).toString(16) + Number(g).toString(16) + Number(b).toString(16)).toUpperCase();
}

export function calculateNeutralByPrimary(primaryHex: string) {
    const rgb = hexToRgb(primaryHex);
           
}


function lumaInvert(r: number, g: number, b: number) {
    // Convert RGB to YUV
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const u = -0.169 * r - 0.331 * g + 0.5 * b + 128;
    const v = 0.5 * r - 0.419 * g - 0.081 * b + 128;

    // Invert the luma component
    const invertedY = 255 - y;
    const invertedU = u;
    const invertedV = v;

    // Convert YUV back to RGB
    const invertedR = invertedY + 1.13983 * (invertedV - 128);
    const invertedG = invertedY - 0.39465 * (invertedU - 128) - 0.58060 * (invertedV - 128);
    const invertedB = invertedY + 2.03211 * (invertedU - 128);

    // Ensure values are within the 0-255 range
    return [
        Math.max(0, Math.min(255, invertedR)),
        Math.max(0, Math.min(255, invertedG)),
        Math.max(0, Math.min(255, invertedB))
    ];
}

export function calculateDarkByLight(lightPrimaryHex: string) {
    const rgb = hexToRgb(lightPrimaryHex);
    const inverted = lumaInvert(rgb.r, rgb.g, rgb.b);
    return rgbToHex(inverted[0], inverted[1], inverted[2]);
}