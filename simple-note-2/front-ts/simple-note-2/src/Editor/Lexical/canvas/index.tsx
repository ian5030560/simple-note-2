import { Plugin } from "../Interface";
import { LexicalCommand, createCommand } from "lexical";

const OPEN_CANVAS: LexicalCommand<boolean> = createCommand();
const CanvasPlugin: Plugin = () => {

    return null;
}

export default CanvasPlugin;