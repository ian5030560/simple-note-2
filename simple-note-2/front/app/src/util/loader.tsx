import { LoaderFunctionArgs } from "react-router-dom";
import { decodeBase64 } from "./secret";
import useNoteManager, { NoteDataNode, findNode } from "../User/SideBar/NoteTree/useNoteManager";
import utilizeAPI from "./api";
import NoteIndexedDB from "../User/SideBar/NoteTree/store";
import useUser, { Token } from "../User/SideBar/useUser";
import { Cookies } from "react-cookie";

type Payload = {exp: number, iat: number};
export async function validateLoader() {
    const username = new Cookies().get("username");
    if (!username) return false;

    const token = new Cookies().get("token");
    if (!token) return false;

    const parsed = JSON.parse(token) as Token;
    const {access, refresh} = parsed;
    const {jwt: {refresh: refreshAccess}} = utilizeAPI();

    const refreshPayload = JSON.parse(refresh) as Payload;
    if(refreshPayload.exp < refreshPayload.iat) return false;

    const accessPayload = JSON.parse(decodeBase64(access)) as Payload;
    if(accessPayload.exp < accessPayload.iat){
        return await refreshAccess(refresh).then(async res => {
            if(!res.ok) return false;
            new Cookies().set("token", await res.json());
            return true;
        });
    }
    
    useUser.setState({ username });
    return true;
}

type NoteTreeData = { noteId: string, noteName: string, parentId: string | null, silblingId: string | null };

function sortNodes(data: NoteTreeData[]) {

    // 分組節點根據 parentId
    const groups = { "root": [] } as { [key: string]: NoteTreeData[] }
    for (const node of data) {
        const parent = node.parentId;
        if (!parent) {
            groups["root"].push(node);
            continue;
        }
        if (!groups[parent]) groups[parent] = []
        groups[parent].push(node);
    }

    // 排序分組內的節點根據 siblingId
    for (const key in groups) {
        const nodes = groups[key];
        const sorted: NoteTreeData[] = [];

        let target: string | null = null;
        let i = 0;
        while (i < nodes.length) {
            const node = nodes[i];
            if (node.silblingId === target) {
                sorted.push(node);
                target = node.noteId;
                i = -1;
            }
            i++;
        }
        groups[key] = sorted;
    }

    // 合併排序後的結果
    let sortedData: NoteTreeData[] = [];
    for (const key in groups) {
        sortedData = sortedData.concat(groups[key]);
    }
    return sortedData;
}


export type NoteFetchResult = {
    one: Array<NoteTreeData>;
    multiple: Array<{ noteId: string, noteName: string, url: string }>;
}
export async function settingLoader() {

    const { note: { loadTree } } = utilizeAPI();
    const username = new Cookies().get("username");

    const notesError = new Response(undefined, { status: 410 });

    return await loadTree(username).then(res => {
        if (!res.ok) throw notesError;
        return res.json();
    }).then((data: NoteFetchResult) => {
        try {
            const oneSorted = sortNodes(data["one"]);
            const oneMapped = oneSorted.map((it) => (
                {
                    key: it.noteId, title: it.noteName, children: [],
                    parentKey: it.parentId, siblingKey: it.silblingId,
                    url: data["multiple"].find(mul => mul.noteId === it.noteId)?.url
                }
            ));

            const ones: NoteDataNode[] = [];
            for (const node of oneMapped) {
                let children = ones;
                if (node.parentKey) children = findNode(ones, node.parentKey)!.children;
                const index = node.siblingKey ? oneMapped.findIndex(it => it.key === node.siblingKey) + 1 : oneMapped.length;
                children.splice(index, 0, {
                    key: node.key, title: node.title,
                    children: [], url: node.url, parent: node.parentKey
                });
            }

            const multiples: NoteDataNode[] = data["multiple"].map(it => {
                const [id, host] = it.url.split("/");
                const title = `${decodeBase64(host)}-${it.noteName}`;
                return {
                    title: title, key: id + host, children: [],
                    url: it.url, parent: null
                }
            });

            useNoteManager.setState(({ nodes, ...rest }) => {
                nodes = { one: ones, multiple: multiples };
                return { ...rest, nodes };
            });
            return ones[0].key;
        }
        catch (e) {
            console.log(e);
            throw notesError;
        }
    }).catch(() => { throw notesError });
}

async function getNote(username: string, id: string) {
    const { note: { get } } = utilizeAPI();

    return await get(username, id).then(async res => {
        if (res.ok) return res.status === 204 ? null : await res.text();
        throw new Response(undefined, { status: 404 });
    }).catch(() => {
        throw new Response(undefined, { status: 404 })
    })
};

export async function contentLoader({ params }: LoaderFunctionArgs<string | null>, username: string) {
    const { id } = params;
    const { note: { save } } = utilizeAPI();
    const db = new NoteIndexedDB();
    const result = await db.get(id!);

    if (!result) {
        const data = await getNote(username, id!);

        const db = new NoteIndexedDB();
        db.add({ id: id!, content: data ? JSON.parse(data) : null, uploaded: true });

        return data;
    }
    else {
        const { uploaded, content } = result;
        if (uploaded) {
            return content === null ? null : JSON.stringify(content);
        }
        else {
            return await Promise.all([
                getNote(username, id!),
                save(username, id!, JSON.stringify(content)).then(async res => {
                    if (!res.ok) {
                        throw new Response(undefined, { status: 405 });
                    }
                    else {
                        const db = new NoteIndexedDB();
                        db.update({ id: id!, content, uploaded: true })
                            .catch(() => { throw new Response(undefined, { status: 405 }) });
                    }
                }).catch(() => {
                    throw new Response(undefined, { status: 405 });
                })
            ]).then((reses) => reses[0]);
        }
    }
}

export async function collaborateLoader({ params }: LoaderFunctionArgs<boolean>) {
    const { collab: { join, people } } = utilizeAPI();
    const username = new Cookies().get("username");

    const { id, host } = params;
    const collabErr = new Response(undefined, { status: 403 });
    const master = decodeBase64(host!);

    return await Promise.all([
        join(username, `${id}/${host}`, master)
            .then(res => {
                if (!(res.ok || res.status == 401)) throw collabErr;
            })
            .catch(() => {
                throw collabErr
            }),

        people(`${id}/${host}`).then(async res => {
            if (!res.ok) throw collabErr;
            const { count } = await res.json() as { count: number };
            return count === 0;
        }).catch(() => { throw collabErr })
    ]).then(reses => reses[1]);
}