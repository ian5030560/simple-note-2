import { useCookies } from "react-cookie";
import useAPI, { APIs } from "./api"
import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";

export default function ContextProvider() {
    const getInfo = useAPI(APIs.getInfo);
    const getNote = useAPI(APIs.getNote);
    const [{ username }] = useCookies(["username"]);
    const { file } = useParams();

    useEffect(() => {
        getNote({
            username: username,
            noteId: file!
        })
            .then((res) => res.json())
            // .then((res) => res && setState(res))
            .catch(() => {
                // Modal.error({
                //     title: "載入發生錯誤",
                //     content: "請重新整理頁面",
                //     footer: <div style={{direction: "rtl"}}>
                //         <Button type="primary" danger
                //             onClick={() => window.location.reload()}>重新整理</Button>
                //     </div>,
                //     closeIcon: null
                // })
            })


    }, [file, getNote, username]);

    return <>
        <Outlet />
    </>;
}