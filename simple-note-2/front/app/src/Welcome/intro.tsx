import { Flex, Grid, Typography } from "antd";
import styles from "./index.module.css";
import VideoFile from "../resource/mai_desktop_video.mp4";
import { useMemo } from "react";

interface IntroItemProps {
    title: string;
    description: string;
    src: string;
}

const { useBreakpoint } = Grid;
const IntroItem = (props: IntroItemProps) => {
    const { sm, md, lg, xl, xxl } = useBreakpoint();

    const width = useMemo(() => {
        if (xxl) return 1400;
        if (xl) return 1000;
        if (lg) return 900;
        if (md) return 700;
        if (sm) return 500;
        return "100%"
    }, [lg, md, sm, xl, xxl]);

    return <section className={styles.container}>
        <div style={{ textAlign: "center" }}>
            <Typography.Title level={1}>{props.title}</Typography.Title>
            <Typography.Paragraph style={{fontSize: "larger"}} type="secondary">{props.description}</Typography.Paragraph>
        </div>
        <Flex justify="center">
            <video src={props.src} width={width} autoPlay loop muted style={{objectFit: "cover"}}/>
        </Flex>
    </section>
}

type IntroItemData = { key: React.Key } & IntroItemProps;
export default function Intro() {
    const items: IntroItemData[] = [
        { key: "edit-note", title: "筆記編輯", description: "使用我們的筆記工具，呈現多樣貌的內容，盡情揮灑並記錄你的想法，編輯出你的專屬筆記", src: VideoFile },
        { key: "ai-support", title: "AI輔助", description: "我們有AI可以提供預測文字，並且讓詢問你想知道的資訊，來幫助你更快更方便寫出你要的筆記", src: VideoFile },
        { key: "collaborate", title: "多人合作", description: "呼喚你的朋友或同事們，使用我們的筆記工具，一起合作編寫更好更詳細的筆記內容", src: VideoFile },
        { key: "theme-edit", title: "主題編輯", description: "創建專屬你的主題，隨時隨地切換主題，使你的筆記更加多采多姿", src: VideoFile },
    ];
    return <Flex vertical align="center">
        {items.map(({ key, ...item }) => <IntroItem key={key} {...item} />)}
    </Flex>;
};