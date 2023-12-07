function determineByYIQ({ r, g, b }) {
    let value = Math.round((r * 299 + g * 587 + b * 114) / 1000 / 255);
    return (value > 0.5) ? "#000000" : "#FFFFFF";
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

/**
 * 
 * @param {string} primaryColor 
 * @returns 
 */
export function determineWhiteOrBlack(primaryColor){
    return determineByYIQ(hexToRgb(primaryColor));
}