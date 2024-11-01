import { Tree, Button, Flex, Typography, ButtonProps } from "antd";
import { FaPlus } from "react-icons/fa6";
import { useNodes } from "./store";
import { useMemo } from "react";
import { CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import useDirective from "./directive";
import { Link, useNavigate } from "react-router-dom";
import { decodeBase64 } from "../../../util/secret";
import { useCookies } from "react-cookie";

const ToolButton = ({ onClick, ...props }: Omit<ButtonProps, "type" | "tabIndex" | "size">) => <Button type="default" size="small" tabIndex={-1}
    onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClick?.(e) }} {...props} />;

const NoteTree = () => {
    const { nodes } = useNodes();
    const navigate = useNavigate();
    const { add, remove, contextHolder, cancelCollab } = useDirective();
    const [{ username }] = useCookies(["username"]);

    const one = useMemo(() => nodes["one"], [nodes]);
    const multiple = useMemo(() => nodes["multiple"], [nodes]);

    return <Flex vertical gap={5} style={{ flex: 1, overflowY: "auto" }}>
        <div>
            <Flex justify="space-between" align="center" style={{ padding: 8, paddingRight: 4 }}>
                <Typography.Text type="secondary">個人筆記</Typography.Text>
                <ToolButton icon={<FaPlus />} onClick={() => add(null)} />
            </Flex>
            <Tree treeData={one} blockNode selectable={false}
                rootStyle={{ overflowY: "auto" }} defaultExpandAll
                titleRender={(data) => {
                    const first = one[0].key === data.key;

                    return <Link to={data.url ? data.url : data.key as string}>
                        <Flex justify="space-between" style={{ paddingTop: 3, paddingBottom: 3 }}>
                            <Typography.Text>{data.title as string}</Typography.Text>
                            <Flex gap={3}>
                                {!first && <ToolButton icon={<DeleteOutlined />} onClick={() => remove(data)} />}
                                <ToolButton icon={<PlusOutlined />} onClick={() => add(data)} />
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
                        // const [_, host] = data.url!.split("/");
                        return <Link to={data.url!}>
                            <Flex justify="space-between" onClick={() => navigate(data.url!)}
                                style={{ paddingTop: 3, paddingBottom: 3, overflow: "hidden" }}>
                                <Typography.Text>{data.title as string}</Typography.Text>
                                <ToolButton icon={<CloseOutlined />} onClick={() => cancelCollab(data)} />
                            </Flex>
                        </Link>
                    }} />
            </div>
        }

        {contextHolder}
    </Flex>
}

export default NoteTree;