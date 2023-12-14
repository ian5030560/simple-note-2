import MARK from "./node/mark";
import COLOR from "./node/color";
import FONT from "./node/font";
import LINK from "./node/link";

const LEAF = {
    ...MARK,
    ...COLOR,
    ...FONT,
    ...LINK,
}

export default LEAF;