import UserComponent from "./component";
import { Navigate, Outlet, useLoaderData, useNavigation, useParams } from "react-router-dom";
import { NoteDataNode, useNodes } from "./SideBar/NoteTree/store";
import { useEffect, useMemo, useState } from "react";
import { Spin } from "antd";

interface LongWaitingProps{
    delay: number;
    text?: string;
}
export const LongWaiting = (props: LongWaitingProps) => {
    const navigation = useNavigation();
    const [waiting, setWaiting] = useState(false);

    useEffect(() => {
        let id: NodeJS.Timeout | undefined = undefined;
        if (navigation.state !== "loading") {
            setWaiting(false);
        }
        else {
            id = setTimeout(() => {
                setWaiting(true);
            }, props.delay);
        }
        return () => { if (id) clearTimeout(id) }
    }, [navigation.state, props.delay]);

    return waiting ?? <Spin spinning fullscreen size="large" tip={props.text}/>;
}

export default () => {
    const first = useLoaderData() as string;
    const { id } = useParams();
    
    return <UserComponent>
        {!id && <Navigate to={first} replace/>}
        <Outlet />
        <LongWaiting delay={500} text="正在載入個人資料"/>
    </UserComponent>;
}

export const Switch = (props: React.PropsWithChildren) => {
    const { findNode } = useNodes();
    const { id, host } = useParams();


    const url = useMemo(() => {
        const node = findNode(id!)?.current as NoteDataNode | undefined;
        const url = node?.url;
        
        return url;
    }, [findNode, id]);

    return <>
        {props.children}
        {url && !host && <Navigate to={url} replace />}
        {!url && host && <Navigate to={id!} replace />}
    </>
}