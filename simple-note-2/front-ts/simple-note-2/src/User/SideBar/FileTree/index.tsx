import { Tree, theme, Button, message } from "antd";
import Node, { AddModal, AddModalRef, DeleteModal, DeleteModalRef, seperator } from "./node";
import useAPI, { APIs } from "../../../util/api";
import { useCookies } from "react-cookie";
import { FaPlus } from "react-icons/fa6";
import useFiles from "./hook";
import { Key, useCallback, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { uuid } from "../../../util/random";

const FileTree = () => {
    const loadNoteTree = useAPI(APIs.loadNoteTree);
    const { token } = theme.useToken();
    const [nodes, add, remove] = useFiles();
    const addRef = useRef<AddModalRef>(null);
    const deleteRef = useRef<DeleteModalRef>(null);
    const [api, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [{ username }] = useCookies(["username"]);
    const { file } = useParams();

    useEffect(() => {
        async function handleLoad() {
            try {
                let tree: [string, string] = JSON.parse(await loadNoteTree({ username: username }).then(res => res.json()));

                let existing = tree.findIndex((val) => val[1].split(seperator)[0] === file) !== -1;

                if (!existing) {
                    navigate("/");
                }
                else {
                    for (let note of tree) {
                        add(note[1], note[0], []);
                    }
                }
            }
            catch (err) {
                api.error({ content: "無法取得所有筆記" });
            }
        }
        // window.addEventListener("load", handleLoad);

        return () => window.removeEventListener("load", handleLoad)
    }, [add, api, file, loadNoteTree, navigate, username]);

    const handleAdd = useCallback((key: string, text: string) => {

        add(key, text, [])
            .then(ok => {
                if (ok) {
                    api.success({ content: `創建${text}成功` });
                    // navigate(key.split(seperator)[0]);
                }
                else {
                    api.error({ content: `創建${text}失敗` });
                }
            })
            .catch((err) => {
                console.log(err);
                api.error({ content: `創建${text}失敗` })
            })
    }, [add, api, navigate]);


    const handleDelete = useCallback((key: string, text: string) => {

        remove(key)
            .then(rkey => {
                if (!rkey) {
                    api.error({ content: `刪除${text}失敗` })
                }
                else {
                    api.success({ content: `刪除${text}成功` })
                    // navigate(rkey.split(seperator)[0]);
                }
            })
            .catch((err) => {
                console.log(err);
                api.error({ content: `刪除${text}失敗` })
            })
    }, [api, navigate, remove]);

    const handleSelected = useCallback((keys: Key[]) => {
        if (keys.length === 0) return;
        // navigate(keys[0] as string);

    }, [navigate]);

    return <>
        <Tree treeData={nodes} rootStyle={{ backgroundColor: token.colorPrimary }}
            blockNode defaultExpandAll
            titleRender={(data) => {
                const { title, key } = data as { title: string, key: string };
                const cIndice = key.split(seperator)[1].split("-");

                let cNodes = nodes;
                for (let index of cIndice) {
                    if (!cNodes[parseInt(index)]) break;
                    cNodes = cNodes[parseInt(index)].children!;
                }

                return <Node key={key} title={title} nodeKey={key} childNodes={cNodes}
                    onAdd={(key) => { addRef.current?.show(key) }}
                    onDelete={(key, title) => { deleteRef.current?.show({ key: key, title: title }) }} />
            }}
            onSelect={handleSelected}
        />
        <Button icon={<FaPlus />} type="text" block
            onClick={() => { addRef.current?.show(`${uuid()}${seperator}${nodes.length}`) }} />
        <AddModal ref={addRef} onOk={handleAdd} />
        <DeleteModal onOk={handleDelete} ref={deleteRef} />
        {contextHolder}
    </>
}

export default FileTree;