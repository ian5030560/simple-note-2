import "@testing-library/jest-dom"
import { renderHook, act } from '@testing-library/react'
import useNoteManager, { NoteStorageError } from "../src/util/useNoteManager";
import "core-js/stable/structured-clone";
import "fake-indexeddb";
import { createHeadlessEditor } from "@lexical/headless";
import { $createParagraphNode, $createTextNode, $getRoot, LexicalEditor } from "lexical";
import { prepareNoteManager, uuid } from "./utils";
import { NoteObject, SimpleNote2IndexedDB } from "../src/util/store";

function createNoteManagerHook() {
    const { result } = renderHook(() => useNoteManager());
    const hook = result.current;

    return hook;
}

beforeEach(() => {
    useNoteManager.setState(() => ({ nodes: { one: [], multiple: [] } }));
})
describe("測試useNoteManager", () => {

    describe("測試 add function", () => {
        it("在 'one' 的 level1 增加一個筆記", async () => {
            const hook = createNoteManagerHook();
            const param = { key: uuid(), title: "測試筆記0" }
            await act(async () => {
                await hook.add(param, null, "one");
            })
            expect(hook.nodes["one"]).toContainEqual({ ...param, children: [], parent: null });

            const note: NoteObject = { id: param.key, content: null, uploaded: true };
            const db = new SimpleNote2IndexedDB();
            const result = await db.get(note.id);

            expect(result).toEqual(note);
        });

        it("在 'one' 在 height = 2的樹在一個level = 2的節點往下增加一個level = 3節點", async () => {
            const key1 = uuid();
            const key2 = uuid();
            await prepareNoteManager({
                nodes: {
                    one: [{
                        key: key1, title: "測試筆記", parent: null,
                        children: [{
                            key: key2, title: "測試筆記1", parent: key1, children: []
                        }]
                    }],
                    multiple: []
                }
            });

            const hook = createNoteManagerHook();
            const param = { key: uuid(), title: "測試筆記2" };
            await act(async () => {
                await hook.add(param, key2, "one");
            });

            const db = new SimpleNote2IndexedDB();
            const result = await db.get(param.key);

            const note: NoteObject = { id: param.key, content: null, uploaded: true };
            expect(result).toEqual(note);
        });

        it("在 'one' 在 height = 2的樹在一個level = 2的節點往後增加一個節點", async () => {
            const key1 = uuid();
            const key2 = uuid();
            await prepareNoteManager({
                nodes: {
                    one: [{
                        key: key1, title: "測試筆記", parent: null,
                        children: [{
                            key: key2, title: "測試筆記1", parent: key1, children: []
                        }]
                    }],
                    multiple: []
                }
            });

            const hook = createNoteManagerHook();
            const param = { key: uuid(), title: "測試筆記2" };
            await act(async () => {
                await hook.add(param, key1, "one");
            });

            const db = new SimpleNote2IndexedDB();
            const result = await db.get(param.key);

            const note: NoteObject = { id: param.key, content: null, uploaded: true };
            expect(result).toEqual(note);
        });

        it("在 'one' 在 height = 2的樹中在不存在的節點增加節點", async () => {
            const key1 = uuid();
            const key2 = uuid();
            await prepareNoteManager({
                nodes: {
                    one: [{
                        key: key1, title: "測試筆記", parent: null,
                        children: [{
                            key: key2, title: "測試筆記1", parent: key1, children: []
                        }]
                    }],
                    multiple: []
                }
            });

            const hook = createNoteManagerHook();
            const param = { key: uuid(), title: "測試筆記2" };
            const p = uuid()
            try {
                await act(async () => {
                    await hook.add(param, p, "one");
                });
            }
            catch (e) {
                expect(e).toEqual(new NoteStorageError(`Can't find the Node-${p}`));
            }
        });

        it("在 'one' 有三個 height = 3的樹，在第二個樹中的第一個level = 3節點往下增加一個節點", async () => {
            const ids = new Array(9).fill(null).map(() => uuid());
            await prepareNoteManager({
                nodes: {
                    one: [
                        {
                            key: ids[0], title: "測試筆記", parent: null,
                            children: [{
                                key: ids[1], title: "測試筆記1", parent: ids[0],
                                children: [{
                                    key: ids[2], title: "測試筆記2", parent: ids[1], children: []
                                }]
                            }]
                        },
                        {
                            key: ids[3], title: "測試筆記", parent: null,
                            children: [{
                                key: ids[4], title: "測試筆記1", parent: ids[3],
                                children: [{
                                    key: ids[5], title: "測試筆記2", parent: ids[4], children: []
                                }]
                            }]
                        },
                        {
                            key: ids[6], title: "測試筆記", parent: null,
                            children: [{
                                key: ids[7], title: "測試筆記1", parent: ids[6],
                                children: [{
                                    key: ids[8], title: "測試筆記2", parent: ids[7], children: []
                                }]
                            }]
                        }
                    ],
                    multiple: []
                }
            });

            const hook = createNoteManagerHook();
            const param = { key: uuid(), title: "測試筆記2" };
            await act(async () => {
                await hook.add(param, ids[5], "one");
            });

            const db = new SimpleNote2IndexedDB();
            const result = await db.get(param.key);

            const note: NoteObject = { id: param.key, content: null, uploaded: true };
            expect(result).toEqual(note);
        });

        it("在 'mutliple'中的 root level 增加一個筆記", async () => {
            const hook = createNoteManagerHook();
            const param = { key: uuid(), title: "測試筆記" }
            await act(async () => {
                await hook.add(param, null, "multiple");
            });

            const db = new SimpleNote2IndexedDB();
            const result = await db.get(param.key);

            expect(result).toBeUndefined();
            expect(hook.nodes["multiple"]).toContainEqual({ ...param, parent: null, children: [] });
        });

        it("在 'mutliple' 增加10個筆記", async () => {
            for (let i = 0; i < 10; i++) {
                const hook = createNoteManagerHook();
                const param = { key: uuid(), title: "測試筆記" }
                await act(async () => {
                    await hook.add(param, null, "multiple");
                });

                const db = new SimpleNote2IndexedDB();
                const result = await db.get(param.key);

                expect(result).toBeUndefined();
                expect(hook.nodes["multiple"]).toContainEqual({ ...param, parent: null, children: [] });
            }
        });
    });

    describe("測試 remove function", () => {
        it("在 'one' 中的 root level 有一節點，把它刪掉", async () => {
            const id = uuid();
            await prepareNoteManager({
                nodes: {
                    one: [{ key: id, title: "測試筆記", children: [], parent: null }],
                    multiple: []
                }
            });

            const hook = createNoteManagerHook();
            await act(async () => await hook.remove(id, "one"));
            expect(hook.nodes["one"].length).toEqual(0);

            const db = new SimpleNote2IndexedDB();
            const result = await db.get(id);

            expect(result).toBeUndefined();
        });

        it("在 'one' 中有一 height = 2的樹且level = 2的節點有5個，刪掉第4個", async () => {
            const ids = new Array(6).fill(null).map(() => uuid());
            await prepareNoteManager({
                nodes: {
                    one: [{
                        key: ids[0], title: "測試筆記", parent: null,
                        children: [
                            { key: ids[1], title: "測試筆記", parent: ids[0], children: [] },
                            { key: ids[2], title: "測試筆記", parent: ids[0], children: [] },
                            { key: ids[3], title: "測試筆記", parent: ids[0], children: [] },
                            { key: ids[4], title: "測試筆記", parent: ids[0], children: [] },
                            { key: ids[5], title: "測試筆記", parent: ids[0], children: [] },
                        ]
                    }],
                    multiple: []
                }
            });

            const hook = createNoteManagerHook();
            await act(async () => await hook.remove(ids[4], "one"));
            const nodeFind = await act(() => hook.find(ids[4], "one"));
            expect(nodeFind).toBeUndefined();

            const db = new SimpleNote2IndexedDB();
            const result = await db.get(ids[4]);

            expect(result).toBeUndefined();
        });

        it("在 'one' 中有一 height = 2的樹且level = 2的節點有5個，刪掉不存在的節點", async () => {
            const ids = new Array(6).fill(null).map(() => uuid());
            await prepareNoteManager({
                nodes: {
                    one: [{
                        key: ids[0], title: "測試筆記", parent: null,
                        children: [
                            { key: ids[1], title: "測試筆記", parent: ids[0], children: [] },
                            { key: ids[2], title: "測試筆記", parent: ids[0], children: [] },
                            { key: ids[3], title: "測試筆記", parent: ids[0], children: [] },
                            { key: ids[4], title: "測試筆記", parent: ids[0], children: [] },
                            { key: ids[5], title: "測試筆記", parent: ids[0], children: [] },
                        ]
                    }],
                    multiple: []
                }
            });

            const hook = createNoteManagerHook();
            const id = uuid();
            try {
                await act(async () => await hook.remove(id, "one"));
            }
            catch (e) {
                expect(e).toBeInstanceOf(NoteStorageError);
            }
        });

        it("在 'multiple' 中有10個節點，刪掉第4個", async () => {
            const ids = new Array(10).fill(null).map(() => uuid());
            await prepareNoteManager({
                nodes: {
                    one: [],
                    multiple: [
                        { key: ids[0], title: "測試筆記", parent: null, children: [] },
                        { key: ids[1], title: "測試筆記", parent: null, children: [] },
                        { key: ids[2], title: "測試筆記", parent: null, children: [] },
                        { key: ids[3], title: "測試筆記", parent: null, children: [] },
                        { key: ids[4], title: "測試筆記", parent: null, children: [] },
                        { key: ids[5], title: "測試筆記", parent: null, children: [] },
                        { key: ids[6], title: "測試筆記", parent: null, children: [] },
                        { key: ids[7], title: "測試筆記", parent: null, children: [] },
                        { key: ids[8], title: "測試筆記", parent: null, children: [] },
                        { key: ids[9], title: "測試筆記", parent: null, children: [] },
                    ],
                }
            });

            const hook = createNoteManagerHook();
            await act(async () => await hook.remove(ids[3], "multiple"));
            const nodeFind = await act(() => hook.find(ids[3], "multiple"));
            expect(nodeFind).toBeUndefined();
        });
    });


    describe("測試 find function", () => {
        it("在 'one' 中在 root level 有一節點，搜尋它", async () => {
            const id = uuid();
            await prepareNoteManager({
                nodes: {
                    one: [{ key: id, title: "測試筆記", children: [], parent: null }],
                    multiple: []
                }
            });

            const hook = createNoteManagerHook();
            const result = await act(() => hook.find(id, "one"));
            expect(result).toEqual({ key: id, title: "測試筆記", children: [], parent: null });
        });

        it("在 'one' 中有一個height = 3和一個 height = 2的樹，在height = 3的樹尋找第4個level = 3節點", async () => {
            const ids = new Array(11).fill(null).map(() => uuid());
            await prepareNoteManager({
                nodes: {
                    one: [
                        {
                            key: ids[0], title: "測試筆記", parent: null,
                            children: [{
                                key: ids[1], title: "測試筆記", parent: ids[0],
                                children: [
                                    { key: ids[2], title: "測試筆記", parent: ids[1], children: [] },
                                    { key: ids[3], title: "測試筆記", parent: ids[1], children: [] },
                                    { key: ids[4], title: "測試筆記", parent: ids[1], children: [] },
                                    { key: ids[5], title: "測試筆記", parent: ids[1], children: [] },
                                    { key: ids[6], title: "測試筆記", parent: ids[1], children: [] },
                                    { key: ids[7], title: "測試筆記", parent: ids[1], children: [] },
                                ]
                            }]
                        },
                        {
                            key: ids[8], title: "測試筆記", parent: null,
                            children: [
                                { key: ids[9], title: "測試筆記", parent: ids[8], children: [] },
                                { key: ids[10], title: "測試筆記", parent: ids[8], children: [] }
                            ]
                        },
                    ],
                    multiple: []
                }
            });

            const hook = createNoteManagerHook();
            const result = await act(() => hook.find(ids[5], "one"));
            expect(result).toEqual({ key: ids[5], title: "測試筆記", children: [], parent: ids[1] });

        });

        it("在 'multiple' 中有一節點，搜尋它", async () => {
            const id = uuid();
            await prepareNoteManager({
                nodes: {
                    one: [],
                    multiple: [{ key: id, title: "測試筆記", children: [], parent: null }]
                }
            });

            const hook = createNoteManagerHook();
            const result = await act(() => hook.find(id, "multiple"));
            expect(result).toEqual({ key: id, title: "測試筆記", children: [], parent: null });
        })
    })

    describe("測試 update function", () => {
        it("在 'one' 中，增加一節點的網址(url)", async () => {
            const ids = new Array(6).fill(null).map(() => uuid());
            await prepareNoteManager({
                nodes: {
                    one: [{
                        key: ids[0], title: "測試筆記", parent: null,
                        children: [
                            { key: ids[1], title: "測試筆記", parent: ids[0], children: [] },
                            { key: ids[2], title: "測試筆記", parent: ids[0], children: [] },
                            { key: ids[3], title: "測試筆記", parent: ids[0], children: [] },
                            { key: ids[4], title: "測試筆記", parent: ids[0], children: [] },
                            { key: ids[5], title: "測試筆記", parent: ids[0], children: [] },
                        ]
                    }],
                    multiple: []
                }
            });

            const url = "http://test-server/test";
            const hook = createNoteManagerHook();
            act(() => hook.update(ids[2], { url }));
            const node = await act(() => hook.find(ids[2]));
            expect(node?.url).toEqual(url);
        });

        it("在 'one' 中 刪除一節點的網址(url)", async () => {
            const ids = new Array(6).fill(null).map(() => uuid());
            await prepareNoteManager({
                nodes: {
                    one: [{
                        key: ids[0], title: "測試筆記", parent: null,
                        children: [
                            { key: ids[1], title: "測試筆記", parent: ids[0], children: [], url: "http://test-server/test" },
                            { key: ids[2], title: "測試筆記", parent: ids[0], children: [] },
                            { key: ids[3], title: "測試筆記", parent: ids[0], children: [] },
                            { key: ids[4], title: "測試筆記", parent: ids[0], children: [] },
                            { key: ids[5], title: "測試筆記", parent: ids[0], children: [] },
                        ]
                    }],
                    multiple: [
                        { key: ids[1] + "master", title: "測試筆記", parent: null, children: [], url: "http://test-server/test" },
                    ]
                }
            });

            const hook = createNoteManagerHook();
            act(() => hook.update(ids[2], { url: undefined }));
            const node = await act(() => hook.find(ids[2]));
            expect(node?.url).toBeUndefined();
        });
    });

    describe("測試 save function", () => {
        let editor: LexicalEditor;

        beforeAll(() => {
            editor = createHeadlessEditor({
                namespace: '',
                onError: (error) => {
                    throw error;
                },
            });

            editor.update(() => {
                $getRoot().append(
                    $createParagraphNode().append(
                      $createTextNode('Hello').toggleFormat('bold'),
                      $createTextNode('world'),
                    ),
                  );
            });
        });

        it("在 'one' 中儲存第2個筆記內容", async () => {
            const ids = new Array(10).fill(null).map(() => uuid());
            await prepareNoteManager({
                nodes: {
                    one: [
                        { key: ids[0], title: "測試筆記", parent: null, children: [] },
                        { key: ids[1], title: "測試筆記", parent: null, children: [] },
                        { key: ids[2], title: "測試筆記", parent: null, children: [] },
                        { key: ids[3], title: "測試筆記", parent: null, children: [] },
                    ],
                    multiple: [],
                }
            });

            const editor = createHeadlessEditor({
                namespace: 'test',
                onError: (error) => {
                    throw error;
                },
            });

            const hook = createNoteManagerHook();
            const editorState = editor.getEditorState();
            await act(async () => await hook.save(ids[1], editorState));
            
            const db = new SimpleNote2IndexedDB();
            const result = await db.get(ids[1]);
            expect(result).toBeDefined();

            const {content} = result as NoteObject;
            expect(content).toEqual(editorState.toJSON());
        });
    });
})