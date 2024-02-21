import { AddItem } from "../Lexical/draggable/component";
import {RiUserVoiceFill} from "react-icons/ri";
import { SPEECH_TO_TEXT } from "../Lexical/speechToText";

const SpeechToText: AddItem = {
    value: "speech to text",
    label: "Speech To Text",
    icon: <RiUserVoiceFill size={24}/>,
    onSelect: (editor) => {
        editor.dispatchCommand(SPEECH_TO_TEXT, undefined);
    }
}

export default SpeechToText;