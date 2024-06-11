import { TreeDataNode } from "antd";
import { useCallback, useState } from "react";
import useAPI, { APIs } from "../../../util/api";
import { useCookies } from "react-cookie";
import { seperator } from "./node";

function findTargetByKey(key: string, origin: TreeDataNode[]) {

    let [, indexes] = key.split(seperator);
    let indice = indexes ? indexes.split("-") : [];

    let tmp = origin;
    for (let i of indice) {
        if (!tmp[parseInt(i)].children) break;
        tmp = tmp[parseInt(i)].children!;
    }

    return tmp;
}

function getParentKey(key: string) {
    let [id, indice] = key.split(seperator);
    let indexes = indice.split("-").slice(0, -1);

    return id + seperator +
        (indexes.length === 0 ?
            indexes.reduce((prev, curr) => `${prev}-${curr}`, "") :
            indexes.reduce((prev, curr) => `${prev}-${curr}`)
        );
}

function changeSubtreeKey(t: TreeDataNode[], p: string) {

    for (let i = 0; i < t.length; i++) {
        let [id, index] = t[i].key.toString().split("/");
        let key = p ? `${p}-${index}` : index;
        t[i].key = `${id}${seperator}${key}`;
        if (t[i].children) {
            changeSubtreeKey(t[i].children!, key);
        }
    }
}

export default function useFiles(): [
    TreeDataNode[],
    (key: string, title: string, children: TreeDataNode[]) => Promise<boolean>,
    (key: string) => Promise<string | undefined>
] {
    const [nodes, setNodes] = useState<TreeDataNode[]>([]);
    const addNote = useAPI(APIs.addNote);
    const deleteNote = useAPI(APIs.deleteNote);
    const [{username}] = useCookies(["username"]);

    const add = useCallback(async (key: string, title: string, children: TreeDataNode[]) => {
        let arr = nodes;
        let parent = getParentKey(key);
        let target = findTargetByKey(parent, arr);
        // let ok = await addNote({
        //     username: username,
        //     noteId: key,
        //     notename: title
        // })
        // .then(res => res.status === 200)
        // .catch(() => false)

        let ok = true;
        if(ok){
            target.push({
                key: key,
                title: title,
                children: children,
            });
            setNodes([...nodes]);
        }

        return ok;
    }, [addNote, nodes, username]);

    const remove = useCallback(async (key: string) => {
        const arr = nodes;
        let parent = getParentKey(key);
        let target = findTargetByKey(parent, arr);
        let i = parseInt(key.charAt(key.length - 1));

        // let ok = await deleteNote({
        //     username: username,
        //     noteId: key,
        // })
        // .then(res => res.status === 200)
        // .catch(() => false);
        let ok = true;

        if(ok){
            target.splice(i, 1);
            changeSubtreeKey(target, parent.split(seperator)[1]);
            setNodes([...nodes]);
        }

        return ok ? i === 0 ? parent : target[target.length - 1].key as string : undefined
        
    }, [deleteNote, nodes, username]);

    return [nodes, add, remove];
}