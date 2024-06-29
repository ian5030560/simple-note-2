import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import useAPI, { APIs } from "./api";
import useFiles from "../User/SideBar/FileTree/hook";

export function AuthMiddleware() {
    const [{ username }] = useCookies(["username"]);
    const loadFileTree = useAPI(APIs.loadNoteTree);
    const [id, setId] = useState();
    const [, add,] = useFiles();

    useEffect(() => {
        if (!username) return undefined;
        loadFileTree({ username })
            .then((res) => {

            });
        
    }, [loadFileTree, username]);

    return !username ? <Navigate to={"/"} /> : id && <Navigate to={id} />;
}