import { Extension } from "..";
import { ColumnContainerNode } from "./container";
import { ColumnItemNode } from "./item";
import ColumnLayoutPlugin from "./plugin";
import "./index.css";

const ColumnLayoutExtension: Extension = {
    plugins: [<ColumnLayoutPlugin/>],
    nodes: [ColumnContainerNode, ColumnItemNode],
    theme: {
        column: {
            container: "simple-note-2-column-container",
            item: "simple-note-2-column-item",
        }
    },
}

export default ColumnLayoutExtension;