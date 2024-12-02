import { useEffect } from "react";

export function usePageTitle(title: string){
    useEffect(() => {
        document.title = title;
    }, [title]);
}
export default function withPageTitle<P extends {} = {}>(componentType: React.ComponentType<P>, title: string){
    const ComponentTag = componentType;

    const ComponentWithTitle = (props: P) => {
        usePageTitle(title);
        return <ComponentTag {...props}/>
    }

    return ComponentWithTitle;
}