import { TreeDataNode } from "antd";
import { useCallback, useState } from "react";
import useAPI, { APIs } from "../../../util/api";
import { useCookies } from "react-cookie";
import { create } from "zustand";

// function findTargetByKey(key: string, origin: TreeDataNode[]) {

//     let [, indexes] = key.split(seperator);
//     let indice = indexes ? indexes.split("-") : [];

//     let tmp = origin;
//     for (let i of indice) {
//         if (!tmp[parseInt(i)].children) break;
//         tmp = tmp[parseInt(i)].children!;
//     }

//     return tmp;
// }

// function getParentKey(key: string) {
//     let [id, indice] = key.split(seperator);
//     let indexes = indice.split("-").slice(0, -1);

//     return id + seperator +
//         (indexes.length === 0 ?
//             indexes.reduce((prev, curr) => `${prev}-${curr}`, "") :
//             indexes.reduce((prev, curr) => `${prev}-${curr}`)
//         );
// }

// function changeSubtreeKey(t: TreeDataNode[], p: string) {

//     for (let i = 0; i < t.length; i++) {
//         let [id, index] = t[i].key.toString().split("/");
//         let key = p ? `${p}-${index}` : index;
//         t[i].key = `${id}${seperator}${key}`;
//         if (t[i].children) {
//             changeSubtreeKey(t[i].children!, key);
//         }
//     }
// }

// type AddFunction = (key: string, title: string, children: TreeDataNode[]) => Promise<boolean>
// type RemoveFunction = (key: string) => Promise<string | undefined>
// export default function useFiles(): [TreeDataNode[], AddFunction, RemoveFunction] {
//     const [nodes, setNodes] = useState<TreeDataNode[]>([]);
//     const addNote = useAPI(APIs.addNote);
//     const deleteNote = useAPI(APIs.deleteNote);
//     const [{username}] = useCookies(["username"]);

//     const add = useCallback(async (key: string, title: string, children: TreeDataNode[]) => {
//         let arr = nodes;
//         let parent = getParentKey(key);
//         let target = findTargetByKey(parent, arr);
//         // let ok = await addNote({
//         //     username: username,
//         //     noteId: key,
//         //     notename: title
//         // })
//         // .then(res => res.status === 200)
//         // .catch(() => false)

//         let ok = true;

//         ok && target.push({
//             key: key,
//             title: title,
//             children: children,
//         });
//         setNodes([...nodes]);


//         return ok;
//     }, [nodes]);

//     const remove = useCallback(async (key: string) => {
//         const arr = nodes;
//         let parent = getParentKey(key);
//         let target = findTargetByKey(parent, arr);
//         let i = parseInt(key.charAt(key.length - 1));

//         // let ok = await deleteNote({
//         //     username: username,
//         //     noteId: key,
//         // })
//         // .then(res => res.status === 200)
//         // .catch(() => false);
//         let ok = true;

//         if(ok){
//             target.splice(i, 1);
//             changeSubtreeKey(target, parent.split(seperator)[1]);
//             setNodes([...nodes]);
//         }

//         return ok ? i === 0 ? parent : target[target.length - 1].key as string : undefined

//     }, [nodes]);

//     return [nodes, add, remove];
// }

function findTarget(nodes: TreeDataNode[], key: string | null): TreeDataNode[] | undefined {
    if (!key) return nodes;

    for (let node of nodes) {
        if (node.key === key) {
            return node.children;
        }
        else {
            let result = findTarget(node.children!, key);
            if(!result) continue;
            return result;
        }
    }
}

function findParent(nodes: TreeDataNode[], key: string): TreeDataNode[] | undefined {
    if (nodes.find(it => it.key === key)) return nodes;
    for (let node of nodes) {
        if (node.children!.find(it => it.key === key)) {
            return node.children;
        }
        else {
            let result = findParent(node.children!, key);
            if(!result) continue;
            return result;
        }
    }
}
type TreeState = {
    nodes: TreeDataNode[];
}
type TreeAction = {
    add: (key: string, title: string, children: TreeDataNode[], parentKey: string | null, siblingKey: string | null) => void;
    remove: (key: string) => void;
}
const useStore = create<TreeState & TreeAction>()(set => ({
    nodes: [],
    add: (key, title, children, parentKey, siblingKey) => set((prev) => {
        let parent = findTarget(prev.nodes, parentKey)!;
        let index = siblingKey ? parent.findIndex(it => it.key === siblingKey) + 1 : parent.length;
        parent.splice(index, 0, { key: key, title: title, children: children });

        return { nodes: [...prev.nodes] };
    }),
    remove: (key) => set((prev) => {
        let parent = findParent(prev.nodes, key);
        parent?.splice(parent.findIndex(it => it.key === key), 1);
        return { nodes: [...prev.nodes] };
    })
}))

export default function useFiles(): [TreeState["nodes"], TreeAction["add"], TreeAction["remove"]] {
    const store = useStore();

    return [store.nodes, store.add, store.remove];
}