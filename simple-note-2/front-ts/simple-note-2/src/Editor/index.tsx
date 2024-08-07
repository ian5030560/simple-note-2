import React, { useMemo } from "react";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import ToolBarPlugin from "./ToolBar/index";
import DraggablePlugin from "./Draggable";
import Loader from "./loader";
import ADDLIST from "./addList";
import { LIST } from "./toolbar";
import CollaboratePlugin from "./Collaborate";
import { Breadcrumb, TreeDataNode, Typography } from "antd";
import useFiles, { findNode } from "../User/SideBar/FileTree/hook";
import { Link, useParams } from "react-router-dom";

type NoteRelationItem = {
    title: string,
    key: string;
}
const NoteBreadcrumb = (props: { items: NoteRelationItem[] }) => {
    let last = props.items.length - 1;

    return <Breadcrumb style={{ margin: 10, direction: "rtl", userSelect: "none" }}
        itemRender={(route, _, routes) => routes.indexOf(route) === last ?
            <Typography.Text>{route.title}</Typography.Text> :
            <Link to={route.path!}>{route.title}</Link>}
        items={props.items.map(item => ({
            key: item.key, title: item.title, path: `/${item.key}`,
        }))} />
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { styleSheet } = Loader;

function onError(error: Error) {
    console.error(error);
}
const Editor = () => {
    const [nodes] = useFiles();
    const { file } = useParams();

    const items = useMemo(() => {
        let crumbs: NoteRelationItem[] = [];
        if (nodes.length === 0) return crumbs;

        let current = file;
        while (current) {
            let found = findNode(nodes, current);
            if (!found) break;
            crumbs.push({ title: found.current.title as string, key: found.current.key as string });
            current = found.parent?.key as string | undefined;
        }

        return crumbs;
    }, [file, nodes]);

    return <LexicalComposer
        initialConfig={{ namespace: 'Editor', theme: Loader.theme, onError, nodes: Loader.nodes }}>
        <ToolBarPlugin toolbars={LIST} />
        <NoteBreadcrumb items={items.reverse()} />
        <DraggablePlugin addList={ADDLIST} />
        <CollaboratePlugin />
        {Loader.plugins.map((plugin, index) => <React.Fragment key={index}>{plugin}</React.Fragment>)}
    </LexicalComposer>;
}

export default Editor;