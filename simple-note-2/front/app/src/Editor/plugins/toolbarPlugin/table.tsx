import { Button, Popover, theme } from "antd";
import { useCallback, useState } from "react";
import styles from "./table.module.css";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { Grid3x3 } from "react-bootstrap-icons";

interface TableDimensionProp {
    maxRows: number;
    maxColumns: number;
    onSizePick?: (row: number, column: number) => void;
}

const RESET = { rows: 0, cols: 0 };
const TableDimension = ({ maxRows, maxColumns, onSizePick }: TableDimensionProp) => {

    const [size, setSize] = useState<{ rows: number, cols: number }>(RESET);
    const { token } = theme.useToken();

    return <>
        <span>{`${size.rows}x${size.cols}`}</span>
        <table className={styles.dimensionTable} onPointerLeave={() => setSize(RESET)}>
            <tbody>
                {
                    new Array<React.JSX.Element[]>(maxRows).fill(new Array(maxColumns).fill(undefined)).map((items, i) => {
                        return <tr key={i}>
                            {
                                items.map((_, j) => {
                                    const selected = i < size.rows && j < size.cols;

                                    return <td key={`${i}-${j}`} style={{ backgroundColor: selected ? token.colorPrimary : undefined }}
                                        onPointerEnter={() => setSize({ rows: i + 1, cols: j + 1 })}
                                        onPointerDown={() => {
                                            onSizePick?.(i + 1, j + 1)
                                            setSize(RESET);
                                        }}
                                    />
                                })
                            }
                        </tr>
                    })
                }
            </tbody>
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

    return <Popover trigger={["click"]} open={open} onOpenChange={(op) => setOpen(op)} arrow={false}
        content={<TableDimension maxRows={15} maxColumns={15} onSizePick={handleSizeChange} />}>
        <Button icon={<Grid3x3 />} type="text" />
    </Popover>
}

export default Table;