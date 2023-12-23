import React from "react";

const UnorderedList = ({children}) => {
    const style = {
        width: "100%",
    }

    return <ul style={style}><li>{children}</li></ul>
}

const OrderedList = ({element, children}) => {
    const style = {
        width: "100%",
    }

    return <ol start={element.index} style={style}><li>{children}</li></ol>
}

const List = {
    Unordered: UnorderedList,
    Ordered: OrderedList,
}

export default List;