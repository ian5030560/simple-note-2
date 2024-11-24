import "@testing-library/jest-dom"
import "core-js/stable/structured-clone";
import { generateNoteForest } from "../src/util/loader";

type NoteTreeData = { noteId: string, noteName: string, parentId: string | null, siblingId: string | null };

describe("將server的NoteTreeData轉成NoteForest", () => {
    it("test1", () => {
        const noteTreeData: NoteTreeData[] = [
            { noteId: '1', noteName: 'Root', parentId: null, siblingId: null },
            { noteId: '2', noteName: 'Child 1', parentId: '1', siblingId: null },
            { noteId: '3', noteName: 'Child 2', parentId: '1', siblingId: '2' },
            { noteId: '4', noteName: 'Grandchild', parentId: '2', siblingId: null }
        ];

        const forest = generateNoteForest(noteTreeData);

        expect(forest).toEqual([
            {
                key: "1",
                title: "Root",
                children: [
                    {
                        key: "2",
                        title: "Child 1",
                        children: [
                            {
                                key: "4",
                                title: "Grandchild",
                                children: [],
                                parent: "2",
                            }
                        ],
                        parent: "1",
                    },
                    {
                        key: "3",
                        title: "Child 2",
                        children: [],
                        parent: "1",
                    }
                ],
                parent: null,
            }
        ]);
    });

    it("test2", () => {
        const noteTreeData: NoteTreeData[] = [
            { noteId: '1', noteName: 'Root 1', parentId: null, siblingId: null },
            { noteId: '2', noteName: 'Child 1.1', parentId: '1', siblingId: null },
            { noteId: '3', noteName: 'Child 1.2', parentId: '1', siblingId: '2' },
            { noteId: '4', noteName: 'Grandchild 1.1.1', parentId: '2', siblingId: null },
            { noteId: '5', noteName: 'Root 2', parentId: null, siblingId: '1' },
            { noteId: '6', noteName: 'Child 2.1', parentId: '5', siblingId: null },
            { noteId: '7', noteName: 'Child 2.2', parentId: '5', siblingId: '6' },
            { noteId: '8', noteName: 'Grandchild 2.1.1', parentId: '6', siblingId: null }
        ];

        const forest = generateNoteForest(noteTreeData);

        expect(forest).toEqual([
            {
                key: "1",
                title: "Root 1",
                children: [
                    {
                        key: "2",
                        title: "Child 1.1",
                        children: [
                            {
                                key: "4",
                                title: "Grandchild 1.1.1",
                                children: [],
                                parent: "2",
                            }
                        ],
                        parent: "1",
                    },
                    {
                        key: "3",
                        title: "Child 1.2",
                        children: [],
                        parent: "1",
                    }
                ],
                parent: null,
            },
            {
                key: "5",
                title: "Root 2",
                parent: null,
                children: [
                    {
                        key: "6",
                        title: "Child 2.1",
                        parent: "5",
                        children: [
                            {
                                key: "8",
                                title: "Grandchild 2.1.1",
                                parent: "6",
                                children: []
                            }
                        ]
                    },
                    {
                        key: "7",
                        title: "Child 2.2",
                        parent: "5",
                        children: []
                    }
                ]
            }
        ]);
    });

    it("test3", () => {
        const noteTreeData: NoteTreeData[] = [
            { noteId: '2', noteName: 'Child 1.1', parentId: '1', siblingId: null },
            { noteId: '4', noteName: 'Grandchild 1.1.1', parentId: '2', siblingId: null },
            { noteId: '5', noteName: 'Root 2', parentId: null, siblingId: '1' },
            { noteId: '8', noteName: 'Grandchild 2.1.1', parentId: '6', siblingId: null },
            { noteId: '3', noteName: 'Child 1.2', parentId: '1', siblingId: '2' },
            { noteId: '6', noteName: 'Child 2.1', parentId: '5', siblingId: null },
            { noteId: '1', noteName: 'Root 1', parentId: null, siblingId: null },
            { noteId: '7', noteName: 'Child 2.2', parentId: '5', siblingId: '6' },
        ];

        const forest = generateNoteForest(noteTreeData);

        expect(forest).toEqual([
            {
                key: "1",
                title: "Root 1",
                children: [
                    {
                        key: "2",
                        title: "Child 1.1",
                        children: [
                            {
                                key: "4",
                                title: "Grandchild 1.1.1",
                                children: [],
                                parent: "2",
                            }
                        ],
                        parent: "1",
                    },
                    {
                        key: "3",
                        title: "Child 1.2",
                        children: [],
                        parent: "1",
                    }
                ],
                parent: null,
            },
            {
                key: "5",
                title: "Root 2",
                parent: null,
                children: [
                    {
                        key: "6",
                        title: "Child 2.1",
                        parent: "5",
                        children: [
                            {
                                key: "8",
                                title: "Grandchild 2.1.1",
                                parent: "6",
                                children: []
                            }
                        ]
                    },
                    {
                        key: "7",
                        title: "Child 2.2",
                        parent: "5",
                        children: []
                    }
                ]
            }
        ]);
    })
})