import UserComponent from "./component";
import { Navigate, Outlet, useLoaderData, useParams } from "react-router-dom";
import { NoteDataNode } from "./SideBar/NoteTree/store";
import { useMemo } from "react";

export default () => {
    const data = useLoaderData() as NoteDataNode[];
    const { id, host } = useParams();

    const _id = useMemo(() => {
        const collab = !!(id && host);
        const _id = id ? !collab ? id : `${id}/${host}` : data[0].key as string;

        return _id;
    }, [data, host, id]);

    return <UserComponent>
        <Navigate to={_id} replace />
        <Outlet />
    </UserComponent>;
}