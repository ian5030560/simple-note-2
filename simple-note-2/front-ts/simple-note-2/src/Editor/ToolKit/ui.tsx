import { Button, ButtonProps } from "antd"

export type ToolKitButtonProp = Omit<ButtonProps, "size" | "type">;
export const ToolKitButton = (prop: ToolKitButtonProp) => {
    return <Button size="large" type="text" {...prop}/>
}