import { FunctionOutlined } from "@ant-design/icons";
import { PlusItem } from "../plugins/draggablePlugin/component";
import { WRITE_MATH } from "../plugins/mathPlugin";

const Math: PlusItem = {
    value: "math",
    label: "Math",
    icon: <FunctionOutlined style={{fontSize: 24}}/>,
    onSelect: (editor, nodeKey) => {
        
        editor.dispatchCommand(WRITE_MATH, undefined)
    }
}

export default Math;