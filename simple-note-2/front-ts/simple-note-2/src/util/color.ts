type White = "#000000";
type Black = "#FFFFFF";
interface RGB {
    r: number;
    g: number;
    b: number;
}
function determineByYIQ({ r, g, b }: RGB): White | Black {
    let value = Math.round((r * 299 + g * 587 + b * 114) / 1000 / 255);
    return (value > 0.5) ? "#000000" : "#FFFFFF";
}

function hexToRgb(hex: string): RGB | null {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}


export function determineWhiteOrBlack(primaryColor: string): White | Black{
    return determineByYIQ(hexToRgb(primaryColor)!);
}