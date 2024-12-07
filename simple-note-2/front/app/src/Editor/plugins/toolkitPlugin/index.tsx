import { Flex } from "antd";
import BreadCrumb from "./breadcrumb";
import QuestionAI from "./questionAI";
import SpeechToText from "./speechToText";
import TableOfContent from "./tableOfContent";
import AIPlaceholder from "./aiPlaceholder";

export default function ToolKitPlugin(){
    return <Flex vertical style={{ margin: 8 }} dir="rtl" id="toolkit-container">
        <Flex gap={"small"}>
            <QuestionAI />
            <AIPlaceholder/>
            <SpeechToText />
            <TableOfContent />
        </Flex>
        <BreadCrumb/>
    </Flex>
}