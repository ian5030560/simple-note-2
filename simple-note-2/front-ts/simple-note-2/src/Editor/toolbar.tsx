import Link from "./ToolBar/Component/link";
import FontSize from "./ToolBar/Component/font-size";
import FontFamily from "./ToolBar/Component/font-family";
import FontColor from "./ToolBar/Component/font-color";
import BackgroundColor from "./ToolBar/Component/background-color";
import Align from "./ToolBar/Component/align";
import History from "./ToolBar/Component/history";
import Text from "./ToolBar/Component/text";
import Markdown from "./ToolBar/Component/markdown";
import List from "./ToolBar/Component/list";
import Table from "./ToolBar/Component/table";
import Comment from "./ToolBar/Component/comment";
import { Flex } from "antd";

export const LIST: React.ReactNode[] = [
    <History/>,
    <Text />,
    <Markdown />,
    <Align />,
    <List />,
    <Flex>
        <FontColor />
        <BackgroundColor />
    </Flex>,
    <Flex>
        <FontSize />
        <FontFamily />
    </Flex>,
    <Flex>
        <Link />
        <Comment/>
        <Table/>
    </Flex>,

]