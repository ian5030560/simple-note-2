import getRandomString from "../../../util/random";
import { Element } from "slate";

export function getId() {
    return getRandomString(10);
}

export const assignIdRecursively = (node) => {
    if (Element.isElement(node)) {
        node.id = getId();
        node.children.forEach(assignIdRecursively);
    }
};

export const withId = (editor) => {
    const { apply } = editor;

    editor.apply = (operation) => {
        if (operation.type === "insert_node") {
            assignIdRecursively(operation.node);
            return apply(operation);
        }

        if (operation.type === "split_node") {
            operation.properties.id = getId();
            return apply(operation);
        }

        return apply(operation);
    };

    return editor;
};