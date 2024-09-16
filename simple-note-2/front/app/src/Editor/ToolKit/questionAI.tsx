import { RobotOutlined } from "@ant-design/icons";
import { ToolKitButton } from "./ui";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TOGGLE_QUESTION_TO_AI } from "../Extension/ai/question";

export default function QuestionAI() {
    const [editor] = useLexicalComposerContext();
    return <ToolKitButton icon={<RobotOutlined size={24} />}
        onClick={() => editor.dispatchCommand(TOGGLE_QUESTION_TO_AI, undefined)}
    />
}