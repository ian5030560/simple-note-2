import createLeaf from "../../spec/leaf"

const FontColor = ({leaf, children}) => {
    return <span style={{color: leaf.color ? leaf.color: "black"}}>{children}</span>
}

const BackgroundColor = ({leaf, children}) => {
    return <span style={{backgroundColor: leaf.bgColor ? leaf.bgColor: "transparent"}}>{children}</span>
}

export const color = createLeaf(FontColor);
export const bgColor = createLeaf(BackgroundColor);