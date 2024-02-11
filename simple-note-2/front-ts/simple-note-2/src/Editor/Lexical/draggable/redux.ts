import { PayloadAction, configureStore, createSlice } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

type position = {top: number, left: number};
interface DndDataType {
    dragId: string | undefined,
    element: position,
    line: position,
}
const initialState: DndDataType = {
    dragId: undefined,
    element: { top: -10000, left: -10000 },
    line: { top: -10000, left: -10000 },
};

const RESET = -10000;
export const dndSlice = createSlice({
    name: "dnd",
    initialState: initialState,
    reducers: {
        setId: (state, action: PayloadAction<string | undefined>) => { state.dragId = action.payload },
        moveElement: (state, action: PayloadAction<position>) => { state.element = action.payload },
        moveLine: (state, action: PayloadAction<position>) => { state.line = action.payload },
        resetElement: (state) => {state.element = {top: RESET, left: RESET}},
        resetLine: (state) => {state.line = {top: RESET, left: RESET}}
    }
})

export const { setId, moveElement, moveLine, resetElement, resetLine } = dndSlice.actions;

export const dndStore = configureStore({
    reducer: {
        dnd: dndSlice.reducer,
    }
})

export type DndState = ReturnType<typeof dndStore.getState>;
export type DndDispatch = typeof dndStore.dispatch;
export const useDndDispatch: () => DndDispatch = useDispatch;
export const useDndSelector: TypedUseSelectorHook<DndState> = useSelector;