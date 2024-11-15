import { ToolKitButton } from "./ui";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TOGGLE_QUESTION_TO_AI } from "../AIPlugins/question";
import { Robot } from "react-bootstrap-icons";


export default function QuestionAI() {
    const [editor] = useLexicalComposerContext();
    return <ToolKitButton icon={<Robot size={24} />}
        onClick={() => editor.dispatchCommand(TOGGLE_QUESTION_TO_AI, undefined)}
    />
}