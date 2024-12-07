import { CloseOutlined } from "@ant-design/icons";
import { Button, ButtonProps } from "antd";

type CloseButtonProps = Omit<ButtonProps, "type" | "danger" | "icon" | "size">;
export function CloseButton(props: CloseButtonProps) {
    return <Button type="text" danger icon={<CloseOutlined />} size="small" {...props} />
}