import { $createRangeSelection, $getRoot, $getSelection, $isParagraphNode, $isRangeSelection, LexicalCommand, TextNode, createCommand } from "lexical";
import { Plugin } from "../Interface";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { cleanAllKeywords, skipHistoryUpdate } from "./node";
import { useCallback } from "react";
import { $findMatchingParent } from "@lexical/utils";

export const SEARCH_TEXT: LexicalCommand<string> = createCommand();

// function $isAdjacentText(text1: TextNode, text2: TextNode): boolean {

// }

const KeywordSearchPlugin: Plugin = () => {

    const [editor] = useLexicalComposerContext();
    const handleClose = useCallback(() => cleanAllKeywords(editor), [editor]);

    useEffect(() => {

        editor.registerCommand(SEARCH_TEXT, (payload) => {

            skipHistoryUpdate(editor, () => {
                const selection = $getSelection();
              
                // const searchText = payload;
                // const regex = new RegExp(searchText, "gi");

                // const bnodes = $getRoot().getChildren();

                // for (let bnode of bnodes) {

                //     if (!$isParagraphNode(bnode)) continue;

                //     let textSegements: string[] = [];
                //     for(let node of bnode.getChildren()){
                //         let content = node.getTextContent();
                //         if(!content || textSegements.length === 0){
                //             textSegements.push(content);
                //         }
                //         else{
                //             textSegements[textSegements.length - 1] += content;
                //         }
                //     }
                    
                //     let result;
                //     let selection = $createRangeSelection();
                //     for(let segement of textSegements){
                //         let indice = [];
                //         while((result = regex.exec(segement))) indice.push(result.index);

                //         indice.forEach(index => {
                //             selection.anchor.key = 
                //         })
                //     }
                // }

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