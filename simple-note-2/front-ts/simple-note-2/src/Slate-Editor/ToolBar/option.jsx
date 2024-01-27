import {
    Button,
    Flex
} from "antd";

const OptionGroup = ({ options, vertical, onClick, onSelect }) => {

    return <Flex vertical={vertical} gap={"small"}>
        {
            options.map(option => {

                return <Button
                    key={option.key}
                    type={onSelect?.(option.key) ? "primary" : "text"}
                    icon={option.icon}
                    style={option.style}
                    onClick={() => onClick?.(option.key)}>
                    {option.label}
                </Button>
            })
        }
    </Flex>
}

export default OptionGroup;