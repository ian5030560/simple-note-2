import React, { useCallback, useState } from "react";
import { Input, List, Flex, Button, Popover, theme } from "antd";

/**
 * 
 * @param {{searchList: Array, 
 * children: React.ReactNode, 
 * onSelect: (key: string) => void
 * open: boolean
 * onLeave: (e: Event) => any}} param0 
 * @returns 
 */
const AddMenu = ({ searchList, children, onSelect, open, onLeave}) => {

    const [keyword, setKeyword] = useState(/.*/);
    const { token } = theme.useToken();

    const filterData = useCallback((s) => keyword.test(s), [keyword]);

    const handleChange = useCallback(e => {
        const text = e.target.value;
        setKeyword(() => new RegExp(`${text}`));
    }, []);

    searchList = searchList.filter(value => filterData(value.label));

    const content = <Flex vertical onMouseLeave={onLeave}>
        <Input onChange={handleChange} style={{ border: `1px solid ${token.colorPrimary}` }} />
        <List
            dataSource={searchList}
            style={{ maxHeight: "250px", overflow: "auto" }}
            renderItem={(item) => {
                return <List.Item key={item.value} style={{ padding: "0px" }}>
                    <Button
                        type="text"
                        style={{ width: "100%" }}
                        onClick={() => onSelect?.(item.value)}
                    >{item.label}</Button>
                </List.Item>
            }} />
    </Flex>

    return <Popover content={content} trigger={"click"} arrow={false} open={open}>
        {children}
    </Popover>
}

export default AddMenu;