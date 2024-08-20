import { Breadcrumb, Typography } from "antd";
import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import useFiles, { findNode } from "../../User/SideBar/FileTree/hook";

type NoteRelationItem = {
    title: string,
    key: string;
}
export default function BreadCrumb() {
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

        return crumbs.reverse();
    }, [file, nodes]);

    let last = items.length - 1;

    return <Breadcrumb style={{ userSelect: "none" }}
        itemRender={(route, _, routes) => routes.indexOf(route) === last ?
            <Typography.Text>{route.title}</Typography.Text> :
            <Link to={route.path!}>{route.title}</Link>}
        items={items.map(item => ({
            key: item.key, title: item.title, path: `/note/${item.key}`,
        }))}
    />
}