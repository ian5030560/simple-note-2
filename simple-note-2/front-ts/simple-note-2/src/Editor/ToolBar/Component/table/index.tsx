import { Button, Popover } from "antd";
import { useCallback, useMemo, useState } from "react";
import { FaTableCells } from "react-icons/fa6";
import styles from "./index.module.css";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_TABLE_COMMAND } from "@lexical/table";

interface TableDimensionProp {
    maxRows: number;
    maxColumns: number;
    onSizePick?: (row: number, column: number) => void;
}

const RESET = { rows: -1, cols: -1 };
const TableDimension = ({ maxRows, maxColumns, onSizePick }: TableDimensionProp) => {

    const [size, setSize] = useState<{ rows: number, cols: number }>(RESET);

    const dimension = useMemo(() => {
        let arrs = [];
        for (let i = 0; i < maxRows; i++) {
            let arr = [];
            for (let j = 0; j < maxColumns; j++) {
                let selected = i <= size.rows && j <= size.cols;
                arr.push(<td key={`${i}-${j}`} className={selected && styles.dimensionCellSelected}
                    onPointerEnter={() => setSize({ rows: i, cols: j })}
                    onPointerDown={() => onSizePick?.(i, j)} />);
            }

            arrs.push(<tr key={`${i}`}>{arr}</tr>);
        }
        return arrs;
    }, [maxColumns, maxRows, onSizePick, size.cols, size.rows]);

    return <>
        <span>{`${size.rows}x${size.cols}`}</span>
        <table className={styles.dimensionTable}>
            {dimension}
        </table>
    </>
}

const Table = () => {

    const [editor] = useLexicalComposerContext();
    const [open, setOpen] = useState(false);

    const handleSizeChange = useCallback((rows: number, cols: number) => {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows: rows.toString(), columns: cols.toString(), includeHeaders: false });
        setOpen(false);
    }, [editor]);

    return <Popover trigger={["click"]} open={open} onOpenChange={(op) => setOpen(op)}
        content={<TableDimension maxRows={15} maxColumns={15} onSizePick={handleSizeChange} />}
        arrow={false}>
        <Button icon={<FaTableCells />} type="text" />
    </Popover>
}

export default Table;