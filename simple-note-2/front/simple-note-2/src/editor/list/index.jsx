import React from "react";

const UnorderedList = ({children}) => {
    const style = {
        width: "100%",
    }

    return <ul style={style}>{children}</ul>
}

const OrderedList = ({children}) => {
    const style = {
        width: "100%",
    }

    return <ol style={style}>{children}</ol>
}

const ListItem = ({children}) => {
    return <li>{children}</li>
}

const List = {
    Unordered: UnorderedList,
    Ordered: OrderedList,
    Item: ListItem
}

export default List;