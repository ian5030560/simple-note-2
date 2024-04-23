import { useEffect, useMemo, useState } from "react";

type Comment = {
    author: string,
    content: string,
    id: string,
    timestamp: number,
};
type Item = {
    title: string,
    comments: Comment[]
}
type Collection = Map<string, Item>;
type ItemData = [string, Item];
class Store{
    private _collection: Collection;
    
    constructor(comments?: Array<ItemData>){
        this._collection = new Map(comments) || new Map();
    }

    createItem(id: string, title: string){
        this._collection.set(id, {
            title: title,
            comments: [],
        });

        return this._collection.get(id)!;
    }

    getItem(id: string){
        return this._collection.get(id);
    }

    deleteItem(id: string){
        return this._collection.delete(id);
    }

    public get collection() {
        return this._collection;
    }
}

export default function useStore(comments: Array<ItemData>){
    const [store] = useState(new Store(comments));
    return store;
}