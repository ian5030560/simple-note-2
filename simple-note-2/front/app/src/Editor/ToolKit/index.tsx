import { Flex } from "antd";
import { Plugin } from "../Extension";
import BreadCrumb from "./breadcrumb";
import Comment from "./comment";
import QuestionAI from "./questionAI";
import SpeechToText from "./speechToText";
import TableOfContent from "./tableOfContent";

const ToolKitPlugin: Plugin = () => {
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

export default ToolKitPlugin;