import React from "react";
import { useCookies } from "react-cookie";
import { Navigate, Outlet } from "react-router-dom";
import useFiles from "../User/SideBar/FileTree/hook";

export function AuthMiddleware() {
    const [{ username }] = useCookies(["username"]);
    const [nodes] = useFiles();

    return !username || nodes.length === 0 ? <Navigate to={"/"} /> : <Outlet/>;
}