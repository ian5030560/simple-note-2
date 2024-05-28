import { Tree, theme, Button, message } from "antd";
import Node, { AddModal, DeleteModal, FuncModalRef } from "./node";
import useAPI, { APIs } from "../../../util/api";
import { useCookies } from "react-cookie";
import { FaPlus } from "react-icons/fa6";
import useFiles from "./store";
import { Key, useCallback, useEffect, useRef, useState } from "react";
import getRandomString from "../../../util/random";
import { useNavigate } from "react-router-dom";

const FileTree = () => {
    const addNote = useAPI(APIs.addNote);
    const deleteNote = useAPI(APIs.deleteNote);
    const loadNoteTree = useAPI(APIs.loadNoteTree);
    const [{ username }] = useCookies(["username"]);
    const { token } = theme.useToken();
    const [nodes, feedback, add, remove, direct] = useFiles();
    const addRef = useRef<FuncModalRef>(null);
    const deleteRef = useRef<FuncModalRef>(null);
    const [addState, setAddState] = useState<{ nodeKey: string, root?: boolean }>({ nodeKey: "" });
    const [deleteState, setDeleteState] = useState<{ nodeKey: string, title: string }>({ nodeKey: "", title: "" });
    const [api, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    useEffect(() => {
        if(window.location.pathname === "/theme") return;
        navigate(!feedback ? "/user" : `/user/${feedback}`)
    }, [feedback, navigate]);

    useEffect(() => {
        function handleLoad() {
            // loadNoteTree({username: username})
            // .then((res) => res.json())
            // .then((res: {noteId: string, noteName: string}[]) => {
            //     for(let note of res){
            //         try{
            //             add(note.noteId, note.noteName, []);
            //         }
            //         catch(err){
            //             api.error({content: `取得${note.noteName}失敗`})
            //         }
            //     }
            // })
            // .catch(() => api.error({content: "無法取得所有筆記"}));
        }
        window.addEventListener("load", handleLoad);

        return () => window.removeEventListener("load", handleLoad)
    }, [add, api, loadNoteTree, username]);

    const handleAdd = useCallback((key: string, text: string, root?: boolean) => {
        add(key, text, [], root);
        setAddState({nodeKey: "", root: false});
        //     addNote({
        //         username: username,
        //         noteId: key,
        //         notename: text,
        //     })
        //     .then(() => {
        //         add(key, text, []);
        //         api.success({
        //             content: `創建${text}成功`
        //         })
        //     })
        //     .catch(() => {
        //         api.error({
        //             content: `創建${text}失敗`
        //         })
        //     })
    }, [add]);


    const handleDelete = useCallback((key: string) => {
        remove(key);
        setDeleteState({nodeKey: "", title: ""});
        //     deleteNote({
        //         username: username,
        //         noteId: key,
        //     })
        //     .then(() => {
        //         remove(key);
        //         api.success({
        //             content: `刪除${text}成功`
        //         })
        //     })
        //     .catch(() => {
        //         api.error({
        //             content: `刪除${text}失敗`
        //         }) 
        //     })
    }, [remove]);

    const handleSelected = useCallback((keys: Key[]) => {
        if (keys.length === 0) return;
        direct(keys[0] as string);
    }, [direct]);

    return <>
        <Tree treeData={nodes} rootStyle={{ backgroundColor: token.colorPrimary }}
            blockNode defaultExpandAll
            titleRender={(data) => {
                const { title, key } = data as { title: string, key: string };
                return <Node key={key} title={title} nodeKey={key}
                    onAdd={(key) => { setAddState({ nodeKey: key }); addRef.current?.show(true) }}
                    onDelete={(key, title) => { setDeleteState({ title: title, nodeKey: key }); deleteRef.current?.show(true) }} />
            }}
            onSelect={handleSelected}
        />
        <Button icon={<FaPlus />} type="text" block
            onClick={() => {
                setAddState({ nodeKey: getRandomString(10), root: true });
                addRef.current?.show(true)
            }} />
        <AddModal nodeKey={addState.nodeKey} ref={addRef}
            onOk={handleAdd} root={addState.root}/>
        <DeleteModal nodeKey={deleteState.nodeKey} title={deleteState.title}
            onOk={handleDelete} ref={deleteRef} />
        {contextHolder}
    </>
}

export default FileTree;