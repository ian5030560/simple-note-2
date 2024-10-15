import { FunctionOutlined } from "@ant-design/icons";
import { PlusItem } from "../plugins/draggablePlugin/component";
import { OPEN_MATH_MODAL } from "../plugins/mathPlugin";

const Math: PlusItem = {
    value: "math",
    label: "Math",
    icon: <FunctionOutlined style={{fontSize: 24}}/>,
    onSelect: (editor) => editor.dispatchCommand(OPEN_MATH_MODAL, undefined)
}

export default Math;