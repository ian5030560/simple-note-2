const FontColor = ({leaf, children}) => {
    return <span style={{color: leaf.color ? leaf.color: "black"}}>{children}</span>
}

const BackgroundColor = ({leaf, children}) => {
    return <span style={{backgroundColor: leaf.bgColor ? leaf.bgColor: "transparent"}}>{children}</span>
}

const COLOR = {
    color: FontColor,
    bgColor: BackgroundColor
}

export default COLOR;