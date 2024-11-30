import { useEffect } from "react";

export default function withPageTitle<P extends {} = {}>(componentType: React.ComponentType<P>, title: string){
    const ComponentTag = componentType;

    const ComponentWithTitle = (props: P) => {
        useEffect(() => {
            document.title = title;
        }, []);

        return <ComponentTag {...props}/>
    }

    return ComponentWithTitle;
}