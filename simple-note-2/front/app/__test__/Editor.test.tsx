import "@testing-library/jest-dom"
import { render, act, screen, waitFor } from '@testing-library/react'
import Editor from "../src/Editor";
import { RouteObject, RouterProvider, createMemoryRouter } from "react-router-dom";
import { createHeadlessEditor } from "@lexical/headless";
import { $createTextNode, $getRoot, LexicalEditor } from "lexical";
import { uuid } from "./utils";

describe("測試Editor in Editor/index.tsx", () => {
    let editor: LexicalEditor;
    beforeAll(async () => {
        editor = createHeadlessEditor({
            namespace: 'test',
            onError: (error) => {
                throw error;
            },
        });

        const routes: RouteObject[] = [{
            path: "/note/:id",
            element: <Editor />,
            loader: () => {
                editor.update(() => {
                    $getRoot().select()
                        .insertParagraph()?.select()
                        .insertNodes([$createTextNode("Hello world")])
                }, { discrete: true });

                return editor.getEditorState().toJSON();
            }
        }];

        const router = await act(() => createMemoryRouter(routes, {
            initialEntries: [`/note/${uuid()}`],
            initialIndex: 0
        }));

        render(<RouterProvider router={router}/>)
    })

    it("當使用者更新之後，之後超過500ms，使用 'save' function in useNoteManager", () => {
        
    });

    // it("", () => {

    // });

    // it("", () => {

    // });


});