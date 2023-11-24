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
            }
        }
    }
}

const userTheme = (dark) => {

    const dt = defaultTheme(dark);

    return {
        token: {
            ...dt.token,
        },
        components: {
            Menu: {
                ...dt.components.Menu,
                // itemBorderRadius: 8
            }
        }
    }
}

export default defaultTheme
export {userTheme}