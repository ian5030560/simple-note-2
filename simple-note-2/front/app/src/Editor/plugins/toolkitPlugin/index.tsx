import { Flex } from "antd";
import BreadCrumb from "./breadcrumb";
import Comment from "./comment";
import QuestionAI from "./questionAI";
import SpeechToText from "./speechToText";
import TableOfContent from "./tableOfContent";

export default function ToolKitPlugin(){
    return <Flex vertical style={{ margin: 8 }} dir="rtl" id="toolkit-container">
        <Flex gap={"small"}>
            <QuestionAI />
            <Comment />
            <SpeechToText />
            <TableOfContent />
        </Flex>
        <BreadCrumb/>
    </Flex>
}