import React from "react";

const UnorderedList = ({children}) => {
    const style = {
        width: "100%",
        // paddingLeft: "10px",
    }

    return <ul style={style}>{children}</ul>
}

const OrderedList = ({children}) => {
    const style = {
        width: "100%",
        // paddingLeft: "10px"
    }

    return <ol style={style}>{children}</ol>
}

const ListItem = ({attributes, element, children}) => {

    const style = {
        width: "100%",
        textAlign: element.align ? element.align: "start",
    }
    return <li style={style} {...attributes}>{children}</li>
}

const List = {
    Unordered: UnorderedList,
    Ordered: OrderedList,
    Item: ListItem
}

export default List;