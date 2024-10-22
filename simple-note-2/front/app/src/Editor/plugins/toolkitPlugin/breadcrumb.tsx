import { Breadcrumb, Typography } from "antd";
import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useNodes } from "../../../User/SideBar/NoteTree/store";

type NoteRelationItem = {
    title: string,
    key: string;
}
export default function BreadCrumb() {
    const { findNode } = useNodes();
    const { id, host } = useParams();
    const items = useMemo(() => {
        const crumbs: NoteRelationItem[] = [];
        const collab = !!(id && host);

        let current = !collab ? id : id + host;
        while (current) {
            const found = findNode(current);
            if (!found) break;
            crumbs.push({ title: found.current.title as string, key: found.current.key as string });
            current = found.parent?.key as string | undefined;
        }

        return crumbs.reverse();
    }, [findNode, host, id]);

    const last = items.length - 1;

    return <Breadcrumb style={{ userSelect: "none", paddingRight: 8 }}
        itemRender={(route, _, routes) => routes.indexOf(route) === last ?
            <Typography.Text>{route.title}</Typography.Text> :
            <Link to={route.path!}>{route.title}</Link>}
        items={items.map(item => ({
            key: item.key, title: item.title, path: `/note/${item.key}`,
        }))}
    />
}