import { LoaderFunctionArgs } from "react-router-dom";
import useNoteManager, { NoteDataNode } from "./util/useNoteManager";
import utilizeAPI, { LoadTreeResult, NoteTreeData, Token } from "./util/api";
import { SimpleNote2IndexedDB, SimpleNote2LocalStorage } from "./util/store";
import useUser, { defaultThemeData } from "./util/useUser";
import { Cookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

type Payload = { exp: number, iat: number };
export async function validateLoader() {
    const username = new Cookies().get("username");
    if (!username) return false;

    const token = new Cookies().get("token");
    if (!token) return false;

    const parsed = token as Token;
    const { access, refresh } = parsed;
    const { jwt: { refresh: refreshAccess } } = utilizeAPI();

    const refreshPayload = jwtDecode(refresh) as Payload;
    if (refreshPayload.exp < refreshPayload.iat) return false;

    const accessPayload = jwtDecode(access) as Payload;
    if (accessPayload.exp < accessPayload.iat) {
        return await refreshAccess(refresh).then((data) => {
            if (!data) return false;
            new Cookies().set("token", { refresh, access: data.access });
            return true;
        });
    }

    useUser.setState({ username });
    return true;
}

function buildNoteDataTree(noteTreeData: NoteTreeData[], parentId: string | null): NoteDataNode[] {
    const nodes: NoteDataNode[] = [];
    const filtered: NoteTreeData[] = [];
    const rest: NoteTreeData[] = [];
    noteTreeData.forEach(it => {
        if (it.parentId === parentId) filtered.push(it);
        else rest.push(it);
    });

    const head = filtered.findIndex(it => it.silblingId === null);
    if (head === -1) return nodes;

    let start = head;
    while (start >= 0) {
        const item = filtered[start];
        nodes.push({
            key: item.noteId, title: item.noteName,
            children: buildNoteDataTree(rest, item.noteId), parent: item.parentId
        });
        start = filtered.findIndex(it => it.silblingId === item.noteId);
    }

    return nodes;
}
export function generateNoteForest(data: NoteTreeData[]) {
    return buildNoteDataTree(data, null);
}

function bindURL(nodes: NoteDataNode[], multiple: LoadTreeResult["multiple"]) {
    for (let node of nodes) {
        bindURL(node.children, multiple);
        node.url = multiple.find(mul => {
            return mul.noteId === node.key;
        })?.url;
    }
}

export async function settingLoader() {
    const { note: { loadTree }, info, theme } = utilizeAPI();
    const username = new Cookies().get("username");

    return Promise.all([
        theme.getAll(username).then(async (themes) => {
            const { image, themeId, password } = await info.get(username);
            const store = new SimpleNote2LocalStorage();
            const dark = store.getUserDark();

            useUser.setState(prev => {
                prev.password.content = password;
                return {
                    picture: image ?? undefined, dark,
                    themes: [
                        ...[defaultThemeData].map(it => ({ ...it, using: themeId === null })),
                        ...themes.map(({ id, name, data }) => ({
                            id, name, data, using: id === themeId
                        }))
                    ], password: prev.password
                }
            });

        }),
        loadTree(username).then(data => {
            const ones = generateNoteForest(data.one);
            bindURL(ones, data.multiple);
            const multiples: NoteDataNode[] = data.multiple.map(it => {
                const [id, host] = it.url.split("/");
                const title = `${atob(host)}的${it.noteName}`;
                return {
                    title: title, key: `${id} ${host}`, children: [],
                    url: it.url, parent: null
                }
            });

            useNoteManager.setState(({ nodes, ...rest }) => {
                nodes = { one: ones, multiple: multiples };
                return { ...rest, nodes };
            });
            return ones[0].key;
        })
    ]).then(res => res[1]).catch(() => {
        throw new Response(undefined, { status: 410 });
    });
}

async function getNote(username: string, id: string) {
    const { note: { get } } = utilizeAPI();
    return await get(username, id);
};

export async function contentLoader({ params }: LoaderFunctionArgs<string | null>, username: string) {
    const { id } = params;
    const { note: { save } } = utilizeAPI();
    const db = new SimpleNote2IndexedDB();
    const result = await db.get(id!);
    
    if (!result) {
        const data = await getNote(username, id!);

        const db = new SimpleNote2IndexedDB();
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
                getNote(username, id!).catch(() => { throw new Error("404") }),
                save(username, id!, JSON.stringify(content)).then(ok => {
                    if (!ok) {
                        throw new Error();
                    }
                    else {
                        const db = new SimpleNote2IndexedDB();
                        db.update({ id: id!, content, uploaded: true });
                    }
                }).catch(() => { throw new Error("405"); })
            ]).then((res) => res[0]).catch((e: Error) => {
                if (Number.isInteger(e.message)) {
                    throw new Response(undefined, { status: parseInt(e.message) });
                }
            })
        }
    }
}

export async function collaborateLoader({ params }: LoaderFunctionArgs<boolean>) {
    const { collab: { join, people } } = utilizeAPI();
    const username = new Cookies().get("username");
    const { id, host } = params;

    return await Promise.all([
        join(username, `${id}/${host}`).then(ok => { if (!ok) throw new Error(); }),
        people(`${id}/${host}`).then(async data => {
            const { count } = data;
            return count === 0;
        })
    ]).then(reses => reses[1]).catch(() => {
        throw new Response(undefined, { status: 403 });
    });
}