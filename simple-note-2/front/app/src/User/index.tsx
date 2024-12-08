import { ThemeProvider } from "../util/theme";
import UserComponent from "./component";
import { Navigate, Outlet, useLoaderData, useParams } from "react-router-dom";
import useUser from "../util/useUser";
import { useMemo } from "react";
import { usePageTitle } from "../util/pageTitle";

export default function User(){
    const first = useLoaderData() as string;
    const { id } = useParams();
    const {themes, dark, username} = useUser();

    usePageTitle(`${username}的筆記`);

    const seed = useMemo(() => {
        const current = themes.find(it => it.using);
        if(!current) return undefined;
        return current.data;
    }, [themes]);

    return <ThemeProvider seed={seed} dark={dark}>
            <UserComponent>
            {!id && <Navigate to={first} replace/>}
            <Outlet />
        </UserComponent>
    </ThemeProvider>;
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