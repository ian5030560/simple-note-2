import UserComponent from "./component";
import { Navigate, Outlet, useLoaderData, useParams } from "react-router-dom";
import { NoteDataNode, TreeProvider } from "./SideBar/NoteTree/store";
import { useMemo } from "react";

export default () => {
    const data = useLoaderData() as NoteDataNode[];
    const { id, host } = useParams();

    const _id = useMemo(() => {
        const collab = !!(id && host);
        const _id = id ? !collab ? id : `${id}/${host}` : data[0].key as string;
 
        return _id;
    }, []);

    return <TreeProvider nodes={data}>
        <UserComponent>
            <Navigate to={_id} replace/>
            <Outlet />
        </UserComponent>
    </TreeProvider>
}