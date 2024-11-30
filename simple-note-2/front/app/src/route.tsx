import { Navigate, Outlet, useLoaderData } from "react-router-dom"

export function Public() {
    const data = useLoaderData() as boolean;

    return data ? <Navigate to={"note"} replace /> : <Outlet />
}

export function Private() {
    const data = useLoaderData() as boolean;

    return !data ? <Navigate to={"/"} replace /> : <Outlet />
}