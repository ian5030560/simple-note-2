import { createPortal } from "react-dom";
import { CiCircleChevDown } from "react-icons/ci";
import { Plugin } from "..";
import { Dropdown, MenuProps } from "antd";
import { useMemo, useState } from "react";

const DEFAULT = {top: -10000, left: -10000};
const TableActionPlugin: Plugin = () => {

    const [pos, setPos] = useState<{top: number, left: number}>(DEFAULT);
    const items: MenuProps["items"] = useMemo(() => {
        return [
            {
                key: "addRowAbove",
                label: <p>add row above</p>
            },
            {
                key: "addRowBelow",
                label: <p>add row below</p>
            }
        ]
    }, []);

    return createPortal(
        <Dropdown menu={{ items }} trigger={["click"]}>
            <div className="simple-note-2-table-cell-action-button-container"
                style={{ transform: `translate(${pos.top}px, ${pos.left}px)` }}>

                <button type="button" className="simple-note-2-table-cell-action-button">
                    <CiCircleChevDown size={20} />
                </button>
            </div>
        </Dropdown>,
        document.body
    );
}

export default TableActionPlugin;