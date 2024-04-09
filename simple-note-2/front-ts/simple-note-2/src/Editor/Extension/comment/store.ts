import { useMemo } from "react";
import getRandomString from "../../../util/random";

type Comment = {
    author: string,
    content: string,
    id: string,
    timestamp: number,
};
type Item = [string, Comment[]]
type Collection = Map<string, Comment[]>;
class Store{    
    private _collection: Collection;
    
    constructor(comments?: Array<Item>){
        this._collection = new Map(comments) || new Map();
    }

    createItem(): Comment[] | undefined{
        let id = this.getItemId();
        this._collection.set(id, []);
        return this.getItem(id);
    }

    getItem(id: string): Comment[] | undefined{
        return this._collection.get(id);
    }

    deleteItem(id: string): boolean{
        return this._collection.delete(id);
    }

    private getItemId(): string{
        return getRandomString(10);
    }
}

export default function useStore(comments: Array<Item>){
    return useMemo(() => new Store(comments), [comments]);
}