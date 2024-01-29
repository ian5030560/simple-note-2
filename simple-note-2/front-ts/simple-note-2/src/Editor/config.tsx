import { InitialConfigType } from '@lexical/react/LexicalComposer';
import theme from "./theme";
import NODES from './nodes';

function onError(error: Error) {
    console.error(error);
}

const config: InitialConfigType = {
    namespace: 'Editor',
    theme: theme,
    onError,
    nodes: NODES
};

export default config;