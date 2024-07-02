import React from "react";
import { useCookies } from "react-cookie";
import { Navigate, Outlet } from "react-router-dom";

export function AuthMiddleware() {
    const [{ username }] = useCookies(["username"]);

    return !username ? <Navigate to={"/"} /> : <Outlet/>;
}