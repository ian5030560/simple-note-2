import { ToolKitButton } from "./ui";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TOGGLE_QUESTION_TO_AI } from "../AIPlugins/question";
import { RobotOutlined } from "@ant-design/icons";

export default function QuestionAI() {
    const [editor] = useLexicalComposerContext();
    return <ToolKitButton icon={<RobotOutlined />}
        onClick={() => editor.dispatchCommand(TOGGLE_QUESTION_TO_AI, undefined)}
    />
}