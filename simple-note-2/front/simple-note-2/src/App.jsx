import React from "react"
import Editor from "./editor/editor"
import Tree from './tree/tree'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

export default function App() {
    return (<BrowserRouter>
        <Routes>
            <Route index element={<Editor initlizeData={[]}/>} />
            <Route path='tree' element={<Tree defaultData={[]}/>} />
        </Routes>
    </BrowserRouter>)
}