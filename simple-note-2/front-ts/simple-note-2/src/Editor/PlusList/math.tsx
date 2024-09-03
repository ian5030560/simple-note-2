import { FunctionOutlined } from "@ant-design/icons";
import { PlusItem } from "../Draggable/component";
import { WRITE_MATH } from "../Extension/math/plugin";

const Math: PlusItem = {
    value: "math",
    label: "Math",
    icon: <FunctionOutlined style={{fontSize: 24}}/>,
    onSelect: (editor) => editor.dispatchCommand(WRITE_MATH, undefined)
}

export default Math;