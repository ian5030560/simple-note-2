import Link from "./ToolBar/Component/link";
import FontSize from "./ToolBar/Component/font-size";
import FontFamily from "./ToolBar/Component/font-family";
import FontColor from "./ToolBar/Component/font-color";
import BackgroundColor from "./ToolBar/Component/background-color";
import Align from "./ToolBar/Component/align";
import Track from "./ToolBar/Component/track";
import Text from "./ToolBar/Component/text";
import Markdown from "./ToolBar/Component/markdown";
import List from "./ToolBar/Component/list";
import Table from "./ToolBar/Component/table";

export const LIST: React.ReactNode[] = [
    <Track/>,
    <Text />,
    <Markdown />,
    <Align />,
    <List />,
    <>
        <FontColor />
        <BackgroundColor />
    </>,
    <>
        <FontSize />
        <FontFamily />
    </>,
    <>
        <Link />
        <Table/>
    </>,

]