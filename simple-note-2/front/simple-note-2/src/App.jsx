import React from "react"
import Editor from "./editor/editor"
// import Tree from './tree/tree'

export default function App() {
    return (<>
        <Editor initlizeData={[{time: new Date().getTime(), blocks: []}]} />
    </>)
}