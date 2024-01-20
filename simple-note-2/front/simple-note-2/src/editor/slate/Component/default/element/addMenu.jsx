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

    const handleMouseDown = useCallback((item) => {
        const result = item.handler?.(item.value);
        onSelect?.(item.value, result);
    }, [onSelect]);

    searchList = searchList.filter(value => filterData(value.label));

    const content = <Flex vertical onBlur={onLeave}> 
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
                        onMouseDown={() => handleMouseDown(item)}
                    >{item.label}</Button>
                </List.Item>
            }} />
    </Flex>

    return <Popover content={content} trigger={"click"}
        arrow={false} open={open}
        afterOpenChange={() => ref.current.focus()}>
        {children}
    </Popover>
}

export default AddMenu;