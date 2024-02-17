import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import * as React from "react";

import "../styles.css";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { InsertTableCommandPayload } from "@lexical/table";

export function FillColumns() {
  const columns = prompt("Enter the number of columns:", "");

  if (columns != null) {
    return columns;
  } else {
    return String(0);
  }
}

export default function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const onClick = (payload: InsertTableCommandPayload) => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, payload);
  };

  const Fill = () => {
    const rows = prompt("Enter the number of rows:", "");
    const columns = prompt("Enter the number of columns:", "");

    if (
      isNaN(Number(columns)) ||
      columns == null ||
      rows == null ||
      columns === "" ||
      rows === "" ||
      isNaN(Number(rows))
    ) {
      return;
    }

    onClick({ columns: columns, rows: rows });
  };

  return (
    <div className="toolbar">
      <button onClick={() => Fill()} className={"toolbar-item spaced "}>
        <span className="text">Insert Table</span>
      </button>
    </div>
  );
}
