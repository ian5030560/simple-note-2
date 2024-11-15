import UserComponent from "./component";
import { Navigate, Outlet, useLoaderData, useParams } from "react-router-dom";
import { useMemo } from "react";


export default () => {
    const first = useLoaderData() as string;
    const { id } = useParams();
    
    return <UserComponent>
        {!id && <Navigate to={first} replace/>}
        <Outlet />
    </UserComponent>;
}

// export const Switch = (props: React.PropsWithChildren) => {
//     const { findNode } = useNodes();
//     const { id, host } = useParams();


//     const url = useMemo(() => {
//         const node = findNode(id!)?.current as NoteDataNode | undefined;
//         const url = node?.url;
        
//         return url;
//     }, [findNode, id]);

//     return <>
//         {props.children}
//         {url && !host && <Navigate to={url} replace />}
//         {!url && host && <Navigate to={id!} replace />}
//     </>
// }