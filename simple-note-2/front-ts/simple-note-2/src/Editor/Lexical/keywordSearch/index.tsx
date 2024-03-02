import { $getRoot, $getSelection, $isParagraphNode, $isRangeSelection, LexicalCommand, TextNode, createCommand } from "lexical";
import { Plugin } from "../Interface";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { cleanAllKeywords, skipHistoryUpdate } from "./node";
import { useCallback } from "react";

export const SEARCH_TEXT: LexicalCommand<string> = createCommand();

// function $isAdjacentText(text1: TextNode, text2: TextNode): boolean {

// }

const KeywordSearchPlugin: Plugin = () => {

    const [editor] = useLexicalComposerContext();
    const handleClose = useCallback(() => cleanAllKeywords(editor), [editor]);

    useEffect(() => {

        editor.registerCommand(SEARCH_TEXT, (payload) => {

            skipHistoryUpdate(editor, () => {
                const searchText = payload;
                const regex = new RegExp(searchText, "gi");

                const rootNodes = $getRoot().getChildren();
                
                for(let rootNode of rootNodes) {
                    if(!$isParagraphNode(rootNode)) continue;
                    
                    let segements: string[] = [""];
                    let childNodes = rootNode.getChildren();
                    for(let childNode of childNodes) {
                        let text = childNode.getTextContent();
                        if(text.length === 0){
                            segements.push(text);
                        }
                        else{
                            segements[segements.length - 1] += text;
                        }
                    }

                    for(let segement of segements){
                        
                    }
                }
            });

            return false;
        }, 4);

        window.addEventListener("beforeunload", handleClose);

        return () => {
            window.removeEventListener("beforeunload", handleClose);
        }
    }, [editor, handleClose]);

    return null;
}

export default KeywordSearchPlugin;