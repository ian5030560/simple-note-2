import { Extension } from "..";
import { AIPlaceholderPlugin } from "./placeholder";
import { AIQuestionPlugin } from "./question";

const AIExtension: Extension = {
    plugins: [
        <AIQuestionPlugin/>
        // <AIPlaceholderPlugin />,
    ]
}

export default AIExtension;