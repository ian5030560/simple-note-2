import React from "react";

type Null<T> = (prop: T) => null
export type Plugin<T = {}> = React.FC<T> | Null<T>;