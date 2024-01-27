import Track from "./Component/track";
import Text from "./Component/text";
import Markdown from "./Component/markdown";
import List from "./Component/list";
import Link from "./Component/link";
import FontSize from "./Component/font-szie";
import FontFamily from "./Component/font-family";
import FontColor from "./Component/font-color";
import BackgroundColor from "./Component/background-color";
import Align from "./Component/align";
import Search from "./Component/search";

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
        <Search />
    </>,

]