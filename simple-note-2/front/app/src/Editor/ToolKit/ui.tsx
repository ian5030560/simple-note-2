import { Button, ButtonProps } from "antd"
import { forwardRef } from "react";

export type ToolKitButtonProp = Omit<ButtonProps, "size" | "type">;
export const ToolKitButton = forwardRef((prop: ToolKitButtonProp, ref: React.LegacyRef<HTMLButtonElement | HTMLAnchorElement>) => {
    return <Button size="large" type="text" {...prop} ref={ref}/>
})