import { Plugin } from "../../index";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useCallback, useEffect, useState } from "react";
import { EditorState } from "lexical";
import useAPI, { APIs } from "../../../../util/api";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { Button, Modal } from "antd";

const SavePlugin: Plugin = () => {
    const saveNote = useAPI(APIs.saveNote);
    const getNote = useAPI(APIs.getNote);
    const [state, setState] = useState<EditorState>();
    const [{ username }] = useCookies(["username"]);
    const { file } = useParams();
    const [typing, isTyping] = useState(false);

    useEffect(() => {
        function handleLoad() {
            // getNote({
            //     username: username,
            //     noteId: file
            // })
            //     .then((res) => res.json())
            //     .then((res) => res && setState(res))
            //     .catch(() => {
            //         // Modal.error({
            //         //     title: "載入發生錯誤",
            //         //     content: "請重新整理頁面",
            //         //     footer: <div style={{direction: "rtl"}}>
            //         //         <Button type="primary" danger
            //         //             onClick={() => window.location.reload()}>重新整理</Button>
            //         //     </div>,
            //         //     closeIcon: null
            //         // })
            //     })
        }

        // window.addEventListener("load", handleLoad);
        return () => window.removeEventListener("load", handleLoad);
    }, [file, getNote, username]);

    useEffect(() => {
        function handleUnload() {
            // saveNote({
            //     username: username,
            //     noteId: file,
            //     content: state!.toJSON(),
            // })
            // isTyping(false);
        }

        let timer: NodeJS.Timer | undefined = undefined;
        if(typing){
            timer = setTimeout(handleUnload, 500);
        }

        return () => timer && clearTimeout(timer);
    }, [file, saveNote, state, typing, username]);

    const handleChange = useCallback((editorState: EditorState) => {
        console.log(editorState);
        setState(editorState);
        isTyping(true);
    }, []);

    return <OnChangePlugin onChange={handleChange} />;
}
export default SavePlugin;