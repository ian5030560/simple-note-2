import { Extension } from "..";
import SpeechToTextPlugin from "./plugin";

const SpeechToTextExtension: Extension = {
    plugins: [<SpeechToTextPlugin />],
}

export default SpeechToTextExtension;