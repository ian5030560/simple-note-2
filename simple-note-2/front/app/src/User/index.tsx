import theme, { BulbButton, defaultSeed } from "../util/theme";
import UserComponent from "./component";
import { Navigate, Outlet, useLoaderData, useParams } from "react-router-dom";
import useUser from "../util/useUser";
import { useMemo } from "react";
import { usePageTitle } from "../util/pageTitle";
import { ConfigProvider } from "antd";

export default function User() {
    const first = useLoaderData() as string;
    const { id } = useParams();
    const { themes, username, dark, toggleDark } = useUser();

    usePageTitle(`${username}的筆記`);

    const seed = useMemo(() => {
        const current = themes.find(it => it.using);
        if (!current) return undefined;
        return current.data;
    }, [themes]);

    return <ConfigProvider theme={theme(seed ?? defaultSeed)(dark)}>
        <UserComponent>
            {!id && <Navigate to={first} replace />}
            <Outlet />
            <BulbButton onClick={toggleDark} />
        </UserComponent>
    </ConfigProvider>;
}