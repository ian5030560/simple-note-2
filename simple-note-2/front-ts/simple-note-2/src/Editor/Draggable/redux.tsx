import { PayloadAction, configureStore, createSlice } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

interface DndDataType {
    isDragging: boolean;
    dragId: string | undefined,
    element: { x: number, y: number },
    line: { x: number, y: number, width: number, height: number },
}
const DEFAULT = -10000;
const initialState: DndDataType = {
    isDragging: false,
    dragId: undefined,
    element: { x: DEFAULT, y: DEFAULT },
    line: { x: DEFAULT, y: DEFAULT, width: 0, height: 0 },
};

const slice = createSlice({
    name: "dnd",
    initialState: initialState,
    reducers: {
        setDraggable: (state, action: PayloadAction<boolean>) => { state.isDragging = action.payload },
        setId: (state, action: PayloadAction<string | undefined>) => { state.dragId = action.payload },
        moveElement: (state, action: PayloadAction<{ x: number, y: number }>) => { state.element = action.payload },
        resizeLine: (state, action: PayloadAction<{ width: number, height: number }>) => { state.line.width = action.payload.width; state.line.height = action.payload.height },
        moveLine: (state, action: PayloadAction<{ x: number, y: number }>) => { state.line.x = action.payload.x; state.line.y = action.payload.y; },
        resetElement: (state) => { state.element = { x: DEFAULT, y: DEFAULT } },
        resetLine: (state) => { state.line = { x: DEFAULT, y: DEFAULT, width: 0, height: 0 } }
    }
})

const { setId, moveElement, resizeLine, resetElement, resetLine, moveLine, setDraggable } = slice.actions;

const store = configureStore({
    reducer: {
        dnd: slice.reducer,
    }
})

type DndState = ReturnType<typeof store.getState>;
type DndDispatch = typeof store.dispatch;
export const useDndAction = () => {
    const dispatch = useDispatch<DndDispatch>();
    return useMemo(() => ({
        setId: (id: string | undefined) => dispatch(setId(id)),
        moveElement: (x: number, y: number) => dispatch(moveElement({ x, y })),
        moveLine: (x: number, y: number) => dispatch(moveLine({ x, y })),
        resizeLine: (width: number, height: number) => dispatch(resizeLine({ width, height })),
        resetElement: () => dispatch(resetElement()),
        resetLine: () => dispatch(resetLine()),
        setDraggable: (val: boolean) => dispatch(setDraggable(val)),
    }), [dispatch])
}

const useDndSelector: TypedUseSelectorHook<DndState> = useSelector;
export const useDndState = () => {

    const element = useDndSelector(state => state.dnd.element);
    const dragId = useDndSelector(state => state.dnd.dragId);
    const line = useDndSelector(state => state.dnd.line);
    const isDragging = useDndSelector(state => state.dnd.isDragging);

    return useMemo(() => ({ element, dragId, line, isDragging }), [dragId, element, isDragging, line]);
}

export const DndProvider = ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;