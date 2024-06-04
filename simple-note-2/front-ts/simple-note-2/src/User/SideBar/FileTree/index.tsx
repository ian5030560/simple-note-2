import { Tree, theme, Button, message } from "antd";
import Node, { AddModal, AddModalRef, DeleteModal, DeleteModalRef } from "./node";
import useAPI, { APIs } from "../../../util/api";
import { useCookies } from "react-cookie";
import { FaPlus } from "react-icons/fa6";
import useFiles from "./store";
import { Key, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uuid } from "../../../util/random";

const FileTree = () => {
    const addNote = useAPI(APIs.addNote);
    const deleteNote = useAPI(APIs.deleteNote);
    const loadNoteTree = useAPI(APIs.loadNoteTree);
    const { token } = theme.useToken();
    const [nodes, add, remove] = useFiles();
    const addRef = useRef<AddModalRef>(null);
    const deleteRef = useRef<DeleteModalRef>(null);
    const [api, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [{username, note}] = useCookies(["username", "note"]);
    // useEffect(() => {
    //     if (window.location.pathname === "/theme") return;
    //     feedback && navigate(feedback.split("/")[0]);
    // }, [feedback, navigate]);

 
    useEffect(() => {
        function handleLoad() {
            loadNoteTree({ username: username })
                .then(async (res) => JSON.parse(await res.json()))
                .then((res: [string, string][]) => {

                    for (let note of res) {
                        try {
                            add(note[1], note[0], []);
                        }
                        catch (err) {
                            api.error({ content: `取得${note[0]}失敗` })
                        }
                    }
                })
                .catch(() => api.error({ content: "無法取得所有筆記" }));
        }
        // window.addEventListener("load", handleLoad);

        return () => window.removeEventListener("load", handleLoad)
    }, [add, api, loadNoteTree, username]);

    const handleAdd = useCallback((key: string, text: string) => {
        add(key, text, []);
        navigate(key.split("/")[0]);
        // addNote({
        //     username: username,
        //     noteId: key,
        //     notename: text,
        // })
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
        let key = keys[0];
        navigate(key as string);
    }, [navigate]);

    return <>
        <Tree treeData={nodes} rootStyle={{ backgroundColor: token.colorPrimary }}
            blockNode defaultExpandAll
            titleRender={(data) => {
                const { title, key } = data as { title: string, key: string };
                const cIndice = key.split("/")[1].split("-");
        
                let cNodes = nodes;
                for(let index of cIndice) {
                    if(!cNodes[parseInt(index)]) break;
                    cNodes = cNodes[parseInt(index)].children!;
                }

                return <Node key={key} title={title} nodeKey={key} childNodes={cNodes}
                    onAdd={(key) => { addRef.current?.show(key) }}
                    onDelete={(key, title) => { deleteRef.current?.show({ key: key, title: title }) }} />
            }}
            onSelect={handleSelected}
        />
        <Button icon={<FaPlus />} type="text" block
            onClick={() => { addRef.current?.show(`${uuid()}/${nodes.length}`) }} />
        <AddModal ref={addRef} onOk={handleAdd} />
        <DeleteModal onOk={handleDelete} ref={deleteRef} />
        {contextHolder}
    </>
}

export default FileTree;