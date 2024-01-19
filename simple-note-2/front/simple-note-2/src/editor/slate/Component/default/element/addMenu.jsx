import React, { useCallback, useState, useRef } from "react";
import { Input, List, Flex, Button, Popover, theme, InputRef } from "antd";

/**
 * 
 * @param {{searchList: Array, 
 * children: React.ReactNode, 
 * onSelect: (value: string) => void
 * open: boolean
 * onLeave: (e: Event) => any}} param0 
 * @returns 
 */
const AddMenu = ({ searchList, children, onSelect, open, onLeave }) => {

    const [keyword, setKeyword] = useState(/.*/);
    const { token } = theme.useToken();
    /**
     * @type {React.MutableRefObject<InputRef>}
     */
    const ref = useRef();

    const filterData = useCallback((s) => keyword.test(s), [keyword]);

    const handleChange = useCallback(e => {
        const text = e.target.value;
        setKeyword(() => new RegExp(`${text}`));
    }, []);

    const handleClick = useCallback((item) => {
        const result = item.handler?.(item.value);
        onSelect?.(item.value, result);
    }, [onSelect]);

    searchList = searchList.filter(value => filterData(value.label));

    const content = <Flex vertical onPointerLeave={onLeave}> 
        <Input ref={ref}
            onChange={handleChange}
            style={{ border: `1px solid ${token.colorPrimary}` }} />
        <List
            dataSource={searchList}
            style={{ maxHeight: "250px", overflow: "auto" }}
            renderItem={(item) => {
                
                return <List.Item key={item.value} style={{ padding: "0px" }}>
                    <Button
                        type="text"
                        style={{ width: "100%" }}
                        onClick={() => handleClick(item)}
                    >{item.label}</Button>
                </List.Item>
            }} />
    </Flex>

    // 直接 focus <input> 有問題，無法觸發 Button onClick
    return <Popover content={content} trigger={"click"}
        arrow={false} open={open}>
        {children}
    </Popover>
}

export default AddMenu;