import {Bold, Italic, Underline} from "./Component/mark"
import {FontColor, BackgroundColor, BGCOLOR, FONTCOLOR} from "./Component/color";
import {FONTFAMILY, FONTSIZE, FontFamily, FontSize} from "./Component/font";

const LEAF = {
    "bold": Bold, 
    "italic": Italic, 
    "underline": Underline,
    [FONTCOLOR]: FontColor,
    [BGCOLOR]: BackgroundColor,
    [FONTFAMILY]: FontFamily, 
    [FONTSIZE]: FontSize,
}

export default LEAF;