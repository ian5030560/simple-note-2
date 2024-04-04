import { useMemo } from "react";
import getRandomString from "../../../util/random";

type Comment = {
    author: string,
    content: string,
    id: string,
    timestamp: number,
};
type Collection = Map<string, Comment[]>;
type CommentData = [string, Array<Comment>];
class Store{
    
    private _collection: Collection;
    
    constructor(comments?: Array<CommentData>){
        this._collection = new Map(comments) || new Map();
    }

    add(comment: Comment, collectionID?: string){
        let id = collectionID || this.randomCollectionID();
        let arr = this._collection.get(id) || [];
        arr.push(comment);
        this._collection.set(id, arr);
    }

    update(commentID: string, content: string, collectionID: string){
        let arr = this._collection.get(collectionID);
        if(!arr) return;

        for(let comment of arr){
            if(comment.id === commentID){
                comment.content = content;
                this._collection.set(collectionID, arr);
                break;
            }
        }
    }

    delete(commentID: string, collectionID: string){
        let arr = this._collection.get(collectionID);
        if(!arr) return;

        for(let comment of arr){
            if(comment.id === commentID){
                arr.splice(arr.indexOf(comment), 1);
                break;
            }
        }
    }

    private randomCollectionID(){
        return getRandomString(10);
    }

    getCollection(){
        return this._collection;
    }
}

export default function useStore(comments: Array<CommentData>){
    return useMemo(() => new Store(comments), [comments]);
}