import { Editor } from "slate";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { withId } from "./withId";
import withImage from "./node/image/withImage";
import withLink from "./node/link/withLink";
import withList from "./node/list/withList";

const PLUGIN = [
    withReact,
    withHistory,
    withId,
    withLink,
    withList,
    withImage,
]

/**
 * 
 * @param {Editor} editor 
 * @returns {Editor}
 */
export default function withPlugin(editor){
    for(let plugin of PLUGIN){
        editor = plugin(editor);       
    }
  
    return editor;
}