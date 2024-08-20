import Link from "./ToolBar/Component/link";
import {FontColor, FontFamily, FontSize} from "./ToolBar/Component/font";
import BackgroundColor from "./ToolBar/Component/background";
import Align from "./ToolBar/Component/align";
import History from "./ToolBar/Component/history";
import Text from "./ToolBar/Component/text";
import Markdown from "./ToolBar/Component/markdown";
import List from "./ToolBar/Component/list";
import Table from "./ToolBar/Component/table";
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
        <Table/>
    </Flex>,
]