import { Tree, Button, Flex, Typography, ButtonProps } from "antd";
import { useMemo } from "react";
import useDirective from "./directive";
import { Link, useParams } from "react-router-dom";
import useNoteManager from "../../../util/useNoteManager";
import useAPI from "../../../util/api";
import { PlusLg, XLg } from "react-bootstrap-icons";
import { NoteIndexedDB } from "../../../util/store";
import useUser from "../../../util/useUser";
import { DeleteOutlined } from "@ant-design/icons";

const ToolButton = ({ onClick, ...props }: Omit<ButtonProps, "type" | "tabIndex" | "size">) => <Button type="text" size="small" tabIndex={-1}
    onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClick?.(e) }} {...props} />;

const NoteTree = () => {
    const { nodes } = useNoteManager();
    const { username } = useUser();
    const { add, remove, contextHolder, cancelCollab } = useDirective(username!);
    const { id } = useParams();
    const one = useMemo(() => nodes["one"], [nodes]);
    const multiple = useMemo(() => nodes["multiple"], [nodes]);
    const { note: { save } } = useAPI();

    return <Flex vertical gap={5} style={{ flex: 1, overflowY: "auto" }}>
        <div>
            <Flex justify="space-between" align="center" style={{ padding: 8, paddingRight: 4 }}>
                <Typography.Text type="secondary">個人筆記</Typography.Text>
                <ToolButton icon={<PlusLg />} onClick={() => add(null)} />
            </Flex>
            <Tree treeData={one} blockNode selectable={false}
                rootStyle={{ overflowY: "auto" }} defaultExpandAll
                titleRender={(data) => {
                    const first = one[0].key === data.key;

                    const to = data.url ? data.url : data.key as string;
                    return <Link to={to} onClick={async () => {
                        const db = new NoteIndexedDB();
                        const result = await db.get(id!);

                        if (!result || result.uploaded) return;
                        save(username!, id!, JSON.stringify(result.content), true).then(ok => {
                            if (!ok) return;
                            const db = new NoteIndexedDB();
                            db.update({ id: id!, content: result.content, uploaded: true });
                        });

                    }}>
                        <Flex justify="space-between" style={{ paddingTop: 3, paddingBottom: 3 }}>
                            <Typography.Text>{data.title as string}</Typography.Text>
                            <Flex gap={3}>
                                {!first && <ToolButton icon={<DeleteOutlined />} onClick={() => remove(data)} />}
                                <ToolButton icon={<PlusLg size={16} />} onClick={() => add(data)} />
                            </Flex>
                        </Flex>
                    </Link>
                }} />
        </div>

        {
            multiple.length !== 0 && <div>
                <Flex style={{ padding: 8 }}>
                    <Typography.Text type="secondary">協作筆記</Typography.Text>
                </Flex>
                <Tree treeData={multiple} blockNode selectable={false}
                    rootStyle={{ overflowY: "auto" }} defaultExpandAll
                    titleRender={(data) => {

                        return <Link to={data.url!}>
                            <Flex justify="space-between"
                                style={{ paddingTop: 3, paddingBottom: 3, overflow: "hidden" }}>
                                <Typography.Text>{data.title as string}</Typography.Text>
                                <ToolButton icon={<XLg size={16} />} onClick={() => cancelCollab(data)} />
                            </Flex>
                        </Link>
                    }} />
            </div>
        }

        {contextHolder}
    </Flex>
}

export default NoteTree;