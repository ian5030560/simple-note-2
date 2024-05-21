import { Tree, theme, Button } from "antd";
import Node from "./node";
import useAPI, { APIs } from "../../../util/api";
import { useCookies } from "react-cookie";
import { FaPlus } from "react-icons/fa6";
import useFileStore from "./store";

const FileTree = () => {
    const addNote = useAPI(APIs.addNote);
    const [{ username }] = useCookies(["username"]);
    const { token } = theme.useToken();
    const [nodes, add, remove] = useFileStore();

    return <>
        <Tree treeData={nodes} rootStyle={{ backgroundColor: token.colorPrimary }} blockNode
            titleRender={(data) => {
                const { title, key } = data as { title: string, key: string };
                return <Node
                    title={title}
                    nodeKey={key}
                    onAdd={(key, text) => add(key, text, [])}
                    onDelete={remove}
                    root={key === "individual" || key === "multiple"}
                />
            }}
            selectable={false}
            defaultExpandAll
        />
        <Button icon={<FaPlus/>} type="text" block/>
    </>
}

export default FileTree;