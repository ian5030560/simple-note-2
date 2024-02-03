import React from "react";

export type Plugin<T = {}> = Exclude<React.FC<T>, undefined>;