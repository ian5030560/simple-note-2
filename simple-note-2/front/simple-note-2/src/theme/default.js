const defaultTheme = (dark) => {
    return {
        token: {
            colorPrimary: "#8696A7",
            colorBgBase: dark ? "#3C3C3C" : "#FFFCEC"
        },
        components: {
            Menu: {
                itemBg: "#8696A7",
                itemColor: "#FFFFFF",
                itemHoverColor: "#FFFFFF",
                horizontalItemSelectedColor: "#FFFFFF",
            },

            Tree: {
                nodeSelectedBg: "#FFFFFF"
            }
        }
    }
}

export default defaultTheme