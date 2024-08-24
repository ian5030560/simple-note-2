import { Flex } from "antd";
import { Plugin } from "../Extension";
import BreadCrumb from "./breadcrumb";
import Comment from "./comment";
import QuestionAI from "./questionAI";
import SpeechToText from "./speechToText";
import TableOfContent from "./tableOfContent";

const ToolKitPlugin: Plugin = () => {
    return <Flex gap={"small"} dir="rtl" style={{margin: 5}} align="center" id="toolkit-container">
        <QuestionAI/>
        <Comment/>
        <SpeechToText/>
        <TableOfContent/>
        <BreadCrumb/>
    </Flex>
}

export default ToolKitPlugin;